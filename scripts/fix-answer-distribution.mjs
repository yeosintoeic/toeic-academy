/**
 * 새로 추가된 문제들의 정답 분포 수정
 * 모두 A인 정답을 A/B/C/D로 고르게 분산
 */
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

// 옵션을 순환 이동: 정답을 목표 위치로 이동
// 현재 정답은 항상 A에 있다고 가정
// rotate=0: A(정답 유지), 1: B로 이동, 2: C로 이동, 3: D로 이동
function rotateOptions(q, rotate) {
  const opts = [q.optionA, q.optionB, q.optionC, q.optionD];
  const keys = ["A", "B", "C", "D"];

  if (rotate === 0) return null; // 변경 불필요

  // 현재 optionA가 정답 → rotate만큼 오른쪽으로 이동
  // rotate=1: 정답이 B로 → [D, A, B, C] → 정답(A)이 index 1로
  // rotate=2: 정답이 C로 → [C, D, A, B] → 정답(A)이 index 2로
  // rotate=3: 정답이 D로 → [B, C, D, A] → 정답(A)이 index 3로
  const newOpts = new Array(4);
  for (let i = 0; i < 4; i++) {
    newOpts[(i + rotate) % 4] = opts[i];
  }

  return {
    optionA: newOpts[0],
    optionB: newOpts[1],
    optionC: newOpts[2],
    optionD: newOpts[3],
    answer: keys[rotate],
  };
}

// 설명에서 ①②③④ 참조를 새 위치로 업데이트
function updateExplanation(explanation, rotate) {
  if (rotate === 0 || !explanation) return explanation;

  // 기존 ①=정답,②③④=오답 → rotate 후 새 번호 매핑
  // rotate=1: 정답이 ②로 → 기존 ①→②, ②→③, ③→④, ④→①
  const rotMap = {
    1: { "①": "②", "②": "③", "③": "④", "④": "①" },
    2: { "①": "③", "②": "④", "③": "①", "④": "②" },
    3: { "①": "④", "②": "①", "③": "②", "④": "③" },
  };

  const map = rotMap[rotate];
  if (!map) return explanation;

  // 임시 플레이스홀더로 치환 후 최종 변환
  let result = explanation
    .replace(/①/g, "__P1__")
    .replace(/②/g, "__P2__")
    .replace(/③/g, "__P3__")
    .replace(/④/g, "__P4__");

  result = result
    .replace(/__P1__/g, map["①"])
    .replace(/__P2__/g, map["②"])
    .replace(/__P3__/g, map["③"])
    .replace(/__P4__/g, map["④"]);

  return result;
}

async function main() {
  // 최근 추가된 48개 문제 ID 가져오기 (rowid 내림차순)
  const recentQuestions = await prisma.$queryRaw`
    SELECT id, optionA, optionB, optionC, optionD, answer, explanation, part
    FROM Question
    ORDER BY rowid DESC
    LIMIT 48
  `;

  // 정답을 A/B/C/D 순환으로 배정
  // Part 6의 경우 빈칸 문제라 순환하되 구조 유지
  const rotations = [0, 1, 2, 3]; // 순환 패턴
  let updated = 0;

  for (let i = 0; i < recentQuestions.length; i++) {
    const q = recentQuestions[i];
    if (q.answer !== "A") continue; // 이미 수정된 것은 skip

    const rotate = rotations[i % 4];
    if (rotate === 0) continue; // A 유지

    const newData = rotateOptions(q, rotate);
    if (!newData) continue;

    const newExplanation = updateExplanation(q.explanation, rotate);

    await prisma.question.update({
      where: { id: q.id },
      data: {
        optionA: newData.optionA,
        optionB: newData.optionB,
        optionC: newData.optionC,
        optionD: newData.optionD,
        answer: newData.answer,
        explanation: newExplanation,
      },
    });
    updated++;
  }

  console.log(`✅ ${updated}개 문제의 정답 위치 수정 완료`);

  // 정답 분포 확인
  const dist = await prisma.$queryRaw`
    SELECT answer, COUNT(*) as cnt FROM Question GROUP BY answer ORDER BY answer
  `;
  console.log("\n📊 정답 분포:");
  dist.forEach(r => console.log(`  ${r.answer}: ${r.cnt}개`));

  const total = await prisma.question.count();
  console.log(`  합계: ${total}개`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
