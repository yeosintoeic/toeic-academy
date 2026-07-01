import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

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

interface RawQuestion {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  answer: string;
  explanation: string;
}

function isValidQuestion(q: RawQuestion): boolean {
  // 정답이 반드시 A/B/C/D 중 정확히 1개여야 함
  const ans = (q.answer ?? "").trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(ans)) return false;
  // 4개 보기 모두 서로 달라야 함
  const opts = [q.optionA, q.optionB, q.optionC, q.optionD]
    .map(o => (o ?? "").trim().toLowerCase())
    .filter(o => o.length > 0);
  return opts.length === 4 && new Set(opts).size === 4;
}

// Part 5: 30 standalone grammar/vocab questions
export async function generatePart5(): Promise<string[]> {
  const samples = await prisma.question.findMany({ where: { part: 5 }, take: 12 });
  const examples = samples.slice(0, 6).map(q =>
    `문제: ${q.questionText}\n(A)${q.optionA}  (B)${q.optionB}  (C)${q.optionC}  (D)${q.optionD}\n정답: ${q.answer}\n해설: ${q.explanation}`
  ).join("\n\n");

  const text = await callGemini(`당신은 TOEIC 전문 출제 위원이자 영어 강사입니다. 아래 참고 문제들의 스타일, 난이도, 문법 포인트를 분석하여 동일한 수준의 새로운 문제 30개를 만드세요.

[참고 문제 - 이 스타일/난이도를 기반으로 생성]:
${examples || "(참고 데이터 없음 - TOEIC 표준 형식 사용)"}

위 문제들을 분석하여 같은 패턴, 같은 난이도로 새 문제 30개 생성.
JSON 배열만 반환 (다른 텍스트 없이).

절대 규칙:
1. 4개 보기(optionA~D)는 반드시 모두 서로 다른 단어/표현 (중복 절대 금지)
2. 정답은 반드시 1개만 (answer 필드에 A/B/C/D 중 하나)
3. 해설은 반드시 아래 형식의 상세한 한국어 해설

해설 형식 (explanation 필드) — 반드시 이 구조를 따를 것:
"✅ 정답 이유: [정답이 왜 맞는지 문법 규칙과 문장 구조를 근거로 2~3문장 상세 설명]\\n❌ 오답 분석: (X)는 [이유] · (X)는 [이유] · (X)는 [이유]\\n💡 핵심 포인트: [이 문제에서 반드시 기억할 문법 규칙 1줄 요약]"

해설 예시:
"✅ 정답 이유: 'before the meeting'은 과거의 기준점을 나타내며, 주어 The manager가 직접 보고서를 검토하는 능동 관계이므로 과거형 reviewed가 정답입니다. 문장에서 별도 조동사나 be동사가 없으므로 단순과거형이 적합합니다.\\n❌ 오답 분석: (B)reviewing은 현재분사로 단독 동사 역할 불가 · (C)review는 동사원형/현재형으로 과거 시제 불일치 · (D)to review는 부정사로 주동사 역할 불가\\n💡 핵심 포인트: before/after/when 등 시간 부사절이 있을 때 → 문맥에 맞는 시제(과거/현재/미래)를 주절에 적용"

형식:
[{"questionText":"The manager ------- the report before the meeting.","optionA":"reviewed","optionB":"reviewing","optionC":"review","optionD":"to review","answer":"A","explanation":"✅ 정답 이유: ...\\n❌ 오답 분석: ...\\n💡 핵심 포인트: ..."}]

문법 주제 고르게 분배: 전치사, 조동사, 시제, 품사, 관계절, 접속사, 부정사, 동명사, 수동태
비즈니스 영어, TOEIC 600-900 난이도`);

  let questions: RawQuestion[];
  try {
    questions = parseJSON<RawQuestion[]>(text);
  } catch {
    console.error("Part 5 JSON parse failed:", text.slice(0, 200));
    throw new Error("Part 5 생성 실패");
  }

  const valid = questions.filter(isValidQuestion);
  if (valid.length < 30) {
    throw new Error(`Part 5 유효 문제 부족: ${valid.length}/30`);
  }

  const ts = Date.now();
  const data = valid.slice(0, 30).map((q, i) => ({
    id: `gen_p5_${ts}_${i}`,
    part: 5,
    questionText: q.questionText,
    optionA: q.optionA,
    optionB: q.optionB,
    optionC: q.optionC,
    optionD: q.optionD,
    answer: (q.answer || "A").toUpperCase().charAt(0),
    explanation: q.explanation || "",
  }));

  await prisma.question.createMany({ data });
  return data.map(d => d.id);
}

