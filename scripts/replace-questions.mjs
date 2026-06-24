import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

// ─── PART 5 ────────────────────────────────────────────────────────────────
const part5 = [
  {
    questionText: "The finance team _______ the budget proposal and will present it to the board tomorrow.",
    optionA: "finish", optionB: "finished", optionC: "has finished", optionD: "finishing",
    answer: "C", category: "동사 시제",
    explanation: "현재완료(has finished)는 과거에 완료된 일이 현재 결과로 이어짐을 나타냅니다. '검토를 마쳤고 내일 발표할 예정'이라는 문맥에 적합합니다.",
  },
  {
    questionText: "Visitors should report to the front desk _______ the main entrance upon arrival.",
    optionA: "at", optionB: "in", optionC: "on", optionD: "by",
    answer: "A", category: "전치사",
    explanation: "특정 지점이나 장소를 나타낼 때 전치사 at을 씁니다. at the main entrance(정문 앞에)가 올바른 표현입니다.",
  },
  {
    questionText: "The HR department reminded all staff to update _______ emergency contact information in the system.",
    optionA: "they", optionB: "them", optionC: "their", optionD: "themselves",
    answer: "C", category: "대명사",
    explanation: "명사(information) 앞에서 소유를 나타내는 소유격 their가 필요합니다. staff(복수 취급)의 소유격은 their입니다.",
  },
  {
    questionText: "The new production line runs _______ smoothly, reducing the number of defective units.",
    optionA: "consider", optionB: "considerable", optionC: "considerably", optionD: "consideration",
    answer: "C", category: "품사",
    explanation: "부사(smoothly)를 수식하는 부사 considerably(상당히)가 정답입니다. 형용사 considerable은 명사를 수식합니다.",
  },
  {
    questionText: "_______ the heavy snowfall, all employees arrived at the office on time.",
    optionA: "Although", optionB: "Despite", optionC: "Even", optionD: "However",
    answer: "B", category: "전치사/접속사",
    explanation: "뒤에 명사구(the heavy snowfall)가 오므로 전치사 Despite(~에도 불구하고)가 정답입니다. Although는 접속사로 주어+동사 형태의 절이 필요합니다.",
  },
  {
    questionText: "Employees _______ wish to participate in the training program should register by Friday.",
    optionA: "who", optionB: "which", optionC: "whose", optionD: "what",
    answer: "A", category: "관계대명사",
    explanation: "선행사가 사람(Employees)이고 관계절 안에서 주어 역할을 하므로 주격 관계대명사 who가 정답입니다.",
  },
  {
    questionText: "All maintenance requests _______ within 24 hours of submission.",
    optionA: "process", optionB: "are processed", optionC: "is processing", optionD: "processed",
    answer: "B", category: "수동태",
    explanation: "요청이 '처리되는' 것은 수동 관계이므로 수동태 are processed가 적절합니다. 주어(requests)가 복수이므로 are를 씁니다.",
  },
  {
    questionText: "The company has been offering remote work options _______ the pandemic began two years ago.",
    optionA: "for", optionB: "during", optionC: "since", optionD: "while",
    answer: "C", category: "전치사",
    explanation: "과거의 특정 시점(the pandemic began) 이후부터 현재까지를 나타낼 때 since를 씁니다. for는 기간의 길이 앞에 씁니다.",
  },
  {
    questionText: "The board approved the _______ of a new branch office in Singapore.",
    optionA: "establish", optionB: "established", optionC: "establishing", optionD: "establishment",
    answer: "D", category: "품사",
    explanation: "관사(the) 뒤와 전치사(of) 앞에는 명사가 와야 합니다. establishment(설립, 개설)가 올바른 명사형입니다.",
  },
  {
    questionText: "The updated software processes data _______ faster than the older version.",
    optionA: "very", optionB: "so", optionC: "too", optionD: "far",
    answer: "D", category: "부사",
    explanation: "비교급(faster)을 강조할 때는 far, much, even을 씁니다. very는 비교급을 수식할 수 없습니다.",
  },
  {
    questionText: "Please wait in the lobby _______ the receptionist calls your name.",
    optionA: "since", optionB: "unless", optionC: "until", optionD: "whenever",
    answer: "C", category: "접속사",
    explanation: "'~할 때까지 기다리다'는 wait until을 씁니다. until은 특정 시점까지 동작이 계속됨을 나타냅니다.",
  },
  {
    questionText: "The company received _______ feedback from customers about the new product design.",
    optionA: "enthusiasm", optionB: "enthusiastic", optionC: "enthusiastically", optionD: "enthuse",
    answer: "B", category: "품사",
    explanation: "명사(feedback) 앞에서 수식하는 형용사 enthusiastic(열정적인)이 정답입니다. enthusiasm은 명사, enthusiastically는 부사입니다.",
  },
  {
    questionText: "Employees _______ in the downtown office are encouraged to use public transportation.",
    optionA: "locate", optionB: "located", optionC: "locating", optionD: "location",
    answer: "B", category: "분사",
    explanation: "명사(Employees)를 수식하는 과거분사 located(위치한)가 적절합니다. employees가 위치하는 것은 수동 관계이므로 과거분사를 씁니다.",
  },
  {
    questionText: "The CEO has been traveling on a business trip _______ the past two weeks.",
    optionA: "since", optionB: "during", optionC: "for", optionD: "while",
    answer: "C", category: "전치사",
    explanation: "the past two weeks는 기간을 나타내므로 전치사 for를 씁니다. since는 특정 시점 앞에 씁니다.",
  },
  {
    questionText: "The quarterly presentation was _______ organized, impressing all of the investors.",
    optionA: "excellent", optionB: "excellence", optionC: "excellently", optionD: "excelling",
    answer: "C", category: "품사",
    explanation: "과거분사(organized) 앞에서 수식하는 부사 excellently(훌륭하게)가 정답입니다. 형용사 excellent는 명사를 수식합니다.",
  },
  {
    questionText: "The marketing team is responsible for _______ the new product campaign.",
    optionA: "plan", optionB: "planned", optionC: "planning", optionD: "plans",
    answer: "C", category: "동명사",
    explanation: "전치사(for) 뒤에는 동명사(-ing형)가 와야 합니다. planning이 정답입니다.",
  },
  {
    questionText: "The renovation project is expected to be completed _______ schedule.",
    optionA: "ahead of", optionB: "in front of", optionC: "forward to", optionD: "prior of",
    answer: "A", category: "관용어구",
    explanation: "ahead of schedule은 '예정보다 일찍'을 뜻하는 관용 표현입니다. prior to(~이전에)는 자연스럽지만 prior of는 올바르지 않습니다.",
  },
  {
    questionText: "The company hired additional staff _______ handle the increased workload during the holiday season.",
    optionA: "so that", optionB: "for", optionC: "to", optionD: "in order that",
    answer: "C", category: "to부정사",
    explanation: "목적(~하기 위해)을 나타내는 to 부정사가 정답입니다. to handle은 '처리하기 위해'를 의미합니다.",
  },
  {
    questionText: "The committee _______ its final decision at the end of this week.",
    optionA: "announce", optionB: "announces", optionC: "are announcing", optionD: "have announced",
    answer: "B", category: "수일치",
    explanation: "committee(위원회)는 하나의 단체로 단수 취급합니다. 따라서 단수형 announces가 정답입니다.",
  },
  {
    questionText: "The position requires candidates to be punctual, detail-oriented, and _______.",
    optionA: "communicate", optionB: "communication", optionC: "communicative", optionD: "communicably",
    answer: "C", category: "병렬구조",
    explanation: "병렬 구조에서 punctual, detail-oriented와 같이 형용사 형태 communicative(소통 능력이 있는)가 와야 합니다.",
  },
  {
    questionText: "All expense reports must be submitted _______ the last business day of the month.",
    optionA: "until", optionB: "before", optionC: "by", optionD: "within",
    answer: "C", category: "전치사",
    explanation: "특정 시점까지 완료해야 하는 기한을 나타낼 때 by를 씁니다. by the last business day는 '월말 마지막 영업일까지'를 의미합니다.",
  },
  {
    questionText: "The manager had the annual report _______ before the board meeting.",
    optionA: "review", optionB: "reviews", optionC: "reviewing", optionD: "reviewed",
    answer: "D", category: "사역동사",
    explanation: "사역동사 have + 목적어(the annual report) 뒤에 과거분사(reviewed)가 와서 '검토를 받게 했다'는 수동 관계를 나타냅니다.",
  },
  {
    questionText: "The _______ of the new subway line has significantly reduced traffic congestion downtown.",
    optionA: "introduce", optionB: "introduced", optionC: "introducing", optionD: "introduction",
    answer: "D", category: "품사",
    explanation: "관사(The) 뒤에는 명사가 와야 합니다. introduction(도입)이 올바른 명사형입니다.",
  },
  {
    questionText: "Employees may work from home _______ they meet all project deadlines.",
    optionA: "as long as", optionB: "even though", optionC: "in case", optionD: "so that",
    answer: "A", category: "접속사",
    explanation: "'~하는 한, ~하기만 하면'을 의미하는 as long as가 적절합니다. 재택근무 허용 조건을 나타냅니다.",
  },
  {
    questionText: "The product launch event is scheduled _______ Thursday, November 10.",
    optionA: "in", optionB: "at", optionC: "by", optionD: "on",
    answer: "D", category: "전치사",
    explanation: "요일이나 날짜 앞에는 전치사 on을 씁니다. on Thursday, on November 10이 올바른 표현입니다.",
  },
  {
    questionText: "All new interns must _______ a non-disclosure agreement before starting work.",
    optionA: "signed", optionB: "sign", optionC: "signing", optionD: "signature",
    answer: "B", category: "조동사",
    explanation: "조동사(must) 뒤에는 동사원형이 와야 합니다. sign(서명하다)이 정답입니다.",
  },
  {
    questionText: "The new research center will serve _______ as a laboratory and as a training facility.",
    optionA: "either", optionB: "neither", optionC: "both", optionD: "whether",
    answer: "C", category: "상관접속사",
    explanation: "both A and B는 'A와 B 모두'를 뜻하는 상관접속사 구문입니다. both...and가 정답입니다.",
  },
  {
    questionText: "The storage room is not large _______ to hold all of the archived documents.",
    optionA: "enough", optionB: "too", optionC: "very", optionD: "quite",
    answer: "A", category: "형용사",
    explanation: "'~할 만큼 충분히 ~한'은 형용사 + enough + to 부정사 구조입니다. large enough to hold가 정답입니다.",
  },
  {
    questionText: "All guests _______ to present a valid ID at the registration desk.",
    optionA: "require", optionB: "are required", optionC: "requiring", optionD: "required",
    answer: "B", category: "수동태",
    explanation: "be required to는 '~해야 한다'는 의무를 나타내는 수동태 표현입니다. 방문자들이 요구를 받는 입장이므로 수동태 are required가 적절합니다.",
  },
  {
    questionText: "Office hours will shift _______ 8 A.M. to 9 A.M. effective next Monday.",
    optionA: "since", optionB: "from", optionC: "between", optionD: "during",
    answer: "B", category: "전치사",
    explanation: "from A to B는 '시작점에서 끝점까지'를 나타내는 표현입니다. from 8 A.M. to 9 A.M.이 올바른 표현입니다.",
  },
];

