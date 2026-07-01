import Anthropic from "@anthropic-ai/sdk";
import prisma from "@/lib/prisma";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

// Part 5: 30 standalone grammar/vocab questions
export async function generatePart5(): Promise<string[]> {
  const result = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8000,
    messages: [{
      role: "user",
      content: `You are a TOEIC expert. Generate exactly 30 TOEIC Part 5 questions.
Return ONLY a valid JSON array, no other text.

Format:
[{"questionText":"The manager ------- the report before the meeting.","optionA":"reviewed","optionB":"reviewing","optionC":"review","optionD":"to review","answer":"A","explanation":"과거시제 문장에서 주어+동사 구조이므로 과거형 reviewed가 정답입니다."}]

Mix these grammar topics evenly: prepositions, modal verbs, verb tenses, parts of speech (noun/verb/adj/adv), relative clauses, conjunctions, infinitives, gerunds, passive voice
Business English context, TOEIC 600-900 difficulty
Korean explanations`
    }]
  });

  const text = result.content[0].type === "text" ? result.content[0].text : "[]";
  let questions: RawQuestion[];
  try {
    questions = parseJSON<RawQuestion[]>(text);
  } catch {
    console.error("Part 5 JSON parse failed:", text.slice(0, 200));
    throw new Error("Part 5 생성 실패");
  }

  const ts = Date.now();
  const data = questions.slice(0, 30).map((q, i) => ({
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
  const result = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 10000,
    messages: [{
      role: "user",
      content: `Generate 4 TOEIC Part 6 passages with blank-fill questions.
Return ONLY a valid JSON array, no other text.

Format:
[{
  "passageText": "Dear Ms. Kim,\n\nWe are pleased to ------- (1) you that your application has been ------- (2) by our review committee. The interview will be ------- (3) at our main office on Friday at 2 PM. Please ------- (4) this opportunity seriously.\n\nBest regards,\nHR Department",
  "questions": [
    {"questionText":"(1)","optionA":"inform","optionB":"informing","optionC":"informed","optionD":"information","answer":"A","explanation":"to부정사 뒤에 동사원형이 와야 합니다."},
    {"questionText":"(2)","optionA":"approve","optionB":"approved","optionC":"approving","optionD":"approval","answer":"B","explanation":"수동태 구조 has been + 과거분사이므로 approved가 정답입니다."},
    {"questionText":"(3)","optionA":"hold","optionB":"held","optionC":"holding","optionD":"holds","answer":"B","explanation":"will be + 과거분사 수동태 구조입니다."},
    {"questionText":"(4)","optionA":"take","optionB":"taking","optionC":"taken","optionD":"takes","answer":"A","explanation":"Please + 동사원형이므로 take가 정답입니다."}
  ]
}]

Requirements:
- Each passage: business email, memo, notice, or announcement (150-200 words)
- Exactly 4 blanks per passage marked as (1)(2)(3)(4)
- Each blank tests different grammar point
- Korean explanations
- 4 different passage types`
    }]
  });

  const text = result.content[0].type === "text" ? result.content[0].text : "[]";
  let groups: RawGroup[];
  try {
    groups = parseJSON<RawGroup[]>(text);
  } catch {
    console.error("Part 6 JSON parse failed:", text.slice(0, 200));
    throw new Error("Part 6 생성 실패");
  }

  const ts = Date.now();
  const allIds: string[] = [];

  for (let gi = 0; gi < Math.min(groups.length, 4); gi++) {
    const group = groups[gi];
    const groupId = `gen_g6_${ts}_${gi}`;

    await prisma.questionGroup.create({
      data: { id: groupId, part: 6, passageText: group.passageText, passageType: "memo" }
    });

    const questionData = (group.questions || []).slice(0, 4).map((q, qi) => ({
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

  return allIds;
}

interface RawPart7Set {
  passages: string[];
  questions: RawQuestion[];
}

interface RawPart7 {
  double: RawPart7Set;
  triple: RawPart7Set;
  quad: RawPart7Set;
}

// Part 7: 2중(8q) + 3중(9q) + 4중(12q) = 29 questions
export async function generatePart7(): Promise<string[]> {
  const result = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 16000,
    messages: [{
      role: "user",
      content: `Generate TOEIC Part 7 reading comprehension sets.
Return ONLY valid JSON, no other text.

Structure:
{
  "double": {
    "passages": ["First passage 150-200 words", "Second related passage 150-200 words"],
    "questions": [array of exactly 8 questions]
  },
  "triple": {
    "passages": ["Passage 1 120-150 words", "Passage 2 120-150 words", "Passage 3 120-150 words"],
    "questions": [array of exactly 9 questions]
  },
  "quad": {
    "passages": ["Passage 1 100-120 words","Passage 2 100-120 words","Passage 3 100-120 words","Passage 4 100-120 words"],
    "questions": [array of exactly 12 questions]
  }
}

Each question:
{"questionText":"What is the purpose of the first email?","optionA":"To request a refund","optionB":"To schedule a meeting","optionC":"To announce a promotion","optionD":"To submit an application","answer":"B","explanation":"첫 번째 이메일에서 'schedule a meeting'이라고 명시되어 있습니다."}

Double set ideas: job posting + cover letter, news article + response letter, product ad + customer review
Triple set ideas: company policy + employee email + manager response, event notice + registration form + confirmation
Quad set ideas: job ad + application + interview invite + offer letter, product info + complaint + response + update

Mix question types: main idea, specific detail, inference, vocabulary in context, cross-passage
Korean explanations, TOEIC 650-900 difficulty`
    }]
  });

  const text = result.content[0].type === "text" ? result.content[0].text : "{}";
  let data: RawPart7;
  try {
    data = parseJSON<RawPart7>(text);
  } catch {
    console.error("Part 7 JSON parse failed:", text.slice(0, 200));
    throw new Error("Part 7 생성 실패");
  }

  const ts = Date.now();
  const allIds: string[] = [];

  const sets: { key: keyof RawPart7; type: string; qCount: number }[] = [
    { key: "double", type: "double", qCount: 8 },
    { key: "triple", type: "triple", qCount: 9 },
    { key: "quad",   type: "quad",   qCount: 12 },
  ];

  for (const { key, type, qCount } of sets) {
    const setData = data[key];
    if (!setData?.passages?.length) continue;

    const combinedPassage = setData.passages
      .map((p, i) => `[지문 ${i + 1}]\n\n${p}`)
      .join("\n\n──────────────────────\n\n");

    const groupId = `gen_g7_${type}_${ts}`;
    await prisma.questionGroup.create({
      data: { id: groupId, part: 7, passageText: combinedPassage, passageType: type }
    });

    const questions = (setData.questions || []).slice(0, qCount).map((q, qi) => ({
      id: `gen_q7_${type}_${ts}_${qi}`,
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

  return allIds;
}
