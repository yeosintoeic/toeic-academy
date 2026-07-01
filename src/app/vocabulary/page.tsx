"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { vocab, VocabWord } from "@/lib/vocab";
import CaptureProtect, { ContentWatermark } from "@/components/CaptureProtect";

type Mode = "select" | "practice" | "test" | "history";
type Direction = "ko-en" | "en-ko";

interface QuizItem {
  word: VocabWord;
  direction: Direction;
}

interface TestAnswer {
  item: QuizItem;
  userAnswer: string;
  isCorrect: boolean;
}

interface TestRecord {
  id: string;
  date: string;
  score: number;
  total: number;
  wrong: { english: string; korean: string; direction: string; userAnswer: string }[];
}

const HISTORY_KEY = "vocab_test_history";

function loadHistory(): TestRecord[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecord(record: TestRecord) {
  const history = loadHistory();
  history.unshift(record); // 최신 순
  if (history.length > 50) history.length = 50; // 최대 50개 보관
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuiz(): QuizItem[] {
  const pool = vocab.length <= 50 ? shuffle(vocab) : shuffle(vocab).slice(0, 50);
  return pool.map((word) => ({
    word,
    direction: Math.random() < 0.5 ? "ko-en" : "en-ko",
  }));
}

// 뜻을 쉼표로 분리한 배열로 반환 (순서 무관하게 비교하기 위해 정렬)
function splitMeanings(s: string): string[] {
  return s
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
    .sort();
}

// 정답 확인: 여러 뜻은 쉼표로 구분해서 모두 입력해야 정답
function checkAnswer(userInput: string, expected: string): boolean {
  const userParts = splitMeanings(userInput);
  const expectedParts = splitMeanings(expected);
  if (userParts.length !== expectedParts.length) return false;
  return userParts.every((p, i) => p === expectedParts[i]);
}

// ── 단어 연습 ───────────────────────────────────────────────
function PracticeMode({ onBack, watermark }: { onBack: () => void; watermark?: string }) {
  const [quiz] = useState<QuizItem[]>(buildQuiz);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const total = quiz.length;
  const item = quiz[index];

  useEffect(() => {
    if (!submitted) inputRef.current?.focus();
  }, [index, submitted]);

  const submit = useCallback(() => {
    if (!input.trim() || submitted) return;
    const correct = item.direction === "ko-en" ? item.word.english : item.word.korean;
    setIsCorrect(checkAnswer(input, correct));
    setSubmitted(true);
  }, [input, submitted, item]);

  const next = useCallback(() => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setSubmitted(false);
    setIsCorrect(false);
  }, [index, total]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (!submitted) submit();
      else next();
    }
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center max-w-sm w-full">
          <p className="text-4xl mb-4">🎉</p>
          <p className="text-xl font-bold text-slate-800 mb-2">연습 완료!</p>
          <p className="text-sm text-slate-500 mb-8">{total}개 단어를 모두 학습했습니다.</p>
          <button
            onClick={onBack}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            단어장으로
          </button>
        </div>
      </div>
    );
  }

  const prompt = item.direction === "ko-en" ? item.word.korean : item.word.english;
  const correct = item.direction === "ko-en" ? item.word.english : item.word.korean;
  const dirLabel = item.direction === "ko-en" ? "한국어 → 영어" : "영어 → 한국어";
  const meaningCount = correct.split(",").filter((s) => s.trim()).length;
  const isMulti = item.direction === "en-ko" && meaningCount > 1;
  const placeholder = item.direction === "ko-en"
    ? "영어로 입력하세요"
    : isMulti
    ? `뜻 ${meaningCount}개를 쉼표로 구분하여 입력하세요`
    : "한국어로 입력하세요";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">
          ← 뒤로
        </button>
        <h1 className="font-bold text-slate-800">단어 연습</h1>
        <span className="ml-auto text-sm text-slate-400">
          {index + 1} / {total}
        </span>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        {/* 진행 바 */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full mb-8">
          <div
            className="h-1.5 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 relative">
          {watermark && <ContentWatermark label={watermark} />}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-medium text-slate-400">{dirLabel}</p>
            {isMulti && !submitted && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                뜻 {meaningCount}개 · 쉼표로 구분
              </span>
            )}
          </div>

          <p className="text-4xl font-bold text-slate-800 text-center mb-8 leading-tight">
            {prompt}
          </p>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitted}
            placeholder={placeholder}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-400 disabled:bg-slate-50 disabled:text-slate-400 mb-4"
          />

          {!submitted ? (
            <button
              onClick={submit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              확인 (Enter)
            </button>
          ) : (
            <div className="space-y-3">
              {/* 정답/오답 결과 */}
              <div
                className={`rounded-xl p-4 ${
                  isCorrect
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p
                  className={`font-semibold text-sm mb-1 ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isCorrect ? "✓ 정답!" : "✗ 오답"}
                </p>
                <p className="text-sm text-slate-600">
                  정답:{" "}
                  <span className="font-bold text-slate-800">{correct}</span>
                </p>
              </div>

              {/* 예문 */}
              {item.word.sentence && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-medium mb-1.5">예문</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {item.word.sentence}
                  </p>
                </div>
              )}

              <button
                onClick={next}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                {index + 1 >= total ? "완료" : "다음 → (Enter)"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ── 단어 테스트 ─────────────────────────────────────────────
function TestMode({ onBack, watermark }: { onBack: () => void; watermark?: string }) {
  const [quiz] = useState<QuizItem[]>(buildQuiz);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const total = quiz.length;
  const item = quiz[index];

  useEffect(() => {
    inputRef.current?.focus();
  }, [index]);

  const next = useCallback(() => {
    if (!input.trim()) return;
    const correct = item.direction === "ko-en" ? item.word.english : item.word.korean;
    const isCorrect = checkAnswer(input, correct);
    const updated = [...answers, { item, userAnswer: input, isCorrect }];
    setAnswers(updated);

    if (index + 1 >= total) {
      const record: TestRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        score: updated.filter((a) => a.isCorrect).length,
        total,
        wrong: updated
          .filter((a) => !a.isCorrect)
          .map((a) => ({
            english: a.item.word.english,
            korean: a.item.word.korean,
            direction: a.item.direction === "ko-en" ? "한→영" : "영→한",
            userAnswer: a.userAnswer,
          })),
      };
      saveRecord(record);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setInput("");
    }
  }, [item, input, answers, index, total]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") next();
  }

  // 결과 화면
  if (done) {
    const correct = answers.filter((a) => a.isCorrect).length;
    const wrong = answers.filter((a) => !a.isCorrect);
    const pct = Math.round((correct / total) * 100);

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">
            ← 뒤로
          </button>
          <h1 className="font-bold text-slate-800">테스트 결과</h1>
        </header>

        <main className="max-w-xl mx-auto px-6 py-8 space-y-6">
          {/* 점수 카드 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-500 mb-1">점수</p>
            <p className="text-5xl font-bold text-blue-600 mb-1">
              {correct}
              <span className="text-2xl text-slate-400">/{total}</span>
            </p>
            <p className="text-sm text-slate-500">정답률 {pct}%</p>
          </div>

          {wrong.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="font-bold text-green-700">완벽합니다! 모든 단어를 맞혔어요!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">오답노트</h2>
                <span className="text-sm text-red-500 font-medium">{wrong.length}개 틀림</span>
              </div>
              <div className="divide-y divide-slate-100">
                {wrong.map((a, i) => {
                  const q = a.item.direction === "ko-en" ? a.item.word.korean : a.item.word.english;
                  const ans = a.item.direction === "ko-en" ? a.item.word.english : a.item.word.korean;
                  const dirLabel = a.item.direction === "ko-en" ? "한→영" : "영→한";
                  return (
                    <div key={i} className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                          {dirLabel}
                        </span>
                        <span className="text-sm font-semibold text-slate-700">{q}</span>
                      </div>
                      {a.userAnswer ? (
                        <p className="text-sm text-slate-400 line-through mb-0.5">
                          내 답: {a.userAnswer}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 mb-0.5">내 답: (빈칸)</p>
                      )}
                      <p className="text-sm text-blue-600 font-semibold">정답: {ans}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            단어장으로
          </button>
        </main>
      </div>
    );
  }

  // 문제 화면
  const prompt = item.direction === "ko-en" ? item.word.korean : item.word.english;
  const dirLabel = item.direction === "ko-en" ? "한국어 → 영어" : "영어 → 한국어";
  const correct = item.direction === "ko-en" ? item.word.english : item.word.korean;
  const meaningCount = correct.split(",").filter((s) => s.trim()).length;
  const isMulti = item.direction === "en-ko" && meaningCount > 1;
  const placeholder = item.direction === "ko-en"
    ? "영어로 입력하세요"
    : isMulti
    ? `뜻 ${meaningCount}개를 쉼표로 구분하여 입력하세요`
    : "한국어로 입력하세요";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800">
          ← 뒤로
        </button>
        <h1 className="font-bold text-slate-800">단어 테스트</h1>
        <span className="ml-auto text-sm text-slate-400">
          {index + 1} / {total}
        </span>
      </header>

      <main className="max-w-xl mx-auto px-6 py-10">
        {/* 진행 바 */}
        <div className="w-full h-1.5 bg-slate-200 rounded-full mb-8">
          <div
            className="h-1.5 bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${(index / total) * 100}%` }}
          />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 relative">
          {watermark && <ContentWatermark label={watermark} />}
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-medium text-slate-400">{dirLabel}</p>
            {isMulti && (
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                뜻 {meaningCount}개 · 쉼표로 구분
              </span>
            )}
          </div>

          <p className="text-4xl font-bold text-slate-800 text-center mb-8 leading-tight">
            {prompt}
          </p>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-purple-400 mb-4"
          />

          <button
            onClick={next}
            disabled={!input.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {index + 1 >= total ? "결과 보기" : "다음 → (Enter)"}
          </button>
        </div>
      </main>
    </div>
  );
}

// ── 메인 선택 화면 ───────────────────────────────────────────
export default function VocabularyPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("select");
  const [authChecked, setAuthChecked] = useState(false);
  const [watermarkLabel, setWatermarkLabel] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      const data = await r.json();
      if (!r.ok || !data.user) {
        router.push(data?.kicked ? "/login?kicked=1" : "/login");
        return;
      }
      const { user } = data;
      if (user.name) setWatermarkLabel(`${user.name} ${user.email}`);
      const isAdmin = user.role === "ADMIN";
      const expired = !user.planExpiresAt || new Date(user.planExpiresAt) < new Date();
      const canVocab = isAdmin || (!expired && ["VOCAB", "TEST_VOCAB", "ALL"].includes(user.plan));
      if (!canVocab) { router.push("/dashboard?noaccess=vocab"); return; }
      setAuthChecked(true);
    });
  }, [router]);

  // 동시 접속 감지: 30초마다 세션 확인
  useEffect(() => {
    if (!authChecked) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (!res.ok || !data.user) {
          router.push(data?.kicked ? "/login?kicked=1" : "/login");
        }
      } catch { /* 네트워크 오류 무시 */ }
    }, 30000);
    return () => clearInterval(interval);
  }, [authChecked, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        로딩 중...
      </div>
    );
  }

  if (mode === "practice") return <PracticeMode onBack={() => setMode("select")} watermark={watermarkLabel} />;
  if (mode === "test") return <TestMode onBack={() => setMode("select")} watermark={watermarkLabel} />;
  if (mode === "history") return <HistoryMode onBack={() => setMode("select")} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <CaptureProtect page="vocabulary" />
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          ← 대시보드
        </button>
        <h1 className="font-bold text-slate-800">단어장</h1>
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">단어 학습</h2>
          <p className="text-sm text-slate-500">
            매 세션마다 50개의 단어가 무작위로 출제됩니다.
            <br />
            한국어 ↔ 영어 방향도 매 문제마다 랜덤으로 결정됩니다.
          </p>
        </div>

        <div className="space-y-4">
          {/* 단어 연습 카드 */}
          <button
            onClick={() => setMode("practice")}
            className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-blue-300 hover:bg-blue-50/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-700 transition-colors">
                  단어 연습
                </p>
                <p className="text-sm text-slate-500">
                  입력하면 즉시 정답과 예문을 확인할 수 있어요
                </p>
              </div>
              <span className="text-3xl">✏️</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">즉각 피드백</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">예문 제공</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">랜덤 출제</span>
            </div>
          </button>

          {/* 단어 테스트 카드 */}
          <button
            onClick={() => setMode("test")}
            className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-purple-300 hover:bg-purple-50/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-slate-800 text-lg mb-1 group-hover:text-purple-700 transition-colors">
                  단어 테스트
                </p>
                <p className="text-sm text-slate-500">
                  50개 문제를 모두 풀고 나서 오답노트를 확인하세요
                </p>
              </div>
              <span className="text-3xl">📝</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">50문제</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">오답노트</span>
              <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">랜덤 출제</span>
            </div>
          </button>

          {/* 시험 기록 카드 */}
          <button
            onClick={() => setMode("history")}
            className="w-full bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-slate-800 text-lg mb-1 group-hover:text-emerald-700 transition-colors">
                  시험 기록
                </p>
                <p className="text-sm text-slate-500">지난 테스트 점수와 오답 내역을 확인하세요</p>
              </div>
              <span className="text-3xl">📊</span>
            </div>
          </button>
        </div>

        <p className="mt-10 text-xs text-slate-400 text-center">
          총 {vocab.length}개 단어 · 한 ↔ 영 랜덤 방향
        </p>
      </main>
    </div>
  );
}

