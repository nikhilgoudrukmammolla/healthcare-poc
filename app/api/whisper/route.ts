import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

import { experimental_transcribe as transcribe } from "ai";
// import { azure } from "@ai-sdk/azure";
// import { createAzure } from "@ai-sdk/azure";
import fs from "fs";
// import { groq } from '@ai-sdk/groq';
import { createGroq } from "@ai-sdk/groq";
import { readFile } from 'fs/promises';
dotenv.config();

// const azure = createAzure({
//   resourceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME as string,
//   apiKey: process.env.AZURE_OPENAI_API_KEY as string,
//     useDeploymentBasedUrls: true,
//   apiVersion: '2025-04-01-preview',
// });
console.log("✅ Groq model loaded",process.env.GROK_API_KEY);

const groq = createGroq({
  apiKey: process.env.GROK_API_KEY as string,
});


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob;

    if (!audio) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert Blob to Buffer
    const arrayBuffer = await audio.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


const result = await transcribe({
  model: groq.transcription('whisper-large-v3'),
  audio: buffer,
  providerOptions: { groq: { translate: false } },
});
    // Whisper azureeee transcription
    // const result = await transcribe({
    //   model: azure.transcription("whisper-1"),
    //   audio: buffer,
    //   providerOptions: {
    //     openai: {
    //       // Explicit language or auto-detect
    //       language: "en", 
    //     },
    //   },
    // });
    console.log("Transcription result:", result, result.language);
       const raw = result.responses?.[0];

    console.log("Detected Language:", raw);
  

    return NextResponse.json({
      text: result.text,

      language: result.language || "unknown",
    });
  } catch (error) {
    console.error("Azure transcription error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const audio = formData.get("audio") as Blob;

//     if (!audio) {
//       return NextResponse.json(
//         { error: "No audio file provided" },
//         { status: 400 }
//       );
//     }

//     // Convert Blob → Buffer → File
//     const arrayBuffer = await audio.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const file = new File([buffer], "audio.webm", {
//       type: audio.type || "audio/webm",
//     });

//     const openai = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     const stream = await openai.audio.transcriptions.create({
//       file,
//       model: "gpt-4o-mini-transcribe",
//       response_format: "text",
//       stream: true,
//     });

//     for await (const event of stream) {
//       console.log(event);
//     }

//     return NextResponse.json({
//       text: "Transcription result here",
//       language: "en",
//     });
//   } catch (error) {
//     console.error("Azure transcription error:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
