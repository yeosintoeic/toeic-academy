import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

// ── 새 PART 5 (30문제, 복수 정답 완전 차단) ────────────────────────────────
const newPart5 = [
  {
    questionText: "The accounting department _______ every financial record since the new audit regulations took effect last year.",
    optionA: "verifies", optionB: "verified", optionC: "has verified", optionD: "to verify",
    answer: "C", category: "동사 시제",
    explanation: "[현재완료] 'since + 과거 절'이 오면 반드시 현재완료(have/has + p.p.)를 써야 합니다. 'since the regulations took effect'는 과거 시점을 나타내므로 has verified가 유일하게 맞는 시제입니다. ① verifies는 단순 현재로 since와 함께 쓸 수 없고, ② verified는 단순 과거로 since절과 함께 현재완료에서 써야 합니다, ④ to verify는 부정사로 주어의 동사 자리에 올 수 없습니다.",
  },
  {
    questionText: "All visitors must sign in _______ the security counter on the ground floor before proceeding upstairs.",
    optionA: "on", optionB: "in", optionC: "at", optionD: "by",
    answer: "C", category: "전치사",
    explanation: "[전치사 at] 특정 지점(카운터, 책상, 입구)에서 무언가를 '하다'라는 표현에는 at을 씁니다. sign in at the counter = '카운터에서 서명하다'. ① on은 표면 위(on the counter), ② in은 공간 내부(in the building), ④ by는 '~옆에' 또는 수단을 나타내며 여기에는 적합하지 않습니다.",
  },
  {
    questionText: "Employees should submit _______ completed evaluation forms to the HR department no later than Friday.",
    optionA: "they", optionB: "them", optionC: "their", optionD: "theirs",
    answer: "C", category: "대명사",
    explanation: "[소유격 대명사] 명사(forms) 앞에서 소유를 나타내는 역할은 소유격(their)만 가능합니다. ① they는 주격 대명사, ② them은 목적격 대명사, ④ theirs는 독립 소유대명사로 뒤에 명사를 수식할 수 없습니다. 빈칸 뒤에 명사가 있으면 반드시 소유격을 선택하세요.",
  },
  {
    questionText: "Customer satisfaction scores for the new product line have been _______ high, exceeding all internal benchmarks.",
    optionA: "remark", optionB: "remarkable", optionC: "remarkably", optionD: "remarked",
    answer: "C", category: "품사",
    explanation: "[부사] 형용사(high)를 수식하려면 부사가 필요합니다. remarkably(부사)가 정답입니다. ① remark는 동사/명사, ② remarkable은 형용사로 명사만 수식할 수 있습니다, ④ remarked는 동사 과거형입니다. '부사 + 형용사' 구조를 기억하세요.",
  },
  {
    questionText: "_______ the significant budget cuts, the marketing team successfully launched three new campaigns this quarter.",
    optionA: "Although", optionB: "Because", optionC: "Despite", optionD: "However",
    answer: "C", category: "전치사/접속사",
    explanation: "[전치사 Despite] 빈칸 뒤에 명사구(the significant budget cuts)가 오므로 전치사 Despite(~에도 불구하고)가 필요합니다. ① Although는 접속사로 반드시 '주어+동사' 절이 필요합니다(Although the budget was cut), ② Because도 접속사, ④ However는 부사로 명사구 앞에 올 수 없습니다.",
  },
  {
    questionText: "The three finalists _______ scored above 90 percent on the written assessment will advance to the final interview round.",
    optionA: "whose", optionB: "which", optionC: "whom", optionD: "who",
    answer: "D", category: "관계대명사",
    explanation: "[주격 관계대명사 who] 선행사가 사람(finalists)이고 관계절 안에서 주어 역할(scored)을 하므로 주격 관계대명사 who가 정답입니다. ① whose는 소유격(whose score was...), ② which는 사물에 사용, ③ whom은 목적격(whom the company selected)입니다.",
  },
  {
    questionText: "The final version of the annual report _______ by the editorial team before it is distributed to shareholders.",
    optionA: "reviews", optionB: "will review", optionC: "will be reviewed", optionD: "reviewing",
    answer: "C", category: "수동태",
    explanation: "[수동태] 연간 보고서(report)는 검토를 '받는' 대상이므로 수동태가 필요합니다. will be reviewed = '검토될 것이다'. ① reviews와 ② will review는 능동태로 보고서가 스스로 검토한다는 비논리적 의미가 됩니다. ④ reviewing은 보조동사 없이 단독으로 술어 동사가 될 수 없습니다.",
  },
  {
    questionText: "The factory has maintained a perfect safety record _______ the new workplace safety protocols were introduced in January.",
    optionA: "for", optionB: "during", optionC: "since", optionD: "while",
    answer: "C", category: "전치사",
    explanation: "[since + 과거 시점] 빈칸 뒤에 과거 시점을 나타내는 절(were introduced in January)이 오고 현재완료(has maintained)와 함께 사용되므로 since(~이후로)가 정답입니다. ① for는 기간의 길이(for six months) 앞에 쓰며 절 앞에는 올 수 없습니다. ② during과 ④ while은 '~동안'으로 다른 용법입니다.",
  },
  {
    questionText: "The board of directors voted in favor of the _______ of two additional overseas branches next fiscal year.",
    optionA: "open", optionB: "openly", optionC: "opened", optionD: "opening",
    answer: "D", category: "품사",
    explanation: "[명사 자리] 전치사 of 앞, 관사(the) 뒤에는 명사가 와야 합니다. opening은 동명사/명사로 '개설'을 의미합니다. ① open은 형용사/동사, ② openly는 부사, ③ opened는 과거형 동사입니다. the + [명사] + of 구조에서 명사를 고르는 문제입니다.",
  },
  {
    questionText: "The new cloud-based software processes data _______ more efficiently than any previous system the company has used.",
    optionA: "very", optionB: "quite", optionC: "much", optionD: "so",
    answer: "C", category: "부사",
    explanation: "[비교급 강조] 비교급(more efficiently)을 강조할 때는 much, far, even, a lot을 씁니다. ① very는 원급 형용사·부사 강조에만 쓰이며 비교급 앞에 올 수 없습니다. ② quite와 ④ so도 비교급 강조 용도로 쓰이지 않습니다. much more efficiently = '훨씬 더 효율적으로'.",
  },
  {
    questionText: "Construction workers will continue laying the foundation _______ the structural engineer gives final approval.",
    optionA: "before", optionB: "unless", optionC: "until", optionD: "although",
    answer: "C", category: "접속사",
    explanation: "[until] '최종 승인이 날 때까지 계속 작업한다'는 의미이므로 until(~할 때까지)이 정답입니다. ① before는 '~하기 전에 멈춘다'는 의미로 continue와 어울리지 않습니다. ② unless는 '~하지 않으면', ④ although는 '~에도 불구하고'로 문맥에 맞지 않습니다.",
  },
  {
    questionText: "The keynote speaker delivered an _______ presentation that motivated all attendees to take immediate action.",
    optionA: "inspire", optionB: "inspiration", optionC: "inspirational", optionD: "inspired",
    answer: "C", category: "품사",
    explanation: "[형용사] 명사(presentation)를 수식하는 자리이므로 형용사가 필요합니다. inspirational(영감을 주는)이 정답입니다. ④ inspired는 '영감을 받은(수동)' 의미로 발표가 영감을 '받았다'는 뜻이 되어 부적절합니다. ① inspire는 동사, ② inspiration은 명사입니다.",
  },
  {
    questionText: "Parcels _______ to the wrong address must be returned to the distribution center within 48 hours.",
    optionA: "deliver", optionB: "delivering", optionC: "delivered", optionD: "delivery",
    answer: "C", category: "분사",
    explanation: "[과거분사 - 수동 수식] 소포(Parcels)는 배달을 '받는' 대상이므로 과거분사 delivered(배달된)가 명사를 수식합니다. ② delivering은 현재분사로 '소포가 배달하고 있다'는 능동 의미가 되어 부적절합니다. ① deliver는 동사 원형, ④ delivery는 명사입니다.",
  },
  {
    questionText: "Ms. Harrison has been leading the company's sustainability initiatives _______ over a decade.",
    optionA: "since", optionB: "during", optionC: "for", optionD: "within",
    answer: "C", category: "전치사",
    explanation: "[for + 기간] 'over a decade(10년 이상)'은 기간의 길이를 나타내므로 for를 씁니다. ① since는 특정 시점(since 2015) 앞에 쓰며, 뒤에 숫자 기간이 오지 않습니다. ② during은 사건/기간의 이름 앞에(during the project), ④ within은 '~이내에(within 3 days)'의 의미입니다.",
  },
  {
    questionText: "The safety equipment was _______ tested by an independent laboratory before being approved for use.",
    optionA: "thorough", optionB: "thoroughly", optionC: "thoroughness", optionD: "more thorough",
    answer: "B", category: "품사",
    explanation: "[부사] 과거분사(tested)를 수식하는 자리이므로 부사가 필요합니다. thoroughly(철저하게)가 정답입니다. ① thorough는 형용사로 명사를 수식합니다. ③ thoroughness는 명사, ④ more thorough는 형용사 비교급으로 동사/분사를 직접 수식할 수 없습니다.",
  },
  {
    questionText: "The operations manager is responsible for _______ that all safety guidelines are followed on the production floor.",
    optionA: "ensure", optionB: "ensures", optionC: "ensured", optionD: "ensuring",
    answer: "D", category: "동명사",
    explanation: "[전치사 뒤 동명사] 'responsible for' 뒤에는 반드시 동명사(-ing)가 와야 합니다. 전치사(for) 뒤에는 동명사가 오는 것이 영문법의 핵심 원칙입니다. ① ensure는 동사 원형, ② ensures는 3인칭 단수 동사, ③ ensured는 과거형/과거분사로 전치사 뒤에 올 수 없습니다.",
  },
  {
    questionText: "The renovation was completed two weeks _______ schedule, allowing the store to open earlier than anticipated.",
    optionA: "ahead of", optionB: "in front of", optionC: "prior than", optionD: "before of",
    answer: "A", category: "관용어구",
    explanation: "[관용 표현] ahead of schedule은 '예정보다 일찍'을 뜻하는 고정 표현입니다. ② in front of는 물리적 위치(앞에 있는), ③ prior than은 영어에서 존재하지 않는 표현(prior to가 올바름), ④ before of도 존재하지 않는 표현입니다. ahead of schedule은 TOEIC 빈출 숙어로 반드시 암기하세요.",
  },
  {
    questionText: "The company hired three bilingual assistants _______ support its growing international client base.",
    optionA: "for", optionB: "so that", optionC: "to", optionD: "in order that",
    answer: "C", category: "to부정사",
    explanation: "[to부정사 - 목적] 동사 hired의 목적(지원하기 위해)을 나타낼 때 to 부정사를 씁니다. to support = '지원하기 위해'. ① for 뒤에는 명사(구), ② so that과 ④ in order that은 접속사로 반드시 '주어 + 동사' 절이 이어져야 합니다(so that they could support...).",
  },
  {
    questionText: "Every employee in the department _______ expected to complete the mandatory compliance training by month-end.",
    optionA: "are", optionB: "is", optionC: "were", optionD: "have been",
    answer: "B", category: "수일치",
    explanation: "[Every + 단수 동사] 'Every + 단수 명사'는 반드시 단수 동사와 함께 씁니다. Every employee = 단수 주어 → is expected. ① are와 ③ were는 복수/과거 동사, ④ have been은 복수 주어에 쓰는 현재완료입니다. 'Every/Each + 명사 + 단수 동사'는 절대적인 규칙입니다.",
  },
  {
    questionText: "The new facility is designed to be spacious, energy-efficient, and _______ for employees with mobility challenges.",
    optionA: "accessibility", optionB: "access", optionC: "accessible", optionD: "accessing",
    answer: "C", category: "병렬구조",
    explanation: "[병렬구조 - 형용사] and로 연결된 spacious(형용사), energy-efficient(형용사)와 나란히 형용사 accessible(접근 가능한)이 와야 합니다. ① accessibility는 명사, ② access는 명사/동사, ④ accessing은 현재분사/동명사로 형용사와 병렬을 이루지 못합니다.",
  },
  {
    questionText: "All grant applications must be received _______ 5 P.M. on the closing date to be considered for funding.",
    optionA: "until", optionB: "unless", optionC: "by", optionD: "throughout",
    answer: "C", category: "전치사",
    explanation: "[by - 기한] by는 특정 시점까지 완료해야 하는 '기한'을 나타냅니다. by 5 P.M. = '오후 5시까지'. ① until은 동작의 지속(keep open until 5 P.M.)을 나타내며 완료 기한에는 쓰지 않습니다. received until은 '5시까지 계속 받는다'는 의미가 되어 맥락상 어색합니다. ② unless는 조건, ④ throughout은 '~내내'.",
  },
  {
    questionText: "The regional director had the quarterly performance data _______ before presenting it to the executive team.",
    optionA: "compile", optionB: "compiling", optionC: "compiled", optionD: "to compile",
    answer: "C", category: "사역동사",
    explanation: "[사역동사 have + 목적어 + p.p.] 'have + 목적어 + 과거분사'는 '목적어가 ~되게 하다(수동)'를 나타냅니다. 데이터(data)는 누군가에 의해 '컴파일되는' 대상이므로 과거분사 compiled가 정답입니다. ① compile은 목적어가 능동으로 행동할 때(have staff compile), ② compiling도 능동 관계, ④ to compile은 이 구조에서 쓰이지 않습니다.",
  },
  {
    questionText: "The _______ of the new high-speed rail line has transformed commuting times across the entire region.",
    optionA: "open", optionB: "openly", optionC: "opening", optionD: "opened",
    answer: "C", category: "품사",
    explanation: "[명사 자리 - 동명사/명사] 'The + _____ + of'에서 빈칸은 명사 자리입니다. opening(개통, 개장)이 명사로 정답입니다. ① open은 형용사/동사, ② openly는 부사, ④ opened는 동사 과거형으로 명사 자리에 올 수 없습니다. open → opening의 품사 변환을 기억하세요.",
  },
  {
    questionText: "Interns may use the company's video conferencing tools _______ they obtain prior approval from their supervisor.",
    optionA: "even if", optionB: "as long as", optionC: "unless", optionD: "in case",
    answer: "B", category: "접속사",
    explanation: "[as long as - 조건] as long as = '~하는 한, ~하기만 하면' (조건부 허가). ① even if는 '~에도 불구하고(허가)'로 조건 없이 허락한다는 의미가 되어 문맥 불일치. ③ unless는 '승인받지 않으면 쓸 수 없다'는 뜻이 되어 반대 의미. ④ in case는 '~에 대비해서(예방 목적)'로 허가 조건을 나타내지 않습니다.",
  },
  {
    questionText: "The company's 50th anniversary celebration is scheduled to take place _______ Saturday, June 14, at the downtown convention center.",
    optionA: "in", optionB: "at", optionC: "by", optionD: "on",
    answer: "D", category: "전치사",
    explanation: "[on + 요일/날짜] 요일(Saturday)이나 특정 날짜(June 14) 앞에는 항상 on을 씁니다. ① in은 월·연도·계절 앞(in June, in 2026), ② at은 시각 앞(at 9 A.M., at noon), ③ by는 기한을 나타냅니다. on Saturday / on June 14 처럼 요일·날짜 앞에는 예외 없이 on입니다.",
  },
  {
    questionText: "Staff members should _______ their timesheets through the new payroll portal each Friday by noon.",
    optionA: "submitted", optionB: "submitting", optionC: "submit", optionD: "to submit",
    answer: "C", category: "조동사",
    explanation: "[조동사 + 동사원형] 조동사(should, must, can, will 등) 뒤에는 반드시 동사원형이 옵니다. submit(제출하다)이 정답입니다. ① submitted는 과거형/과거분사, ② submitting은 현재분사, ④ to submit은 to 부정사로 모두 조동사 바로 뒤에 올 수 없습니다.",
  },
  {
    questionText: "The partnership agreement will benefit _______ the domestic suppliers and the overseas distribution partners.",
    optionA: "either", optionB: "neither", optionC: "both", optionD: "not only",
    answer: "C", category: "상관접속사",
    explanation: "[both A and B] 'both A and B'는 'A와 B 모두'를 의미합니다. both the domestic suppliers and the overseas partners = 양측 모두 혜택을 받는다. ① either A or B는 '둘 중 하나', ② neither A nor B는 '둘 다 아님', ④ not only는 'not only A but also B' 구조를 완성해야 합니다.",
  },
  {
    questionText: "The storage area is not wide _______ to accommodate the new industrial shelving units ordered last month.",
    optionA: "too", optionB: "enough", optionC: "very", optionD: "quite",
    answer: "B", category: "형용사",
    explanation: "[형용사/부사 + enough + to] '~할 만큼 충분히 ~한'은 형용사/부사 + enough + to 부정사 구조입니다. wide enough to accommodate = '수납할 만큼 충분히 넓은'. ① too + 형용사 + to는 '너무 ~해서 ~할 수 없다(부정)'는 반대 의미. ③ very와 ④ quite는 enough와 이런 구조로 쓰이지 않습니다.",
  },
  {
    questionText: "Conference participants _______ to register at least two weeks before the event to guarantee seating.",
    optionA: "require", optionB: "are required", optionC: "requiring", optionD: "have required",
    answer: "B", category: "수동태",
    explanation: "[수동태 be required to] 참가자들이 요구를 '받는' 입장이므로 수동태가 필요합니다. are required to = '~해야 한다(의무)'. ① require는 능동태로 참가자들이 누군가에게 요구한다는 의미. ③ requiring은 단독으로 술어 동사가 될 수 없습니다. ④ have required는 능동 현재완료입니다.",
  },
  {
    questionText: "The company's office hours will change _______ 8:30 A.M. to 7:30 A.M. starting the first Monday of next month.",
    optionA: "since", optionB: "between", optionC: "from", optionD: "during",
    answer: "C", category: "전치사",
    explanation: "[from A to B] 'from A to B'는 '시작점(A)에서 끝점(B)으로의 변화'를 나타냅니다. from 8:30 A.M. to 7:30 A.M. = '8시 30분에서 7시 30분으로 변경'. ② between은 'between A and B' 구조여야 합니다. ① since는 현재완료와 함께 '이후로', ④ during은 '~동안'으로 변화의 시작점 표현에 맞지 않습니다.",
  },
];

