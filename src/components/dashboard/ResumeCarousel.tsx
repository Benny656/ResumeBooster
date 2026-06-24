"use client";

import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ResumeCarouselHandle {
  scroll: (direction: 'left' | 'right') => void;
}

interface ResumeCarouselProps {
  selectedBuilderTemplate: string | null;
  setSelectedBuilderTemplate: (id: string) => void;
}

const builderTemplates = [
  { id: 'Student', desc: 'Clean & education-focused', bestFor: 'College Students, Fresh Graduates', usedBy: 'Students, Entry-Level', focus: 'Education, Projects, Skills', image: '/sturem.jpg' },
  { id: 'Professional', desc: 'Traditional & structured', bestFor: 'General Job Applications', usedBy: 'Most Professionals', focus: 'Work Experience, Achievements, Skills', image: '/profrem.png' },
  { id: 'Tech', desc: 'Code & impact focused', bestFor: 'Software Engineering, AI/ML, Data Science, IT', usedBy: 'Developers, Engineers, Tech Professionals', focus: 'Projects, Technologies, Impact', image: '/techrem.jpg' },
  { id: 'Modern', desc: 'Creative & visual', bestFor: 'Design, Marketing, Creative Roles', usedBy: 'Designers, Content Creators, Product Teams', focus: 'Portfolio, Experience, Personal Brand', image: '/modrem.png' },
  { id: 'Executive', desc: 'Leadership & results oriented', bestFor: 'Senior Roles, Management', usedBy: 'Managers, Directors, Executives', focus: 'Leadership, Strategy, Business Impact', image: '/exerem.jpeg' }
];

const ResumeCarousel = forwardRef<ResumeCarouselHandle, ResumeCarouselProps>(({
  selectedBuilderTemplate,
  setSelectedBuilderTemplate
}, ref) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  useImperativeHandle(ref, () => ({
    scroll: (direction: 'left' | 'right') => {
      if (carouselRef.current) {
        const scrollAmount = direction === 'left' ? -350 : 350;
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }));

  // On mobile, stop auto-scroll so touch scrolling works naturally
  useEffect(() => {
    if (isHoveringCarousel) return;
    // Only auto-scroll on desktop (pointer: fine)
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return;
    let animationFrameId: number;
    const scroll = () => {
      if (carouselRef.current) {
        carouselRef.current.scrollLeft += 0.5;
        if (carouselRef.current.scrollLeft >= carouselRef.current.scrollWidth / 2) {
          carouselRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHoveringCarousel]);

  return (
    <div 
      ref={carouselRef} 
      onMouseEnter={() => setIsHoveringCarousel(true)}
      onMouseLeave={() => setIsHoveringCarousel(false)}
      onTouchStart={() => setIsHoveringCarousel(true)}
      onTouchEnd={() => setIsHoveringCarousel(false)}
      className="flex overflow-x-auto gap-4 md:gap-6 pb-4 scroll-smooth hide-scrollbar w-full" 
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
      {[...builderTemplates, ...builderTemplates].map((t, idx) => {
        const isSelected = selectedBuilderTemplate === t.id;
        return (
          <motion.div 
            key={`${t.id}-${idx}`}
            onClick={() => setSelectedBuilderTemplate(t.id)}
            className={`group flex-shrink-0 w-[75vw] sm:w-[300px] md:w-[340px] flex flex-col cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-2 ${isSelected ? 'border-[var(--color-brand-red)] shadow-2xl scale-[1.02] -translate-y-2' : 'border-black/5 hover:border-black/20 hover:shadow-xl hover:-translate-y-1'}`}
            style={{ scrollSnapAlign: 'start' }}
          >
            {/* Image Preview Container */}
            <div className="relative h-72 md:h-80 w-full bg-black/5 overflow-hidden border-b border-black/5">
              <Image src={t.image} alt={`${t.id} Template`} fill sizes="(max-width: 768px) 100vw, 350px" className="object-cover object-top opacity-95 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <h4 className="font-heading font-bold text-2xl text-white">{t.id}</h4>
                {isSelected && <div className="bg-white rounded-full p-1"><CheckCircle2 size={20} className="text-[var(--color-brand-red)]" /></div>}
              </div>
            </div>
            
            {/* Template Details */}
            <div className="p-6 bg-white/95 flex-1 flex flex-col justify-between">
              <p className="text-sm opacity-80 mb-5 font-medium">{t.desc}</p>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex gap-3"><span className="opacity-70 font-bold uppercase tracking-wider min-w-[70px]">Best For</span><span className="font-medium text-black/80">{t.bestFor}</span></div>
                <div className="flex gap-3"><span className="opacity-70 font-bold uppercase tracking-wider min-w-[70px]">Used By</span><span className="font-medium text-black/80">{t.usedBy}</span></div>
                <div className="flex gap-3"><span className="opacity-70 font-bold uppercase tracking-wider min-w-[70px]">Focus</span><span className="font-medium text-black/80">{t.focus}</span></div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});

ResumeCarousel.displayName = 'ResumeCarousel';

export default ResumeCarousel;
