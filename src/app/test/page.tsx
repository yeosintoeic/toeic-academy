"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Question {
  id: string;
  part: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  group?: { passageText: string; passageType: string } | null;
}

interface ShuffledOption {
  displayKey: string;
  originalKey: string;
  text: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildShuffledOptions(questions: Question[]): Record<string, ShuffledOption[]> {
  const displayKeys = ["A", "B", "C", "D"];
  const result: Record<string, ShuffledOption[]> = {};
  for (const q of questions) {
    const opts = shuffleArray([
      { originalKey: "A", text: q.optionA },
      { originalKey: "B", text: q.optionB },
      { originalKey: "C", text: q.optionC },
      { originalKey: "D", text: q.optionD },
    ]);
    result[q.id] = opts.map((opt, i) => ({ displayKey: displayKeys[i], ...opt }));
  }
  return result;
}

type Mode = "full" | "part5" | "part6" | "part7";

const MODE_TIMER: Record<Mode, number> = {
  full: 75 * 60,
  part5: 25 * 60,
  part6: 15 * 60,
  part7: 55 * 60,
};

const MODE_LABEL: Record<Mode, string> = {
  full: "실전 모의고사",
  part5: "Part 5 집중연습",
  part6: "Part 6 집중연습",
  part7: "Part 7 집중연습",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface HistoryItem {
  id: string;
  completedAt: string;
  mode: string;
  totalScore: number;
  totalQuestions: number;
  part5Score: number;
  part6Score: number;
  part7Score: number;
}

// ── 시험 기록 화면 ───────────────────────────────────────────
function TestHistory({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetch("/api/test/history").then((r) => r.json()).then((d) => {
      setHistory(Array.isArray(d) ? d : []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">
          ← 뒤로
        </button>
        <h1 className="font-bold text-slate-800">시험 기록</h1>
      </header>
      <main className="max-w-xl mx-auto px-6 py-8">
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 px-6 py-12 text-center text-slate-400">
            아직 응시 기록이 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {history.map((s) => {
                const pct = s.totalQuestions > 0 ? Math.round((s.totalScore / s.totalQuestions) * 100) : 0;
                return (
                  <button
                    key={s.id}
                    onClick={() => router.push(`/results?sessionId=${s.id}`)}
                    className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {MODE_LABEL[s.mode as Mode] ?? s.mode}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(s.completedAt).toLocaleString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-blue-600">{s.totalScore}/{s.totalQuestions}</p>
                        <p className={`text-xs font-medium ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                          {pct}%
                        </p>
                      </div>
                      <span className="text-slate-300">›</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── 유형 선택 화면 ───────────────────────────────────────────
function ModeSelect({ onHistory }: { onHistory: () => void }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-500 hover:text-slate-800">
          ← 대시보드
        </button>
        <h1 className="font-bold text-slate-800">모의고사</h1>
      </header>
      <main className="max-w-xl mx-auto px-6 py-12 space-y-4">
        <button
          onClick={() => router.push("/test?mode=full")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-xl transition-colors text-left"
        >
          <div className="text-base">실전 모의고사</div>
          <div className="text-xs text-blue-200 mt-0.5">Part 5+6+7 · 100문제 · 75분</div>
        </button>
        <button
          onClick={() => router.push("/test?mode=part5")}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 font-semibold px-6 py-4 rounded-xl transition-colors text-left"
        >
          <div className="text-base text-slate-800">Part 5 집중연습</div>
          <div className="text-xs text-slate-400 mt-0.5">단문 빈칸 · 30문제 · 25분</div>
        </button>
        <button
          onClick={() => router.push("/test?mode=part6")}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 font-semibold px-6 py-4 rounded-xl transition-colors text-left"
        >
          <div className="text-base text-slate-800">Part 6 집중연습</div>
          <div className="text-xs text-slate-400 mt-0.5">장문 빈칸 · 지문별 연습 · 15분</div>
        </button>
        <button
          onClick={() => router.push("/test?mode=part7")}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 font-semibold px-6 py-4 rounded-xl transition-colors text-left"
        >
          <div className="text-base text-slate-800">Part 7 집중연습</div>
          <div className="text-xs text-slate-400 mt-0.5">독해 · 지문별 연습 · 55분</div>
        </button>

        {/* 시험 기록 버튼 */}
        <button
          onClick={onHistory}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 font-semibold px-6 py-4 rounded-xl transition-colors text-left flex items-center justify-between group"
        >
          <div>
            <div className="text-base text-slate-800 group-hover:text-blue-700 transition-colors">시험 기록</div>
            <div className="text-xs text-slate-400 mt-0.5">지난 시험 점수와 오답 확인</div>
          </div>
          <span className="text-2xl">📊</span>
        </button>
      </main>
    </div>
  );
}

// ── 실제 시험 컴포넌트 (훅을 최상위에서 호출) ──────────────────
function TestQuiz({ mode }: { mode: Mode }) {
  const router = useRouter();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [optionOrders, setOptionOrders] = useState<Record<string, ShuffledOption[]>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(MODE_TIMER[mode]);

  const submitRef = useRef<() => void>(() => {});

  async function handleSubmit() {
    if (!sessionId || submitting) return;
    setSubmitting(true);

    const payload = questions.map((q) => ({
      questionId: q.id,
      selected: answers[q.id] || "",
    }));

    const res = await fetch("/api/test/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, answers: payload }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSubmitting(false);
      setError(data.error);
      return;
    }

    router.push(`/results?sessionId=${data.sessionId}`);
  }

  submitRef.current = handleSubmit;

  useEffect(() => {
    async function startTest() {
      const res = await fetch("/api/test/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "오류가 발생했습니다.");
        setLoading(false);
        return;
      }
      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setOptionOrders(buildShuffledOptions(data.questions));
      setLoading(false);
    }
    startTest();
  }, [mode]);

  // 타이머 카운트다운
  useEffect(() => {
    if (loading || submitting) return;
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, loading, submitting]);

  // 시간 종료 시 자동 제출
  useEffect(() => {
    if (timeLeft === 0 && !loading) {
      submitRef.current();
    }
  }, [timeLeft, loading]);

  function selectAnswer(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">문제 불러오는 중...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-500">{error}</p>
      <button onClick={() => router.push("/dashboard")} className="text-blue-600 hover:underline">대시보드로 돌아가기</button>
    </div>
  );

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const options: ShuffledOption[] = optionOrders[q.id] ?? [
    { displayKey: "A", originalKey: "A", text: q.optionA },
    { displayKey: "B", originalKey: "B", text: q.optionB },
    { displayKey: "C", originalKey: "C", text: q.optionC },
    { displayKey: "D", originalKey: "D", text: q.optionD },
  ];

  const timerWarning = timeLeft < 5 * 60;
  const timerDanger = timeLeft < 2 * 60;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-blue-600">{MODE_LABEL[mode]}</span>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-700">Part {q.part}</span>
          <span className="text-sm text-slate-500">{current + 1} / {questions.length}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-500">답변 완료: {answered}/{questions.length}</span>
          <span className={`font-mono text-sm font-semibold px-3 py-1 rounded-lg ${
            timerDanger ? "bg-red-100 text-red-700" :
            timerWarning ? "bg-yellow-100 text-yellow-700" :
            "bg-slate-100 text-slate-700"
          }`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {q.group && (
          <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {q.group.passageText}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <p className="text-slate-800 font-medium mb-6 leading-relaxed">{q.questionText}</p>
          <div className="space-y-3">
            {options.map(({ displayKey, originalKey, text }) => (
              <button
                key={displayKey}
                onClick={() => selectAnswer(q.id, originalKey)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  answers[q.id] === originalKey
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className="font-semibold mr-3">{displayKey}.</span>{text}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm disabled:opacity-30 hover:bg-slate-100"
          >
            이전
          </button>

          {current < questions.length - 1 ? (
            <button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={!answers[q.id]}
              title={!answers[q.id] ? "답을 선택해야 넘어갈 수 있습니다" : ""}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "채점 중..." : "제출하기"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto py-1">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-8 rounded text-xs font-medium flex-shrink-0 ${
                i === current
                  ? "bg-blue-600 text-white"
                  : answers[questions[i].id]
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TestContent() {
  const params = useSearchParams();
  const rawMode = params.get("mode");
  const [showHistory, setShowHistory] = useState(false);

  if (rawMode && ["full", "part5", "part6", "part7"].includes(rawMode)) {
    return <TestQuiz mode={rawMode as Mode} />;
  }

  if (showHistory) {
    return <TestHistory onBack={() => setShowHistory(false)} />;
  }

  return <ModeSelect onHistory={() => setShowHistory(true)} />;
}

export default function TestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <TestContent />
    </Suspense>
  );
}
