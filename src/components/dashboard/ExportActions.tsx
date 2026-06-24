"use client";

import React from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { generateAndDownloadPDF } from '@/lib/exports/pdf';
import { generateAndDownloadDOCX } from '@/lib/exports/docx';

export default function ExportActions({ analysisResult, template }: { analysisResult: any, template: string }) {

  const exportPDF = async () => {
    if (!analysisResult?.rewrittenResume) return;
    try {
      await generateAndDownloadPDF(analysisResult.rewrittenResume);
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
    }
  };

  const exportDOCX = async () => {
    if (!analysisResult?.rewrittenResume) return;
    try {
      await generateAndDownloadDOCX(analysisResult.rewrittenResume);
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
