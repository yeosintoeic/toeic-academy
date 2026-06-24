-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TestSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "mode" TEXT NOT NULL DEFAULT 'full',
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "part5Score" INTEGER NOT NULL DEFAULT 0,
    "part6Score" INTEGER NOT NULL DEFAULT 0,
    "part7Score" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "TestSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TestSession" ("completedAt", "id", "part5Score", "part6Score", "part7Score", "startedAt", "totalQuestions", "totalScore", "userId") SELECT "completedAt", "id", "part5Score", "part6Score", "part7Score", "startedAt", "totalQuestions", "totalScore", "userId" FROM "TestSession";
DROP TABLE "TestSession";
ALTER TABLE "new_TestSession" RENAME TO "TestSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
