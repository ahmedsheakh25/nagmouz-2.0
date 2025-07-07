import { NextResponse } from "next/server";
import OpenAI from "openai";
import { writeFile } from "fs/promises";
import path from "path";
import os from "os";
import { unlink } from "fs/promises";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // Create a temporary file
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `audio-${Date.now()}.webm`);
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(tempFilePath, buffer);

    // Create transcription using the file path directly
    const response = await openai.audio.transcriptions.create({
      file: await import("fs").then(fs => fs.createReadStream(tempFilePath)),
      model: "whisper-1",
      language: "en",
    });

    // Clean up
    await unlink(tempFilePath).catch(console.error);

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 },
    );
  }
}
