import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface WinCelebrationProps {
  winAmount: number;
  betAmount: number;
  currency: 'IDR' | 'USD';
  onClose: () => void;
}

export const WinCelebration: React.FC<WinCelebrationProps> = ({
  winAmount,
  betAmount,
  currency,
  onClose,
}) => {
  const [displayedAmount, setDisplayedAmount] = useState(0);
  const ratio = betAmount > 0 ? winAmount / betAmount : 0;

  let title = 'BIG WIN';
  let badgeColor = 'from-amber-400 to-yellow-600';
  let isMaxWin = ratio >= 2000;

  if (isMaxWin) {
    title = '⚡ MAXWIN 5000X ⚡';
    badgeColor = 'from-yellow-300 via-amber-400 to-red-500';
  } else if (ratio >= 50) {
    title = '🔥 SENSATIONAL WIN 🔥';
    badgeColor = 'from-red-500 via-pink-500 to-purple-600';
  } else if (ratio >= 20) {
    title = '✨ MEGA WIN ✨';
    badgeColor = 'from-purple-500 via-indigo-500 to-blue-500';
  }

  useEffect(() => {
    sound.playBigWin();

    // Trigger confetti fireworks
    try {
      confetti({
        particleCount: isMaxWin ? 150 : 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFE259', '#FFA751', '#ff416c', '#00f2fe', '#ffffff'],
      });
    } catch {
      // safe fallback
    }

    const duration = 2000;
    const steps = 30;
    const stepTime = duration / steps;
    const increment = winAmount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= winAmount) {
        setDisplayedAmount(winAmount);
        clearInterval(timer);
      } else {
        setDisplayedAmount(Math.floor(current));
        sound.playCoinTick();
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [winAmount, isMaxWin]);

  const formatCurrency = (val: number) => {
    if (currency === 'IDR') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div
      id="win-celebration-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full text-center p-8 rounded-3xl bg-gradient-to-b from-[#1c0f38] to-[#0d051f] border-2 border-yellow-400/80 shadow-[0_0_80px_rgba(234,179,8,0.4)] transform animate-in zoom-in-90 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow halo */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-yellow-500 via-purple-500 to-amber-500 opacity-40 blur-xl animate-pulse pointer-events-none" />

        {/* Crown icon */}
        <div className="relative mb-3 flex justify-center text-5xl animate-bounce">
          👑
        </div>

        {/* Badge Title */}
        <div
          className={`inline-block px-6 py-2 rounded-full font-black text-xl md:text-2xl text-white uppercase tracking-wider bg-gradient-to-r ${badgeColor} shadow-lg border border-white/30`}
        >
          {title}
        </div>

        {/* Multiplier Tag */}
        <div className="mt-3 text-sm font-bold text-amber-300 tracking-wider">
          {ratio.toFixed(1)}x DARI TOTAL TARUHAN
        </div>

        {/* Dynamic Amount Counter */}
        <div className="my-6">
          <div className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-mono tracking-tight">
            {formatCurrency(displayedAmount)}
          </div>
        </div>

        {/* Tap to continue */}
        <button
          id="btn-claim-win"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl font-black text-slate-950 uppercase tracking-wider bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 hover:brightness-110 active:scale-98 transition shadow-[0_0_25px_rgba(234,179,8,0.5)] cursor-pointer"
        >
          KLAIM KEMENANGAN
        </button>
      </div>
    </div>
  );
};
