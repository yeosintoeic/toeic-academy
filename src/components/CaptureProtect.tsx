"use client";

import { useEffect, useRef } from "react";

function logCapture(type: string, page: string) {
  fetch("/api/capture-log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, page }),
  }).catch(() => {});
}

export default function CaptureProtect({ page = "unknown" }: { page?: string }) {
  const patchedRef = useRef(false);

  useEffect(() => {
    const blockMenu = (e: MouseEvent) => e.preventDefault();

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

    const mql = window.matchMedia("print");
    const onPrint = (e: MediaQueryListEvent) => {
      if (e.matches) logCapture("print", page);
    };

    if (!patchedRef.current && navigator.mediaDevices?.getDisplayMedia) {
      patchedRef.current = true;
      const orig = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = function (...args) {
        logCapture("screen-share", page);
        return orig(...args);
      };
    }

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

  return null;
}

export function ContentWatermark({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        zIndex: 1,
      }}
    >
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 4 }).map((_, col) => (
          <span
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              top: `${row * 60 - 10}px`,
              left: `${col * 220 - 30}px`,
              transform: "rotate(-20deg)",
              fontSize: "10px",
              color: "rgba(0,0,0,0.12)",
              whiteSpace: "nowrap",
              fontFamily: "sans-serif",
            }}
          >
            {label}
          </span>
        ))
      )}
    </div>
  );
}
