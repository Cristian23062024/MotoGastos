import React from 'react';
import { DeviceType } from '../types';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceSimulatorProps {
  deviceType: DeviceType;
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  deviceType,
  children,
}) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  if (deviceType === 'fullscreen') {
    return (
      <div className="w-full min-h-screen bg-[#0d131f] flex flex-col justify-start items-center">
        <div className="w-full max-w-md min-h-screen flex flex-col bg-[#0d131f] relative shadow-2xl">
          {children}
        </div>
      </div>
    );
  }

  const isIphone = deviceType === 'iphone';
  const widthClass = isIphone ? 'max-w-[400px]' : 'max-w-[380px]';

  return (
    <div className="min-h-screen w-full bg-[#070b13] flex items-center justify-center p-2 sm:p-6 transition-all duration-300">
      {/* Outer Phone Shell */}
      <div
        className={`w-full ${widthClass} bg-[#121622] rounded-[48px] p-2.5 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)] relative border-4 border-[#242a37] flex flex-col overflow-hidden transition-all duration-300`}
        style={{ minHeight: '844px', maxHeight: '92vh' }}
      >
        {/* Dynamic Island / Camera Notch */}
        {isIphone ? (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black w-28 h-6 rounded-full flex items-center justify-end px-2 gap-1.5 shadow-md border border-white/5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#162032] border border-white/10"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5545] animate-ping opacity-60"></span>
          </div>
        ) : (
          <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-50 bg-black w-3.5 h-3.5 rounded-full border border-white/10"></div>
        )}

        {/* Realistic Mobile Status Bar */}
        <div className="h-10 w-full px-7 pt-2 flex items-center justify-between text-xs text-slate-300 select-none z-40 shrink-0">
          <span className="font-semibold text-[13px] tracking-tight text-white">{currentTime}</span>
          <div className="flex items-center gap-1.5 opacity-90">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px] font-bold">88%</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Content Container with Smooth Scroll */}
        <div className="w-full flex-1 overflow-y-auto overflow-x-hidden no-scrollbar rounded-[38px] bg-[#0d131f] flex flex-col relative">
          {children}

          {/* Bottom Native Home Indicator Bar */}
          <div className="w-full py-2 flex items-center justify-center shrink-0 mt-auto bg-[#0d131f]/60 backdrop-blur-md">
            <div className="w-32 h-1 bg-white/25 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
