import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

function shuffleOptions(q) {
  const opts = [
    { key: "A", text: q.optionA },
    { key: "B", text: q.optionB },
    { key: "C", text: q.optionC },
    { key: "D", text: q.optionD },
  ];
  const correctText = opts.find(o => o.key === q.answer)?.text;
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  const newIdx = opts.findIndex(o => o.text === correctText);
  return {
    ...q,
    optionA: opts[0].text, optionB: opts[1].text,
    optionC: opts[2].text, optionD: opts[3].text,
    answer: ["A", "B", "C", "D"][newIdx],
  };
}

// ─── Part 7 그룹 8: 공지/안내문 (3문제) ────────────────────────────────────
const p7g8 = {
  part: 7,
  passageType: "notice",
  passageText: `NOTICE TO ALL RESIDENTS

Beginning next Monday, the building management will conduct annual inspections of all units in Tower A and Tower B. Inspections will take place between 9:00 A.M. and 5:00 P.M. daily. A building inspector and one maintenance staff member will visit each unit.

Residents are asked to ensure that all smoke detectors and carbon monoxide alarms are accessible. Any appliances requiring repair should be noted on the maintenance request form available at the front desk.

Residents who are unable to be present during the scheduled inspection may arrange an alternative time by contacting the building management office no later than this Friday. Please call 555-0192 or email management@towerresidences.com.`,
  questions: [
    shuffleOptions({
      questionText: "What is the purpose of the notice?",
      optionA: "To announce a change in building management",
      optionB: "To inform residents about upcoming unit inspections",
      optionC: "To request residents to pay maintenance fees",
      optionD: "To introduce new building security policies",
      answer: "B",
      explanation: "The notice says 'the building management will conduct annual inspections of all units,' so the purpose is to inform about upcoming inspections.",
    }),
    shuffleOptions({
      questionText: "What are residents asked to do before the inspection?",
      optionA: "Submit a written request to the management office",
      optionB: "Remove all personal items from hallways",
      optionC: "Make smoke detectors and alarms accessible",
      optionD: "Repair all faulty appliances themselves",
      answer: "C",
      explanation: "'Residents are asked to ensure that all smoke detectors and carbon monoxide alarms are accessible.'",
    }),
    shuffleOptions({
      questionText: "By what date must residents contact the office to reschedule?",
      optionA: "Next Monday",
      optionB: "This Friday",
      optionC: "The following Wednesday",
      optionD: "The end of the month",
      answer: "B",
      explanation: "'contacting the building management office no later than this Friday.'",
    }),
  ],
};

// ─── Part 7 그룹 9: 이메일 (3문제) ─────────────────────────────────────────
const p7g9 = {
  part: 7,
  passageType: "email",
  passageText: `From: Patricia Holt <p.holt@vertexsupplies.com>
To: Daniel Kwon <d.kwon@vertexsupplies.com>
Subject: Product Launch Meeting — Agenda Update
Date: Thursday, June 12

Hi Daniel,

I wanted to reach out regarding the product launch meeting scheduled for next Tuesday at 2:00 P.M. in Conference Room B.

I have added two items to the agenda. First, we will review the updated packaging designs submitted by the design team. Second, the logistics coordinator, Ms. Torres, will present the revised shipping timeline for the eastern region.

Please note that the finance team will not be joining us this time, as they have a prior commitment. However, their budget approval report has been shared via the company portal, and all participants are encouraged to review it before the meeting.

Let me know if you have any questions.

Best regards,
Patricia Holt
Senior Product Manager`,
  questions: [
    shuffleOptions({
      questionText: "What is the main purpose of the email?",
      optionA: "To reschedule a product launch meeting",
      optionB: "To update the agenda for an upcoming meeting",
      optionC: "To introduce a new logistics coordinator",
      optionD: "To request budget approval from the finance team",
      answer: "B",
      explanation: "Patricia writes 'I have added two items to the agenda,' indicating the purpose is to update the meeting agenda.",
    }),
    shuffleOptions({
      questionText: "Who will present at the meeting?",
      optionA: "Patricia Holt",
      optionB: "The finance team",
      optionC: "Ms. Torres",
      optionD: "The design team",
      answer: "C",
      explanation: "'the logistics coordinator, Ms. Torres, will present the revised shipping timeline.'",
    }),
    shuffleOptions({
      questionText: "Why will the finance team NOT attend the meeting?",
      optionA: "They are presenting at a different conference",
      optionB: "They have a prior commitment",
      optionC: "Their report has not been completed",
      optionD: "They were not invited this time",
      answer: "B",
      explanation: "'the finance team will not be joining us this time, as they have a prior commitment.'",
    }),
  ],
};

