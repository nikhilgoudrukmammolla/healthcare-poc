"use client"

import { useState, useCallback } from "react"

interface TranslationState {
  originalText: string
  translatedText: string
  isTranslating: boolean
  error: string | null
}

export function useTranslation() {
  const [state, setState] = useState<TranslationState>({
    originalText: "",
    translatedText: "",
    isTranslating: false,
    error: null,
  })

  const translateText = useCallback(async (text: string, sourceLanguage: string, targetLanguage: string) => {
    if (!text.trim()) return

    setState((prev) => ({ ...prev, isTranslating: true, error: null }))

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          sourceLanguage,
          targetLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Translation failed")
      }

      const data = await response.json()

      setState((prev) => ({
        ...prev,
        originalText: text,
        translatedText: data.translatedText,
        isTranslating: false,
      }))

      return data.translatedText
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Translation failed. Please try again.",
        isTranslating: false,
      }))
      console.error("Translation error:", error)
    }
  }, [])

  return {
    ...state,
    translateText,
  }
}
