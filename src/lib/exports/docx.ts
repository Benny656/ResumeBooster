export async function generateAndDownloadDOCX(text: string, filename: string = 'optimized-resume.docx') {
  const { Document, Packer, Paragraph, TextRun } = await import('docx');
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
  a.download = filename;
  a.click();
}
