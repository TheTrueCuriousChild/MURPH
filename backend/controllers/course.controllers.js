import prisma from "../utils/prisma.js";

export const createCourse = async (req, res) => {
  const { title, description } = req.body;
  const teacherEmail = req.user.email; // Assuming teacher is logged in and email is in req.user

  try {
    const course = await prisma.course.create({
      data: {
        title,
        description,
        teacherEmail,
      },
    });
    return res.sendResponse(201, true, "Course created successfully", course);
  } catch (error) {
    return res.sendResponse(500, false, "Failed to create course", { error: error.message });
  }
};

export const getTeacherCourses = async (req, res) => {
  const teacherEmail = req.user.email;

  try {
    const courses = await prisma.course.findMany({
      where: { teacherEmail },
      include: {
        _count: {
          select: { lectures: true },
        },
      },
    });
    return res.sendResponse(200, true, "Courses fetched successfully", courses);
  } catch (error) {
    return res.sendResponse(500, false, "Failed to fetch courses", { error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lectures: true,
      },
    });

    if (!course) {
      return res.sendResponse(404, false, "Course not found");
    }

    return res.sendResponse(200, true, "Course fetched successfully", course);
  } catch (error) {
    return res.sendResponse(500, false, "Failed to fetch course", { error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const course = await prisma.course.update({
      where: { id },
      data: { title, description },
    });
    return res.sendResponse(200, true, "Course updated successfully", course);
  } catch (error) {
    return res.sendResponse(500, false, "Failed to update course", { error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete lectures first (though Prisma relation might handle it if cascading is set up, but let's be safe or just use prisma delete)
    // Note: In some schemas you might need to delete children manually if not using Cascade.
    await prisma.course.delete({
      where: { id },
    });
    return res.sendResponse(200, true, "Course deleted successfully");
  } catch (error) {
    return res.sendResponse(500, false, "Failed to delete course", { error: error.message });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        teacher: {
          select: {
            username: true,
            email: true,
          },
        },
        _count: {
          select: { lectures: true },
        },
      },
    });
    return res.sendResponse(200, true, "All courses fetched successfully", courses);
  } catch (error) {
    return res.sendResponse(500, false, "Failed to fetch courses", { error: error.message });
  }
};
