"use client";

import React, { useState } from "react";
import { StartupData } from "@/data/mockData";

interface PitchDeckModalProps {
  startup: StartupData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PitchDeckModal({ startup, isOpen, onClose }: PitchDeckModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen || !startup) return null;

  const slides = startup.pitchDeck.slides;
  const slide = slides[currentSlide] || slides[0];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-[#0b0c0e] border border-[#242728] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#242728] bg-[#101114]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
              PDF
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {startup.name} — Pitch Deck
              </h3>
              <p className="text-xs text-[#9c9c9d] font-mono">
                DPIIT: {startup.dpiit} • GFR Rule 173/174 Exemption Active
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Downloading pitch deck PDF for ${startup.name}...`)}
              className="px-3 py-1.5 bg-[#1a1c20] hover:bg-[#282a30] text-gray-300 border border-[#242728] rounded text-xs font-medium transition flex items-center gap-1"
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#18191c] hover:bg-[#26282d] text-gray-400 hover:text-white flex items-center justify-center text-base transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Slide Canvas */}
        <div className="p-8 flex-1 overflow-y-auto bg-gradient-to-b from-[#0a0b0d] to-[#111317] relative flex flex-col justify-between min-h-[380px]">
          {/* Slide Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
              <span>SLIDE {slide.slideNumber} OF {slides.length}</span>
              <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/80 rounded text-[11px]">
                SPARSH Verified Proposal
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {slide.title}
            </h2>
            <p className="text-sm text-[#9c9c9d] font-medium">
              {slide.subtitle}
            </p>
          </div>

          {/* Slide Content */}
          <div className="my-6 space-y-3">
            {slide.content.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-[#13151a]/80 border border-[#242728] rounded-xl text-xs text-[#d1d5db]">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  ✓
                </span>
                <p className="leading-relaxed">{point}</p>
              </div>
            ))}

            {slide.metrics && slide.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {slide.metrics.map((m, idx) => (
                  <div key={idx} className="p-3 bg-[#0d1017] border border-emerald-900/40 rounded-xl text-center">
                    <span className="text-[11px] text-[#9c9c9d] font-medium block mb-1">{m.label}</span>
                    <span className="text-xl font-black text-emerald-400 tracking-tight">{m.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#242728]">
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentSlide ? "bg-emerald-400 w-6" : "bg-[#282a30] hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="px-4 py-2 bg-[#16181d] hover:bg-[#22252c] disabled:opacity-30 text-white rounded-lg text-xs font-semibold border border-[#242728] transition"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentSlide === slides.length - 1}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-lg text-xs font-semibold transition"
              >
                Next Slide →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