// ── PART 7 3중 지문 ────────────────────────────────────────────────────────
const triplePassage = {
  passageType: "triple passage",
  passageText: `[공지문]
To: All Staff
From: Jennifer Wu, HR Director
Subject: Annual Employee Recognition Gala — Nominations Open

The Hartfield Group is pleased to announce that nominations are now open for the Annual Employee Recognition Gala, to be held on Friday, October 17, at the Grand Meridian Hotel. This year, we will be recognizing outstanding employees in four categories: Innovation, Leadership, Customer Excellence, and Team Collaboration.

All employees are eligible to nominate a colleague. Nominations must be submitted via the company intranet portal by September 19. Each nominee requires a written statement of no more than 200 words explaining why they deserve the award.

A reception and dinner will be held beginning at 6:30 P.M., followed by the award ceremony at 8:00 P.M. Attendance is open to all staff. Please RSVP through the HR portal by October 3.

---

[이메일]
To: jennifer.wu@hartfieldgroup.com
From: Marcus Reynolds <m.reynolds@hartfieldgroup.com>
Date: September 15
Subject: RE: Annual Employee Recognition Gala — Nominations Open

Dear Ms. Wu,

Thank you for the announcement regarding the Employee Recognition Gala. I would like to nominate my colleague, Dr. Sarah Lim of the Product Development team, for the Innovation award.

Dr. Lim led the redesign of our flagship product's core module this year, reducing production costs by 18 percent while improving output quality. Her cross-departmental approach to problem-solving has significantly influenced how our teams collaborate.

I have attached a 185-word nomination statement as requested. Please let me know if any additional information is required.

Best regards,
Marcus Reynolds
Senior Engineer, Product Development

---

[확인 이메일]
To: m.reynolds@hartfieldgroup.com
From: HR Department <hr@hartfieldgroup.com>
Date: September 16
Subject: Nomination Received — Employee Recognition Gala

Dear Mr. Reynolds,

Thank you for submitting your nomination for the Annual Employee Recognition Gala. We are pleased to confirm that your nomination for Dr. Sarah Lim for the Innovation Award has been received and is under review.

The Nominations Committee will evaluate all submissions and notify nominees by September 30. Winners will be announced at the ceremony on October 17.

Please note that nominees are not to be informed of their nomination until after the winners are announced. If you have any questions, contact hr@hartfieldgroup.com.

The HR Team
Hartfield Group`,
  questions: [
    {
      questionText: "What is the purpose of the first document?",
      optionA: "To announce the winners of an employee award",
      optionB: "To invite nominations for an annual recognition event",
      optionC: "To describe the history of the Hartfield Group",
      optionD: "To request feedback on last year's gala",
      answer: "B",
      explanation: "첫 번째 문서(공지문)는 직원 인정 시상식 행사에 대한 후보 지명 공고입니다. 'nominations are now open'이 핵심 표현입니다. ① 수상자 발표는 행사 당일, ③ 회사 역사는 언급 없음, ④ 피드백 요청도 없습니다.",
      category: ""
    },
    {
      questionText: "For which award category is Dr. Lim being nominated?",
      optionA: "Leadership",
      optionB: "Customer Excellence",
      optionC: "Team Collaboration",
      optionD: "Innovation",
      answer: "D",
      explanation: "두 번째 문서(Marcus의 이메일)에서 'I would like to nominate Dr. Sarah Lim for the Innovation award'라고 명시되어 있습니다. 다른 카테고리(Leadership, Customer Excellence, Team Collaboration)는 첫 번째 문서에 나열되어 있지만 Dr. Lim의 카테고리는 Innovation입니다.",
      category: ""
    },
    {
      questionText: "By what date must nominations be submitted?",
      optionA: "September 15",
      optionB: "September 19",
      optionC: "September 30",
      optionD: "October 3",
      answer: "B",
      explanation: "첫 번째 문서에 'Nominations must be submitted...by September 19'라고 명시되어 있습니다. September 15는 Marcus가 이메일을 보낸 날짜, September 30은 노미니에게 통보하는 날짜, October 3는 RSVP 마감일입니다.",
      category: ""
    },
    {
      questionText: "What did Dr. Lim accomplish according to Mr. Reynolds?",
      optionA: "She increased the company's client base by 18 percent",
      optionB: "She reduced production costs by 18 percent while improving quality",
      optionC: "She developed a new training program for engineers",
      optionD: "She led a successful international expansion project",
      answer: "B",
      explanation: "두 번째 문서에서 'reducing production costs by 18 percent while improving output quality'라고 명시되어 있습니다. ① 고객 기반 증가는 언급 없음, ③ 교육 프로그램도 언급 없음, ④ 해외 확장도 언급되지 않았습니다.",
      category: ""
    },
    {
      questionText: "What should Mr. Reynolds NOT do according to the third document?",
      optionA: "Contact HR if he has questions",
      optionB: "Inform Dr. Lim that she has been nominated",
      optionC: "Wait for the committee's decision",
      optionD: "Attend the ceremony on October 17",
      answer: "B",
      explanation: "세 번째 문서(확인 이메일)에 'nominees are not to be informed of their nomination until after the winners are announced'라고 명시되어 있습니다. 수상자 발표 전까지 피추천인에게 알려서는 안 됩니다. 나머지 선택지는 금지 사항이 아닙니다.",
      category: ""
    },
  ],
};

async function main() {
  // 1. 기존 Part 5 문제 삭제
  await prisma.testAnswer.deleteMany({ where: { question: { part: 5 } } });
  await prisma.question.deleteMany({ where: { part: 5 } });
  console.log("기존 Part 5 삭제 완료");

  // 2. 새 Part 5 삽입
  for (const q of newPart5) {
    await prisma.question.create({ data: { part: 5, ...q } });
  }
  console.log(`새 Part 5 ${newPart5.length}개 삽입 완료`);

  // 3. 3중 지문 그룹 삽입
  await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: triplePassage.passageType,
      passageText: triplePassage.passageText,
      questions: {
        create: triplePassage.questions.map(q => ({ part: 7, ...q })),
      },
    },
  });
  console.log("3중 지문 추가 완료");

  // 4. 최종 문제 수 확인
  const p5 = await prisma.question.count({ where: { part: 5 } });
  const p7 = await prisma.question.count({ where: { part: 7 } });
  const total = await prisma.question.count();
  console.log(`\nPart 5: ${p5}개 | Part 7: ${p7}개 | 전체: ${total}개`);

  await prisma.$disconnect();
}

main().catch(console.error);
