/*
  Warnings:

  - Added the required column `imageurl` to the `CourseModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CourseModule" ADD COLUMN     "imageurl" TEXT NOT NULL;
