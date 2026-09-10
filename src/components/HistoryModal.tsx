import React from 'react';
import { SpinHistoryItem } from '../types';
import { GAME_THEMES } from '../data/themes';

interface HistoryModalProps {
  history: SpinHistoryItem[];
  currency: 'IDR' | 'USD';
  onClear: () => void;
  onClose: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  history,
  currency,
  onClear,
  onClose,
}) => {
  const formatCurrency = (val: number) => {
    if (currency === 'IDR') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const totalBet = history.reduce((acc, cur) => acc + cur.bet, 0);
  const totalWon = history.reduce((acc, cur) => acc + cur.win, 0);
  const netProfit = totalWon - totalBet;

  return (
    <div
      id="modal-history"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full max-h-[90vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#1c0c36] to-[#0b0318] border-2 border-yellow-500/60 p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800/60 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide">
                RIWAYAT PUTARAN
              </h2>
              <p className="text-[11px] text-slate-400">
                Log putaran dan perolehan sesi permainan
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

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/50 border border-purple-900/60 mb-3 text-center text-xs">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Taruhan</div>
            <div className="font-mono text-slate-200 font-bold mt-0.5">{formatCurrency(totalBet)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Total Menang</div>
            <div className="font-mono text-yellow-400 font-bold mt-0.5">{formatCurrency(totalWon)}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">Laba / Rugi</div>
            <div
              className={`font-mono font-bold mt-0.5 ${
                netProfit >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {netProfit >= 0 ? '+' : ''}
              {formatCurrency(netProfit)}
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[220px]">
          {history.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs">
              <span>Belum ada riwayat putaran.</span>
              <span className="mt-1">Putar slot untuk mencatat riwayat permainan.</span>
            </div>
          ) : (
            history.map((item) => {
              const th = GAME_THEMES[item.themeId];
              const isProfit = item.win >= item.bet;
              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-300">
                      <span>{th ? th.name : item.themeId}</span>
                      {item.isFreeSpin && (
                        <span className="text-[9px] bg-yellow-400/20 text-yellow-300 border border-yellow-400/40 px-1 rounded font-mono">
                          FREE SPIN
                        </span>
                      )}
                      {item.isBonusBuy && (
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1 rounded font-mono">
                          BELI FITUR
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {item.timestamp.toLocaleTimeString('id-ID')} • Taruhan: {formatCurrency(item.bet)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`font-mono font-bold text-xs ${
                        isProfit ? 'text-green-400' : 'text-slate-400'
                      }`}
                    >
                      {item.win > 0 ? `+${formatCurrency(item.win)}` : 'Rp 0'}
                    </div>
                    {item.multiplier > 1 && (
                      <div className="text-[10px] font-mono text-amber-400">
                        {item.multiplier}x Pengali
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-purple-800/40 flex justify-end">
            <button
              onClick={onClear}
              className="text-[11px] text-red-400 hover:text-red-300 font-bold cursor-pointer"
            >
              Hapus Riwayat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
