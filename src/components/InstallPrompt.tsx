"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"install" | "ios" | "kakao-ios" | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (isStandalone) return;

    const isKakao = /KAKAOTALK/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPad|iPhone|iPod/.test(ua);

    if (isKakao && isAndroid) {
      // 안드로이드 카카오톡 → 크롬으로 자동 이동
      const url = encodeURIComponent(window.location.href);
      window.location.href = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.android.chrome;end`;
      // 크롬 없으면 삼성 인터넷 시도
      setTimeout(() => {
        window.location.href = `intent://${window.location.host}${window.location.pathname}${window.location.search}#Intent;scheme=https;package=com.sec.android.app.sbrowser;end`;
      }, 1500);
      void url;
      return;
    }

    if (isKakao && isIOS) {
      setMode("kakao-ios");
      setVisible(true);
      return;
    }

    if (isIOS) {
      setMode("ios");
      setVisible(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode("install");
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

  function openInSafari() {
    window.location.href = window.location.href.replace(/^https?:\/\//, "x-safari-https://");
  }

  if (!visible || !mode) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-lg px-5 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="text-sm font-semibold text-slate-800">여신토익 앱 설치</p>
          <button onClick={() => setVisible(false)} className="text-slate-300 hover:text-slate-500 text-lg leading-none">✕</button>
        </div>

        {mode === "install" && (
          <button onClick={install} className="w-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-colors">
            설치하기
          </button>
        )}

        {mode === "ios" && (
          <p className="text-xs text-slate-500 leading-relaxed">
            하단 <span className="font-semibold">공유 버튼(□↑)</span> 탭 →{" "}
            <span className="font-semibold">"홈 화면에 추가"</span> 선택
          </p>
        )}

        {mode === "kakao-ios" && (
          <>
            <p className="text-xs text-slate-500 mb-3">카카오톡에서는 설치가 어려워요. Safari로 열어주세요.</p>
            <button
              onClick={openInSafari}
              className="w-full text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl transition-colors"
            >
              Safari로 열기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
