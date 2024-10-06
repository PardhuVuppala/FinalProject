-- CreateTable
CREATE TABLE "EmployeeCourse" (
    "id" TEXT NOT NULL,
    "EmployeeID" TEXT NOT NULL,
    "courseid" TEXT NOT NULL,
    "percentage_completed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timespend" INTEGER NOT NULL,

    CONSTRAINT "EmployeeCourse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EmployeeCourse_EmployeeID_courseid_idx" ON "EmployeeCourse"("EmployeeID", "courseid");

-- AddForeignKey
ALTER TABLE "EmployeeCourse" ADD CONSTRAINT "EmployeeCourse_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeCourse" ADD CONSTRAINT "EmployeeCourse_courseid_fkey" FOREIGN KEY ("courseid") REFERENCES "CourseModule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
