-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SavedQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL DEFAULT '',
    "sessionId" TEXT,
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "SavedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SavedQuestion" ("id", "questionId", "questionText", "savedAt", "sessionId", "userId") SELECT "id", "questionId", "questionText", "savedAt", "sessionId", "userId" FROM "SavedQuestion";
DROP TABLE "SavedQuestion";
ALTER TABLE "new_SavedQuestion" RENAME TO "SavedQuestion";
CREATE INDEX "SavedQuestion_userId_idx" ON "SavedQuestion"("userId");
CREATE UNIQUE INDEX "SavedQuestion_userId_questionId_key" ON "SavedQuestion"("userId", "questionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
