import { NextResponse } from 'next/server';
import groqClient, { GROQ_MODEL, GROQ_MAX_TOKENS } from '@/lib/groq';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      templateType,
      fullName, 
      email, 
      phone, 
      location, 
      summary, 
      education, 
      experience, 
      skills, 
      projects, 
      certifications 
    } = data;

    if (!templateType || !fullName) {
      return NextResponse.json({ error: 'Template Type and Full Name are required.' }, { status: 400 });
    }

    const prompt = `You are an expert resume writer. Generate a professional first-draft resume in plain text format based on the user's provided information.
The target template structure is "${templateType}".

User Information:
Name: ${fullName}
Email: ${email || 'N/A'}
Phone: ${phone || 'N/A'}
Location: ${location || 'N/A'}

Summary/Objective:
${summary || 'N/A'}

Education:
${education || 'N/A'}

Experience:
${experience || 'N/A'}

Skills:
${skills || 'N/A'}

Projects:
${projects || 'N/A'}

Certifications:
${certifications || 'N/A'}

Instructions:
1. Output ONLY the resume text. Do not include introductory or concluding remarks.
2. Structure the resume professionally, using clean text-based formatting (e.g., ALL CAPS for sections, dashes for bullet points).
3. If an input field is 'N/A' or empty, omit that section entirely, unless the template requires it to be filled with placeholder text.
4. Flesh out bullet points slightly if the user provided very brief notes, but keep it grounded in their inputs.
5. Emphasize aspects relevant to a "${templateType}" resume (e.g., Tech should focus on skills/projects, Executive on leadership/impact).`;

    const completion = await groqClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      max_tokens: GROQ_MAX_TOKENS,
      temperature: 0.7,
    });

    const generatedResume = completion.choices[0]?.message?.content || '';

    if (!generatedResume.trim()) {
      throw new Error("AI returned empty response");
    }

    return NextResponse.json({ resume: generatedResume.trim() });
  } catch (error: any) {
    console.error("Resume Generation Error:", error);
    return NextResponse.json({ error: 'An unexpected error occurred during generation.' }, { status: 500 });
  }
}