// ─── PART 6 ────────────────────────────────────────────────────────────────
const part6 = [
  {
    passageType: "email",
    passageText: `To: All Staff
From: David Kim, Operations Manager
Date: March 15

Dear Team,

I am writing to _______ (1) you that our company will be relocating its headquarters to a new building on Oak Street beginning April 1. The new location has been _______ (2) chosen for its modern facilities and convenient public transport access.

All employees are requested to _______ (3) their personal belongings by March 28 so that the moving team can proceed efficiently. Please note that IT equipment will be handled separately by our technical staff.

For further questions, please do not hesitate to _______ (4) our facilities coordinator, Ms. Sarah Lim, at extension 204.

Thank you for your cooperation.

David Kim
Operations Manager`,
    questions: [
      { questionText: "빈칸 (1)에 들어갈 알맞은 단어를 고르세요.", optionA: "notify", optionB: "notified", optionC: "notifying", optionD: "notification", answer: "A", category: "to부정사", explanation: "to 부정사 뒤에는 동사원형이 와야 합니다. notify(알리다)가 정답이며, 'notify you that...'는 '~임을 알리다'는 표현입니다." },
      { questionText: "빈칸 (2)에 들어갈 알맞은 단어를 고르세요.", optionA: "careful", optionB: "carefully", optionC: "care", optionD: "cares", answer: "B", category: "품사", explanation: "과거분사(chosen)를 수식하는 부사 carefully(신중하게)가 정답입니다. has been carefully chosen(신중하게 선택되었다)이 자연스러운 표현입니다." },
      { questionText: "빈칸 (3)에 들어갈 알맞은 단어를 고르세요.", optionA: "collecting", optionB: "collected", optionC: "collect", optionD: "collection", answer: "C", category: "to부정사", explanation: "to 부정사 뒤에는 동사원형이 와야 합니다. to collect(수거하다)가 정답입니다." },
      { questionText: "빈칸 (4)에 들어갈 알맞은 단어를 고르세요.", optionA: "reach", optionB: "reached", optionC: "reaching", optionD: "reaches", answer: "A", category: "to부정사", explanation: "to 부정사 뒤에는 동사원형이 와야 합니다. to reach(연락하다)가 정답입니다." },
    ],
  },
  {
    passageType: "memo",
    passageText: `MEMORANDUM

To: All Department Supervisors
From: Human Resources Department
Re: Updated Leave Policy
Date: September 5

Please be _______ (1) that effective October 1, all annual leave requests must be submitted through the new online portal. This system will _______ (2) the approval process and reduce paperwork across all departments.

Employees who have already submitted leave requests through the previous method will not be _______ (3) to resubmit their applications. However, any new requests made after October 1 must be processed through the updated system.

Training sessions on the new portal will be held next week. Attendance is _______ (4) for all supervisors to ensure a smooth transition.`,
    questions: [
      { questionText: "빈칸 (1)에 들어갈 알맞은 단어를 고르세요.", optionA: "advise", optionB: "advised", optionC: "advising", optionD: "advisement", answer: "B", category: "수동태", explanation: "be advised that은 '~임을 숙지하세요'라는 뜻의 관용 표현입니다. be 동사 뒤에 과거분사 advised가 옵니다." },
      { questionText: "빈칸 (2)에 들어갈 알맞은 단어를 고르세요.", optionA: "streamline", optionB: "streamlined", optionC: "streamlines", optionD: "streamlining", answer: "A", category: "조동사", explanation: "조동사(will) 뒤에는 동사원형이 와야 합니다. streamline(간소화하다)이 정답입니다." },
      { questionText: "빈칸 (3)에 들어갈 알맞은 단어를 고르세요.", optionA: "require", optionB: "requiring", optionC: "required", optionD: "requirement", answer: "C", category: "수동태", explanation: "be required to는 '~해야 한다'는 의미의 수동태 표현입니다. not be required to resubmit(재제출이 필요하지 않다)이 자연스럽습니다." },
      { questionText: "빈칸 (4)에 들어갈 알맞은 단어를 고르세요.", optionA: "mandatary", optionB: "mandatory", optionC: "mandate", optionD: "mandated", answer: "B", category: "품사", explanation: "주어(Attendance)의 보어 자리에 형용사 mandatory(의무적인)가 와야 합니다. mandated는 동사의 과거형/과거분사입니다." },
    ],
  },
  {
    passageType: "advertisement",
    passageText: `Transform Your Workspace with GreenSpace Office Solutions

Is your office feeling outdated? GreenSpace Office Solutions _______ (1) a wide range of ergonomic furniture and smart storage systems designed to maximize workplace productivity.

Our team of expert consultants will visit your site to assess your needs and _______ (2) a customized plan tailored to your space and budget. We pride ourselves on delivering solutions that are both _______ (3) and cost-effective.

Visit our showroom at 47 Harbor Boulevard or call us at 555-0192 for a free _______ (4) today. Let GreenSpace help you create the ideal working environment.`,
    questions: [
      { questionText: "빈칸 (1)에 들어갈 알맞은 단어를 고르세요.", optionA: "offering", optionB: "offers", optionC: "offered", optionD: "offer", answer: "B", category: "수일치", explanation: "주어(GreenSpace Office Solutions)가 3인칭 단수이고 현재 시제이므로 단수형 offers가 정답입니다." },
      { questionText: "빈칸 (2)에 들어갈 알맞은 단어를 고르세요.", optionA: "develop", optionB: "developing", optionC: "development", optionD: "developed", answer: "A", category: "병렬구조", explanation: "등위접속사 and 앞의 동사(assess)와 병렬 구조를 이루므로 동사원형 develop(개발하다)이 정답입니다." },
      { questionText: "빈칸 (3)에 들어갈 알맞은 단어를 고르세요.", optionA: "function", optionB: "functional", optionC: "functionally", optionD: "functioning", answer: "B", category: "병렬구조", explanation: "both A and B 구조에서 cost-effective(형용사)와 병렬을 이루는 형용사 functional(기능적인)이 정답입니다." },
      { questionText: "빈칸 (4)에 들어갈 알맞은 단어를 고르세요.", optionA: "consult", optionB: "consulting", optionC: "consultant", optionD: "consultation", answer: "D", category: "품사", explanation: "관사(a) 뒤에는 명사가 와야 합니다. consultation(상담, 컨설팅)이 올바른 명사형입니다." },
    ],
  },
  {
    passageType: "notice",
    passageText: `IMPORTANT MAINTENANCE NOTICE

Riverside Medical Center will be _______ (1) scheduled maintenance on all elevators from Friday, August 8, to Sunday, August 10. During this period, elevator service will be temporarily unavailable.

We sincerely apologize for any _______ (2) this may cause to our patients and visitors. Staff members will be available to assist anyone requiring help with mobility.

_______ (3), all medical departments and emergency services will remain fully operational during the maintenance period. Stairwell access will be available at all times.

We appreciate your _______ (4) and understanding during this necessary maintenance period.`,
    questions: [
      { questionText: "빈칸 (1)에 들어갈 알맞은 단어를 고르세요.", optionA: "conduct", optionB: "conducted", optionC: "conducting", optionD: "conduction", answer: "C", category: "동사 시제", explanation: "will be + -ing 형태의 미래진행 시제가 됩니다. conducting(수행하는 중)이 정답입니다." },
      { questionText: "빈칸 (2)에 들어갈 알맞은 단어를 고르세요.", optionA: "inconvenienced", optionB: "inconvenience", optionC: "inconveniently", optionD: "inconvenient", answer: "B", category: "품사", explanation: "any 뒤에는 명사가 와야 합니다. inconvenience(불편함)가 올바른 명사형입니다." },
      { questionText: "빈칸 (3)에 들어갈 알맞은 단어를 고르세요.", optionA: "Therefore", optionB: "However", optionC: "Please note that", optionD: "As a result", answer: "C", category: "접속부사", explanation: "불편함을 사과한 후 서비스는 정상 운영됨을 안내하는 문맥에서 Please note that(~을 유의하세요)이 가장 자연스럽습니다." },
      { questionText: "빈칸 (4)에 들어갈 알맞은 단어를 고르세요.", optionA: "patient", optionB: "patients", optionC: "patience", optionD: "patiently", answer: "C", category: "품사", explanation: "소유격(your) 뒤에는 명사가 와야 합니다. patience(인내, 이해)가 올바른 명사형입니다." },
    ],
  },
];

