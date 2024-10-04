const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to get course statistics
const getCourseStatistics = async (req, res) => {
  try {
    // Step 1: Get all the courses from Assessments
    const assessmentsCourses = await prisma.assessments.findMany({
      select: { courseName: true },
    });

    // Step 2: Get the count of people for each course from Certifications
    const certificationData = await prisma.certification.groupBy({
      by: ['courseName'],
      _count: {
        employeeId: true, // Count the number of employees for each course
      },
    });

    // Step 3: Combine data from Assessments and Certifications
    const courseData = assessmentsCourses.map(course => {
      const matchingCourse = certificationData.find(
        (cert) => cert.courseName === course.courseName
      );
      return {
        courseName: course.courseName,
        count: matchingCourse ? matchingCourse._count.employeeId : 0, // If course not taken, count is 0
      };
    });

    return res.json(courseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch course statistics' });
  }
};

// Function to get skill statistics per course
const getSkillStatistics = async (req, res) => {
  try {
    // Get all skills from Skillset
    const skillsets = await prisma.skillset.findMany({
      select: {
        skillSet: true,
        specialized: true,
      },
    });

    // Get all courses from Assessments
    const assessments = await prisma.assessments.findMany({
      select: {
        courseName: true,
      },
    });

    // Create a skill-to-course map
    const skillCount = {};

    assessments.forEach(assessment => {
      const courseName = assessment.courseName;
      skillCount[courseName] = 0;

      // Count skills in Skillset that match the courseName
      skillsets.forEach(skillset => {
        if (skillset.skillSet.includes(courseName) || skillset.specialized.includes(courseName)) {
          skillCount[courseName] += 1;
        }
      });
    });

    // Format the data for frontend consumption
    const formattedData = Object.entries(skillCount).map(([courseName, count]) => ({
      courseName,
      count,
    }));

    return res.json(formattedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch skill statistics' });
  }
};
const getSkillScoreStatistics = async (req, res) => {
  try {
    // Count of tests per course
    const testCount = await prisma.skillScore.groupBy({
      by: ['courseName'],
      _count: {
        id: true,
      },
    });

    // Average test score per course
    const averageTestScore = await prisma.skillScore.groupBy({
      by: ['courseName'],
      _avg: {
        testScore: true,
      },
    });

    // Combine the results into a single response
    const results = testCount.map(course => {
      const avgScoreEntry = averageTestScore.find(entry => entry.courseName === course.courseName);
      return {
        courseName: course.courseName,
        totalTests: course._count.id,
        averageScore: avgScoreEntry ? avgScoreEntry._avg.testScore : 0, // Default to 0 if not found
      };
    });

    // Calculate total tests taken
    const totalTestsTaken = results.reduce((sum, course) => sum + course.totalTests, 0);

    // Find the course with the most tests
    const mostTestsCourse = results.reduce((prev, current) => {
      return (prev.totalTests > current.totalTests) ? prev : current;
    });

    // Get all skill scores where noOfAttempts === 0
    const noAttemptsEntries = await prisma.skillScore.findMany({
      where: {
        noOfAttempts: 0,
      },
    });

    // Calculate average score for those with no attempts
    const totalScoreNoAttempts = noAttemptsEntries.reduce((sum, entry) => sum + entry.testScore, 0);
    const averagescore = noAttemptsEntries.length > 0
      ? totalScoreNoAttempts / noAttemptsEntries.length
      : 0;

    // Structure the response
    res.json({
      totalTestsTaken,
      mostTestsCourseName: mostTestsCourse.courseName,
      averagescore,
    });
  } catch (error) {
    console.error('Error fetching skill scores statistics:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTopThreeEmployees = async (req, res) => {
  try {
    const topEmployees = await prisma.employee.findMany({
      include: {
        Certification: true, // Include certifications
      },
      where: {
        NOT: {
          role: 'admin', // Exclude employees with the role of admin
        },
      },
      orderBy: {
        Certification: {
          _count: 'desc', // Order by the count of certifications
        },
      },
      take: 3, // Take the top three employees
    });

    // Map the response to include only necessary fields
    const result = topEmployees.map(employee => ({
      id: employee.id,
      name: employee.employeeName,
      email: employee.employeeEmail,
      certificationsCount: employee.Certification.length,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching top employees:', error);
    res.status(500).json({ error: 'An error occurred while fetching the top employees.' });
  }
};



const getTopEmployeeBySkillsetAndAverage = async (req, res) => {
  try {
    // Get the employee with the highest skillset count
    const topSkillsetEmployee = await prisma.employee.findMany({
      where: {
        NOT: {
          role: 'admin', // Exclude employees with the role of admin
        },
      },
      include: {
        Skillset: true, // Include skillset to count the elements
      },
      orderBy: {
        Skillset: {
          _count: 'desc', // Order by the count of skills
        },
      },
      take: 1, // Take the top employee
    });

    // If no employee found
    if (!topSkillsetEmployee.length) {
      return res.status(404).json({ error: 'No employees found.' });
    }

    const topEmployee = topSkillsetEmployee[0];

    // Calculate the average skill score for the top employee
    const skillScores = await prisma.skillScore.findMany({
      where: {
        employeeId: topEmployee.id,
        NOT: {
          Employee: {
            role: 'admin', // Exclude admins again, just in case
          },
        },
      },
    });

    const totalScore = skillScores.reduce((acc, score) => acc + score.testScore, 0);
    const averageScore = skillScores.length ? totalScore / skillScores.length : 0;

    // Count the number of skills in the Skillset array
    const skillCount = topEmployee.Skillset.reduce((acc, skillset) => {
      return acc + skillset.skillSet.length; // Count the elements in skillSet array
    }, 0);

    res.status(200).json({
      name: topEmployee.employeeName,
      skillsetCount: skillCount, // Total number of skills
      averageSkillScore: averageScore.toFixed(2), // Format to 2 decimal places
    });
  } catch (error) {
    console.error('Error fetching top employee:', error);
    res.status(500).json({ error: 'An error occurred while fetching the top employee.' });
  }
};

module.exports = {
  getCourseStatistics,
  getSkillStatistics,
  getSkillScoreStatistics,
  getTopThreeEmployees,
  getTopEmployeeBySkillsetAndAverage
}