interface RawGroup {
  passageText: string;
  questions: RawQuestion[];
}

// Part 6: 4 passages × 4 questions = 16 questions
export async function generatePart6(): Promise<string[]> {
  const sampleGroups = await prisma.questionGroup.findMany({
    where: { part: 6 },
    include: { questions: { orderBy: { id: "asc" } } },
    take: 3,
  });

  const examples = sampleGroups.slice(0, 2).map((g, gi) =>
    `[참고 지문 ${gi + 1}]\n${g.passageText?.slice(0, 300)}...\n\n` +
    g.questions.slice(0, 4).map((q, qi) =>
      `(${qi + 1}) ${q.questionText}: (A)${q.optionA} (B)${q.optionB} (C)${q.optionC} (D)${q.optionD} → ${q.answer}`
    ).join("\n")
  ).join("\n\n---\n\n");

  const text = await callGemini(`당신은 TOEIC 전문 출제 위원이자 영어 강사입니다. 아래 참고 문제들의 스타일과 형식을 분석하여 새로운 Part 6 지문 4개를 만드세요.

[참고 문제]:
${examples || "(참고 데이터 없음 - TOEIC Part 6 표준 형식 사용)"}

위 참고를 기반으로 새 지문 4개 생성. JSON 배열만 반환.

절대 규칙:
1. 각 지문에 빈칸 정확히 4개: (1)(2)(3)(4) 표시
2. 각 빈칸 보기 4개(optionA~D)는 반드시 모두 다른 단어/표현 (중복 절대 금지)
3. 정답 1개만
4. 해설은 반드시 아래 형식의 상세 한국어 해설

해설 형식 (explanation 필드) — 반드시 이 구조를 따를 것:
"✅ 정답 이유: [지문의 어느 부분을 보면 왜 이 단어가 맞는지 문법 구조 근거로 2~3문장 설명]\\n❌ 오답 분석: (X)는 [이유] · (X)는 [이유] · (X)는 [이유]\\n💡 핵심 포인트: [이 빈칸에서 테스트하는 핵심 문법 규칙]"

형식:
[{
  "passageText": "Dear Ms. Kim,\\n\\nWe are pleased to ------- (1) you that your application has been ------- (2)...",
  "questions": [
    {"questionText":"(1)","optionA":"inform","optionB":"informing","optionC":"informed","optionD":"information","answer":"A","explanation":"✅ 정답 이유: 'be pleased to' 구조에서 to 뒤에는 동사원형이 와야 합니다. 이 문장에서 주어는 회사이고 you(지원자)에게 알리는 능동 의미이므로 inform이 정답입니다.\\n❌ 오답 분석: (B)informing은 현재분사로 to 뒤에 불가 · (C)informed는 과거분사로 수동 의미가 되어 문맥 불일치 · (D)information은 명사로 동사 자리에 사용 불가\\n💡 핵심 포인트: be pleased/happy/glad/eager + to + 동사원형"},
    {"questionText":"(2)","optionA":"approve","optionB":"approved","optionC":"approving","optionD":"approval","answer":"B","explanation":"✅ 정답 이유: 'has been + 과거분사'는 현재완료 수동태 구조입니다. 지원서(application)는 검토 위원회에 의해 '승인된' 수동 관계이므로 과거분사 approved가 정답입니다.\\n❌ 오답 분석: (A)approve는 동사원형으로 has been 뒤에 불가 · (C)approving은 능동 의미의 현재분사 · (D)approval은 명사로 동사 자리 불가\\n💡 핵심 포인트: 현재완료 수동태 = have/has + been + 과거분사"},
    {"questionText":"(3)","optionA":"hold","optionB":"held","optionC":"holding","optionD":"holds","answer":"B","explanation":"✅ 정답 이유: 'will be + 과거분사'는 미래 수동태 구조입니다. 인터뷰(interview)가 '개최될' 것이므로 수동의 의미가 되어야 하며, 조동사 will 뒤의 be와 함께 과거분사 held가 와야 합니다.\\n❌ 오답 분석: (A)hold는 동사원형(능동) · (C)holding은 현재분사(능동) · (D)holds는 현재 3인칭 단수형\\n💡 핵심 포인트: 미래 수동태 = will be + 과거분사"},
    {"questionText":"(4)","optionA":"take","optionB":"taking","optionC":"taken","optionD":"takes","answer":"A","explanation":"✅ 정답 이유: 'Please + 동사원형'은 공손한 명령문 형식입니다. 지원자에게 이 기회를 진지하게 여기라고 요청하는 문맥이므로 동사원형 take가 정답입니다.\\n❌ 오답 분석: (B)taking은 현재분사로 명령문에 불가 · (C)taken은 과거분사 · (D)takes는 3인칭 단수 현재형\\n💡 핵심 포인트: Please + 동사원형 = 공손한 명령/요청문"}
  ]
}]

지문 유형 4가지 (모두 다르게): 비즈니스 이메일, 사내 메모, 공지사항, 안내문
각 지문 150-200 단어`);

  let groups: RawGroup[];
  try {
    groups = parseJSON<RawGroup[]>(text);
  } catch {
    console.error("Part 6 JSON parse failed:", text.slice(0, 200));
    throw new Error("Part 6 생성 실패");
  }

  if (groups.length < 4) {
    throw new Error(`Part 6 지문 부족: ${groups.length}/4`);
  }

  const ts = Date.now();
  const allIds: string[] = [];

  for (let gi = 0; gi < 4; gi++) {
    const group = groups[gi];
    const validQs = (group.questions || []).filter(isValidQuestion);
    if (validQs.length < 4) {
      throw new Error(`Part 6 그룹 ${gi} 유효 문제 부족: ${validQs.length}/4`);
    }
    const groupId = `gen_g6_${ts}_${gi}`;
    await prisma.questionGroup.create({
      data: { id: groupId, part: 6, passageText: group.passageText, passageType: "memo" }
    });
    const questionData = validQs.slice(0, 4).map((q, qi) => ({
      id: `gen_q6_${ts}_${gi}_${qi}`,
      part: 6,
      groupId,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      answer: (q.answer || "A").toUpperCase().charAt(0),
      explanation: q.explanation || "",
    }));
    await prisma.question.createMany({ data: questionData });
    allIds.push(...questionData.map(d => d.id));
  }

  if (allIds.length !== 16) {
    throw new Error(`Part 6 총 문제 수 불일치: ${allIds.length}/16`);
  }

  return allIds;
}

