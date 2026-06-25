"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SAVED_EMAIL_KEY = "saved_email";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [rememberEmail, setRememberEmail] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_EMAIL_KEY);
    if (saved) {
      setEmail(saved);
      setRememberEmail(true);
    }
  }, []);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (rememberEmail) {
      localStorage.setItem(SAVED_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(SAVED_EMAIL_KEY);
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, rememberMe: autoLogin }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    if (data.mustChangePw) {
      router.push("/change-password");
      return;
    }

    router.push(data.role === "ADMIN" ? "/admin" : "/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* 왼쪽 브랜드 패널 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* 배경 장식 원 */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-[-40px] w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative text-center text-white">
          <div className="text-7xl font-black tracking-tight mb-4">여신토익</div>
          <div className="text-xl font-light text-blue-200 mb-10">RC 실전 연습 플랫폼</div>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">Part</div>
              <div className="text-3xl font-bold mb-2">5·6·7</div>
              <div className="text-blue-200 text-xs">실전형 문제</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">75분</div>
              <div className="text-blue-200 text-xs">타이머 모드</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="text-3xl font-bold mb-2">즉시</div>
              <div className="text-blue-200 text-xs">오답 해설</div>
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 로그인 폼 */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          {/* 모바일용 브랜드 */}
          <div className="lg:hidden text-center mb-10">
            <div className="text-4xl font-black text-blue-700 mb-1">여신토익</div>
            <div className="text-slate-400 text-sm">RC 실전 연습 플랫폼</div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">로그인</h2>
          <p className="text-slate-400 text-sm mb-8">계정에 로그인하여 학습을 시작하세요</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                이메일 기억하기
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                <input
                  type="checkbox"
                  checked={autoLogin}
                  onChange={(e) => setAutoLogin(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600"
                />
                자동 로그인 (30일)
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 whitespace-pre-line">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="text-xs text-center text-slate-400 mt-3">
            비밀번호를 잊으셨나요?{" "}
            <span className="text-blue-500">관리자에게 문의하세요</span>
          </p>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3">
              아직 계정이 없으신가요?
            </div>
          </div>

          <Link
            href="/register"
            className="block w-full text-center border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 font-medium py-3 rounded-xl text-sm transition-colors"
          >
            수강생 회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
