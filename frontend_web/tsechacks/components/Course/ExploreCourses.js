'use client';

import { useFetch } from '@/lib/hooks';
import api from '@/lib/api';
import CourseCard from './CourseCard';

export default function ExploreCourses() {
    const { data: courses, loading } = useFetch(() => api.getCourses());

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-96 bg-secondary-100 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses?.map((course) => (
                <CourseCard key={course.id} course={course} showProgress={course.enrolled} />
            ))}
        </div>
    );
}
