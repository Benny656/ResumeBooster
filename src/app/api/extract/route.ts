import { NextResponse } from 'next/server';
import { parsePDF } from '@/lib/parsing/pdf';
import { parseDOCX } from '@/lib/parsing/docx';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();
    let text = '';

    if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
      try {
        text = await parsePDF(buffer);
      } catch (err) {
        console.error("PDF Parsing Error:", err);
        return NextResponse.json({ error: 'Failed to parse PDF file.' }, { status: 500 });
      }
    } else if (
      fileName.endsWith('.docx') || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      try {
        text = await parseDOCX(buffer);
      } catch (err) {
        console.error("DOCX Parsing Error:", err);
        return NextResponse.json({ error: 'Failed to parse DOCX file.' }, { status: 500 });
      }
    } else if (fileName.endsWith('.txt') || file.type === 'text/plain') {
      text = buffer.toString('utf-8');
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' }, { status: 400 });
    }

    if (!text.trim()) {
      return NextResponse.json({ error: 'The uploaded file appears to be empty or contains no extractable text.' }, { status: 400 });
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Extraction Route Error:", error);
    return NextResponse.json({ error: 'An unexpected error occurred during extraction.' }, { status: 500 });
  }
}
