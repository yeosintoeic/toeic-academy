"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CaptureProtect from "@/components/CaptureProtect";
import KickedOverlay from "@/components/KickedOverlay";

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

function buildShuffledOptions(questions: Question[], shuffle: boolean): Record<string, ShuffledOption[]> {
  const displayKeys = ["A", "B", "C", "D"];
  const result: Record<string, ShuffledOption[]> = {};
  for (const q of questions) {
    const base = [
      { originalKey: "A", text: q.optionA },
      { originalKey: "B", text: q.optionB },
      { originalKey: "C", text: q.optionC },
      { originalKey: "D", text: q.optionD },
    ];
    const opts = shuffle ? shuffleArray(base) : base;
    result[q.id] = opts.map((opt, i) => ({ displayKey: displayKeys[i], ...opt }));
  }
  return result;
}

type Mode = "full" | "part5" | "part6" | "part7" | "homework1" | "homework2";

const HOMEWORK_MODES: Mode[] = ["homework1", "homework2"];

// Part 단독 연습 모드: 시간이 끝나도 자동 제출하지 않고 초과 시간을 표시한다
const STANDALONE_PART_MODES: Mode[] = ["part5", "part6", "part7"];

const MODE_TIMER: Record<Mode, number> = {
  full: 65 * 60,
  part5: 6 * 60,
  part6: 9 * 60,
  part7: 50 * 60,
  homework1: 6 * 60,
  homework2: 6 * 60,
};

// 숙제는 실제 문제의 Part에 맞춰 시간을 동적으로 맞춘다
const PART_TIMER: Record<number, number> = {
  5: MODE_TIMER.part5,
  6: MODE_TIMER.part6,
  7: MODE_TIMER.part7,
};

