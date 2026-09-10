import React from 'react';
import { GameTheme, SlotSymbol } from '../types';

export interface MultiplierOrb {
  row: number;
  col: number;
  value: number;
}

interface SlotGridProps {
  grid: SlotSymbol[][];
  winningPositions: { row: number; col: number }[];
  multiplierOrbs: MultiplierOrb[];
  isSpinning: boolean;
  isTumbling: boolean;
  theme: GameTheme;
  scatterCount: number;
  currentWinText: string | null;
  lightningActive: boolean;
}

export const SlotGrid: React.FC<SlotGridProps> = ({
  grid,
  winningPositions,
  multiplierOrbs,
  isSpinning,
  isTumbling,
  theme,
  scatterCount,
  currentWinText,
  lightningActive,
}) => {
  const isWinningCell = (r: number, c: number) =>
    winningPositions.some((p) => p.row === r && p.col === c);

  const getMultiplier = (r: number, c: number) =>
    multiplierOrbs.find((o) => o.row === r && o.col === c);

  return (
    <div className="relative w-full max-w-[580px] mx-auto select-none">
      {/* Outer Golden Frame */}
      <div className="relative rounded-2xl p-2 md:p-3 bg-gradient-to-b from-[#3a206a] via-[#1a0c36] to-[#0d051f] border-2 border-yellow-500/60 shadow-[0_0_40px_rgba(234,179,8,0.25)] overflow-hidden">
        
        {/* Lightning strike visual effect */}
        {lightningActive && (
          <div className="absolute inset-0 z-30 pointer-events-none bg-blue-400/20 backdrop-brightness-150 animate-pulse transition-opacity">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300/40 via-yellow-200/20 to-transparent" />
          </div>
        )}

        {/* Top Ticker Bar: Scatter suspense + cascade win announcement */}
        <div className="mb-2 px-3 py-1.5 rounded-xl bg-black/60 border border-yellow-500/30 flex items-center justify-between text-xs md:text-sm font-bold min-h-[34px]">
          <div className="flex items-center gap-1.5">
            <span className="text-yellow-400">
              {theme.id === 'zeus' ? '⚡' : theme.id === 'bonanza' ? '🍭' : '🀄'}
            </span>
            <span className="text-slate-200">
              SCATTER: <span className={`font-mono ${scatterCount >= 4 ? 'text-green-400 font-extrabold animate-pulse' : 'text-amber-300 font-bold'}`}>{scatterCount}/4</span>
            </span>
            {scatterCount >= 4 && (
              <span className="text-[10px] bg-green-500/20 text-green-300 border border-green-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
                BONUS!
              </span>
            )}
          </div>

          <div className="truncate text-right">
            {currentWinText ? (
              <span className="text-yellow-300 font-extrabold animate-pulse">
                {currentWinText}
              </span>
            ) : (
              <span className="text-slate-400 text-[11px]">8+ SIMBOL SERUPA UNTUK MENANG</span>
            )}
          </div>
        </div>

        {/* 6x5 Grid Layout */}
        <div className="grid grid-cols-6 gap-1 md:gap-1.5 p-1 rounded-xl bg-[#090314]/90 border border-purple-900/60 shadow-inner">
          {grid.map((row, r) =>
            row.map((symbol, c) => {
              const winning = isWinningCell(r, c);
              const orb = getMultiplier(r, c);

              return (
                <div
                  key={`${r}-${c}`}
                  className={`relative aspect-square rounded-lg flex flex-col items-center justify-center p-0.5 md:p-1 transition-all duration-200 ${
                    winning
                      ? 'bg-yellow-400/30 border-2 border-yellow-300 scale-95 shadow-[0_0_15px_rgba(253,224,71,0.8)] animate-pulse z-10'
                      : 'bg-gradient-to-b from-purple-950/40 to-slate-950/80 border border-purple-800/30 hover:border-yellow-500/40'
                  } ${isSpinning ? 'opacity-70 blur-[0.5px] translate-y-0.5' : ''}`}
                >
                  {/* Symbol Graphic */}
                  <span
                    className={`text-2xl sm:text-3xl md:text-4xl transition-transform ${
                      winning ? 'scale-115 rotate-6' : ''
                    } ${symbol.isScatter ? 'drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-bounce' : ''}`}
                  >
                    {symbol.emoji}
                  </span>

                  {/* Symbol small label */}
                  <span className="text-[8px] sm:text-[9px] font-semibold text-slate-300/80 truncate max-w-full px-0.5 leading-none mt-0.5">
                    {symbol.isScatter ? 'SCATTER' : symbol.name.split(' ')[0]}
                  </span>

                  {/* Multiplier Orb Overlay if Zeus struck this cell */}
                  {orb && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400/90 via-amber-500/90 to-red-600/90 shadow-[0_0_20px_rgba(245,158,11,1)] border-2 border-white animate-pulse">
                      <div className="text-center leading-tight text-white drop-shadow-md">
                        <div className="text-[9px] font-black uppercase tracking-tighter">PETIR</div>
                        <div className="text-xs sm:text-base font-black font-mono">{orb.value}x</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Tumbling/Cascading overlay banner indicator */}
        {isTumbling && (
          <div className="mt-2 text-center text-xs font-bold text-amber-400 tracking-wider animate-pulse flex items-center justify-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            TUMBLE RUNNING — SIMBOL JATUH LAGI...
          </div>
        )}
      </div>
    </div>
  );
};
