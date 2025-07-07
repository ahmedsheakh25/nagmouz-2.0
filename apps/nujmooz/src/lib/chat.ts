import OpenAI from "openai";
import { Message, ChatRole } from "@/types";

interface ChatResponse {
  message: string;
  error?: string;
}

export class ChatService {
  private openai: OpenAI;
  private context: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this.context = `You are Nujmooz, a creative AI assistant for a Gulf-based studio.
    You help clients with branding, web design, content, and marketing projects.
    You communicate in both English and Arabic, with a friendly Gulf dialect tone.
    Your goal is to understand client needs and guide them through the creative process.`;
  }

  async getResponse(messages: Message[]): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: this.context },
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error getting chat response:", error);
      throw error;
    }
  }

  async generateBrief(answers: Record<string, any>): Promise<string> {
    try {
      const prompt = `Based on the following project requirements, create a detailed creative brief:
      ${JSON.stringify(answers, null, 2)}
      
      Include:
      1. Project Overview
      2. Target Audience
      3. Key Objectives
      4. Deliverables
      5. Timeline
      6. Budget Range
      7. Success Metrics`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: this.context },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      return response.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("Error generating brief:", error);
      throw error;
    }
  }

  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: this.context },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return {
        message: response.choices[0]?.message?.content || "",
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return {
        message: "",
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  }
}
