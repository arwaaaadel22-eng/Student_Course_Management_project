import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly apiUrl = 'http://localhost:3000/courses';
  private readonly enrollUrl = 'http://localhost:3000/enrollments';

  constructor(private readonly http: HttpClient) {}

  // Get All Courses
  getCourses(): Observable<{ courses: Course[] }> {
    return this.http.get<{ courses: Course[] }>(this.apiUrl);
  }

  // Get Course By ID
  getCourseById(id: string): Observable<{ course: Course }> {
    return this.http.get<{ course: Course }>(`${this.apiUrl}/${id}`);
  }

  // Search
  searchCourses(title: string): Observable<{ courses: Course[] }> {
    return this.http.get<{ courses: Course[] }>(
      `${this.apiUrl}/search?title=${encodeURIComponent(title)}`
    );
  }

  // Create
  createCourse(course: Course): Observable<any> {
    return this.http.post<any>(this.apiUrl, course);
  }

  // Update
  updateCourse(id: string, course: Course): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, course);
  }

  // Delete
  deleteCourse(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Enroll
  enrollInCourse(courseId: string): Observable<any> {
    return this.http.post<any>(this.enrollUrl, { courseId });
  }
}