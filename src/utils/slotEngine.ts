import { GameTheme, SlotSymbol } from '../types';

export const COLS = 6;
export const ROWS = 5;

// Weight distribution for symbols (higher index = lower payout = higher weight)
function getRandomSymbol(theme: GameTheme, doubleChance: boolean, forceScatter: boolean = false): SlotSymbol {
  if (forceScatter) {
    return theme.scatterSymbol;
  }

  // Scatter chance: ~1.2% normally, ~2.4% with Double Chance
  const scatterChance = doubleChance ? 0.026 : 0.013;
  if (Math.random() < scatterChance) {
    return theme.scatterSymbol;
  }

  // Symbol weights (more common for low gems, rare for top crowns)
  const weights = [4, 7, 10, 14, 18, 22, 26, 30, 34];
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;

  for (let i = 0; i < theme.symbols.length; i++) {
    r -= weights[i] || 15;
    if (r <= 0) {
      return theme.symbols[i];
    }
  }

  return theme.symbols[theme.symbols.length - 1];
}

// Generate a brand new 6x5 grid of symbols
export function generateInitialGrid(
  theme: GameTheme,
  doubleChance: boolean = false,
  forceBuyBonus: boolean = false
): SlotSymbol[][] {
  const grid: SlotSymbol[][] = [];

  for (let r = 0; r < ROWS; r++) {
    const row: SlotSymbol[] = [];
    for (let c = 0; c < COLS; c++) {
      row.push(getRandomSymbol(theme, doubleChance));
    }
    grid.push(row);
  }

  // If force buy bonus, ensure at least 4 scatters land on random distinct positions
  if (forceBuyBonus) {
    const positions: [number, number][] = [];
    while (positions.length < 4) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!positions.some(([pr, pc]) => pr === r && pc === c)) {
        positions.push([r, c]);
        grid[r][c] = theme.scatterSymbol;
      }
    }
  }

  return grid;
}

// Random multiplier generator (e.g. 2x, 5x, 10x, 25x, 50x, 100x, 500x)
export function rollMultiplier(): number {
  const roll = Math.random();
  if (roll < 0.5) return [2, 3, 4, 5][Math.floor(Math.random() * 4)];
  if (roll < 0.78) return [8, 10, 12, 15][Math.floor(Math.random() * 4)];
  if (roll < 0.92) return [20, 25, 30, 50][Math.floor(Math.random() * 4)];
  if (roll < 0.98) return 100;
  if (roll < 0.995) return 250;
  return 500;
}

export interface WinMatch {
  symbol: SlotSymbol;
  count: number;
  payoutMultiplier: number;
  positions: { row: number; col: number }[];
}

// Check grid for 8+ matching symbols
export function evaluateWins(grid: SlotSymbol[][]): {
  matches: WinMatch[];
  scatterCount: number;
  scatterPositions: { row: number; col: number }[];
} {
  const counts: Record<string, { symbol: SlotSymbol; positions: { row: number; col: number }[] }> = {};
  let scatterCount = 0;
  const scatterPositions: { row: number; col: number }[] = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const sym = grid[r][c];
      if (sym.isScatter) {
        scatterCount++;
        scatterPositions.push({ row: r, col: c });
      } else {
        if (!counts[sym.id]) {
          counts[sym.id] = { symbol: sym, positions: [] };
        }
        counts[sym.id].positions.push({ row: r, col: c });
      }
    }
  }

  const matches: WinMatch[] = [];

  for (const id in counts) {
    const item = counts[id];
    const cnt = item.positions.length;
    if (cnt >= 8) {
      let mult = 0;
      if (cnt >= 12) {
        mult = item.symbol.payouts['12+'];
      } else if (cnt >= 10) {
        mult = item.symbol.payouts['10-11'];
      } else {
        mult = item.symbol.payouts['8-9'];
      }
      matches.push({
        symbol: item.symbol,
        count: cnt,
        payoutMultiplier: mult,
        positions: item.positions,
      });
    }
  }

  return { matches, scatterCount, scatterPositions };
}

// Execute a full tumble step: removes winning positions, drops symbols down, fills top with new ones
export function processTumble(
  grid: SlotSymbol[][],
  winningPositions: { row: number; col: number }[],
  theme: GameTheme,
  doubleChance: boolean
): SlotSymbol[][] {
  const newGrid: SlotSymbol[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  const isWinning = (r: number, c: number) =>
    winningPositions.some((p) => p.row === r && p.col === c);

  // For each column, slide non-winning symbols to bottom
  for (let c = 0; c < COLS; c++) {
    const keptSymbols: SlotSymbol[] = [];
    for (let r = 0; r < ROWS; r++) {
      if (!isWinning(r, c)) {
        keptSymbols.push(grid[r][c]);
      }
    }

    const missingCount = ROWS - keptSymbols.length;
    // Generate new symbols at top
    const newSymbols: SlotSymbol[] = [];
    for (let i = 0; i < missingCount; i++) {
      newSymbols.push(getRandomSymbol(theme, doubleChance));
    }

    const fullCol = [...newSymbols, ...keptSymbols];
    for (let r = 0; r < ROWS; r++) {
      newGrid[r][c] = fullCol[r];
    }
  }

  return newGrid;
}
