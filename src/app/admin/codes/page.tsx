"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RegisterCode {
  id: string;
  code: string;
  plan: string;
  durationDays: number;
  label: string;
  createdAt: string;
}

const PLAN_LABEL: Record<string, string> = {
  TEST: "모의고사",
  LECTURE: "강의",
  VOCAB: "단어장",
  FULL: "강의 + 모의고사",
  TEST_VOCAB: "모의고사 + 단어장",
  ALL: "전체 (강의 + 모의고사 + 단어장)",
};

function randomCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<RegisterCode[]>([]);
  const [form, setForm] = useState({ code: "", plan: "ALL", durationDays: 30, label: "" });
  const [bulk, setBulk] = useState(1);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function copyCode(id: string, code: string) {
    navigator.clipboard.writeText(code).catch(() => {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function load() {
    const res = await fetch("/api/admin/codes");
    const data = await res.json();
    setCodes(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  function autoCode() {
    setForm((f) => ({ ...f, code: randomCode() }));
  }

  async function handleCreate(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const count = Math.max(1, bulk);

    if (count === 1) {
      const res = await fetch("/api/admin/codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSaving(false);
      if (res.ok) {
        setMessage("코드가 생성되었습니다.");
        setForm((f) => ({ ...f, code: "" }));
        load();
      } else {
        setMessage(data.error || "오류가 발생했습니다.");
      }
      return;
    }

    // 여러 개 → 서버에서 한번에 생성 (빠름)
    const res = await fetch("/api/admin/codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bulk: true,
        count,
        plan: form.plan,
        durationDays: form.durationDays,
        label: form.label,
        prefix: form.code || "",
      }),
    });
    const data = await res.json();
    setSaving(false);
    setMessage(res.ok ? `${data.created}개 코드가 생성되었습니다.` : "오류가 발생했습니다.");
    setForm((f) => ({ ...f, code: "" }));
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("이 코드를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/codes/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg text-slate-800">등록 코드 관리</h1>
        <Link href="/admin" className="text-sm text-slate-500 hover:underline">← 관리자 홈</Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <h2 className="font-semibold text-slate-800 mb-4">코드 생성</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">플랜</label>
                <select
                  value={form.plan}
                  onChange={(e) => setForm({ ...form, plan: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="TEST">모의고사</option>
                  <option value="LECTURE">강의</option>
                  <option value="VOCAB">단어장</option>
                  <option value="FULL">강의 + 모의고사</option>
                  <option value="TEST_VOCAB">모의고사 + 단어장</option>
                  <option value="ALL">전체 (강의 + 모의고사 + 단어장)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">이용 기간 (일)</label>
                <input
                  type="number"
                  value={form.durationDays}
                  onChange={(e) => setForm({ ...form, durationDays: Math.min(Number(e.target.value), 36500) })}
                  min={1}
                  max={36500}
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">코드 (비우면 자동생성)</label>
                <div className="flex gap-2">
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="자동생성 또는 직접 입력"
                  />
                  <button
                    type="button"
                    onClick={autoCode}
                    className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                  >
                    랜덤
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">생성 개수</label>
                <input
                  type="number"
                  value={bulk}
                  onChange={(e) => setBulk(Math.max(1, Number(e.target.value)))}
                  min={1}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">메모 (선택)</label>
              <input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                placeholder="예: 7월 수강생"
              />
            </div>

            {message && (
              <p className={`text-sm ${message.includes("오류") || message.includes("존재") ? "text-red-500" : "text-green-600"}`}>
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "생성 중..." : bulk > 1 ? `${bulk}개 한번에 생성` : "코드 생성"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">코드 목록</h2>
            <span className="text-xs text-slate-400">{codes.length}개</span>
          </div>
          {codes.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400">등록된 코드가 없습니다.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                  <th className="px-4 py-3 w-10">#</th>
                  <th className="px-4 py-3">코드</th>
                  <th className="px-4 py-3">플랜</th>
                  <th className="px-4 py-3">기간</th>
                  <th className="px-4 py-3">메모</th>
                  <th className="px-4 py-3">관리</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((c, idx) => (
                  <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3 font-mono text-sm font-semibold text-blue-700">{c.code}</td>
                    <td className="px-4 py-3 text-sm">{PLAN_LABEL[c.plan] ?? c.plan}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{c.durationDays >= 36500 ? "무제한" : `${c.durationDays}일`}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{c.label || "-"}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <button
                        onClick={() => copyCode(c.id, c.code)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${copiedId === c.id ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      >
                        {copiedId === c.id ? "복사됨" : "복사"}
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
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
