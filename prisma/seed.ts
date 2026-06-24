import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbUrl = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), "dev.db")}`;
const adapter = new PrismaBetterSQLite3({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  // 관리자 계정
  const adminPassword = await bcrypt.hash("yeosintoeic", 10);
  await prisma.user.upsert({
    where: { email: "yeosintoeic@yeosintoeic.com" },
    update: { password: adminPassword },
    create: { email: "yeosintoeic@yeosintoeic.com", password: adminPassword, name: "관리자", role: "ADMIN" },
  });

  // 샘플 수강생
  const studentPassword = await bcrypt.hash("student1234", 10);
  await prisma.user.upsert({
    where: { email: "student@toeic.com" },
    update: {},
    create: { email: "student@toeic.com", password: studentPassword, name: "홍길동", role: "STUDENT" },
  });

  // Part 5 샘플 문제 (10개)
  const part5Questions = [
    { questionText: "The marketing team ------- a new strategy to attract younger customers.", optionA: "develops", optionB: "developed", optionC: "will develop", optionD: "is developing", answer: "D", category: "verb tense" },
    { questionText: "All employees are required to submit ------- reports by Friday.", optionA: "they", optionB: "their", optionC: "them", optionD: "theirs", answer: "B", category: "pronoun" },
    { questionText: "The conference will be held ------- the Grand Hotel downtown.", optionA: "at", optionB: "on", optionC: "in", optionD: "by", answer: "A", category: "preposition" },
    { questionText: "Mr. Kim was ------- impressed by the new employee's performance.", optionA: "particular", optionB: "particularly", optionC: "particulars", optionD: "particularize", answer: "B", category: "part of speech" },
    { questionText: "The project deadline has been extended ------- a week.", optionA: "for", optionB: "since", optionC: "during", optionD: "while", answer: "A", category: "preposition" },
    { questionText: "Applicants ------- submit their resumes before the deadline will not be considered.", optionA: "who do not", optionB: "which not", optionC: "whose not", optionD: "whom not", answer: "A", category: "relative clause" },
    { questionText: "The new software update has ------- the efficiency of our operations significantly.", optionA: "improve", optionB: "improved", optionC: "improving", optionD: "improvement", answer: "B", category: "verb form" },
    { questionText: "Please make sure the documents are signed ------- you leave the office.", optionA: "although", optionB: "before", optionC: "unless", optionD: "despite", answer: "B", category: "conjunction" },
    { questionText: "The company offers ------- benefits to full-time employees.", optionA: "compete", optionB: "competition", optionC: "competitive", optionD: "competitively", answer: "C", category: "part of speech" },
    { questionText: "------- the heavy traffic, we managed to arrive at the meeting on time.", optionA: "Even though", optionB: "Despite", optionC: "However", optionD: "Nevertheless", answer: "B", category: "conjunction" },
    { questionText: "The new policy will take ------- starting from next month.", optionA: "effect", optionB: "affect", optionC: "effective", optionD: "effectively", answer: "A", category: "vocabulary" },
    { questionText: "Customers who purchase items ------- the amount of $100 will receive free shipping.", optionA: "exceed", optionB: "exceeding", optionC: "exceeded", optionD: "exceeds", answer: "B", category: "participle" },
    { questionText: "The annual report will be ------- to all shareholders next week.", optionA: "distribute", optionB: "distributing", optionC: "distributed", optionD: "distribution", answer: "C", category: "verb form" },
    { questionText: "Ms. Park has been working at this company ------- ten years.", optionA: "since", optionB: "for", optionC: "during", optionD: "by", answer: "B", category: "preposition" },
    { questionText: "The renovation of the building is ------- scheduled to be completed by December.", optionA: "current", optionB: "currency", optionC: "currently", optionD: "currents", answer: "C", category: "part of speech" },
  ];

  for (const q of part5Questions) {
    await prisma.question.create({
      data: { part: 5, ...q, explanation: "" },
    });
  }

  // Part 6 샘플 문제 (1 지문 4문제)
  const group6 = await prisma.questionGroup.create({
    data: {
      part: 6,
      passageType: "email",
      passageText: `Dear Ms. Johnson,

