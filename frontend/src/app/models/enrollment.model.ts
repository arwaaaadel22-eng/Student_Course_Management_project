import { Course } from './course.model';

export interface IEnrollment {
    _id: string,
    userId: string,
    courseId: Course,
    status: "active" | "cancelled",
    enrolledAt: string,
    createdAt?: string,
    updatedAt?: string
}

export interface IEnrollmentResponse {
    success: boolean,
    count: number,
    enrollments: IEnrollment[],
    message?: string
}
