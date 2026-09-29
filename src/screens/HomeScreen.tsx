import React from 'react';
import { Motorcycle, Language, ScreenId } from '../types';
import { translations } from '../i18n/translations';
import { 
  Camera, 
  ArrowRight, 
  TrendingDown, 
  FileText, 
  ChevronRight, 
  Gauge, 
  Fuel, 
  CheckCircle2, 
  ShieldCheck,
  Bike
} from 'lucide-react';
import { MOTORCYCLES_CATALOG } from '../data/motorcycles';

interface HomeScreenProps {
  currentMotorcycle: Motorcycle;
  onSelectMotorcycle: (moto: Motorcycle) => void;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentMotorcycle,
  onSelectMotorcycle,
  onNavigate,
  language,
}) => {
  const t = translations[language];

  // Format currency in COP
  const formatCOP = (val: number) => {
    return '$ ' + new Intl.NumberFormat('es-CO').format(val) + ' COP';
  };

  // Calculate annual sum for current bike
  const totalAnnual = Object.values(currentMotorcycle.expenses).reduce((a, b) => a + b, 0);

  return (
    <div className="flex-1 w-full px-4 pt-3 pb-8 flex flex-col space-y-4 max-w-lg mx-auto">
      {/* Saludo & Estado Operativo */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[11px] font-semibold text-[#47e266] uppercase tracking-wider mb-0.5 font-headline flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#47e266] animate-pulse"></span>
            {t.onlineStatus}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-headline">
            {t.helloRider}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 bg-[#1a202c]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#47e266] shadow-[0_0_8px_rgba(71,226,102,0.8)]"></span>
          <span className="text-xs font-medium text-slate-200">{t.connected}</span>
        </div>
      </div>

      {/* Hero Card: Motorcycle Silhouette & Telemetry */}
      <div className="relative w-full rounded-2xl bg-[#161c28]/90 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] border border-white/5 overflow-hidden p-4 sm:p-5 transition-all">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#ff5545]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Motorcycle Title & Type */}
        <div className="flex items-center justify-between mb-3 relative z-10">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-headline">
              {currentMotorcycle.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentMotorcycle.cc}cc · {t.modelYear} {currentMotorcycle.modelYear}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#242a37] text-slate-200 text-[11px] font-bold uppercase tracking-wider border border-white/5">
            {currentMotorcycle.category}
          </span>
        </div>

        {/* Motorcycle Hero Image Display */}
        <div className="relative w-full h-44 my-2 flex items-center justify-center overflow-hidden rounded-xl group">
          <img
            src={currentMotorcycle.heroImage}
            alt={currentMotorcycle.name}
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] transition-transform duration-500 group-hover:scale-105 select-none"
            loading="eager"
          />
        </div>

        {/* Telemetry Twin Counters: Rendimiento & Autonomía */}
        <div className="grid grid-cols-2 gap-3 pt-3 bg-[#0d131f]/80 rounded-xl p-3.5 backdrop-blur-md border border-white/5">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1 font-headline flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#47e266]" />
              {t.performance}
            </span>
            <span className="text-2xl font-bold text-[#47e266] font-headline tracking-tight">
              {currentMotorcycle.rendimientoKmPerL}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">km/L</span>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center border-l border-white/10 pl-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1 font-headline flex items-center gap-1">
              <Fuel className="w-3 h-3 text-[#aac7ff]" />
              {t.autonomy}
            </span>
            <span className="text-2xl font-bold text-white font-headline tracking-tight">
              {currentMotorcycle.autonomiaKm}{' '}
              <span className="text-xs font-normal text-slate-400 font-sans">km</span>
            </span>
          </div>
        </div>
      </div>

      {/* Motorcycle Selector Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 font-headline pl-1">
          Garage:
        </span>
        {MOTORCYCLES_CATALOG.map((bike) => (
          <button
            key={bike.id}
            onClick={() => onSelectMotorcycle(bike)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentMotorcycle.id === bike.id
                ? 'bg-[#ff5545] text-white shadow-[0_2px_10px_rgba(255,85,69,0.35)]'
                : 'bg-[#161c28] hover:bg-[#242a37] text-slate-300 border border-white/5'
            }`}
          >
            <Bike className="w-3.5 h-3.5" />
            <span>{bike.name}</span>
          </button>
        ))}
      </div>

      {/* Card: Estimación y Trámites (Bento Clickable Item) */}
      <div 
        onClick={() => onNavigate('expenses')}
        className="rounded-2xl bg-[#161c28]/80 hover:bg-[#1f2636] backdrop-blur-xl p-4 shadow-lg border border-white/5 flex items-center justify-between gap-4 cursor-pointer transition-all active:scale-[0.99] group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-[#3e90ff]/15 flex items-center justify-center text-[#aac7ff] shrink-0 border border-[#3e90ff]/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-[#aac7ff]" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm sm:text-base font-bold text-white font-headline truncate">
              {t.estimationAndProcedures}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
              {t.estimationDescription}
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>

      {/* Resumen de Costo Anual Proyectado (Widget Compacto Estilo Cockpit) */}
      <div 
        onClick={() => onNavigate('expenses')}
        className="w-full rounded-xl bg-gradient-to-r from-[#121622] to-[#1a202c] p-4 backdrop-blur-md shadow-md border border-white/5 flex items-center justify-between cursor-pointer hover:border-white/10 transition-all active:scale-[0.99]"
      >
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-headline">
            {t.avgAnnualCostEstimated}
          </span>
          <span className="text-lg sm:text-xl font-bold text-white mt-0.5 font-headline tracking-tight">
            {formatCOP(totalAnnual)}
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#242a37] flex items-center justify-center text-[#47e266] shadow-sm border border-white/5">
          <TrendingDown className="w-5 h-5" />
        </div>
      </div>

      {/* Full-width Racing Crimson Button: Escanear mi moto */}
      <button
        onClick={() => onNavigate('scan')}
        className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#ff5545] to-[#c0000a] text-white font-headline text-base font-bold tracking-wide shadow-[0_8px_24px_rgba(255,85,69,0.45)] hover:shadow-[0_12px_32px_rgba(255,85,69,0.65)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
      >
        <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="font-bold">{t.scanMyBike}</span>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Secondary Specs Button */}
      <button
        onClick={() => onNavigate('specs')}
        className="w-full py-2 text-center text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
      >
        <FileText className="w-3.5 h-3.5 text-[#ffb4aa]" />
        <span>{t.techSpecs} · Yamaha FZ 150</span>
      </button>
    </div>
  );
};
