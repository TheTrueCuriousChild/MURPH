import prisma from "../utils/prisma.js";

export const getTeacherAnalytics = async (req, res) => {
    const teacherEmail = req.user.email;

    try {
        // 1. Get all courses for this teacher
        const courses = await prisma.course.findMany({
            where: { teacherEmail },
            include: {
                lectures: {
                    include: {
                        _count: {
                            select: { accesses: true },
                        },
                    },
                },
            },
        });

        // 2. Aggregate data
        let totalViews = 0;
        let totalRevenue = 0;
        const courseStats = courses.map((course) => {
            let courseViews = 0;
            let courseRevenue = 0;

            course.lectures.forEach((lecture) => {
                const views = lecture._count.accesses;
                courseViews += views;
                courseRevenue += views * lecture.price;
            });

            totalViews += courseViews;
            totalRevenue += courseRevenue;

            return {
                id: course.id,
                title: course.title,
                views: courseViews,
                revenue: courseRevenue,
                lectureCount: course.lectures.length,
            };
        });

        return res.sendResponse(200, true, "Analytics fetched successfully", {
            totalViews,
            totalRevenue,
            courseStats,
        });
    } catch (error) {
        return res.sendResponse(500, false, "Failed to fetch analytics", { error: error.message });
    }
};
