/**
 * 파고다 끝토익 1000제 RC 분석 기반 신규 문제 추가 스크립트
 * - RC책의 문법/어휘/독해 패턴을 분석하여 완전 독창적 문제 생성
 * - 저작권 준수: 원문 복사 없음, 패턴만 참고하여 새 문제 작성
 */

import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

// ══════════════════════════════════════════════════════════════════
// PART 5 — 신규 25문제
// RC책 패턴: 품사 전환, 전치사, 접속사, 대명사, 어휘
// ══════════════════════════════════════════════════════════════════
const newPart5 = [
  {
    questionText: "The facility manager announced that all employees must _______ the new safety regulations by the end of the month.",
    optionA: "comply with", optionB: "complying to", optionC: "complied by", optionD: "compliance in",
    answer: "A", category: "어휘/전치사",
    explanation: "[comply with] 'comply with'는 '~을 준수하다'는 고정 표현입니다. ② complying to는 동사 자리에 -ing는 부적절하고 전치사도 틀렸습니다. ③ complied by는 수동 구조이며 문맥에 맞지 않습니다. ④ compliance는 명사로 동사 자리에 올 수 없습니다.",
  },
  {
    questionText: "The quarterly earnings report revealed a _______ increase in revenue compared to the same period last year.",
    optionA: "remarkable", optionB: "remarkably", optionC: "remark", optionD: "remarked",
    answer: "A", category: "품사",
    explanation: "[형용사] 관사 a와 명사 increase 사이에는 형용사(remarkable)가 필요합니다. ② remarkably는 부사로 명사를 수식할 수 없습니다. ③ remark는 동사/명사로 이 자리에 부적절합니다. ④ remarked는 과거형 동사입니다.",
  },
  {
    questionText: "Ms. Thornton has _______ more than fifteen years of experience in international trade law.",
    optionA: "accumulated", optionB: "accumulately", optionC: "accumulation", optionD: "accumulating",
    answer: "A", category: "어휘/동사형",
    explanation: "[현재완료 동사] has 뒤에는 과거분사(p.p.)가 옵니다. accumulated는 accumulate의 과거분사입니다. ② 부사 형태이며 잘못된 단어입니다. ③ accumulation은 명사입니다. ④ has + -ing는 현재진행 시제가 되어 의미가 다릅니다.",
  },
  {
    questionText: "The new branch will open its doors _______ completing a comprehensive renovation of the historic building.",
    optionA: "following", optionB: "followed", optionC: "follows", optionD: "follow",
    answer: "A", category: "전치사/분사",
    explanation: "[전치사 following] following은 '~에 뒤이어, ~후에'를 의미하는 전치사로, 뒤에 명사/동명사를 취합니다. ② followed는 동사의 과거형입니다. ③ follows는 3인칭 단수 현재형입니다. ④ follow는 동사원형입니다.",
  },
  {
    questionText: "All applications submitted _______ the posted deadline will not be considered for the position.",
    optionA: "after", optionB: "until", optionC: "since", optionD: "during",
    answer: "A", category: "전치사",
    explanation: "[after] '마감일 이후에 제출된 지원서는 고려되지 않는다'는 문맥이므로 after가 적절합니다. ② until은 '~까지'로 기간의 끝을 나타냅니다. ③ since는 '~이후로'이지만 현재완료와 함께 쓰입니다. ④ during은 '~하는 동안'입니다.",
  },
  {
    questionText: "The regional director praised the sales team for _______ their annual target three months ahead of schedule.",
    optionA: "exceeding", optionB: "exceeded", optionC: "to exceed", optionD: "excess",
    answer: "A", category: "동명사",
    explanation: "[전치사 for 뒤 동명사] for 뒤에는 동명사(-ing)가 옵니다. exceeding(초과하다)의 동명사입니다. ② exceeded는 과거형 동사입니다. ③ to exceed는 to부정사로 전치사 뒤에 올 수 없습니다. ④ excess는 명사입니다.",
  },
  {
    questionText: "_______ the software update has been installed, users will notice a significant improvement in processing speed.",
    optionA: "Once", optionB: "Despite", optionC: "Whereas", optionD: "Instead",
    answer: "A", category: "접속사",
    explanation: "[Once] Once는 '~하고 나면, 일단 ~하면'의 의미로 조건/시간 부사절을 이끄는 접속사입니다. ② Despite는 전치사로 뒤에 명사/동명사가 옵니다. ③ Whereas는 '반면에'로 대조를 나타냅니다. ④ Instead는 부사입니다.",
  },
  {
    questionText: "The marketing team's _______ use of social media platforms contributed to a 40% increase in brand awareness.",
    optionA: "strategic", optionB: "strategically", optionC: "strategy", optionD: "strategize",
    answer: "A", category: "품사",
    explanation: "[형용사] 관사 The와 명사 use 사이에서 명사를 수식하는 형용사(strategic)가 필요합니다. ② strategically는 부사입니다. ③ strategy는 명사이며 '전략'이라는 의미로 여기서는 어색합니다. ④ strategize는 동사입니다.",
  },
  {
    questionText: "The consultant recommended that the company _______ its pricing structure to remain competitive in the market.",
    optionA: "revise", optionB: "revised", optionC: "revising", optionD: "revision",
    answer: "A", category: "가정법/동사형",
    explanation: "[가정법 현재] recommend that + 주어 + 동사원형(should 생략 가능). 제안동사(recommend, suggest, require 등) 뒤에 오는 that절에서는 주어에 상관없이 동사원형을 씁니다. ② revised는 과거형입니다. ③ revising은 진행형입니다. ④ revision은 명사입니다.",
  },
  {
    questionText: "Mr. Nakamura is responsible for conducting the performance reviews _______ his entire department.",
    optionA: "for", optionB: "on", optionC: "by", optionD: "at",
    answer: "A", category: "전치사",
    explanation: "[for] '~을 위한(대상)'을 나타낼 때 for를 씁니다. 'conduct reviews for a department'는 '부서를 대상으로 리뷰를 진행하다'는 의미입니다. ② on은 주제나 접촉을 나타냅니다. ③ by는 수단이나 행위자를 나타냅니다. ④ at은 위치나 시간을 나타냅니다.",
  },
  {
    questionText: "The contract stipulates that neither the buyer _______ the seller may withdraw from the agreement without written notice.",
    optionA: "nor", optionB: "and", optionC: "or", optionD: "but",
    answer: "A", category: "상관 접속사",
    explanation: "[neither A nor B] 상관 접속사 neither는 반드시 nor와 짝을 이룹니다. 'neither A nor B'는 'A도 B도 ~아니다'의 의미입니다. ② and는 either와 함께 쓰입니다. ③ or는 either와 함께 쓰입니다. ④ but은 상관 접속사 neither와 함께 쓰이지 않습니다.",
  },
  {
    questionText: "Customers who order online will receive _______ products at their doorstep within three business days.",
    optionA: "their", optionB: "them", optionC: "they", optionD: "themselves",
    answer: "A", category: "대명사",
    explanation: "[소유격] 명사 products 앞에서 소유를 나타내는 소유격 their(그들의)가 필요합니다. ② them은 목적격입니다. ③ they는 주격입니다. ④ themselves는 재귀대명사입니다.",
  },
  {
    questionText: "The Hartwell Conference Center is _______ located near the city's main transportation hub.",
    optionA: "conveniently", optionB: "convenient", optionC: "convenience", optionD: "conveniences",
    answer: "A", category: "품사/부사",
    explanation: "[부사] 동사 located를 수식하려면 부사 conveniently(편리하게)가 필요합니다. ② convenient는 형용사입니다. ③④ convenience는 명사입니다.",
  },
  {
    questionText: "The newly _______ supervisor immediately began reorganizing the workflow to improve efficiency.",
    optionA: "appointed", optionB: "appointing", optionC: "appoint", optionD: "appointment",
    answer: "A", category: "분사",
    explanation: "[과거분사 형용사 수식] newly 뒤에 과거분사 appointed(임명된)가 supervisor를 수식합니다. ② appointing은 능동 분사로 '임명하는'이 되어 의미가 맞지 않습니다. ③ appoint는 동사원형입니다. ④ appointment는 명사입니다.",
  },
  {
    questionText: "Please note that our customer service office will be closed _______ the national public holiday next Monday.",
    optionA: "due to", optionB: "in spite of", optionC: "unless", optionD: "whether",
    answer: "A", category: "전치사구",
    explanation: "[due to] due to는 '~때문에'를 의미하는 전치사구로 뒤에 명사/명사구가 옵니다. ② in spite of는 '~에도 불구하고'로 반대되는 의미입니다. ③ unless는 접속사입니다. ④ whether는 접속사입니다.",
  },
  {
    questionText: "The researchers found that consumer behavior varies _______ depending on cultural backgrounds and income levels.",
    optionA: "considerably", optionB: "considerable", optionC: "consider", optionD: "consideration",
    answer: "A", category: "품사/부사",
    explanation: "[부사] 동사 varies를 수식하는 부사 considerably(상당히)가 적절합니다. ② considerable은 형용사입니다. ③ consider는 동사입니다. ④ consideration은 명사입니다.",
  },
  {
    questionText: "All staff members wishing to attend the leadership seminar should submit _______ applications by Thursday.",
    optionA: "their", optionB: "his", optionC: "its", optionD: "your",
    answer: "A", category: "대명사 일치",
    explanation: "[대명사 수 일치] all staff members(복수)를 받는 대명사는 복수형 their가 적절합니다. ② his는 남성 단수입니다. ③ its는 사물을 가리킵니다. ④ your는 2인칭으로 문맥에 맞지 않습니다.",
  },
  {
    questionText: "The renovation project was completed well _______ the initial deadline, which exceeded all expectations.",
    optionA: "ahead of", optionB: "in front of", optionC: "instead of", optionD: "in case of",
    answer: "A", category: "전치사구/어휘",
    explanation: "[ahead of] 'ahead of schedule/deadline'은 '기한보다 일찍'이라는 관용 표현입니다. ② in front of는 물리적인 위치('앞에')를 나타냅니다. ③ instead of는 '대신에'입니다. ④ in case of는 '~의 경우에'입니다.",
  },
  {
    questionText: "_______ applicants must complete a background check before being offered a permanent position.",
    optionA: "All", optionB: "Every", optionC: "Each", optionD: "Both",
    answer: "A", category: "한정사",
    explanation: "[All + 복수명사] All + 복수 명사는 집합 전체를 나타냅니다. ② Every + 단수 명사, ③ Each + 단수 명사 — 이 문장에서 applicants가 복수이므로 모두 부적절합니다. ④ Both는 정확히 두 명/개를 가리킬 때 사용합니다.",
  },
  {
    questionText: "The company's new headquarters will be equipped _______ state-of-the-art security systems.",
    optionA: "with", optionB: "by", optionC: "for", optionD: "at",
    answer: "A", category: "전치사",
    explanation: "[be equipped with] 'be equipped with'는 '~을 갖추다'는 고정 표현입니다. ② by는 행위자나 수단을 나타냅니다. ③ for는 목적이나 대상을 나타냅니다. ④ at은 장소나 시간을 나타냅니다.",
  },
  {
    questionText: "Ms. Bergstrom's presentation was so _______ that the board of directors immediately approved the proposal.",
    optionA: "persuasive", optionB: "persuasively", optionC: "persuasion", optionD: "persuade",
    answer: "A", category: "품사",
    explanation: "[so + 형용사] 'so + 형용사 + that'은 '너무 ~해서 …하다' 구조입니다. so 뒤에는 형용사 persuasive(설득력 있는)가 옵니다. ② persuasively는 부사입니다. ③ persuasion은 명사입니다. ④ persuade는 동사입니다.",
  },
  {
    questionText: "The logistics team is _______ in ensuring all shipments arrive within the guaranteed delivery window.",
    optionA: "instrumental", optionB: "instrumentally", optionC: "instrument", optionD: "instruct",
    answer: "A", category: "어휘",
    explanation: "[be instrumental in] 'be instrumental in + 동명사'는 '~에 중요한 역할을 하다'는 표현입니다. instrumental은 여기서 형용사로 사용됩니다. ② instrumentally는 부사입니다. ③ instrument는 명사입니다. ④ instruct는 완전히 다른 의미의 동사입니다.",
  },
  {
    questionText: "The vendor offered a 15 percent discount _______ the company placed an order for at least 500 units.",
    optionA: "provided that", optionB: "in spite of", optionC: "as a result", optionD: "prior to",
    answer: "A", category: "접속사구",
    explanation: "[provided that] provided that은 '~라는 조건 하에'를 의미하는 조건 접속사구입니다. ② in spite of는 '~에도 불구하고'로 의미가 반대입니다. ③ as a result는 부사구로 접속사 역할을 할 수 없습니다. ④ prior to는 전치사구입니다.",
  },
  {
    questionText: "The training manual should be read _______ before employees begin operating any of the new machinery.",
    optionA: "thoroughly", optionB: "thorough", optionC: "thoroughness", optionD: "thorough by",
    answer: "A", category: "품사/부사",
    explanation: "[부사 수식] 동사 read를 수식하는 부사 thoroughly(철저히)가 적절합니다. ② thorough는 형용사입니다. ③ thoroughness는 명사입니다. ④ thorough by는 잘못된 표현입니다.",
  },
  {
    questionText: "Employees _______ travel for business purposes are entitled to a daily meal allowance of $50.",
    optionA: "who", optionB: "whose", optionC: "which", optionD: "what",
    answer: "A", category: "관계대명사",
    explanation: "[주격 관계대명사 who] 사람(Employees)을 선행사로 받고 관계절에서 주어 역할을 하는 who가 적절합니다. ② whose는 소유격 관계대명사입니다. ③ which는 사물에 씁니다. ④ what은 선행사를 포함한 관계대명사로 여기에는 부적절합니다.",
  },
];

