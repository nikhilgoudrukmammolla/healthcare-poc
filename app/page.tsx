"use client"
import { TranslationUI } from "@/components/translation-ui"
import { Zap } from "lucide-react"

export default function Home() {
  return (
    <>
        <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/40 overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <div className="relative border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">Healthcare Translation AI</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground">Healthcare Translation Web App with Generative AI</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          <TranslationUI />
    </main>

    </>
  )
}
