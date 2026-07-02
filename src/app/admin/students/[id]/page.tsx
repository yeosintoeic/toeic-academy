"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface TestSession {
  id: string;
  mode: string;
  completedAt: string;
  part5Score: number;
  part6Score: number;
  part7Score: number;
  totalScore: number;
  totalQuestions: number;
}

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  plan: string;
  planExpiresAt: string | null;
  privacyConsent: boolean;
  marketingConsent: boolean;
  createdAt: string;
  sessions: TestSession[];
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

export default function StudentDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [editPlan, setEditPlan] = useState("");
  const [editExpiry, setEditExpiry] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/students/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setStudent(data);
        setEditPlan(data.plan ?? "NONE");
        setEditExpiry(data.planExpiresAt ? new Date(data.planExpiresAt).toISOString().slice(0, 10) : "");
        setLoading(false);
      });
  }, [id]);

  async function handleDelete() {
    if (!confirm(`${student?.name} 계정을 삭제하시겠습니까? 모든 응시 기록도 함께 삭제됩니다.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin");
    } else {
      setDeleting(false);
      setMsg("삭제 중 오류가 발생했습니다.");
    }
  }

  async function handleResetPassword() {
    if (!confirm(`${student?.name}의 비밀번호를 12345678로 초기화하시겠습니까?\n학생이 다음 로그인 시 새 비밀번호를 설정해야 합니다.`)) return;
    setResetting(true);
    setPwMsg("");
    const res = await fetch(`/api/admin/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetPassword: true }),
    });
    setResetting(false);
    if (res.ok) {
      setPwMsg("임시 비밀번호(12345678)로 초기화되었습니다. 학생이 로그인하면 새 비밀번호 설정 화면이 뜹니다.");
    } else {
      setPwMsg("오류가 발생했습니다.");
    }
  }

  async function handleChangePassword() {
    if (!newPassword || newPassword.length < 8) {
      setPwMsg("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    setPwSaving(true);
    setPwMsg("");
    const res = await fetch(`/api/admin/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    });
    setPwSaving(false);
    if (res.ok) {
      setPwMsg("비밀번호가 변경되었습니다. 학생이 로그인하면 새 비밀번호 설정 화면이 뜹니다.");
      setNewPassword("");
    } else {
      const data = await res.json();
      setPwMsg(data.error || "오류가 발생했습니다.");
    }
  }

  async function handleSavePlan() {
    setSaving(true);
    setMsg("");
    const res = await fetch(`/api/admin/students/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: editPlan, planExpiresAt: editExpiry || null }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("저장되었습니다.");
      setStudent((s) => s ? { ...s, plan: editPlan, planExpiresAt: editExpiry || null } : s);
    } else {
      setMsg("오류가 발생했습니다.");
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (!student) return <div className="min-h-screen flex items-center justify-center text-red-500">수강생을 찾을 수 없습니다.</div>;

  const best = student.sessions.length > 0 ? Math.max(...student.sessions.map((s) => s.totalScore)) : null;
  const avg = student.sessions.length > 0
    ? Math.round(student.sessions.reduce((a, s) => a + s.totalScore, 0) / student.sessions.length)
    : null;
  const isExpired = student.planExpiresAt && new Date(student.planExpiresAt) < new Date();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-slate-500 hover:underline">← 관리자 홈</Link>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-semibold text-slate-800">{student.name}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* 수강생 정보 + 플랜 수정 */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{student.name}</h2>
              <p className="text-sm text-slate-500">{student.email}</p>
              {student.phone && <p className="text-sm text-slate-500 mt-0.5">📞 {student.phone}</p>}
              <p className="text-xs text-slate-400 mt-1">가입일: {new Date(student.createdAt).toLocaleDateString("ko-KR")}</p>
              <div className="flex gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${student.privacyConsent ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                  개인정보 {student.privacyConsent ? "동의" : "미동의"}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${student.marketingConsent ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-400"}`}>
                  마케팅 {student.marketingConsent ? "동의" : "미동의"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                student.plan === "NONE" ? "bg-slate-100 text-slate-500" :
                isExpired ? "bg-red-100 text-red-500" :
                "bg-blue-100 text-blue-700"
              }`}>
                {PLAN_LABEL[student.plan]}{isExpired ? " (만료)" : ""}
              </span>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 transition-colors disabled:opacity-50"
              >
                {deleting ? "삭제 중..." : "계정 삭제"}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-sm font-semibold text-slate-700 mb-3">플랜 수정</p>
            <div className="flex gap-3 flex-wrap items-end">
              <div>
                <label className="block text-xs text-slate-500 mb-1">플랜</label>
                <select
                  value={editPlan}
                  onChange={(e) => setEditPlan(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="NONE">미구독</option>
                  <option value="TEST">모의고사</option>
                  <option value="LECTURE">강의</option>
                  <option value="VOCAB">단어장</option>
                  <option value="FULL">강의 + 모의고사</option>
                  <option value="TEST_VOCAB">모의고사 + 단어장</option>
                  <option value="ALL">전체 (강의 + 모의고사 + 단어장)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">만료일</label>
                <input
                  type="date"
                  value={editExpiry}
                  onChange={(e) => setEditExpiry(e.target.value)}
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleSavePlan}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
            {msg && <p className={`text-xs mt-2 ${msg.includes("오류") ? "text-red-500" : "text-green-600"}`}>{msg}</p>}
          </div>

          {/* 비밀번호 관리 */}
          <div className="border-t border-slate-100 pt-5">
            <p className="text-sm font-semibold text-slate-700 mb-3">비밀번호 관리</p>

            {/* 초기화 버튼 */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex-1">
                <p className="text-xs font-medium text-orange-800">비밀번호 초기화</p>
                <p className="text-xs text-orange-600 mt-0.5">임시 비밀번호(12345678)로 초기화 → 학생이 로그인하면 새 비밀번호 설정 화면으로 이동</p>
              </div>
              <button
                onClick={handleResetPassword}
                disabled={resetting}
                className="flex-shrink-0 px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 disabled:opacity-50 font-medium"
              >
                {resetting ? "초기화 중..." : "초기화"}
              </button>
            </div>

            {/* 직접 지정 */}
            <div className="flex gap-3 flex-wrap items-end">
              <div>
                <label className="block text-xs text-slate-500 mb-1">직접 지정 (8자 이상)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호 입력"
                  className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-64"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={pwSaving}
                className="px-4 py-2 bg-slate-700 text-white text-sm rounded-lg hover:bg-slate-800 disabled:opacity-50"
              >
                {pwSaving ? "변경 중..." : "변경"}
              </button>
            </div>
            {pwMsg && <p className={`text-xs mt-2 ${pwMsg.includes("오류") ? "text-red-500" : "text-green-600"}`}>{pwMsg}</p>}
          </div>
        </div>

        {/* 응시 통계 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">총 응시</p>
            <p className="text-2xl font-bold text-slate-800">{student.sessions.length}회</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">최고 점수</p>
            <p className="text-2xl font-bold text-blue-600">{best ?? "-"}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-500 mb-1">평균 점수</p>
            <p className="text-2xl font-bold text-slate-800">{avg ?? "-"}</p>
          </div>
        </div>

        {/* 응시 기록 */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">응시 기록</h3>
          </div>
          {student.sessions.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">응시 기록이 없습니다.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                  <th className="px-6 py-3">응시일</th>
                  <th className="px-6 py-3">유형</th>
                  <th className="px-6 py-3">Part 5</th>
                  <th className="px-6 py-3">Part 6</th>
                  <th className="px-6 py-3">Part 7</th>
                  <th className="px-6 py-3">총점</th>
                  <th className="px-6 py-3">정답률</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {student.sessions.map((s) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-6 py-3 text-sm text-slate-600">{new Date(s.completedAt).toLocaleDateString("ko-KR")}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.mode === "full" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
                        {s.mode === "full" ? "실전" : `Part ${s.mode.replace("part","")}`}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">{s.mode === "full" || s.mode === "part5" ? `${s.part5Score}/30` : "-"}</td>
                    <td className="px-6 py-3 text-sm">{s.mode === "full" || s.mode === "part6" ? `${s.part6Score}/16` : "-"}</td>
                    <td className="px-6 py-3 text-sm">{s.mode === "full" || s.mode === "part7" ? `${s.part7Score}/54` : "-"}</td>
                    <td className="px-6 py-3 text-sm font-bold text-blue-600">{s.totalScore}/{s.totalQuestions}</td>
                    <td className="px-6 py-3 text-sm text-slate-500">
                      {s.totalQuestions > 0 ? Math.round((s.totalScore / s.totalQuestions) * 100) + "%" : "-"}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => router.push(`/results?sessionId=${s.id}`)}
                        className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 rounded-lg transition-colors"
                      >
                        오답 보기
                      </button>
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