// ══════════════════════════════════════════════════════════════════
// PART 6 — 2개 지문 × 4문제 (신규)
// 패턴: 사내 공지(maintenance), 고객 이메일(service inquiry)
// ══════════════════════════════════════════════════════════════════

// ── PART 6 지문 1: 사내 이메일 (시스템 업그레이드 공지) ──────────
const p6passage1 = {
  passageText: `To: All Staff
From: IT Department
Subject: System Maintenance Update
Date: March 14

We would like to inform all employees that our company's internal network will undergo a scheduled upgrade this coming Saturday, from 10 P.M. to 6 A.M. Sunday. ___131___ all files and documents before Friday evening to avoid any potential data loss.

The upgrade is ___132___ to significantly improve network speed and security features across all departments. Staff members who need to access work-related files during the maintenance window are advised to download the necessary documents to their local drives beforehand.

Please be aware that e-mail services will be temporarily unavailable during this period. ___133___ Any urgent communications should be handled via mobile phone during this time.

___134___ We appreciate your understanding and cooperation in this matter.

The IT Department`,
  passageType: "email",
};

const p6q1 = [
  {
    questionText: "___131___",
    optionA: "Please back up", optionB: "Please backed up", optionC: "Please backing up", optionD: "Please to back up",
    answer: "A", category: "명령문/동사형",
    explanation: "[Please + 동사원형] 명령문에서 Please 뒤에는 동사원형(back up)이 옵니다. ② backed up은 과거형입니다. ③ backing up은 현재분사입니다. ④ to back up은 to부정사로 명령문에 쓸 수 없습니다.",
  },
  {
    questionText: "___132___",
    optionA: "expected", optionB: "expecting", optionC: "expectation", optionD: "expects",
    answer: "A", category: "품사",
    explanation: "[is expected] be + 과거분사 구조의 수동태입니다. 'is expected to + 동사원형'은 '~할 것으로 예상된다'는 표현입니다. ② expecting은 능동 진행형입니다. ③ expectation은 명사입니다. ④ expects는 3인칭 능동형입니다.",
  },
  {
    questionText: "___133___",
    optionA: "This includes access to the company intranet and shared drives.",
    optionB: "Employees are encouraged to work overtime during the upgrade.",
    optionC: "The IT team is currently hiring additional technicians.",
    optionD: "Please contact the IT department to install the new software.",
    answer: "A", category: "문맥상 적절한 문장",
    explanation: "[문맥 파악] 앞 문장에서 이메일 서비스가 일시적으로 사용 불가능하다고 했습니다. 이어서 그 범위를 구체화하는 (A) '인트라넷과 공유 드라이브 접속 포함'이 자연스럽게 이어집니다.",
  },
  {
    questionText: "___134___",
    optionA: "Should you have any questions, please do not hesitate to contact us.",
    optionB: "The system has been successfully upgraded as planned.",
    optionC: "We regret to inform you that the project has been canceled.",
    optionD: "All staff must complete the online safety training by next month.",
    answer: "A", category: "문맥상 적절한 문장",
    explanation: "[마무리 문장] 공지 이메일의 마지막 부분으로, 질문이 있으면 연락 달라는 (A)가 '감사드린다'는 마무리 문장 앞에 자연스럽게 위치합니다. 나머지는 문맥과 무관합니다.",
  },
];

