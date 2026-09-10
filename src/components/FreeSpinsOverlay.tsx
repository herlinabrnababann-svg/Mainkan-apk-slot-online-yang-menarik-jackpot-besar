import React from 'react';
import { sound } from '../utils/audio';

interface FreeSpinsIntroProps {
  spinsCount: number;
  onStart: () => void;
}

export const FreeSpinsIntro: React.FC<FreeSpinsIntroProps> = ({ spinsCount, onStart }) => {
  return (
    <div
      id="freespins-intro-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
    >
      <div className="max-w-sm w-full text-center p-6 rounded-3xl bg-gradient-to-b from-[#330852] to-[#120324] border-2 border-yellow-400 shadow-[0_0_60px_rgba(234,179,8,0.5)] animate-in zoom-in-90">
        <div className="text-5xl mb-3 animate-bounce">⚡⚡⚡</div>
        <div className="inline-block px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-wider bg-yellow-400 text-slate-950 mb-2">
          FITUR BONUS AKTIF
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 uppercase tracking-tight">
          SELAMAT!
        </h2>
        <p className="mt-2 text-sm text-slate-200">
          Anda berhasil mendapatkan <span className="text-yellow-400 font-bold font-mono">{spinsCount}</span> Putaran Gratis!
        </p>
        <p className="text-xs text-amber-300/90 mt-1">
          Semua pengali petir akan diakumulasikan sepanjang ronde bonus!
        </p>

        <button
          id="btn-start-freespins"
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="mt-6 w-full py-3 px-6 rounded-xl font-black text-slate-950 uppercase tracking-wider bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(234,179,8,0.4)] cursor-pointer"
        >
          MULAI PUTARAN GRATIS
        </button>
      </div>
    </div>
  );
};

interface FreeSpinsSummaryProps {
  totalWin: number;
  currency: 'IDR' | 'USD';
  multiplier: number;
  onCollect: () => void;
}

export const FreeSpinsSummary: React.FC<FreeSpinsSummaryProps> = ({
  totalWin,
  currency,
  multiplier,
  onCollect,
}) => {
  const formatCurrency = (val: number) => {
    if (currency === 'IDR') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div
      id="freespins-summary-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
    >
      <div className="max-w-sm w-full text-center p-6 rounded-3xl bg-gradient-to-b from-[#330852] to-[#120324] border-2 border-yellow-400 shadow-[0_0_60px_rgba(234,179,8,0.5)] animate-in zoom-in-90">
        <div className="text-4xl mb-2">🎉🏆🎉</div>
        <h2 className="text-xl sm:text-2xl font-black text-yellow-300 uppercase tracking-tight">
          PUTARAN GRATIS SELESAI
        </h2>
        <div className="text-xs text-slate-300 mt-1">
          Pengali Global Terkumpul: <span className="text-amber-400 font-mono font-bold">{multiplier}x</span>
        </div>

        <div className="my-5 p-4 rounded-2xl bg-black/60 border border-yellow-500/40">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            TOTAL KEMENANGAN BONUS
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-500 font-mono mt-1">
            {formatCurrency(totalWin)}
          </div>
        </div>

        <button
          id="btn-collect-freespins"
          onClick={() => {
            sound.playClick();
            onCollect();
          }}
          className="w-full py-3 px-6 rounded-xl font-black text-slate-950 uppercase tracking-wider bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(234,179,8,0.4)] cursor-pointer"
        >
          KLAIM HADIAH
        </button>
      </div>
    </div>
  );
};

interface FreeSpinsBannerProps {
  currentSpin: number;
  totalSpins: number;
  globalMultiplier: number;
  totalAccumulatedWin: number;
  currency: 'IDR' | 'USD';
}

export const FreeSpinsBanner: React.FC<FreeSpinsBannerProps> = ({
  currentSpin,
  totalSpins,
  globalMultiplier,
  totalAccumulatedWin,
  currency,
}) => {
  const formatCurrency = (val: number) => {
    if (currency === 'IDR') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="w-full max-w-[580px] mx-auto mb-2 p-2 rounded-xl bg-gradient-to-r from-purple-950 via-amber-950 to-purple-950 border-2 border-yellow-400 shadow-[0_0_25px_rgba(234,179,8,0.3)] flex items-center justify-between text-xs font-bold">
      <div className="flex items-center gap-1.5">
        <span className="text-amber-400 animate-spin">⚡</span>
        <span className="text-slate-200">
          SPIN: <span className="font-mono text-yellow-300">{currentSpin}/{totalSpins}</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-lg border border-yellow-500/50">
        <span className="text-[10px] text-slate-400 uppercase">PENGALI:</span>
        <span className="font-mono text-yellow-300 font-extrabold text-sm">{globalMultiplier}x</span>
      </div>

      <div className="text-right">
        <div className="text-[9px] text-slate-400 uppercase">MENANG BONUS</div>
        <div className="font-mono text-green-400 text-xs font-extrabold">
          {formatCurrency(totalAccumulatedWin)}
        </div>
      </div>
    </div>
  );
};