// ─── Part 7 그룹 10: 기사 (4문제) ───────────────────────────────────────────
const p7g10 = {
  part: 7,
  passageType: "article",
  passageText: `LOCAL BUSINESS NEWS

Greenfield Organics Expands to New Market

HARTVILLE — Greenfield Organics, a locally owned grocery chain specializing in organic and natural products, announced on Wednesday that it will open three new locations in the Hartville metropolitan area by the end of the year. The company currently operates eleven stores throughout the state.

Founder and CEO Angela Marsh stated that the expansion was driven by increased consumer demand for healthier food options. "We have seen a remarkable shift in buying habits over the past two years," said Marsh. "Customers are more aware of what they put in their bodies, and we want to be accessible to as many of them as possible."

The new locations will be situated in the Riverside, Northgate, and Lakewood neighborhoods. Construction on the Riverside location has already begun, with an expected opening date in September. The other two stores are projected to open in November and December, respectively.

The company also confirmed plans to expand its online delivery service, which currently covers only the downtown area, to serve all neighborhoods where its stores are located.`,
  questions: [
    shuffleOptions({
      questionText: "What is the article mainly about?",
      optionA: "A grocery chain's plans to open new stores",
      optionB: "Rising food prices in the Hartville area",
      optionC: "A new organic farming initiative",
      optionD: "Changes in consumer food safety regulations",
      answer: "A",
      explanation: "The article focuses on Greenfield Organics announcing three new store locations in the Hartville metropolitan area.",
    }),
    shuffleOptions({
      questionText: "According to Angela Marsh, what drove the expansion?",
      optionA: "Lower real estate costs in suburban areas",
      optionB: "Increased consumer demand for healthier food",
      optionC: "Competition from larger grocery chains",
      optionD: "Government incentives for organic businesses",
      answer: "B",
      explanation: "Marsh states the expansion was driven by 'increased consumer demand for healthier food options.'",
    }),
    shuffleOptions({
      questionText: "Which new location will open first?",
      optionA: "Northgate",
      optionB: "Lakewood",
      optionC: "Riverside",
      optionD: "Downtown",
      answer: "C",
      explanation: "'Construction on the Riverside location has already begun, with an expected opening date in September,' which is earlier than the other two.",
    }),
    shuffleOptions({
      questionText: "What does the company plan to expand in addition to store locations?",
      optionA: "Its range of imported organic products",
      optionB: "Its employee training program",
      optionC: "Its online delivery service",
      optionD: "Its supplier network",
      answer: "C",
      explanation: "'The company also confirmed plans to expand its online delivery service.'",
    }),
  ],
};

