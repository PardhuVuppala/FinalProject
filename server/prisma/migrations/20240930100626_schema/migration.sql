-- CreateTable
CREATE TABLE "Assessments" (
    "id" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "courseDepartment" TEXT NOT NULL,
    "questionsAndOptions" JSONB NOT NULL,
    "correctOption" TEXT NOT NULL,

    CONSTRAINT "Assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "employeeEmail" TEXT NOT NULL,
    "employeeName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skillset" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "skillSet" TEXT[],
    "specialized" TEXT[],

    CONSTRAINT "Skillset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UpdateSkillsetWithoutCertification" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "UpdateSkillsetWithoutCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "certificationLink" TEXT NOT NULL,
    "skills" TEXT NOT NULL,
    "courseDepartment" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "certificationDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillScore" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "courseDepartment" TEXT NOT NULL,
    "testName" TEXT NOT NULL,
    "testScore" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "noOfAttempts" INTEGER NOT NULL,

    CONSTRAINT "SkillScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeEmail_key" ON "Employee"("employeeEmail");

-- CreateIndex
CREATE INDEX "Skillset_employeeId_idx" ON "Skillset"("employeeId");

-- CreateIndex
CREATE INDEX "UpdateSkillsetWithoutCertification_employeeId_idx" ON "UpdateSkillsetWithoutCertification"("employeeId");

-- CreateIndex
CREATE INDEX "Certification_employeeId_idx" ON "Certification"("employeeId");

-- CreateIndex
CREATE INDEX "SkillScore_employeeId_assessmentId_idx" ON "SkillScore"("employeeId", "assessmentId");

-- AddForeignKey
ALTER TABLE "Skillset" ADD CONSTRAINT "Skillset_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UpdateSkillsetWithoutCertification" ADD CONSTRAINT "UpdateSkillsetWithoutCertification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillScore" ADD CONSTRAINT "SkillScore_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillScore" ADD CONSTRAINT "SkillScore_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
