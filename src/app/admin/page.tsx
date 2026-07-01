"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PLAN_LABEL: Record<string, string> = {
  NONE: "미구독", TEST: "모의고사", LECTURE: "강의", VOCAB: "단어장",
  FULL: "강의+시험", TEST_VOCAB: "모의고사+단어장", ALL: "전체",
};

interface Student {
  id: string;
  name: string;
  email: string;
  plan: string;
  planExpiresAt: string | null;
  createdAt: string;
  sessions: { totalScore: number; totalQuestions: number; completedAt: string }[];
}

interface Score {
  id: string;
  mode: string;
  completedAt: string;
  totalScore: number;
  totalQuestions: number;
  part5Score: number;
  part6Score: number;
  part7Score: number;
  user: { id: string; name: string; email: string };
}

const MODE_LABEL: Record<string, string> = {
  full: "실전", part5: "Part 5", part6: "Part 6", part7: "Part 7",
};

export default function AdminPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [tab, setTab] = useState<"students" | "scores">("students");
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);

  function toggleStudent(uid: string) {
    setExpandedStudents((prev) => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  }

  const scoresByStudent = scores.reduce<Record<string, { user: Score["user"]; sessions: Score[] }>>((acc, s) => {
    const uid = s.user.id || s.user.email;
    if (!acc[uid]) acc[uid] = { user: s.user, sessions: [] };
    acc[uid].sessions.push(s);
    return acc;
  }, {});

  useEffect(() => {
    async function load() {
      const [stuRes, scoreRes, qRes] = await Promise.all([
        fetch("/api/admin/students"),
        fetch("/api/admin/scores"),
        fetch("/api/admin/questions"),
      ]);
      const stuData = await stuRes.json();
      const scoreData = await scoreRes.json();
      setStudents(Array.isArray(stuData) ? stuData : []);
      const validScores = Array.isArray(scoreData) ? scoreData : [];
      setScores(validScores);
      const uids = new Set<string>(validScores.map((s: Score) => s.user?.id || s.user?.email).filter(Boolean));
      setExpandedStudents(uids);
      const qs = await qRes.json();
      setQuestionCount(Array.isArray(qs) ? qs.length : 0);
      const capRes = await fetch("/api/capture-log");
      const capData = await capRes.json().catch(() => []);
      setCaptureCount(Array.isArray(capData) ? capData.length : 0);
    }
    load();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-base text-slate-800">관리자 페이지</h1>

        {/* PC 메뉴 */}
        <div className="hidden sm:flex items-center gap-4">
          <Link href="/admin/codes" className="text-sm text-blue-600 hover:underline">코드 관리</Link>
          <Link href="/admin/lectures" className="text-sm text-blue-600 hover:underline">강의 관리</Link>
          <Link href="/admin/questions" className="text-sm text-blue-600 hover:underline">문제 관리</Link>
          <Link href="/admin/captures" className="relative text-sm text-red-600 hover:underline flex items-center gap-1">
            캡처 감지
            {captureCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full">{captureCount > 99 ? "99+" : captureCount}</span>
            )}
          </Link>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-red-500">로그아웃</button>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="sm:hidden p-2 text-slate-600"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </header>

      {/* 모바일 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 py-3 flex flex-col gap-3">
          <Link href="/admin/codes" className="text-sm text-blue-600">코드 관리</Link>
          <Link href="/admin/lectures" className="text-sm text-blue-600">강의 관리</Link>
          <Link href="/admin/questions" className="text-sm text-blue-600">문제 관리</Link>
          <Link href="/admin/captures" className="text-sm text-red-600 flex items-center gap-2">
            캡처 감지
            {captureCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full">{captureCount > 99 ? "99+" : captureCount}</span>
            )}
          </Link>
          <button onClick={logout} className="text-sm text-red-500 text-left">로그아웃</button>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 통계 카드 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">총 수강생</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{students.length}<span className="text-sm font-normal ml-1">명</span></p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">총 응시</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{scores.length}<span className="text-sm font-normal ml-1">회</span></p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500">등록 문제</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{questionCount}<span className="text-sm font-normal ml-1">개</span></p>
          </div>
        </div>

        {/* 탭 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("students")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium ${tab === "students" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
          >
            수강생 목록
          </button>
          <button
            onClick={() => setTab("scores")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium ${tab === "scores" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
          >
            성적 현황
          </button>
        </div>

        {/* 수강생 목록 */}
        {tab === "students" && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-100">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름 또는 이메일 검색"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {filteredStudents.length === 0 ? (
              <div className="px-4 py-12 text-center text-slate-400 text-sm">
                {search ? "검색 결과가 없습니다." : "수강생이 없습니다."}
              </div>
            ) : (
              <>
                {/* PC 테이블 */}
                <table className="hidden sm:table w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                      <th className="px-6 py-3">이름</th>
                      <th className="px-6 py-3">이메일</th>
                      <th className="px-6 py-3">플랜</th>
                      <th className="px-6 py-3">만료일</th>
                      <th className="px-6 py-3">최근 점수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => {
                      const expired = s.planExpiresAt && new Date(s.planExpiresAt) < new Date();
                      return (
                        <tr key={s.id} onClick={() => router.push(`/admin/students/${s.id}`)} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                          <td className="px-6 py-4 text-sm font-medium">{s.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{s.email}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.plan === "NONE" ? "bg-slate-100 text-slate-500" : expired ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-700"}`}>
                              {PLAN_LABEL[s.plan] ?? s.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {s.planExpiresAt ? <span className={expired ? "text-red-400" : ""}>{new Date(s.planExpiresAt).toLocaleDateString("ko-KR")}</span> : "-"}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-blue-600">{s.sessions[0] ? `${s.sessions[0].totalScore}점` : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* 모바일 카드 */}
                <div className="sm:hidden divide-y divide-slate-100">
                  {filteredStudents.map((s) => {
                    const expired = s.planExpiresAt && new Date(s.planExpiresAt) < new Date();
                    return (
                      <button
                        key={s.id}
                        onClick={() => router.push(`/admin/students/${s.id}`)}
                        className="w-full px-4 py-4 text-left hover:bg-slate-50 flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.plan === "NONE" ? "bg-slate-100 text-slate-500" : expired ? "bg-red-100 text-red-500" : "bg-blue-100 text-blue-700"}`}>
                              {PLAN_LABEL[s.plan] ?? s.plan}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate">{s.email}</p>
                          {s.planExpiresAt && (
                            <p className={`text-xs mt-0.5 ${expired ? "text-red-400" : "text-slate-400"}`}>
                              {expired ? "만료: " : "~"}{new Date(s.planExpiresAt).toLocaleDateString("ko-KR")}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          {s.sessions[0] && <p className="text-sm font-bold text-blue-600">{s.sessions[0].totalScore}점</p>}
                          <p className="text-slate-300 text-lg">›</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* 성적 현황 */}
        {tab === "scores" && (
          <div className="space-y-3">
            {Object.keys(scoresByStudent).length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 px-6 py-12 text-center text-slate-400">응시 기록이 없습니다.</div>
            ) : Object.entries(scoresByStudent).map(([uid, { user, sessions }]) => {
              const isOpen = expandedStudents.has(uid);
              const avg = Math.round(sessions.reduce((a, s) => a + (s.totalQuestions > 0 ? s.totalScore / s.totalQuestions * 100 : 0), 0) / sessions.length);
              const best = Math.max(...sessions.map((s) => s.totalQuestions > 0 ? Math.round(s.totalScore / s.totalQuestions * 100) : 0));
              return (
                <div key={uid} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <button type="button" onClick={() => toggleStudent(uid)} className="w-full flex items-center justify-between px-4 py-4 hover:bg-slate-50 text-left">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{sessions.length}회 응시</span>
                        <span className="text-xs text-slate-500">평균 <span className="font-semibold text-slate-700">{avg}%</span></span>
                        <span className="text-xs text-slate-500">최고 <span className="font-semibold text-blue-600">{best}%</span></span>
                      </div>
                    </div>
                    <span className="text-slate-400 text-lg ml-2">{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100">
                      {/* PC 테이블 */}
                      <table className="hidden sm:table w-full">
                        <thead>
                          <tr className="text-left text-xs text-slate-400 bg-slate-50">
                            <th className="px-6 py-2">응시일</th>
                            <th className="px-6 py-2">유형</th>
                            <th className="px-6 py-2">Part 5</th>
                            <th className="px-6 py-2">Part 6</th>
                            <th className="px-6 py-2">Part 7</th>
                            <th className="px-6 py-2">총점</th>
                            <th className="px-6 py-2">정답률</th>
                            <th className="px-6 py-2"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map((s) => (
                            <tr key={s.id} onClick={() => router.push(`/results?sessionId=${s.id}`)} className="border-t border-slate-50 hover:bg-blue-50 cursor-pointer">
                              <td className="px-6 py-3 text-xs text-slate-500">{new Date(s.completedAt).toLocaleDateString("ko-KR")}</td>
                              <td className="px-6 py-3"><span className={`text-xs px-2 py-0.5 rounded font-medium ${s.mode === "full" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{MODE_LABEL[s.mode] ?? s.mode}</span></td>
                              <td className="px-6 py-3 text-xs">{s.mode === "full" || s.mode === "part5" ? `${s.part5Score}/30` : "-"}</td>
                              <td className="px-6 py-3 text-xs">{s.mode === "full" || s.mode === "part6" ? `${s.part6Score}/16` : "-"}</td>
                              <td className="px-6 py-3 text-xs">{s.mode === "full" || s.mode === "part7" ? `${s.part7Score}/54` : "-"}</td>
                              <td className="px-6 py-3 text-xs font-bold text-blue-600">{s.totalScore}/{s.totalQuestions}</td>
                              <td className="px-6 py-3 text-xs text-slate-500">{s.totalQuestions > 0 ? Math.round((s.totalScore / s.totalQuestions) * 100) + "%" : "-"}</td>
                              <td className="px-6 py-3 text-xs text-blue-500 font-medium">오답 보기 →</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* 모바일 카드 */}
                      <div className="sm:hidden divide-y divide-slate-100">
                        {sessions.map((s) => {
                          const pct = s.totalQuestions > 0 ? Math.round((s.totalScore / s.totalQuestions) * 100) : 0;
                          return (
                            <button key={s.id} onClick={() => router.push(`/results?sessionId=${s.id}`)} className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${s.mode === "full" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>{MODE_LABEL[s.mode] ?? s.mode}</span>
                                  <span className="text-xs text-slate-400">{new Date(s.completedAt).toLocaleDateString("ko-KR")}</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                  {s.mode === "full" ? `P5: ${s.part5Score}/30 · P6: ${s.part6Score}/16 · P7: ${s.part7Score}/54` : `${s.totalScore}/${s.totalQuestions}`}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-blue-600">{pct}%</p>
                                <p className="text-xs text-blue-500">오답 →</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
