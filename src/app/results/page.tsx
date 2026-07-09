"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

interface AnswerDetail {
  id: string;
  selected: string;
  isCorrect: boolean;
  question: {
    id: string;
    part: number;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    answer: string;
    explanation: string;
    group: { id: string; passageText: string; passageType: string } | null;
  };
}

interface TestResult {
  id: string;
  mode: string;
  completedAt: string;
  part5Score: number;
  part6Score: number;
  part7Score: number;
  totalScore: number;
  totalQuestions: number;
  answers: AnswerDetail[];
}

// Raw score (0-100) → TOEIC RC score (5-495) 환산표 (선형 보간)
const RC_TABLE: [number, number][] = [
  [0, 5], [5, 50], [10, 80], [15, 105], [20, 135],
  [25, 165], [30, 190], [35, 220], [40, 250], [45, 275],
  [50, 305], [55, 330], [60, 355], [65, 380], [70, 400],
  [75, 420], [80, 440], [85, 455], [90, 470], [95, 485], [100, 495],
];

function toRCScore(raw: number, total: number): number {
  // total이 100 미만이면 100문제 기준으로 예상 환산
  const scaled = total > 0 ? Math.round((raw / total) * 100) : 0;
  for (let i = 0; i < RC_TABLE.length - 1; i++) {
    const [r0, s0] = RC_TABLE[i];
    const [r1, s1] = RC_TABLE[i + 1];
    if (scaled >= r0 && scaled <= r1) {
      const t = (scaled - r0) / (r1 - r0);
      return Math.round((s0 + t * (s1 - s0)) / 5) * 5;
    }
  }
  return scaled >= 100 ? 495 : 5;
}