// ─── Part 7 그룹 11: 이중 지문 — 광고 + 이메일 (5문제) ────────────────────
const p7g11 = {
  part: 7,
  passageType: "double",
  passageText: `[Advertisement]

SUMMIT PROFESSIONAL TRAINING CENTER
Upcoming Workshops — Register Today!

• Business Writing for Professionals (June 24, 9 A.M.–1 P.M.) — $120
• Advanced Excel for Data Analysis (June 25, 10 A.M.–4 P.M.) — $160
• Leadership and Team Communication (July 3, 9 A.M.–5 P.M.) — $200

All workshops are held at our downtown facility at 88 Commerce Street, Suite 400.
Group discounts available for 3 or more participants from the same organization.
Early registration by June 15 qualifies for a 10% discount on any workshop.
To register, visit www.summittraining.com or call 555-0147.

─────────────────────────────────────────

From: James Pelton <j.pelton@cranfordtech.com>
To: Hannah Soo <h.soo@cranfordtech.com>
Subject: Training Registration
Date: June 13

Hannah,

I came across the Summit training schedule and I think we should send a few team members. I'm particularly interested in the Excel workshop and the leadership one. Four of us from the analytics team would attend the Excel session, and two managers would join the leadership workshop.

Since we're registering before the deadline, we should get the early discount. Also, with four people attending Excel, we'd qualify for the group rate on that one too — I wonder if both discounts can be applied at the same time.

Can you handle the registration? Let me know if you need anything from me.

James`,
  questions: [
    shuffleOptions({
      questionText: "What is indicated about all workshops?",
      optionA: "They are held on weekends only",
      optionB: "They take place at the same downtown location",
      optionC: "They include online participation options",
      optionD: "They require prior industry experience",
      answer: "B",
      explanation: "'All workshops are held at our downtown facility at 88 Commerce Street, Suite 400.'",
    }),
    shuffleOptions({
      questionText: "By what date must registration occur to receive a discount?",
      optionA: "June 24",
      optionB: "June 25",
      optionC: "June 15",
      optionD: "July 3",
      answer: "C",
      explanation: "'Early registration by June 15 qualifies for a 10% discount on any workshop.'",
    }),
    shuffleOptions({
      questionText: "Which workshops does James want to register for?",
      optionA: "Business Writing and Advanced Excel",
      optionB: "Advanced Excel and Leadership",
      optionC: "Business Writing and Leadership",
      optionD: "All three workshops",
      answer: "B",
      explanation: "James says 'I'm particularly interested in the Excel workshop and the leadership one.'",
    }),
    shuffleOptions({
      questionText: "Why would the analytics team qualify for a group discount?",
      optionA: "They are registering for multiple workshops",
      optionB: "They are a non-profit organization",
      optionC: "Four members are attending the same session",
      optionD: "They registered more than a month in advance",
      answer: "C",
      explanation: "The ad says group discounts apply for '3 or more participants from the same organization,' and four analytics team members are attending the Excel session.",
    }),
    shuffleOptions({
      questionText: "What does James ask Hannah to do?",
      optionA: "Negotiate a lower price with the training center",
      optionB: "Handle the workshop registration",
      optionC: "Confirm the number of participants",
      optionD: "Review the training materials in advance",
      answer: "B",
      explanation: "'Can you handle the registration?' — James asks Hannah to take care of registering.",
    }),
  ],
};

// ─── Part 7 그룹 12: 편지/메모 (3문제) ─────────────────────────────────────
const p7g12 = {
  part: 7,
  passageType: "memo",
  passageText: `MEMORANDUM

To: All Department Heads
From: Sandra Okafor, Director of Human Resources
Date: June 10
Re: Updated Remote Work Policy

Please share the following information with your teams.

Effective July 1, the company will update its remote work policy. Employees who have been with the company for at least one year and whose roles are classified as "eligible" may work remotely up to three days per week. Roles that require regular in-person client interaction or physical access to company equipment remain ineligible for remote arrangements.

Eligible employees wishing to participate must submit a Remote Work Agreement form to their direct manager by June 25. Managers should review and approve or decline requests by June 30 and forward approved agreements to the HR department.

Please contact the HR department at hr@companydomain.com if you have any questions regarding role eligibility or the application process.`,
  questions: [
    shuffleOptions({
      questionText: "What is the memo about?",
      optionA: "A new employee benefits package",
      optionB: "An updated remote work policy",
      optionC: "Changes to the company's hiring process",
      optionD: "A schedule for department meetings",
      answer: "B",
      explanation: "The Re: line and content both indicate this is about the updated remote work policy.",
    }),
    shuffleOptions({
      questionText: "Who is eligible to work remotely?",
      optionA: "All full-time employees regardless of role",
      optionB: "Employees with more than five years of experience",
      optionC: "Employees employed for at least one year in eligible roles",
      optionD: "Employees who live more than 30 miles from the office",
      answer: "C",
      explanation: "'Employees who have been with the company for at least one year and whose roles are classified as eligible may work remotely.'",
    }),
    shuffleOptions({
      questionText: "What must eligible employees do by June 25?",
      optionA: "Attend a remote work orientation session",
      optionB: "Submit a Remote Work Agreement form to their manager",
      optionC: "Notify the HR department of their preferred work schedule",
      optionD: "Complete an online training course",
      answer: "B",
      explanation: "'Eligible employees wishing to participate must submit a Remote Work Agreement form to their direct manager by June 25.'",
    }),
  ],
};

