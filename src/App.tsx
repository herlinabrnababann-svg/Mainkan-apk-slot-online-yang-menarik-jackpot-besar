import { useState, useEffect, useRef, useCallback } from 'react';
import { GameThemeId, SlotSymbol, SpinHistoryItem } from './types';
import { GAME_THEMES } from './data/themes';
import {
  COLS,
  ROWS,
  generateInitialGrid,
  evaluateWins,
  processTumble,
  rollMultiplier,
} from './utils/slotEngine';
import { sound } from './utils/audio';
import { usePWAInstall } from './hooks/usePWAInstall';
import { HeaderBar } from './components/HeaderBar';
import { SlotGrid, MultiplierOrb } from './components/SlotGrid';
import { ControlPanel } from './components/ControlPanel';
import { WinCelebration } from './components/WinCelebration';
import {
  FreeSpinsIntro,
  FreeSpinsSummary,
  FreeSpinsBanner,
} from './components/FreeSpinsOverlay';
import { PolaGacorModal } from './components/PolaGacorModal';
import { PaytableModal } from './components/PaytableModal';
import { HistoryModal } from './components/HistoryModal';
import { PWAInstallModal } from './components/PWAInstallModal';

export default function App() {
  // Theme & Currency
  const [themeId, setThemeId] = useState<GameThemeId>('zeus');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [balance, setBalance] = useState<number>(10000000); // 10 Million IDR default demo
  const [bet, setBet] = useState<number>(2000);

  // Settings
  const [doubleChance, setDoubleChance] = useState<boolean>(false);
  const [turbo, setTurbo] = useState<boolean>(false);
  const [autoSpins, setAutoSpins] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Slot Grid State
  const theme = GAME_THEMES[themeId];
  const [grid, setGrid] = useState<SlotSymbol[][]>(() => generateInitialGrid(theme));
  const [winningPositions, setWinningPositions] = useState<{ row: number; col: number }[]>([]);
  const [multiplierOrbs, setMultiplierOrbs] = useState<MultiplierOrb[]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isTumbling, setIsTumbling] = useState<boolean>(false);
  const [lightningActive, setLightningActive] = useState<boolean>(false);
  const [scatterCount, setScatterCount] = useState<number>(0);
  const [currentWinText, setCurrentWinText] = useState<string | null>(null);

  // Free Spins State
  const [isFreeSpinsActive, setIsFreeSpinsActive] = useState<boolean>(false);
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState<number>(0);
  const [totalFreeSpins, setTotalFreeSpins] = useState<number>(0);
  const [globalMultiplier, setGlobalMultiplier] = useState<number>(1);
  const [accumulatedFreeSpinsWin, setAccumulatedFreeSpinsWin] = useState<number>(0);

  // Modals & Overlays
  const [showPolaGacor, setShowPolaGacor] = useState<boolean>(false);
  const [showPaytable, setShowPaytable] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showPWAInstall, setShowPWAInstall] = useState<boolean>(false);
  const [winCelebration, setWinCelebration] = useState<{ winAmount: number; betAmount: number } | null>(null);
  const [pendingFreeSpinsIntro, setPendingFreeSpinsIntro] = useState<number | null>(null);
  const [pendingFreeSpinsSummary, setPendingFreeSpinsSummary] = useState<{ totalWin: number; multiplier: number } | null>(null);

  // Spin History
  const [history, setHistory] = useState<SpinHistoryItem[]>([]);

  // PWA hook
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Active ref to prevent race conditions during async tumble steps
  const isSpinningRef = useRef(false);
  isSpinningRef.current = isSpinning;

  // Effective bet
  const effectiveBet = doubleChance ? Math.round(bet * 1.25) : bet;
  const canAffordSpin = isFreeSpinsActive || balance >= effectiveBet;

  // Handle currency toggle
  const handleToggleCurrency = () => {
    if (currency === 'IDR') {
      setCurrency('USD');
      setBalance(Math.round(balance / 15000));
      setBet(0.4);
    } else {
      setCurrency('IDR');
      setBalance(Math.max(1000000, balance * 15000));
      setBet(2000);
    }
  };

  // Handle instant demo top-up
  const handleTopUp = () => {
    const topUpAmount = currency === 'IDR' ? 10000000 : 1000;
    setBalance((prev) => prev + topUpAmount);
    sound.playCoinTick();
  };

  // Change active theme
  const handleSelectTheme = (newId: GameThemeId) => {
    if (isSpinning) return;
    setThemeId(newId);
    setGrid(generateInitialGrid(GAME_THEMES[newId]));
    setWinningPositions([]);
    setMultiplierOrbs([]);
    setScatterCount(0);
    setCurrentWinText(null);
  };

  // Core spin handler
  const executeSpin = useCallback(
    async (isFreeSpin = false, forceBuyBonus = false) => {
      if (isSpinningRef.current) return;

      const currentTheme = GAME_THEMES[themeId];
      const spinCost = forceBuyBonus ? bet * 100 : effectiveBet;

      if (!isFreeSpin) {
        if (balance < spinCost) {
          sound.playClick();
          return;
        }
        setBalance((prev) => prev - spinCost);
      }

      setIsSpinning(true);
      setWinningPositions([]);
      setMultiplierOrbs([]);
      setCurrentWinText(null);

      const delayTime = turbo ? 150 : 380;
      await new Promise((r) => setTimeout(r, delayTime));

      // 1. Generate initial grid
      let currentGrid = generateInitialGrid(currentTheme, doubleChance, forceBuyBonus);
      setGrid(currentGrid);
      sound.playDrop();

      let currentMultiplierOrbs: MultiplierOrb[] = [];
      let totalSpinWin = 0;
      let tumbleCount = 0;

      // 2. Initial win & scatter evaluation
      let { matches, scatterCount: scatters, scatterPositions } = evaluateWins(currentGrid);
      setScatterCount(scatters);

      // Play scatter sound progressively
      if (scatters > 0) {
        for (let i = 0; i < Math.min(scatters, 4); i++) {
          setTimeout(() => sound.playScatter(i), i * 120);
        }
      }

      // Check if Zeus strikes lightning orbs on initial spin
      if (Math.random() < 0.35 || forceBuyBonus) {
        const orbRow = Math.floor(Math.random() * ROWS);
        const orbCol = Math.floor(Math.random() * COLS);
        const orbVal = rollMultiplier();
        currentMultiplierOrbs.push({ row: orbRow, col: orbCol, value: orbVal });
        setMultiplierOrbs([...currentMultiplierOrbs]);
        setLightningActive(true);
        sound.playThunderStrike();
        setTimeout(() => setLightningActive(false), 300);
      }

      // 3. Tumble / Cascading Loop
      while (matches.length > 0) {
        tumbleCount++;
        setIsTumbling(true);

        // Collect all winning positions & calculate win for this tumble step
        const winPositions: { row: number; col: number }[] = [];
        let stepWin = 0;

        for (const m of matches) {
          winPositions.push(...m.positions);
          stepWin += bet * m.payoutMultiplier;
        }

        totalSpinWin += stepWin;
        setWinningPositions(winPositions);

        const winSummary = matches
          .map((m) => `${m.count}x ${m.symbol.name.split(' ')[0]}`)
          .join(', ');
        setCurrentWinText(`+ ${currency === 'IDR' ? `Rp ${stepWin.toLocaleString('id-ID')}` : `$${stepWin}`} (${winSummary})`);

        sound.playWinExplosion();

        // Pause to show winning blast
        await new Promise((r) => setTimeout(r, turbo ? 300 : 650));

        // Possibility of extra lightning strike during tumble
        if (Math.random() < 0.25) {
          const orbRow = Math.floor(Math.random() * ROWS);
          const orbCol = Math.floor(Math.random() * COLS);
          if (!currentMultiplierOrbs.some((o) => o.row === orbRow && o.col === orbCol)) {
            const orbVal = rollMultiplier();
            currentMultiplierOrbs.push({ row: orbRow, col: orbCol, value: orbVal });
            setMultiplierOrbs([...currentMultiplierOrbs]);
            setLightningActive(true);
            sound.playThunderStrike();
            setTimeout(() => setLightningActive(false), 250);
          }
        }

        // Tumble symbols down
        currentGrid = processTumble(currentGrid, winPositions, currentTheme, doubleChance);
        setGrid(currentGrid);
        setWinningPositions([]);
        sound.playDrop();

        await new Promise((r) => setTimeout(r, turbo ? 200 : 400));

        // Evaluate new grid
        const res = evaluateWins(currentGrid);
        matches = res.matches;
      }

      setIsTumbling(false);

      // 4. Calculate Multipliers & Final Payout
      const orbSum = currentMultiplierOrbs.reduce((acc, cur) => acc + cur.value, 0);
      let spinMultiplier = orbSum > 0 ? orbSum : 1;
      let finalWin = totalSpinWin;

      if (isFreeSpin) {
        // In Free Spins, if there were wins and multiplier orbs, add to permanent global multiplier
        if (totalSpinWin > 0 && orbSum > 0) {
          const newGlobal = globalMultiplier + orbSum;
          setGlobalMultiplier(newGlobal);
          spinMultiplier = newGlobal;
        } else {
          spinMultiplier = globalMultiplier;
        }
        finalWin = totalSpinWin * spinMultiplier;
        setAccumulatedFreeSpinsWin((prev) => prev + finalWin);
      } else {
        if (orbSum > 0 && totalSpinWin > 0) {
          finalWin = totalSpinWin * spinMultiplier;
        }
      }

      if (finalWin > 0) {
        setBalance((prev) => prev + finalWin);
      }

      // Check if 4+ Scatters triggered Free Spins
      const triggeredBonus = scatters >= 4;
      if (triggeredBonus) {
        sound.playFreeSpinsTrigger();
        if (!isFreeSpinsActive) {
          setPendingFreeSpinsIntro(15);
        } else {
          setFreeSpinsRemaining((prev) => prev + 5);
          setTotalFreeSpins((prev) => prev + 5);
        }
      }

      // Record to history
      const historyItem: SpinHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date(),
        themeId,
        bet: spinCost,
        win: finalWin,
        multiplier: spinMultiplier,
        isFreeSpin,
        isBonusBuy: forceBuyBonus,
      };
      setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);

      // Check for Big Win / Sensational celebration
      if (finalWin >= bet * 10 && !isFreeSpin) {
        setWinCelebration({ winAmount: finalWin, betAmount: bet });
      }

      setIsSpinning(false);

      // Free Spins Progression
      if (isFreeSpin) {
        const nextRemaining = freeSpinsRemaining - 1;
        setFreeSpinsRemaining(nextRemaining);

        if (nextRemaining <= 0) {
          // Conclude Free Spins
          setTimeout(() => {
            setPendingFreeSpinsSummary({
              totalWin: accumulatedFreeSpinsWin + finalWin,
              multiplier: spinMultiplier,
            });
            setIsFreeSpinsActive(false);
          }, 1000);
        } else {
          // Trigger next free spin automatically
          setTimeout(() => {
            executeSpin(true, false);
          }, turbo ? 400 : 900);
        }
      }
    },
    [
      themeId,
      balance,
      bet,
      effectiveBet,
      doubleChance,
      turbo,
      isFreeSpinsActive,
      freeSpinsRemaining,
      globalMultiplier,
      accumulatedFreeSpinsWin,
      currency,
    ]
  );

  // Auto spin loop runner
  useEffect(() => {
    if (autoSpins > 0 && !isSpinning && !isFreeSpinsActive && !winCelebration && canAffordSpin) {
      const timer = setTimeout(() => {
        setAutoSpins((prev) => prev - 1);
        executeSpin(false, false);
      }, turbo ? 300 : 700);
      return () => clearTimeout(timer);
    }
  }, [autoSpins, isSpinning, isFreeSpinsActive, winCelebration, canAffordSpin, turbo, executeSpin]);

  // Spacebar hotkey to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isSpinningRef.current && canAffordSpin) {
        const activeElement = document.activeElement;
        const isInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
        if (!isInput) {
          e.preventDefault();
          executeSpin(isFreeSpinsActive, false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canAffordSpin, isFreeSpinsActive, executeSpin]);

  // Start Free Spins from Intro modal
  const handleStartFreeSpins = () => {
    setPendingFreeSpinsIntro(null);
    setIsFreeSpinsActive(true);
    setFreeSpinsRemaining(15);
    setTotalFreeSpins(15);
    setGlobalMultiplier(1);
    setAccumulatedFreeSpinsWin(0);

    setTimeout(() => {
      executeSpin(true, false);
    }, 600);
  };

  return (
    <div
      id="app-root"
      className="min-h-screen w-full bg-[#070210] text-white flex flex-col items-center justify-start relative overflow-x-hidden font-sans"
    >
      {/* Background Ambience Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-purple-900/25 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-600/15 blur-[100px] rounded-full" />
      </div>

      {/* Frame Container: switchable between Mobile APK frame and Fullscreen */}
      <div
        className={`w-full relative z-10 flex flex-col items-center transition-all ${
          isMobileFrame
            ? 'max-w-[480px] my-4 rounded-[40px] border-8 border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.9)] bg-[#0d041c] overflow-hidden min-h-[840px]'
            : 'max-w-4xl min-h-screen'
        }`}
      >
        {/* Android Mock Status Bar if in Mobile APK Mode */}
        {isMobileFrame && (
          <div className="w-full bg-black/90 px-6 py-1.5 flex items-center justify-between text-[11px] font-mono text-slate-400 select-none border-b border-purple-950">
            <span>12:00</span>
            {/* Camera punch-hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700 mx-auto" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>📶</span>
              <span>🔋 98%</span>
            </div>
          </div>
        )}

        {/* Global Header Bar */}
        <HeaderBar
          balance={balance}
          currency={currency}
          onToggleCurrency={handleToggleCurrency}
          onTopUp={handleTopUp}
          currentThemeId={themeId}
          onSelectTheme={handleSelectTheme}
          isMuted={isMuted}
          onToggleMute={() => {
            const muted = sound.toggleMute();
            setIsMuted(muted);
          }}
          isMobileFrame={isMobileFrame}
          onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenPolaGacor={() => setShowPolaGacor(true)}
          onOpenPaytable={() => setShowPaytable(true)}
          onOpenHistory={() => setShowHistory(true)}
          onOpenInstallPWA={() => setShowPWAInstall(true)}
          isInstalledPWA={isInstalled}
        />

        {/* Main Slot Play Area */}
        <main className="w-full p-2 sm:p-4 flex flex-col items-center justify-center flex-1">
          {/* Active Free Spins Tracker Banner */}
          {isFreeSpinsActive && (
            <FreeSpinsBanner
              currentSpin={totalFreeSpins - freeSpinsRemaining + 1}
              totalSpins={totalFreeSpins}
              globalMultiplier={globalMultiplier}
              totalAccumulatedWin={accumulatedFreeSpinsWin}
              currency={currency}
            />
          )}

          {/* 6x5 Slot Grid */}
          <SlotGrid
            grid={grid}
            winningPositions={winningPositions}
            multiplierOrbs={multiplierOrbs}
            isSpinning={isSpinning}
            isTumbling={isTumbling}
            theme={theme}
            scatterCount={scatterCount}
            currentWinText={currentWinText}
            lightningActive={lightningActive}
          />

          {/* Control Console */}
          <ControlPanel
            bet={bet}
            onBetChange={(newBet) => setBet(newBet)}
            currency={currency}
            doubleChance={doubleChance}
            onToggleDoubleChance={() => setDoubleChance(!doubleChance)}
            turbo={turbo}
            onToggleTurbo={() => setTurbo(!turbo)}
            autoSpinsRemaining={autoSpins}
            onStartAutoSpin={(count) => setAutoSpins(count)}
            onStopAutoSpin={() => setAutoSpins(0)}
            onBuyFreeSpins={() => executeSpin(false, true)}
            onSpin={() => executeSpin(isFreeSpinsActive, false)}
            isSpinning={isSpinning}
            isFreeSpinsActive={isFreeSpinsActive}
            canAffordSpin={canAffordSpin}
          />

          {/* Quick APK Download / PWA Pill */}
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span>⚡ APK Slot Online Demo v2.4</span>
            <span>•</span>
            <button
              onClick={() => setShowPWAInstall(true)}
              className="text-amber-400 hover:underline font-bold cursor-pointer"
            >
              Unduh APK / Pasang PWA
            </button>
            <span>•</span>
            <button
              onClick={() => setShowPolaGacor(true)}
              className="text-green-400 hover:underline font-bold cursor-pointer"
            >
              RTP Live 98.7%
            </button>
          </div>
        </main>

        {/* Android Gesture Bar if Mobile Frame */}
        {isMobileFrame && (
          <div className="w-full py-2 flex justify-center bg-black/90 border-t border-purple-950">
            <div className="w-32 h-1 bg-slate-600 rounded-full" />
          </div>
        )}
      </div>

      {/* Modals & Overlays */}
      {winCelebration && (
        <WinCelebration
          winAmount={winCelebration.winAmount}
          betAmount={winCelebration.betAmount}
          currency={currency}
          onClose={() => setWinCelebration(null)}
        />
      )}

      {pendingFreeSpinsIntro !== null && (
        <FreeSpinsIntro
          spinsCount={pendingFreeSpinsIntro}
          onStart={handleStartFreeSpins}
        />
      )}

      {pendingFreeSpinsSummary && (
        <FreeSpinsSummary
          totalWin={pendingFreeSpinsSummary.totalWin}
          currency={currency}
          multiplier={pendingFreeSpinsSummary.multiplier}
          onCollect={() => {
            sound.playBigWin();
            setPendingFreeSpinsSummary(null);
          }}
        />
      )}

      {showPolaGacor && (
        <PolaGacorModal
          theme={theme}
          onClose={() => setShowPolaGacor(false)}
        />
      )}

      {showPaytable && (
        <PaytableModal
          theme={theme}
          bet={bet}
          currency={currency}
          onClose={() => setShowPaytable(false)}
        />
      )}

      {showHistory && (
        <HistoryModal
          history={history}
          currency={currency}
          onClear={() => setHistory([])}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showPWAInstall && (
        <PWAInstallModal
          isInstallable={isInstallable}
          isInstalled={isInstalled}
          isIOS={isIOS}
          onInstall={install}
          onClose={() => setShowPWAInstall(false)}
        />
      )}
    </div>
  );
}
