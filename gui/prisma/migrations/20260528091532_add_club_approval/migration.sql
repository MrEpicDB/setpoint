-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "Club" ADD COLUMN     "requiresApproval" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ClubMember" ADD COLUMN     "status" "MembershipStatus" NOT NULL DEFAULT 'APPROVED';
