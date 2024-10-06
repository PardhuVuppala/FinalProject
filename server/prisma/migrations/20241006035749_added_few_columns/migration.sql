/*
  Warnings:

  - Added the required column `courseDepartment` to the `EmployeeCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `courseName` to the `EmployeeCourse` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageurl` to the `EmployeeCourse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmployeeCourse" ADD COLUMN     "courseDepartment" TEXT NOT NULL,
ADD COLUMN     "courseName" TEXT NOT NULL,
ADD COLUMN     "imageurl" TEXT NOT NULL;
