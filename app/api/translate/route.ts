import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { createAzure } from "@ai-sdk/azure"
import dotenv from "dotenv"
dotenv.config()
const azure = createAzure({
  resourceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME as string,
  apiKey: process.env.AZURE_OPENAI_API_KEY as string,
    useDeploymentBasedUrls: true,
  apiVersion: '2025-04-01-preview',
});
const aiModel = azure(process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME as string)
const medicalTermsCache: Record<string, string> = {
  "how are you feeling": "Feeling well or in pain",
  "where does it hurt": "Pain location",
  "take this medication": "Medication instruction",
}

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json()

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const languageMap: Record<string, string> = {
      "en-US": "English",
      "es-ES": "Spanish",
      "fr-FR": "French",
      "de-DE": "German",
      "it-IT": "Italian",
      "pt-BR": "Portuguese",
      "ja-JP": "Japanese",
      "zh-CN": "Chinese",
      "ko-KR": "Korean",
      "ru-RU": "Russian",
      "ar-SA": "Arabic",
      "vi-VN": "Vietnamese",
      "hi-IN": "Hindi",
    }

    const sourceLangName = languageMap[sourceLanguage] || sourceLanguage
    const targetLangName = languageMap[targetLanguage] || targetLanguage

    const { text: translatedText } = await generateText({
      model: aiModel,
      system: `You are an expert medical translator specializing in healthcare communication between patients and providers.
      
CRITICAL REQUIREMENTS:
1. MEDICAL ACCURACY: Use only standard medical terminology approved in both source and target languages
2. CLARITY: Translate for clarity and understanding in healthcare context
3. SENSITIVITY: Maintain professional tone appropriate for healthcare settings
4. PRECISION: Never sacrifice accuracy for brevity
5. MEDICAL CONTEXT: If it's a symptom or diagnosis, ensure proper medical terminology

Translate from ${sourceLangName} to ${targetLangName}.

RESPOND ONLY WITH THE TRANSLATED TEXT. NO EXPLANATIONS, NO ADDITIONAL TEXT.`,
      prompt: text,
      temperature: 0.3, // Lower temperature for more accurate medical translations
    })
   console.log("Translation result:", translatedText)
    return NextResponse.json({ translatedText: translatedText.trim() })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json({ error: "Translation service error" }, { status: 500 })
  }
}
