/*
  Warnings:

  - The `triggerType` column on the `Policy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `actionType` column on the `Policy` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `priority` to the `Policy` table without a default value. This is not possible if the table is not empty.
  - Made the column `workspaceId` on table `Policy` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `workspaceId` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "priority" TEXT NOT NULL,
ADD COLUMN     "timeWindow" TEXT,
DROP COLUMN "triggerType",
ADD COLUMN     "triggerType" TEXT,
ALTER COLUMN "triggerValue" DROP NOT NULL,
DROP COLUMN "actionType",
ADD COLUMN     "actionType" TEXT,
ALTER COLUMN "workspaceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "workspaceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
