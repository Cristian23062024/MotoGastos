import React from 'react';
import { Motorcycle, Language, ScreenId } from '../types';
import { translations } from '../i18n/translations';
import { 
  Calendar, 
  ShieldCheck, 
  Scale, 
  Fuel, 
  ArrowRight, 
  SlidersHorizontal,
  ChevronLeft,
  Sparkles,
  Gauge
} from 'lucide-react';

interface SpecsScreenProps {
  motorcycle: Motorcycle;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
}

export const SpecsScreen: React.FC<SpecsScreenProps> = ({
  motorcycle,
  onNavigate,
  language,
}) => {
  const t = translations[language];

  return (
    <div className="flex-1 w-full px-4 pt-2 pb-8 flex flex-col space-y-4 max-w-lg mx-auto">
      {/* Sub-header Bar / Screen Navigator */}
      <div className="flex items-center justify-between py-1">
        <button
          onClick={() => onNavigate('analyzing')}
          aria-label="Volver"
          className="w-10 h-10 rounded-full bg-[#161c28]/80 hover:bg-[#242a37] backdrop-blur-lg flex items-center justify-center text-white transition-colors shadow-sm border border-white/5 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#ffb4aa] font-headline">
            {t.aiDiagnostic}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white font-headline">
            {t.techSpecs}
          </h2>
        </div>

        <button
          onClick={() => onNavigate('expenses')}
          aria-label="Ajustar parámetros"
          className="w-10 h-10 rounded-full bg-[#161c28]/80 hover:bg-[#242a37] backdrop-blur-lg flex items-center justify-center text-slate-300 hover:text-white transition-colors shadow-sm border border-white/5 active:scale-95"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Glassmorphism Showcase Card */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#161c28]/80 backdrop-blur-xl border border-white/10 p-4 sm:p-5 flex flex-col shadow-[0_12px_28px_rgba(0,0,0,0.5)]">
        {/* Top Badges */}
        <div className="flex items-center justify-between w-full mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0d131f]/80 backdrop-blur-md border border-white/5">
            <span className="w-2 h-2 rounded-full bg-[#47e266] shadow-[0_0_8px_#47e266]"></span>
            <span className="text-[10px] font-bold text-[#47e266] uppercase tracking-wider font-headline">
              {motorcycle.confidencePercent}% {t.certainty}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-300 bg-[#0d131f]/70 px-2.5 py-1 rounded-full border border-white/5 font-headline">
            FZ 150 · {motorcycle.modelYear}
          </span>
        </div>

        {/* Motorcycle Showcase Image */}
        <div className="relative w-full h-44 flex items-center justify-center select-none my-1">
          <img
            src={motorcycle.specsImage}
            alt={motorcycle.name}
            className="w-full h-full object-contain filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Title & Category */}
        <div className="text-center mt-2">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-headline">
            {motorcycle.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {t.urban} · {motorcycle.engineType}
          </p>
        </div>
      </div>

      {/* Telemetry 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {/* Displacement */}
        <div className="bg-[#161c28]/90 rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-white/5">
          <div className="flex items-center gap-1.5 text-[#ff5545] mb-1">
            <Gauge className="w-4 h-4 text-[#ff5545]" />
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-headline">
              {t.displacement}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-headline">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {motorcycle.cc}
            </span>
            <span className="text-xs font-semibold text-slate-400">cc</span>
          </div>
        </div>

        {/* Model Year */}
        <div className="bg-[#161c28]/90 rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-white/5">
          <div className="flex items-center gap-1.5 text-[#aac7ff] mb-1">
            <Calendar className="w-4 h-4 text-[#aac7ff]" />
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-headline">
              {t.modelYear}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-headline">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {motorcycle.modelYear}
            </span>
          </div>
        </div>

        {/* SOAT Tariff */}
        <div className="bg-[#161c28]/90 rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-white/5">
          <div className="flex items-center gap-1.5 text-[#47e266] mb-1">
            <ShieldCheck className="w-4 h-4 text-[#47e266]" />
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-headline">
              {t.soatTariff}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-headline">
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {motorcycle.soatTariff}
            </span>
          </div>
        </div>

        {/* Dry Weight */}
        <div className="bg-[#161c28]/90 rounded-2xl p-4 flex flex-col justify-between shadow-sm border border-white/5">
          <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            <Scale className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-headline">
              {t.dryWeight}
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1 font-headline">
            <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {motorcycle.pesoSecoKg}
            </span>
            <span className="text-xs font-semibold text-slate-400">kg</span>
          </div>
        </div>
      </div>

      {/* Telemetry Diagnostic Bar */}
      <div className="w-full bg-[#161c28]/70 backdrop-blur-md rounded-xl p-3 flex items-center justify-between border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#242a37] flex items-center justify-center text-[#ff5545]">
            <Fuel className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">
              {t.avgConsumption}
            </span>
            <span className="text-[11px] text-slate-400 font-headline">
              {t.urbanCycle}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[#47e266]">
          <span className="text-[11px] font-bold font-headline px-2 py-0.5 rounded bg-[#47e266]/15 border border-[#47e266]/30">
            {t.optimalA}
          </span>
        </div>
      </div>

      {/* Primary Glow Ignition Button */}
      <div className="w-full pt-2">
        <button
          onClick={() => onNavigate('expenses')}
          className="w-full h-14 rounded-full bg-gradient-to-r from-[#ff5545] to-[#c0000a] text-white font-headline text-base font-bold flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(255,85,69,0.45)] hover:shadow-[0_12px_32px_rgba(255,85,69,0.6)] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>{t.viewEstimatedAnnualExpenses}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
