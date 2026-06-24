import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "../dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ── PART 5 (30문제) ─────────────────────────────────────
  const part5 = [
    {
      questionText: "The board of directors will -------- the new budget proposal at Friday's meeting.",
      optionA: "review", optionB: "reviewed", optionC: "reviewing", optionD: "reviews",
      answer: "A", category: "verb form",
      explanation: "조동사 will 뒤에는 동사원형이 옵니다."
    },
    {
      questionText: "Ms. Park submitted her quarterly report -------- the deadline, which impressed her supervisor.",
      optionA: "before", optionB: "after", optionC: "during", optionD: "within",
      answer: "A", category: "preposition",
      explanation: "문맥상 마감일 '전에' 제출했다는 의미가 자연스럽습니다."
    },
    {
      questionText: "The new product line has proven -------- popular among younger consumers this season.",
      optionA: "exception", optionB: "exceptional", optionC: "exceptionally", optionD: "exceptions",
      answer: "C", category: "part of speech",
      explanation: "형용사(popular)를 수식하려면 부사 exceptionally가 필요합니다."
    },
    {
      questionText: "-------- the renovation is complete, the office building will reopen to all staff members.",
      optionA: "Once", optionB: "However", optionC: "Despite", optionD: "Because of",
      answer: "A", category: "conjunction",
      explanation: "Once는 '~하고 나면'의 의미로 시간 조건절을 이끕니다."
    },
    {
      questionText: "The sales team managed to exceed -------- quarterly targets for the third consecutive year.",
      optionA: "they", optionB: "their", optionC: "them", optionD: "theirs",
      answer: "B", category: "pronoun",
      explanation: "명사(targets) 앞에서 소유격 their가 필요합니다."
    },
    {
      questionText: "The marketing director asked all staff to -------- their presentations before the client meeting.",
      optionA: "practice", optionB: "practiced", optionC: "practicing", optionD: "practices",
      answer: "A", category: "verb form",
      explanation: "to 부정사 뒤에는 동사원형이 옵니다."
    },
    {
      questionText: "-------- receiving the industry award, Mr. Chen thanked his entire team for their dedication.",
      optionA: "Upon", optionB: "While", optionC: "Instead", optionD: "Because",
      answer: "A", category: "preposition",
      explanation: "Upon + -ing는 '~하자마자'의 의미입니다."
    },
    {
      questionText: "The company's decision to expand internationally was considered -------- by most industry analysts.",
      optionA: "ambitiously", optionB: "ambitious", optionC: "ambition", optionD: "ambitiousness",
      answer: "B", category: "part of speech",
      explanation: "consider + 목적어 + 형용사 구조에서 형용사 ambitious가 적절합니다."
    },
    {
      questionText: "The project coordinator informed -------- that the deadline had been moved to next Friday.",
      optionA: "everyone", optionB: "everything", optionC: "whoever", optionD: "whenever",
      answer: "A", category: "pronoun",
      explanation: "사람들에게 알렸다는 의미이므로 everyone이 적절합니다."
    },
    {
      questionText: "Employees are encouraged to -------- any concerns directly to the human resources department.",
      optionA: "direct", optionB: "direction", optionC: "directed", optionD: "directing",
      answer: "A", category: "verb form",
      explanation: "to 부정사 뒤에는 동사원형이 옵니다."
    },
    {
      questionText: "The quarterly report showed a significant -------- in overall customer satisfaction scores.",
      optionA: "improve", optionB: "improved", optionC: "improvement", optionD: "improving",
      answer: "C", category: "part of speech",
      explanation: "관사 a와 전치사 in 사이에는 명사가 필요합니다."
    },
    {
      questionText: "-------- the heavy rain, the outdoor ceremony proceeded without any major disruptions.",
      optionA: "Despite", optionB: "Although", optionC: "However", optionD: "Therefore",
      answer: "A", category: "conjunction",
      explanation: "Despite는 전치사로 명사구 앞에 쓰이며 '~에도 불구하고'의 의미입니다."
    },
    {
      questionText: "The training session was -------- interesting that several employees requested additional workshops.",
      optionA: "such", optionB: "so", optionC: "very", optionD: "quite",
      answer: "B", category: "conjunction",
      explanation: "so + 형용사/부사 + that 구조로 결과를 나타냅니다."
    },
    {
      questionText: "Mr. Torres is responsible -------- managing the company's entire social media presence.",
      optionA: "of", optionB: "at", optionC: "for", optionD: "about",
      answer: "C", category: "preposition",
      explanation: "be responsible for는 '~에 대해 책임이 있다'는 고정 표현입니다."
    },
    {
      questionText: "The financial team -------- the quarterly figures before submitting the final annual report.",
      optionA: "has verified", optionB: "verifying", optionC: "to verify", optionD: "verification",
      answer: "A", category: "verb tense",
      explanation: "완전한 문장이 되려면 동사가 필요하며, 현재완료 has verified가 적절합니다."
    },
    {
      questionText: "Employees -------- wish to work remotely must submit a written request at least 48 hours in advance.",
      optionA: "whom", optionB: "whose", optionC: "who", optionD: "which",
      answer: "C", category: "relative pronoun",
      explanation: "선행사가 사람(employees)이고 관계절에서 주어 역할을 하므로 who가 적절합니다."
    },
    {
      questionText: "The CEO spoke -------- about the company's ambitious plans for international expansion.",
      optionA: "enthusiasm", optionB: "enthusiastic", optionC: "enthusiastically", optionD: "enthusiasms",
      answer: "C", category: "part of speech",
      explanation: "동사(spoke)를 수식하는 부사 enthusiastically가 필요합니다."
    },
    {
      questionText: "The catering company can accommodate -------- 250 guests at the annual awards banquet.",
      optionA: "up to", optionB: "as to", optionC: "in to", optionD: "out to",
      answer: "A", category: "preposition",
      explanation: "up to는 '최대 ~까지'의 의미로 숫자 앞에 자주 쓰입니다."
    },
    {
      questionText: "-------- the new software is installed, all users will need to restart their computers.",
      optionA: "Due to", optionB: "Because of", optionC: "Once", optionD: "Despite",
      answer: "C", category: "conjunction",
      explanation: "Once는 '~하고 나면'의 의미로 시간 조건절을 이끕니다."
    },
    {
      questionText: "The research team developed a -------- method for analyzing large sets of customer data.",
      optionA: "rely", optionB: "reliable", optionC: "reliably", optionD: "reliance",
      answer: "B", category: "part of speech",
      explanation: "명사(method) 앞에 형용사 reliable이 필요합니다."
    },
    {
      questionText: "Ms. Gibson was named Employee of the Month -------- her outstanding contributions to the project.",
      optionA: "despite", optionB: "because of", optionC: "however", optionD: "whether",
      answer: "B", category: "preposition",
      explanation: "because of는 전치사로 명사구 앞에서 이유를 나타냅니다."
    },
    {
      questionText: "The board meeting has been -------- from Tuesday to Thursday due to unexpected scheduling conflicts.",
      optionA: "rescheduled", optionB: "reschedule", optionC: "scheduling", optionD: "schedule",
      answer: "A", category: "verb form",
      explanation: "has been 뒤에는 과거분사가 와야 합니다 (현재완료 수동태)."
    },
    {
      questionText: "Please -------- that all windows and doors are securely locked before leaving the premises.",
      optionA: "ensuring", optionB: "ensured", optionC: "ensure", optionD: "ensures",
      answer: "C", category: "verb form",
      explanation: "명령문에서는 동사원형이 사용됩니다."
    },
    {
      questionText: "The company offers -------- health and wellness benefits to employees who have completed one year of service.",
      optionA: "compete", optionB: "competition", optionC: "competitive", optionD: "competitively",
      answer: "C", category: "part of speech",
      explanation: "명사(benefits) 앞에 형용사 competitive가 필요합니다."
    },
    {
      questionText: "The project was completed two weeks -------- schedule, thanks to the entire team's dedication.",
      optionA: "ahead of", optionB: "in front of", optionC: "next to", optionD: "due to",
      answer: "A", category: "preposition",
      explanation: "ahead of schedule은 '예정보다 일찍'을 의미하는 관용 표현입니다."
    },
    {
      questionText: "-------- the manager's approval, the team was able to launch the new marketing campaign immediately.",
      optionA: "With", optionB: "Despite", optionC: "Although", optionD: "Unless",
      answer: "A", category: "preposition",
      explanation: "With + 명사 = '~덕분에, ~가 있어서'의 의미입니다."
    },
    {
      questionText: "The revised schedule will -------- all team members to complete their assigned tasks before the launch date.",
      optionA: "allow", optionB: "allows", optionC: "allowed", optionD: "allowing",
      answer: "A", category: "verb form",
      explanation: "조동사 will 뒤에는 동사원형이 옵니다."
    },
    {
      questionText: "The new policy requires that all visitors -------- a temporary badge at the main reception desk.",
      optionA: "wear", optionB: "wore", optionC: "wearing", optionD: "worn",
      answer: "A", category: "verb form",
      explanation: "require that 절에서는 동사원형(가정법 현재)이 사용됩니다."
    },
    {
      questionText: "Customers who wish to cancel -------- subscription may do so without any additional penalty.",
      optionA: "them", optionB: "theirs", optionC: "their", optionD: "themselves",
      answer: "C", category: "pronoun",
      explanation: "명사(subscription) 앞에 소유격 their가 필요합니다."
    },
    {
      questionText: "The conference -------- by over 500 industry professionals from around the world last year.",
      optionA: "attended", optionB: "was attended", optionC: "attends", optionD: "will attend",
      answer: "B", category: "verb tense",
      explanation: "주어(the conference)가 행위의 대상이므로 수동태가 필요합니다."
    },
  ];

  for (const q of part5) {
    await prisma.question.create({ data: { part: 5, ...q } });
  }
  console.log("✅ Part 5 완료 (30문제)");

  // ── PART 6 (2그룹, 각 4문제) ──────────────────────────────
  const group6a = await prisma.questionGroup.create({
    data: {
      part: 6,
      passageType: "email",
      passageText: `To: All Department Managers
From: Jennifer Walsh, HR Director
Date: October 3
Subject: Updated Annual Leave Policy

I am writing to inform you of important changes to our company's annual leave policy. Effective November 1, all employees will be entitled to 15 days of paid annual leave per year, --------(131) from the current 12 days. This change reflects the company's --------(132) to employee well-being and work-life balance.

Managers are asked to --------(133) their teams about this update as soon as possible. Please note that unused leave days from this year may not be carried over to the following year. --------(134)

If you have any questions regarding the new policy, please do not hesitate to contact the HR department.

Best regards,
Jennifer Walsh
HR Director`,
    },
  });

  const part6a = [
    {
      questionText: "131. (A) increase  (B) increased  (C) increasing  (D) increases",
      optionA: "increase", optionB: "increased", optionC: "increasing", optionD: "increases",
      answer: "B", category: "verb form",
      explanation: "분사구문으로 과거분사 increased(증가된)가 앞 명사를 수식합니다.",
      groupId: group6a.id,
    },
    {
      questionText: "132. (A) commit  (B) committed  (C) commitment  (D) commits",
      optionA: "commit", optionB: "committed", optionC: "commitment", optionD: "commits",
      answer: "C", category: "part of speech",
      explanation: "소유격(company's) 뒤에 명사 commitment(헌신)가 필요합니다.",
      groupId: group6a.id,
    },
    {
      questionText: "133. (A) informing  (B) inform  (C) informed  (D) informative",
      optionA: "informing", optionB: "inform", optionC: "informed", optionD: "informative",
      answer: "B", category: "verb form",
      explanation: "asked to 뒤에는 동사원형이 옵니다.",
      groupId: group6a.id,
    },
    {
      questionText: "134. Which of the following sentences best fits in the blank?",
      optionA: "However, you may apply for an extension in exceptional circumstances.",
      optionB: "The new policy will be implemented starting January 1 of next year.",
      optionC: "Employees are therefore encouraged to use their leave throughout the year.",
      optionD: "All leave requests must be approved by HR at least two weeks in advance.",
      answer: "C", category: "sentence insertion",
      explanation: "미사용 연차가 이월되지 않는다는 맥락 뒤에 연차 사용을 권장하는 문장이 자연스럽습니다.",
      groupId: group6a.id,
    },
  ];

  for (const q of part6a) {
    await prisma.question.create({ data: { part: 6, explanation: "", category: "", ...q } });
  }
  console.log("✅ Part 6 그룹1 완료");

  const group6b = await prisma.questionGroup.create({
    data: {
      part: 6,
      passageType: "advertisement",
      passageText: `Bright Star Conference Center

Planning your next corporate event? Bright Star Conference Center is the --------(135) choice for businesses throughout the region. Our facilities include state-of-the-art audio-visual equipment, high-speed Internet access, and comfortable seating for --------(136) 500 guests.

We also offer various catering options to suit every budget and dietary requirement. Our --------(137) event coordination team will ensure that every aspect of your event runs smoothly. --------(138)

Contact us today at 555-0184 or visit www.brightstarcenter.com to check availability and pricing.`,
    },
  });

  const part6b = [
    {
      questionText: "135. (A) ideal  (B) ideally  (C) idealize  (D) idealism",
      optionA: "ideal", optionB: "ideally", optionC: "idealize", optionD: "idealism",
      answer: "A", category: "part of speech",
      explanation: "명사(choice) 앞에서 수식하는 형용사 ideal이 필요합니다.",
      groupId: group6b.id,
    },
    {
      questionText: "136. (A) up to  (B) as far as  (C) as well as  (D) due to",
      optionA: "up to", optionB: "as far as", optionC: "as well as", optionD: "due to",
      answer: "A", category: "preposition",
      explanation: "숫자 앞에서 최대 수용 인원을 나타낼 때 up to를 사용합니다.",
      groupId: group6b.id,
    },
    {
      questionText: "137. (A) dedicate  (B) dedicated  (C) dedicating  (D) dedication",
      optionA: "dedicate", optionB: "dedicated", optionC: "dedicating", optionD: "dedication",
      answer: "B", category: "part of speech",
      explanation: "명사(team) 앞에서 수식하는 형용사 역할의 과거분사 dedicated가 필요합니다.",
      groupId: group6b.id,
    },
    {
      questionText: "138. Which of the following sentences best fits in the blank?",
      optionA: "Our center has been in operation for over twenty years.",
      optionB: "We look forward to making your event an unforgettable experience.",
      optionC: "Parking is available in the underground garage for an additional fee.",
      optionD: "Please note that all bookings must be made at least 30 days in advance.",
      answer: "B", category: "sentence insertion",
      explanation: "광고 마무리로 긍정적인 기대감을 표현하는 B가 가장 자연스럽습니다.",
      groupId: group6b.id,
    },
  ];

  for (const q of part6b) {
    await prisma.question.create({ data: { part: 6, explanation: "", category: "", ...q } });
  }
  console.log("✅ Part 6 그룹2 완료");

  // ── PART 7 (3그룹) ────────────────────────────────────────
  // 그룹1: 공지 (2문제)
  const group7a = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "notice",
      passageText: `Heritage Bookshop — Grand Reopening

After six months of renovations, Heritage Bookshop is proud to announce its grand reopening on Saturday, April 5, from 10 A.M. to 8 P.M.

Visit us at our new location at 245 Cedar Street, just two blocks from Central Station. We have expanded our collection to include over 50,000 titles across all genres, and we have added a cozy café serving freshly brewed coffee and homemade pastries.

To celebrate our reopening, all purchases of $30 or more will receive a complimentary tote bag while supplies last. Heritage Bookshop members will also enjoy an exclusive 20% discount throughout the entire month of April.

Not a member yet? Sign up in-store on reopening day and receive your first year of membership for free.`,
    },
  });

  const part7a = [
    {
      questionText: "What is indicated about Heritage Bookshop?",
      optionA: "It has recently moved to a new location.",
      optionB: "It was founded six months ago.",
      optionC: "It offers online purchasing options.",
      optionD: "It is the largest bookshop in the area.",
      answer: "A", category: "detail",
      explanation: "지문에서 new location으로 이전했다고 명시되어 있습니다.",
      groupId: group7a.id,
    },
    {
      questionText: "What benefit is available to customers who spend at least $30?",
      optionA: "Free membership for one year",
      optionB: "A complimentary tote bag",
      optionC: "A 20% discount",
      optionD: "A free cup of coffee",
      answer: "B", category: "detail",
      explanation: "$30 이상 구매 시 complimentary tote bag을 받는다고 명시되어 있습니다.",
      groupId: group7a.id,
    },
  ];

  for (const q of part7a) {
    await prisma.question.create({ data: { part: 7, explanation: "", category: "", ...q } });
  }
  console.log("✅ Part 7 그룹1 완료");

  // 그룹2: 이메일 (4문제)
  const group7b = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "email",
      passageText: `To: Customer Service <customerservice@greenlane.com>
From: Margaret Holloway <mholloway@email.com>
Date: June 14
Subject: Delivery Issue — Order #GH7821

Dear Customer Service,

I placed an order on June 8 for a set of outdoor garden furniture (Order #GH7821). According to your website, the estimated delivery date was June 12. However, it is now June 14, and I have not yet received my order.

I have attempted to track my package through your online portal, but the tracking information has not been updated since June 9, when the order was marked as "shipped."

I would appreciate it if you could look into this matter and provide me with an update as soon as possible. If the items cannot be delivered by June 20, I would like to request a full refund.

Thank you for your assistance.

Sincerely,
Margaret Holloway`,
    },
  });

  const part7b = [
    {
      questionText: "Why is Ms. Holloway writing to Customer Service?",
      optionA: "To request a refund for a damaged item",
      optionB: "To inquire about a delayed delivery",
      optionC: "To cancel an order she placed online",
      optionD: "To report a problem with the website",
      answer: "B", category: "purpose",
      explanation: "주문한 물건이 예정일이 지나도 오지 않아 문의하는 이메일입니다.",
      groupId: group7b.id,
    },
    {
      questionText: "When was the order placed?",
      optionA: "June 8", optionB: "June 9", optionC: "June 12", optionD: "June 14",
      answer: "A", category: "detail",
      explanation: "I placed an order on June 8라고 명시되어 있습니다.",
      groupId: group7b.id,
    },
    {
      questionText: "What does Ms. Holloway indicate about the tracking information?",
      optionA: "It shows the package has already been delivered.",
      optionB: "It was last updated on June 9.",
      optionC: "It is unavailable on the website.",
      optionD: "It shows the wrong delivery address.",
      answer: "B", category: "detail",
      explanation: "tracking information has not been updated since June 9라고 명시되어 있습니다.",
      groupId: group7b.id,
    },
    {
      questionText: "What does Ms. Holloway request if her order does not arrive by June 20?",
      optionA: "A replacement for the item",
      optionB: "A discount on her next purchase",
      optionC: "A full refund",
      optionD: "Expedited shipping at no charge",
      answer: "C", category: "detail",
      explanation: "If the items cannot be delivered by June 20, I would like to request a full refund라고 명시되어 있습니다.",
      groupId: group7b.id,
    },
  ];

  for (const q of part7b) {
    await prisma.question.create({ data: { part: 7, explanation: "", category: "", ...q } });
  }
  console.log("✅ Part 7 그룹2 완료");

  // 그룹3: 이중지문 - 공지 + 이메일 (5문제)
  const group7c = await prisma.questionGroup.create({
    data: {
      part: 7,
      passageType: "double passage",
      passageText: `[Notice]
Lakeside Community Center

Attention: All Members

Please be advised that the Lakeside Community Center will be closed for scheduled maintenance from Monday, March 10, to Wednesday, March 12. During this time, the swimming pool, fitness center, and all meeting rooms will be unavailable.

Normal operating hours will resume on Thursday, March 13, beginning at 7:00 A.M. Members who have scheduled appointments or reserved meeting rooms during the closure period should contact our reception desk at 555-0291 to reschedule.

We apologize for any inconvenience this may cause.
— The Management Team, Lakeside Community Center

---

[E-mail]
To: Lakeside Community Center <info@lakesidecc.com>
From: Daniel Frost <dfrost@hartleytech.com>
Date: March 7
Subject: Room Reservation Inquiry

Dear Management Team,

I am writing regarding our reservation for Conference Room B on March 11 from 2:00 P.M. to 5:00 P.M. (Reservation #LCC-0482). We plan to use the room for a team training session for approximately 15 people.

I recently saw the notice about the upcoming maintenance closure and wanted to confirm whether our reservation will be affected. If the room will not be available on March 11, we would like to reschedule to March 14 at the same time, if possible.

Please let me know at your earliest convenience so that I can inform my team members accordingly.

Thank you,
Daniel Frost, Hartley Technology`,
    },
  });

  const part7c = [
    {
      questionText: "Why is the community center closing temporarily?",
      optionA: "For staff training", optionB: "For building renovations",
      optionC: "For scheduled maintenance", optionD: "For a special community event",
      answer: "C", category: "purpose",
      explanation: "공지에 scheduled maintenance(정기 유지보수)로 인해 폐관한다고 명시되어 있습니다.",
      groupId: group7c.id,
    },
    {
      questionText: "What are members with existing reservations asked to do?",
      optionA: "Log in to the center's Web site",
      optionB: "Contact the reception desk",
      optionC: "Send an e-mail to the management team",
      optionD: "Visit the center in person",
      answer: "B", category: "detail",
      explanation: "공지에서 contact our reception desk at 555-0291라고 안내하고 있습니다.",
      groupId: group7c.id,
    },
    {
      questionText: "What is the purpose of Mr. Frost's e-mail?",
      optionA: "To inquire about membership renewal",
      optionB: "To confirm whether his reservation will be affected by the closure",
      optionC: "To report a problem with the booking system",
      optionD: "To cancel a previously made reservation",
      answer: "B", category: "purpose",
      explanation: "예약이 유지보수 폐관에 영향을 받는지 확인하고 필요시 재예약을 요청하는 이메일입니다.",
      groupId: group7c.id,
    },
    {
      questionText: "How many people does Mr. Frost plan to bring to the training session?",
      optionA: "About 5", optionB: "About 10", optionC: "About 15", optionD: "About 20",
      answer: "C", category: "detail",
      explanation: "이메일에서 approximately 15 people이라고 명시되어 있습니다.",
      groupId: group7c.id,
    },
    {
      questionText: "If Mr. Frost's reservation needs to be rescheduled, what date does he prefer?",
      optionA: "March 10", optionB: "March 12", optionC: "March 13", optionD: "March 14",
      answer: "D", category: "detail",
      explanation: "이메일에서 reschedule to March 14 at the same time이라고 명시되어 있습니다.",
      groupId: group7c.id,
    },
  ];

  for (const q of part7c) {
    await prisma.question.create({ data: { part: 7, explanation: "", category: "", ...q } });
  }
  console.log("✅ Part 7 그룹3 완료");

  const total = await prisma.question.count();
  console.log(`\n🎉 모든 문제 등록 완료! 현재 총 ${total}문제`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
