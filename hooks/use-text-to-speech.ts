"use client"

import { useState, useCallback, useRef } from "react"

interface TextToSpeechState {
  isSpeaking: boolean
  error: string | null
  currentText: string
}

export function useTextToSpeech() {
  const [state, setState] = useState<TextToSpeechState>({
    isSpeaking: false,
    error: null,
    currentText: "",
  })

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const speak = useCallback((text: string, language = "en-US") => {
    if (!text.trim()) return

    if (typeof window === "undefined") {
      setState((prev) => ({
        ...prev,
        error: "Text-to-speech not available",
      }))
      return
    }

    try {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utteranceRef.current = utterance

      utterance.lang = language
      utterance.rate = 0.85 
      utterance.pitch = 1
      utterance.volume = 1

      utterance.onstart = () => {
        setState((prev) => ({
          ...prev,
          isSpeaking: true,
          error: null,
          currentText: text,
        }))
      }

      utterance.onend = () => {
        setState((prev) => ({
          ...prev,
          isSpeaking: false,
          currentText: "",
        }))
      }

      utterance.onerror = (event) => {
        setState((prev) => ({
          ...prev,
          isSpeaking: false,
          error: `Speech synthesis error: ${event.error}`,
          currentText: "",
        }))
      }

      window.speechSynthesis.speak(utterance)
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Text-to-speech failed",
        isSpeaking: false,
      }))
      console.error("TTS error:", error)
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel()
    }
    setState((prev) => ({
      ...prev,
      isSpeaking: false,
      currentText: "",
    }))
  }, [])

  return {
    ...state,
    speak,
    stop,
  }
}
