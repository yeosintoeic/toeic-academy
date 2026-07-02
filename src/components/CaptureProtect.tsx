"use client";

import { useEffect, useRef, useState } from "react";

function logCapture(type: string, page: string) {
  fetch("/api/capture-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, page }),
  }).catch(() => {});
}

function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export default function CaptureProtect({ page = "unknown" }: { page?: string; userEmail?: string }) {
  const patchedRef = useRef(false);
  const [warning, setWarning] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const trigger = (type: string) => {
    logCapture(type, page);
    setWarning(true);
  };

  useEffect(() => {
    setIsIOS(detectIOS());
  }, []);

  useEffect(() => {
    const blockMenu = (e: MouseEvent) => e.preventDefault();

    const blockKey = (e: KeyboardEvent) => {
      const key = e.key;
      const code = e.code ?? "";
      const meta = e.metaKey;
      const ctrl = e.ctrlKey;

      let blocked = false;
      // PrintScreen (Windows/Linux)
      if (key === "PrintScreen") blocked = true;
      // macOS 스크린샷: Cmd+Shift+3/4/5
      // e.key는 Shift+숫자키로 인해 '#','$','%'가 되므로 반드시 e.code 사용
      if (meta && e.shiftKey && ["Digit3", "Digit4", "Digit5"].includes(code)) blocked = true;
      // 인쇄: Ctrl+P / Cmd+P
      if ((ctrl || meta) && (key === "p" || key === "P")) blocked = true;
      // 개발자 도구
      if (ctrl && e.shiftKey && ["i", "I", "j", "J", "c", "C"].includes(key)) blocked = true;
      if (key === "F12") blocked = true;

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        trigger("keyboard:" + (code || key));
      }
    };

    // 인쇄 감지 (가장 신뢰도 높음)
    const onBeforePrint = () => trigger("print");

    // matchMedia 폴백
    const mql = window.matchMedia("print");
    const onPrintMQ = (e: MediaQueryListEvent) => { if (e.matches) trigger("print-mq"); };

    // 화면 공유 감지 (getDisplayMedia 패치)
    if (!patchedRef.current && navigator.mediaDevices?.getDisplayMedia) {
      patchedRef.current = true;
      const orig = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = function (...args) {
        trigger("screen-share");
        return orig(...args);
      };
    }

    // CSS: 선택 방지 + 인쇄 시 내용 숨김
    const style = document.createElement("style");
    style.id = "__capture_protect_style";
    style.textContent = `
      * { -webkit-user-select: none !important; user-select: none !important; -webkit-touch-callout: none !important; }
      input, textarea, [contenteditable] { -webkit-user-select: text !important; user-select: text !important; }
      @media print { body { display: none !important; } }
    `;
    document.head.appendChild(style);

    document.addEventListener("contextmenu", blockMenu);
    document.addEventListener("keydown", blockKey, true);
    window.addEventListener("beforeprint", onBeforePrint);
    mql.addEventListener("change", onPrintMQ);

    return () => {
      document.removeEventListener("contextmenu", blockMenu);
      document.removeEventListener("keydown", blockKey, true);
      window.removeEventListener("beforeprint", onBeforePrint);
      mql.removeEventListener("change", onPrintMQ);
      document.getElementById("__capture_protect_style")?.remove();
    };
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!warning) {
    return isIOS ? (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9992,
          backgroundColor: "rgba(185, 28, 28, 0.95)",
          color: "white",
          padding: "10px 16px",
          textAlign: "center",
          fontSize: "12px",
          lineHeight: "1.5",
        }}
      >
        📵 이 콘텐츠는 저작권으로 보호됩니다. 캡처·배포 시 법적 처벌을 받을 수 있습니다.
      </div>
    ) : null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center text-white text-center p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-6xl mb-6">⚠️</div>
      <h1 className="text-3xl font-black mb-4 text-red-400">무단 배포 금지</h1>
      <div className="bg-red-900/50 border border-red-500 rounded-2xl px-8 py-6 max-w-md mb-8">
        <p className="text-lg text-white mb-2 font-semibold">이 콘텐츠는 저작권으로 보호되어 있습니다.</p>
        <p className="text-slate-300 text-sm leading-relaxed">
          스크린샷·화면 녹화·무단 배포·재판매는<br />
          <span className="text-red-300 font-semibold">저작권법 위반으로 민·형사상 처벌</span>을 받을 수 있습니다.
        </p>
      </div>
      <p className="text-slate-500 text-xs mb-6">이 시도는 자동으로 기록됩니다.</p>
      <button
        onClick={() => setWarning(false)}
        className="px-8 py-3 bg-white text-black rounded-xl font-bold text-base hover:bg-slate-200 transition-colors"
      >
        확인
      </button>
    </div>
  );
}
