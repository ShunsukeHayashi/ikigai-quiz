/*
  Warnings:

  - A unique constraint covering the columns `[userId,category]` on the table `Result` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_category_key" ON "Result"("userId", "category");
