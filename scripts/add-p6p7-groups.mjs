/**
 * Part 6 & Part 7 신규 지문/문제 추가 (Part 5는 이미 추가됨)
 */
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── PART 6 지문 1: 사내 이메일 (시스템 업그레이드 공지) ──────────
  const g1 = await prisma.questionGroup.create({
    data: {
      part: 6,
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
      questions: {
        create: [
          {
            part: 6,
            questionText: "___131___",
            optionA: "Please back up", optionB: "Please backed up", optionC: "Please backing up", optionD: "Please to back up",
            answer: "A",
            explanation: "[Please + 동사원형] 명령문에서 Please 뒤에는 동사원형(back up)이 옵니다. ② backed up은 과거형입니다. ③ backing up은 현재분사입니다. ④ to back up은 to부정사로 명령문에 쓸 수 없습니다.",
          },
          {
            part: 6,
            questionText: "___132___",
            optionA: "expected", optionB: "expecting", optionC: "expectation", optionD: "expects",
            answer: "A",
            explanation: "[is expected] be + 과거분사 구조의 수동태입니다. 'is expected to + 동사원형'은 '~할 것으로 예상된다'는 표현입니다. ② expecting은 능동 진행형입니다. ③ expectation은 명사입니다. ④ expects는 3인칭 능동형입니다.",
          },
          {
            part: 6,
            questionText: "___133___",
            optionA: "This includes access to the company intranet and shared drives.",
            optionB: "Employees are encouraged to work overtime during the upgrade.",
            optionC: "The IT team is currently hiring additional technicians.",
            optionD: "Please contact the IT department to install the new software.",
            answer: "A",
            explanation: "[문맥 파악] 앞 문장에서 이메일 서비스가 일시적으로 사용 불가능하다고 했습니다. 이어서 그 범위를 구체화하는 (A) '인트라넷과 공유 드라이브 접속 포함'이 자연스럽게 이어집니다.",
          },
          {
            part: 6,
            questionText: "___134___",
            optionA: "Should you have any questions, please do not hesitate to contact us.",
            optionB: "The system has been successfully upgraded as planned.",
            optionC: "We regret to inform you that the project has been canceled.",
            optionD: "All staff must complete the online safety training by next month.",
            answer: "A",
            explanation: "[마무리 문장] 공지 이메일의 마지막 부분으로, 질문이 있으면 연락 달라는 (A)가 '감사드린다'는 마무리 문장 앞에 자연스럽게 위치합니다.",
          },
        ],
      },
    },
  });
  console.log(`✅ Part 6 지문1 (IT 공지 이메일) 4문제 추가`);

  // ── PART 6 지문 2: 비즈니스 레터 (행사 초청장) ───────────────────
  await prisma.questionGroup.create({
    data: {
      part: 6,
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
      questions: {
        create: [
          {
            part: 6,
            questionText: "___135___",
            optionA: "invite", optionB: "invitation", optionC: "invited", optionD: "inviting",
            answer: "A",
            explanation: "[to + 동사원형] 'am writing to invite'는 '초청하기 위해 편지를 씁니다'의 의미입니다. ② invitation은 명사입니다. ③ invited는 과거분사입니다. ④ inviting은 현재분사입니다.",
          },
          {
            part: 6,
            questionText: "___136___",
            optionA: "presentations", optionB: "present", optionC: "presentable", optionD: "presently",
            answer: "A",
            explanation: "[명사] 'feature keynote ___'에서 목적어 자리에 명사 presentations(발표들)이 적절합니다. ② present는 문맥상 부적절합니다. ③ presentable은 형용사입니다. ④ presently는 부사입니다.",
          },
          {
            part: 6,
            questionText: "___137___",
            optionA: "participation", optionB: "participate", optionC: "participatory", optionD: "participated",
            answer: "A",
            explanation: "[명사] 소유격 your 뒤에는 명사(participation: 참여)가 옵니다. ② participate는 동사입니다. ③ participatory는 형용사입니다. ④ participated는 과거형 동사입니다.",
          },
          {
            part: 6,
            questionText: "___138___",
            optionA: "Registration closes on June 1, so we encourage you to sign up early.",
            optionB: "The forum will take place every year without exception.",
            optionC: "Our previous forum was attended by fewer participants than expected.",
            optionD: "Please note that all speakers must submit their presentations in advance.",
            answer: "A",
            explanation: "[문맥 파악] 등록 방법을 안내한 직후에 마감일 알림과 조기 등록 권고가 이어지는 (A)가 가장 자연스럽습니다.",
          },
        ],
      },
    },
  });
  console.log(`✅ Part 6 지문2 (행사 초청 레터) 4문제 추가`);

  // ── PART 7 단일지문 1: 주차 정책 공지 ────────────────────────
  await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "notice",
      passageText: `Kingsley Office Park – Parking Policy Update

Effective September 1, Kingsley Office Park will be implementing a new parking management system to better serve all tenants. Key changes include the following:

• Assigned Parking: Each business unit will be allocated a set number of dedicated parking spaces based on office size. Assignments will be sent to all tenants by August 15.

• Visitor Parking: A designated visitor lot (Lot C) will be available for guest parking only. Tenants and their employees are not permitted to park in Lot C at any time.

• Parking Permits: All regular parkers must display a valid permit on their dashboard. Permits can be picked up at the property management office (Suite 102) starting August 20.

• After-Hours Parking: The parking structure will remain accessible 24 hours a day, 7 days a week. However, overnight parking (from 10 P.M. to 6 A.M.) requires prior approval from building management.

Tenants with questions or concerns are encouraged to contact the property management office at park@kingsleyofficepk.com.`,
      questions: {
        create: [
          {
            part: 7,
            questionText: "What is the purpose of the announcement?",
            optionA: "To inform tenants about changes to a parking system",
            optionB: "To advertise available office spaces in the building",
            optionC: "To announce the opening of a new parking structure",
            optionD: "To request feedback from tenants about current facilities",
            answer: "A",
            explanation: "첫 문장에서 'new parking management system'을 시행할 것을 알린다고 했습니다. 전체적으로 주차 시스템 변경 내용을 안내하는 공지입니다.",
          },
          {
            part: 7,
            questionText: "According to the announcement, where can employees pick up their parking permits?",
            optionA: "At the property management office",
            optionB: "At the main entrance of the building",
            optionC: "By contacting the tenants directly",
            optionD: "Online through the company website",
            answer: "A",
            explanation: "'Permits can be picked up at the property management office (Suite 102)'라고 명시되어 있습니다.",
          },
          {
            part: 7,
            questionText: "What restriction applies to overnight parking?",
            optionA: "It requires approval from building management.",
            optionB: "It is not permitted under any circumstances.",
            optionC: "It is available only to business owners.",
            optionD: "It must be arranged two weeks in advance.",
            answer: "A",
            explanation: "'overnight parking (from 10 P.M. to 6 A.M.) requires prior approval from building management'라고 명시되어 있습니다.",
          },
        ],
      },
    },
  });
  console.log(`✅ Part 7 단일지문1 (주차 공지) 3문제 추가`);

  // ── PART 7 단일지문 2: 직원 웰니스 기사 ─────────────────────
  await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "article",
      passageText: `Workplace Wellness Pays Off

A recent survey conducted by the Global Workforce Institute revealed that companies investing in employee wellness programs see an average 23 percent reduction in absenteeism and a 17 percent improvement in overall productivity. The findings are prompting many businesses to revisit their benefit offerings.

"We noticed a clear link between employee health and output," said Sandra Meyering, Human Resources Director at Calloway Manufacturing. "After launching our wellness initiative two years ago, which includes on-site fitness classes, mental health counseling, and flexible scheduling, our annual turnover rate dropped from 18 percent to just 9 percent."

The survey polled over 2,400 companies across 14 countries. Respondents indicated that nutrition workshops, stress management programs, and subsidized gym memberships were among the most popular offerings. Notably, remote employees were 35 percent less likely to participate in wellness programs than office-based workers, suggesting that companies need to develop virtual wellness solutions.

Industry analysts predict that the demand for comprehensive wellness packages will continue to grow as younger generations increasingly prioritize work-life balance when choosing an employer.`,
      questions: {
        create: [
          {
            part: 7,
            questionText: "What is the main topic of the article?",
            optionA: "The business benefits of employee wellness programs",
            optionB: "The challenges of managing remote workers",
            optionC: "The results of a government health initiative",
            optionD: "The growing cost of healthcare for employers",
            answer: "A",
            explanation: "첫 문단부터 직원 웰니스 프로그램 투자의 이점(결근율 감소, 생산성 향상)을 소개하며 전체 기사가 이를 다루고 있습니다.",
          },
          {
            part: 7,
            questionText: "What happened at Calloway Manufacturing after launching its wellness initiative?",
            optionA: "Its employee turnover rate decreased significantly.",
            optionB: "It reduced its number of wellness programs.",
            optionC: "Its productivity dropped by 17 percent.",
            optionD: "Its HR department was restructured.",
            answer: "A",
            explanation: "'our annual turnover rate dropped from 18 percent to just 9 percent'라고 Sandra Meyering이 언급했습니다.",
          },
          {
            part: 7,
            questionText: "What challenge related to remote employees is mentioned in the article?",
            optionA: "They are less likely to take part in wellness programs.",
            optionB: "They are more prone to workplace injuries.",
            optionC: "They tend to change jobs more frequently.",
            optionD: "They prefer in-office work over remote arrangements.",
            answer: "A",
            explanation: "'remote employees were 35 percent less likely to participate in wellness programs than office-based workers'라고 명시되어 있습니다.",
          },
          {
            part: 7,
            questionText: "What does the article suggest about future trends?",
            optionA: "Demand for wellness benefits will keep increasing.",
            optionB: "Younger workers will prioritize higher salaries over wellness.",
            optionC: "Virtual wellness solutions have already become standard.",
            optionD: "The survey results will be revised after further research.",
            answer: "A",
            explanation: "'demand for comprehensive wellness packages will continue to grow'라고 마지막 단락에서 예측하고 있습니다.",
          },
        ],
      },
    },
  });
  console.log(`✅ Part 7 단일지문2 (웰니스 기사) 4문제 추가`);

  // ── PART 7 단일지문 3: 온라인 채팅 ──────────────────────────
  await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "notice",
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
      questions: {
        create: [
          {
            part: 7,
            questionText: "Why is the group having a discussion?",
            optionA: "A vendor notified them of a delayed delivery.",
            optionB: "A press conference was canceled at the last minute.",
            optionC: "The AV equipment was damaged during transport.",
            optionD: "The catering company changed their menu options.",
            answer: "A",
            explanation: "Laura Kim의 첫 메시지에서 납품업체가 디스플레이 패널을 오후 3시에야 배달할 수 있다고 알립니다.",
          },
          {
            part: 7,
            questionText: "What will Marcus Lee most likely do next?",
            optionA: "Contact the venue manager",
            optionB: "Speak with the catering company",
            optionC: "Reschedule the press conference",
            optionD: "Call the display panel vendor",
            answer: "A",
            explanation: "10:25 A.M.에 Laura가 Marcus에게 'please handle that'(= contact the venue manager)라고 부탁했습니다.",
          },
          {
            part: 7,
            questionText: "At 10:27 A.M., what does Dana Ortega most likely mean when she writes, 'I'll message you as soon as I have confirmation'?",
            optionA: "She will update Laura after speaking with the caterers.",
            optionB: "She will contact the AV team on Laura's behalf.",
            optionC: "She will send an invitation to the press conference.",
            optionD: "She will confirm the delivery time with the vendor.",
            answer: "A",
            explanation: "Dana는 케이터링 업체에 연락한 후 Laura에게 결과를 알리겠다고 했습니다. Laura가 요청한 'quick update'에 대한 답변입니다.",
          },
        ],
      },
    },
  });
  console.log(`✅ Part 7 단일지문3 (채팅 대화) 3문제 추가`);

  // ── PART 7 이중지문: 사진 스튜디오 웹페이지 + 고객 이메일 ─────
  const g6a = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "double passage",
      passageText: `LensPerfect Photography Studio – Services & Packages

At LensPerfect, we specialize in:
• Corporate headshots and team photos
• Product photography for e-commerce and advertising
• Event coverage (conferences, award ceremonies, company parties)
• Real estate and architectural photography

STANDARD – $350
Up to 2 hours of shooting | 30 edited digital images | Online gallery for 60 days

PROFESSIONAL – $650
Up to 4 hours of shooting | 75 edited digital images | Online gallery for 90 days | Priority editing (delivered within 5 business days)

PREMIUM – $1,100
Full-day shooting (up to 8 hours) | Unlimited edited images | Online gallery for 12 months | Same-day preview | Dedicated photo editor

All sessions include a pre-shoot consultation at no additional charge.
Contact: info@lensperfect.com | 555-3140`,
    },
  });

  const g6b = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "double passage",
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
    },
  });

  const doubleQs = [
    {
      part: 7,
      questionText: "What type of photography service does LensPerfect NOT offer?",
      optionA: "Wedding photography", optionB: "Corporate team photos",
      optionC: "Product photography", optionD: "Event coverage",
      answer: "A",
      explanation: "웹페이지에 나열된 서비스는 Corporate headshots, Product photography, Event coverage, Real estate입니다. Wedding photography(웨딩 사진)는 언급되어 있지 않습니다.",
      groupId: g6a.id,
    },
    {
      part: 7,
      questionText: "Which package is Mr. Ellerton most likely interested in?",
      optionA: "The Premium package", optionB: "The Professional package",
      optionC: "The Standard package", optionD: "A custom package not listed",
      answer: "A",
      explanation: "이메일에서 Mr. Ellerton은 하루 종일 촬영, 1년 이상 이미지 보관, 당일 미리보기를 원하며 'your top-tier package'라고 직접 언급했습니다. 이는 PREMIUM 패키지입니다.",
      groupId: g6a.id,
    },
    {
      part: 7,
      questionText: "What additional request does Mr. Ellerton make that is not listed in any package?",
      optionA: "A dedicated editor specializing in corporate events",
      optionB: "An extended online gallery period",
      optionC: "Same-day delivery of all edited photos",
      optionD: "A discounted rate for a large event",
      answer: "A",
      explanation: "Mr. Ellerton은 'a dedicated editor who specializes in corporate event photography'를 요청했는데, 이는 패키지에 명시되지 않은 추가 요구사항입니다.",
      groupId: g6b.id,
    },
    {
      part: 7,
      questionText: "What is implied about the pre-shoot consultation?",
      optionA: "Customers do not pay extra for it.",
      optionB: "It is only available for the Premium package.",
      optionC: "It must be completed at least two weeks in advance.",
      optionD: "It takes place at the client's office or location.",
      answer: "A",
      explanation: "'All sessions include a pre-shoot consultation at no additional charge'라고 명시되어 있어 추가 비용이 없음을 알 수 있습니다.",
      groupId: g6b.id,
    },
    {
      part: 7,
      questionText: "What is the purpose of Mr. Ellerton's e-mail?",
      optionA: "To inquire about availability and a special request",
      optionB: "To confirm a booking made over the phone",
      optionC: "To request a refund for a previous session",
      optionD: "To apply for a job at LensPerfect",
      answer: "A",
      explanation: "이메일은 11월 3일 예약 가능 여부를 묻고 추가 요청 사항이 가능한지 질의하는 내용입니다.",
      groupId: g6b.id,
    },
  ];

  for (const q of doubleQs) {
    await prisma.question.create({ data: q });
  }
  console.log(`✅ Part 7 이중지문 (사진 스튜디오) 5문제 추가`);

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
