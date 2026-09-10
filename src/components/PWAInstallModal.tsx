import React from 'react';
import { sound } from '../utils/audio';

interface PWAInstallModalProps {
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onInstall: () => Promise<boolean>;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isInstallable,
  isInstalled,
  isIOS,
  onInstall,
  onClose,
}) => {
  const handleInstallClick = async () => {
    sound.playClick();
    const success = await onInstall();
    if (success) {
      onClose();
    }
  };

  return (
    <div
      id="modal-pwa-install"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full rounded-3xl bg-gradient-to-b from-[#1e0e38] to-[#0c0319] border-2 border-yellow-500/70 p-6 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* App Icon */}
        <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-600 p-1 shadow-[0_0_25px_rgba(234,179,8,0.5)] flex items-center justify-center text-4xl mb-4 border border-yellow-200">
          ⚡
        </div>

        <h2 className="text-xl font-black text-amber-300 uppercase tracking-tight">
          PASANG APK SLOT ONLINE
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Aplikasi simulator slot ringan, hemat kuota, bebas iklan, dan dapat dimainkan offline kapan saja!
        </p>

        {/* Feature Highlights */}
        <div className="my-4 p-3 rounded-2xl bg-black/40 border border-purple-800/50 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-green-400">✓</span> Ukuran ringan (&lt; 2 MB)
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-green-400">✓</span> Akses instan dari Layar Utama HP
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-green-400">✓</span> Pengalaman full-screen tanpa address bar
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <span className="text-green-400">✓</span> Gratis 100% Saldo Demo Tanpa Deposit
          </div>
        </div>

        {/* Install Actions */}
        {isInstalled ? (
          <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-300 text-xs font-bold mb-3">
            ✓ Aplikasi APK Slot Online Sudah Terpasang!
          </div>
        ) : isInstallable ? (
          <button
            id="btn-confirm-pwa-install"
            onClick={handleInstallClick}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-slate-950 uppercase tracking-wider bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 hover:brightness-110 active:scale-95 transition shadow-[0_0_20px_rgba(234,179,8,0.5)] cursor-pointer mb-3"
          >
            UNDUH & PASANG SEKARANG
          </button>
        ) : isIOS ? (
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-700/60 text-xs text-slate-200 text-left mb-3 space-y-1">
            <div className="font-bold text-yellow-300">Cara Pasang di iPhone / iPad:</div>
            <div>1. Tekan tombol <strong>Bagikan (Share)</strong> di Safari.</div>
            <div>2. Pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-700/60 text-xs text-slate-300 text-left mb-3">
            Buka menu browser Anda (titik 3 di pojok kanan atas) dan pilih <strong>"Pasang Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800/80 transition cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
