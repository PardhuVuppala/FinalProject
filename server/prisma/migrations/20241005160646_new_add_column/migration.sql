/*
  Warnings:

  - Added the required column `modules` to the `EmployeeCourse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeCourse" ADD COLUMN     "modules" JSONB NOT NULL;
