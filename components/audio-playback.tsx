"use client"

import { useTextToSpeech } from "@/hooks/use-text-to-speech"
import { Button } from "@/components/ui/button"
import { Volume2, Square } from "lucide-react"

interface AudioPlaybackProps {
  text: string
  language: string
}

export function AudioPlayback({ text, language }: AudioPlaybackProps) {
  const { isSpeaking, error, speak, stop } = useTextToSpeech()

  const handleSpeak = () => {
    if (isSpeaking) {
      stop()
    } else {
      speak(text, language)
    }
  }

return (
  <div className="space-y-4">
    <Button
      onClick={handleSpeak}
      disabled={!text}
      size="lg"
      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90"
    >
      {isSpeaking ? (
        <>
          <div className="flex gap-1">
            <span className="w-1 h-4 bg-white animate-pulse rounded" />
            <span className="w-1 h-4 bg-white animate-pulse delay-75 rounded" />
            <span className="w-1 h-4 bg-white animate-pulse delay-150 rounded" />
          </div>
          Playing...
        </>
      ) : (
        <>
          <Volume2 className="h-5 w-5" />
          Play Translation
        </>
      )}
    </Button>

    {error && (
      <div className="rounded-md bg-red-100 p-3 text-sm text-red-600 border border-red-300">
        ⚠️ {error}
      </div>
    )}
  </div>
);


}
