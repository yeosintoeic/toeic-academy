import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

// 문제 텍스트 → 해설 매핑
const explanationMap = {
  "The marketing team ------- a new strategy to attract younger customers.":
    "현재진행 시제(is developing)가 적절합니다. 마케팅팀이 현재 전략을 개발하고 있는 진행 중인 상황을 나타냅니다.",
  "All employees are required to submit ------- reports by Friday.":
    "소유격(their)이 필요합니다. employees(복수)의 소유격은 their입니다.",
  "The conference will be held ------- the Grand Hotel downtown.":
    "특정 장소(건물, 지점) 앞에는 전치사 at을 씁니다. at the Grand Hotel이 올바른 표현입니다.",
  "Mr. Kim was ------- impressed by the new employee's performance.":
    "be동사와 형용사(impressed) 사이에는 부사가 와야 합니다. particularly(특히)가 정답입니다.",
  "The project deadline has been extended ------- a week.":
    "기간을 나타낼 때는 전치사 for를 씁니다. extended for a week(일주일 연장)이 올바릅니다.",
  "Applicants ------- submit their resumes before the deadline will not be considered.":
    "선행사가 사람(Applicants)이고 절 안에서 주어 역할을 하므로 주격 관계대명사 who를 씁니다. who do not submit이 정답입니다.",
  "The new software update has ------- the efficiency of our operations significantly.":
    "현재완료 has 뒤에는 과거분사(p.p.)가 옵니다. improved가 improve의 과거분사형입니다.",
  "Please make sure the documents are signed ------- you leave the office.":
    "서류에 서명한 후 퇴근하라는 의미이므로 '~하기 전에'를 뜻하는 before가 정답입니다.",
  "The company offers ------- benefits to full-time employees.":
    "명사(benefits) 앞에서 수식하는 형용사가 필요합니다. competitive(경쟁력 있는)가 정답입니다.",
  "------- the heavy traffic, we managed to arrive at the meeting on time.":
    "뒤에 명사구(the heavy traffic)가 오므로 전치사 Despite(~에도 불구하고)가 적절합니다. Even though는 접속사이므로 절이 따라와야 합니다.",
  "The new policy will take ------- starting from next month.":
    "take effect는 '효력이 발생하다'라는 뜻의 관용 표현입니다. affect는 동사 또는 명사(영향)입니다.",
  "Customers who purchase items ------- the amount of $100 will receive free shipping.":
    "명사(items)를 뒤에서 수식하는 현재분사가 필요합니다. exceeding(초과하는)이 정답입니다.",
  "The annual report will be ------- to all shareholders next week.":
    "수동태 구조(will be + p.p.)에서 과거분사 distributed(배포된)가 필요합니다.",
  "Ms. Park has been working at this company ------- ten years.":
    "기간(ten years) 앞에는 전치사 for를 씁니다. since는 특정 시점 앞에 씁니다.",
  "The renovation of the building is ------- scheduled to be completed by December.":
    "is와 과거분사(scheduled) 사이에는 부사가 와야 합니다. currently(현재)가 정답입니다.",

  // Part 6 - 빈칸 유형
  "(1) The word that best fits in blank (1) is:":
    "to 부정사 뒤에는 동사원형이 옵니다. inform(알리다)이 올바른 형태입니다.",
  "(2) The word that best fits in blank (2) is:":
    "수동태 문장에서 과거분사 requested(요청된)가 필요합니다. 명사를 뒤에서 수식합니다.",
  "(3) The word that best fits in blank (3) is:":
    "Please 뒤에는 동사원형이 옵니다. contact(연락하다)가 정답입니다.",
  "(4) The word that best fits in blank (4) is:":
    "전치사(for) 뒤에는 명사가 와야 합니다. cooperation(협조)이 명사형으로 정답입니다.",

  // Part 7 - 독해 유형
  "What is the purpose of this notice?":
    "지문은 회사 이벤트(하계 소풍)에 대한 직원 안내문입니다. 따라서 목적은 '직원에게 회사 행사를 알리기 위해'(B)입니다.",
  "By what date must employees respond?":
    "지문에서 7월 8일까지 응답해야 한다고 언급됩니다. 정답은 (B) July 8입니다.",
  "What will NOT be provided at the event?":
    "지문에서 음식(Food), 교통(Transportation), 경품(Prizes)은 제공된다고 하지만 숙소(Accommodations)에 대한 언급은 없습니다. 정답은 (D)입니다.",
};

// 번호가 포함된 questionText를 정제하는 함수
function cleanQuestionText(text) {
  // "131. (A) increase  (B) increased..." 형태 → "빈칸에 들어갈 알맞은 단어를 고르세요."
  const numWithOptions = /^\d+\.\s*\(A\)/;
  if (numWithOptions.test(text.trim())) {
    return "빈칸에 들어갈 알맞은 단어를 고르세요.";
  }
  // "134. Which of the following..." 형태 → 번호만 제거
  const numPrefix = /^\d+\.\s*/;
  if (numPrefix.test(text.trim())) {
    return text.trim().replace(numPrefix, "");
  }
  return text;
}

async function main() {
  const questions = await prisma.question.findMany({
    select: { id: true, part: true, questionText: true, explanation: true },
  });

  let updatedExp = 0;
  let updatedText = 0;

  for (const q of questions) {
    const updates = {};

    // 1. 번호 제거
    const cleanedText = cleanQuestionText(q.questionText);
    if (cleanedText !== q.questionText) {
      updates.questionText = cleanedText;
      updatedText++;
    }

    // 2. 해설 추가 (없는 경우)
    if (!q.explanation || q.explanation.trim() === "") {
      const key = q.questionText.trim();
      const exp = explanationMap[key];
      if (exp) {
        updates.explanation = exp;
        updatedExp++;
      } else {
        console.log(`[미매핑] Part${q.part}: ${q.questionText.substring(0, 60)}`);
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.question.update({ where: { id: q.id }, data: updates });
    }
  }

  console.log(`\n완료: 해설 추가 ${updatedExp}개, 번호 제거 ${updatedText}개`);
  await prisma.$disconnect();
}

main().catch(console.error);
