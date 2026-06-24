"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream;
    if (ios) {
      setIsIOS(true);
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setVisible(false));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-800">여신토익 앱 설치</p>
            {isIOS ? (
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Safari 하단 <span className="font-semibold">공유 버튼(□↑)</span> 을 탭한 후<br />
                <span className="font-semibold">"홈 화면에 추가"</span> 를 선택하세요
              </p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">앱으로 설치하면 더 빠르게 이용할 수 있어요</p>
            )}
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-slate-300 hover:text-slate-500 text-lg leading-none flex-shrink-0"
          >
            ✕
          </button>
        </div>
        {!isIOS && (
          <button
            onClick={install}
            className="mt-3 w-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-colors"
          >
            설치하기
          </button>
        )}
      </div>
    </div>
  );
}
