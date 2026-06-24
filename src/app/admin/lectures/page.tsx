"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Lecture {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
}

export default function AdminLecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", videoUrl: "", order: 0 });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/admin/lectures");
    const data = await res.json();
    setLectures(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  function startEdit(lec: Lecture) {
    setEditingId(lec.id);
    setForm({ title: lec.title, description: lec.description, videoUrl: lec.videoUrl, order: lec.order });
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const url = editingId ? `/api/admin/lectures/${editingId}` : "/api/admin/lectures";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    if (res.ok) {
      setMessage(editingId ? "수정되었습니다." : "강의가 등록되었습니다.");
      setForm({ title: "", description: "", videoUrl: "", order: 0 });
      setEditingId(null);
      setShowForm(false);
      load();
    } else {
      setMessage("오류가 발생했습니다.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 강의를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/lectures/${id}`, { method: "DELETE" });
    load();
  }

  const isEditing = editingId !== null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg text-slate-800">강의 관리</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-slate-500 hover:underline">← 관리자 홈</Link>
          {!isEditing && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? "닫기" : "+ 강의 등록"}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* 등록/수정 폼 */}
        {(showForm || isEditing) && (
          <div className={`bg-white border rounded-xl p-6 mb-8 ${isEditing ? "border-blue-200" : "border-slate-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">{isEditing ? "강의 수정" : "새 강의 등록"}</h2>
              <button
                onClick={() => { setEditingId(null); setShowForm(false); }}
                className="text-sm text-slate-400 hover:text-slate-600"
              >
                취소
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">강의 제목</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="예: 1강. Part 5 핵심 문법 정리"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">영상 URL (YouTube)</label>
                  <input
                    value={form.videoUrl}
                    onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">설명 (선택)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="강의 내용 소개"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">순서</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              {message && (
                <p className={`text-sm ${message.includes("오류") ? "text-red-500" : "text-green-600"}`}>{message}</p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "저장 중..." : isEditing ? "수정 완료" : "강의 등록"}
              </button>
            </form>
          </div>
        )}

        {/* 강의 목록 */}
        <div className="space-y-3">
          {lectures.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 px-6 py-12 text-center text-slate-400">
              등록된 강의가 없습니다.
            </div>
          ) : lectures.map((lec, i) => (
            <div key={lec.id} className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${editingId === lec.id ? "border-blue-200" : "border-slate-200"}`}>
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{lec.title}</p>
                {lec.description && <p className="text-xs text-slate-400 truncate mt-0.5">{lec.description}</p>}
                {lec.videoUrl && <p className="text-xs text-blue-400 truncate mt-0.5">{lec.videoUrl}</p>}
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={() => startEdit(lec)} className="text-xs text-blue-500 hover:text-blue-700">수정</button>
                <button onClick={() => handleDelete(lec.id)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
