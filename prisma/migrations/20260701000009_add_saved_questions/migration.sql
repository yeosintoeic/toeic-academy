CREATE TABLE "SavedQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionText" TEXT NOT NULL DEFAULT '',
    "sessionId" TEXT,
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SavedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "SavedQuestion_userId_questionId_key" ON "SavedQuestion"("userId", "questionId");
CREATE INDEX "SavedQuestion_userId_idx" ON "SavedQuestion"("userId");
