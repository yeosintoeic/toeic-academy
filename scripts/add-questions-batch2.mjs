import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

// 보기 순서를 랜덤하게 섞어서 answer도 재매핑
function shuffleOptions(q) {
  const opts = [
    { key: "A", text: q.optionA },
    { key: "B", text: q.optionB },
    { key: "C", text: q.optionC },
    { key: "D", text: q.optionD },
  ];
  const correctText = opts.find(o => o.key === q.answer)?.text;
  // Fisher-Yates shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const newAnswer = opts.findIndex(o => o.text === correctText);
  const keyMap = ["A", "B", "C", "D"];
  return {
    ...q,
    optionA: opts[0].text,
    optionB: opts[1].text,
    optionC: opts[2].text,
    optionD: opts[3].text,
    answer: keyMap[newAnswer],
  };
}

async function main() {
  // ── PART 5 배치2 (30문제) ──────────────────────────────────
  const part5b = [
    {
      questionText: "The committee expects to be finished with the negotiations -------- 4:00 P.M.",
      optionA: "over", optionB: "until", optionC: "on", optionD: "by",
      answer: "D", category: "preposition",
      explanation: "by는 '~까지(완료)'를 의미하는 전치사입니다."
    },
    {
      questionText: "By -------- to customers' concerns, call center agents help build trust in the company.",
      optionA: "actively", optionB: "activate", optionC: "active", optionD: "activity",
      answer: "A", category: "part of speech",
      explanation: "By 뒤에 오는 동명사구 listening을 수식하는 부사 actively가 필요합니다."
    },
    {
      questionText: "If the financial reports are --------, the Dorbin Agency is having its most profitable quarter ever.",
      optionA: "visible", optionB: "accurate", optionC: "fortunate", optionD: "impressed",
      answer: "B", category: "vocabulary",
      explanation: "재무 보고서가 '정확하다면'이라는 문맥에서 accurate가 가장 적절합니다."
    },
    {
      questionText: "Before her office is remodeled, Ms. Churak must make a -------- regarding the color scheme.",
      optionA: "decide", optionB: "decides", optionC: "decision", optionD: "decided",
      answer: "C", category: "part of speech",
      explanation: "make a 뒤에 명사 decision이 필요합니다."
    },
    {
      questionText: "With warehouses throughout Canada, Blanchett Publishers can deliver books almost -------- in the country overnight.",
      optionA: "anywhere", optionB: "somewhere", optionC: "often", optionD: "somehow",
      answer: "A", category: "vocabulary",
      explanation: "'나라 내 어디든'이라는 의미로 anywhere가 가장 적절합니다."
    },
    {
      questionText: "Topics for next year's Digital Marketing Conference were -------- discussed by the planning committee.",
      optionA: "currently", optionB: "thoroughly", optionC: "surprisingly", optionD: "honorably",
      answer: "B", category: "vocabulary",
      explanation: "'철저하게 논의되었다'는 문맥에서 thoroughly가 가장 자연스럽습니다."
    },
    {
      questionText: "Profits at Koerber Industries have reached record highs -------- cost-saving measures implemented by the management.",
      optionA: "so that", optionB: "meanwhile", optionC: "because of", optionD: "whereas",
      answer: "C", category: "preposition",
      explanation: "because of는 전치사로 명사구 앞에서 이유를 나타냅니다."
    },
    {
      questionText: "Many employees have -------- to Ms. Geyer at the service desk that their laptop computers are overheating.",
      optionA: "contributed", optionB: "complained", optionC: "informed", optionD: "intended",
      answer: "B", category: "vocabulary",
      explanation: "직원들이 노트북이 과열된다고 '불평했다'는 문맥에서 complained가 적절합니다."
    },
    {
      questionText: "Kindly indicate on the -------- form if you would like to receive your newsletter electronically.",
      optionA: "fulfilled", optionB: "successful", optionC: "attached", optionD: "careful",
      answer: "C", category: "vocabulary",
      explanation: "'첨부된 양식에 표시해달라'는 문맥에서 attached가 적절합니다."
    },
    {
      questionText: "The department store's annual audit was conducted after the autumn sale but -------- the winter event.",
      optionA: "as", optionB: "soon", optionC: "to be", optionD: "before",
      answer: "D", category: "preposition",
      explanation: "시간 관계상 가을 세일 이후, 겨울 행사 '전에' 감사가 실시됐습니다."
    },
    {
      questionText: "Unfortunately, the printed agenda will not be ready in advance of the meeting -------- our administrative assistant is out today.",
      optionA: "because", optionB: "consequently", optionC: "whenever", optionD: "where",
      answer: "A", category: "conjunction",
      explanation: "because는 접속사로 이유를 나타냅니다."
    },
    {
      questionText: "Anyone -------- to visit the museum is advised to buy tickets well in advance.",
      optionA: "intending", optionB: "permitting", optionC: "completing", optionD: "consulting",
      answer: "A", category: "participle",
      explanation: "주어 anyone을 수식하는 현재분사 intending(~하려는)이 적절합니다."
    },
    {
      questionText: "-------- staff from our offices in three cities will meet at the United Kingdom headquarters this September.",
      optionA: "Manage", optionB: "Manages", optionC: "Managerial", optionD: "Managers",
      answer: "C", category: "part of speech",
      explanation: "명사(staff) 앞에 형용사 managerial(관리직의)이 적절합니다."
    },
    {
      questionText: "-------- the color, the customer thought the car was perfect in every way.",
      optionA: "Unlike", optionB: "Otherwise", optionC: "Although", optionD: "Except for",
      answer: "D", category: "preposition",
      explanation: "색상을 '제외하면' 완벽하다는 문맥에서 Except for가 적절합니다."
    },
    {
      questionText: "Tomorrow's lunch will -------- for all employees from noon to 1 P.M. in the lobby.",
      optionA: "to be provided", optionB: "will be provided", optionC: "had been provided", optionD: "be provided",
      answer: "D", category: "verb form",
      explanation: "Tomorrow's lunch will be provided - will 뒤에는 동사원형이 오며 수동태 be provided가 적절합니다."
    },
    {
      questionText: "To cautious investors, Milford Sporting Equipment's plan to open 90 new stores in ten months seems very --------.",
      optionA: "ambitious", optionB: "specific", optionC: "athletic", optionD: "reputable",
      answer: "A", category: "vocabulary",
      explanation: "신중한 투자자들에게 10개월 만에 90개 매장 개설은 '야심 찬' 계획으로 보일 것입니다."
    },
    {
      questionText: "Farmer Graphic Solutions offers courses that can be taken -------- online or at our downtown location.",
      optionA: "took", optionB: "may take", optionC: "were taken", optionD: "can be taken",
      answer: "B", category: "verb form",
      explanation: "수강생이 직접 수강하는 것이므로 능동형 may take가 적절합니다."
    },
    {
      questionText: "The wellness -------- at Trayer Media Group directly led to greater employee satisfaction with the company.",
      optionA: "initiate", optionB: "initiator", optionC: "initiated", optionD: "initiative",
      answer: "D", category: "part of speech",
      explanation: "관사(The)와 전치사(at) 사이에 명사 initiative(계획)가 필요합니다."
    },
    {
      questionText: "We will keep producing our signature shoe designs -------- there is demand for them.",
      optionA: "or else", optionB: "as long as", optionC: "as well as", optionD: "in between",
      answer: "B", category: "conjunction",
      explanation: "as long as는 '~하는 한'의 조건을 나타내는 접속사입니다."
    },
    {
      questionText: "Regular applications of fertilizer improve seedling health and -------- enhance the growth of leafy vegetables.",
      optionA: "drama", optionB: "dramatic", optionC: "dramatically", optionD: "dramatize",
      answer: "C", category: "part of speech",
      explanation: "동사(enhance)를 수식하는 부사 dramatically가 필요합니다."
    },
    {
      questionText: "Bay City Zoo members get -------- access to members-only activities, such as after-hours guided tours.",
      optionA: "exclusive", optionB: "unknown", optionC: "creative", optionD: "previous",
      answer: "A", category: "vocabulary",
      explanation: "회원 전용 특혜를 나타내는 '독점적인'이라는 의미의 exclusive가 가장 적절합니다."
    },
    {
      questionText: "The editor noted some -------- content and marked the text to be deleted.",
      optionA: "repetition", optionB: "repetitious", optionC: "repetitiously", optionD: "repetitiousness",
      answer: "B", category: "part of speech",
      explanation: "명사(content)를 수식하는 형용사 repetitious(반복적인)가 필요합니다."
    },
    {
      questionText: "The new Web site allows consumers to search for the features they like -------- various car models.",
      optionA: "throughout", optionB: "toward", optionC: "against", optionD: "among",
      answer: "D", category: "preposition",
      explanation: "여러 차종 '중에서' 검색한다는 의미로 among이 적절합니다."
    },
    {
      questionText: "The overhead storage compartments in Wayboard Airlines planes are spacious -------- to accommodate all carry-on bags.",
      optionA: "such", optionB: "so", optionC: "enough", optionD: "much",
      answer: "C", category: "adverb",
      explanation: "spacious enough to = '~하기에 충분히 넓은'이라는 결과 구문입니다."
    },
    {
      questionText: "On weripixel.com, you can -------- your favorite photo into a beautiful work of art printed on canvas.",
      optionA: "transform", optionB: "motivate", optionC: "classify", optionD: "specialize",
      answer: "A", category: "vocabulary",
      explanation: "사진을 예술 작품으로 '변환한다'는 문맥에서 transform이 가장 적절합니다."
    },
    {
      questionText: "Customers who are offered a choice of two items at Shelley's Diner consistently prefer -------- with cheese in it.",
      optionA: "somewhat", optionB: "which", optionC: "anything", optionD: "other",
      answer: "C", category: "pronoun",
      explanation: "치즈가 들어간 것은 '무엇이든' 선호한다는 의미로 anything이 적절합니다."
    },
    {
      questionText: "During the staff meeting, Mr. Burkard announced that the company's stock value rose -------- this quarter.",
      optionA: "again", optionB: "nearly", optionC: "next", optionD: "away",
      answer: "A", category: "adverb",
      explanation: "주가가 '다시' 올랐다는 문맥에서 again이 가장 자연스럽습니다."
    },
    {
      questionText: "Many restaurant chains are now offering paid time off in an effort -------- experienced servers.",
      optionA: "retaining", optionB: "to retain", optionC: "is retaining", optionD: "retained",
      answer: "B", category: "verb form",
      explanation: "in an effort to + 동사원형 = '~하려는 노력으로'라는 관용 표현입니다."
    },
    {
      questionText: "The new Web site allows consumers to search for the features they like -------- various car models.",
      optionA: "throughout", optionB: "toward", optionC: "against", optionD: "among",
      answer: "D", category: "preposition",
      explanation: "여러 차종 '중에서' 원하는 기능을 검색한다는 의미로 among이 적절합니다."
    },
    {
      questionText: "Wantner Manufacturing received this year's Top Employer Award in -------- of its people-centered workplace environment.",
      optionA: "service", optionB: "accordance", optionC: "recognition", optionD: "dedication",
      answer: "C", category: "vocabulary",
      explanation: "in recognition of = '~을 인정하여'라는 관용 표현입니다."
    },
  ];

  for (const q of part5b) {
    const shuffled = shuffleOptions(q);
    await prisma.question.create({ data: { part: 5, ...shuffled } });
  }
  console.log("✅ Part 5 배치2 완료 (30문제)");

  // ── PART 6 배치2 (3그룹) ──────────────────────────────────
  const group6c = await prisma.questionGroup.create({
    data: {
      part: 6,
      passageType: "article",
      passageText: `Skyway Airlines to Offer Children's Meals

Skyway Airlines is introducing children's meals on many international and domestic flights starting on July 1. Menus --------(131), depending on the flight's time of day. A typical breakfast might include chocolate-chip pancakes or cinnamon toast sticks. Fresh fruit slices will also be served. The airline expects that this --------(132) will improve the flight experience for young travelers and will reduce food waste as well.

"We are dedicated to making flying enjoyable for all our passengers," said Skyway Airlines CEO Kenji Matsumoto. --------(133)

--------(134) who dine with their families will certainly appreciate this thoughtful service.`,
    },
  });

  const part6c = [
    {
      questionText: "131. (A) varied  (B) will vary  (C) were varying  (D) are varying",
      optionA: "varied", optionB: "will vary", optionC: "were varying", optionD: "are varying",
      answer: "B", category: "verb tense",
      explanation: "starting on July 1(미래)과 호응하여 미래 시제 will vary가 적절합니다.",
      groupId: group6c.id,
    },
    {
      questionText: "132. (A) change  (B) opinion  (C) outcome  (D) increase",
      optionA: "change", optionB: "opinion", optionC: "outcome", optionD: "increase",
      answer: "A", category: "vocabulary",
      explanation: "어린이 식사 도입이라는 '변화'가 개선으로 이어질 것이라는 문맥에서 change가 적절합니다.",
      groupId: group6c.id,
    },
    {
      questionText: "133. Which sentence best fits in the blank?",
      optionA: "Passengers should listen carefully to the flight attendant's announcements.",
      optionB: "Children must be accompanied by an adult at all times.",
      optionC: "He added that young people are the future of Skyway Airlines.",
      optionD: "According to the CEO, ticket prices are unlikely to rise.",
      answer: "C", category: "sentence insertion",
      explanation: "CEO가 어린이 승객에 대한 헌신을 강조하는 맥락에서 C가 가장 자연스럽습니다.",
      groupId: group6c.id,
    },
    {
      questionText: "134. (A) Passengers  (B) Children  (C) Travelers  (D) Families",
      optionA: "Passengers", optionB: "Children", optionC: "Travelers", optionD: "Families",
      answer: "D", category: "vocabulary",
      explanation: "가족과 함께 식사하는 주체는 '가족(Families)'이 문맥상 가장 자연스럽습니다.",
      groupId: group6c.id,
    },
  ];

  for (const q of part6c) {
    const shuffled = shuffleOptions({ ...q, explanation: q.explanation || "", category: q.category || "" });
    const { groupId, ...rest } = shuffled;
    await prisma.question.create({ data: { part: 6, explanation: "", category: "", ...rest, groupId } });
  }
  console.log("✅ Part 6 그룹3 완료");

  const group6d = await prisma.questionGroup.create({
    data: {
      part: 6,
      passageType: "email",
      passageText: `To: All Ticket Holders
From: Carter Auditorium
Date: April 12
Subject: Traffic Delays

Dear Ticket Holder,

We look --------(131) to seeing you at the performance of The Snowy Mountain at 7:30 this evening at Carter Auditorium. Please be aware that last night's windstorm has resulted in numerous road closures downtown. There may be traffic delays and disruption of bus service near Carter Auditorium as showtime approaches. --------(132). A map showing the status of --------(133) streets is available online. It --------(134) found at www.carterauditorium.com/trafficandparking.

Sincerely,
Bryan Watson
Theater Manager, Carter Auditorium`,
    },
  });

  const part6d = [
    {
      questionText: "131. (A) ahead  (B) around  (C) far  (D) forward",
      optionA: "ahead", optionB: "around", optionC: "far", optionD: "forward",
      answer: "D", category: "vocabulary",
      explanation: "look forward to = '~을 기대하다'라는 관용 표현입니다.",
      groupId: group6d.id,
    },
    {
      questionText: "132. Which sentence best fits in the blank?",
      optionA: "The Carter Auditorium opened 55 years ago.",
      optionB: "The Snowy Mountain will be performed that weekend as well.",
      optionC: "Please allow extra travel time to reach the theater this evening.",
      optionD: "Director Julia King will greet the audience before the show.",
      answer: "C", category: "sentence insertion",
      explanation: "교통 혼잡 경고 후 여유 시간을 갖고 오라는 안내가 맥락상 적절합니다.",
      groupId: group6d.id,
    },
    {
      questionText: "133. (A) affected  (B) arranged  (C) actual  (D) acceptable",
      optionA: "affected", optionB: "arranged", optionC: "actual", optionD: "acceptable",
      answer: "A", category: "vocabulary",
      explanation: "'영향받은' 도로의 현황 지도라는 의미에서 affected가 적절합니다.",
      groupId: group6d.id,
    },
    {
      questionText: "134. (A) is being  (B) can be  (C) has been  (D) be",
      optionA: "is being", optionB: "can be", optionC: "has been", optionD: "be",
      answer: "B", category: "verb form",
      explanation: "can be found = '~에서 찾을 수 있다'는 가능성을 나타냅니다.",
      groupId: group6d.id,
    },
  ];

  for (const q of part6d) {
    const shuffled = shuffleOptions({ ...q });
    const { groupId, ...rest } = shuffled;
    await prisma.question.create({ data: { part: 6, explanation: "", category: "", ...rest, groupId } });
  }
  console.log("✅ Part 6 그룹4 완료");

  const group6e = await prisma.questionGroup.create({
    data: {
      part: 6,
      passageType: "email",
      passageText: `To: Naomi Richter <naomirichter@mailcurrent.com>
From: Watanu Sakamoto <wsakamoto@RHNimports.com>
Date: 23 November
Subject: Follow-up
Attachment: Logistics coordinator description

Dear Ms. Richter,

Thank you for coming to our office to interview for the assistant import manager position last week. We were impressed with your credentials and enthusiasm. --------(131), we are moving ahead with another candidate. However, we would like to offer you a different position that just became available: logistics coordinator.

--------(132). The attached document contains the detailed job description and pay rate. This position --------(133) has not yet been posted publicly. If you are --------(134), please let me know by the end of this week.

Sincerely,
Watanu Sakamoto
Human Resource Manager, RHN Imports`,
    },
  });

  const part6e = [
    {
      questionText: "131. (A) Rather  (B) Although  (C) Similarly  (D) Consequently",
      optionA: "Rather", optionB: "Although", optionC: "Similarly", optionD: "Consequently",
      answer: "A", category: "conjunction",
      explanation: "앞 문장(인상적이었다)과 뒷 문장(다른 후보자 선정)의 역접 관계에서 Rather(그보다는)가 적절합니다.",
      groupId: group6e.id,
    },
    {
      questionText: "132. Which sentence best fits in the blank?",
      optionA: "There are several other internal applicants.",
      optionB: "Unfortunately, the position is no longer available.",
      optionC: "My assistant will schedule your second interview.",
      optionD: "Your experience and skill set make you a great fit.",
      answer: "D", category: "sentence insertion",
      explanation: "새 직책을 제안하는 맥락에서 지원자의 경험이 적합하다는 설명이 가장 자연스럽습니다.",
      groupId: group6e.id,
    },
    {
      questionText: "133. (A) opportunity  (B) authorization  (C) application  (D) position",
      optionA: "opportunity", optionB: "authorization", optionC: "application", optionD: "position",
      answer: "D", category: "vocabulary",
      explanation: "앞서 언급한 'logistics coordinator' 직책(position)을 가리킵니다.",
      groupId: group6e.id,
    },
    {
      questionText: "134. (A) interest  (B) interests  (C) interested  (D) interesting",
      optionA: "interest", optionB: "interests", optionC: "interested", optionD: "interesting",
      answer: "C", category: "part of speech",
      explanation: "If you are interested(관심이 있다면) - be 동사 뒤에 형용사 interested가 옵니다.",
      groupId: group6e.id,
    },
  ];

  for (const q of part6e) {
    const shuffled = shuffleOptions({ ...q });
    const { groupId, ...rest } = shuffled;
    await prisma.question.create({ data: { part: 6, explanation: "", category: "", ...rest, groupId } });
  }
  console.log("✅ Part 6 그룹5 완료");

  // ── PART 7 배치2 (4그룹) ─────────────────────────────────
  // 그룹1: 스케줄 (2문제)
  const group7d = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "schedule",
      passageText: `Laurie Hendricksen's Schedule
Monday, June 22
Senior Graphic Designer

10:00–11:00 A.M. | Interview: Sean Winters, senior graphic designer
11:00 A.M.–noon  | Meeting with Marta Endo in human resources: Status of the new hire's paperwork
Noon–1:00 P.M.   | Monthly team lunch, fifth-floor break room: Bring dessert for fourteen people
1:00–2:00 P.M.   | Quarterly budget meeting (Rescheduled for tomorrow, same time)
3:00–4:00 P.M.   | Training: Keeping Company Information Confidential
4:00–5:00 P.M.   | Interview: Hye-Soo Kang, entry-level graphic designer
6:00–7:00 P.M.   | Personal event: Attend volunteer training at the town library
Reminder          | Pick up bicycle from repair shop by 7:30 P.M.`,
    },
  });

  const part7d = [
    {
      questionText: "What is most likely true about Ms. Hendricksen?",
      optionA: "She works as a software developer.",
      optionB: "She works as an administrator in a public library.",
      optionC: "She is involved in hiring graphic designers.",
      optionD: "She rides her bicycle to work.",
      answer: "C", category: "inference",
      explanation: "스케줄에 그래픽 디자이너 면접이 두 건 포함되어 있어 채용에 관여하고 있음을 알 수 있습니다.",
      groupId: group7d.id,
    },
    {
      questionText: "What is suggested about the event that occurs from noon to 1:00 P.M.?",
      optionA: "It will be held at an off-site location.",
      optionB: "Attendees will contribute food items.",
      optionC: "It has been rescheduled.",
      optionD: "Attendees will complete paperwork.",
      answer: "B", category: "detail",
      explanation: "'Bring dessert for fourteen people'이라는 메모에서 참석자들이 음식을 가져온다는 것을 알 수 있습니다.",
      groupId: group7d.id,
    },
  ];

  for (const q of part7d) {
    const shuffled = shuffleOptions({ ...q });
    const { groupId, ...rest } = shuffled;
    await prisma.question.create({ data: { part: 7, explanation: "", category: "", ...rest, groupId } });
  }
  console.log("✅ Part 7 그룹4 완료");

  // 그룹2: 이메일+공지 이중지문 (5문제)
  const group7e = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "double passage",
      passageText: `[E-mail]
To: All Keswick Heating and Air-Conditioning Staff
From: Evan Roberts
Date: October 14
Subject: Upcoming meeting

Hello, Everyone,

Instead of our regular staff meeting on October 25, Paul Exeter from the Halenside Fire Department will run a workshop on first aid and our new automated defibrillation training workshop. Both on-site employees and our mobile service drivers must be present at the training workshop.

If you cannot join on the first date, you may attend an alternate session on November 4 at 2:00 P.M. Notify Myra Kees of which day you plan to attend before October 22. Thank you for your cooperation.

Sincerely,
Evan Roberts

---

[E-mail]
To: Evan Roberts
From: Jenny Wallis
Date: October 15
Subject: Re: Upcoming meeting

Dear Mr. Roberts,

Thank you for the notice about the workshop. I am a mobile service driver and would very much like to attend. Unfortunately, I will be out of town on business on October 25 and cannot make the first session.

I would like to register for the November 4 session. Could you please confirm that there are still spots available? Also, I wanted to ask whether we will receive any written materials to take home after the session.

Best regards,
Jenny Wallis`,
    },
  });

  const part7e = [
    {
      questionText: "What is the purpose of the first e-mail?",
      optionA: "To announce an equipment installation",
      optionB: "To find a speaker for an event",
      optionC: "To announce a job opening to employees",
      optionD: "To inform employees of a training session",
      answer: "D", category: "purpose",
      explanation: "첫 번째 이메일은 직원들에게 훈련 워크숍을 안내하는 목적으로 쓰여졌습니다.",
      groupId: group7e.id,
    },
    {
      questionText: "What are recipients of the first e-mail instructed to do?",
      optionA: "E-mail Mr. Exeter",
      optionB: "Drive to Halenside Fire Department",
      optionC: "Purchase a medical device",
      optionD: "Contact Ms. Kees",
      answer: "D", category: "detail",
      explanation: "Notify Myra Kees of which day you plan to attend라고 명시되어 있습니다.",
      groupId: group7e.id,
    },
    {
      questionText: "What is indicated about Ms. Wallis?",
      optionA: "She will attend the October 25 session.",
      optionB: "She is a mobile service driver.",
      optionC: "She helped organize the training.",
      optionD: "She has previously met Mr. Exeter.",
      answer: "B", category: "detail",
      explanation: "I am a mobile service driver라고 직접 밝히고 있습니다.",
      groupId: group7e.id,
    },
    {
      questionText: "Why will Ms. Wallis NOT attend the first session?",
      optionA: "She is not required to attend.",
      optionB: "She has a prior work commitment out of town.",
      optionC: "She has already completed the training.",
      optionD: "The session was rescheduled.",
      answer: "B", category: "detail",
      explanation: "I will be out of town on business on October 25라고 명시되어 있습니다.",
      groupId: group7e.id,
    },
    {
      questionText: "What does Ms. Wallis ask about in her e-mail?",
      optionA: "Whether there are available seats at the November 4 session",
      optionB: "Who will be running the workshop",
      optionC: "Where the workshop will be held",
      optionD: "How long the training will last",
      answer: "A", category: "detail",
      explanation: "Could you please confirm that there are still spots available?라고 자리 여부를 문의하고 있습니다.",
      groupId: group7e.id,
    },
  ];

  for (const q of part7e) {
    const shuffled = shuffleOptions({ ...q });
    const { groupId, ...rest } = shuffled;
    await prisma.question.create({ data: { part: 7, explanation: "", category: "", ...rest, groupId } });
  }
  console.log("✅ Part 7 그룹5 완료");

  // 그룹3: 온라인 리뷰 (3문제)
  const group7f = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "review",
      passageText: `https://www.hikershaven.org.uk/device_reviews

I am an avid hiker and enjoy taking challenging routes through remote areas. After conferring with fellow hikers, I bought the HKM120, a handheld GPS device made by Hikemaestro. After reading the manual, I installed the rechargeable batteries and turned the HKM120 on to explore the various settings. Its features and intuitive controls are impressive.

The manual suggested updating the firmware and the map database before using the device on a hike. A USB cable had been included in the package, so I used that to connect the HKM120 to my laptop. However, my laptop could not detect it. I started to think there might be something wrong with the device.

Fortunately, I had another cable of my own that fit. I connected it and was able to continue the setup without any problems. I registered my HKM120 and updated the firmware and maps in just a few clicks. I have used it for a couple of recent hikes in the Lake District, and it works great. Still, it would have been better if it had not been shipped with a faulty cable. I almost made the mistake of returning it!

—Ha-Joon Pan, May 19`,
    },
  });

  const part7f = [
    {
      questionText: "What most likely is Hikemaestro?",
      optionA: "An organization that maintains hiking trails",
      optionB: "A group of people interested in hiking",
      optionC: "An electronics manufacturer",
      optionD: "A software program",
      answer: "C", category: "inference",
      explanation: "HKM120라는 GPS 기기를 만든 회사이므로 전자 기기 제조사로 볼 수 있습니다.",
      groupId: group7f.id,
    },
    {
      questionText: "When did the reviewer encounter a problem?",
      optionA: "When connecting a device to a computer",
      optionB: "When packing a product to ship",
      optionC: "When shopping for a product online",
      optionD: "When contacting customer service",
      answer: "A", category: "detail",
      explanation: "노트북에 USB 케이블로 연결하려 했을 때 기기가 감지되지 않는 문제가 발생했습니다.",
      groupId: group7f.id,
    },
    {
      questionText: "What did the reviewer eventually do?",
      optionA: "He returned the HKM120 to the retailer.",
      optionB: "He used the HKM120 while hiking.",
      optionC: "He bought an additional USB cable.",
      optionD: "He wrote some hiking guides.",
      answer: "B", category: "detail",
      explanation: "I have used it for a couple of recent hikes in the Lake District라고 명시되어 있습니다.",
      groupId: group7f.id,
    },
  ];

  for (const q of part7f) {
    const shuffled = shuffleOptions({ ...q });
    const { groupId, ...rest } = shuffled;
    await prisma.question.create({ data: { part: 7, explanation: "", category: "", ...rest, groupId } });
  }
  console.log("✅ Part 7 그룹6 완료");

  // 그룹4: 광고+이메일 이중지문 (5문제)
  const group7g = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "double passage",
      passageText: `[Advertisement]
Boots-4-You

We have hundreds of styles in stock and are sure to have the perfect pair for you!

Enter coupon code B4Y at online checkout to receive the following discounts:
• 5% off designer boots
• 10% off regular adult boots
• 15% off children's boots
• An additional 25% off boots marked for clearance

Offer valid from April 22 to May 3.
(Offer limited to two pairs of boots. Dress boots in the 1000 and 2000 series are excluded.)

---

[E-mail]
To: Customer Service <customerservice@boots-4-you.com>
From: Brandon Wilder <bwilder@zephyrmail.com>
Date: May 8
Subject: My recent purchase

Good afternoon,

I was fortunate to get in my order of Monterey Boots on the last day of your sale using the coupon code B4Y. I was given a nice discount, and I received the boots on May 6. The boots are of excellent quality, but they do not fit. As a longtime Boots-4-You customer, I always order size 10 when shopping for both work boots and dress boots listed on your Web site. However, this pair, the Monterey Boots, is much too small. I see that the designer boots are still listed on your site, but, like all the designer boots, they are no longer being offered at a discount. Will the sale price still apply if I exchange these boots for a larger size?

Thank you,
Brandon Wilder`,
    },
  });

  const part7g = [
    {
      questionText: "What is indicated on the coupon?",
      optionA: "The discount cannot be applied to more than two pairs of boots.",
      optionB: "The code cannot be used to buy adult boots.",
      optionC: "Boots in the 3000 series are excluded from the promotion.",
      optionD: "Children's boots are discounted by 25 percent.",
      answer: "A", category: "detail",
      explanation: "Offer limited to two pairs of boots라고 명시되어 있습니다.",
      groupId: group7g.id,
    },
    {
      questionText: "When did Mr. Wilder place his order?",
      optionA: "On April 22", optionB: "On May 3", optionC: "On May 6", optionD: "On May 8",
      answer: "B", category: "detail",
      explanation: "on the last day of your sale = May 3 (판매 마지막 날)에 주문했습니다.",
      groupId: group7g.id,
    },
    {
      questionText: "What discount was applied to Mr. Wilder's order?",
      optionA: "5 percent", optionB: "10 percent", optionC: "15 percent", optionD: "25 percent",
      answer: "A", category: "inference",
      explanation: "Monterey Boots는 designer boots이므로 5% 할인이 적용됩니다.",
      groupId: group7g.id,
    },
    {
      questionText: "What is most likely true about Mr. Wilder?",
      optionA: "He paid for his order with cash.",
      optionB: "He is a new customer of Boots-4-You.",
      optionC: "He owns several pairs of boots.",
      optionD: "He was once employed at Boots-4-You.",
      answer: "C", category: "inference",
      explanation: "a longtime Boots-4-You customer로서 work boots와 dress boots를 모두 구매해온 것으로 추론됩니다.",
      groupId: group7g.id,
    },
    {
      questionText: "What does Mr. Wilder want the company's customer service team to do?",
      optionA: "Send him a full refund for a purchase he made",
      optionB: "Help him select the best boots for his job",
      optionC: "Exchange a pair of boots at no additional charge",
      optionD: "Extend the deadline for returning some merchandise",
      answer: "C", category: "purpose",
      explanation: "Will the sale price still apply if I exchange these boots?라고 교환 및 가격 유지를 요청하고 있습니다.",
      groupId: group7g.id,
    },
  ];

  for (const q of part7g) {
    const shuffled = shuffleOptions({ ...q });
    const { groupId, ...rest } = shuffled;
    await prisma.question.create({ data: { part: 7, explanation: "", category: "", ...rest, groupId } });
  }
  console.log("✅ Part 7 그룹7 완료");

  const total = await prisma.question.count();
  console.log(`\n🎉 2차 배치 완료! 현재 총 ${total}문제`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
