"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Question {
  id: string;
  part: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  homeworkOrder: number | null;
  group: { id: string; passageText: string; passageType: string } | null;
}

function PrintContent() {
  const params = useSearchParams();
  const router = useRouter();
  const setNum = params.get("set") === "2" ? 2 : 1;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/homework/print?set=${setNum}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setQuestions(Array.isArray(data.questions) ? data.questions : []);
        setLoading(false);
      });
  }, [setNum]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">불러오는 중...</div>;
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-red-500">{error}</p>
      <button onClick={() => router.push("/admin/questions")} className="text-blue-600 hover:underline">문제 관리로 돌아가기</button>
    </div>
  );

  const part5 = questions.filter((q) => q.part === 5);
  const part6 = questions.filter((q) => q.part === 6);
  const part7 = questions.filter((q) => q.part === 7);
  const displayNumber = new Map(questions.map((q, i) => [q.id, i + 1]));

  function groupedByPassage(list: Question[]) {
    const chunks: { group: Question["group"]; items: Question[] }[] = [];
    for (const q of list) {
      const last = chunks[chunks.length - 1];
      if (q.group && last && last.group?.id === q.group.id) {
        last.items.push(q);
      } else {
        chunks.push({ group: q.group, items: [q] });
      }
    }
    return chunks;
  }

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      <style>{`
        @page { size: A4; margin: 14mm 12mm; }
        @media print {
          html, body { font-size: 13pt; }
          .exam-sheet { font-size: 13pt; }
        }
      `}</style>

      <div className="print:hidden bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/questions")} className="text-sm text-slate-500 hover:text-slate-800">← 문제 관리</button>
          <h1 className="font-bold text-slate-800">숙제 {setNum}번 인쇄 미리보기</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push(`/admin/homework/print?set=${setNum === 1 ? 2 : 1}`)} className="text-sm px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50">
            숙제 {setNum === 1 ? 2 : 1}번 보기
          </button>
          <button onClick={() => window.print()} className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            🖨️ 인쇄
          </button>
        </div>
      </div>

      <div className="exam-sheet max-w-[900px] mx-auto bg-white px-10 py-8 print:px-0 print:py-0 print:max-w-none leading-snug">
        <div className="text-center mb-5 pb-3 border-b-4 border-double border-slate-800">
          <h2 className="text-xl font-bold tracking-wide">여신토익 숙제 {setNum}번</h2>
          <p className="text-sm text-slate-500 mt-1">Part 5 · Part 6 · Part 7 — 총 {questions.length}문제</p>
        </div>

        {part5.length > 0 && (
          <section className="mb-5 break-inside-avoid">
            <h3 className="font-bold border-b border-slate-800 pb-1 mb-2">Part 5</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {part5.map((q) => (
                <div key={q.id} className="break-inside-avoid">
                  <p className="font-medium">{displayNumber.get(q.id)}. {q.questionText}</p>
                  <p className="text-slate-700 pl-3">
                    (A) {q.optionA} &nbsp; (B) {q.optionB} &nbsp; (C) {q.optionC} &nbsp; (D) {q.optionD}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {part6.length > 0 && (
          <section className="mb-5">
            <h3 className="font-bold border-b border-slate-800 pb-1 mb-2">Part 6</h3>
            {groupedByPassage(part6).map((chunk, ci) => (
              <div key={ci} className="mb-3 break-inside-avoid">
                {chunk.group && (
                  <div className="border border-slate-300 rounded p-2 mb-1.5 whitespace-pre-wrap text-slate-800">
                    {chunk.group.passageText}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {chunk.items.map((q) => (
                    <div key={q.id}>
                      <p className="font-medium">{displayNumber.get(q.id)}. {q.questionText}</p>
                      <p className="text-slate-700 pl-3">
                        (A) {q.optionA} &nbsp; (B) {q.optionB} &nbsp; (C) {q.optionC} &nbsp; (D) {q.optionD}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {part7.length > 0 && (
          <section className="mb-5">
            <h3 className="font-bold border-b border-slate-800 pb-1 mb-2">Part 7</h3>
            {groupedByPassage(part7).map((chunk, ci) => (
              <div key={ci} className="mb-3 break-inside-avoid">
                {chunk.group && (
                  <div className="border border-slate-300 rounded p-2 mb-1.5 whitespace-pre-wrap text-slate-800">
                    {chunk.group.passageText}
                  </div>
                )}
                <div className="space-y-2">
                  {chunk.items.map((q) => (
                    <div key={q.id}>
                      <p className="font-medium">{displayNumber.get(q.id)}. {q.questionText}</p>
                      <p className="text-slate-700 pl-3">
                        (A) {q.optionA} &nbsp; (B) {q.optionB} &nbsp; (C) {q.optionC} &nbsp; (D) {q.optionD}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

      </div>
    </div>
  );
}

export default function HomeworkPrintPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">불러오는 중...</div>}>
      <PrintContent />
    </Suspense>
  );
}