// ─── PART 7 ────────────────────────────────────────────────────────────────
const part7 = [
  {
    passageType: "notice",
    passageText: `NOTICE: HOLIDAY OFFICE SCHEDULE

This is to inform all employees that the Northfield Solutions head office will be closed from Monday, December 23, to Wednesday, January 1, for the annual winter holiday.

Regular office hours will resume on Thursday, January 2. Employees who need to access the office during the holiday period must obtain prior approval from their department heads by December 18.

Emergency technical support will be available via email at support@northfieldsolutions.com throughout the holiday period. Response times may be longer than usual.

We wish all employees and their families a restful and enjoyable holiday season.

Human Resources Department
Northfield Solutions`,
    questions: [
      { questionText: "What is the purpose of this notice?", optionA: "To announce a change in office location", optionB: "To inform employees about the holiday schedule", optionC: "To introduce new HR policies", optionD: "To request employees to work overtime", answer: "B", explanation: "공지문의 첫 문장에서 연말 연시 휴무 일정을 알리는 목적임을 확인할 수 있습니다.", category: "" },
      { questionText: "By what date must employees apply for holiday office access?", optionA: "December 18", optionB: "December 23", optionC: "January 1", optionD: "January 2", answer: "A", explanation: "'obtain prior approval...by December 18'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What is available during the holiday period?", optionA: "Full IT support services", optionB: "Regular office access for all staff", optionC: "Emergency technical support via email", optionD: "HR department consultations", answer: "C", explanation: "'Emergency technical support will be available via email'라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "email",
    passageText: `To: customer.support@blueridgeoutfitters.com
From: Patricia Nguyen <p.nguyen@email.com>
Date: October 4
Subject: Missing Item from Order #BRO-8821

To Whom It May Concern,

I am writing regarding an order I placed on September 28. My order (#BRO-8821) included a hiking jacket in size medium and a pair of waterproof boots in size 8. While the jacket arrived as expected on October 3, the boots were not included in the package.

I checked the shipping confirmation email, which stated that both items were shipped together. However, the parcel I received contained only the jacket. Could you please look into this matter and arrange for the boots to be sent to me as soon as possible?

I would appreciate a response within two business days. My contact number is 555-0147.

Thank you,
Patricia Nguyen`,
    questions: [
      { questionText: "Why did Ms. Nguyen write this email?", optionA: "To request a refund for a damaged product", optionB: "To report a missing item from her order", optionC: "To inquire about the delivery schedule", optionD: "To cancel her order", answer: "B", explanation: "이메일 첫 문장에서 주문 상품 중 일부가 누락됐음을 보고하기 위해 이메일을 작성했음을 알 수 있습니다.", category: "" },
      { questionText: "What does Ms. Nguyen request?", optionA: "A full refund for her order", optionB: "A replacement for a damaged jacket", optionC: "The missing boots to be sent to her", optionD: "A discount on her next purchase", answer: "C", explanation: "'arrange for the boots to be sent to me as soon as possible'에서 누락된 부츠를 보내달라고 요청하고 있습니다.", category: "" },
      { questionText: "What does the shipping confirmation indicate?", optionA: "It showed the wrong delivery address", optionB: "Both items were shipped together", optionC: "The boots were backordered", optionD: "The delivery was rescheduled", answer: "B", explanation: "'shipping confirmation email, which stated that both items were shipped together'라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "advertisement",
    passageText: `LAUNCH YOUR NEXT BIG IDEA AT INNOVATE HUB

Innovate Hub is a premium co-working space located in the heart of the financial district, designed to support entrepreneurs, freelancers, and small business teams.

Membership Options:
• Day Pass: $25/day — full access to hot desks and common areas
• Flex Membership: $150/month — up to 10 days of hot desk access per month
• Dedicated Desk: $350/month — a reserved desk in our open workspace
• Private Office: From $800/month — private office suites for teams of 2–8

All memberships include high-speed Wi-Fi, complimentary coffee and tea, use of meeting rooms (subject to availability), and access to our monthly networking events.

New members joining before August 31 will receive their first month at 20% off.

For more information or to schedule a tour, visit www.innovatehub.co or call 555-0233.`,
    questions: [
      { questionText: "What is being advertised?", optionA: "Office furniture for sale", optionB: "A business consulting service", optionC: "A co-working space", optionD: "An entrepreneurship certification program", answer: "C", explanation: "광고 제목과 내용에서 co-working space를 홍보하고 있음을 알 수 있습니다.", category: "" },
      { questionText: "What is included in all membership plans?", optionA: "A private office suite", optionB: "Unlimited access to all meeting rooms", optionC: "High-speed Wi-Fi and monthly networking events", optionD: "Discounted parking in the financial district", answer: "C", explanation: "'All memberships include high-speed Wi-Fi...and access to our monthly networking events'라고 명시되어 있습니다.", category: "" },
      { questionText: "How can new members receive a discount?", optionA: "By referring another new member", optionB: "By joining before August 31", optionC: "By choosing a 6-month membership", optionD: "By booking a private office", answer: "B", explanation: "'New members joining before August 31 will receive their first month at 20% off'라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "article",
    passageText: `LOCAL BAKERY CHAIN PLANS REGIONAL EXPANSION

HARTWELL — Sunrise Bakeries, a well-known local pastry chain, announced this week that it will open five new locations across the region over the next 18 months. The company, which currently operates twelve stores in the Hartwell metropolitan area, plans to enter three neighboring cities: Millbrook, Crestview, and Pinehaven.

"We've experienced consistent growth over the past three years, and we feel confident that the time is right to bring the Sunrise experience to new communities," said CEO Margaret Holloway at a press conference on Tuesday.

The expansion will create approximately 150 new jobs, including store managers, bakers, and part-time staff. Construction on the first two new locations is expected to begin in March, with the stores opening to customers in July.

Sunrise Bakeries, founded in 2009, is known for its freshly baked sourdough bread and seasonal specialty items.`,
    questions: [
      { questionText: "What is the main topic of the article?", optionA: "A bakery's plan to hire seasonal staff", optionB: "A local bakery chain's regional expansion", optionC: "Changes to a bakery's product menu", optionD: "A new CEO appointment at a bakery company", answer: "B", explanation: "기사의 첫 문장에서 Sunrise Bakeries가 새 지점을 열 계획임을 발표했다고 명시되어 있습니다.", category: "" },
      { questionText: "How many new stores does Sunrise Bakeries plan to open?", optionA: "Three", optionB: "Seven", optionC: "Five", optionD: "Twelve", answer: "C", explanation: "'it will open five new locations across the region'이라고 명시되어 있습니다.", category: "" },
      { questionText: "When will the first new stores open to customers?", optionA: "March", optionB: "July", optionC: "January", optionD: "October", answer: "B", explanation: "'the stores opening to customers in July'라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "notice",
    passageText: `GRAND OPENING CELEBRATION
Westfield Community Library — New Digital Learning Wing

Join us for the grand opening of the Westfield Community Library's newly renovated Digital Learning Wing on Saturday, April 12, from 10 A.M. to 5 P.M.

EVENT HIGHLIGHTS:
• Guided tours of the new wing (every 30 minutes starting at 10:30 A.M.)
• Live demonstrations of our new 3D printing and digital media studios
• Children's storytelling sessions at 11 A.M. and 2 P.M.
• Meet-and-greet with local authors from 1 P.M. to 3 P.M.
• Light refreshments provided

All are welcome. No registration required for most activities; however, seating for the author meet-and-greet is limited and requires advance sign-up via our website at www.westfieldlibrary.org.

For more information, contact the library at 555-0389.`,
    questions: [
      { questionText: "What event is being announced?", optionA: "The opening of a new public library", optionB: "The launch of a digital literacy program", optionC: "The grand opening of a library renovation", optionD: "A community fundraising event", answer: "C", explanation: "'grand opening of the Westfield Community Library's newly renovated Digital Learning Wing'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What requires advance registration?", optionA: "Guided tours of the new wing", optionB: "The children's storytelling sessions", optionC: "The author meet-and-greet event", optionD: "Live studio demonstrations", answer: "C", explanation: "'seating for the author meet-and-greet is limited and requires advance sign-up'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What time do the guided tours begin?", optionA: "10:00 A.M.", optionB: "10:30 A.M.", optionC: "11:00 A.M.", optionD: "1:00 P.M.", answer: "B", explanation: "'every 30 minutes starting at 10:30 A.M.'이라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "email",
    passageText: `To: Jamie Thornton <j.thornton@email.com>
From: Recruitment Team <hr@vantagetech.com>
Date: February 7
Subject: Interview Invitation — Software Engineer Position

Dear Mr. Thornton,

Thank you for your application for the Software Engineer position at Vantage Technology. After reviewing your qualifications, we would like to invite you for an interview.

Your interview is scheduled for Wednesday, February 19, at 2:00 P.M. at our offices located at 250 Clearwater Drive, Suite 400. The interview will last approximately 60 minutes and will involve a technical assessment followed by a discussion with members of our engineering team.

Please bring a valid photo ID and a copy of your portfolio or any relevant work samples you wish to present. If you need to reschedule, please contact Ms. Anita Park at a.park@vantagetech.com or by calling 555-0176.

We look forward to meeting you.

Best regards,
Recruitment Team
Vantage Technology`,
    questions: [
      { questionText: "Why was the email sent to Mr. Thornton?", optionA: "To offer him a job at Vantage Technology", optionB: "To inform him that his application was rejected", optionC: "To invite him for a job interview", optionD: "To request additional documents", answer: "C", explanation: "'we would like to invite you for an interview'에서 면접 초청 목적임을 알 수 있습니다.", category: "" },
      { questionText: "What should Mr. Thornton bring to the interview?", optionA: "A cover letter and reference letters", optionB: "A photo ID and work samples", optionC: "A completed employment form", optionD: "University transcripts", answer: "B", explanation: "'Please bring a valid photo ID and a copy of your portfolio or any relevant work samples'이라고 명시되어 있습니다.", category: "" },
      { questionText: "Who should Mr. Thornton contact to reschedule?", optionA: "The CEO of Vantage Technology", optionB: "The engineering team leader", optionC: "Ms. Anita Park", optionD: "The recruitment team manager", answer: "C", explanation: "'If you need to reschedule, please contact Ms. Anita Park'이라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "double passage",
    passageText: `[Job Posting]
MARKETING COORDINATOR — BlueSky Creative Agency (Full-Time)

BlueSky Creative Agency is seeking a motivated Marketing Coordinator to join our growing team.

Responsibilities:
• Assist in developing and executing marketing campaigns across digital and print media
• Coordinate with external vendors and clients for timely project delivery
• Monitor campaign performance and prepare regular progress reports

Requirements:
• Bachelor's degree in Marketing, Communications, or related field
• Minimum 2 years of marketing or administrative experience
• Proficiency in Microsoft Office Suite and basic graphic design tools

Salary: Competitive, based on experience
To apply: Send resume and cover letter to careers@blueskycreative.com by March 15.

---

[Application Email]
To: careers@blueskycreative.com
From: Laura Chen <l.chen@email.com>
Date: March 10
Subject: Application — Marketing Coordinator Position

Dear Hiring Team,

I am writing to apply for the Marketing Coordinator position. I hold a degree in Communications from Lakeside University and have spent the past three years working as a marketing assistant at Apex Digital, where I coordinated multiple client campaigns and managed vendor relationships.

I am proficient in the Microsoft Office Suite and have experience using Canva and Adobe Express for design tasks. I am known for my ability to work accurately under tight deadlines.

I have attached my resume and a portfolio of past campaigns for your review.

Sincerely,
Laura Chen`,
    questions: [
      { questionText: "What is the minimum work experience required for this position?", optionA: "1 year", optionB: "2 years", optionC: "3 years", optionD: "4 years", answer: "B", explanation: "'Minimum 2 years of marketing or administrative experience'라고 명시되어 있습니다.", category: "" },
      { questionText: "By what date should applications be submitted?", optionA: "March 10", optionB: "March 12", optionC: "March 15", optionD: "March 20", answer: "C", explanation: "'Send resume and cover letter to careers@blueskycreative.com by March 15'라고 명시되어 있습니다.", category: "" },
      { questionText: "Where did Ms. Chen work previously?", optionA: "BlueSky Creative Agency", optionB: "Lakeside University", optionC: "Apex Digital", optionD: "A graphic design firm", answer: "C", explanation: "'working as a marketing assistant at Apex Digital'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What design tools does Ms. Chen mention?", optionA: "Adobe Photoshop and Illustrator", optionB: "Microsoft Publisher", optionC: "Canva and Adobe Express", optionD: "CorelDRAW", answer: "C", explanation: "'experience using Canva and Adobe Express for design tasks'라고 명시되어 있습니다.", category: "" },
      { questionText: "What does Ms. Chen attach to her application?", optionA: "A cover letter and references", optionB: "A resume and portfolio", optionC: "Academic transcripts and certifications", optionD: "A sample marketing plan", answer: "B", explanation: "'I have attached my resume and a portfolio of past campaigns'이라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "double passage",
    passageText: `[Press Release]
ClearPath Technology Launches ClearPath Pro 2.0

BOSTON — ClearPath Technology today announced the release of ClearPath Pro 2.0, an advanced project management software designed for teams of all sizes. The new version features enhanced collaboration tools, real-time progress tracking, and an intuitive drag-and-drop interface.

ClearPath Pro 2.0 is available for $49 per user per month, with a team plan for groups of five or more at $35 per user per month. New customers can access a 30-day free trial at www.clearpathtech.com.

"We developed ClearPath Pro 2.0 in response to direct feedback from our user community," said CTO James Warren.

ClearPath Technology, headquartered in Boston, has served over 20,000 businesses worldwide since its founding in 2015.

---

[Customer Inquiry]
To: support@clearpathtech.com
From: Rachel Kim <r.kim@sunriselogistics.com>
Date: April 3
Subject: Inquiry About ClearPath Pro 2.0

Dear Support Team,

I recently saw your press release about ClearPath Pro 2.0 and I'm very interested in adopting it for our team of twelve people at Sunrise Logistics.

I have a few questions:
1. Does the team plan apply to our team size of twelve?
2. Is onboarding support available for new subscribers?
3. Can data from our current software be migrated to ClearPath Pro?

We are currently evaluating several tools and would also like to schedule a product demo.

Thank you,
Rachel Kim
Director of Operations, Sunrise Logistics`,
    questions: [
      { questionText: "What is the purpose of the press release?", optionA: "To announce a new software product launch", optionB: "To report an increase in company profits", optionC: "To introduce a new company headquarters", optionD: "To announce a merger with another firm", answer: "A", explanation: "'ClearPath Technology today announced the release of ClearPath Pro 2.0'에서 신규 소프트웨어 출시 발표임을 알 수 있습니다.", category: "" },
      { questionText: "How much does the team plan cost per user per month?", optionA: "$25", optionB: "$35", optionC: "$49", optionD: "$55", answer: "B", explanation: "'team plan available for groups of five or more at $35 per user per month'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What does Ms. Kim want to arrange?", optionA: "A visit to ClearPath's headquarters", optionB: "A 30-day free trial", optionC: "A product demonstration", optionD: "A meeting with the CTO", answer: "C", explanation: "'we would also like to schedule a product demo'라고 명시되어 있습니다.", category: "" },
      { questionText: "How many employees are on Ms. Kim's team?", optionA: "Five", optionB: "Eight", optionC: "Ten", optionD: "Twelve", answer: "D", explanation: "'our team of twelve people at Sunrise Logistics'라고 명시되어 있습니다.", category: "" },
      { questionText: "What does Ms. Kim mention about her current situation?", optionA: "She has already started a free trial", optionB: "She is evaluating several tools", optionC: "She has previously used ClearPath software", optionD: "She is waiting to hear from her manager", answer: "B", explanation: "'We are currently evaluating several tools'라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "double passage",
    passageText: `[Email 1]
To: events@harvestcatering.com
From: Daniel Park <d.park@greenwoodfoundation.org>
Date: June 2
Subject: Catering Request — Annual Fundraiser Dinner

Dear Harvest Catering Team,

I am contacting you on behalf of the Greenwood Foundation to inquire about catering services for our annual fundraiser dinner. The event will be held on Saturday, July 19, at the Rosewood Banquet Hall, and we are expecting approximately 120 guests.

We are looking for a three-course dinner service with vegetarian and gluten-free options. Our budget is approximately $6,000, including service staff. Could you please let us know if you are available and provide a quote?

Daniel Park
Event Coordinator, Greenwood Foundation

---

[Email 2]
To: d.park@greenwoodfoundation.org
From: events@harvestcatering.com
Date: June 4
Subject: RE: Catering Request — Annual Fundraiser Dinner

Dear Mr. Park,

Thank you for reaching out. We are pleased to confirm availability on July 19.

Based on your requirements, we can offer a three-course dinner for 120 guests with vegetarian and gluten-free options for $5,800. This includes setup, service staff for five hours, and cleanup. Menu options will be sent within two business days.

To proceed, we require a signed service agreement and a 30% deposit by June 20.

Best regards,
Maria Santos
Events Manager, Harvest Catering`,
    questions: [
      { questionText: "Why did Mr. Park contact Harvest Catering?", optionA: "To cancel a previously booked event", optionB: "To inquire about catering for a fundraiser dinner", optionC: "To request a meeting with the catering team", optionD: "To complain about a past service", answer: "B", explanation: "'to inquire about catering services for our annual fundraiser dinner'에서 연례 기금 마련 만찬을 위한 케이터링 문의임을 알 수 있습니다.", category: "" },
      { questionText: "How many guests are expected at the event?", optionA: "80", optionB: "100", optionC: "120", optionD: "150", answer: "C", explanation: "'we are expecting approximately 120 guests'라고 명시되어 있습니다.", category: "" },
      { questionText: "What is included in Harvest Catering's quoted price?", optionA: "Menu printing and venue decoration", optionB: "Setup, service staff, and cleanup", optionC: "Transportation and venue rental", optionD: "Post-event photography", answer: "B", explanation: "'This includes setup, service staff for five hours, and cleanup'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What must Mr. Park provide by June 20?", optionA: "Final guest count and dietary needs", optionB: "A signed agreement and a 30% deposit", optionC: "Full payment for the event", optionD: "Venue access instructions", answer: "B", explanation: "'we require a signed service agreement and a 30% deposit by June 20'이라고 명시되어 있습니다.", category: "" },
    ],
  },
  {
    passageType: "advertisement",
    passageText: `INNOVATE FORWARD CONFERENCE 2024
The Premier Event for Business Leaders and Entrepreneurs

Date: Thursday–Friday, October 10–11
Venue: Grand Pacific Convention Center
Registration Deadline: September 25

Innovate Forward brings together over 500 business professionals for keynote presentations, workshops, and networking sessions focused on innovation, leadership, and emerging business trends.

HIGHLIGHTS:
• 20+ keynote speakers from industry-leading companies
• Workshops on AI integration, sustainable business, and team leadership
• Evening networking reception on October 10
• Digital recordings of all sessions available post-event

REGISTRATION FEES:
• Early Bird (by August 31): $299
• Standard: $399
• Group rate (5+ attendees): $249 per person

Visit www.innovateforward2024.com or contact info@innovateforward.com to register.`,
    questions: [
      { questionText: "What is the main purpose of the Innovate Forward Conference?", optionA: "To showcase new technology products", optionB: "To connect business professionals focused on innovation", optionC: "To recruit professionals for job vacancies", optionD: "To provide certification courses for managers", answer: "B", explanation: "'bringing together over 500 business professionals...focused on innovation, leadership, and emerging business trends'에서 확인할 수 있습니다.", category: "" },
      { questionText: "What is the total cost for a group of 6 people to register?", optionA: "$1,494", optionB: "$1,794", optionC: "$2,394", optionD: "$2,994", answer: "A", explanation: "그룹 요금은 1인당 $249이며, 6명 × $249 = $1,494입니다.", category: "" },
      { questionText: "What is available to attendees after the conference?", optionA: "Printed copies of all presentations", optionB: "A certificate of attendance", optionC: "Digital recordings of all sessions", optionD: "A directory of all speakers", answer: "C", explanation: "'Digital recordings of all sessions available post-event'라고 명시되어 있습니다.", category: "" },
      { questionText: "What is the registration deadline?", optionA: "August 31", optionB: "September 25", optionC: "October 10", optionD: "October 11", answer: "B", explanation: "'Registration Deadline: September 25'라고 명시되어 있습니다.", category: "" },
    ],
  },
];

// ─── MAIN ──────────────────────────────────────────────────────────────────
async function main() {
  console.log("기존 데이터 삭제 중...");
  await prisma.testAnswer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionGroup.deleteMany();
  console.log("삭제 완료");

  console.log("Part 5 문제 삽입 중...");
  for (const q of part5) {
    await prisma.question.create({ data: { part: 5, ...q } });
  }
  console.log(`Part 5: ${part5.length}개 완료`);

  console.log("Part 6 문제 삽입 중...");
  for (const g of part6) {
    await prisma.questionGroup.create({
      data: {
        part: 6,
        passageType: g.passageType,
        passageText: g.passageText,
        questions: {
          create: g.questions.map((q) => ({ part: 6, ...q })),
        },
      },
    });
  }
  console.log(`Part 6: ${part6.length}그룹 완료`);

  console.log("Part 7 문제 삽입 중...");
  for (const g of part7) {
    await prisma.questionGroup.create({
      data: {
        part: 7,
        passageType: g.passageType,
        passageText: g.passageText,
        questions: {
          create: g.questions.map((q) => ({ part: 7, ...q })),
        },
      },
    });
  }
  const totalP7 = part7.reduce((s, g) => s + g.questions.length, 0);
  console.log(`Part 7: ${part7.length}그룹 / ${totalP7}문제 완료`);

  await prisma.$disconnect();
  console.log("\n모든 문제 교체 완료!");
}

main().catch(console.error);
