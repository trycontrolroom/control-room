/*
  Warnings:

  - A unique constraint covering the columns `[id,workspaceId]` on the table `Policy` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Policy_id_workspaceId_key" ON "Policy"("id", "workspaceId");
