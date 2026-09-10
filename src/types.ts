export type GameThemeId = 'zeus' | 'bonanza' | 'mahjong';

export interface SlotSymbol {
  id: string;
  name: string;
  emoji: string;
  svgIcon?: string;
  baseColor: string;
  accentColor: string;
  payouts: {
    '8-9': number;   // multiplier of base bet
    '10-11': number;
    '12+': number;
  };
  isScatter?: boolean;
  isMultiplier?: boolean;
  multiplierValue?: number;
}

export interface GameTheme {
  id: GameThemeId;
  name: string;
  provider: string;
  subtitle: string;
  rtp: number;
  volatility: 'TINGGI' | 'SEDANG' | 'SANGAT TINGGI';
  themeColor: string;
  bgGradient: string;
  symbols: SlotSymbol[];
  scatterSymbol: SlotSymbol;
  multiplierColors: string[];
}

export interface GridCell {
  instanceId: string;
  symbol: SlotSymbol;
  row: number;
  col: number;
  isWinning?: boolean;
  isNew?: boolean;
}

export interface SpinResult {
  initialGrid: SlotSymbol[][];
  tumbles: {
    grid: SlotSymbol[][];
    winningSymbols: { symbolId: string; count: number; payout: number }[];
    winAmount: number;
    multiplierOrbs: { row: number; col: number; value: number }[];
  }[];
  totalWin: number;
  totalMultiplier: number;
  scatterCount: number;
  triggeredFreeSpins: boolean;
}

export interface SpinHistoryItem {
  id: string;
  timestamp: Date;
  themeId: GameThemeId;
  bet: number;
  win: number;
  multiplier: number;
  isFreeSpin: boolean;
  isBonusBuy: boolean;
}

export type CurrencyMode = 'IDR' | 'USD';

export interface AutoSpinSettings {
  enabled: boolean;
  remainingSpins: number;
  stopOnBonus: boolean;
  stopOnMaxWin: boolean;
  initialBalance: number;
}
