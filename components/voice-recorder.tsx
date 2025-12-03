"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, RotateCcw, Loader2 } from "lucide-react"

interface VoiceRecorderProps {
  onTranscript: (text: string, language: string) => void
  onTranslation: (text: string) => void
  outputLanguage: string
}

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ja: "Japanese",
  zh: "Chinese",
  ko: "Korean",
  ru: "Russian",
  ar: "Arabic",
  vi: "Vietnamese",
  hi: "Hindi",
  te: "Telugu",
  ta: "Tamil",
}

export function VoiceRecorder({ onTranscript, onTranslation, outputLanguage }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [detectedLanguage, setDetectedLanguage] = useState<string>("en")
  const [transcript, setTranscript] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording && recordingTime >= 10) {
      handleStopRecording()
    }
  }, [recordingTime, isRecording])

  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [isRecording])

  const handleStartRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        await transcribeAudio()
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      setTranscript("")
      onTranslation("")
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.")
      console.error("Microphone error:", err)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const transcribeAudio = async () => {
    if (audioChunksRef.current.length === 0) {
      setError("No audio recorded.")
      return
    }

    setIsTranscribing(true)
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
      const formData = new FormData()
      formData.append("audio", audioBlob)

      const response = await fetch("/api/whisper", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Transcription failed")
      }

      const data = await response.json()
      setTranscript(data.text)
      setDetectedLanguage(data.language || "en")
      onTranscript(data.text, data.language || "en")
    } catch (err) {
      setError("Failed to transcribe audio. Please try again.")
      console.error("Transcription error:", err)
    } finally {
      setIsTranscribing(false)
    }
  }

  const handleReset = () => {
    setTranscript("")
    setDetectedLanguage("en")
    setRecordingTime(0)
    setError(null)
    onTranscript("", "en")
    onTranslation("")
  }

  const formatTime = (seconds: number) => {
    return `${seconds.toString().padStart(2, "0")}s`
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Voice Recording</h2>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Listening in: <span className="font-medium">{LANGUAGE_MAP[detectedLanguage]}</span>
        </p>
      </div>

      {isRecording && (
        <div className="mb-6 rounded-md bg-accent/10 p-3 sm:p-4 border border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 sm:h-3 sm:w-3 animate-pulse rounded-full bg-accent"></div>
              <span className="font-medium text-sm sm:text-base text-foreground">Recording...</span>
            </div>
            <span className="font-mono text-sm sm:text-base font-semibold text-accent">
              {formatTime(recordingTime)}/10s
            </span>
          </div>
        </div>
      )}

      {/* Recording Status */}
      <div className="mb-6 rounded-md bg-muted p-3 sm:p-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          {isTranscribing && (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-accent" />
              <span className="font-medium text-muted-foreground">Transcribing...</span>
            </div>
          )}
          {!isRecording && !isTranscribing && !transcript && (
            <span className="text-muted-foreground">Ready to record. Click the microphone button to start.</span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-md bg-destructive/10 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          onClick={handleStartRecording}
          disabled={isRecording || isTranscribing}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 h-10 sm:h-11 text-sm sm:text-base"
          size="lg"
        >
          <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline">Start</span>
          <span className="inline xs:hidden">Record</span>
        </Button>

        <Button
          onClick={handleStopRecording}
          disabled={!isRecording || isTranscribing}
          variant="outline"
          size="lg"
          className="flex items-center justify-center gap-2 h-10 sm:h-11 text-sm sm:text-base bg-transparent"
        >
          <Square className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline">Stop</span>
        </Button>

        <Button
          onClick={handleReset}
          disabled={isRecording || isTranscribing}
          variant="ghost"
          size="lg"
          className="flex items-center justify-center gap-2 h-10 sm:h-11 text-sm sm:text-base"
        >
          <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden xs:inline">Clear</span>
        </Button>
      </div>
    </div>
  )
}