// ── PART 6 지문 2: 비즈니스 레터 (행사 초청장) ───────────────────
const p6passage2 = {
  passageText: `May 3

Ms. Rachel Oduya
Director of Operations
Pinnacle Solutions Ltd.

Dear Ms. Oduya,

On behalf of the Westbridge Chamber of Commerce, I am writing to ___135___ you to our upcoming Annual Business Leadership Forum, scheduled for June 15–16 at the Riverside Convention Center.

This year's forum will feature keynote ___136___ from executives at leading companies across the region. Topics will include sustainable business practices, digital transformation, and talent management strategies.

As a valued member of our business community, we believe your ___137___ would be invaluable to our discussions. Attendance is complimentary for chamber members.

To reserve your seat, please visit our website at www.westbridgechamber.org/forum or contact our office at 555-8472. ___138___ We look forward to your participation.

Sincerely,

James Whitfield
Executive Director, Westbridge Chamber of Commerce`,
  passageType: "letter",
};

const p6q2 = [
  {
    questionText: "___135___",
    optionA: "invite", optionB: "invitation", optionC: "invited", optionD: "inviting",
    answer: "A", category: "동사형",
    explanation: "[to + 동사원형] 'to invite'는 to부정사 구조입니다. 'am writing to invite'는 '초청하기 위해 편지를 씁니다'의 의미입니다. ② invitation은 명사입니다. ③ invited는 과거분사입니다. ④ inviting은 현재분사입니다.",
  },
  {
    questionText: "___136___",
    optionA: "presentations", optionB: "present", optionC: "presentable", optionD: "presently",
    answer: "A", category: "품사",
    explanation: "[명사] 'feature keynote ___'에서 feature(특징으로 하다)의 목적어 자리에 명사가 필요합니다. presentations(발표들)이 적절합니다. ② present는 동사/형용사/명사이지만 문맥상 부적절합니다. ③ presentable은 형용사입니다. ④ presently는 부사입니다.",
  },
  {
    questionText: "___137___",
    optionA: "participation", optionB: "participate", optionC: "participatory", optionD: "participated",
    answer: "A", category: "품사",
    explanation: "[명사] 소유격 your 뒤에는 명사(participation: 참여)가 옵니다. ② participate는 동사입니다. ③ participatory는 형용사입니다. ④ participated는 과거형 동사입니다.",
  },
  {
    questionText: "___138___",
    optionA: "Registration closes on June 1, so we encourage you to sign up early.",
    optionB: "The forum will take place every year without exception.",
    optionC: "Our previous forum was attended by fewer participants than expected.",
    optionD: "Please note that all speakers must submit their presentations in advance.",
    answer: "A", category: "문맥상 적절한 문장",
    explanation: "[문맥 파악] 등록 방법을 안내한 직후에 마감일 알림과 조기 등록 권고가 이어지는 (A)가 가장 자연스럽습니다. 나머지는 초청 편지의 흐름과 맞지 않습니다.",
  },
];