interface RawPart7Set {
  passages: string[];
  questions: RawQuestion[];
}

interface RawPart7 {
  doubles: RawPart7Set[];
  triples: RawPart7Set[];
  quads: RawPart7Set[];
}

// Part 7: 2중 3세트(8q×3=24) + 3중 2세트(9q×2=18) + 4중 1세트(12q) = 54 questions
export async function generatePart7(): Promise<string[]> {
  const sampleGroups = await prisma.questionGroup.findMany({
    where: { part: 7 },
    include: { questions: { orderBy: { id: "asc" } } },
    take: 4,
  });

  const examples = sampleGroups.slice(0, 2).map((g, gi) =>
    `[참고 세트 ${gi + 1}] (${g.passageType || "지문"})\n지문:\n${g.passageText?.slice(0, 350)}...\n\n` +
    `문제 예시:\n` +
    g.questions.slice(0, 3).map((q, qi) =>
      `${qi + 1}. ${q.questionText}\n(A)${q.optionA} (B)${q.optionB} (C)${q.optionC} (D)${q.optionD}`
    ).join("\n")
  ).join("\n\n---\n\n");

  const text = await callGemini(`당신은 TOEIC 전문 출제 위원이자 영어 강사입니다. 아래 참고 문제들의 스타일, 지문 유형, 난이도를 분석하여 새로운 Part 7 세트를 만드세요.

[참고 문제]:
${examples || "(참고 데이터 없음 - TOEIC Part 7 표준 형식 사용)"}

위 참고를 기반으로 아래 구조의 문제 세트 생성. JSON만 반환.

절대 규칙:
1. 보기 4개(optionA~D)는 반드시 모두 다른 내용 (중복 절대 금지)
2. 정답 1개만
3. 해설은 반드시 아래 형식의 상세 한국어 해설
4. 문제 수를 정확히 맞출 것: doubles 각 8문제, triples 각 9문제, quads 정확히 12문제

해설 형식 (explanation 필드) — 반드시 이 구조를 따를 것:
"✅ 정답 이유: [지문의 어느 부분(단락/문장)에서 근거를 찾을 수 있는지 명시하고 2~3문장으로 상세 설명]\\n❌ 오답 분석: (X)는 [지문 근거로 왜 틀렸는지] · (X)는 [이유] · (X)는 [이유]\\n💡 핵심 포인트: [이 문제 유형(세부사항/추론/NOT 등)을 풀기 위한 독해 전략]"

구조 (정확히 이 수량):
{
  "doubles": [
    {"passages":["지문1 (150-200단어)","지문2 (150-200단어)"],"questions":[정확히 8개]},
    {"passages":["지문1","지문2"],"questions":[정확히 8개]},
    {"passages":["지문1","지문2"],"questions":[정확히 8개]}
  ],
  "triples": [
    {"passages":["지문1 (120-150단어)","지문2","지문3"],"questions":[정확히 9개]},
    {"passages":["지문1","지문2","지문3"],"questions":[정확히 9개]}
  ],
  "quads": [
    {"passages":["지문1 (100-120단어)","지문2","지문3","지문4"],"questions":[정확히 12개]}
  ]
}

문제 유형 (각 세트에 혼합): 주제/목적, 세부사항, NOT mentioned, 추론, 어휘, 복수지문 연계
2중 주제: 구인공고+지원서 / 뉴스기사+보도자료 / 상품광고+고객리뷰
3중 주제: 회사정책+직원이메일+상사회신 / 행사안내+등록+확인이메일
4중 주제: 구인공고+지원서+면접초대+합격통보
난이도: TOEIC 650-900`);

  let data: RawPart7;
  try {
    data = parseJSON<RawPart7>(text);
  } catch {
    console.error("Part 7 JSON parse failed:", text.slice(0, 200));
    throw new Error("Part 7 생성 실패");
  }

  const doubles = data.doubles || [];
  const triples = data.triples || [];
  const quads = data.quads || [];

  if (doubles.length < 3 || triples.length < 2 || quads.length < 1) {
    throw new Error(`Part 7 세트 수 부족: doubles=${doubles.length}/3, triples=${triples.length}/2, quads=${quads.length}/1`);
  }

  const ts = Date.now();
  const allIds: string[] = [];

  async function insertSet(set: RawPart7Set, type: string, idx: number, qCount: number) {
    if (!set?.passages?.length) throw new Error(`Part 7 ${type}[${idx}] passages 없음`);
    const validQs = (set.questions || []).filter(isValidQuestion);
    if (validQs.length < qCount) {
      throw new Error(`Part 7 ${type}[${idx}] 문제 부족: ${validQs.length}/${qCount}`);
    }
    const combinedPassage = set.passages
      .map((p, i) => `[지문 ${i + 1}]\n\n${p}`)
      .join("\n\n──────────────────────\n\n");
    const groupId = `gen_g7_${type}_${ts}_${idx}`;
    await prisma.questionGroup.create({
      data: { id: groupId, part: 7, passageText: combinedPassage, passageType: type }
    });
    const questions = validQs.slice(0, qCount).map((q, qi) => ({
      id: `gen_q7_${type}_${ts}_${idx}_${qi}`,
      part: 7,
      groupId,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      answer: (q.answer || "A").toUpperCase().charAt(0),
      explanation: q.explanation || "",
    }));
    await prisma.question.createMany({ data: questions });
    allIds.push(...questions.map(d => d.id));
  }

  for (let i = 0; i < 3; i++) await insertSet(doubles[i], "double", i, 8);
  for (let i = 0; i < 2; i++) await insertSet(triples[i], "triple", i, 9);
  await insertSet(quads[0], "quad", 0, 12);

  if (allIds.length !== 54) {
    throw new Error(`Part 7 총 문제 수 불일치: ${allIds.length}/54`);
  }

  return allIds;
}
