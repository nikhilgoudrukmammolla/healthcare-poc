"use client"

import { useState } from "react"
import { TranscriptPanel } from "./transcript-panel"
import { VoiceRecorder } from "./voice-recorder"
import { AudioPlayback } from "./audio-playback"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { code: "en-US", name: "English", flag: "🇺🇸" },
  { code: "es-ES", name: "Spanish", flag: "🇪🇸" },
  { code: "fr-FR", name: "French", flag: "🇫🇷" },
  { code: "de-DE", name: "German", flag: "🇩🇪" },
  { code: "it-IT", name: "Italian", flag: "🇮🇹" },
  { code: "pt-BR", name: "Portuguese", flag: "🇧🇷" },
  { code: "ja-JP", name: "Japanese", flag: "🇯🇵" },
  { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "ko-KR", name: "Korean", flag: "🇰🇷" },
  { code: "ru-RU", name: "Russian", flag: "🇷🇺" },
  { code: "ar-SA", name: "Arabic", flag: "🇸🇦" },
  { code: "vi-VN", name: "Vietnamese", flag: "🇻🇳" },
  { code: "hi-IN", name: "Hindi", flag: "🇮🇳" },
  {code: "te-IN", name: "Telugu", flag: "🇮🇳"},
  {code: "ta-IN", name: "Tamil", flag: "🇮🇳"},
]

const LANGUAGE_MAP: Record<string, string> = {
  "en-US": "en",
  "es-ES": "es",
  "fr-FR": "fr",
  "de-DE": "de",
  "it-IT": "it",
  "pt-BR": "pt",
  "ja-JP": "ja",
  "zh-CN": "zh",
  "ko-KR": "ko",
  "ru-RU": "ru",
  "ar-SA": "ar",
  "vi-VN": "vi",
}

export function TranslationUI() {
  const [originalTranscript, setOriginalTranscript] = useState("")
  const [detectedLanguage, setDetectedLanguage] = useState("en")
  const [translatedText, setTranslatedText] = useState("")
  const [outputLanguage, setOutputLanguage] = useState("es-ES")
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranscript = (text: string, language: string) => {
    setOriginalTranscript(text)
    setDetectedLanguage(language)
    setTranslatedText("")
  }

  const handleGenerateTranslation = async () => {
    if (!originalTranscript.trim()) {
      return
    }

    setIsTranslating(true)
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: originalTranscript,
          sourceLanguage: detectedLanguage,
          targetLanguage: outputLanguage,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTranslatedText(data.translatedText)
      }
    } catch (error) {
      console.error("Translation error:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-background to-muted/50 ">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10 max-w-7xl">


        {/* Main Content */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Left Panel: Voice Recording */}
          <div className="space-y-4 sm:space-y-6">
            <VoiceRecorder
              onTranscript={handleTranscript}
              onTranslation={setTranslatedText}
              outputLanguage={outputLanguage}
            />

            <TranscriptPanel title="Original Transcript" content={originalTranscript} language={detectedLanguage} />
          </div>

          {/* Right Panel: Translation Output */}
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-lg border border-border bg-card p-4 sm:p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Translated Text</h2>
                <Select value={outputLanguage} onValueChange={setOutputLanguage}>
                  <SelectTrigger className="w-32 sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          {lang.flag} {lang.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>



              <div className="min-h-32 sm:min-h-40 space-y-4">
                <div className="rounded-md bg-muted p-3 sm:p-4 text-muted-foreground text-sm sm:text-base">
                  {translatedText || (
                    <span className="text-xs sm:text-sm italic opacity-70">Translation will appear here...</span>
                  )}
                </div>
                <div className="mt-2 flex justify-between">
                              {originalTranscript && (
                <div className="mb-4">
                  <Button
                    onClick={handleGenerateTranslation}
                    disabled={isTranslating || !originalTranscript.trim()}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      "Generate Translation"
                    )}
                  </Button>
                </div>
              )}
              <AudioPlayback text={translatedText} language={outputLanguage} />
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