// ══════════════════════════════════════════════════════════════════
// PART 7 — 신규 독해 지문 (단일 지문 3개 + 이중 지문 1세트)
// ══════════════════════════════════════════════════════════════════

// ── PART 7 단일지문 1: 웹페이지 공지 (주차 정책 변경) ─────────────
const p7single1 = {
  passageText: `Kingsley Office Park – Parking Policy Update

Effective September 1, Kingsley Office Park will be implementing a new parking management system to better serve all tenants. Key changes include the following:

• Assigned Parking: Each business unit will be allocated a set number of dedicated parking spaces based on office size. Assignments will be sent to all tenants by August 15.

• Visitor Parking: A designated visitor lot (Lot C) will be available for guest parking only. Tenants and their employees are not permitted to park in Lot C at any time.

• Parking Permits: All regular parkers must display a valid permit on their dashboard. Permits can be picked up at the property management office (Suite 102) starting August 20.

• After-Hours Parking: The parking structure will remain accessible 24 hours a day, 7 days a week. However, overnight parking (from 10 P.M. to 6 A.M.) requires prior approval from building management.

Tenants with questions or concerns are encouraged to contact the property management office at park@kingsleyofficepk.com.`,
  passageType: "notice",
};

const p7q_single1 = [
  {
    questionText: "What is the purpose of the announcement?",
    optionA: "To inform tenants about changes to a parking system",
    optionB: "To advertise available office spaces in the building",
    optionC: "To announce the opening of a new parking structure",
    optionD: "To request feedback from tenants about current facilities",
    answer: "A", category: "주제/목적",
    explanation: "첫 문장에서 'new parking management system'을 시행할 것을 알린다고 했습니다. 전체적으로 주차 시스템 변경 내용을 안내하는 공지입니다.",
  },
  {
    questionText: "According to the announcement, where can employees pick up their parking permits?",
    optionA: "At the property management office",
    optionB: "At the main entrance of the building",
    optionC: "By contacting the tenants directly",
    optionD: "Online through the company website",
    answer: "A", category: "세부사항",
    explanation: "'Permits can be picked up at the property management office (Suite 102)'라고 명시되어 있습니다.",
  },
  {
    questionText: "What restriction applies to overnight parking?",
    optionA: "It requires approval from building management.",
    optionB: "It is not permitted under any circumstances.",
    optionC: "It is available only to business owners.",
    optionD: "It must be arranged two weeks in advance.",
    answer: "A", category: "세부사항",
    explanation: "'overnight parking (from 10 P.M. to 6 A.M.) requires prior approval from building management'라고 명시되어 있습니다.",
  },
];