// ─── Part 7 그룹 13: 온라인 리뷰 (3문제) ────────────────────────────────────
const p7g13 = {
  part: 7,
  passageType: "review",
  passageText: `★★★★☆  4/5 stars
Reviewed by: Marcus T.
Product: UltraComfort Pro Ergonomic Chair

I purchased this chair three months ago after experiencing lower back discomfort from long hours at my desk. Overall, I am very satisfied with the product.

The lumbar support is excellent and the seat cushion remains firm even after extended use. The armrests are fully adjustable, which I found particularly useful since I often switch between typing and drawing on a tablet.

My only complaint is the assembly process. The instructions provided were unclear, and it took me nearly two hours to complete what should have been a straightforward setup. I had to watch an online tutorial before I could figure out how to attach the headrest.

Despite this initial frustration, the chair has performed exactly as advertised, and I would recommend it to anyone looking for a high-quality ergonomic solution for their home office.`,
  questions: [
    shuffleOptions({
      questionText: "Why did Marcus purchase the chair?",
      optionA: "His previous chair was damaged",
      optionB: "He needed a chair for a new home office",
      optionC: "He was experiencing back discomfort",
      optionD: "His employer recommended the product",
      answer: "C",
      explanation: "Marcus says he purchased the chair 'after experiencing lower back discomfort from long hours at my desk.'",
    }),
    shuffleOptions({
      questionText: "What does Marcus say was a problem?",
      optionA: "The seat cushion lost its shape quickly",
      optionB: "The armrests were not adjustable",
      optionC: "The assembly instructions were unclear",
      optionD: "The chair was too expensive",
      answer: "C",
      explanation: "'My only complaint is the assembly process. The instructions provided were unclear.'",
    }),
    shuffleOptions({
      questionText: "What is Marcus's overall opinion of the chair?",
      optionA: "He regrets the purchase and wants a refund",
      optionB: "He would recommend it despite the assembly issue",
      optionC: "He plans to return it for a different model",
      optionD: "He thinks it is overpriced for its quality",
      answer: "B",
      explanation: "'I would recommend it to anyone looking for a high-quality ergonomic solution,' showing he recommends it despite the assembly frustration.",
    }),
  ],
};

async function main() {
  const groups = [p7g8, p7g9, p7g10, p7g11, p7g12, p7g13];

  for (const g of groups) {
    const group = await prisma.questionGroup.create({
      data: {
        part: g.part,
        passageType: g.passageType,
        passageText: g.passageText,
      },
    });

    for (const q of g.questions) {
      await prisma.question.create({
        data: {
          part: g.part,
          groupId: group.id,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          answer: q.answer,
          explanation: q.explanation,
        },
      });
    }
    console.log(`✅ Part 7 그룹(${g.passageType}) 완료 — ${g.questions.length}문제`);
  }

  const total = await prisma.question.count();
  const p7total = await prisma.question.count({ where: { part: 7 } });
  console.log(`\n🎉 3차 배치 완료! Part7 총 ${p7total}문제 / 전체 ${total}문제`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
