/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenId, Language, ThemeMode, DeviceType, Motorcycle } from './types';
import { Header } from './components/Header';
import { DeviceSimulator } from './components/DeviceSimulator';
import { FlutterCodeModal } from './components/FlutterCodeModal';
import { HomeScreen } from './screens/HomeScreen';
import { ScanScreen } from './screens/ScanScreen';
import { AnalyzingScreen } from './screens/AnalyzingScreen';
import { SpecsScreen } from './screens/SpecsScreen';
import { ExpensesScreen } from './screens/ExpensesScreen';
import { YAMAHA_R15_V4, YAMAHA_FZ_150 } from './data/motorcycles';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('home');
  const [language, setLanguage] = useState<Language>('es');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [deviceType, setDeviceType] = useState<DeviceType>('iphone');
  const [currentMotorcycle, setCurrentMotorcycle] = useState<Motorcycle>(YAMAHA_R15_V4);
  const [isFlutterModalOpen, setIsFlutterModalOpen] = useState(false);

  // Sync dark class on root html
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (screen: ScreenId) => {
    // When going to specs or expenses, switch to Yamaha FZ 150 to match the exact mockups
    if (screen === 'specs' || screen === 'expenses') {
      setCurrentMotorcycle(YAMAHA_FZ_150);
    }
    setCurrentScreen(screen);
  };

  return (
    <div className={`min-h-screen w-full ${themeMode === 'dark' ? 'bg-[#070b13]' : 'bg-[#e2e8f0]'} flex flex-col transition-colors duration-300 font-sans`}>
      <DeviceSimulator deviceType={deviceType}>
        <Header
          currentScreen={currentScreen}
          onNavigate={handleNavigate}
          language={language}
          onLanguageChange={setLanguage}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          deviceType={deviceType}
          onDeviceChange={setDeviceType}
          onOpenFlutterCode={() => setIsFlutterModalOpen(true)}
        />

        {/* Animated Screen Container */}
        <main className="flex-1 flex flex-col relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col w-full"
            >
              {currentScreen === 'home' && (
                <HomeScreen
                  currentMotorcycle={currentMotorcycle}
                  onSelectMotorcycle={setCurrentMotorcycle}
                  onNavigate={handleNavigate}
                  language={language}
                />
              )}

              {currentScreen === 'scan' && (
                <ScanScreen
                  onNavigate={handleNavigate}
                  language={language}
                />
              )}

              {currentScreen === 'analyzing' && (
                <AnalyzingScreen
                  onNavigate={handleNavigate}
                  language={language}
                />
              )}

              {currentScreen === 'specs' && (
                <SpecsScreen
                  motorcycle={currentMotorcycle}
                  onNavigate={handleNavigate}
                  language={language}
                />
              )}

              {currentScreen === 'expenses' && (
                <ExpensesScreen
                  motorcycle={currentMotorcycle}
                  onNavigate={handleNavigate}
                  language={language}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </DeviceSimulator>

      {/* Complete Flutter & Dart Source Code Viewer Modal */}
      <FlutterCodeModal
        isOpen={isFlutterModalOpen}
        onClose={() => setIsFlutterModalOpen(false)}
        language={language}
      />
    </div>
  );
}
