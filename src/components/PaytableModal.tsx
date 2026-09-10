import React from 'react';
import { GameTheme } from '../types';

interface PaytableModalProps {
  theme: GameTheme;
  bet: number;
  currency: 'IDR' | 'USD';
  onClose: () => void;
}

export const PaytableModal: React.FC<PaytableModalProps> = ({
  theme,
  bet,
  currency,
  onClose,
}) => {
  const formatVal = (multiplier: number) => {
    const val = bet * multiplier;
    if (currency === 'IDR') {
      return `Rp ${val.toLocaleString('id-ID')}`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div
      id="modal-paytable"
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
            <span className="text-2xl">📖</span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 uppercase tracking-wide">
                TABEL PEMBAYARAN
              </h2>
              <p className="text-[11px] text-slate-400">
                Nilai bayaran berdasarkan taruhan saat ini
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

        {/* Scatter Rule Card */}
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-purple-900/40 border border-yellow-400/50 flex items-center gap-3">
          <div className="text-4xl animate-bounce">{theme.scatterSymbol.emoji}</div>
          <div className="text-xs">
            <div className="font-black text-amber-300 uppercase">
              {theme.scatterSymbol.name} (FITUR BONUS)
            </div>
            <div className="text-slate-300 text-[11px] mt-0.5">
              4 atau lebih simbol Scatter memicu <span className="text-yellow-400 font-bold">15 Putaran Gratis</span>!
            </div>
            <div className="text-[10px] font-mono text-amber-400 mt-1">
              4x = {formatVal(3)} • 5x = {formatVal(5)} • 6x = {formatVal(100)}
            </div>
          </div>
        </div>

        {/* Regular Symbols Grid */}
        <div className="space-y-2 mb-4">
          <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
            Simbol & Nilai Kelipatan (8+ Cocok di Mana Saja)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {theme.symbols.map((symbol) => (
              <div
                key={symbol.id}
                className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center gap-2.5 text-xs"
              >
                <div className="text-3xl">{symbol.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-200 truncate">{symbol.name}</div>
                  <div className="grid grid-cols-3 gap-1 font-mono text-[10px] text-slate-400 mt-1">
                    <div>
                      <span className="text-slate-500">8-9: </span>
                      <span className="text-yellow-400 font-bold">{formatVal(symbol.payouts['8-9'])}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">10-11: </span>
                      <span className="text-yellow-400 font-bold">{formatVal(symbol.payouts['10-11'])}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">12+: </span>
                      <span className="text-green-400 font-bold">{formatVal(symbol.payouts['12+'])}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Game Rules */}
        <div className="p-3 rounded-xl bg-black/40 border border-purple-900/60 text-[11px] text-slate-300 space-y-1.5">
          <h4 className="font-bold text-amber-400 uppercase">Aturan Main Pay Anywhere:</h4>
          <p>
            • Simbol membayar di posisi manapun di layar (6 Kolom x 5 Baris). Jumlah total simbol sejenis yang sama menentukan nilai kemenangan.
          </p>
          <p>
            • <strong>Fitur Runtuhan (Tumble)</strong>: Simbol yang menang akan meledak dan menghilang. Simbol di atasnya akan jatuh mengisi kekosongan, dan simbol baru turun dari atas.
          </p>
          <p>
            • <strong>Simbol Pengali (Petir Zeus)</strong>: Memiliki nilai pengali acak dari 2x hingga 500x. Di akhir runtuhan, semua pengali dijumlahkan dan dikalikan dengan total kemenangan!
          </p>
        </div>
      </div>
    </div>
  );
};
