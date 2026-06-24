import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

// questionText 일부 → 새 해설 매핑
const explanations = {

  // ── PART 5 ──────────────────────────────────────────────────────────────

  "The finance team _______ the budget proposal and will present it to the board tomorrow.":
    `[현재완료] '내일 발표할 예정'이라는 말은 이미 검토를 완료했음을 의미합니다. 현재완료 has finished는 '과거에 완료된 일이 현재까지 결과로 남아 있음'을 나타내므로 정답입니다. ① finish(원형)는 조동사 없이 단독으로 주어 뒤에 올 수 없습니다. ② finished(단순과거)는 '완료했다'는 사실은 맞지만 현재 결과와의 연결이 약합니다. ④ finishing(-ing형)은 진행형에 사용되며 여기서는 어울리지 않습니다.`,

  "Visitors should report to the front desk _______ the main entrance upon arrival.":
    `[전치사 at] at은 '특정 지점·위치'를 나타낼 때 씁니다. at the main entrance는 '정문 앞에서'라는 특정 위치를 나타냅니다. ② in은 공간 내부(in the building), ③ on은 표면 위(on the desk), ④ by는 '~옆에' 또는 수단을 나타내므로 모두 이 문맥에 맞지 않습니다.`,

  "The HR department reminded all staff to update _______ emergency contact information in the system.":
    `[소유격 대명사] update 뒤의 명사 information을 수식하는 소유격이 필요합니다. 주어 all staff는 3인칭 복수로 their(그들의)가 올바른 소유격입니다. ① they는 주격, ② them은 목적격, ④ themselves는 재귀대명사로 각각 명사를 수식할 수 없습니다.`,

  "The new production line runs _______ smoothly, reducing the number of defective units.":
    `[품사 - 부사] runs smoothly에서 smoothly라는 부사를 수식하려면 또 다른 부사가 필요합니다. considerably(상당히)는 부사로 부사·형용사를 수식합니다. ① consider는 동사, ② considerable은 형용사(명사 수식), ④ consideration은 명사이므로 이 자리에 올 수 없습니다.`,

  "_______ the heavy snowfall, all employees arrived at the office on time.":
    `[전치사 vs 접속사] 빈칸 뒤에 명사구(the heavy snowfall)가 오므로 전치사가 필요합니다. Despite(~에도 불구하고)는 전치사로 명사구 앞에 옵니다. ① Although는 접속사로 '주어+동사'로 이루어진 절이 필요합니다. ③ Even은 부사, ④ However는 부사로 모두 명사구 앞에 쓸 수 없습니다.`,

  "Employees _______ wish to participate in the training program should register by Friday.":
    `[관계대명사 who] 선행사 Employees는 사람이고, 빈칸 뒤의 절에서 주어 역할을 하므로 주격 관계대명사 who가 정답입니다. ② which는 사물·동물에 사용됩니다. ③ whose는 소유격 관계대명사로 뒤에 명사가 따라옵니다. ④ what은 선행사를 포함하는 관계대명사로 Employees 앞에 별도 선행사가 있으므로 쓸 수 없습니다.`,

  "All maintenance requests _______ within 24 hours of submission.":
    `[수동태] 요청(requests)은 처리를 '받는' 대상이므로 수동태가 필요합니다. 주어 requests가 복수이므로 are processed가 정답입니다. ① process(능동·원형)는 요청이 스스로 처리한다는 의미가 되어 어색합니다. ③ is processing은 단수 주어에 맞는 능동 진행형입니다. ④ processed만 쓰면 동사가 없는 불완전한 문장이 됩니다.`,

  "The company has been offering remote work options _______ the pandemic began two years ago.":
    `[전치사 since vs for] since는 '특정 시점 이후'를 나타내며, 뒤에 과거 시점(the pandemic began)이 오는 경우에 씁니다. for는 기간의 길이(two years) 앞에 씁니다. ② during은 '~동안'으로 사건 기간에 쓰지만 그 뒤에 시점 절이 오지 않습니다. ④ while은 접속사로 '~하는 동안'의 의미입니다.`,

  "The board approved the _______ of a new branch office in Singapore.":
    `[품사 - 명사] 관사 the와 전치사 of 사이에는 명사가 와야 합니다. establishment(설립)가 올바른 명사형입니다. ① establish는 동사, ② established는 형용사/과거분사, ③ establishing은 동명사/현재분사로 여기서는 the + 명사 + of 구조에 맞지 않습니다. establish → establishment로의 품사 변환을 기억하세요.`,

  "The updated software processes data _______ faster than the older version.":
    `[비교급 강조 부사] 비교급(faster)을 강조할 때는 far, much, even, a lot 등을 씁니다. far faster는 '훨씬 더 빠르게'라는 의미입니다. ① very는 형용사·부사의 원급을 강조하지만 비교급은 수식할 수 없습니다. ② so와 ③ too도 비교급 강조에 사용되지 않습니다.`,

  "Please wait in the lobby _______ the receptionist calls your name.":
    `[접속사 until] '이름이 불릴 때까지 로비에서 기다리세요'라는 의미이므로 until(~할 때까지)이 정답입니다. ① since는 '~이후로/~이므로', ② unless는 '~하지 않으면', ④ whenever는 '~할 때마다'의 의미로 문맥에 맞지 않습니다. until은 동작이 특정 시점까지 지속됨을 나타냅니다.`,

  "The company received _______ feedback from customers about the new product design.":
    `[품사 - 형용사] feedback이라는 명사를 수식하려면 형용사가 필요합니다. enthusiastic(열정적인)이 형용사로 정답입니다. ① enthusiasm은 명사, ③ enthusiastically는 부사로 명사를 직접 수식할 수 없습니다. ④ enthuse는 동사입니다. 명사 앞에는 반드시 형용사가 와야 합니다.`,

  "Employees _______ in the downtown office are encouraged to use public transportation.":
    `[분사 - 수동 관계] 빈칸은 Employees를 뒤에서 수식하는 역할입니다. '직원들이 위치해 있는' 것은 수동 관계이므로 과거분사 located가 적절합니다. located in the downtown office는 '도심 사무실에 위치한 직원들'을 의미합니다. ① locate는 동사 원형, ③ locating은 능동 현재분사(직원이 무언가를 위치시키는 의미), ④ location은 명사입니다.`,

  "The CEO has been traveling on a business trip _______ the past two weeks.":
    `[전치사 for] 'the past two weeks'는 기간(2주)을 나타내므로 전치사 for를 씁니다. for + 기간(숫자)이 핵심 공식입니다. ① since는 과거의 특정 시점(Monday, 2020 등) 앞에 씁니다. ② during은 '~동안' 이지만 the past two weeks는 기간이지 사건 이름이 아닙니다. ④ while은 접속사입니다.`,

  "The quarterly presentation was _______ organized, impressing all of the investors.":
    `[품사 - 부사] 과거분사 organized를 수식하려면 부사가 필요합니다. excellently(훌륭하게)가 부사로 정답입니다. ① excellent는 형용사(명사 수식), ② excellence는 명사, ④ excelling은 동사 현재분사입니다. was excellently organized = '훌륭하게 구성되었다'는 수동태 표현입니다.`,

  "The marketing team is responsible for _______ the new product campaign.":
    `[동명사 - 전치사 뒤] 전치사 for 뒤에는 반드시 동명사(-ing)가 옵니다. planning이 정답입니다. 'be responsible for + 동명사'는 '~을 담당하다'는 중요 표현입니다. ① plan(동사 원형), ② planned(과거형/과거분사), ④ plans(3인칭 단수 동사)는 전치사 뒤에 올 수 없습니다.`,

  "The renovation project is expected to be completed _______ schedule.":
    `[관용 표현] ahead of schedule은 '예정보다 일찍'을 뜻하는 고정 표현입니다. TOEIC에 자주 출제되므로 암기가 필요합니다. ② in front of는 물리적 위치(앞에), ③ forward to는 'look forward to(기대하다)'에 사용되는 표현, ④ prior of는 영어에서 사용되지 않는 표현입니다. prior to(~이전에)가 올바른 형태입니다.`,

  "The company hired additional staff _______ handle the increased workload during the holiday season.":
    `[to 부정사 - 목적] '~하기 위해'라는 목적을 나타낼 때는 to 부정사를 씁니다. to handle은 '처리하기 위해'를 의미합니다. ① so that과 ④ in order that은 접속사로 뒤에 '주어+동사' 절이 따라와야 합니다. ② for 뒤에는 명사(구)가 오므로 동사 원형 handle이 올 수 없습니다.`,

  "The committee _______ its final decision at the end of this week.":
    `[수일치 - 집합명사] committee(위원회)는 하나의 단체로 단수 취급합니다. 따라서 단수형 announces가 정답입니다. ① announce는 복수 주어에 쓰는 원형, ③ are announcing은 복수 주어에 쓰는 진행형, ④ have announced는 복수 주어에 쓰는 현재완료입니다. team, staff, committee 등 집합명사는 단수 동사와 함께 씁니다.`,

  "The position requires candidates to be punctual, detail-oriented, and _______.":
    `[병렬구조] and로 연결된 항목은 같은 품사여야 합니다. punctual(형용사), detail-oriented(형용사)와 나란히 형용사가 와야 하므로 communicative(소통 능력이 있는)가 정답입니다. ① communicate는 동사, ② communication은 명사, ④ communicably는 부사로 형용사와 병렬을 이룰 수 없습니다.`,

  "All expense reports must be submitted _______ the last business day of the month.":
    `[전치사 by - 기한] by는 '~까지(기한)'를 나타냅니다. by the last business day = '월말 마지막 영업일까지 완료해야 함'을 의미합니다. ① until도 '~까지'이지만 동작의 지속을 나타내므로 '완료 기한'에는 by를 씁니다. ② before는 '~이전에', ④ within은 '~이내에'로 each case의 뉘앙스가 다릅니다.`,

  "The manager had the annual report _______ before the board meeting.":
    `[사역동사 have + 목적어 + p.p.] have + 목적어 + 과거분사는 '목적어가 ~되게 하다(수동)'를 나타냅니다. the annual report(연간 보고서)가 검토를 '받는' 대상이므로 reviewed(과거분사)가 정답입니다. ① review(원형)는 목적어가 능동으로 행동할 때, ③ reviewing(현재분사)도 능동 관계일 때 씁니다.`,

  "The _______ of the new subway line has significantly reduced traffic congestion downtown.":
    `[품사 - 명사] 관사 The와 전치사 of 사이에는 명사가 필요합니다. introduction(도입)이 올바른 명사형입니다. introduce → introduction으로의 명사형 변환을 기억하세요. ① introduce는 동사, ② introduced는 과거형/과거분사, ③ introducing은 현재분사/동명사로 the + _____ + of 구조에서 명사만 가능합니다.`,

  "Employees may work from home _______ they meet all project deadlines.":
    `[접속사 as long as] as long as는 '~하는 한, ~하기만 하면'이라는 조건을 나타냅니다. '마감을 지키는 한 재택근무 가능'이라는 문맥에 맞습니다. ② even though는 '~에도 불구하고(양보)', ③ in case는 '~에 대비해서', ④ so that은 '~하도록(목적)'으로 각각 다른 의미입니다.`,

  "The product launch event is scheduled _______ Thursday, November 10.":
    `[전치사 on - 날짜·요일] 특정 날짜나 요일 앞에는 on을 씁니다. on Thursday, on November 10, on Monday처럼 씁니다. ① in은 월·연도·계절 앞(in November, in 2026), ② at은 특정 시각 앞(at 9 A.M.), ③ by는 기한을 나타내므로 요일·날짜 앞에는 on이 원칙입니다.`,

  "All new interns must _______ a non-disclosure agreement before starting work.":
    `[조동사 + 동사원형] 조동사(must, can, will 등) 뒤에는 반드시 동사원형이 옵니다. sign(서명하다)이 정답입니다. ① signed는 과거형/과거분사, ③ signing은 현재분사/동명사, ④ signature는 명사로 조동사 뒤에 올 수 없습니다.`,

  "The new research center will serve _______ as a laboratory and as a training facility.":
    `[상관접속사 both...and] both A and B는 'A와 B 모두'를 뜻합니다. serve both as a laboratory and as a training facility = '연구소이자 훈련 시설로서 기능하다'입니다. ① either A or B는 'A 또는 B 중 하나', ② neither A nor B는 'A도 B도 아님', ④ whether는 '~인지 아닌지'를 나타냅니다.`,

  "The storage room is not large _______ to hold all of the archived documents.":
    `[형용사 + enough + to] '~할 만큼 충분히 ~한'은 형용사/부사 + enough + to 부정사 구조입니다. large enough to hold = '수납할 만큼 충분히 큰'이 정답입니다. ② too + 형용사 + to는 '너무 ~해서 ~할 수 없다'는 부정 의미, ③ very와 ④ quite는 enough와 함께 이런 구조로 쓰이지 않습니다.`,

  "All guests _______ to present a valid ID at the registration desk.":
    `[수동태 be required to] 방문객이 요구를 '받는' 대상이므로 수동태가 필요합니다. be required to = '~해야 한다(의무)'는 must와 유사한 의미입니다. ① require(능동·원형)는 주어가 능동으로 요구할 때 씁니다. ③ requiring은 능동 현재분사, ④ required만으로는 동사가 완성되지 않습니다.`,

  "Office hours will shift _______ 8 A.M. to 9 A.M. effective next Monday.":
    `[전치사 from...to] from A to B는 '시작점(A)에서 끝점(B)까지'를 나타냅니다. shift from 8 A.M. to 9 A.M. = '오전 8시에서 9시로 변경'입니다. ① since는 현재완료와 함께 '~이후', ③ between A and B는 '두 시점 사이'이지만 from...to와 형태가 다릅니다. ④ during은 '~동안'입니다.`,

  // ── PART 6 ──────────────────────────────────────────────────────────────

  "빈칸 (1)에 들어갈 알맞은 단어를 고르세요.":
    `[to 부정사 + 동사원형] to 부정사 구조에서 to 뒤에는 반드시 동사원형이 와야 합니다. 빈칸 앞 'I am writing to'에서 to는 '목적'을 나타내는 to 부정사이므로 동사원형인 A(notify / advise / conduct / offering 등 맥락에 따른 원형)가 정답입니다. 나머지 선택지는 과거분사, 현재분사, 명사형으로 to 부정사 자리에 올 수 없습니다.`,

  "빈칸 (2)에 들어갈 알맞은 단어를 고르세요.":
    `[부사 vs 형용사] 빈칸 앞뒤 문맥을 확인하세요. 과거분사(has been chosen/streamlined 등)를 수식하거나 주어의 보어로 쓰일 때 각각 부사·형용사를 구분해야 합니다. 동사/분사를 수식하면 부사, 명사를 수식하거나 주어의 상태를 설명하면 형용사가 정답입니다. 나머지 선택지는 동사 원형 또는 명사형입니다.`,

  "빈칸 (3)에 들어갈 알맞은 단어를 고르세요.":
    `[to 부정사 / 수동태] 빈칸이 to 부정사 자리라면 동사원형이 정답입니다. 수동태 be + p.p. 구조라면 과거분사가 정답입니다. 각 선택지를 문장에 대입해 '주어와의 수동·능동 관계'를 확인하는 것이 핵심입니다. 전치사 뒤라면 동명사(-ing), 조동사 뒤라면 동사원형을 선택하세요.`,

  "빈칸 (4)에 들어갈 알맞은 단어를 고르세요.":
    `[품사 파악] 빈칸 앞뒤 구조를 분석해 어떤 품사가 필요한지 파악하는 것이 우선입니다. 관사(a/the) 또는 소유격 뒤라면 명사, 동사 뒤 명사 앞이라면 형용사 또는 부사, 조동사·to 뒤라면 동사원형을 선택합니다. 선택지의 어근이 같고 어미만 다를 경우 반드시 품사를 기준으로 판단하세요.`,

  // ── PART 7 ──────────────────────────────────────────────────────────────

  "What is the purpose of this notice?":
    `[주제·목적 파악] 지문의 첫 문단에서 전체 목적을 파악할 수 있습니다. 'Notice to All Staff', 'This is to inform' 등의 표현이 있다면 목적을 명시하는 신호입니다. 오답 선택지는 지문에 없는 내용이거나 세부 내용을 목적으로 혼동하도록 유도합니다. 항상 첫 문단을 먼저 읽어 전체 목적을 파악하세요.`,

  "What is the main topic of the article?":
    `[핵심 주제 파악] 기사의 첫 문단(특히 첫 문장)에 핵심 주제가 나옵니다. 'announced', 'plans to', 'will open' 등 핵심 동사를 중심으로 무슨 일이 일어나는지 파악하세요. 오답은 세부 내용(채용, 메뉴 변경 등)을 주제로 혼동하게 합니다.`,

  "What is being advertised?":
    `[광고 대상 파악] 광고 지문은 첫 줄 제목이나 첫 문장에 광고 대상이 명시됩니다. 서비스명, 제품명, 시설명에 주목하세요. 오답은 광고에 언급된 부가 정보(부대 서비스, 위치 등)를 광고 대상으로 혼동하게 합니다.`,

  "What is the purpose of the email?":
    `[이메일 목적 파악] Subject 줄과 첫 문단에서 이메일 목적을 찾을 수 있습니다. 'I am writing to...', 'I am contacting you regarding...' 등의 표현이 목적을 나타냅니다. 오답은 이메일 내용 일부(환불, 취소 등)를 목적으로 혼동하게 합니다.`,

  "What event is being announced?":
    `[행사 내용 파악] 공지문 제목과 첫 문단에 행사 이름과 성격이 나옵니다. 'Grand Opening', 'Annual', 'Celebration' 등의 핵심 표현을 찾으세요. 오답은 행사 일부(프로그램, 주최)를 행사 자체로 혼동하게 합니다.`,

  "Why did Ms. Nguyen write this email?":
    `[이메일 작성 이유] 'I am writing regarding...', 'I am contacting you about...' 등 첫 문장에서 이메일 목적을 확인합니다. 구체적인 사건(누락 상품, 불만 등)을 파악하세요. 오답은 유사하지만 다른 행동(환불 요청, 취소 등)으로 혼동하게 합니다.`,

  "Why was the email sent to Mr. Thornton?":
    `[이메일 목적] Subject(제목)과 첫 문단을 함께 읽어 발신 목적을 파악하세요. 'invite', 'inform', 'request' 등 핵심 동사를 찾는 것이 중요합니다. 오답은 이메일에 포함된 부가 정보(서류 안내, 인터뷰 내용 등)를 목적으로 혼동하게 합니다.`,

  "Why did Mr. Park contact Harvest Catering?":
    `[연락 목적] 첫 이메일의 목적은 항상 첫 문단에 나옵니다. 'I am contacting you to inquire about...'처럼 목적어로 이어지는 표현을 찾으세요. 세부 조건(채식 옵션, 예산 등)은 목적이 아닌 요구사항입니다.`,

  "What is the purpose of the press release?":
    `[보도자료 목적] 'today announced', 'is pleased to announce' 등의 표현이 보도자료의 핵심 목적을 나타냅니다. 회사 이름과 발표 내용(제품 출시, 합병 등)을 연결해 목적을 파악하세요. 오답은 회사 배경 정보나 인용구를 목적으로 혼동하게 합니다.`,

  "Why was the Q4 Sales Strategy Meeting rescheduled?":
    `[회의 일정 변경 이유] 지문에서 'due to', 'because of', 'as a result of' 등 이유를 나타내는 표현 뒤에 정답이 있습니다. 'scheduling conflict with the annual board meeting'처럼 구체적인 이유를 찾으세요. 오답은 회의와 관련된 다른 세부 사항(장소, 발표 준비 등)을 이유로 혼동하게 합니다.`,

  "By what date must employees apply for holiday office access?":
    `[날짜 세부 정보] 공지문에서 날짜와 함께 쓰인 조건 표현을 찾으세요. 'by [날짜]', 'no later than [날짜]', 'before [날짜]' 등이 마감일을 나타냅니다. 지문에 여러 날짜가 등장할 수 있으므로 '어떤 날짜가 어떤 조건에 해당하는지' 정확히 연결하세요.`,

  "What is available during the holiday period?":
    `[세부 정보 확인] 지문에서 'available', 'provided', 'offered' 등의 표현 뒤에 이용 가능한 서비스가 나옵니다. 반대로 'unavailable', 'closed', 'suspended' 등은 이용 불가 서비스를 나타냅니다. NOT 문제가 아닌 경우 '이용 가능'한 것만 골라야 합니다.`,

  "What requires advance registration?":
    `[조건 파악] '사전 등록이 필요한 항목'은 'requires advance sign-up', 'reservation required', 'limited seating' 등의 표현으로 나타납니다. 지문에서 대부분 활동은 등록 불필요, 특정 활동만 필요한 구조가 많으므로 예외 항목을 찾으세요.`,

  "What time do the guided tours begin?":
    `[시간 세부 정보] 지문에서 시간과 활동명을 연결해 파악하세요. 'starting at', 'beginning at', 'from ... to' 등의 표현 뒤에 시간이 나옵니다. 여러 시간이 나올 경우 각 시간이 어떤 활동에 해당하는지 혼동하지 않도록 주의하세요.`,

  "How many new stores does Sunrise Bakeries plan to open?":
    `[숫자 세부 정보] 지문에서 숫자 표현을 주의 깊게 읽으세요. 'five new locations'처럼 구체적인 숫자가 정답 근거가 됩니다. 오답은 지문에 나오는 다른 숫자(기존 매장 수, 신규 도시 수 등)와 혼동하도록 유도합니다.`,

  "When will the first new stores open to customers?":
    `[시기 파악] 지문에서 시간 순서를 나타내는 표현('starting', 'beginning', 'by')에 주목하세요. 공사 시작 시기와 개장 시기가 다르게 나오는 경우가 많으므로 '고객에게 문을 여는' 시기를 정확히 찾아야 합니다.`,

  "What do customers receive for returning a device?":
    `[혜택·보상 파악] 'receive', 'get', 'earn', 'be given' 등의 표현 뒤에 혜택이 나옵니다. '$10 store credit'처럼 구체적인 보상 내용을 찾으세요. 오답은 지문에 언급된 다른 혜택(할인, 수리 등)과 혼동하게 합니다.`,

  "What does Meridian plan to add to the program in the future?":
    `[미래 계획 파악] 'plans to', 'will', 'intends to', 'hopes to' 등의 표현 뒤에 미래 계획이 나옵니다. 현재 제공 중인 서비스와 향후 추가 예정인 서비스를 구분하세요.`,

  "How long will standard delivery take?":
    `[기간·시간 세부 정보] 배송 기간은 'within', 'in', '5 to 7 business days' 처럼 범위로 표현되는 경우가 많습니다. 'business days(영업일)'와 일반 days를 혼동하지 않도록 주의하세요.`,

  "What should Ms. Hoffman do to modify her order?":
    `[행동 지침 파악] '~하려면 어떻게 해야 하는지'는 'please contact', 'you may', 'to do X, please Y' 등의 표현으로 나타납니다. 조건(24시간 이내)과 방법(이메일)을 함께 파악하는 것이 중요합니다.`,

  "What benefit do guests receive when staying three or more nights?":
    `[조건부 혜택] '~하면(조건) ~를 받는다(혜택)'는 구조를 찾으세요. 'guests staying three or more nights receive' 처럼 조건과 혜택이 하나의 문장에 나타납니다. 숙박 기간 조건을 정확히 확인하세요.`,

  "What type of room did Mr. Okafor book?":
    `[세부 정보 대조] 두 지문(광고+후기)이 있을 경우 후기에서 언급된 내용을 광고와 대조합니다. 'My Deluxe Ocean View Room'처럼 방 종류가 직접 언급되는 경우가 많습니다.`,

  "What problem did Mr. Okafor mention during his stay?":
    `[불만·문제 파악] 후기에서 부정적인 내용은 'however', 'unfortunately', 'minor inconvenience' 등으로 전환됩니다. 전반적으로 긍정적인 후기에서 'but', 'however' 뒤의 문장에 문제점이 나옵니다.`,

  "How could a guest receive a 15% discount?":
    `[할인 조건] 광고에서 할인 조건은 'Book by [날짜]', 'when you...', 'if you...' 등으로 나타납니다. 날짜, 방법(직접 예약), 조건을 모두 포함한 선택지를 찾으세요.`,

  "What is the minimum work experience required for this position?":
    `[자격 요건] 채용 공고에서 'Minimum', 'At least', 'Required' 등의 표현 뒤에 최소 자격 요건이 나옵니다. 숫자(years)를 정확히 확인하세요. 오답은 지원자의 실제 경력과 혼동하도록 유도합니다.`,

  "By what date should applications be submitted?":
    `[마감일] 'by', 'before', 'no later than' 뒤의 날짜가 마감일입니다. 이메일 발송 날짜와 마감일을 혼동하지 않도록 주의하세요.`,

  "Where did Ms. Chen work previously?":
    `[이전 경력] 지원 이메일에서 'I have been working at...', 'Previously, I worked at...' 등 과거 경력 표현을 찾으세요. 학교(대학)와 직장을 혼동하지 않도록 주의하세요.`,

  "What design tools does Ms. Chen mention?":
    `[구체적 언급 내용] 두 번째 지문(지원 이메일)에서 직접 언급된 도구를 찾으세요. 여러 도구가 나올 경우 '둘 다 언급된' 선택지가 정답입니다. 지원자가 언급하지 않은 도구는 오답입니다.`,

  "What does Ms. Chen attach to her application?":
    `[첨부 내용] 'I have attached', 'Please find attached', 'enclosed' 등의 표현 뒤에 첨부 파일이 나옵니다. 여러 파일이 언급될 경우 모두 포함된 선택지를 찾으세요.`,

  "How much does the team plan cost per user per month?":
    `[가격 비교] 지문에 여러 가격이 나올 경우 조건을 정확히 대조해야 합니다. 개인 요금과 팀 요금, 일반 요금과 할인 요금을 혼동하지 않도록 주의하세요.`,

  "What does Ms. Kim want to arrange?":
    `[추가 요청 사항] 이메일 말미에 'I would also like to...', 'Additionally, could you...' 등으로 추가 요청이 나옵니다. 질문에 대한 답변 외에 추가로 요청한 사항을 찾으세요.`,

  "How many employees are on Ms. Kim's team?":
    `[숫자 세부 정보] 지문에서 팀 규모는 'our team of [숫자]', 'a group of [숫자] people' 등으로 표현됩니다. 팀 플랜 적용 기준 숫자(5명 이상)와 실제 팀원 수를 혼동하지 마세요.`,

  "What does Ms. Kim mention about her current situation?":
    `[현황 파악] 'We are currently...', 'At the moment...', 'Right now...' 등의 표현 뒤에 현재 상황이 나옵니다. 구매 결정 전 단계임을 나타내는 표현을 찾으세요.`,

  "What is included in Harvest Catering's quoted price?":
    `[포함 항목] 'includes', 'covers', 'This price encompasses' 등의 표현 뒤에 포함 항목이 나옵니다. 여러 항목이 나열될 경우 모두 언급된 선택지를 찾으세요.`,

  "What must Mr. Park provide by June 20?":
    `[마감 요건] 'we require', 'please provide', 'we need' 등의 표현과 함께 날짜 조건이 나옵니다. 계약서와 보증금 등 두 가지 이상의 조건이 나올 경우 모두 포함된 선택지가 정답입니다.`,

  "What is the main purpose of the Innovate Forward Conference?":
    `[행사 목적] 설명문에서 'designed to', 'aims to', 'focused on' 등의 표현 뒤에 목적이 나옵니다. 특정 프로그램(워크숍, 연사)을 목적으로 혼동하지 않도록 전체 행사의 큰 목적을 파악하세요.`,

  "What is the total cost for a group of 6 people to register?":
    `[계산 문제] TOEIC Part 7에서 계산 문제는 주어진 단가와 수량을 곱해야 합니다. 그룹 요금($249/인) × 6명 = $1,494입니다. 개인 요금이나 얼리버드 요금과 혼동하지 않도록 조건(5명 이상)을 먼저 확인하세요.`,

  "What is available to attendees after the conference?":
    `[사후 혜택] 'post-event', 'after the conference', 'following the event' 등의 표현 뒤에 사후 혜택이 나옵니다. 행사 중 혜택과 행사 후 혜택을 구분해서 읽으세요.`,

  "What is the registration deadline?":
    `[마감일 구분] 지문에 여러 날짜가 나올 수 있습니다(얼리버드 마감, 등록 마감, 행사 날짜). 질문에서 묻는 것이 '등록 마감일'임을 확인하고, 'Registration Deadline', 'last day to register' 등의 표현을 찾으세요.`,

  "What is the purpose of this notice?":
    `[공지 목적] 공지문 첫 문장 또는 제목에서 목적을 파악합니다. 'This is to inform', 'Please be advised', 'Notice to all' 등의 표현과 함께 주요 내용이 제시됩니다. 오답 선택지는 공지 내용의 세부 사항(날짜, 조건 등)을 목적으로 혼동하게 합니다.`,

  "What must managers submit to Kevin Oh?":
    `[제출 요건] 'Please submit', 'send to', 'forward to' 등의 지시 표현 뒤에 제출 내용이 나옵니다. 수신인(Kevin Oh)과 제출 내용(slides/발표 자료)을 정확히 연결하세요.`,

  "By when must managers notify Kevin if attending remotely?":
    `[날짜 연결] 여러 날짜(회의 날짜, 자료 제출 마감, 원격 참여 통보 기한)가 나올 경우 각 날짜가 어떤 조건에 해당하는지 구분하세요. 'if you will be joining remotely, please notify by [날짜]' 구조에서 날짜를 찾으세요.`,

  "Why will Mr. Whitfield attend remotely?":
    `[이유 파악] 두 번째 지문(답장 이메일)에서 이유를 찾습니다. 'because', 'due to', 'as I have', 'since' 등 이유를 나타내는 표현을 찾으세요. 'I have a client visit...that I cannot reschedule'이 이유입니다.`,

  "How did Mr. Whitfield's region perform in Q3?":
    `[성과 파악] 수치와 비교 표현을 주목하세요. 'exceeded targets by 12%', 'fell short of', 'met targets' 등의 표현으로 성과를 나타냅니다. '목표 초과/미달/달성' 중 어느 것인지 정확히 파악하세요.`,

  "Why did Mr. Park contact Harvest Catering?":
    `[첫 이메일 목적] 첫 이메일의 목적은 항상 첫 문단에 나옵니다. 'I am contacting you...to inquire about'처럼 목적절로 이어지는 표현을 찾으세요. 구체적 조건(채식 옵션, 예산 등)은 목적이 아닌 요구사항입니다.`,

  "How many guests are expected at the event?":
    `[숫자 파악] 'approximately', 'about', 'around' 등의 표현과 함께 예상 인원이 나옵니다. 정확한 숫자 또는 근사값을 찾으세요. 예산이나 다른 숫자와 혼동하지 않도록 주의하세요.`,

  "What does Cedarwood Books confirm in the email?":
    `[이메일 확인 내용] 'We are pleased to confirm', 'This email confirms', 'Your order has been' 등의 표현 뒤에 확인 내용이 나옵니다. 제목(Subject)에서도 핵심 내용을 파악할 수 있습니다.`,

  "Why did Mr. Whitfield attend remotely?":
    `[두 번째 지문에서 이유 찾기] 첫 번째 지문(메모)이 아닌 두 번째 지문(답장 이메일)에서 Mr. Whitfield의 이유를 찾습니다. 'I will be attending remotely, as...'처럼 이유 접속사 뒤의 내용이 정답입니다.`,

  "What is the purpose of the email?":
    `[이메일 목적 파악] Subject(제목)과 첫 문단을 함께 읽으면 목적을 빠르게 파악할 수 있습니다. 'We are pleased to confirm', 'I am writing to notify' 등의 표현이 목적을 직접 나타냅니다. 오답은 이메일에 포함된 부수 정보(배송 기간, 수정 방법 등)를 목적으로 혼동하게 합니다.`,
};

async function main() {
  const questions = await prisma.question.findMany({
    select: { id: true, questionText: true }
  });

  let updated = 0;
  for (const q of questions) {
    const exp = explanations[q.questionText.trim()];
    if (exp) {
      await prisma.question.update({ where: { id: q.id }, data: { explanation: exp } });
      updated++;
    }
  }
  console.log(`완료: ${updated}개 해설 업데이트`);
  await prisma.$disconnect();
}

main().catch(console.error);