function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("sessionId");
  const overtimeSeconds = parseInt(params.get("overtime") || "0", 10) || 0;

  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [filterPart, setFilterPart] = useState<"all" | 5 | 6 | 7>("all");
  const [filterCorrectness, setFilterCorrectness] = useState<"all" | "correct" | "wrong">("all");

  useEffect(() => {
    if (!sessionId) {
      setError("결과를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }
    fetch(`/api/test/results/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setResult(data);
        }
        setLoading(false);
      });
  }, [sessionId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  if (error || !result) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-500">{error || "결과를 불러올 수 없습니다."}</p>
      <button onClick={() => router.push("/dashboard")} className="text-blue-600 hover:underline">대시보드로 돌아가기</button>
    </div>
  );

  const { mode, part5Score, part6Score, part7Score, totalScore, totalQuestions, answers } = result;

  // 실제 답변 기반으로 파트별 총 문제 수 계산 (하드코딩 대신 실제 생성된 수 반영)
  const part5Total = answers.filter(a => a.question.part === 5).length;
  const part6Total = answers.filter(a => a.question.part === 6).length;
  const part7Total = answers.filter(a => a.question.part === 7).length;

  const pct = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
  const rcScore = toRCScore(totalScore, totalQuestions);
  const isPartOnly = mode === "part5" || mode === "part6" || mode === "part7";
  const partLabel: Record<string, string> = { part5: "Part 5", part6: "Part 6", part7: "Part 7" };
  const partTotal: Record<string, number> = { part5: part5Total || 30, part6: part6Total || 16, part7: part7Total || 54 };
  const partScore: Record<string, number> = { part5: part5Score, part6: part6Score, part7: part7Score };

  const seenGroupIds = new Set<string>();
  const filteredAnswers = answers.filter((a) => {
    if (filterPart !== "all" && a.question.part !== filterPart) return false;
    if (filterCorrectness === "correct" && !a.isCorrect) return false;
    if (filterCorrectness === "wrong" && a.isCorrect) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push("/dashboard")} className="text-sm text-slate-500 hover:text-slate-800">
          ← 대시보드
        </button>
        <h1 className="font-bold text-slate-800">채점 결과</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* 점수 요약 */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center mb-8 print:hidden">
          <p className="text-slate-500 text-sm mb-2">수고하셨습니다!</p>

          {isPartOnly ? (
            /* 파트별 집중연습 점수 */
            <>
              <p className="text-xs text-slate-400 mb-1">{partLabel[mode]} 점수</p>
              <div className="mb-1">
                <span className="text-6xl font-bold text-blue-600">{partScore[mode]}</span>
                <span className="text-2xl font-semibold text-blue-400"> / {partTotal[mode]}점</span>
              </div>
              <p className="text-slate-400 text-sm mb-2">
                정답률 {pct}%
              </p>
              {overtimeSeconds > 0 && (
                <p className="inline-block text-xs font-semibold text-red-600 bg-red-50 rounded-lg px-3 py-1.5 mb-4">
                  시간 {Math.floor(overtimeSeconds / 60)}분 {overtimeSeconds % 60}초 초과했습니다
                </p>
              )}
              <div className="bg-slate-50 rounded-xl p-5 mb-6">
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-400" : "bg-red-400"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className={`text-sm font-semibold ${pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-red-500"}`}>
                  {pct >= 80 ? "훌륭합니다!" : pct >= 60 ? "좋은 성과입니다!" : "더 연습해보세요!"}
                </p>
              </div>
            </>
          ) : (
            /* 실전 모의고사 - RC 환산 점수 */
            <>
              <div className="mb-1">
                <span className="text-6xl font-bold text-blue-600">{rcScore}</span>
                <span className="text-2xl font-semibold text-blue-400"> / 495</span>
              </div>
              <p className="text-xs text-slate-400 mb-1">RC 환산 점수</p>
              <p className="text-slate-400 text-sm mb-6">
                정답 {totalScore} / {totalQuestions}문제 ({pct}%)
              </p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Part 5</p>
                  <p className="text-xl font-bold text-slate-800">{part5Score}<span className="text-sm font-normal text-slate-400"> / {part5Total || 30}</span></p>
                  {part5Total > 0 && <p className="text-xs text-slate-400 mt-1">{Math.round((part5Score / part5Total) * 100)}%</p>}
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Part 6</p>
                  <p className="text-xl font-bold text-slate-800">{part6Score}<span className="text-sm font-normal text-slate-400"> / {part6Total || 16}</span></p>
                  {part6Total > 0 && <p className="text-xs text-slate-400 mt-1">{Math.round((part6Score / part6Total) * 100)}%</p>}
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-1">Part 7</p>
                  <p className="text-xl font-bold text-slate-800">{part7Score}<span className="text-sm font-normal text-slate-400"> / {part7Total || 54}</span></p>
                  {part7Total > 0 && <p className="text-xs text-slate-400 mt-1">{Math.round((part7Score / part7Total) * 100)}%</p>}
                </div>
              </div>
              <div className={`rounded-xl p-4 mb-6 text-sm ${
                rcScore >= 400 ? "bg-green-50 text-green-700" :
                rcScore >= 280 ? "bg-yellow-50 text-yellow-700" :
                "bg-red-50 text-red-700"
              }`}>
                {rcScore >= 400 ? "훌륭합니다! 목표 점수에 가까워지고 있어요." :
                 rcScore >= 280 ? "좋은 성과입니다. 조금만 더 노력하면 됩니다!" :
                 "더 많은 연습이 필요합니다. 포기하지 마세요!"}
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/test")}
              className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              다시 풀기
            </button>
            <button
              onClick={() => setShowReview((v) => !v)}
              className="flex-1 border border-slate-300 text-slate-700 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50"
            >
              {showReview ? "해설 닫기" : "오답 해설 보기"}
            </button>
          </div>
        </div>

        {/* 오답 해설 섹션 */}
        {showReview && (
          <div>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {(["all", 5, 6, 7] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPart(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterPart === p ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600"}`}
                >
                  {p === "all" ? "전체" : `Part ${p}`}
                </button>
              ))}
              <div className="flex rounded-lg overflow-hidden border border-slate-200 text-xs font-medium">
                {(["all", "correct", "wrong"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterCorrectness(f)}
                    className={`px-3 py-1.5 ${
                      filterCorrectness === f
                        ? f === "wrong" ? "bg-red-500 text-white" : f === "correct" ? "bg-green-500 text-white" : "bg-blue-600 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {f === "all" ? "전체" : f === "correct" ? "정답" : "오답"}
                  </button>
                ))}
              </div>
              <button
                onClick={() => window.print()}
                className="ml-auto px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1 print:hidden"
              >
                🖨️ 인쇄하기
              </button>
              <span className="text-xs text-slate-400">{filteredAnswers.length}문제</span>
            </div>

            <div className="space-y-4">
              {filteredAnswers.map((a, idx) => {
                const q = a.question;
                const showPassage = q.group && !seenGroupIds.has(q.group.id);
                if (q.group) seenGroupIds.add(q.group.id);

                const opts = [
                  { key: "A", text: q.optionA },
                  { key: "B", text: q.optionB },
                  { key: "C", text: q.optionC },
                  { key: "D", text: q.optionD },
                ];

                return (
                  <div key={a.id}>
                    {showPassage && q.group && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        <p className="text-xs font-semibold text-amber-700 mb-2 uppercase">{q.group.passageType || "지문"}</p>
                        {q.group.passageText}
                      </div>
                    )}

                    <div className={`bg-white border rounded-xl p-5 ${a.isCorrect ? "border-slate-200" : "border-red-200"}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-500">Q{idx + 1} · Part {q.part}</span>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${a.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {a.isCorrect ? "정답" : "오답"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-800 font-medium mb-4 leading-relaxed">{q.questionText}</p>

                      <div className="space-y-2">
                        {opts.map(({ key, text }) => {
                          const isSelected = a.selected === key;
                          const isCorrect = q.answer === key;
                          let cls = "border-slate-100 text-slate-500";
                          if (isCorrect) cls = "border-green-400 bg-green-50 text-green-800 font-semibold";
                          else if (isSelected && !a.isCorrect) cls = "border-slate-200 text-slate-400";

                          return (
                            <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${cls}`}>
                              <span className="font-semibold flex-shrink-0">{key}.</span>
                              <span className={isSelected && !a.isCorrect ? "line-through" : ""}>{text}</span>
                              {isCorrect && (
                                <span className="ml-auto flex items-center gap-1 text-xs text-green-600 flex-shrink-0 font-semibold">
                                  ✓ 정답
                                </span>
                              )}
                              {isSelected && !a.isCorrect && (
                                <span className="ml-auto text-xs text-slate-400 flex-shrink-0">내가 선택</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                          {q.explanation.split(/\n|\\n/).map((line, li) => {
                            if (line.startsWith("✅")) {
                              return (
                                <div key={li} className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800 leading-relaxed">
                                  {line}
                                </div>
                              );
                            }
                            if (line.startsWith("❌")) {
                              return (
                                <div key={li} className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-800 leading-relaxed">
                                  {line}
                                </div>
                              );
                            }
                            if (line.startsWith("💡")) {
                              return (
                                <div key={li} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800 leading-relaxed font-medium">
                                  {line}
                                </div>
                              );
                            }
                            return line.trim() ? (
                              <p key={li} className="text-xs text-slate-500 leading-relaxed">{line}</p>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredAnswers.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">해당하는 문제가 없습니다.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <ResultContent />
    </Suspense>
  );
}