// ── PART 7 단일지문 2: 기사 (직원 복지 프로그램) ─────────────────
const p7single2 = {
  passageText: `Workplace Wellness Pays Off

A recent survey conducted by the Global Workforce Institute revealed that companies investing in employee wellness programs see an average 23 percent reduction in absenteeism and a 17 percent improvement in overall productivity. The findings are prompting many businesses to revisit their benefit offerings.

"We noticed a clear link between employee health and output," said Sandra Meyering, Human Resources Director at Calloway Manufacturing. "After launching our wellness initiative two years ago, which includes on-site fitness classes, mental health counseling, and flexible scheduling, our annual turnover rate dropped from 18 percent to just 9 percent."

The survey polled over 2,400 companies across 14 countries. Respondents indicated that nutrition workshops, stress management programs, and subsidized gym memberships were among the most popular offerings. Notably, remote employees were 35 percent less likely to participate in wellness programs than office-based workers, suggesting that companies need to develop virtual wellness solutions.

Industry analysts predict that the demand for comprehensive wellness packages will continue to grow as younger generations increasingly prioritize work-life balance when choosing an employer.`,
  passageType: "article",
};

const p7q_single2 = [
  {
    questionText: "What is the main topic of the article?",
    optionA: "The business benefits of employee wellness programs",
    optionB: "The challenges of managing remote workers",
    optionC: "The results of a government health initiative",
    optionD: "The growing cost of healthcare for employers",
    answer: "A", category: "주제",
    explanation: "첫 문단부터 직원 웰니스 프로그램 투자의 이점(결근율 감소, 생산성 향상)을 소개하며 전체 기사가 이를 다루고 있습니다.",
  },
  {
    questionText: "What happened at Calloway Manufacturing after launching its wellness initiative?",
    optionA: "Its employee turnover rate decreased significantly.",
    optionB: "It reduced its number of wellness programs.",
    optionC: "Its productivity dropped by 17 percent.",
    optionD: "Its HR department was restructured.",
    answer: "A", category: "세부사항",
    explanation: "'our annual turnover rate dropped from 18 percent to just 9 percent'라고 Sandra Meyering이 언급했습니다.",
  },
  {
    questionText: "What challenge related to remote employees is mentioned in the article?",
    optionA: "They are less likely to take part in wellness programs.",
    optionB: "They are more prone to workplace injuries.",
    optionC: "They tend to change jobs more frequently.",
    optionD: "They prefer in-office work over remote arrangements.",
    answer: "A", category: "세부사항",
    explanation: "'remote employees were 35 percent less likely to participate in wellness programs than office-based workers'라고 명시되어 있습니다.",
  },
  {
    questionText: "What does the article suggest about future trends?",
    optionA: "Demand for wellness benefits will keep increasing.",
    optionB: "Younger workers will prioritize higher salaries over wellness.",
    optionC: "Virtual wellness solutions have already become standard.",
    optionD: "The survey results will be revised after further research.",
    answer: "A", category: "추론",
    explanation: "'demand for comprehensive wellness packages will continue to grow'라고 마지막 단락에서 예측하고 있습니다.",
  },
];

