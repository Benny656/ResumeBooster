"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface BuilderData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  education: string;
  experience: string;
  skills: string;
  projects: string;
  certifications: string;
}

interface TemplateBuilderFormProps {
  selectedBuilderTemplate: string | null;
  builderData: BuilderData;
  setBuilderData: (data: BuilderData) => void;
  handleGenerateDraft: () => void;
  isGeneratingDraft: boolean;
}

export default function TemplateBuilderForm({
  selectedBuilderTemplate,
  builderData,
  setBuilderData,
  handleGenerateDraft,
  isGeneratingDraft
}: TemplateBuilderFormProps) {
  return (
    <AnimatePresence>
      {selectedBuilderTemplate && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="overflow-hidden"
        >
          <div className="bg-white/50 border border-black/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 mt-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-red)]/10 text-[var(--color-brand-red)] flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <h4 className="font-heading font-bold text-xl">Build a Resume with AI</h4>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {['fullName', 'email', 'phone', 'location'].map((field) => (
                <div key={field} className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-70">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input 
                    type="text" 
                    value={(builderData as any)[field]}
                    onChange={(e) => setBuilderData({...builderData, [field]: e.target.value})}
                    className="w-full bg-white border border-black/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {[
                { id: 'summary', rows: 3 },
                { id: 'education', rows: 3 },
                { id: 'experience', rows: 4 },
                { id: 'skills', rows: 3 },
                { id: 'projects', rows: 3 },
                { id: 'certifications', rows: 2 }
              ].map((field) => (
                <div key={field.id} className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-wider opacity-70">{field.id}</label>
                  <textarea 
                    rows={field.rows}
                    value={(builderData as any)[field.id]}
                    onChange={(e) => setBuilderData({...builderData, [field.id]: e.target.value})}
                    className="w-full bg-white border border-black/10 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-red)] text-sm leading-relaxed"
                  ></textarea>
                </div>
              ))}
            </div>

            <button 
              onClick={handleGenerateDraft}
              disabled={isGeneratingDraft}
              className="w-full mt-2 bg-[var(--color-brand-black)] text-white py-4 rounded-2xl font-bold text-base hover:bg-[var(--color-brand-red)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isGeneratingDraft ? (
                <><div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Generating...</>
              ) : (
                <><Sparkles size={18} /> Generate Resume Draft</>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
