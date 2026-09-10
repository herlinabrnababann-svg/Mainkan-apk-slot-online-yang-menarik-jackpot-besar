import React, { useState } from 'react';
import { GameTheme } from '../types';
import { sound } from '../utils/audio';

interface PolaGacorModalProps {
  theme: GameTheme;
  onClose: () => void;
  onApplyPola?: (polaName: string) => void;
}

export const PolaGacorModal: React.FC<PolaGacorModalProps> = ({
  theme,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const polasList = [
    {
      name: 'Pola Zeus Petir Merah',
      steps: [
        '10x Manual (DC OFF) ⚡',
        '20x Turbo Spin (DC ON) 🔥',
        '30x Spin Cepat (DC ON) ⚡',
        'Beli Spin Gratis (Fitur Beli) 🎁',
      ],
      winRate: '98.8%',
      status: 'SANGAT GACOR',
    },
    {
      name: 'Pola Tumble Maxwin Anti Rungkad',
      steps: [
        '15x Spin Cepat (DC ON) ⚡',
        '10x Spin Manual Santai 🎲',
        '50x Turbo Spin Otomatis 🚀',
      ],
      winRate: '97.6%',
      status: 'GACOR STABIL',
    },
  ];

  const jamGacor = [
    { time: '00:30 - 02:45 WIB', rtp: '98.5%', status: '🔥 Gacor Parah' },
    { time: '08:15 - 10:30 WIB', rtp: '97.2%', status: '⚡ Stabil' },
    { time: '13:00 - 15:45 WIB', rtp: '98.9%', status: '🔥 Jackpot Tinggi' },
    { time: '19:30 - 22:00 WIB', rtp: '99.1%', status: '👑 Puncak Maxwin' },
  ];

  const handleCopyPola = () => {
    sound.playClick();
    const text = `Pola Gacor ${theme.name} Hari Ini:\n10x Manual DC OFF\n20x Turbo DC ON\n30x Spin Cepat DC ON\nBeli Free Spin`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="modal-pola-gacor"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#1c0c36] to-[#0b0318] border-2 border-yellow-500/60 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide">
                RTP LIVE & POLA GACOR
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                {theme.name} ({theme.provider})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-purple-900/60 hover:bg-purple-800 text-slate-300 flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Live RTP Gauge Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/80 to-amber-950/50 border border-yellow-500/40 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase">
              RTP LIVE TERUPDATE
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/20 text-green-300 border border-green-500/40 animate-pulse">
              ONLINE
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-green-400">
              98.74%
            </span>
            <span className="text-xs font-bold text-green-400">▲ +1.2% Sangat Tinggi</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900/80 rounded-full h-2.5 mt-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-green-400 h-full rounded-full transition-all duration-1000"
              style={{ width: '98.74%' }}
            />
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between">
            <span>Volatilitas: {theme.volatility}</span>
            <span>Update: Baru saja</span>
          </div>
        </div>

        {/* Pola Rekomendasi Hari Ini */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
              ⭐ Rekomendasi Pola Gacor
            </h3>
            <button
              onClick={handleCopyPola}
              className="text-[10px] text-yellow-400 hover:underline font-bold"
            >
              {copied ? '✓ Disalin!' : 'Salin Pola'}
            </button>
          </div>

          <div className="space-y-2">
            {polasList.map((pola, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs"
              >
                <div className="flex items-center justify-between font-bold mb-1.5">
                  <span className="text-slate-200">{pola.name}</span>
                  <span className="text-green-400 font-mono text-[11px] bg-green-950/60 px-1.5 py-0.5 rounded border border-green-700/50">
                    Winrate {pola.winRate}
                  </span>
                </div>
                <ul className="space-y-1 text-slate-300 text-[11px]">
                  {pola.steps.map((st, sIdx) => (
                    <li key={sIdx} className="flex items-center gap-1.5 font-mono">
                      <span className="text-yellow-400 text-[10px]">▶</span> {st}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Jam Hoki / Jam Gacor */}
        <div>
          <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider mb-2">
            🕒 Jam Hoki Main (WIB)
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {jamGacor.map((j, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-black/40 border border-purple-800/30 flex flex-col justify-between"
              >
                <div className="font-mono text-slate-300 text-[11px] font-bold">{j.time}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-yellow-400 font-mono font-extrabold">{j.rtp}</span>
                  <span className="text-[9px] text-green-300">{j.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-4 pt-3 border-t border-purple-800/40 text-[10px] text-slate-400 text-center">
          *Simulator demo ini ditujukan untuk hiburan semata dengan saldo virtual gratis tanpa uang asli.
        </div>
      </div>
    </div>
  );
};
