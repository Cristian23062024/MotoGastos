import React from 'react';
import { BRAND_LOGO_URL } from '../data/motorcycles';
import { Language, ThemeMode, DeviceType, ScreenId } from '../types';
import { translations } from '../i18n/translations';
import { 
  Moon, 
  Sun, 
  Smartphone, 
  Code2, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  deviceType: DeviceType;
  onDeviceChange: (dev: DeviceType) => void;
  onOpenFlutterCode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  language,
  onLanguageChange,
  themeMode,
  onToggleTheme,
  deviceType,
  onDeviceChange,
  onOpenFlutterCode,
}) => {
  const t = translations[language];

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return language === 'es' ? 'Inicio' : language === 'ja' ? 'ホーム' : 'Home';
      case 'scan':
        return t.scanBikeHeader;
      case 'analyzing':
        return language === 'es' ? 'Analizando Moto Con Radar' : language === 'ja' ? 'レーダー解析中' : 'Radar Analysis';
      case 'specs':
        return t.techSpecs;
      case 'expenses':
        return t.annualExpenses;
      default:
        return 'MotoGastos';
    }
  };

  const canGoBack = currentScreen !== 'home';

  const handleBack = () => {
    switch (currentScreen) {
      case 'scan':
        onNavigate('home');
        break;
      case 'analyzing':
        onNavigate('scan');
        break;
      case 'specs':
        onNavigate('analyzing');
        break;
      case 'expenses':
        onNavigate('specs');
        break;
      default:
        onNavigate('home');
    }
  };

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#0d131f]/90 dark:bg-[#0d131f]/90 light:bg-white/95 backdrop-blur-xl border-b border-white/5 transition-colors">
      {/* Top Device & Developer Utility Bar */}
      <div className="bg-[#080e1a] dark:bg-[#080e1a] light:bg-slate-100 text-xs px-3 py-1.5 flex flex-wrap items-center justify-between border-b border-white/5 text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff5545] tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545] animate-pulse"></span>
            Flutter / Dart
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <button
            onClick={onOpenFlutterCode}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-[11px] font-medium"
            title="Inspect Flutter Dart code"
          >
            <Code2 className="w-3.5 h-3.5 text-[#aac7ff]" />
            <span>{t.viewFlutterCode}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Responsive device frames */}
          <div className="flex items-center bg-black/30 dark:bg-black/40 light:bg-slate-200 rounded p-0.5">
            <button
              onClick={() => onDeviceChange('iphone')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                deviceType === 'iphone'
                  ? 'bg-[#ff5545] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="iPhone 16 Pro (393px)"
            >
              iPhone
            </button>
            <button
              onClick={() => onDeviceChange('galaxy')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                deviceType === 'galaxy'
                  ? 'bg-[#ff5545] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Samsung Galaxy S24 (360px)"
            >
              Galaxy
            </button>
            <button
              onClick={() => onDeviceChange('fullscreen')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                deviceType === 'fullscreen'
                  ? 'bg-[#ff5545] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Responsive Mobile View"
            >
              Full
            </button>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-black/30 rounded p-0.5">
            {(['es', 'en', 'ja'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                  language === lang
                    ? 'bg-white/20 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Theme Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            title={t.toggleTheme}
          >
            {themeMode === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main App Navigation Bar Matching Design Screenshots */}
      <div className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {canGoBack && (
            <button
              onClick={handleBack}
              aria-label="Volver atrás"
              className="w-10 h-10 rounded-full bg-[#1a202c]/80 hover:bg-[#242a37] text-white flex items-center justify-center shadow-lg active:scale-95 transition-all border border-white/5"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}

          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <img
              src={BRAND_LOGO_URL}
              alt="MotoGastos Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#ffb4aa] tracking-[0.2em] uppercase leading-none font-headline">
                MotoGastos
              </span>
              <h1 className="text-base font-bold text-white tracking-tight leading-tight font-headline truncate max-w-[190px] sm:max-w-none">
                {getScreenTitle()}
              </h1>
            </div>
          </div>
        </div>

        {/* Quick Nav Chips */}
        <div className="flex items-center gap-1.5">
          {currentScreen !== 'scan' && (
            <button
              onClick={() => onNavigate('scan')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff5545] hover:bg-[#ff5545]/90 text-white font-headline text-xs font-semibold shadow-[0_4px_14px_rgba(255,85,69,0.35)] active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.scanBikeHeader}</span>
            </button>
          )}

          {currentScreen !== 'expenses' && (
            <button
              onClick={() => onNavigate('expenses')}
              className="px-2.5 py-1.5 rounded-full bg-[#1a202c] hover:bg-[#242a37] text-slate-200 text-xs font-headline font-medium border border-white/5 transition-all"
            >
              {t.tagline}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
