const HOMEWORK1_VERSION = "v2";

const HOMEWORK1 = [
  { questionText: "The company plans to ------- its operations into Southeast Asia next year.", optionA: "expand", optionB: "expansion", optionC: "expansive", optionD: "expanded", answer: "A", explanation: "✅ A (expand)\n❌ B (expansion) — 명사\n❌ C (expansive) — 형용사\n❌ D (expanded) — 과거형\n💡 plans to 뒤에는 동사원형이 옵니다." },
  { questionText: "The new policy will ------- take effect starting next Monday.", optionA: "official", optionB: "officially", optionC: "officiate", optionD: "officials", answer: "B", explanation: "✅ B (officially)\n❌ A (official) — 형용사/명사\n❌ C (officiate) — 동사\n❌ D (officials) — 명사\n💡 동사(take)를 꾸미는 자리이므로 부사 officially가 정답입니다." },
  { questionText: "The ------- of the new software will begin next quarter.", optionA: "implement", optionB: "implementing", optionC: "implementation", optionD: "implemented", answer: "C", explanation: "✅ C (implementation)\n❌ A (implement) — 동사\n❌ B (implementing) — 동명사\n❌ D (implemented) — 과거형\n💡 The ------- of 구조에서 관사 뒤 명사 자리입니다." },
  { questionText: "The store will remain open ------- the holiday season.", optionA: "by", optionB: "until", optionC: "since", optionD: "throughout", answer: "D", explanation: "✅ D (throughout) — 기간 내내\n❌ A (by) — 기한\n❌ B (until) — ~까지 (계속)\n❌ C (since) — ~이래로\n💡 기간 전체에 걸쳐 지속됨을 나타낼 때 throughout을 씁니다." },
  { questionText: "Attendance at the training session is ------- for all new employees.", optionA: "mandatory", optionB: "mandate", optionC: "mandatorily", optionD: "mandated", answer: "A", explanation: "✅ A (mandatory) — 의무적인\n❌ B (mandate) — 동사/명사\n❌ C (mandatorily) — 부사\n❌ D (mandated) — 과거형\n💡 is 뒤 주격 보어 자리이므로 형용사 mandatory가 정답입니다." },
  { questionText: "Customers can access their account information ------- the company website.", optionA: "throughout", optionB: "through", optionC: "though", optionD: "thorough", answer: "B", explanation: "✅ B (through) — ~을 통해\n❌ A (throughout) — 전체에 걸쳐\n❌ C (though) — 접속사\n❌ D (thorough) — 형용사\n💡 수단을 나타낼 때 through를 사용합니다." },
  { questionText: "The company offers ------- benefits to attract top talent.", optionA: "compete", optionB: "competition", optionC: "competitive", optionD: "competitively", answer: "C", explanation: "✅ C (competitive) — 경쟁력 있는\n❌ A (compete) — 동사\n❌ B (competition) — 명사\n❌ D (competitively) — 부사\n💡 명사(benefits) 앞은 형용사 자리입니다." },
  { questionText: "Employees should ------- their supervisors of any changes in their schedule.", optionA: "notice", optionB: "notification", optionC: "notable", optionD: "notify", answer: "D", explanation: "✅ D (notify) — 알리다\n❌ A (notice) — 주목하다/공지\n❌ B (notification) — 명사\n❌ C (notable) — 형용사\n💡 notify + 사람 + of = ~에게 ~을 알리다." },
  { questionText: "The ------- renovation of the lobby is expected to be completed by May.", optionA: "ongoing", optionB: "gone", optionC: "onward", optionD: "go", answer: "A", explanation: "✅ A (ongoing) — 진행 중인\n❌ B (gone) — 사라진\n❌ C (onward) — 앞으로의\n❌ D (go) — 동사\n💡 명사(renovation) 앞 수식어 자리이므로 형용사 ongoing이 정답입니다." },
  { questionText: "All employees are required to submit their reports ------- the end of the day.", optionA: "until", optionB: "by", optionC: "since", optionD: "during", answer: "B", explanation: "✅ B (by) — 기한\n❌ A (until) — 계속\n❌ C (since) — 시작점\n❌ D (during) — 기간\n💡 '~까지 (완료)' 기한을 나타낼 때는 by를 씁니다." },
  { questionText: "The ------- of the new store location will be announced next week.", optionA: "select", optionB: "selective", optionC: "selection", optionD: "selectively", answer: "C", explanation: "✅ C (selection) — 선택, 선정\n❌ A (select) — 동사\n❌ B (selective) — 형용사\n❌ D (selectively) — 부사\n💡 주어 자리이므로 명사 selection이 정답입니다." },
  { questionText: "The proposal was ------- accepted by all members of the committee.", optionA: "unanimous", optionB: "unanimity", optionC: "unanimousness", optionD: "unanimously", answer: "D", explanation: "✅ D (unanimously) — 만장일치로\n❌ A (unanimous) — 형용사\n❌ B (unanimity) — 명사\n❌ C (unanimousness) — 명사\n💡 동사(accepted)를 꾸미는 자리이므로 부사 unanimously가 정답입니다." },
  { questionText: "The customer service team is ------- to resolving complaints within 24 hours.", optionA: "committed", optionB: "committing", optionC: "commit", optionD: "commitment", answer: "A", explanation: "✅ A (committed)\n❌ B (committing) — 현재분사\n❌ C (commit) — 동사원형\n❌ D (commitment) — 명사\n💡 be committed to ~ing = ~에 헌신하다." },
  { questionText: "Mr. Kim was promoted ------- his outstanding performance last year.", optionA: "despite", optionB: "because of", optionC: "although", optionD: "whereas", answer: "B", explanation: "✅ B (because of) — ~ 때문에\n❌ A (despite) — ~에도 불구하고\n❌ C (although) — 접속사\n❌ D (whereas) — 접속사\n💡 뒤에 명사구가 오므로 전치사구 because of가 정답입니다." },
  { questionText: "The technician will ------- the equipment before the factory resumes operations.", optionA: "inspection", optionB: "inspector", optionC: "inspect", optionD: "inspected", answer: "C", explanation: "✅ C (inspect)\n❌ A (inspection) — 명사\n❌ B (inspector) — 명사\n❌ D (inspected) — 과거형\n💡 will 뒤에는 동사원형이 옵니다." },
  { questionText: "The budget proposal needs ------- approval from the board of directors.", optionA: "finally", optionB: "finalize", optionC: "finality", optionD: "final", answer: "D", explanation: "✅ D (final) — 최종의\n❌ A (finally) — 부사\n❌ B (finalize) — 동사\n❌ C (finality) — 명사\n💡 명사(approval) 앞 수식어는 형용사 자리입니다." },
  { questionText: "Please ------- that all forms are completed before submission.", optionA: "ensure", optionB: "assure", optionC: "insure", optionD: "secure", answer: "A", explanation: "✅ A (ensure) — ~을 확실히 하다\n❌ B (assure) — (사람을) 안심시키다\n❌ C (insure) — 보험에 들다\n❌ D (secure) — 확보하다\n💡 ensure + that절: '~임을 확실히 하다'." },
  { questionText: "The sales team exceeded its ------- target for the third consecutive quarter.", optionA: "annually", optionB: "annual", optionC: "annualize", optionD: "annualized", answer: "B", explanation: "✅ B (annual) — 연간의\n❌ A (annually) — 부사\n❌ C (annualize) — 동사\n❌ D (annualized) — 과거형\n💡 명사(target) 앞 수식어 자리이므로 형용사 annual이 정답입니다." },
  { questionText: "The director will ------- the new recruits to their departments.", optionA: "assignment", optionB: "assigned", optionC: "assign", optionD: "assigning", answer: "C", explanation: "✅ C (assign)\n❌ A (assignment) — 명사\n❌ B (assigned) — 과거형\n❌ D (assigning) — 현재분사\n💡 will 뒤에는 동사원형이 와야 합니다." },
  { questionText: "Employees who wish to take ------- leave must submit a request in advance.", optionA: "paying", optionB: "pay", optionC: "payment", optionD: "paid", answer: "D", explanation: "✅ D (paid) — 유급의\n❌ A (paying) — 현재분사\n❌ B (pay) — 동사/명사\n❌ C (payment) — 명사\n💡 paid leave = 유급 휴가." },
  { questionText: "Parking is available ------- the building on weekdays.", optionA: "behind", optionB: "beside", optionC: "between", optionD: "beneath", answer: "A", explanation: "✅ A (behind) — ~ 뒤에\n❌ B (beside) — ~ 옆에\n❌ C (between) — ~ 사이에\n❌ D (beneath) — ~ 아래에\n💡 문맥상 건물 뒤에 주차 공간이 있다는 의미입니다." },
  { questionText: "The ------- speaker at the conference impressed the audience with her insights.", optionA: "key", optionB: "keynote", optionC: "keenly", optionD: "keen", answer: "B", explanation: "✅ B (keynote) — 기조의\n❌ A (key) — 핵심적인\n❌ C (keenly) — 부사\n❌ D (keen) — 열심인\n💡 keynote speaker = 기조연설자." },
  { questionText: "The factory is operating at full ------- to meet holiday demand.", optionA: "capable", optionB: "capably", optionC: "capacity", optionD: "capability", answer: "C", explanation: "✅ C (capacity) — 용량, 생산 능력\n❌ A (capable) — 형용사\n❌ B (capably) — 부사\n❌ D (capability) — 역량\n💡 at full capacity = 최대 가동으로." },
  { questionText: "The ------- survey results will be shared with all department heads.", optionA: "lately", optionB: "late", optionC: "later", optionD: "latest", answer: "D", explanation: "✅ D (latest) — 최신의\n❌ A (lately) — 최근에 (부사)\n❌ B (late) — 늦은\n❌ C (later) — 나중에\n💡 명사 앞 형용사 자리이며 '가장 최신의'를 뜻하는 latest가 적절합니다." },
  { questionText: "The client requested that the report be submitted ------- Friday morning.", optionA: "by", optionB: "on", optionC: "at", optionD: "in", answer: "A", explanation: "✅ A (by) — ~까지 (기한)\n❌ B (on) — 특정 날\n❌ C (at) — 특정 시간\n❌ D (in) — 기간\n💡 제출 기한을 나타낼 때는 by를 사용합니다." },
  { questionText: "The human resources department is ------- for processing all job applications.", optionA: "responsive", optionB: "responsible", optionC: "respective", optionD: "reluctant", answer: "B", explanation: "✅ B (responsible) — 담당하는\n❌ A (responsive) — 반응하는\n❌ C (respective) — 각자의\n❌ D (reluctant) — 꺼리는\n💡 be responsible for = ~을 담당하다." },
  { questionText: "The conference room is ------- available for booking after 3 P.M.", optionA: "ever", optionB: "already", optionC: "only", optionD: "yet", answer: "C", explanation: "✅ C (only) — 오직\n❌ A (ever) — 문맥 불일치\n❌ B (already) — 이미\n❌ D (yet) — 아직\n💡 '오후 3시 이후에만 예약 가능'의 의미로 only가 적절합니다." },
  { questionText: "The committee will ------- a new policy on remote work next month.", optionA: "introduction", optionB: "introducing", optionC: "introduced", optionD: "introduce", answer: "D", explanation: "✅ D (introduce)\n❌ A (introduction) — 명사\n❌ B (introducing) — 현재분사\n❌ C (introduced) — 과거형\n💡 will 뒤에는 동사원형이 옵니다." },
  { questionText: "Staff members are encouraged to take ------- breaks throughout the workday.", optionA: "regular", optionB: "regularly", optionC: "regulate", optionD: "regulation", answer: "A", explanation: "✅ A (regular) — 규칙적인\n❌ B (regularly) — 부사\n❌ C (regulate) — 동사\n❌ D (regulation) — 명사\n💡 명사(breaks) 앞 수식어 자리이므로 형용사 regular가 정답입니다." },
  { questionText: "The factory agreed to ------- all defective products at no extra charge.", optionA: "replacement", optionB: "replace", optionC: "replacing", optionD: "replaced", answer: "B", explanation: "✅ B (replace)\n❌ A (replacement) — 명사\n❌ C (replacing) — 현재분사\n❌ D (replaced) — 과거형\n💡 to 부정사 뒤에는 동사원형이 옵니다." },
];

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    try {
      const FOREVER = new Date("9999-12-31T00:00:00.000Z");
      const TARGET_USERS = [
        { email: "dlsdn0420@naver.com", role: "ADMIN" },
        { email: "gugua35@naver.com", role: "MANAGER" },
        { email: "sohee@yeosintoeic.com", role: "MANAGER" },
      ];

      for (const u of TARGET_USERS) {
        const result = await prisma.user.updateMany({
          where: { email: u.email },
          data: { role: u.role, plan: "ALL", planExpiresAt: FOREVER },
        });
        if (result.count > 0) console.log(`[seed] ${u.email} → ${u.role}`);
      }

      // 버전이 다르면 숙제 문제 교체
      const versionRow = await prisma.setting.findUnique({ where: { key: "homework1_version" } });
      if (versionRow?.value !== HOMEWORK1_VERSION) {
        await prisma.question.deleteMany({ where: { homeworkSet: 1 } });
        await prisma.question.createMany({
          data: HOMEWORK1.map((q, i) => ({ part: 5, category: "homework", homeworkSet: 1, homeworkOrder: i + 1, ...q })),
        });
        await prisma.setting.upsert({
          where: { key: "homework1_version" },
          update: { value: HOMEWORK1_VERSION },
          create: { key: "homework1_version", value: HOMEWORK1_VERSION },
        });
        console.log(`[seed] 숙제 1번 ${HOMEWORK1.length}개 교체 완료 (${HOMEWORK1_VERSION})`);
      }
    } catch (e) {
      console.error("[seed] 오류 (서버는 계속 시작):", e);
    } finally {
      await prisma.$disconnect();
    }
  }
}
