-- AlterTable
ALTER TABLE "Problem"
ADD COLUMN     "judgeFunctionName" TEXT,
ADD COLUMN     "judgeMetadata" JSONB;
