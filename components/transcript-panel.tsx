"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface TranscriptPanelProps {
  title: string
  content: string
  language: string
  isInterim?: boolean
}

export function TranscriptPanel({ title, content, language, isInterim = false }: TranscriptPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getLanguageDisplay = (code: string) => {
    const map: Record<string, string> = {
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
    return map[code] || code
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="font-medium">{getLanguageDisplay(language)}</span>
            {content && <span className="ml-2 inline-block">• {content.split(/\s+/).length} words</span>}
          </p>
        </div>
        <Button onClick={handleCopy} disabled={!content} variant="ghost" size="sm" className="h-9 w-9 p-0">
          {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <div className="min-h-32 space-y-3">
        <div className="rounded-md bg-muted p-4">
          <p className="whitespace-pre-wrap break-words text-muted-foreground leading-relaxed">
            {content || (
              <span className="text-sm italic opacity-70">
                {isInterim ? "Listening for audio..." : "Transcript will appear here..."}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
