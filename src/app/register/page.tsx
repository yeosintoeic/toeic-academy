"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!privacyAgreed) {
      setError("개인정보 수집 및 이용에 동의해주세요.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, password, code, privacyConsent: privacyAgreed, marketingConsent: marketingAgreed }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen flex">
      {/* 왼쪽 브랜드 패널 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 bg-white/5 rounded-full" />
        <div className="relative text-center text-white">
          <div className="text-7xl font-black tracking-tight mb-4">여신토익</div>
          <div className="text-xl font-light text-blue-200">RC 실전 연습 플랫폼</div>
        </div>
      </div>

      {/* 오른쪽 폼 */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden text-center mb-10">
            <div className="text-4xl font-black text-blue-700 mb-1">여신토익</div>
            <div className="text-slate-400 text-sm">RC 실전 연습 플랫폼</div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-1">수강생 등록</h2>
          <p className="text-slate-400 text-sm mb-8">학원에서 발급한 등록 코드가 필요합니다</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
                placeholder="010-0000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                  className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
                  placeholder="8자 이상"
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">등록 코드</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
                placeholder="학원에서 발급한 코드를 입력하세요"
              />
            </div>

            {/* 동의 항목 */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0"
                />
                <span className="text-sm text-slate-700">
                  <span className="text-red-500 font-medium">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                  <span className="block text-xs text-slate-400 mt-0.5">이름, 이메일을 서비스 제공 목적으로 수집합니다.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingAgreed}
                  onChange={(e) => setMarketingAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-blue-600 flex-shrink-0"
                />
                <span className="text-sm text-slate-700">
                  <span className="text-slate-400 font-medium">[선택]</span> 마케팅 정보 수신에 동의합니다.
                  <span className="block text-xs text-slate-400 mt-0.5">이벤트, 할인 정보 등을 이메일로 받아보실 수 있습니다.</span>
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "등록 중..." : "회원가입"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs text-slate-400 bg-white px-3">
              이미 계정이 있으신가요?
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full text-center border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-600 font-medium py-3 rounded-xl text-sm transition-colors"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
