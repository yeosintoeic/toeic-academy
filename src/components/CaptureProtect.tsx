"use client";

import { useEffect, useState, useRef } from "react";

interface UserInfo {
  name: string;
  email: string;
}

function logCapture(type: string, page: string) {
  fetch("/api/capture-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, page }),
  }).catch(() => {});
}

export default function CaptureProtect({ page = "unknown" }: { page?: string }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const patchedRef = useRef(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.name) {
          setUser({ name: data.user.name, email: data.user.email });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // 우클릭 차단
    const blockMenu = (e: MouseEvent) => e.preventDefault();

    // 키보드 단축키 차단 + 로깅
    const blockKey = (e: KeyboardEvent) => {
      const key = e.key;
      const meta = e.metaKey;
      const ctrl = e.ctrlKey;
      const shift = e.shiftKey;

      let blocked = false;

      if (key === "PrintScreen") blocked = true;
      if (meta && shift && ["3","4","5"].includes(key)) blocked = true;
      if (meta && shift && ["s","S"].includes(key)) blocked = true;
      if (ctrl && ["p","P","s","S"].includes(key)) blocked = true;
      if (ctrl && shift && ["i","I","j","J","c","C"].includes(key)) blocked = true;
      if (key === "F12") blocked = true;

      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
        logCapture("keyboard:" + key, page);
      }
    };

    // 인쇄 감지 (Ctrl+P 우회 시도 포함)
    const mql = window.matchMedia("print");
    const onPrint = (e: MediaQueryListEvent) => {
      if (e.matches) logCapture("print", page);
    };

    // 화면 공유/녹화 시도 감지 (getDisplayMedia 패치)
    if (!patchedRef.current && navigator.mediaDevices?.getDisplayMedia) {
      patchedRef.current = true;
      const orig = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = function (...args) {
        logCapture("screen-share", page);
        return orig(...args);
      };
    }

    // CSS로 텍스트 선택 + iOS 터치 메뉴 완전 차단
    const style = document.createElement("style");
    style.id = "__capture_protect_style";
    style.textContent = `
      * { -webkit-user-select: none !important; user-select: none !important; -webkit-touch-callout: none !important; }
      input, textarea, [contenteditable] { -webkit-user-select: text !important; user-select: text !important; }
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

  if (!user) return null;

  const label = `${user.name} ${user.email}`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {Array.from({ length: 12 }).map((_, row) =>
        Array.from({ length: 6 }).map((_, col) => (
          <span
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              top: `${row * 130 - 40}px`,
              left: `${col * 250 - 50}px`,
              transform: "rotate(-25deg)",
              fontSize: "11px",
              color: "rgba(0,0,0,0.10)",
              whiteSpace: "nowrap",
              fontFamily: "sans-serif",
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </span>
        ))
      )}
    </div>
  );
}
