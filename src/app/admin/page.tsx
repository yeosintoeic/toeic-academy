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
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  sessions: { totalScore: number; totalQuestions: number; completedAt: string }[];
}

interface ManagerSession {
  id: string;
  mode: string;
  completedAt: string;
  part5Score: number;
  part6Score: number;
  part7Score: number;
  totalScore: number;
  totalQuestions: number;
}

interface Manager {
  id: string;
  name: string;
  email: string;
  plan: string;
  planExpiresAt: string | null;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  sessions: ManagerSession[];
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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [tab, setTab] = useState<"students" | "scores" | "inactive" | "managers" | "inquiries">("students");
  const [expandedStudents, setExpandedStudents] = useState<Set<string>>(new Set());
  const [expandedManagers, setExpandedManagers] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [captureCount, setCaptureCount] = useState(0);
  const [inquiries, setInquiries] = useState<{ id: string; content: string; isRead: boolean; createdAt: string; user: { id: string; name: string; email: string } }[]>([]);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  function toggleStudent(uid: string) {
    setExpandedStudents((prev) => {
      const next = new Set(prev);
      next.has(uid) ? next.delete(uid) : next.add(uid);
      return next;
    });
  }

  function toggleManager(uid: string) {
    setExpandedManagers((prev) => {
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
      try {
        const meRes = await fetch("/api/auth/me");
        const meData = await meRes.json();
        if (!meData.user) {
          window.location.href = meData?.kicked ? "/login?kicked=1" : "/login";
          return;
        }
        const role = meData.user.role as string;
        if (role !== "ADMIN" && role !== "VIEWER" && role !== "MANAGER") {
          window.location.href = "/dashboard";
          return;
        }
        setUserRole(role);
        if (role === "VIEWER" || role === "MANAGER") {
          setTab("scores");
          const scoreRes = await fetch("/api/admin/scores");
          const scoreData = await scoreRes.json().catch(() => []);
          const validScores = Array.isArray(scoreData) ? scoreData : [];
          setScores(validScores);
          const uids = new Set<string>(validScores.map((s: Score) => s.user?.id || s.user?.email).filter(Boolean));
          setExpandedStudents(uids);
          return;
        }
        const [stuRes, scoreRes, qRes, mgrRes] = await Promise.all([
          fetch("/api/admin/students"),
          fetch("/api/admin/scores"),
          fetch("/api/admin/questions"),
          fetch("/api/admin/managers"),
        ]);
        const stuData = await stuRes.json().catch(() => []);
        const scoreData = await scoreRes.json().catch(() => []);
        const mgrData = await mgrRes.json().catch(() => []);
        setStudents(Array.isArray(stuData) ? stuData : []);
        setManagers(Array.isArray(mgrData) ? mgrData : []);
        const validScores = Array.isArray(scoreData) ? scoreData : [];
        setScores(validScores);
        const uids = new Set<string>(validScores.map((s: Score) => s.user?.id || s.user?.email).filter(Boolean));
        setExpandedStudents(uids);
        const qs = await qRes.json().catch(() => []);
        setQuestionCount(Array.isArray(qs) ? qs.length : 0);
        const capRes = await fetch("/api/capture-log");
        const capData = await capRes.json().catch(() => []);
        setCaptureCount(Array.isArray(capData) ? capData.length : 0);
      } catch {
        window.location.href = "/login";
      }
    }
    load();
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  if (userRole === null) return <div className="min-h-screen flex items-center justify-center text-slate-400">로딩 중...</div>;

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-base text-slate-800">관리자 페이지</h1>
          <a href="/dashboard" className="text-xs px-2.5 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            여신토익
          </a>
        </div>

        {/* PC 메뉴 */}
        <div className="hidden sm:flex items-center gap-4">
          {userRole === "ADMIN" && (
            <>
              <Link href="/admin/codes" className="text-sm text-blue-600 hover:underline">코드 관리</Link>
              <Link href="/admin/lectures" className="text-sm text-blue-600 hover:underline">강의 관리</Link>
              <Link href="/admin/questions" className="text-sm text-blue-600 hover:underline">문제 관리</Link>
              <Link href="/admin/captures" className="relative text-sm text-red-600 hover:underline flex items-center gap-1">
                캡처 감지
                {captureCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full">{captureCount > 99 ? "99+" : captureCount}</span>
                )}
              </Link>
            </>
          )}
          {(userRole === "ADMIN" || userRole === "VIEWER") && (
            <Link href="/admin/saved" className="text-sm text-yellow-600 hover:underline">저장 문제</Link>
          )}
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
          <Link href="/dashboard" className="text-sm font-semibold text-blue-700">여신토익으로 이동</Link>
          {userRole === "ADMIN" && (
            <>
              <Link href="/admin/codes" className="text-sm text-blue-600">코드 관리</Link>
              <Link href="/admin/lectures" className="text-sm text-blue-600">강의 관리</Link>
              <Link href="/admin/questions" className="text-sm text-blue-600">문제 관리</Link>
              <Link href="/admin/captures" className="text-sm text-red-600 flex items-center gap-2">
                캡처 감지
                {captureCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full">{captureCount > 99 ? "99+" : captureCount}</span>
                )}
              </Link>
            </>
          )}
          {(userRole === "ADMIN" || userRole === "VIEWER") && (
            <Link href="/admin/saved" className="text-sm text-yellow-600">저장 문제</Link>
          )}
          <button onClick={logout} className="text-sm text-red-500 text-left">로그아웃</button>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* 통계 카드 */}
        {userRole === "ADMIN" && <div className="grid grid-cols-3 gap-3 mb-6">
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
        </div>}

        {/* 탭 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {userRole === "ADMIN" && (
            <button
              onClick={() => setTab("students")}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium ${tab === "students" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
            >
              수강생 목록
            </button>
          )}
          <button
            onClick={() => setTab("scores")}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium ${tab === "scores" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
          >
            성적 현황
          </button>
          {userRole === "ADMIN" && (
            <>
              <button
                onClick={() => setTab("inactive")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium relative ${tab === "inactive" ? "bg-orange-500 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
              >
                미접속 관리
                {students.filter((s) => {
                  const d = s.lastLoginAt ? (Date.now() - new Date(s.lastLoginAt).getTime()) / 86400000 : Infinity;
                  return d >= 90;
                }).length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-orange-500 text-white rounded-full">
                    {students.filter((s) => {
                      const d = s.lastLoginAt ? (Date.now() - new Date(s.lastLoginAt).getTime()) / 86400000 : Infinity;
                      return d >= 90;
                    }).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("managers")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium ${tab === "managers" ? "bg-purple-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
              >
                매니저 목록
                {managers.length > 0 && (
                  <span className={`ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded-full ${tab === "managers" ? "bg-purple-400 text-white" : "bg-purple-100 text-purple-600"}`}>
                    {managers.length}
                  </span>
                )}
              </button>
              <button
                onClick={async () => {
                  setTab("inquiries");
                  if (inquiries.length === 0) {
                    setInquiryLoading(true);
                    const res = await fetch("/api/admin/inquiries");
                    const data = await res.json();
                    setInquiries(Array.isArray(data) ? data : []);
                    setInquiryLoading(false);
                  }
                }}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium relative ${tab === "inquiries" ? "bg-green-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
              >
                문의함
                {inquiries.filter(i => !i.isRead).length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {inquiries.filter(i => !i.isRead).length}
                  </span>
                )}
              </button>
            </>
          )}
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

        {/* 성적 현황 - 매니저 축약 뷰 */}
        {tab === "scores" && userRole === "MANAGER" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800">수강생 성적 현황</p>
              <p className="text-xs text-slate-400 mt-0.5">총 {Object.keys(scoresByStudent).length}명</p>
            </div>
            {Object.keys(scoresByStudent).length === 0 ? (
              <div className="px-4 py-12 text-center text-slate-400 text-sm">응시 기록이 없습니다.</div>
            ) : (
              <>
                <table className="hidden sm:table w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 bg-slate-50 border-b border-slate-100">
                      <th className="px-5 py-3">이름</th>
                      <th className="px-5 py-3">응시 횟수</th>
                      <th className="px-5 py-3">최근 응시일</th>
                      <th className="px-5 py-3">최근 점수</th>
                      <th className="px-5 py-3">최고 정답률</th>
                      <th className="px-5 py-3">평균 정답률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(scoresByStudent).map(({ user, sessions }) => {
                      const latest = sessions[0];
                      const best = Math.max(...sessions.map(s => s.totalQuestions > 0 ? Math.round(s.totalScore / s.totalQuestions * 100) : 0));
                      const avg = Math.round(sessions.reduce((a, s) => a + (s.totalQuestions > 0 ? s.totalScore / s.totalQuestions * 100 : 0), 0) / sessions.length);
                      return (
                        <tr key={user.id} className="border-b border-slate-50">
                          <td className="px-5 py-3 font-medium text-slate-800">{user.name}</td>
                          <td className="px-5 py-3 text-slate-500">{sessions.length}회</td>
                          <td className="px-5 py-3 text-slate-400 text-xs">{latest ? new Date(latest.completedAt).toLocaleDateString("ko-KR") : "-"}</td>
                          <td className="px-5 py-3 font-semibold text-blue-600">{latest ? `${latest.totalScore}/${latest.totalQuestions}` : "-"}</td>
                          <td className="px-5 py-3 text-slate-700">{best}%</td>
                          <td className="px-5 py-3 text-slate-500">{avg}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="sm:hidden divide-y divide-slate-100">
                  {Object.values(scoresByStudent).map(({ user, sessions }) => {
                    const latest = sessions[0];
                    const best = Math.max(...sessions.map(s => s.totalQuestions > 0 ? Math.round(s.totalScore / s.totalQuestions * 100) : 0));
                    const avg = Math.round(sessions.reduce((a, s) => a + (s.totalQuestions > 0 ? s.totalScore / s.totalQuestions * 100 : 0), 0) / sessions.length);
                    return (
                      <div key={user.id} className="px-4 py-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-slate-800">{user.name}</span>
                          <span className="text-sm font-bold text-blue-600">{latest ? `${latest.totalScore}/${latest.totalQuestions}` : "-"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{sessions.length}회 응시</span>
                          <span>평균 <span className="text-slate-600 font-medium">{avg}%</span></span>
                          <span>최고 <span className="text-blue-600 font-medium">{best}%</span></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* 성적 현황 */}
        {tab === "scores" && userRole !== "MANAGER" && (
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
        {/* 문의함 */}
        {tab === "inquiries" && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">문의함</p>
              <span className="text-xs text-slate-400">{inquiries.length}건</span>
            </div>
            {inquiryLoading ? (
              <div className="px-4 py-12 text-center text-slate-400 text-sm">불러오는 중...</div>
            ) : inquiries.length === 0 ? (
              <div className="px-4 py-12 text-center text-slate-400 text-sm">문의가 없습니다.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {inquiries.map(inq => (
                  <div key={inq.id} className={`px-5 py-4 ${inq.isRead ? "bg-white" : "bg-green-50"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-800">{inq.user.name}</span>
                          <span className="text-xs text-slate-400">{inq.user.email}</span>
                          {!inq.isRead && <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>}
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{new Date(inq.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{inq.content}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1.5">
                        {!inq.isRead && (
                          <button
                            onClick={async () => {
                              await fetch("/api/admin/inquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: inq.id }) });
                              setInquiries(prev => prev.map(i => i.id === inq.id ? { ...i, isRead: true } : i));
                            }}
                            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                          >
                            확인
                          </button>
                        )}
                        <button
                          onClick={async () => {
                            if (!confirm("이 문의를 삭제하시겠습니까?")) return;
                            await fetch("/api/admin/inquiries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: inq.id }) });
                            setInquiries(prev => prev.filter(i => i.id !== inq.id));
                          }}
                          className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 미접속 수강생 관리 */}
        {tab === "inactive" && (
          <InactiveStudents students={students} onDeleted={() => {
            fetch("/api/admin/students").then(r => r.json()).then(d => setStudents(Array.isArray(d) ? d : []));
          }} />
        )}

        {/* 매니저 목록 */}
        {tab === "managers" && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">매니저 목록</p>
              <span className="text-xs text-slate-400">{managers.length}명</span>
            </div>
            {managers.length === 0 ? (
              <div className="px-4 py-12 text-center text-slate-400 text-sm">매니저가 없습니다.</div>
            ) : (
              <>
                <div className="space-y-3 p-4">
                  {managers.map((m) => {
                    const isOpen = expandedManagers.has(m.id);
                    const avg = m.sessions.length > 0 ? Math.round(m.sessions.reduce((a, s) => a + (s.totalQuestions > 0 ? s.totalScore / s.totalQuestions * 100 : 0), 0) / m.sessions.length) : null;
                    const best = m.sessions.length > 0 ? Math.max(...m.sessions.map(s => s.totalQuestions > 0 ? Math.round(s.totalScore / s.totalQuestions * 100) : 0)) : null;
                    return (
                      <div key={m.id} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button type="button" onClick={() => toggleManager(m.id)} className="w-full flex items-center justify-between px-4 py-4 hover:bg-slate-50 text-left">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-semibold text-slate-800">{m.name}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${m.role === "ADMIN" ? "bg-slate-800 text-white" : "bg-purple-100 text-purple-600"}`}>
                                {m.role === "ADMIN" ? "관리자" : "매니저"}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{m.email}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{m.sessions.length}회 응시</span>
                              {avg !== null && <span className="text-xs text-slate-500">평균 <span className="font-semibold text-slate-700">{avg}%</span></span>}
                              {best !== null && <span className="text-xs text-slate-500">최고 <span className="font-semibold text-blue-600">{best}%</span></span>}
                            </div>
                          </div>
                          <span className="text-slate-400 text-lg ml-2">{isOpen ? "▲" : "▼"}</span>
                        </button>

                        {isOpen && (
                          <div className="border-t border-slate-100">
                            {m.sessions.length === 0 ? (
                              <p className="text-xs text-slate-400 px-4 py-3">응시 기록 없음</p>
                            ) : (
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="text-left text-slate-400 bg-slate-50 border-b border-slate-100">
                                    <th className="px-4 py-2">응시일</th>
                                    <th className="px-4 py-2">유형</th>
                                    <th className="px-4 py-2">점수</th>
                                    <th className="px-4 py-2">정답률</th>
                                    <th className="px-4 py-2"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {m.sessions.map((s) => (
                                    <tr key={s.id} className="border-b border-slate-50 hover:bg-blue-50 cursor-pointer" onClick={() => router.push(`/results?sessionId=${s.id}`)}>
                                      <td className="px-4 py-2 text-slate-500">{new Date(s.completedAt).toLocaleDateString("ko-KR")}</td>
                                      <td className="px-4 py-2">
                                        <span className={`px-1.5 py-0.5 rounded font-medium ${s.mode === "full" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                                          {MODE_LABEL[s.mode] ?? s.mode}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2 font-bold text-blue-600">{s.totalScore}/{s.totalQuestions}</td>
                                      <td className="px-4 py-2 text-slate-500">{s.totalQuestions > 0 ? Math.round(s.totalScore / s.totalQuestions * 100) + "%" : "-"}</td>
                                      <td className="px-4 py-2 text-blue-500">오답 →</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function InactiveStudents({ students, onDeleted }: { students: Student[]; onDeleted: () => void }) {
  const DAYS = 90;
  const now = Date.now();

  const inactive = students
    .filter((s) => {
      if (s.role === "MANAGER") return false;
      const ms = s.lastLoginAt ? now - new Date(s.lastLoginAt).getTime() : Infinity;
      return ms / 86400000 >= DAYS;
    })
    .sort((a, b) => {
      const da = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
      const db = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
      return da - db;
    });

  async function handleDelete(id: string, name: string) {
    if (!confirm(`${name} 계정을 삭제하시겠습니까? 모든 응시 기록도 함께 삭제됩니다.`)) return;
    const sessions = await fetch(`/api/admin/students/${id}`).then(r => r.json()).then(d => d.sessions ?? []);
    await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    onDeleted();
  }

  async function handleDeleteAll() {
    if (!confirm(`미접속 수강생 ${inactive.length}명을 모두 삭제하시겠습니까? 되돌릴 수 없습니다.`)) return;
    for (const s of inactive) {
      await fetch(`/api/admin/students/${s.id}`, { method: "DELETE" });
    }
    onDeleted();
  }

  if (inactive.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center text-slate-400">
        90일 이상 미접속 수강생이 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">90일 이상 미접속 수강생 <span className="text-orange-500">{inactive.length}명</span></p>
          <p className="text-xs text-slate-400 mt-0.5">마지막 로그인이 90일 이상 지난 계정입니다.</p>
        </div>
        <button
          onClick={handleDeleteAll}
          className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
        >
          전체 삭제
        </button>
      </div>

      {/* 모바일 카드 */}
      <div className="sm:hidden divide-y divide-slate-100">
        {inactive.map((s) => {
          const daysSince = s.lastLoginAt
            ? Math.floor((now - new Date(s.lastLoginAt).getTime()) / 86400000)
            : null;
          return (
            <div key={s.id} className="px-4 py-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                <p className="text-xs text-slate-400 truncate">{s.email}</p>
                <p className="text-xs text-orange-500 mt-0.5">
                  {daysSince !== null ? `${daysSince}일 전 접속` : "접속 기록 없음"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(s.id, s.name)}
                className="flex-shrink-0 text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
              >
                삭제
              </button>
            </div>
          );
        })}
      </div>

      {/* PC 테이블 */}
      <table className="hidden sm:table w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
            <th className="px-4 py-3">이름</th>
            <th className="px-4 py-3">이메일</th>
            <th className="px-4 py-3">플랜</th>
            <th className="px-4 py-3">가입일</th>
            <th className="px-4 py-3">마지막 접속</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {inactive.map((s) => {
            const daysSince = s.lastLoginAt
              ? Math.floor((now - new Date(s.lastLoginAt).getTime()) / 86400000)
              : null;
            return (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-slate-500">{s.email}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">{PLAN_LABEL[s.plan] ?? s.plan}</span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(s.createdAt).toLocaleDateString("ko-KR")}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-orange-500 font-medium">
                    {daysSince !== null ? `${daysSince}일 전` : "없음"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(s.id, s.name)}
                    className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
