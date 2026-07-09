import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function callGemini(prompt: string): Promise<string> {
  const result = await model.generateContent(prompt);
  return result.response.text();
}

function parseJSON<T>(text: string): T {
  const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```\s*$/m, "").trim();
  return JSON.parse(cleaned);
}

export interface QuestionForReformat {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation: string;
  passageText?: string | null;
}

function buildPrompt(batch: QuestionForReformat[]): string {
  const items = batch.map((q, i) => {
    const passage = q.passageText ? `[지문]\n${q.passageText}\n\n` : "";
    return `[${i}] id="${q.id}"\n${passage}문제: ${q.questionText}\n(A)${q.optionA} (B)${q.optionB} (C)${q.optionC} (D)${q.optionD}\n정답: ${q.answer}\n기존 해설(문법 포인트 근거 참고용): ${q.explanation}`;
  }).join("\n\n---\n\n");

  return `당신은 TOEIC 전문 영어 강사입니다. 아래 문제들의 해설을 숙제(과제) 해설과 동일한 형식으로 다시 작성하세요.

[해설 형식 예시 — 반드시 이 구조를 그대로 따를 것]:
✅ A (extend)
❌ B (extension) — 명사
❌ C (extensive) — 형용사
❌ D (extensively) — 부사
💡 has decided to 뒤에는 동사원형이 와야 합니다.

규칙:
1. 첫 줄은 "✅ <정답 보기 문자> (<정답 보기 내용>)" — 필요하면 뒤에 " — <핵심 이유>"를 붙여도 됨
2. 정답이 아닌 나머지 3개 보기는 각각 "❌ <보기 문자> (<보기 내용>) — <오답인 이유, 품사/문법 근거 위주로 5~15자>"
3. 마지막 줄은 "💡 <이 문제의 핵심 문법/독해 포인트를 한 문장으로 요약>"
4. 절대 주어진 "정답" 필드를 바꾸지 말 것
5. 기존 해설의 문법 설명이 맞다면 그 내용을 근거로 활용하고, 각 보기 문자와 실제 보기 내용을 정확히 매칭할 것
6. 각 문제의 explanation은 \\n으로 줄바꿈된 하나의 문자열로 작성

아래 문제들에 대해 각각 새 해설을 작성하고, id와 explanation만 담은 JSON 배열로만 응답하세요 (다른 텍스트나 코드블록 표시 없이):
[{"id":"...","explanation":"✅ ...\\n❌ ...\\n❌ ...\\n❌ ...\\n💡 ..."}]

문제 목록:
${items}`;
}

function isValidExplanation(text: unknown): text is string {
  if (typeof text !== "string") return false;
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 3) return false;
  if (!lines[0].startsWith("✅")) return false;
  if (!lines[lines.length - 1].startsWith("💡")) return false;
  return true;
}

// 배치 단위로 Gemini에 재작성을 요청하고 { id: 새 해설 } 맵을 반환한다.
// 응답이 없거나 형식이 잘못된 항목은 맵에서 제외된다 (호출부에서 실패로 처리).
export async function reformatExplanationBatch(
  batch: QuestionForReformat[]
): Promise<Map<string, string>> {
  const text = await callGemini(buildPrompt(batch));
  const results = parseJSON<{ id: string; explanation: string }[]>(text);

  const map = new Map<string, string>();
  for (const r of results) {
    if (r && typeof r.id === "string" && isValidExplanation(r.explanation)) {
      map.set(r.id, r.explanation);
    }
  }
  return map;
}
