"use client";

import { useEffect, useRef, useState } from "react";

function logCapture(type: string, page: string) {
  fetch("/api/capture-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, page }),
  }).catch(() => {});
}

export default function CaptureProtect({ page = "unknown" }: { page?: string }) {
  const patchedRef = useRef(false);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const blockMenu = (e: MouseEvent) => e.preventDefault();

    const blockKey = (e: KeyboardEvent) => {
      const key = e.key;
      const meta = e.metaKey;
      const ctrl = e.ctrlKey;

      let blocked = false;
      if (key === "PrintScreen") blocked = true;
      if (meta && ["3", "4", "5"].includes(key) && e.shiftKey) blocked = true;
      if (meta && ["s", "S"].includes(key) && e.shiftKey) blocked = true;
      if (ctrl && ["p", "P", "s", "S"].includes(key)) blocked = true;
      if (ctrl && e.shiftKey && ["i", "I", "j", "J", "c", "C"].includes(key)) blocked = true;
      if (key === "F12") blocked = true;

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        logCapture("keyboard:" + key, page);
        setWarning(true);
      }
    };

    const mql = window.matchMedia("print");
    const onPrint = (e: MediaQueryListEvent) => {
      if (e.matches) {
        logCapture("print", page);
        setWarning(true);
      }
    };

    if (!patchedRef.current && navigator.mediaDevices?.getDisplayMedia) {
      patchedRef.current = true;
      const orig = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = function (...args) {
        logCapture("screen-share", page);
        setWarning(true);
        return orig(...args);
      };
    }

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
    mql.addEventListener("change", onPrint);

    return () => {
      document.removeEventListener("contextmenu", blockMenu);
      document.removeEventListener("keydown", blockKey, true);
      mql.removeEventListener("change", onPrint);
      document.getElementById("__capture_protect_style")?.remove();
    };
  }, [page]);

  if (!warning) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center text-white text-center p-8"
      onClick={() => setWarning(false)}
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
