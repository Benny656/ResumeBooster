export async function parsePDF(buffer: Buffer): Promise<string> {
  const PDFParserModule = await import('pdf2json');
  const PDFParser = PDFParserModule.default || PDFParserModule;
  const pdfParser = new PDFParser(null, true);
  
  return new Promise((resolve, reject) => {
    pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", () => resolve(pdfParser.getRawTextContent()));
    pdfParser.parseBuffer(buffer);
  });
}