// ── PART 7 단일지문 3: 온라인 채팅 (행사 준비) ──────────────────
const p7single3 = {
  passageText: `Online Chat Discussion

Laura Kim [10:14 A.M.]
Good morning, everyone. The vendor for tomorrow's product launch event just called. They're saying they can't deliver the display panels until 3 P.M. Our setup was scheduled for 10 A.M.

Marcus Lee [10:16 A.M.]
That's a problem. The press conference starts at 5 P.M. sharp. Do we have enough time to set everything up by then?

Laura Kim [10:18 A.M.]
It will be tight. I need to notify the AV team to adjust their schedule. Also, the catering company needs to know about the change.

Dana Ortega [10:20 A.M.]
I'll reach out to the caterers right away. They mentioned they were flexible on timing.

Marcus Lee [10:23 A.M.]
Good. Laura, should we also contact the venue manager? They might need to reschedule the room setup crew.

Laura Kim [10:25 A.M.]
Yes, please handle that, Marcus. I'll get the AV team sorted. Dana, once you've spoken to the caterers, can you send me a quick update?

Dana Ortega [10:27 A.M.]
Of course. I'll message you as soon as I have confirmation.`,
  passageType: "notice",
};

const p7q_single3 = [
  {
    questionText: "Why is the group having a discussion?",
    optionA: "A vendor notified them of a delayed delivery.",
    optionB: "A press conference was canceled at the last minute.",
    optionC: "The AV equipment was damaged during transport.",
    optionD: "The catering company changed their menu options.",
    answer: "A", category: "주제/목적",
    explanation: "Laura Kim의 첫 메시지에서 납품업체가 디스플레이 패널을 오후 3시에야 배달할 수 있다고 했다고 알립니다.",
  },
  {
    questionText: "What does Marcus Lee offer to do?",
    optionA: "Contact the venue manager",
    optionB: "Speak with the catering company",
    optionC: "Reschedule the press conference",
    optionD: "Call the display panel vendor",
    answer: "A", category: "세부사항",
    explanation: "10:25 A.M.에 Laura가 Marcus에게 'please handle that, Marcus'(= contact the venue manager)라고 부탁하고 Marcus는 이를 받아들입니다.",
  },
  {
    questionText: "At 10:27 A.M., what does Dana Ortega most likely mean when she writes, 'I'll message you as soon as I have confirmation'?",
    optionA: "She will update Laura after speaking with the caterers.",
    optionB: "She will contact the AV team on Laura's behalf.",
    optionC: "She will send an invitation to the press conference.",
    optionD: "She will confirm the delivery time with the vendor.",
    answer: "A", category: "화자 의도 파악",
    explanation: "Dana는 케이터링 업체에 연락한 후 Laura에게 결과를 알리겠다고 했습니다. Laura가 요청한 'quick update'에 대한 답변입니다.",
  },
];