const MODE_LABEL: Record<Mode, string> = {
  full: "실전 모의고사",
  part5: "Part 5 집중연습",
  part6: "Part 6 집중연습",
  part7: "Part 7 집중연습",
  homework1: "숙제 1번",
  homework2: "숙제 2번",
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
          <div className="text-xs text-blue-200 mt-0.5">Part 5+6+7 · 100문제 · 65분</div>
        </button>
        <button
          onClick={() => router.push("/test?mode=part5")}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 font-semibold px-6 py-4 rounded-xl transition-colors text-left"
        >
          <div className="text-base text-slate-800">Part 5 집중연습</div>
          <div className="text-xs text-slate-400 mt-0.5">단문 빈칸 · 30문제 · 6분</div>
        </button>
        <button
          onClick={() => router.push("/test?mode=part6")}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 font-semibold px-6 py-4 rounded-xl transition-colors text-left"
        >
          <div className="text-base text-slate-800">Part 6 집중연습</div>
          <div className="text-xs text-slate-400 mt-0.5">장문 빈칸 · 16문제 · 9분</div>
        </button>
        <button
          onClick={() => router.push("/test?mode=part7")}
          className="w-full bg-white hover:bg-slate-50 border border-slate-200 font-semibold px-6 py-4 rounded-xl transition-colors text-left"
        >
          <div className="text-base text-slate-800">Part 7 집중연습</div>
          <div className="text-xs text-slate-400 mt-0.5">2중·3중·4중 지문 · 54문제 · 50분</div>
        </button>

        {/* 숙제 버튼 */}
        <button
          onClick={() => router.push("/test?mode=homework1")}
          className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-300 font-semibold px-6 py-4 rounded-xl transition-colors text-left"
        >
          <div className="text-base text-amber-800">숙제</div>
          <div className="text-xs text-amber-500 mt-0.5">고정 문제지 · Part에 맞는 제한시간</div>
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
  const [overtime, setOvertime] = useState(0);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [todaySaveCount, setTodaySaveCount] = useState(0);
  const [kickedDetected, setKickedDetected] = useState(false);
  const MAX_DAILY = 3;

  useEffect(() => {
    function checkSession() {
      fetch("/api/auth/me").then(r => r.json()).then(d => {
        if (d.kicked) {
          setKickedDetected(true);
          fetch("/api/auth/logout", { method: "POST" }).finally(() => {
            setTimeout(() => router.push("/login?kicked=1"), 2500);
          });
          return;
        }
        if (!d.user) { router.push("/login"); return; }
      }).catch(() => {});
    }
    checkSession();
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

  // DB에서 저장된 문제 목록 + 오늘 저장 횟수 불러오기
  useEffect(() => {
    fetch("/api/saved-questions")
      .then(r => r.json())
      .then(d => {
        if (d.saved) setSavedIds(d.saved.map((s: { questionId: string }) => s.questionId));
        if (typeof d.todayCount === "number") setTodaySaveCount(d.todayCount);
      })
      .catch(() => {});
  }, []);

  async function toggleSave(questionId: string, questionText: string) {
    const isSaved = savedIds.includes(questionId);
    if (!isSaved && todaySaveCount >= MAX_DAILY) return;

    if (isSaved) {
      setSavedIds(prev => prev.filter(id => id !== questionId));
      fetch("/api/saved-questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      }).catch(() => {});
    } else {
      const res = await fetch("/api/saved-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, questionText, sessionId }),
      });
      if (res.ok) {
        setSavedIds(prev => [...prev, questionId]);
        const data = await res.json().catch(() => ({}));
        if (typeof data.todayCount === "number") setTodaySaveCount(data.todayCount);
      }
    }
  }

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

    const overtimeQuery = overtime > 0 ? `&overtime=${overtime}` : "";
    router.push(`/results?sessionId=${data.sessionId}${overtimeQuery}`);
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
      setOptionOrders(buildShuffledOptions(data.questions, !HOMEWORK_MODES.includes(mode)));
      if (HOMEWORK_MODES.includes(mode) && data.questions.length > 0) {
        const part = data.questions[0].part;
        if (PART_TIMER[part]) setTimeLeft(PART_TIMER[part]);
      }
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

  // Part 단독연습: 시간이 끝나면 자동 제출하지 않고 초과 시간을 계속 카운트
  useEffect(() => {
    if (loading || submitting) return;
    if (timeLeft > 0) return;
    if (!STANDALONE_PART_MODES.includes(mode)) return;
    const timer = setTimeout(() => setOvertime((t) => t + 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, overtime, loading, submitting, mode]);

  // 시간 종료 시 자동 제출 (Part 단독연습 제외)
  useEffect(() => {
    if (timeLeft === 0 && !loading && !STANDALONE_PART_MODES.includes(mode)) {
      submitRef.current();
    }
  }, [timeLeft, loading, mode]);

  function selectAnswer(questionId: string, option: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      {HOMEWORK_MODES.includes(mode) ? (
        <p className="text-slate-700 font-semibold text-lg">문제를 불러오는 중...</p>
      ) : (
        <>
          <p className="text-slate-700 font-semibold text-lg">AI가 맞춤 문제를 생성하는 중입니다...</p>
          <p className="text-slate-400 text-sm">최대 30초 정도 소요될 수 있습니다</p>
        </>
      )}
    </div>
  );
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

  const isOvertime = timeLeft <= 0 && STANDALONE_PART_MODES.includes(mode);
  const timerWarning = timeLeft < 5 * 60;
  const timerDanger = timeLeft < 2 * 60 || isOvertime;

  return (
    <div className="min-h-screen bg-slate-50">
      <KickedOverlay visible={kickedDetected} />
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
            {isOvertime ? `+${formatTime(overtime)} 초과` : formatTime(timeLeft)}
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {q.group && (() => {
          const isMulti = ["double", "triple", "quad"].includes(q.group!.passageType);
          if (isMulti) {
            const parts = q.group!.passageText.split(/──────────────────────/);
            return (
              <div className="space-y-3 mb-6">
                {parts.map((part, idx) => (
                  <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {part.trim()}
                  </div>
                ))}
              </div>
            );
          }
          return (
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {q.group!.passageText}
            </div>
          );
        })()}

        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 relative">
          <div className="flex items-start justify-between mb-4">
            <p className="text-slate-800 font-medium leading-relaxed flex-1 pr-3">{q.questionText}</p>
            {!HOMEWORK_MODES.includes(mode) && (
              <button
                onClick={() => toggleSave(q.id, q.questionText)}
                title={savedIds.includes(q.id) ? "저장 취소" : todaySaveCount >= MAX_DAILY ? `오늘 저장 한도(${MAX_DAILY}회)를 초과했습니다` : "문제 저장"}
                className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border text-xs transition-colors ${
                  savedIds.includes(q.id)
                    ? "bg-yellow-50 border-yellow-400 text-yellow-700"
                    : todaySaveCount >= MAX_DAILY
                    ? "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-yellow-400 hover:text-yellow-600"
                }`}
              >
                <span className="text-base">{savedIds.includes(q.id) ? "★" : "☆"}</span>
                <span className="font-medium">{todaySaveCount}/{MAX_DAILY}</span>
              </button>
            )}
          </div>
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
              className={`w-8 h-8 rounded text-xs font-medium flex-shrink-0 relative ${
                i === current
                  ? "bg-blue-600 text-white"
                  : answers[questions[i].id]
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {i + 1}
              {savedIds.includes(questions[i].id) && (
                <span className="absolute -top-1 -right-1 text-[8px] text-yellow-500">★</span>
              )}
            </button>
          ))}
        </div>

        {savedIds.length > 0 && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-yellow-700 mb-2">★ 저장된 문제 ({todaySaveCount}/{MAX_DAILY})</p>
            <div className="flex flex-wrap gap-2">
              {savedIds.map((id) => {
                const idx = questions.findIndex((q2) => q2.id === id);
                return idx >= 0 ? (
                  <button
                    key={id}
                    onClick={() => setCurrent(idx)}
                    className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-xs font-medium border border-yellow-300"
                  >
                    {idx + 1}번 문제
                  </button>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TestContent() {
  const params = useSearchParams();
  const rawMode = params.get("mode");
  const [showHistory, setShowHistory] = useState(false);

  if (rawMode && ["full", "part5", "part6", "part7", "homework1", "homework2"].includes(rawMode)) {
    return <TestQuiz mode={rawMode as Mode} />;
  }

  if (showHistory) {
    return <TestHistory onBack={() => setShowHistory(false)} />;
  }

  return <ModeSelect onHistory={() => setShowHistory(true)} />;
}

function TestPageInner() {
  return (
    <>
      <CaptureProtect page="test" />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
        <TestContent />
      </Suspense>
    </>
  );
}

export default function TestPage() {
  return <TestPageInner />;
}
