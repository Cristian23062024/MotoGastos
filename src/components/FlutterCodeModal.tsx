import React, { useState } from 'react';
import { FLUTTER_DART_CODE } from '../data/flutterSourceCode';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  X, 
  Copy, 
  Check, 
  FileCode2, 
  Smartphone, 
  Terminal, 
  Layers
} from 'lucide-react';

interface FlutterCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const FlutterCodeModal: React.FC<FlutterCodeModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'main' | 'pubspec' | 'architecture'>('main');
  const t = translations[language];

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(FLUTTER_DART_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const pubspecContent = `name: motogastos_flutter
description: "MotoGastos - Smart Motorcycle Telemetry, AI Scanner & Annual Expense Calculator"
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#121622] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#161c28]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff5545]/15 border border-[#ff5545]/30 flex items-center justify-center text-[#ff5545]">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-headline">
                  {t.flutterCodeModalTitle}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#ff5545]/20 text-[#ffb4aa] text-[10px] font-bold uppercase tracking-wider">
                  Dart 3.0+
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {t.flutterCodeSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#ff5545] hover:bg-[#ff5545]/90 text-white shadow-lg shadow-[#ff5545]/25 active:scale-95'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.copiedFlutterCode : t.copyFlutterCode}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-[#0d131f] border-b border-white/5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('main')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'main'
                ? 'bg-[#1a202c] text-white border border-white/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#ff5545]" />
            <span>lib/main.dart</span>
          </button>
          <button
            onClick={() => setActiveTab('pubspec')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'pubspec'
                ? 'bg-[#1a202c] text-white border border-white/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#aac7ff]" />
            <span>pubspec.yaml</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
              activeTab === 'architecture'
                ? 'bg-[#1a202c] text-white border border-white/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Architecture & Features</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="flex-1 overflow-auto p-4 bg-[#080e1a] text-slate-300 font-mono text-xs leading-relaxed selection:bg-[#ff5545] selection:text-white">
          {activeTab === 'main' && (
            <pre className="whitespace-pre overflow-x-auto text-[11px] sm:text-xs text-slate-300">
              <code>{FLUTTER_DART_CODE}</code>
            </pre>
          )}

          {activeTab === 'pubspec' && (
            <pre className="whitespace-pre overflow-x-auto text-[11px] sm:text-xs text-slate-300">
              <code>{pubspecContent}</code>
            </pre>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4 max-w-2xl text-xs text-slate-300 py-2">
              <div className="p-3.5 rounded-xl bg-[#161c28] border border-white/5 space-y-1.5">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#ff5545]" />
                  Multi-device Mobile Responsiveness
                </h4>
                <p className="text-slate-400 leading-normal">
                  The Flutter architecture uses responsive widgets (<code className="text-[#aac7ff]">LayoutBuilder</code>, <code className="text-[#aac7ff]">SafeArea</code>, and flex systems) designed to adapt smoothly across small Android displays (360px) and large iOS devices (430px) without overflow errors.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161c28] border border-white/5 space-y-1.5">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Dark Mode & Smooth Navigation Transitions
                </h4>
                <p className="text-slate-400 leading-normal">
                  Configured with native <code className="text-[#aac7ff]">ThemeMode.dark</code>, deep cockpit palette (<code className="text-[#aac7ff]">#0D131F</code>) and <code className="text-[#aac7ff]">CupertinoPageTransitionsBuilder()</code> for 60fps native page pushes and back pops.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#161c28] border border-white/5 space-y-1.5">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#aac7ff]" />
                  Trilingual i18n
                </h4>
                <p className="text-slate-400 leading-normal">
                  Centralized dictionary for Spanish (es), English (en), and Japanese (ja) covering all telemetry diagnostics and Colombian legal vehicle calculations.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#121622] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Ready to paste into <code className="text-white">flutter create motogastos</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
