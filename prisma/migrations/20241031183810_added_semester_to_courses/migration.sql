-- AlterTable
ALTER TABLE "Branch" ALTER COLUMN "semester" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "semester" INTEGER NOT NULL DEFAULT 1;
