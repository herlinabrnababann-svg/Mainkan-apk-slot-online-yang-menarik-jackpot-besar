import React from 'react';
import { GameThemeId } from '../types';
import { GAME_THEMES } from '../data/themes';
import { sound } from '../utils/audio';

interface HeaderBarProps {
  balance: number;
  currency: 'IDR' | 'USD';
  onToggleCurrency: () => void;
  onTopUp: () => void;
  currentThemeId: GameThemeId;
  onSelectTheme: (id: GameThemeId) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenPolaGacor: () => void;
  onOpenPaytable: () => void;
  onOpenHistory: () => void;
  onOpenInstallPWA: () => void;
  isInstalledPWA: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  balance,
  currency,
  onToggleCurrency,
  onTopUp,
  currentThemeId,
  onSelectTheme,
  isMuted,
  onToggleMute,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenPolaGacor,
  onOpenPaytable,
  onOpenHistory,
  onOpenInstallPWA,
  isInstalledPWA,
}) => {
  const currentTheme = GAME_THEMES[currentThemeId];

  const formatBalance = (val: number) => {
    if (currency === 'IDR') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <header className="w-full bg-[#0d041c]/95 border-b border-purple-900/60 backdrop-blur-md sticky top-0 z-40 px-2 sm:px-4 py-2">
      <div className="max-w-5xl mx-auto flex flex-col gap-2">
        {/* Top line: Brand Logo + Balance + Fast Tools */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-[0_0_12px_rgba(234,179,8,0.5)] border border-yellow-200">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-xs sm:text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 uppercase">
                  APK SLOT ONLINE
                </span>
                <span className="text-[9px] font-extrabold bg-red-600/90 text-white px-1.5 py-0.2 rounded-full font-mono">
                  DEMO
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>{currentTheme.name}</span>
                <span>•</span>
                <span className="text-yellow-400 font-mono font-bold">RTP {currentTheme.rtp}%</span>
              </div>
            </div>
          </div>

          {/* Balance & Top Up Box */}
          <div className="flex items-center gap-1.5 bg-black/60 border border-yellow-500/40 rounded-xl px-2.5 py-1 shadow-inner">
            <div className="text-right">
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                SALDO DEMO
              </div>
              <div className="text-xs sm:text-sm font-black font-mono text-yellow-300">
                {formatBalance(balance)}
              </div>
            </div>
            <button
              id="btn-top-up"
              onClick={() => {
                sound.playClick();
                onTopUp();
              }}
              title="Isi Saldo Gratis"
              className="bg-green-600 hover:bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider transition shadow cursor-pointer active:scale-95"
            >
              + ISI
            </button>
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-1">
            {/* Install APK / PWA button */}
            <button
              id="btn-install-apk"
              onClick={() => {
                sound.playClick();
                onOpenInstallPWA();
              }}
              title="Unduh APK / Pasang Aplikasi"
              className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:brightness-110 text-slate-950 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow cursor-pointer"
            >
              <span>📲</span>
              <span className="hidden sm:inline">{isInstalledPWA ? 'APK AKTIF' : 'PASANG APK'}</span>
            </button>

            {/* Live RTP Pola Gacor */}
            <button
              id="btn-pola-gacor"
              onClick={() => {
                sound.playClick();
                onOpenPolaGacor();
              }}
              title="Pola Gacor Hari Ini"
              className="bg-purple-900/60 hover:bg-purple-800 border border-purple-600/60 text-amber-300 p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
            >
              <span>🔥</span>
              <span className="hidden md:inline text-[10px]">POLA GACOR</span>
            </button>

            {/* Mobile / Fullscreen Frame toggle */}
            <button
              id="btn-toggle-frame"
              onClick={() => {
                sound.playClick();
                onToggleMobileFrame();
              }}
              title={isMobileFrame ? 'Tampilan Layar Penuh' : 'Tampilan HP Android APK'}
              className="bg-purple-900/60 hover:bg-purple-800 border border-purple-600/60 text-slate-300 p-1.5 rounded-lg text-xs transition cursor-pointer"
            >
              {isMobileFrame ? '🖥️' : '📱'}
            </button>

            {/* Audio Mute/Unmute */}
            <button
              id="btn-toggle-sound"
              onClick={() => {
                onToggleMute();
              }}
              title={isMuted ? 'Suara Mati' : 'Suara Nyala'}
              className="bg-purple-900/60 hover:bg-purple-800 border border-purple-600/60 text-slate-300 p-1.5 rounded-lg text-xs transition cursor-pointer"
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            {/* Paytable info */}
            <button
              id="btn-paytable-info"
              onClick={() => {
                sound.playClick();
                onOpenPaytable();
              }}
              title="Informasi Bayaran & Aturan"
              className="bg-purple-900/60 hover:bg-purple-800 border border-purple-600/60 text-slate-300 p-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              ℹ️
            </button>

            {/* History */}
            <button
              id="btn-history"
              onClick={() => {
                sound.playClick();
                onOpenHistory();
              }}
              title="Riwayat Putaran"
              className="bg-purple-900/60 hover:bg-purple-800 border border-purple-600/60 text-slate-300 p-1.5 rounded-lg text-xs transition cursor-pointer"
            >
              📋
            </button>
          </div>
        </div>

        {/* Bottom line: Game Theme Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {(['zeus', 'bonanza', 'mahjong'] as GameThemeId[]).map((themeId) => {
            const th = GAME_THEMES[themeId];
            const isActive = currentThemeId === themeId;
            return (
              <button
                key={themeId}
                id={`btn-theme-${themeId}`}
                onClick={() => {
                  sound.playClick();
                  onSelectTheme(themeId);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.4)]'
                    : 'bg-black/40 border-purple-900/60 text-slate-400 hover:text-white hover:border-purple-600'
                }`}
              >
                <span>
                  {themeId === 'zeus' ? '⚡' : themeId === 'bonanza' ? '🍭' : '🀄'}
                </span>
                <span>{th.name}</span>
              </button>
            );
          })}

          {/* Currency toggle */}
          <button
            id="btn-toggle-currency"
            onClick={() => {
              sound.playClick();
              onToggleCurrency();
            }}
            className="ml-auto px-2 py-1 rounded-lg bg-purple-950/80 border border-purple-700/60 text-[10px] font-mono font-bold text-amber-300 hover:border-amber-400 transition cursor-pointer"
          >
            MATA UANG: {currency}
          </button>
        </div>
      </div>
    </header>
  );
};
