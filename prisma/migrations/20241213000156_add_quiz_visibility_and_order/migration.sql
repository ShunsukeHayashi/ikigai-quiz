-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Quiz" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "correctOption" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Quiz" ("category", "correctOption", "id", "options", "question") SELECT "category", "correctOption", "id", "options", "question" FROM "Quiz";
DROP TABLE "Quiz";
ALTER TABLE "new_Quiz" RENAME TO "Quiz";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
