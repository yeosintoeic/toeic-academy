"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CaptureLog {
  id: string;
  type: string;
  page: string;
  createdAt: string;
  user: { name: string; email: string };
  userId: string;
}

const TYPE_LABEL: Record<string, string> = {
  "keyboard:PrintScreen": "PrintScreen 키",
  "keyboard:3": "Cmd+Shift+3 (Mac)",
  "keyboard:4": "Cmd+Shift+4 (Mac)",
  "keyboard:5": "Cmd+Shift+5 (Mac)",
  "keyboard:s": "Cmd+Shift+S",
  "keyboard:S": "Cmd+Shift+S",
  "keyboard:p": "Ctrl+P (인쇄)",
  "keyboard:P": "Ctrl+P (인쇄)",
  "print": "인쇄 다이얼로그",
  "screen-share": "화면 공유 시도",
};

const PAGE_LABEL: Record<string, string> = {
  test: "모의고사",
  vocabulary: "단어장",
};

export default function CapturesPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<CaptureLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/capture-log")
      .then((r) => {
        if (r.status === 403) { router.push("/admin"); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const filtered = logs.filter((l) =>
    l.user.name.includes(search) || l.user.email.includes(search)
  );

  // 학생별 횟수 집계
  const countMap: Record<string, { name: string; email: string; userId: string; count: number }> = {};
  for (const l of logs) {
    if (!countMap[l.userId]) {
      countMap[l.userId] = { name: l.user.name, email: l.user.email, userId: l.userId, count: 0 };
    }
    countMap[l.userId].count++;
  }
  const topStudents = Object.values(countMap).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3">
        <Link href="/admin" className="text-sm text-slate-500 hover:underline">← 관리자 홈</Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-800">캡처 시도 기록</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">총 시도 횟수</p>
            <p className="text-2xl font-bold text-red-500">{logs.length}회</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">시도한 수강생</p>
            <p className="text-2xl font-bold text-slate-800">{topStudents.length}명</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center sm:col-span-1 col-span-2">
            <p className="text-xs text-slate-500 mb-1">가장 많이 시도</p>
            <p className="text-lg font-bold text-orange-500 truncate">
              {topStudents[0] ? `${topStudents[0].name} (${topStudents[0].count}회)` : "-"}
            </p>
          </div>
        </div>

        {/* 학생별 요약 */}
        {topStudents.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">수강생별 캡처 시도 횟수</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {topStudents.map((s) => (
                <div key={s.userId} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <Link href={`/admin/students/${s.userId}`} className="text-sm font-medium text-slate-800 hover:text-blue-600 hover:underline">
                      {s.name}
                    </Link>
                    <p className="text-xs text-slate-400">{s.email}</p>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    s.count >= 3 ? "bg-red-100 text-red-600" :
                    s.count >= 1 ? "bg-orange-100 text-orange-600" :
                    "bg-slate-100 text-slate-500"
                  }`}>
                    {s.count}회
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 상세 로그 */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <h3 className="font-semibold text-slate-800 flex-1">상세 기록</h3>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 이메일 검색"
              className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loading ? (
            <div className="px-6 py-12 text-center text-slate-400">로딩 중...</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">캡처 시도 기록이 없습니다.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3">수강생</th>
                  <th className="px-6 py-3">시도 방법</th>
                  <th className="px-6 py-3">페이지</th>
                  <th className="px-6 py-3">일시</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-3">
                      <Link href={`/admin/students/${l.userId}`} className="font-medium text-slate-800 hover:text-blue-600 hover:underline">
                        {l.user.name}
                      </Link>
                      <p className="text-xs text-slate-400">{l.user.email}</p>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-xs">
                        {TYPE_LABEL[l.type] ?? l.type}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">
                      {PAGE_LABEL[l.page] ?? l.page}
                    </td>
                    <td className="px-6 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleString("ko-KR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
