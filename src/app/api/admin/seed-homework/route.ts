import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

const HOMEWORK1_QUESTIONS = [
  { questionText: "The committee has decided to ------- the project deadline by two weeks.", optionA: "extend", optionB: "extension", optionC: "extensive", optionD: "extensively", answer: "A", explanation: "✅ A (extend)\n❌ B (extension) — 명사\n❌ C (extensive) — 형용사\n❌ D (extensively) — 부사\n💡 has decided to 뒤에는 동사원형이 와야 합니다." },
  { questionText: "All employees are required to submit their reports ------- the end of the day.", optionA: "by", optionB: "until", optionC: "since", optionD: "during", answer: "A", explanation: "✅ A (by) — 기한\n❌ B (until) — 계속\n❌ C (since) — 시작점\n❌ D (during) — 기간\n💡 '~까지 (완료)' 기한을 나타낼 때는 by를 씁니다." },
  { questionText: "The new policy will ------- take effect starting next Monday.", optionA: "official", optionB: "officially", optionC: "officiate", optionD: "officials", answer: "B", explanation: "✅ B (officially)\n❌ A (official) — 형용사/명사\n❌ C (officiate) — 동사\n❌ D (officials) — 명사\n💡 동사(take)를 꾸미는 자리이므로 부사 officially가 정답입니다." },
  { questionText: "Ms. Park is ------- for overseeing all marketing campaigns.", optionA: "responsible", optionB: "responsibility", optionC: "responsibly", optionD: "respond", answer: "A", explanation: "✅ A (responsible)\n❌ B (responsibility) — 명사\n❌ C (responsibly) — 부사\n❌ D (respond) — 동사\n💡 be동사 뒤 보어 자리에는 형용사가 옵니다. be responsible for = ~을 담당하다." },
  { questionText: "The manager asked the staff to ------- confidential information carefully.", optionA: "handle", optionB: "handling", optionC: "handler", optionD: "handled", answer: "A", explanation: "✅ A (handle)\n❌ B (handling) — 동명사/현재분사\n❌ C (handler) — 명사\n❌ D (handled) — 과거형\n💡 to 부정사 뒤에는 동사원형이 옵니다." },
  { questionText: "The ------- of the new software will begin next quarter.", optionA: "implement", optionB: "implementing", optionC: "implementation", optionD: "implemented", answer: "C", explanation: "✅ C (implementation)\n❌ A (implement) — 동사\n❌ B (implementing) — 동명사/현재분사\n❌ D (implemented) — 형용사/과거형\n💡 The ------- of 구조에서 관사 뒤 전치사 앞은 명사 자리입니다." },
  { questionText: "Customers can access their account information ------- the company website.", optionA: "through", optionB: "throughout", optionC: "though", optionD: "thorough", answer: "A", explanation: "✅ A (through) — ~을 통해\n❌ B (throughout) — 전체에 걸쳐\n❌ C (though) — 접속사\n❌ D (thorough) — 형용사\n💡 수단을 나타낼 때 through를 사용합니다." },
  { questionText: "The conference room is ------- available for booking after 3 P.M.", optionA: "only", optionB: "ever", optionC: "already", optionD: "yet", answer: "A", explanation: "✅ A (only) — 오직\n❌ B (ever) — 문맥 불일치\n❌ C (already) — 이미\n❌ D (yet) — 아직\n💡 '오후 3시 이후에만 예약 가능'의 의미로 only가 적절합니다." },
  { questionText: "The ------- renovation of the lobby is expected to be completed by May.", optionA: "ongoing", optionB: "gone", optionC: "onward", optionD: "go", answer: "A", explanation: "✅ A (ongoing) — 진행 중인\n❌ B (gone) — 사라진\n❌ C (onward) — 앞으로의\n❌ D (go) — 동사\n💡 명사(renovation) 앞 수식어 자리이므로 형용사 ongoing이 정답입니다." },
  { questionText: "Please ------- that all forms are completed before submission.", optionA: "ensure", optionB: "assure", optionC: "insure", optionD: "secure", answer: "A", explanation: "✅ A (ensure) — ~을 확실히 하다\n❌ B (assure) — (사람을) 안심시키다\n❌ C (insure) — 보험에 들다\n❌ D (secure) — 확보하다\n💡 ensure + that절: '~임을 확실히 하다'." },
  { questionText: "The sales team exceeded its ------- target for the third consecutive quarter.", optionA: "annual", optionB: "annually", optionC: "annualize", optionD: "annualized", answer: "A", explanation: "✅ A (annual) — 연간의\n❌ B (annually) — 부사\n❌ C (annualize) — 동사\n❌ D (annualized) — 과거형\n💡 명사(target) 앞 수식어 자리이므로 형용사 annual이 정답입니다." },
  { questionText: "The director will ------- the new recruits to their departments.", optionA: "assign", optionB: "assignment", optionC: "assigned", optionD: "assigning", answer: "A", explanation: "✅ A (assign)\n❌ B (assignment) — 명사\n❌ C (assigned) — 과거형\n❌ D (assigning) — 현재분사\n💡 will 뒤에는 동사원형이 와야 합니다." },
  { questionText: "Employees who wish to take ------- leave must submit a request in advance.", optionA: "paid", optionB: "paying", optionC: "pay", optionD: "payment", answer: "A", explanation: "✅ A (paid) — 유급의\n❌ B (paying) — 현재분사\n❌ C (pay) — 동사/명사\n❌ D (payment) — 명사\n💡 paid leave = 유급 휴가." },
  { questionText: "The budget proposal needs ------- approval from the board of directors.", optionA: "final", optionB: "finally", optionC: "finalize", optionD: "finality", answer: "A", explanation: "✅ A (final) — 최종의\n❌ B (finally) — 부사\n❌ C (finalize) — 동사\n❌ D (finality) — 명사\n💡 명사(approval) 앞 수식어는 형용사 자리입니다." },
  { questionText: "Mr. Kim was promoted ------- his outstanding performance last year.", optionA: "because of", optionB: "despite", optionC: "although", optionD: "whereas", answer: "A", explanation: "✅ A (because of) — ~ 때문에\n❌ B (despite) — ~에도 불구하고\n❌ C (although) — 접속사\n❌ D (whereas) — 접속사\n💡 뒤에 명사구가 오므로 전치사구 because of가 정답입니다." },
  { questionText: "The company offers ------- benefits to attract top talent.", optionA: "competitive", optionB: "compete", optionC: "competition", optionD: "competitively", answer: "A", explanation: "✅ A (competitive) — 경쟁력 있는\n❌ B (compete) — 동사\n❌ C (competition) — 명사\n❌ D (competitively) — 부사\n💡 명사(benefits) 앞은 형용사 자리입니다." },
  { questionText: "The technician will ------- the equipment before the factory resumes operations.", optionA: "inspect", optionB: "inspection", optionC: "inspector", optionD: "inspected", answer: "A", explanation: "✅ A (inspect)\n❌ B (inspection) — 명사\n❌ C (inspector) — 명사\n❌ D (inspected) — 과거형\n💡 will 뒤에는 동사원형이 옵니다." },
  { questionText: "Attendance at the training session is ------- for all new employees.", optionA: "mandatory", optionB: "mandate", optionC: "mandatorily", optionD: "mandated", answer: "A", explanation: "✅ A (mandatory) — 의무적인\n❌ B (mandate) — 동사/명사\n❌ C (mandatorily) — 부사\n❌ D (mandated) — 과거형\n💡 is 뒤 주격 보어 자리이므로 형용사 mandatory가 정답입니다." },
  { questionText: "The customer service team is ------- to resolving complaints within 24 hours.", optionA: "committed", optionB: "committing", optionC: "commit", optionD: "commitment", answer: "A", explanation: "✅ A (committed)\n❌ B (committing) — 현재분사\n❌ C (commit) — 동사원형\n❌ D (commitment) — 명사\n💡 be committed to ~ing = ~에 헌신하다." },
  { questionText: "The ------- of the new store location will be announced next week.", optionA: "selection", optionB: "select", optionC: "selective", optionD: "selectively", answer: "A", explanation: "✅ A (selection) — 선택, 선정\n❌ B (select) — 동사/형용사\n❌ C (selective) — 형용사\n❌ D (selectively) — 부사\n💡 주어 자리이므로 명사 selection이 정답입니다." },
  { questionText: "Parking is available ------- the building on weekdays.", optionA: "behind", optionB: "beside", optionC: "between", optionD: "beneath", answer: "A", explanation: "✅ A (behind) — ~ 뒤에\n❌ B (beside) — ~ 옆에\n❌ C (between) — ~ 사이에\n❌ D (beneath) — ~ 아래에\n💡 문맥상 건물 뒤에 주차 공간이 있다는 의미입니다." },
  { questionText: "The ------- speaker at the conference impressed the audience with her insights.", optionA: "keynote", optionB: "key", optionC: "keenly", optionD: "keen", answer: "A", explanation: "✅ A (keynote) — 기조의\n❌ B (key) — 핵심적인\n❌ C (keenly) — 부사\n❌ D (keen) — 열심인\n💡 keynote speaker = 기조연설자." },
  { questionText: "The factory is operating at full ------- to meet holiday demand.", optionA: "capacity", optionB: "capable", optionC: "capably", optionD: "capability", answer: "A", explanation: "✅ A (capacity) — 용량, 생산 능력\n❌ B (capable) — 형용사\n❌ C (capably) — 부사\n❌ D (capability) — 역량\n💡 at full capacity = 최대 가동으로." },
  { questionText: "Employees should ------- their supervisors of any changes in their schedule.", optionA: "notify", optionB: "notice", optionC: "notification", optionD: "notable", answer: "A", explanation: "✅ A (notify) — 알리다\n❌ B (notice) — 주목하다/공지\n❌ C (notification) — 명사\n❌ D (notable) — 형용사\n💡 notify + 사람 + of = ~에게 ~을 알리다." },
  { questionText: "The proposal was ------- accepted by all members of the committee.", optionA: "unanimously", optionB: "unanimous", optionC: "unanimity", optionD: "unanimousness", answer: "A", explanation: "✅ A (unanimously) — 만장일치로\n❌ B (unanimous) — 형용사\n❌ C (unanimity) — 명사\n❌ D (unanimousness) — 명사\n💡 동사(accepted)를 꾸미는 자리이므로 부사 unanimously가 정답입니다." },
  { questionText: "The company plans to ------- its operations into Southeast Asia next year.", optionA: "expand", optionB: "expansion", optionC: "expansive", optionD: "expanded", answer: "A", explanation: "✅ A (expand)\n❌ B (expansion) — 명사\n❌ C (expansive) — 형용사\n❌ D (expanded) — 과거형\n💡 plans to 뒤에는 동사원형이 옵니다." },
  { questionText: "Staff members are encouraged to take ------- breaks throughout the workday.", optionA: "regular", optionB: "regularly", optionC: "regulate", optionD: "regulation", answer: "A", explanation: "✅ A (regular) — 규칙적인\n❌ B (regularly) — 부사\n❌ C (regulate) — 동사\n❌ D (regulation) — 명사\n💡 명사(breaks) 앞 수식어 자리이므로 형용사 regular가 정답입니다." },
  { questionText: "The ------- survey results will be shared with all department heads.", optionA: "latest", optionB: "lately", optionC: "late", optionD: "later", answer: "A", explanation: "✅ A (latest) — 최신의\n❌ B (lately) — 최근에 (부사)\n❌ C (late) — 늦은\n❌ D (later) — 나중에\n💡 명사 앞 형용사 자리이며 '가장 최신의'를 뜻하는 latest가 적절합니다." },
  { questionText: "The client requested that the report be submitted ------- Friday morning.", optionA: "by", optionB: "on", optionC: "at", optionD: "in", answer: "A", explanation: "✅ A (by) — ~까지 (기한)\n❌ B (on) — 특정 날\n❌ C (at) — 특정 시간\n❌ D (in) — 기간\n💡 제출 기한을 나타낼 때는 by를 사용합니다." },
  { questionText: "The human resources department is ------- for processing all job applications.", optionA: "responsible", optionB: "responsive", optionC: "respective", optionD: "reluctant", answer: "A", explanation: "✅ A (responsible) — 담당하는\n❌ B (responsive) — 반응하는\n❌ C (respective) — 각자의\n❌ D (reluctant) — 꺼리는\n💡 be responsible for = ~을 담당하다." },
];

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return Response.json({ error: "권한 없음" }, { status: 403 });
  }

  const existing = await prisma.question.count({ where: { homeworkSet: 1 } });
  if (existing > 0) {
    return Response.json({ error: `이미 숙제 1번 문제 ${existing}개가 존재합니다.` }, { status: 409 });
  }

  await prisma.question.createMany({
    data: HOMEWORK1_QUESTIONS.map((q) => ({
      part: 5,
      category: "homework",
      homeworkSet: 1,
      ...q,
    })),
  });

  const count = await prisma.question.count({ where: { homeworkSet: 1 } });
  return Response.json({ ok: true, inserted: count });
}
