/*
  Warnings:

  - Added the required column `courseDepartment` to the `CourseModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseModule" ADD COLUMN     "courseDepartment" TEXT NOT NULL;
