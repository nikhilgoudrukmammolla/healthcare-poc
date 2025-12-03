"use client"

import { useState, useCallback, useRef, useEffect } from "react"

interface SpeechRecognitionState {
  isListening: boolean
  transcript: string
  interimTranscript: string
  error: string | null
}


export function useSpeechRecognition(language = "en-US") {
  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    transcript: "",
    interimTranscript: "",
    error: null,
  })

  const recognitionRef = useRef<any>(null)
  const finalTranscriptRef = useRef("")

  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setState((prev) => ({
        ...prev,
        error: "Speech recognition not supported. Please use Chrome, Edge, or Safari.",
      }))
      return
    }

    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.language = language

    recognitionRef.current.maxAlternatives = 1

    recognitionRef.current.onstart = () => {
      setState((prev) => ({ ...prev, isListening: true, error: null }))
    }

    recognitionRef.current.onresult = (event: any) => {
      let interim = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript + " "
        } else {
          interim += transcript
        }
      }

      setState((prev) => ({
        ...prev,
        transcript: finalTranscriptRef.current.trim(),
        interimTranscript: interim,
      }))
    }

    recognitionRef.current.onerror = (event: any) => {
      let errorMessage = `Speech recognition error: ${event.error}`

      if (event.error === "no-speech") {
        errorMessage = "No speech detected. Please try again."
      } else if (event.error === "network") {
        errorMessage = "Network error. Please check your connection."
      } else if (event.error === "not-allowed") {
        errorMessage = "Microphone access denied. Please allow microphone access."
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }))
    }

    recognitionRef.current.onend = () => {
      setState((prev) => ({ ...prev, isListening: false }))
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [language])

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      finalTranscriptRef.current = ""
      setState((prev) => ({
        ...prev,
        transcript: "",
        interimTranscript: "",
        error: null,
      }))
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: "",
      interimTranscript: "",
      error: null,
    }))
    finalTranscriptRef.current = ""
  }, [])

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  }
}
