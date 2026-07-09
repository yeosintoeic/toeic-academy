"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Question {
  id: string;
  part: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation: string;
  category: string;
  groupId: string | null;
  group?: { id: string; passageType: string; passageText: string } | null;
}

interface QuestionGroup {
  id: string;
  part: number;
  passageType: string;
  passageText: string;
  questions: { id: string }[];
}

const EMPTY_FORM = {
  part: 5,
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  answer: "A",
  explanation: "",
  category: "",
  passageText: "",
  passageType: "",
  groupId: "",
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [filterPart, setFilterPart] = useState<number | "all">("all");
  const [tab, setTab] = useState<"questions" | "groups">("questions");

  // 등록 폼
  const [showForm, setShowForm] = useState(false);
  const [groupMode, setGroupMode] = useState<"new" | "existing">("new");
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 수정 폼
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answer: "A",
    explanation: "",
    category: "",
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  // 해설 일괄 재작성 (AI)
  const [reformatCounts, setReformatCounts] = useState<{ part5: number; part6: number; part7: number; total: number } | null>(null);
  const [reformatRunning, setReformatRunning] = useState(false);
  const [reformatLog, setReformatLog] = useState<string[]>([]);
  const reformatStopRef = useRef(false);

  async function loadReformatCounts() {
    const res = await fetch("/api/admin/reformat-explanations");
    if (res.ok) setReformatCounts(await res.json());
  }

  async function runReformat() {
    setReformatRunning(true);
    reformatStopRef.current = false;
    setReformatLog([]);
    while (!reformatStopRef.current) {
      const res = await fetch("/api/admin/reformat-explanations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchSize: 8 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReformatLog((prev) => [...prev, `오류: ${data.error || "알 수 없는 오류"}`]);
        break;
      }
      setReformatLog((prev) => [...prev, `${data.updated}개 완료, ${data.failed.length}개 실패, 남은 문제 ${data.remaining}개`]);
      setReformatCounts((prev) => prev ? { ...prev, total: data.remaining } : prev);
      if (data.remaining === 0 || (data.updated === 0 && data.failed.length === 0)) break;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    setReformatRunning(false);
    loadReformatCounts();
  }

  async function loadQuestions() {
    const res = await fetch("/api/admin/questions");
    const data = await res.json();
    setQuestions(Array.isArray(data) ? data : []);
  }

  async function loadGroups(part?: number) {
    const url = part ? `/api/admin/groups?part=${part}` : "/api/admin/groups";
    const res = await fetch(url);
    const data = await res.json();
    setGroups(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    loadQuestions();
    loadGroups();
    loadReformatCounts();
  }, []);

  useEffect(() => {
    if (form.part === 6 || form.part === 7) {
      loadGroups(form.part);
    }
    setForm((prev) => ({ ...prev, groupId: "", passageText: "", passageType: "" }));
    setGroupMode("new");
  }, [form.part]);

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = groupMode === "existing"
      ? { ...form, passageText: "", passageType: "" }
      : { ...form, groupId: "" };

    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("문제가 등록되었습니다.");
      setForm(EMPTY_FORM);
      setGroupMode("new");
      loadQuestions();
      loadGroups();
    } else {
      setMessage("오류가 발생했습니다.");
    }
  }

  function startEdit(q: Question) {
    setEditingId(q.id);
    setEditForm({
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      answer: q.answer,
      explanation: q.explanation,
      category: q.category,
    });
    setEditMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleUpdate(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!editingId) return;
    setEditSaving(true);
    setEditMessage("");

    const res = await fetch(`/api/admin/questions/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    setEditSaving(false);
    if (res.ok) {
      setEditMessage("수정되었습니다.");
      setEditingId(null);
      loadQuestions();
    } else {
      setEditMessage("오류가 발생했습니다.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("이 문제를 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    loadQuestions();
  }

  async function handleDeleteGroup(id: string) {
    if (!confirm("지문과 해당 지문의 모든 문제를 삭제합니다. 계속하시겠습니까?")) return;
    await fetch(`/api/admin/groups/${id}`, { method: "DELETE" });
    loadQuestions();
    loadGroups();
  }

  const filtered = filterPart === "all" ? questions : questions.filter((q) => q.part === filterPart);
  const filteredGroups = filterPart === "all" ? groups : groups.filter((g) => g.part === filterPart);
  const formGroups = groups.filter((g) => g.part === form.part);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="font-bold text-lg text-slate-800">문제 관리</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm text-slate-500 hover:underline">← 관리자 홈</Link>
          {tab === "questions" && (
            <button
              onClick={() => { setShowForm(!showForm); setEditingId(null); }}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? "닫기" : "+ 문제 등록"}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* 해설 일괄 재작성 (AI) */}
        <div className="bg-white border border-amber-200 rounded-xl p-5 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-slate-800 text-sm mb-1">해설 일괄 재작성 (AI)</h2>
              <p className="text-xs text-slate-500">
                숙제 해설처럼 보기별 상세 형식(✅/❌/💡)으로 재작성합니다.
                {reformatCounts && (
                  <span className="ml-1">
                    남은 문제: 전체 {reformatCounts.total}개 (Part5 {reformatCounts.part5} · Part6 {reformatCounts.part6} · Part7 {reformatCounts.part7})
                  </span>
                )}
              </p>
            </div>
            {reformatRunning ? (
              <button
                onClick={() => { reformatStopRef.current = true; }}
                className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700"
              >
                중지
              </button>
            ) : (
              <button
                onClick={runReformat}
                disabled={!reformatCounts || reformatCounts.total === 0}
                className="bg-amber-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {reformatCounts?.total === 0 ? "모두 완료됨" : "실행"}
              </button>
            )}
          </div>
          {reformatLog.length > 0 && (
            <div className="mt-3 bg-slate-50 rounded-lg p-3 max-h-32 overflow-y-auto text-xs text-slate-600 font-mono space-y-0.5">
              {reformatLog.map((line, i) => <div key={i}>{line}</div>)}
            </div>
          )}
        </div>

        {/* 수정 폼 */}
        {editingId && (
          <div className="bg-white border border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">문제 수정</h2>
              <button onClick={() => setEditingId(null)} className="text-sm text-slate-400 hover:text-slate-600">취소</button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">정답</label>
                <select
                  value={editForm.answer}
                  onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                  className="w-32 border border-slate-300 rounded-lg px-3 py-2 text-sm"
                >
                  {["A", "B", "C", "D"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">문제</label>
                <textarea
                  value={editForm.questionText}
                  onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              {(["A", "B", "C", "D"] as const).map((opt) => (
                <div key={opt}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">보기 {opt}</label>
                  <input
                    value={editForm[`option${opt}` as keyof typeof editForm]}
                    onChange={(e) => setEditForm({ ...editForm, [`option${opt}`]: e.target.value })}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">카테고리</label>
                  <input
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">해설</label>
                  <input
                    value={editForm.explanation}
                    onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
              {editMessage && <p className={`text-sm ${editMessage.includes("오류") ? "text-red-500" : "text-green-600"}`}>{editMessage}</p>}
              <button
                type="submit"
                disabled={editSaving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {editSaving ? "저장 중..." : "수정 완료"}
              </button>
            </form>
          </div>
        )}

        {/* 등록 폼 */}
        {showForm && !editingId && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-slate-800 mb-4">새 문제 등록</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">파트</label>
                  <select
                    value={form.part}
                    onChange={(e) => setForm({ ...form, part: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value={5}>Part 5 (단문 공란)</option>
                    <option value={6}>Part 6 (장문 공란)</option>
                    <option value={7}>Part 7 (독해)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">정답</label>
                  <select
                    value={form.answer}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {["A", "B", "C", "D"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {(form.part === 6 || form.part === 7) && (
                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGroupMode("new")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${groupMode === "new" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      새 지문 작성
                    </button>
                    <button
                      type="button"
                      onClick={() => setGroupMode("existing")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium ${groupMode === "existing" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      기존 지문에 추가 ({formGroups.length}개)
                    </button>
                  </div>

                  {groupMode === "new" && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">지문 내용</label>
                        <textarea
                          value={form.passageText}
                          onChange={(e) => setForm({ ...form, passageText: e.target.value })}
                          rows={5}
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="지문을 입력하세요"
                        />
                      </div>
                      <input
                        value={form.passageType}
                        onChange={(e) => setForm({ ...form, passageType: e.target.value })}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="지문 유형 (email, notice, article...)"
                      />
                    </>
                  )}

                  {groupMode === "existing" && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">지문 선택</label>
                      {formGroups.length === 0 ? (
                        <p className="text-xs text-slate-400">등록된 지문이 없습니다. 새 지문을 작성하세요.</p>
                      ) : (
                        <select
                          value={form.groupId}
                          onChange={(e) => setForm({ ...form, groupId: e.target.value })}
                          required
                          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                        >
                          <option value="">지문을 선택하세요</option>
                          {formGroups.map((g) => (
                            <option key={g.id} value={g.id}>
                              [{g.passageType || "기타"}] {g.passageText.slice(0, 40)}... ({g.questions.length}문제)
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">문제</label>
                <textarea
                  value={form.questionText}
                  onChange={(e) => setForm({ ...form, questionText: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="문제를 입력하세요. 빈칸은 ------- 으로 표시하세요."
                />
              </div>

              {(["A", "B", "C", "D"] as const).map((opt) => (
                <div key={opt}>
                  <label className="block text-xs font-medium text-slate-600 mb-1">보기 {opt}</label>
                  <input
                    value={form[`option${opt}` as keyof typeof form] as string}
                    onChange={(e) => setForm({ ...form, [`option${opt}`]: e.target.value })}
                    required
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">카테고리 (선택)</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="grammar, vocabulary..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">해설 (선택)</label>
                  <input
                    value={form.explanation}
                    onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {message && <p className={`text-sm ${message.includes("오류") ? "text-red-500" : "text-green-600"}`}>{message}</p>}
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "저장 중..." : "문제 등록"}
              </button>
            </form>
          </div>
        )}

        {/* 탭 + 필터 */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setTab("questions")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${tab === "questions" ? "bg-blue-600 text-white" : "text-slate-600"}`}
            >
              문제 목록 ({questions.length})
            </button>
            <button
              onClick={() => setTab("groups")}
              className={`px-3 py-1.5 rounded-md text-xs font-medium ${tab === "groups" ? "bg-blue-600 text-white" : "text-slate-600"}`}
            >
              지문 목록 ({groups.length})
            </button>
          </div>

          <div className="flex gap-1 ml-auto">
            {(["all", 5, 6, 7] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilterPart(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterPart === p ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
              >
                {p === "all" ? "전체" : `Part ${p}`}
              </button>
            ))}
          </div>
        </div>

        {/* 문제 목록 */}
        {tab === "questions" && (
          <div className="bg-white rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-100">
                  <th className="px-4 py-3">파트</th>
                  <th className="px-4 py-3">문제</th>
                  <th className="px-4 py-3">정답</th>
                  <th className="px-4 py-3">수정 / 삭제</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-400">등록된 문제가 없습니다.</td></tr>
                ) : filtered.map((q) => (
                  <tr key={q.id} className={`border-b border-slate-50 hover:bg-slate-50 ${editingId === q.id ? "bg-blue-50" : ""}`}>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">Part {q.part}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 max-w-sm truncate">{q.questionText}</td>
                    <td className="px-4 py-3 text-sm font-bold">{q.answer}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button onClick={() => startEdit(q)} className="text-xs text-blue-500 hover:text-blue-700">수정</button>
                      <button onClick={() => handleDelete(q.id)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 지문 목록 */}
        {tab === "groups" && (
          <div className="space-y-3">
            {filteredGroups.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 px-6 py-12 text-center text-slate-400">등록된 지문이 없습니다.</div>
            ) : filteredGroups.map((g) => (
              <div key={g.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Part {g.part}</span>
                    {g.passageType && <span className="text-xs text-slate-500">{g.passageType}</span>}
                    <span className="text-xs text-slate-400">{g.questions.length}문제</span>
                  </div>
                  <button
                    onClick={() => handleDeleteGroup(g.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    지문 삭제
                  </button>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed line-clamp-4">{g.passageText}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
