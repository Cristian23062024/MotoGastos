import React, { useState } from 'react';
import { Motorcycle, Language, ScreenId } from '../types';
import { translations } from '../i18n/translations';
import confetti from 'canvas-confetti';
import { 
  ChevronLeft, 
  SlidersHorizontal, 
  Info, 
  Bike, 
  ShieldCheck, 
  Gauge, 
  Percent, 
  Fuel, 
  Wrench, 
  Bookmark, 
  BookmarkCheck, 
  Receipt, 
  Download, 
  Printer, 
  X, 
  Check, 
  Sparkles,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface ExpensesScreenProps {
  motorcycle: Motorcycle;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
}

export const ExpensesScreen: React.FC<ExpensesScreenProps> = ({
  motorcycle,
  onNavigate,
  language,
}) => {
  const t = translations[language];

  // Editable parameters with defaults from the design
  const [annualKm, setAnnualKm] = useState<number>(12000);
  const [gasPricePerGallon, setGasPricePerGallon] = useState<number>(15800); // COP per gallon in 2026
  const [fuelEfficiencyKmPerLiter, setFuelEfficiencyKmPerLiter] = useState<number>(42);
  const [maintenanceAnnual, setMaintenanceAnnual] = useState<number>(750000);
  const [selectedCity, setSelectedCity] = useState<string>('Bogotá D.C. · 2026');

  // UI state
  const [isSaved, setIsSaved] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Dynamic calculations:
  // 1 gallon = 3.78541 liters
  const litersNeeded = annualKm / fuelEfficiencyKmPerLiter;
  const gallonsNeeded = litersNeeded / 3.78541;
  const calculatedGasolineCost = Math.round(gallonsNeeded * gasPricePerGallon);

  const soatCost = motorcycle.expenses.soat;
  const tecnoCost = motorcycle.expenses.tecnomecanica;
  const impuestoCost = motorcycle.expenses.impuesto;
  const maintenanceCost = maintenanceAnnual;
  const gasolineCost = calculatedGasolineCost > 0 ? calculatedGasolineCost : motorcycle.expenses.gasolina;

  const totalAnnual = soatCost + tecnoCost + impuestoCost + gasolineCost + maintenanceCost;
  const monthlyCost = Math.round(totalAnnual / 12);

  const formatCOP = (val: number) => {
    return '$ ' + new Intl.NumberFormat('es-CO').format(val);
  };

  const handleSaveToGarage = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const handleDownloadReport = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      setShowReportModal(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ff5545', '#47e266', '#aac7ff'],
      });
    }, 1000);
  };

  // Percentage breakdown for visual distribution bar
  const pctGas = Math.round((gasolineCost / totalAnnual) * 100);
  const pctMaint = Math.round((maintenanceCost / totalAnnual) * 100);
  const pctSoat = Math.round((soatCost / totalAnnual) * 100);
  const pctTecno = Math.round((tecnoCost / totalAnnual) * 100);
  const pctTax = 100 - (pctGas + pctMaint + pctSoat + pctTecno);

  return (
    <div className="flex-1 w-full px-4 pt-2 pb-10 flex flex-col space-y-4 max-w-lg mx-auto relative select-none">
      {/* Sub-bar & Quick Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => onNavigate('specs')}
          aria-label="Volver atrás"
          className="w-10 h-10 rounded-full bg-[#161c28]/80 hover:bg-[#242a37] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all border border-white/5"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="h-10 px-4 rounded-full bg-[#161c28]/90 hover:bg-[#242a37] text-white hover:text-[#ffb4aa] flex items-center gap-1.5 shadow-sm active:scale-95 transition-all border border-white/5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff5545]" />
            <span className="text-[11px] font-bold uppercase tracking-wider font-headline">
              {t.editValues}
            </span>
          </button>

          <button
            onClick={() => setShowInfoModal(true)}
            aria-label={t.calcInfo}
            className="w-10 h-10 rounded-full bg-[#161c28]/80 hover:bg-[#242a37] text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Motorcycle Specification & Telemetry Badge */}
      <div className="rounded-2xl bg-[#161c28]/90 backdrop-blur-xl px-4 py-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.5)] border border-white/5 flex items-center justify-between relative overflow-hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#242a37] flex items-center justify-center shrink-0 border border-white/5">
            <Bike className="w-5 h-5 text-[#ff5545]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-white truncate font-headline">
              {motorcycle.name}
            </h2>
            <p className="text-xs text-slate-400 truncate">
              {selectedCity}
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-headline font-bold">
            {t.projection}
          </span>
          <span className="text-sm font-bold text-[#aac7ff] font-headline">
            {new Intl.NumberFormat('es-CO').format(annualKm)} km
          </span>
        </div>
      </div>

      {/* List of 5 Glassmorphic Cost Cards */}
      <div className="flex flex-col space-y-2.5">
        {/* 1. SOAT */}
        <div className="rounded-2xl bg-[#161c28]/75 backdrop-blur-2xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/5 flex items-center justify-between gap-3 transition-all hover:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 flex items-center justify-center text-[#ff5545] shrink-0 border border-[#ff5545]/20">
              <ShieldCheck className="w-5 h-5 text-[#ff5545]" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white truncate font-headline">
              {t.soatTitle}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-bold text-white block leading-tight font-headline">
              {formatCOP(soatCost)}
            </span>
          </div>
        </div>

        {/* 2. Tecnomecánica */}
        <div className="rounded-2xl bg-[#161c28]/75 backdrop-blur-2xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/5 flex items-center justify-between gap-3 transition-all hover:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#aac7ff]/15 flex items-center justify-center text-[#aac7ff] shrink-0 border border-[#aac7ff]/20">
              <Gauge className="w-5 h-5 text-[#aac7ff]" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white truncate font-headline">
              {t.technomechanical}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-bold text-white block leading-tight font-headline">
              {formatCOP(tecnoCost)}
            </span>
          </div>
        </div>

        {/* 3. Impuesto Vehicular */}
        <div className="rounded-2xl bg-[#161c28]/75 backdrop-blur-2xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/5 flex items-center justify-between gap-3 transition-all hover:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ffb4aa]/15 flex items-center justify-center text-[#ffb4aa] shrink-0 border border-[#ffb4aa]/20">
              <Percent className="w-5 h-5 text-[#ffb4aa]" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white truncate font-headline">
              {t.vehicleTax}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-bold text-white block leading-tight font-headline">
              {formatCOP(impuestoCost)}
            </span>
          </div>
        </div>

        {/* 4. Gasolina Corriente */}
        <div className="rounded-2xl bg-[#161c28]/75 backdrop-blur-2xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/5 flex items-center justify-between gap-3 transition-all hover:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 flex items-center justify-center text-[#ff5545] shrink-0 border border-[#ff5545]/20">
              <Fuel className="w-5 h-5 text-[#ff5545]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base font-bold text-white truncate font-headline">
                {t.regularGasoline}
              </span>
              <span className="text-[10px] text-slate-400">
                {annualKm} km @ {fuelEfficiencyKmPerLiter} km/l
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-bold text-white block leading-tight font-headline">
              {formatCOP(gasolineCost)}
            </span>
          </div>
        </div>

        {/* 5. Mantenimiento */}
        <div className="rounded-2xl bg-[#161c28]/75 backdrop-blur-2xl px-4 py-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)] border border-white/5 flex items-center justify-between gap-3 transition-all hover:border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#47e266]/15 flex items-center justify-center text-[#47e266] shrink-0 border border-[#47e266]/20">
              <Wrench className="w-5 h-5 text-[#47e266]" />
            </div>
            <span className="text-sm sm:text-base font-bold text-white truncate font-headline">
              {t.maintenance}
            </span>
          </div>
          <div className="text-right shrink-0">
            <span className="text-base sm:text-lg font-bold text-white block leading-tight font-headline">
              {formatCOP(maintenanceCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Proportional Cost Breakdown Bar */}
      <div className="p-3 bg-[#121622] rounded-xl border border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-headline font-semibold">
          <span>Distribución de Costos</span>
          <span>Gasolina: {pctGas}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-white/5">
          <div style={{ width: `${pctGas}%` }} className="bg-[#ff5545] h-full" title={`Gasolina: ${pctGas}%`}></div>
          <div style={{ width: `${pctMaint}%` }} className="bg-[#47e266] h-full" title={`Mantenimiento: ${pctMaint}%`}></div>
          <div style={{ width: `${pctSoat}%` }} className="bg-[#aac7ff] h-full" title={`SOAT: ${pctSoat}%`}></div>
          <div style={{ width: `${pctTecno}%` }} className="bg-[#ffb4aa] h-full" title={`Tecnomecánica: ${pctTecno}%`}></div>
          <div style={{ width: `${pctTax}%` }} className="bg-amber-400 h-full" title={`Impuestos: ${pctTax}%`}></div>
        </div>
      </div>

      {/* Legal / Regulatory Clarification Note */}
      <div className="flex items-start gap-2.5 px-1 text-slate-400">
        <Info className="w-4 h-4 text-[#ffb4aa] shrink-0 mt-0.5" />
        <p className="text-xs text-slate-400 leading-snug">
          {t.legalNote}
        </p>
      </div>

      {/* Deep Dark Tinted Summary Cockpit Card with Crimson Glow */}
      <div className="rounded-2xl bg-[#080e1a]/95 backdrop-blur-2xl p-5 shadow-[0_16px_40px_rgba(0,0,0,0.7)] border border-white/10 flex flex-col space-y-4 relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#ff5545]/15 blur-3xl pointer-events-none"></div>

        <div className="flex items-end justify-between relative z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-headline">
              {t.totalAnnualCost}
            </span>
            <div className="flex items-baseline gap-1.5 mt-1 font-headline">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {formatCOP(totalAnnual)}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">COP</span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-headline">
              {t.monthlyQuota}
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#47e266] leading-tight font-headline">
              {formatCOP(monthlyCost)}
            </span>
          </div>
        </div>

        {/* Action Buttons: Guardar & Descargar Informe */}
        <div className="grid grid-cols-2 gap-3 pt-1 relative z-10">
          <button
            onClick={handleSaveToGarage}
            className={`h-12 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all font-headline font-semibold text-xs border ${
              isSaved
                ? 'bg-[#47e266]/20 border-[#47e266] text-[#47e266]'
                : 'bg-[#1a202c] hover:bg-[#242a37] text-white border-white/5'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-[#47e266]" /> : <Bookmark className="w-4 h-4 text-[#ffb4aa]" />}
            <span className="truncate">{isSaved ? t.saved : t.saveToGarage}</span>
          </button>

          <button
            onClick={handleDownloadReport}
            disabled={isGeneratingPdf}
            className="h-12 px-3 rounded-xl bg-gradient-to-r from-[#ff5545] to-[#c0000a] text-white font-headline font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_8px_24px_rgba(255,85,69,0.45)] hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span className="truncate">{t.generatingPdf}</span>
              </>
            ) : (
              <>
                <Receipt className="w-4 h-4" />
                <span className="truncate">{t.downloadReport}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Edit Values Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#161c28] border border-white/10 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base font-headline">
                {t.customizeValuesTitle}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  {t.projectionAnnualKm}
                </label>
                <input
                  type="number"
                  value={annualKm}
                  onChange={(e) => setAnnualKm(Number(e.target.value))}
                  step="1000"
                  className="w-full bg-[#0d131f] border border-white/10 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  {t.gasPriceGallon}
                </label>
                <input
                  type="number"
                  value={gasPricePerGallon}
                  onChange={(e) => setGasPricePerGallon(Number(e.target.value))}
                  step="500"
                  className="w-full bg-[#0d131f] border border-white/10 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  {t.annualMaintenance}
                </label>
                <input
                  type="number"
                  value={maintenanceAnnual}
                  onChange={(e) => setMaintenanceAnnual(Number(e.target.value))}
                  step="50000"
                  className="w-full bg-[#0d131f] border border-white/10 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  {t.cityLabel}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#0d131f] border border-white/10 rounded-lg p-2 text-white"
                >
                  <option value="Bogotá D.C. · 2026">Bogotá D.C. · 2026</option>
                  <option value="Medellín · 2026">Medellín · 2026</option>
                  <option value="Cali · 2026">Cali · 2026</option>
                  <option value="Barranquilla · 2026">Barranquilla · 2026</option>
                  <option value="Bucaramanga · 2026">Bucaramanga · 2026</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setAnnualKm(12000);
                  setGasPricePerGallon(15800);
                  setMaintenanceAnnual(750000);
                  setSelectedCity('Bogotá D.C. · 2026');
                }}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs"
              >
                {t.resetDefault}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 py-2 rounded-lg bg-[#ff5545] hover:bg-[#ff5545]/90 text-white font-bold text-xs shadow-md"
              >
                {t.applyChanges}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Downloadable PDF / Receipt Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#121622] border border-white/10 rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#47e266]" />
                <h3 className="font-bold text-white text-base font-headline">
                  {t.officialReportTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable summary box */}
            <div className="bg-[#080e1a] p-4 rounded-xl border border-white/5 space-y-3 font-mono text-xs text-slate-300">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">{t.generatedDate}:</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">{t.vehicle}:</span>
                <span className="text-[#ffb4aa] font-bold">{motorcycle.name} (149cc)</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">{t.projection}:</span>
                <span className="text-white">{new Intl.NumberFormat('es-CO').format(annualKm)} km</span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>1. {t.soatTitle}</span>
                  <span>{formatCOP(soatCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>2. {t.technomechanical}</span>
                  <span>{formatCOP(tecnoCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>3. {t.vehicleTax}</span>
                  <span>{formatCOP(impuestoCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>4. {t.regularGasoline}</span>
                  <span>{formatCOP(gasolineCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>5. {t.maintenance}</span>
                  <span>{formatCOP(maintenanceCost)}</span>
                </div>
              </div>

              <div className="border-t-2 border-white/20 pt-2 flex justify-between font-bold text-white text-sm">
                <span>{t.annualEstimate}:</span>
                <span className="text-[#47e266]">{formatCOP(totalAnnual)}</span>
              </div>
              <div className="flex justify-between text-slate-300 text-xs">
                <span>{t.monthlyEstimate}:</span>
                <span className="text-[#47e266]">{formatCOP(monthlyCost)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>{t.printOrSave}</span>
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#ff5545] hover:bg-[#ff5545]/90 text-white font-bold text-xs transition-colors"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculation Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#161c28] border border-white/10 rounded-2xl w-full max-w-md p-5 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-bold text-white text-base font-headline">
                {t.calcInfo}
              </h3>
              <button
                onClick={() => setShowInfoModal(false)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Los cálculos presentados integran las tarifas oficiales colombianas proyectadas para 2026:
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-4">
              <li><strong>SOAT:</strong> Tarifa oficial FASECOLDA / Superfinanciera para motos de 100cc a 200cc.</li>
              <li><strong>Tecnomecánica:</strong> Tarifa CDA regulada con UVT 2026.</li>
              <li><strong>Impuesto Vehicular:</strong> Secretaría de Hacienda Distrital de Bogotá (avalúo comercial mínimo).</li>
              <li><strong>Gasolina:</strong> Precio promedio de referencia nacional ($15.800 COP/galón).</li>
              <li><strong>Mantenimiento:</strong> Dos cambios de aceite semestrales, pastillas de freno, filtro de aire y kit de arrastre preventivo.</li>
            </ul>
            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-2 py-2 rounded-lg bg-[#ff5545] text-white font-bold text-xs"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
