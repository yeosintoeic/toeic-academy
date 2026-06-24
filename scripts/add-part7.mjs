import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const adapter = new PrismaBetterSqlite3({ url: `file:${path.join(__dirname, "../dev.db")}` });
const prisma = new PrismaClient({ adapter });

const newGroups = [
  // Group 1: Notice (3문제)
  {
    passageType: "notice",
    passageText: `WORKPLACE SAFETY TRAINING — MANDATORY ATTENDANCE

All employees at Oakfield Manufacturing are required to attend the annual workplace safety training session scheduled for Friday, March 7, from 9 A.M. to 12 P.M. in Conference Room B.

Topics covered will include emergency evacuation procedures, proper handling of hazardous materials, and updates to fire safety regulations effective April 1.

Employees who are unable to attend due to scheduled shift work must complete the online version of the training by March 14. The online module is accessible via the company intranet under "Training & Development."

Please confirm your attendance by responding to this notice no later than March 3. For questions, contact the Safety Department at ext. 312.`,
    questions: [
      { questionText: "What is the purpose of this notice?", optionA: "To announce a change in shift schedules", optionB: "To inform employees about mandatory safety training", optionC: "To introduce new hazardous material guidelines", optionD: "To promote the company intranet portal", answer: "B", explanation: "'All employees...are required to attend the annual workplace safety training session'에서 의무 안전 교육을 알리는 목적임을 확인할 수 있습니다.", category: "" },
      { questionText: "What must employees who cannot attend do by March 14?", optionA: "Submit a written excuse to HR", optionB: "Reschedule with the Safety Department", optionC: "Complete the online training module", optionD: "Attend the next available session", answer: "C", explanation: "'must complete the online version of the training by March 14'이라고 명시되어 있습니다.", category: "" },
      { questionText: "Where can the online training be found?", optionA: "On the company's public website", optionB: "Via the company intranet", optionC: "At the Safety Department office", optionD: "Through an external training platform", answer: "B", explanation: "'The online module is accessible via the company intranet under Training & Development'이라고 명시되어 있습니다.", category: "" },
    ],
  },
  // Group 2: Article (3문제)
  {
    passageType: "article",
    passageText: `MERIDIAN ELECTRONICS OPENS RECYCLING PROGRAM

PORTLAND — Meridian Electronics announced on Monday the launch of a nationwide device recycling program aimed at reducing electronic waste. Customers can drop off old smartphones, laptops, and tablets at any of Meridian's 240 retail stores across the country beginning September 1.

Devices in working condition will be refurbished and resold at a discount, while non-functional items will be responsibly dismantled and their components recycled. Customers who participate will receive a $10 store credit for each device they return.

"Electronic waste is one of the fastest-growing environmental challenges of our time," said Meridian's Chief Sustainability Officer, Dr. Elena Torres. "This program reflects our commitment to building a more sustainable future."

The company plans to expand the program to include printers and home appliances by the end of next year.`,
    questions: [
      { questionText: "What did Meridian Electronics announce?", optionA: "The launch of a new product line", optionB: "The opening of new retail stores", optionC: "A nationwide device recycling program", optionD: "A partnership with an environmental organization", answer: "C", explanation: "'Meridian Electronics announced...the launch of a nationwide device recycling program'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What do customers receive for returning a device?", optionA: "A discount on a new purchase", optionB: "A $10 store credit", optionC: "A free repair service", optionD: "A loyalty membership upgrade", answer: "B", explanation: "'Customers who participate will receive a $10 store credit for each device they return'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What does Meridian plan to add to the program in the future?", optionA: "Gaming consoles and cameras", optionB: "Printers and home appliances", optionC: "Office furniture and equipment", optionD: "Electric vehicles and batteries", answer: "B", explanation: "'The company plans to expand the program to include printers and home appliances by the end of next year'이라고 명시되어 있습니다.", category: "" },
    ],
  },
  // Group 3: Email (3문제)
  {
    passageType: "email",
    passageText: `To: Linda Hoffman <l.hoffman@email.com>
From: Orders@cedarwoodbooks.com
Date: August 15
Subject: Order Confirmation — Order #CWB-4492

Dear Ms. Hoffman,

Thank you for your order from Cedarwood Books. We are pleased to confirm that your order (#CWB-4492) has been successfully placed.

Order Summary:
• "The Art of Strategic Thinking" (Hardcover) — $34.99
• "Modern Business Writing" (Paperback) — $18.50
• Subtotal: $53.49
• Shipping: Free (Standard Delivery — 5 to 7 business days)
• Total: $53.49

Your order will be shipped to the address on file within 2 business days. You will receive a separate email with tracking information once your order has been dispatched.

If you need to make any changes to your order, please contact us at support@cedarwoodbooks.com within 24 hours of placing your order.

Thank you for shopping with Cedarwood Books.

Customer Service Team
Cedarwood Books`,
    questions: [
      { questionText: "What is the purpose of the email?", optionA: "To notify Ms. Hoffman of a shipping delay", optionB: "To confirm a book order", optionC: "To promote a new book release", optionD: "To inform Ms. Hoffman of a price change", answer: "B", explanation: "'We are pleased to confirm that your order...has been successfully placed'에서 주문 확인 이메일임을 알 수 있습니다.", category: "" },
      { questionText: "How long will standard delivery take?", optionA: "1 to 2 business days", optionB: "2 to 3 business days", optionC: "3 to 5 business days", optionD: "5 to 7 business days", answer: "D", explanation: "'Standard Delivery — 5 to 7 business days'라고 명시되어 있습니다.", category: "" },
      { questionText: "What should Ms. Hoffman do to modify her order?", optionA: "Call the Cedarwood Books store directly", optionB: "Email support within 24 hours", optionC: "Reply to the confirmation email", optionD: "Log in to her account online", answer: "B", explanation: "'please contact us at support@cedarwoodbooks.com within 24 hours of placing your order'이라고 명시되어 있습니다.", category: "" },
    ],
  },
  // Group 4: Double Passage (4문제)
  {
    passageType: "double passage",
    passageText: `[Advertisement]
HARBORVIEW HOTEL & SPA — YOUR PERFECT RETREAT

Located just steps from the waterfront, Harborview Hotel & Spa offers luxurious accommodations and world-class amenities for both leisure and business travelers.

Room Options:
• Standard Room: from $120/night
• Deluxe Ocean View Room: from $180/night
• Executive Suite: from $280/night

All rooms include complimentary breakfast, high-speed Wi-Fi, and access to our rooftop pool and fitness center. Guests staying three or more nights receive a complimentary one-hour spa treatment.

Special Offer: Book directly through our website by October 15 and receive 15% off your total stay.

Reservations: www.harborviewhotel.com | Tel: 555-0210

---

[Guest Review]
Posted by: Michael Okafor
Rating: ★★★★★

I stayed at Harborview Hotel for four nights in September for a business conference. From check-in to check-out, the service was exceptional. My Deluxe Ocean View Room had a stunning view and was immaculately clean. The complimentary breakfast was generous and delicious.

As a guest staying more than three nights, I also enjoyed the complimentary spa treatment, which was a wonderful surprise after long conference days. I did notice the fitness center was temporarily closed for renovation during my stay, which was a minor inconvenience.

I will definitely return on my next visit to the city.`,
    questions: [
      { questionText: "What benefit do guests receive when staying three or more nights?", optionA: "A room upgrade at no extra charge", optionB: "A complimentary one-hour spa treatment", optionC: "A 15% discount on their stay", optionD: "Free airport transportation", answer: "B", explanation: "'Guests staying three or more nights receive a complimentary one-hour spa treatment'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What type of room did Mr. Okafor book?", optionA: "Standard Room", optionB: "Executive Suite", optionC: "Deluxe Ocean View Room", optionD: "Business Conference Room", answer: "C", explanation: "'My Deluxe Ocean View Room had a stunning view'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What problem did Mr. Okafor mention during his stay?", optionA: "The breakfast selection was limited", optionB: "The spa was fully booked", optionC: "The Wi-Fi connection was unstable", optionD: "The fitness center was closed for renovation", answer: "D", explanation: "'the fitness center was temporarily closed for renovation during my stay'라고 명시되어 있습니다.", category: "" },
      { questionText: "How could a guest receive a 15% discount?", optionA: "By booking a suite for five nights", optionB: "By calling the reservation line", optionC: "By booking via the hotel website before October 15", optionD: "By mentioning the advertisement at check-in", answer: "C", explanation: "'Book directly through our website by October 15 and receive 15% off your total stay'라고 명시되어 있습니다.", category: "" },
    ],
  },
  // Group 5: Double Passage (5문제)
  {
    passageType: "double passage",
    passageText: `[Internal Memo]
To: All Regional Sales Managers
From: Sandra Lee, VP of Sales
Date: November 3
Subject: Q4 Sales Strategy Meeting

Please be advised that the Q4 Sales Strategy Meeting has been rescheduled from November 12 to November 19 due to a scheduling conflict with the annual board meeting. The meeting will take place at 10 A.M. in the Main Conference Room at the downtown headquarters.

All managers are expected to prepare a brief summary of their region's Q3 performance and projected Q4 targets. Presentations should be no longer than 10 minutes each. Please submit your slides to my assistant, Kevin Oh, at k.oh@company.com by November 15.

If you are unable to attend in person, remote participation is available via the company's video conferencing platform. Please notify Kevin by November 10 if you will be joining remotely.

---

[Reply Email]
To: Sandra Lee <s.lee@company.com>
From: James Whitfield <j.whitfield@company.com>
Date: November 4
Subject: RE: Q4 Sales Strategy Meeting

Dear Sandra,

Thank you for the update regarding the meeting reschedule. I will be attending remotely, as I have a client visit in Riverside on November 19 that I cannot reschedule.

I will send my slides to Kevin before the November 15 deadline. My presentation will cover the Southeast region's Q3 results, which exceeded our targets by 12%, and our Q4 strategy focused on expanding our client base in the hospitality sector.

Please let me know if there is anything else I need to prepare beforehand.

Best regards,
James Whitfield
Southeast Regional Sales Manager`,
    questions: [
      { questionText: "Why was the Q4 Sales Strategy Meeting rescheduled?", optionA: "Due to a venue availability issue", optionB: "Due to a conflict with the annual board meeting", optionC: "Because the VP of Sales was unavailable", optionD: "Because several managers requested more preparation time", answer: "B", explanation: "'rescheduled from November 12 to November 19 due to a scheduling conflict with the annual board meeting'이라고 명시되어 있습니다.", category: "" },
      { questionText: "What must managers submit to Kevin Oh?", optionA: "A written report on their annual performance", optionB: "A completed budget proposal", optionC: "Their presentation slides", optionD: "A list of regional client contacts", answer: "C", explanation: "'Please submit your slides to my assistant, Kevin Oh'이라고 명시되어 있습니다.", category: "" },
      { questionText: "By when must managers notify Kevin if attending remotely?", optionA: "November 3", optionB: "November 10", optionC: "November 15", optionD: "November 19", answer: "B", explanation: "'Please notify Kevin by November 10 if you will be joining remotely'라고 명시되어 있습니다.", category: "" },
      { questionText: "Why will Mr. Whitfield attend remotely?", optionA: "He is traveling internationally on November 19", optionB: "He has a client visit in Riverside that day", optionC: "He is presenting at another company event", optionD: "He prefers to use the video conferencing platform", answer: "B", explanation: "'I have a client visit in Riverside on November 19 that I cannot reschedule'라고 명시되어 있습니다.", category: "" },
      { questionText: "How did Mr. Whitfield's region perform in Q3?", optionA: "It fell short of targets by 12%", optionB: "It met targets exactly", optionC: "It exceeded targets by 12%", optionD: "It exceeded targets by 20%", answer: "C", explanation: "'Southeast region's Q3 results, which exceeded our targets by 12%'라고 명시되어 있습니다.", category: "" },
    ],
  },
];

async function main() {
  for (const g of newGroups) {
    await prisma.questionGroup.create({
      data: {
        part: 7,
        passageType: g.passageType,
        passageText: g.passageText,
        questions: {
          create: g.questions.map((q) => ({ part: 7, ...q })),
        },
      },
    });
  }

  const total7 = await prisma.question.count({ where: { part: 7 } });
  const total = await prisma.question.count();
  console.log(`Part 7 총: ${total7}문제`);
  console.log(`전체 총: ${total}문제`);
  await prisma.$disconnect();
}

main().catch(console.error);
