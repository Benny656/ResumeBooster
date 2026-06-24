"use client";

import React from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ExportActions({ analysisResult, template }: { analysisResult: any, template: string }) {
  const wrapText = (text: string, maxWidth: number, font: any, fontSize: number) => {
    const lines: string[] = [];
    const paragraphs = text.split('\n');
    
    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) {
        lines.push('');
        continue;
      }
      const words = paragraph.split(' ');
      let currentLine = words[0] || '';
      
      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
        if (width < maxWidth) {
          currentLine += ' ' + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
    }
    return lines;
  };

  const exportPDF = async () => {
    if (!analysisResult?.rewrittenResume) return;
    try {
      const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();
      let page = pdfDoc.addPage([595.28, 841.89]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      const { width, height } = page.getSize();
      const margin = 50;
      let y = height - margin;
      
      page.drawText('Optimized Resume', { x: margin, y, size: 24, font: boldFont, color: rgb(0, 0, 0) });
      y -= 40;
      
      const fontSize = 11;
      const text = analysisResult.rewrittenResume;
      const lines = wrapText(text, width - margin * 2, font, fontSize);
      
      for (const line of lines) {
        if (y < margin) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = height - margin;
        }
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
        y -= fontSize + 4;
      }
      
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-resume.pdf';
      a.click();
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
    }
  };

  const exportDOCX = async () => {
    if (!analysisResult?.rewrittenResume) return;
    try {
      const { Document, Packer, Paragraph, TextRun } = await import('docx');
      const text = analysisResult.rewrittenResume;
      const paragraphs = text.split('\n').map((line: string) => {
        return new Paragraph({
          children: [new TextRun({ text: line, size: 22 })],
          spacing: { after: 120 }
        });
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'Optimized Resume', bold: true, size: 32 })],
              spacing: { after: 400 }
            }),
            ...paragraphs
          ],
        }]
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized-resume.docx';
      a.click();
    } catch (err) {
      toast.error('Failed to export DOCX');
      console.error(err);
    }
  };

  return (
    <div className="bg-[var(--color-brand-black)] text-white p-6 md:p-8 rounded-3xl flex flex-col gap-6 shadow-2xl w-full">
      <div>
        <h4 className="font-heading font-bold text-xl mb-1">Your Optimized Resume is Ready</h4>
        <p className="text-white/80 text-sm">We've applied all suggestions to a {template.toLowerCase()} template.</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
        <button 
          className="w-full sm:w-auto bg-white text-[var(--color-brand-black)] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform"
          onClick={exportPDF}
        >
          <Download size={18} /> Download PDF
        </button>
        <button 
          className="w-full sm:w-auto bg-white/20 text-white hover:bg-white hover:text-[var(--color-brand-black)] px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all"
          onClick={exportDOCX}
        >
          <Download size={18} /> Download DOCX
        </button>
      </div>
    </div>
  );
}
