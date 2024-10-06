/*
  Warnings:

  - You are about to drop the column `module` on the `CourseModule` table. All the data in the column will be lost.
  - Added the required column `modules` to the `CourseModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseModule" DROP COLUMN "module",
ADD COLUMN     "modules" JSONB NOT NULL;
