import React, { useState, useEffect } from 'react';
import { Language, ScreenId } from '../types';
import { translations } from '../i18n/translations';
import { RADAR_HOLOGRAM_IMG } from '../data/motorcycles';
import { 
  CheckCircle2, 
  Search, 
  Timer, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

interface AnalyzingScreenProps {
  onNavigate: (screen: ScreenId) => void;
  language: Language;
}

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({
  onNavigate,
  language,
}) => {
  const [step3Completed, setStep3Completed] = useState(false);
  const t = translations[language];

  // Auto-complete step 3 after 2.5 seconds for interactive delight
  useEffect(() => {
    const timer = setTimeout(() => {
      setStep3Completed(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 w-full px-4 pt-2 pb-8 flex flex-col space-y-4 max-w-lg mx-auto relative select-none">
      {/* Ambient Red Glow */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#ff5545]/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Step Tracker Pill */}
      <div className="flex items-center justify-center mt-1 mb-1">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161c28]/80 backdrop-blur-md border border-white/5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#ff5545] animate-pulse"></span>
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-headline">
            {t.smartScanStep}
          </span>
        </div>
      </div>

      {/* Title & Subtitle Intro */}
      <div className="text-center px-4 mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-headline">
          {t.analyzingYourBike}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
          {t.analyzingSubtitle}
        </p>
      </div>

      {/* Radar HUD Telemetry Cockpit Container */}
      <div className="relative w-full max-w-[310px] mx-auto aspect-square mb-2 flex items-center justify-center select-none">
        {/* Atmospheric Radar Backing */}
        <div className="absolute inset-0 rounded-full bg-[#121622]/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
          {/* Concentric Circular Target Rings */}
          <svg className="absolute inset-0 w-full h-full text-[#ff5545]/25" fill="none" viewBox="0 0 320 320">
            <circle cx="160" cy="160" r="145" stroke="currentColor" strokeDasharray="4 6" strokeWidth="1" className="opacity-40" />
            <circle cx="160" cy="160" r="110" stroke="currentColor" strokeWidth="1.5" className="opacity-60" />
            <circle cx="160" cy="160" r="75" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" className="opacity-50" />
            <circle cx="160" cy="160" r="40" stroke="currentColor" strokeWidth="1.5" className="opacity-40" />
            {/* Crosshair Axes */}
            <line x1="160" y1="12" x2="160" y2="308" stroke="currentColor" strokeDasharray="3 4" strokeWidth="1" className="opacity-30" />
            <line x1="12" y1="160" x2="308" y2="160" stroke="currentColor" strokeDasharray="3 4" strokeWidth="1" className="opacity-30" />
            {/* Degree Ticks */}
            <circle cx="160" cy="160" r="152" stroke="currentColor" strokeDasharray="1 15" strokeWidth="2" className="opacity-70" />
          </svg>

          {/* Active Sweeping Radar Wave (Smooth 360 Spin) */}
          <div className="absolute inset-0 animate-radar-sweep">
            <svg className="w-full h-full" fill="none" viewBox="0 0 320 320">
              <defs>
                <radialGradient id="radarSweepGradient" cx="50%" cy="50%" fx="80%" fy="20%" r="50%">
                  <stop offset="0%" stopColor="#ff5545" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#ff5545" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ff5545" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path d="M160 160 L310 160 A150 150 0 0 0 266 54 Z" fill="url(#radarSweepGradient)" />
              <line x1="160" y1="160" x2="310" y2="160" stroke="#ffb4aa" strokeWidth="2" strokeLinecap="round" className="drop-shadow-[0_0_8px_#ff5545]" />
            </svg>
          </div>

          {/* Outer Pulse Wave Ring */}
          <div className="absolute w-52 h-52 rounded-full bg-[#ff5545]/10 animate-ping opacity-30 pointer-events-none"></div>

          {/* Central Motorcycle Hologram & Glow */}
          <div className="relative z-10 flex flex-col items-center justify-center p-3">
            <div className="relative w-44 h-32 flex items-center justify-center">
              <img
                src={RADAR_HOLOGRAM_IMG}
                alt="Motorcycle Hologram Telemetry"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(255,85,69,0.5)] select-none"
              />
            </div>

            {/* Target Locked Badge */}
            <div className="mt-1 px-3 py-1 rounded-full bg-[#1a202c]/90 backdrop-blur-md border border-white/10 flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-[#47e266] animate-pulse"></span>
              <span className="text-[10px] font-bold text-white tracking-widest uppercase font-headline">
                {t.targetLocked}
              </span>
            </div>
          </div>
        </div>

        {/* HUD Telemetry Orbital Readouts */}
        <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-[#161c28]/85 backdrop-blur-md border border-white/5 shadow-sm">
          <span className="text-[9px] font-bold text-slate-400 block font-headline tracking-wider">
            {t.confidence}
          </span>
          <span className="text-xs font-bold text-white font-headline">98.4%</span>
        </div>

        <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-[#161c28]/85 backdrop-blur-md border border-white/5 shadow-sm text-right">
          <span className="text-[9px] font-bold text-slate-400 block font-headline tracking-wider">
            AI VISION
          </span>
          <span className="text-xs font-bold text-[#ff5545] font-headline animate-pulse">
            SCANNING
          </span>
        </div>
      </div>

      {/* Verification Steps List (Glass Stack) */}
      <div className="flex flex-col gap-2.5 px-1 mb-2">
        {/* Step 1: Completed */}
        <div className="w-full p-3.5 rounded-xl bg-[#161c28]/80 backdrop-blur-lg border border-white/5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#47e266]/20 flex items-center justify-center text-[#47e266] shrink-0 border border-[#47e266]/30">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white font-headline truncate">
                {t.step1Title}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {t.step1Subtitle}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#47e266] uppercase font-headline shrink-0 ml-2">
            {t.ready}
          </span>
        </div>

        {/* Step 2: Completed */}
        <div className="w-full p-3.5 rounded-xl bg-[#161c28]/80 backdrop-blur-lg border border-white/5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#47e266]/20 flex items-center justify-center text-[#47e266] shrink-0 border border-[#47e266]/30">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white font-headline truncate">
                {t.step2Title}
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {t.step2Subtitle}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#47e266] uppercase font-headline shrink-0 ml-2">
            {t.ready}
          </span>
        </div>

        {/* Step 3: Active Loading -> Completed */}
        <div className="w-full p-3.5 rounded-xl bg-[#1a202c]/90 backdrop-blur-lg border border-white/10 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            {step3Completed ? (
              <div className="w-9 h-9 rounded-full bg-[#47e266]/20 flex items-center justify-center text-[#47e266] shrink-0 border border-[#47e266]/30">
                <Check className="w-5 h-5" />
              </div>
            ) : (
              <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
                <svg className="w-9 h-9 animate-spin" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#242a37" strokeWidth="3" />
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#ff5545" strokeWidth="3" strokeDasharray="35 70" strokeLinecap="round" />
                </svg>
                <Search className="w-4 h-4 text-[#ffb4aa] absolute" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-white font-headline truncate">
                {step3Completed ? (language === 'es' ? 'Cilindraje y año confirmados' : language === 'ja' ? '排気量・年式を特定完了' : 'Displacement & year confirmed') : t.step3Title}
              </span>
              <span className="text-[11px] text-[#ffb4aa] truncate">
                {step3Completed ? '149cc · Modelo 2022' : t.step3Subtitle}
              </span>
            </div>
          </div>

          {step3Completed ? (
            <span className="text-[10px] font-bold text-[#47e266] uppercase font-headline shrink-0 ml-2">
              {t.ready}
            </span>
          ) : (
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545] animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545] animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}
        </div>
      </div>

      {/* Explanatory Secondary Micro-Copy */}
      <p className="text-center text-xs text-slate-400 mb-2 flex items-center justify-center gap-1.5">
        <Timer className="w-3.5 h-3.5 text-[#ff5545]" />
        <span>{t.takesFewSeconds}</span>
      </p>

      {/* Primary Continue Button */}
      <button
        onClick={() => onNavigate('specs')}
        className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#ff5545] to-[#c0000a] text-white font-headline text-base font-bold tracking-wide shadow-[0_8px_24px_rgba(255,85,69,0.45)] hover:shadow-[0_12px_32px_rgba(255,85,69,0.65)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        <span>{t.continueBtn}</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};
