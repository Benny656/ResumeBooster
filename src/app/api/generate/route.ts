import { NextResponse } from 'next/server';
import groqClient from '@/lib/ai/groq';
import { GROQ_MODEL, GROQ_MAX_TOKENS } from '@/config/ai';

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

    const systemPrompt = `You are an expert resume writer.

Rules:
* Create professional resumes.
* Improve wording and structure.
* Never fabricate companies.
* Never fabricate experience.
* Never fabricate certifications.
* Never fabricate achievements.
* Use only information provided by the user.
* Output only the final resume.
* Output ONLY the resume text. Do not include introductory or concluding remarks.
* Structure the resume professionally, using clean text-based formatting (e.g., ALL CAPS for sections, dashes for bullet points).
* If an input field is 'N/A' or empty, omit that section entirely, unless the template requires it to be filled with placeholder text.
* Flesh out bullet points slightly if the user provided very brief notes, but keep it grounded in their inputs.
* Emphasize aspects relevant to a "${templateType}" resume (e.g., Tech should focus on skills/projects, Executive on leadership/impact).`;

    const userPrompt = `The target template structure is "${templateType}".

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
${certifications || 'N/A'}`;

    const completion = await groqClient.chat.completions.create({
      messages: [
        // Role separation is used to clearly distinguish global instructions (system) from actual user data
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: GROQ_MODEL,
      max_tokens: GROQ_MAX_TOKENS,
      // Generation uses higher temperature (0.7) to allow for more creative phrasing and prose when writing the resume
      temperature: 0.7,
    });

    const generatedResume = completion.choices[0]?.message?.content || '';

    if (!generatedResume.trim()) {
      throw new Error("AI returned empty response");
    }

    return NextResponse.json({ resume: generatedResume.trim() });
  } catch (error: any) {
    console.error('[/api/generate POST] Error:', error);
    const msg = error?.message ?? '';
    const isRateLimit = msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('429');
    return NextResponse.json(
      { error: isRateLimit
          ? 'Our AI service is currently busy. Please wait a moment and try again.'
          : 'An unexpected error occurred during generation.' },
      { status: isRateLimit ? 429 : 500 }
    );
  }
}
