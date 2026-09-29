import React, { useState, useRef, useEffect } from 'react';
import { Language, ScreenId } from '../types';
import { translations } from '../i18n/translations';
import { CAMERA_FEED_BG } from '../data/motorcycles';
import { 
  Flashlight, 
  Grid3X3, 
  Camera, 
  Image as ImageIcon, 
  Lightbulb, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Check, 
  Sparkles,
  ArrowRight,
  Video,
  VideoOff
} from 'lucide-react';

interface ScanScreenProps {
  onNavigate: (screen: ScreenId) => void;
  language: Language;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onNavigate,
  language,
}) => {
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [isGridActive, setIsGridActive] = useState(true);
  const [isUsingWebcam, setIsUsingWebcam] = useState(false);
  const [webcamAvailable, setWebcamAvailable] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showIdentifiedModal, setShowIdentifiedModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const t = translations[language];

  // Try checking webcam availability
  useEffect(() => {
    if (typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia)) {
      setWebcamAvailable(true);
    }
  }, []);

  const toggleWebcam = async () => {
    if (!isUsingWebcam) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsUsingWebcam(true);
        }
      } catch (err) {
        console.warn('Webcam permission denied or not available:', err);
        setIsUsingWebcam(false);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsUsingWebcam(false);
    }
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    setIsScanning(true);
    setStatusMessage(
      language === 'es'
        ? 'Analizando telemetría y especificaciones...'
        : language === 'ja'
        ? '車体幾何構造とナンバープレートを解析中...'
        : 'Analyzing telemetry and specifications...'
    );

    setTimeout(() => {
      setIsScanning(false);
      setShowIdentifiedModal(true);
    }, 1200);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsScanning(true);
      setStatusMessage(
        language === 'es'
          ? 'Procesando imagen de galería...'
          : language === 'ja'
          ? 'ギャラリー画像を解析中...'
          : 'Processing gallery image...'
      );
      setTimeout(() => {
        setIsScanning(false);
        setShowIdentifiedModal(true);
      }, 1000);
    }
  };

  const proceedToRadar = () => {
    setShowIdentifiedModal(false);
    onNavigate('analyzing');
  };

  return (
    <div className="flex-1 w-full px-4 pt-2 pb-8 flex flex-col space-y-4 max-w-lg mx-auto relative select-none">
      {/* Status pill & Quick Controls */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161c28]/90 backdrop-blur-md border border-white/5 shadow-sm">
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#47e266] animate-ping absolute"></span>
            <span className="w-2 h-2 rounded-full bg-[#47e266] relative"></span>
          </div>
          <span className="text-[11px] font-bold text-slate-200 uppercase tracking-widest font-headline">
            {t.hudAiOptic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Webcam Toggle */}
          {webcamAvailable && (
            <button
              onClick={toggleWebcam}
              aria-label="Toggle Live Webcam"
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-95 border ${
                isUsingWebcam
                  ? 'bg-[#47e266] text-black border-[#47e266]'
                  : 'bg-[#161c28]/90 text-slate-300 border-white/5 hover:text-white'
              }`}
              title="Activar Cámara Real"
            >
              {isUsingWebcam ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
          )}

          {/* Flashlight Toggle */}
          <button
            onClick={() => setIsFlashActive(!isFlashActive)}
            aria-label={t.toggleFlash}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-95 border ${
              isFlashActive
                ? 'bg-[#ff5545] text-white border-[#ff5545]'
                : 'bg-[#161c28]/90 text-slate-300 border-white/5 hover:text-white'
            }`}
          >
            <Flashlight className="w-4 h-4" />
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setIsGridActive(!isGridActive)}
            aria-label={t.toggleGrid}
            className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all active:scale-95 border ${
              isGridActive
                ? 'bg-[#161c28]/90 text-[#ffb4aa] border-[#ff5545]/30'
                : 'bg-[#161c28]/90 text-slate-500 border-white/5'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Central Camera HUD Viewport */}
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#080e1a] shadow-2xl flex items-center justify-center border border-white/10 group">
        {/* Camera Feed: Live Webcam OR Backdrop */}
        {isUsingWebcam ? (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className={`absolute inset-0 w-full h-full object-cover ${
              isFlashActive ? 'brightness-150 contrast-125' : ''
            }`}
          />
        ) : (
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
              isFlashActive ? 'opacity-80 brightness-125' : 'opacity-45'
            } scale-105`}
            style={{ backgroundImage: `url('${CAMERA_FEED_BG}')` }}
          />
        )}

        {/* Radial Optical Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080e1a] via-transparent to-[#080e1a]/80 pointer-events-none"></div>

        {/* Flash Simulation Overlay */}
        {isFlashActive && (
          <div className="absolute inset-0 bg-white/15 pointer-events-none transition-opacity"></div>
        )}

        {/* HUD SVG Reticle Grid */}
        {isGridActive && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <defs>
              <pattern id="scanGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(170, 199, 255, 0.18)" strokeWidth="0.8" />
              </pattern>
              <radialGradient id="radarPulseGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff5545" stopOpacity="0.2" />
                <stop offset="65%" stopColor="#ff5545" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ff5545" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#scanGrid)" />
            <circle cx="50%" cy="50%" r="130" fill="url(#radarPulseGlow)" />
            <circle cx="50%" cy="50%" r="110" fill="none" stroke="#ff5545" strokeDasharray="6 4" strokeOpacity="0.3" strokeWidth="1" />
            <circle cx="50%" cy="50%" r="70" fill="none" stroke="#aac7ff" strokeOpacity="0.2" strokeWidth="1" />
            {/* Center target crosshair */}
            <path d="M 50% 40% L 50% 46% M 50% 54% L 50% 60% M 42% 50% L 46% 50% M 54% 50% L 58% 50%" stroke="#ffb4aa" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        )}

        {/* Top Floating Instruction Badge */}
        <div className="absolute top-4 inset-x-4 flex justify-center pointer-events-none z-20">
          <div className="px-4 py-1.5 rounded-full bg-[#161c28]/80 backdrop-blur-xl border border-white/10 shadow-lg flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5545]" />
            <span className="text-xs text-white font-medium tracking-wide font-headline">
              {t.frameThreeQuarters}
            </span>
          </div>
        </div>

        {/* Scanning Target Box with High-Vis Red Framing Corners */}
        <div className="relative w-[86%] h-[74%] rounded-xl flex items-center justify-center p-4">
          {/* Glowing Red Corners */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#ff5545] shadow-[0_0_12px_rgba(255,85,69,0.8)] rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#ff5545] shadow-[0_0_12px_rgba(255,85,69,0.8)] rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#ff5545] shadow-[0_0_12px_rgba(255,85,69,0.8)] rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#ff5545] shadow-[0_0_12px_rgba(255,85,69,0.8)] rounded-br-lg"></div>

          {/* Live Laser Scan Beam (Vertical Sweep) */}
          <div className="absolute inset-x-3 h-0.5 bg-[#ff5545] shadow-[0_0_16px_4px_rgba(255,85,69,0.9)] opacity-85 z-10 animate-laser-sweep pointer-events-none"></div>

          {/* Wireframe Vector Guide of 3/4 Sports Bike */}
          <div className="w-full h-full flex flex-col items-center justify-center opacity-85 drop-shadow-[0_0_10px_rgba(255,180,170,0.35)]">
            <svg
              className="w-56 h-36 max-w-full text-[#ffb4aa]"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 200 120"
            >
              {/* Rear Wheel */}
              <circle cx="45" cy="85" r="22" strokeDasharray="4 2" strokeOpacity="0.8" />
              <circle cx="45" cy="85" r="10" strokeOpacity="0.4" />
              {/* Front Wheel */}
              <circle cx="160" cy="85" r="22" strokeDasharray="4 2" strokeOpacity="0.8" />
              <circle cx="160" cy="85" r="10" strokeOpacity="0.4" />
              {/* Chassis & Swingarm */}
              <path d="M45 85 L80 82 L105 60 L140 60 L160 85" strokeWidth="2.5" />
              <path d="M80 82 L95 90 L115 88" strokeOpacity="0.5" />
              {/* Fuel Tank & Fairing */}
              <path d="M78 52 C88 40, 110 38, 122 46 L135 34 L152 48 L142 66 L118 70 L95 68 Z" strokeWidth="2" />
              {/* Tail Section / Seat */}
              <path d="M40 50 L75 52 L90 62 L65 62 Z" strokeWidth="2" />
              {/* Aerodynamic Windshield */}
              <path d="M125 38 L138 24 L148 32" strokeWidth="1.8" />
              <path d="M132 30 L126 26" strokeWidth="2.5" />
              {/* Calipers and accents */}
              <line x1="56" y1="84" x2="88" y2="76" strokeWidth="3" strokeOpacity="0.6" />
              {/* Target lock indicator boxes */}
              <rect x="136" y="24" width="28" height="24" rx="4" fill="none" stroke="#47e266" strokeWidth="1" strokeDasharray="3 2" />
              <rect x="34" y="65" width="22" height="18" rx="2" fill="none" stroke="#aac7ff" strokeWidth="1" strokeDasharray="2 2" />
            </svg>

            <span className="mt-2 text-[10px] tracking-widest text-[#ffb4aa] uppercase bg-[#1a202c]/90 px-2.5 py-0.5 rounded-full border border-white/5 font-headline">
              {t.aiSilhouetteLock}
            </span>
          </div>

          {/* Real-time Dynamic Telemetry Badges on HUD */}
          <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-slate-300 text-[10px] font-headline">
            <div className="flex items-center gap-1.5 bg-[#080e1a]/85 backdrop-blur-md px-2 py-1 rounded border border-white/5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#47e266]" />
              <span className="text-white uppercase">{t.optimalDistance}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#080e1a]/85 backdrop-blur-md px-2 py-1 rounded border border-white/5">
              <span className="text-[#ff5545] font-bold">{t.fpsLabel}</span>
            </div>
          </div>
        </div>

        {/* Scanner Feedback Toast */}
        <div className="absolute bottom-3 px-3 py-1.5 rounded-full bg-[#161c28]/90 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-lg">
          <RefreshCw className={`w-3.5 h-3.5 text-[#ff5545] ${isScanning ? 'animate-spin' : ''}`} />
          <span className="text-[11px] text-slate-200 tracking-wider font-headline">
            {statusMessage || t.detectingGeometryPlate}
          </span>
        </div>
      </div>

      {/* Guidance Helper Note */}
      <div className="px-2 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#161c28] shrink-0 flex items-center justify-center text-[#ff5545] mt-0.5 border border-white/5">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {t.goodLightingTip}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5">
            {t.compatibleBikeTypes}
          </span>
        </div>
      </div>

      {/* Shutter Trigger & Gallery Button */}
      <div className="mt-2 flex flex-col items-center justify-center gap-3">
        {/* Prominent Crimson Shutter Trigger Button */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-[#ff5545]/20 animate-pulse pointer-events-none"></div>
          <div className="w-20 h-20 rounded-full bg-[#161c28]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl p-1.5">
            <button
              onClick={handleCapture}
              disabled={isScanning}
              aria-label={t.capturePhoto}
              className="w-full h-full rounded-full bg-gradient-to-b from-[#ff5545] to-[#c0000a] text-white shadow-[0_8px_24px_rgba(255,85,69,0.5)] flex items-center justify-center active:scale-90 transition-transform cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>

        {/* Gallery Pill Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full max-w-xs h-12 rounded-full bg-[#161c28]/80 hover:bg-[#242a37] text-white flex items-center justify-center gap-2 backdrop-blur-md shadow-md active:scale-95 transition-all border border-white/5 cursor-pointer"
        >
          <ImageIcon className="w-4 h-4 text-[#ff5545]" />
          <span className="text-sm font-semibold font-headline">{t.chooseFromGallery}</span>
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleGalleryUpload}
        />
      </div>

      {/* Quick Capture Success Modal / Match Notification */}
      {showIdentifiedModal && (
        <div className="fixed inset-x-4 bottom-20 z-50 p-4 rounded-2xl bg-[#161c28]/95 backdrop-blur-2xl border border-[#ff5545]/40 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="w-12 h-12 rounded-xl bg-[#47e266]/20 border border-[#47e266]/30 flex items-center justify-center text-[#47e266] shrink-0">
            <Check className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#47e266] uppercase tracking-wider font-headline">
                {t.bikeIdentified}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">98% {t.match}</span>
            </div>
            <p className="text-sm sm:text-base font-bold text-white font-headline truncate">
              Yamaha FZ 150 (2022)
            </p>
          </div>
          <button
            onClick={proceedToRadar}
            className="px-3.5 py-2 rounded-xl bg-[#ff5545] hover:bg-[#ff5545]/90 text-white font-headline text-xs font-bold shadow-lg flex items-center gap-1 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span>{t.continueBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
