import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private apiUrl = 'http://localhost:3000/courses';
  private enrollUrl = 'http://localhost:3000/enrollments';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('token');

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

  }


  // Get All Courses
  getCourses(): Observable<{ courses: Course[] }> {

    return this.http.get<{ courses: Course[] }>(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );

  }


  // Get Course By ID
  getCourseById(id: string): Observable<{ course: Course }> {

    return this.http.get<{ course: Course }>(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );

  }


  // Search
  searchCourses(title: string): Observable<{ courses: Course[] }> {

    return this.http.get<{ courses: Course[] }>(
      `${this.apiUrl}/search?title=${title}`,
      {
        headers: this.getHeaders()
      }
    );

  }


  // Create
  createCourse(course: Course): Observable<any> {

    return this.http.post<any>(
      this.apiUrl,
      course,
      {
        headers: this.getHeaders()
      }
    );

  }


  // Update
  updateCourse(id: string, course: Course): Observable<any> {

    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      course,
      {
        headers: this.getHeaders()
      }
    );

  }


  // Delete
  deleteCourse(id: string): Observable<any> {

    return this.http.delete<any>(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );

  }


  // Enroll
  enrollInCourse(courseId: string): Observable<any> {

    return this.http.post<any>(
      this.enrollUrl,
      { courseId },
      {
        headers: this.getHeaders()
      }
    );

  }

}