// ── PART 7 이중지문: 웹페이지 + 이메일 (사진 서비스) ──────────────
const p7double1_passage1 = {
  passageText: `LensPerfect Photography Studio

Professional Photography for Every Occasion

At LensPerfect, we specialize in:
• Corporate headshots and team photos
• Product photography for e-commerce and advertising
• Event coverage (conferences, award ceremonies, company parties)
• Real estate and architectural photography

Our Packages:

STANDARD – $350
Up to 2 hours of shooting | 30 edited digital images | Online gallery for 60 days

PROFESSIONAL – $650
Up to 4 hours of shooting | 75 edited digital images | Online gallery for 90 days | Priority editing (delivered within 5 business days)

PREMIUM – $1,100
Full-day shooting (up to 8 hours) | Unlimited edited images | Online gallery for 12 months | Same-day preview | Dedicated photo editor

To book a session or request a custom quote, contact us at info@lensperfect.com or call 555-3140.

All sessions include a pre-shoot consultation at no additional charge.`,
  passageType: "advertisement",
};

const p7double1_passage2 = {
  passageText: `From: James Ellerton <j.ellerton@novatech-solutions.com>
To: info@lensperfect.com
Date: October 8
Subject: Photography Services Inquiry

Dear LensPerfect Team,

I am the marketing manager at NovaTech Solutions, and we are planning our annual company event on November 3. We would like to hire a professional photographer to cover the entire day, from the morning team-building activities starting at 9 A.M. through to the evening awards ceremony ending at approximately 7 P.M.

We require all images to be available to us for at least a year, and we would find it very helpful to see some preliminary shots on the day itself. Additionally, as we plan to use the photos for our company website and promotional materials, high-quality editing is essential.

Based on your website, I believe your top-tier package would best meet our needs. However, I was wondering if you could accommodate one additional request: we would like a dedicated editor who specializes in corporate event photography.

Please let me know if this is possible and whether you are available on November 3.

Best regards,
James Ellerton`,
  passageType: "email",
};

const p7q_double1 = [
  {
    questionText: "What type of photography service does LensPerfect NOT offer?",
    optionA: "Wedding photography",
    optionB: "Corporate team photos",
    optionC: "Product photography",
    optionD: "Event coverage",
    answer: "A", category: "NOT/TRUE",
    explanation: "웹페이지에 나열된 서비스는 Corporate headshots, Product photography, Event coverage, Real estate입니다. Wedding photography(웨딩 사진)는 언급되어 있지 않습니다.",
  },
  {
    questionText: "Which package is Mr. Ellerton most likely interested in?",
    optionA: "The Premium package",
    optionB: "The Professional package",
    optionC: "The Standard package",
    optionD: "A custom package not listed",
    answer: "A", category: "추론",
    explanation: "이메일에서 Mr. Ellerton은 '하루 종일 촬영(약 10시간)', '1년 이상 이미지 보관', '당일 미리보기'를 원한다고 했습니다. 이는 PREMIUM 패키지의 특징입니다. 또한 'your top-tier package'라고 직접 언급했습니다.",
  },
  {
    questionText: "What additional request does Mr. Ellerton make that is not listed in any package?",
    optionA: "A dedicated editor specializing in corporate events",
    optionB: "An extended online gallery period",
    optionC: "Same-day delivery of all edited photos",
    optionD: "A discounted rate for a large event",
    answer: "A", category: "세부사항",
    explanation: "Mr. Ellerton은 이메일 마지막 부분에서 'a dedicated editor who specializes in corporate event photography'를 요청했는데, 이는 패키지에 명시되지 않은 추가 요구사항입니다.",
  },
  {
    questionText: "What is implied about the pre-shoot consultation mentioned on the website?",
    optionA: "Customers do not pay extra for it.",
    optionB: "It is only available for the Premium package.",
    optionC: "It must be completed at least two weeks before the session.",
    optionD: "It takes place at the client's office or location.",
    answer: "A", category: "추론",
    explanation: "'All sessions include a pre-shoot consultation at no additional charge'라고 명시되어 있어 추가 비용 없음을 알 수 있습니다.",
  },
  {
    questionText: "What is the purpose of Mr. Ellerton's e-mail?",
    optionA: "To inquire about availability and a special request",
    optionB: "To confirm a booking made over the phone",
    optionC: "To request a refund for a previous session",
    optionD: "To apply for a job at LensPerfect",
    answer: "A", category: "주제/목적",
    explanation: "이메일은 11월 3일 예약 가능 여부를 묻고 ('Please let me know if ... you are available') 추가 요청 사항이 가능한지 질의하는 내용입니다.",
  },
];

