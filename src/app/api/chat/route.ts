import { NextResponse } from 'next/server';
import groqClient from '@/lib/ai/groq';

const SYSTEM_PROMPT = `You are a helpful, professional Resume and Career AI Assistant.
Your capabilities include:
- Resume guidance and formatting
- ATS optimization advice
- Career coaching and progression
- Interview preparation and tips
- Skill recommendations
- Project suggestions

Rules:
1. Never fabricate user experience or create fake qualifications.
2. Keep responses concise, practical, and action-oriented.
3. Stay focused on careers, resumes, and professional development. If a user asks about an unrelated topic, politely guide them back to career-related subjects.
4. Maintain a supportive, encouraging, and professional tone.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Support either a single message string or an array of messages for history
    const { message, messages: historyMessages } = body;
    
    if (!message && (!historyMessages || historyMessages.length === 0)) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build the messages array for Groq
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    if (historyMessages && Array.isArray(historyMessages)) {
      // If client sends full history including the new message
      messages.push(...historyMessages);
    } else {
      // If client just sends a single message
      messages.push({ role: 'user', content: message });
    }

    const completion = await groqClient.chat.completions.create({
      messages: messages as any,
      model: 'openai/gpt-oss-120b', // Explicitly requested model
    });

    const responseContent = completion.choices[0]?.message?.content || 'I encountered an error generating a response.';

    // The output format requested is { response: string }
    return NextResponse.json({ response: responseContent });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}
