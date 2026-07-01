"use client";

import { useEffect, useState } from "react";

interface UserInfo {
  name: string;
  email: string;
}

export default function CaptureProtect() {
  const [user, setUser] = useState<UserInfo | null>(null);

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
    const blockMenu = (e: MouseEvent) => e.preventDefault();
    const blockKey = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === "PrintScreen") { e.preventDefault(); return; }
      // Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5 (Mac)
      if (e.metaKey && e.shiftKey && ["3","4","5","s","S"].includes(e.key)) { e.preventDefault(); return; }
      // Ctrl+P (print), Ctrl+S (save), Ctrl+Shift+I (devtools)
      if (e.ctrlKey && ["p","P","s","S"].includes(e.key)) { e.preventDefault(); return; }
      if (e.ctrlKey && e.shiftKey && ["i","I","j","J","c","C"].includes(e.key)) { e.preventDefault(); return; }
      if (e.key === "F12") { e.preventDefault(); return; }
    };

    document.addEventListener("contextmenu", blockMenu);
    document.addEventListener("keydown", blockKey);
    return () => {
      document.removeEventListener("contextmenu", blockMenu);
      document.removeEventListener("keydown", blockKey);
    };
  }, []);

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