// ══════════════════════════════════════════════════════════════════
// DB 삽입 함수
// ══════════════════════════════════════════════════════════════════
async function main() {
  console.log("📝 RC 책 분석 기반 신규 문제 추가 시작...\n");

  // ── Part 5 삽입 ──────────────────────────────────────────────
  let p5count = 0;
  for (const q of newPart5) {
    await prisma.question.create({
      data: {
        part: 5,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        answer: q.answer,
        explanation: q.explanation,
      },
    });
    p5count++;
  }
  console.log(`✅ Part 5 신규 ${p5count}문제 추가 완료`);

  // ── Part 6 지문 1 삽입 ───────────────────────────────────────
  const g1 = await prisma.questionGroup.create({
    data: {
      part: 6,
      passageText: p6passage1.passageText,
      passageType: p6passage1.passageType,
    },
  });
  for (const q of p6q1) {
    await prisma.question.create({
      data: {
        part: 6,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        answer: q.answer,
        explanation: q.explanation,
        groupId: g1.id,
      },
    });
  }
  console.log(`✅ Part 6 지문1 (사내 이메일) 4문제 추가 완료`);

  // ── Part 6 지문 2 삽입 ───────────────────────────────────────
  const g2 = await prisma.questionGroup.create({
    data: {
      part: 6,
      passageText: p6passage2.passageText,
      passageType: p6passage2.passageType,
    },
  });
  for (const q of p6q2) {
    await prisma.question.create({
      data: {
        part: 6,
        questionText: q.questionText,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD,
        answer: q.answer,
        explanation: q.explanation,
        groupId: g2.id,
      },
    });
  }
  console.log(`✅ Part 6 지문2 (초청 레터) 4문제 추가 완료`);

  // ── Part 7 단일지문 1 (주차 공지) ────────────────────────────
  const g3 = await prisma.questionGroup.create({
    data: { part: 7, passageText: p7single1.passageText, passageType: p7single1.passageType },
  });
  for (const q of p7q_single1) {
    await prisma.question.create({
      data: {
        part: 7, questionText: q.questionText,
        optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD,
        answer: q.answer, explanation: q.explanation, groupId: g3.id,
      },
    });
  }
  console.log(`✅ Part 7 단일지문1 (주차 공지) 3문제 추가 완료`);

  // ── Part 7 단일지문 2 (직원 웰니스 기사) ─────────────────────
  const g4 = await prisma.questionGroup.create({
    data: { part: 7, passageText: p7single2.passageText, passageType: p7single2.passageType },
  });
  for (const q of p7q_single2) {
    await prisma.question.create({
      data: {
        part: 7, questionText: q.questionText,
        optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD,
        answer: q.answer, explanation: q.explanation, groupId: g4.id,
      },
    });
  }
  console.log(`✅ Part 7 단일지문2 (웰니스 기사) 4문제 추가 완료`);

  // ── Part 7 단일지문 3 (온라인 채팅) ──────────────────────────
  const g5 = await prisma.questionGroup.create({
    data: { part: 7, passageText: p7single3.passageText, passageType: p7single3.passageType },
  });
  for (const q of p7q_single3) {
    await prisma.question.create({
      data: {
        part: 7, questionText: q.questionText,
        optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD,
        answer: q.answer, explanation: q.explanation, groupId: g5.id,
      },
    });
  }
  console.log(`✅ Part 7 단일지문3 (채팅 대화) 3문제 추가 완료`);

  // ── Part 7 이중지문 (사진 서비스) ────────────────────────────
  const g6a = await prisma.questionGroup.create({
    data: { part: 7, passageText: p7double1_passage1.passageText, passageType: "double passage" },
  });
  const g6b = await prisma.questionGroup.create({
    data: { part: 7, passageText: p7double1_passage2.passageText, passageType: "double passage" },
  });
  for (let i = 0; i < p7q_double1.length; i++) {
    const q = p7q_double1[i];
    const gId = i < 2 ? g6a.id : g6b.id;
    await prisma.question.create({
      data: {
        part: 7, questionText: q.questionText,
        optionA: q.optionA, optionB: q.optionB, optionC: q.optionC, optionD: q.optionD,
        answer: q.answer, explanation: q.explanation, groupId: gId,
      },
    });
  }
  console.log(`✅ Part 7 이중지문 (사진 스튜디오) 5문제 추가 완료`);

  // ── 최종 집계 ────────────────────────────────────────────────
  const c5 = await prisma.question.count({ where: { part: 5 } });
  const c6 = await prisma.question.count({ where: { part: 6 } });
  const c7 = await prisma.question.count({ where: { part: 7 } });

  console.log(`\n📊 최종 문제 현황`);
  console.log(`  Part 5: ${c5}개`);
  console.log(`  Part 6: ${c6}개`);
  console.log(`  Part 7: ${c7}개`);
  console.log(`  전체:   ${c5 + c6 + c7}개`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
