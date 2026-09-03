import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:3000/courses';
  private enrollUrl = 'http://localhost:3000/enrollments';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<{ courses: Course[] }> {
    return this.http.get<{ courses: Course[] }>(this.apiUrl);
  }

  getCourseById(id: string): Observable<{ course: Course }> {
    return this.http.get<{ course: Course }>(`${this.apiUrl}/${id}`);
  }

  searchCourses(title: string): Observable<{ courses: Course[] }> {
    return this.http.get<{ courses: Course[] }>(`${this.apiUrl}/search?title=${encodeURIComponent(title)}`);
  }

  createCourse(course: Course): Observable<any> {
    return this.http.post<any>(this.apiUrl, course);
  }

  updateCourse(id: string, course: Course): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  enrollInCourse(courseId: string): Observable<any> {
    return this.http.post<any>(this.enrollUrl, { courseId });
  }
}