// ── 시험 기록 화면 ───────────────────────────────────────────
function HistoryMode({ onBack }: { onBack: () => void }) {
  const [history, setHistory] = useState<TestRecord[]>([]);
  const [selected, setSelected] = useState<TestRecord | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  if (selected) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSelected(null)} className="text-sm text-slate-500 hover:text-slate-800">
            ← 목록으로
          </button>
          <h1 className="font-bold text-slate-800">시험 상세</h1>
        </header>
        <main className="max-w-xl mx-auto px-6 py-8 space-y-6">
          {/* 점수 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-500 mb-1">
              {new Date(selected.date).toLocaleString("ko-KR")}
            </p>
            <p className="text-5xl font-bold text-blue-600 mb-1">
              {selected.score}
              <span className="text-2xl text-slate-400">/{selected.total}</span>
            </p>
            <p className="text-sm text-slate-500">
              정답률 {Math.round((selected.score / selected.total) * 100)}%
            </p>
          </div>

          {/* 오답노트 */}
          {selected.wrong.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <p className="font-bold text-green-700">오답 없음 — 완벽했어요!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">오답노트</h2>
                <span className="text-sm text-red-500 font-medium">{selected.wrong.length}개 틀림</span>
              </div>
              <div className="divide-y divide-slate-100">
                {selected.wrong.map((w, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                        {w.direction}
                      </span>
                      <span className="text-sm font-semibold text-slate-700">
                        {w.direction === "한→영" ? w.korean : w.english}
                      </span>
                    </div>
                    {w.userAnswer ? (
                      <p className="text-sm text-slate-400 line-through mb-0.5">내 답: {w.userAnswer}</p>
                    ) : (
                      <p className="text-sm text-slate-400 mb-0.5">내 답: (빈칸)</p>
                    )}
                    <p className="text-sm text-blue-600 font-semibold">
                      정답: {w.direction === "한→영" ? w.english : w.korean}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

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
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            아직 응시한 테스트가 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {history.map((r) => {
                const pct = Math.round((r.score / r.total) * 100);
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="w-full px-6 py-4 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {r.score}/{r.total}점
                        <span className={`ml-2 text-xs font-medium ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                          {pct}%
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(r.date).toLocaleString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {r.wrong.length > 0 && (
                        <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                          오답 {r.wrong.length}개
                        </span>
                      )}
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
