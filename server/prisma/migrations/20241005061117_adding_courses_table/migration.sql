-- CreateTable
CREATE TABLE "CourseModule" (
    "id" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "module" JSONB NOT NULL,

    CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id")
);
