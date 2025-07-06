import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { message, sessionId, userId } = await request.json();

    if (!message || !sessionId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save user message to database
    await supabase.from('messages').insert({
      session_id: sessionId,
      user_id: userId,
      content: message,
      role: 'user',
    });

    // Get chat history
    const { data: history } = await supabase
      .from('messages')
      .select('content, role')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    // Format messages for GPT
    const messages = history?.map(msg => ({
      role: msg.role,
      content: msg.content,
    })) || [];

    // Get response from GPT-4
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `You are Nujmooz, a creative assistant for a Gulf region studio. 
          You help clients with their creative project needs.
          Be professional but friendly, and always ask clarifying questions.
          Communicate in a way that's clear and accessible.
          If the project requirements are clear, create a structured brief.`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error('No response from GPT');
    }

    // Save assistant response to database
    await supabase.from('messages').insert({
      session_id: sessionId,
      user_id: userId,
      content: response,
      role: 'assistant',
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
} 