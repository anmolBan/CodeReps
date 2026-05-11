/*
  Warnings:

  - You are about to drop the column `questionId` on the `Problem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[problemId]` on the table `Problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `problemId` to the `Problem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Problem_questionId_key";

-- DropIndex
DROP INDEX "Problem_title_key";

-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "questionId",
ADD COLUMN     "constraints" TEXT[],
ADD COLUMN     "followUp" TEXT,
ADD COLUMN     "hints" TEXT[],
ADD COLUMN     "problemId" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_problemId_key" ON "Problem"("problemId");