I am writing to ------- (1) you about the upcoming changes to our office schedule. Beginning next Monday, our office hours will be extended from 9 A.M. to 7 P.M. to better accommodate our clients' needs.

All staff members are ------- (2) to adjust their schedules accordingly. If you have any concerns about this change, please feel free to ------- (3) your supervisor directly.

We appreciate your ------- (4) and look forward to serving our clients more effectively.

Best regards,
David Kim
Office Manager`,
    },
  });

  const part6Questions = [
    { questionText: "(1) The word that best fits in blank (1) is:", optionA: "inform", optionB: "informed", optionC: "informing", optionD: "information", answer: "A", groupId: group6.id },
    { questionText: "(2) The word that best fits in blank (2) is:", optionA: "request", optionB: "requesting", optionC: "requested", optionD: "requests", answer: "C", groupId: group6.id },
    { questionText: "(3) The word that best fits in blank (3) is:", optionA: "contact", optionB: "contacted", optionC: "contacting", optionD: "contacts", answer: "A", groupId: group6.id },
    { questionText: "(4) The word that best fits in blank (4) is:", optionA: "cooperate", optionB: "cooperative", optionC: "cooperation", optionD: "cooperated", answer: "C", groupId: group6.id },
  ];

  for (const q of part6Questions) {
    await prisma.question.create({
      data: { part: 6, ...q, explanation: "", category: "" },
    });
  }

  // Part 7 샘플 문제 (1 지문 3문제)
  const group7 = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "notice",
      passageText: `NOTICE TO ALL STAFF

The annual company picnic will be held on Saturday, July 15, at Riverside Park.
The event will begin at 11:00 A.M. and conclude at 4:00 P.M.

Activities include:
- Team sports competitions
- Barbecue lunch (provided by the company)
- Raffle prizes for all participants

Please RSVP to Human Resources by July 8. Employees may bring their immediate family members. Transportation will be provided from the office parking lot at 10:30 A.M.

For more information, contact HR at hr@company.com or ext. 245.`,
    },
  });

  const part7Questions = [
    { questionText: "What is the purpose of this notice?", optionA: "To announce a company reorganization", optionB: "To inform employees about a company event", optionC: "To request volunteers for a charity event", optionD: "To introduce a new company policy", answer: "B", groupId: group7.id },
    { questionText: "By what date must employees respond?", optionA: "July 4", optionB: "July 8", optionC: "July 15", optionD: "July 30", answer: "B", groupId: group7.id },
    { questionText: "What will NOT be provided at the event?", optionA: "Food", optionB: "Transportation", optionC: "Prizes", optionD: "Accommodations", answer: "D", groupId: group7.id },
  ];

  for (const q of part7Questions) {
    await prisma.question.create({
      data: { part: 7, ...q, explanation: "", category: "" },
    });
  }

  // 등록 코드 (플랜별)
  const codes = [
    { code: "test-30", plan: "TEST", durationDays: 30, label: "모의고사 30일" },
    { code: "lecture-30", plan: "LECTURE", durationDays: 30, label: "강의 30일" },
    { code: "full-30", plan: "FULL", durationDays: 30, label: "강의+시험 30일" },
    { code: "full-90", plan: "FULL", durationDays: 90, label: "강의+시험 3개월" },
  ];
  for (const c of codes) {
    await prisma.registerCode.upsert({
      where: { code: c.code },
      update: {},
      create: c,
    });
  }

  console.log("✅ 시드 완료!");
  console.log("관리자: yeosintoeic@yeosintoeic.com / yeosintoeic");
  console.log("등록 코드 예시: test-30 / lecture-30 / full-30 / full-90");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
