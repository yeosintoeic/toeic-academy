"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import KickedOverlay from "@/components/KickedOverlay";

interface Session {
  id: string;
  completedAt: string;
  totalScore: number;
  totalQuestions: number;
  part5Score: number;
  part6Score: number;
  part7Score: number;
  mode: string;
}

const MODE_LABEL: Record<string, string> = {
  full: "실전",
  part5: "Part 5",
  part6: "Part 6",
  part7: "Part 7",
};

interface User {
  id: string;
  name: string;
  role: string;
  plan: string;
  planExpiresAt: string | null;
}

const PLAN_LABEL: Record<string, string> = {
  NONE: "미구독",
  TEST: "모의고사",
  LECTURE: "강의",
  VOCAB: "단어장",
  FULL: "강의 + 모의고사",
  TEST_VOCAB: "모의고사 + 단어장",
  ALL: "전체 (강의 + 모의고사 + 단어장)",
};

function daysLeft(expiresAt: string | null) {
  if (!expiresAt) return 0;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

interface VocabRecord {
  id: string;
  date: string;
  score: number;
  total: number;
}

function loadVocabHistory(): VocabRecord[] {
  try {
    return JSON.parse(localStorage.getItem("vocab_test_history") ?? "[]");
  } catch { return []; }
}

function DashboardContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<Session[]>([]);
  const [vocabHistory, setVocabHistory] = useState<VocabRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [kickedDetected, setKickedDetected] = useState(false);

  const expired = params.get("expired") === "1";
  const noAccess = params.get("noaccess");

  useEffect(() => {
    setVocabHistory(loadVocabHistory());
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const [meRes, histRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/test/history"),
        ]);
        const meData = await meRes.json();
        if (!meRes.ok || !meData.user) {
          router.push(meData?.kicked ? "/login?kicked=1" : "/login");
          return;
        }
        const { user } = meData;
        const hist = await histRes.json().catch(() => []);
        setUser(user);
        setHistory(Array.isArray(hist) ? hist : []);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  // 동시 접속 감지: 3초 폴링 + 탭 전환 즉시 체크
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok || !data.user) {
          if (data?.kicked) {
            setKickedDetected(true);
            fetch("/api/auth/logout", { method: "POST" }).finally(() => {
              setTimeout(() => router.push("/login?kicked=1"), 2500);
            });
          } else {
            router.push("/login");
          }
        }
      } catch { /* 네트워크 오류 무시 */ }
    }
    const interval = setInterval(checkSession, 3000);
    const onFocus = () => checkSession();
    const onVisible = () => { if (document.visibilityState === "visible") checkSession(); };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;

  const best = history.length > 0 ? Math.max(...history.map((s) => s.totalScore)) : null;
  const avg = history.length > 0
    ? Math.round(history.reduce((a, s) => a + s.totalScore, 0) / history.length)
    : null;

  const isAdmin = user?.role === "ADMIN";
  const isViewer = user?.role === "VIEWER";
  const isManager = user?.role === "MANAGER";
  const days = daysLeft(user?.planExpiresAt ?? null);
  const isExpired = !isAdmin && !isViewer && !isManager && (!user?.planExpiresAt || days === 0);
  const plan = user?.plan ?? "NONE";
  const canTest = isAdmin || isViewer || isManager || (!isExpired && ["TEST", "FULL", "TEST_VOCAB", "ALL"].includes(plan));
  const canLecture = !isViewer && !isManager && (isAdmin || (!isExpired && ["LECTURE", "FULL", "ALL"].includes(plan)));
  const canVocab = isAdmin || isViewer || isManager || (!isExpired && ["VOCAB", "TEST_VOCAB", "ALL"].includes(plan));

  return (
    <div className="min-h-screen bg-slate-50">
      <KickedOverlay visible={kickedDetected} />
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-lg text-slate-800">여신토익</h1>
          {(isAdmin || isViewer || isManager) && (
            <a href="/admin" className="text-xs px-2.5 py-1 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium">
              관리자
            </a>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{user?.name}님</span>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-red-500">로그아웃</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">

        {/* 만료/접근 불가 알림 */}
        {(expired || noAccess) && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6 text-sm text-red-700">
            {expired && "이용 기간이 만료되었습니다. 재등록 코드를 입력하거나 학원에 문의해주세요."}
            {noAccess === "test" && "현재 플랜에서는 모의고사를 이용할 수 없습니다."}
            {noAccess === "lecture" && "현재 플랜에서는 강의를 이용할 수 없습니다."}
            {noAccess === "vocab" && "현재 플랜에서는 단어장을 이용할 수 없습니다."}
          </div>
        )}

        {/* 플랜 카드 */}
        <div className={`rounded-xl border p-5 mb-6 flex items-center justify-between ${
          isExpired ? "bg-slate-100 border-slate-200" : "bg-blue-50 border-blue-200"
        }`}>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">현재 구독</p>
            <p className={`text-lg font-bold ${isExpired ? "text-slate-400" : "text-blue-700"}`}>
              {PLAN_LABEL[user?.plan ?? "NONE"]}
              {isExpired && " (만료)"}
            </p>
            {user?.planExpiresAt && (
              <p className="text-xs text-slate-500 mt-0.5">
                {isExpired
                  ? `만료일: ${new Date(user.planExpiresAt).toLocaleDateString("ko-KR")}`
                  : `${days}일 남음 (${new Date(user.planExpiresAt).toLocaleDateString("ko-KR")} 까지)`
                }
              </p>
            )}
          </div>
          {!isExpired && (
            <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-medium">이용중</span>
          )}
        </div>

        {/* 모의고사 통계 */}
        {canTest && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">응시 횟수</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{history.length}회</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">최고 점수</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{best ?? "-"}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">평균 점수</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{avg ?? "-"}</p>
              </div>
            </div>
          </>
        )}

        {/* 메뉴 버튼 — 순서: 모의고사 → 단어장 → 강의 */}
        <div className="mb-8 space-y-4">
          {canTest && (
            <button
              onClick={() => router.push("/test")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-left"
            >
              <div className="text-base">모의고사</div>
              <div className="text-xs text-blue-200 mt-0.5">실전 · Part 5 · Part 6 · Part 7</div>
            </button>
          )}
          {canVocab && (
            <button
              onClick={() => router.push("/vocabulary")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-left"
            >
              <div className="text-base">단어장</div>
              <div className="text-xs text-emerald-200 mt-0.5">단어 연습 · 단어 테스트 · 랜덤 출제</div>
            </button>
          )}
          {canLecture && (
            <button
              onClick={() => router.push("/lectures")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-left"
            >
              <div className="text-base">강의 보기</div>
              <div className="text-xs text-indigo-200 mt-0.5">동영상 강의</div>
            </button>
          )}
          {!canTest && !canVocab && !canLecture && (
            <div className="text-sm text-slate-400 py-3">이용 가능한 서비스가 없습니다.</div>
          )}
        </div>

        {/* 통합 응시 기록 */}
        {(canTest || canVocab) && (() => {
          type UnifiedRow =
            | { kind: "toeic"; id: string; date: string; mode: string; score: number; total: number; part5: number; part6: number; part7: number }
            | { kind: "vocab"; id: string; date: string; score: number; total: number };

          const toeicRows: UnifiedRow[] = history.map((s) => ({
            kind: "toeic",
            id: s.id,
            date: s.completedAt,
            mode: s.mode,
            score: s.totalScore,
            total: s.totalQuestions,
            part5: s.part5Score,
            part6: s.part6Score,
            part7: s.part7Score,
          }));

          const vocabRows: UnifiedRow[] = vocabHistory.map((v) => ({
            kind: "vocab",
            id: v.id,
            date: v.date,
            score: v.score,
            total: v.total,
          }));

          const all = [...toeicRows, ...vocabRows].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          return (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-800">응시 기록</h2>
              </div>
              {all.length === 0 ? (
                <div className="px-6 py-12 text-center text-slate-400">아직 응시 기록이 없습니다.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                      <th className="px-6 py-3">응시일</th>
                      <th className="px-6 py-3">유형</th>
                      <th className="px-6 py-3">점수</th>
                      <th className="px-6 py-3">정답률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {all.map((row) => {
                      const pct = row.total > 0 ? Math.round((row.score / row.total) * 100) : 0;
                      if (row.kind === "toeic") {
                        return (
                          <tr
                            key={`t-${row.id}`}
                            onClick={() => router.push(`/results?sessionId=${row.id}`)}
                            className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer"
                          >
                            <td className="px-6 py-4 text-sm text-slate-600">
                              {new Date(row.date).toLocaleDateString("ko-KR")}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                row.mode === "full" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                              }`}>
                                {MODE_LABEL[row.mode] ?? row.mode}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-blue-600">
                              {row.score}/{row.total}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{pct}%</td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={`v-${row.id}`} className="border-b border-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(row.date).toLocaleDateString("ko-KR")}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                              단어 테스트
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                            {row.score}/{row.total}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })()}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
