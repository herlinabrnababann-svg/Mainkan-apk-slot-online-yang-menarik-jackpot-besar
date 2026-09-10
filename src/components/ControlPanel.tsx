import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface ControlPanelProps {
  bet: number;
  onBetChange: (newBet: number) => void;
  currency: 'IDR' | 'USD';
  doubleChance: boolean;
  onToggleDoubleChance: () => void;
  turbo: boolean;
  onToggleTurbo: () => void;
  autoSpinsRemaining: number;
  onStartAutoSpin: (count: number) => void;
  onStopAutoSpin: () => void;
  onBuyFreeSpins: () => void;
  onSpin: () => void;
  isSpinning: boolean;
  isFreeSpinsActive: boolean;
  canAffordSpin: boolean;
}

const IDR_PRESETS = [200, 400, 800, 1200, 2400, 5000, 10000, 25000, 50000];
const USD_PRESETS = [0.2, 0.4, 0.8, 1.2, 2.4, 5.0, 10.0, 25.0, 50.0];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  bet,
  onBetChange,
  currency,
  doubleChance,
  onToggleDoubleChance,
  turbo,
  onToggleTurbo,
  autoSpinsRemaining,
  onStartAutoSpin,
  onStopAutoSpin,
  onBuyFreeSpins,
  onSpin,
  isSpinning,
  isFreeSpinsActive,
  canAffordSpin,
}) => {
  const [showAutoModal, setShowAutoModal] = useState(false);
  const [showBetModal, setShowBetModal] = useState(false);

  const presets = currency === 'IDR' ? IDR_PRESETS : USD_PRESETS;
  const effectiveBet = doubleChance ? Math.round(bet * 1.25) : bet;
  const buyCost = bet * 100;

  const formatCurrency = (val: number) => {
    if (currency === 'IDR') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const stepUp = () => {
    sound.playClick();
    const curIdx = presets.indexOf(bet);
    if (curIdx !== -1 && curIdx < presets.length - 1) {
      onBetChange(presets[curIdx + 1]);
    } else {
      onBetChange(presets[presets.length - 1]);
    }
  };

  const stepDown = () => {
    sound.playClick();
    const curIdx = presets.indexOf(bet);
    if (curIdx > 0) {
      onBetChange(presets[curIdx - 1]);
    } else {
      onBetChange(presets[0]);
    }
  };

  return (
    <div className="w-full max-w-[580px] mx-auto mt-2 space-y-2 select-none">
      {/* Top action row: Double Chance + Buy Free Spins */}
      {!isFreeSpinsActive && (
        <div className="grid grid-cols-2 gap-2">
          {/* Double Chance (Taruhan Ganda) */}
          <button
            id="btn-double-chance"
            onClick={() => {
              sound.playClick();
              onToggleDoubleChance();
            }}
            disabled={isSpinning}
            className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
              doubleChance
                ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-black/40 border-purple-800/40 text-slate-300 hover:border-purple-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider uppercase flex items-center gap-1">
                ⚡ TARUHAN GANDA (DC)
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  doubleChance ? 'bg-amber-500 text-black' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {doubleChance ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Peluang Scatter 2x lipat (+25% taruhan)
            </div>
          </button>

          {/* Buy Free Spins (Beli Putaran Gratis) */}
          <button
            id="btn-buy-freespins"
            onClick={() => {
              sound.playClick();
              onBuyFreeSpins();
            }}
            disabled={isSpinning}
            className="p-2 rounded-xl text-left border border-yellow-500/60 bg-gradient-to-r from-yellow-600/30 to-amber-600/30 hover:brightness-125 transition-all text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.2)] active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black tracking-wider uppercase">
                🎁 BELI FITUR SPIN
              </span>
              <span className="text-[10px] bg-yellow-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
                100x
              </span>
            </div>
            <div className="text-xs font-mono font-bold text-white mt-1">
              {formatCurrency(buyCost)}
            </div>
          </button>
        </div>
      )}

      {/* Main control console */}
      <div className="p-2 md:p-3 rounded-2xl bg-gradient-to-b from-[#1c0f38] to-[#0c0419] border border-yellow-500/40 shadow-xl flex items-center justify-between gap-2">
        {/* Bet adjuster */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            TOTAL TARUHAN {doubleChance && <span className="text-amber-400 font-mono">(+25%)</span>}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <button
              id="btn-bet-minus"
              onClick={stepDown}
              disabled={isSpinning || isFreeSpinsActive}
              className="w-8 h-8 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-yellow-300 border border-purple-700 flex items-center justify-center font-bold text-base cursor-pointer disabled:opacity-40"
            >
              -
            </button>
            <button
              id="btn-bet-display"
              onClick={() => {
                sound.playClick();
                setShowBetModal(true);
              }}
              disabled={isSpinning || isFreeSpinsActive}
              className="px-2.5 py-1 rounded-lg bg-black/60 border border-yellow-500/30 font-mono font-black text-sm md:text-base text-yellow-300 hover:border-yellow-400 transition"
            >
              {formatCurrency(effectiveBet)}
            </button>
            <button
              id="btn-bet-plus"
              onClick={stepUp}
              disabled={isSpinning || isFreeSpinsActive}
              className="w-8 h-8 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-yellow-300 border border-purple-700 flex items-center justify-center font-bold text-base cursor-pointer disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        {/* Turbo & Auto buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-toggle-turbo"
            onClick={() => {
              sound.playClick();
              onToggleTurbo();
            }}
            disabled={isSpinning && autoSpinsRemaining === 0}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center min-w-[54px] cursor-pointer ${
              turbo
                ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'bg-black/50 border-purple-800/40 text-slate-400 hover:text-white'
            }`}
          >
            <span>⚡ TURBO</span>
            <span className="text-[9px] font-mono">{turbo ? 'ON' : 'OFF'}</span>
          </button>

          <button
            id="btn-toggle-auto"
            onClick={() => {
              sound.playClick();
              if (autoSpinsRemaining > 0) {
                onStopAutoSpin();
              } else {
                setShowAutoModal(true);
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center min-w-[54px] cursor-pointer ${
              autoSpinsRemaining > 0
                ? 'bg-red-500/30 border-red-400 text-red-300 animate-pulse'
                : 'bg-black/50 border-purple-800/40 text-slate-400 hover:text-white'
            }`}
          >
            <span>🔄 AUTO</span>
            <span className="text-[9px] font-mono">
              {autoSpinsRemaining > 0 ? `${autoSpinsRemaining}x` : 'OFF'}
            </span>
          </button>
        </div>

        {/* Big Tactile Spin Button */}
        <button
          id="btn-main-spin"
          onClick={() => {
            sound.playSpin();
            onSpin();
          }}
          disabled={isSpinning || !canAffordSpin}
          className={`relative group w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.5)] border-2 border-yellow-200 transition-all cursor-pointer ${
            isSpinning
              ? 'bg-slate-700 opacity-60 cursor-not-allowed scale-95'
              : 'bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-200 hover:brightness-110 active:scale-90'
          }`}
        >
          {/* Animated glow ring */}
          <span className="absolute -inset-1 rounded-full bg-yellow-400 opacity-50 blur-sm group-hover:opacity-100 transition duration-300" />
          <span className="relative flex flex-col items-center justify-center text-slate-950 font-black">
            <span className="text-xl md:text-2xl leading-none">↻</span>
            <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-tighter">
              SPIN
            </span>
          </span>
        </button>
      </div>

      {/* Auto Spin Modal */}
      {showAutoModal && (
        <div
          id="modal-auto-spin"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setShowAutoModal(false)}
        >
          <div
            className="bg-gradient-to-b from-[#1e0f38] to-[#0d051f] border border-yellow-500/50 p-5 rounded-2xl max-w-xs w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-black text-amber-300 text-center uppercase tracking-wider mb-4">
              Pilih Jumlah Auto Spin
            </h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[10, 20, 50, 100].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    sound.playClick();
                    onStartAutoSpin(count);
                    setShowAutoModal(false);
                  }}
                  className="py-2.5 rounded-xl font-mono font-bold text-sm bg-purple-950/70 border border-purple-700/60 hover:border-yellow-400 hover:bg-yellow-400 hover:text-slate-950 transition cursor-pointer"
                >
                  {count} Putaran
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAutoModal(false)}
              className="w-full py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 transition cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Quick Bet Preset Modal */}
      {showBetModal && (
        <div
          id="modal-bet-preset"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setShowBetModal(false)}
        >
          <div
            className="bg-gradient-to-b from-[#1e0f38] to-[#0d051f] border border-yellow-500/50 p-5 rounded-2xl max-w-xs w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-black text-amber-300 text-center uppercase tracking-wider mb-3">
              Pilih Nilai Taruhan
            </h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {presets.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    sound.playClick();
                    onBetChange(amt);
                    setShowBetModal(false);
                  }}
                  className={`py-2 px-1 rounded-xl font-mono font-bold text-xs border transition cursor-pointer ${
                    bet === amt
                      ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                      : 'bg-purple-950/70 border-purple-700/60 text-slate-200 hover:border-yellow-400'
                  }`}
                >
                  {currency === 'IDR' ? (amt >= 1000 ? `${amt / 1000}k` : amt) : `$${amt}`}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowBetModal(false)}
              className="w-full py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/60 transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
