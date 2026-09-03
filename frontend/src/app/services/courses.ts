import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { AuthService } from './auth.service';

interface CoursesResponse {
  courses: Course[];
}

interface CourseResponse {
  course: Course;
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private readonly apiUrl = 'http://localhost:3000/courses';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<CoursesResponse>(this.apiUrl).pipe(
      map(response => response.courses)
    );
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<CourseResponse>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.course)
    );
  }

  searchCourses(query: string): Observable<Course[]> {
    return this.http.get<CoursesResponse>(
      `${this.apiUrl}/search?title=${encodeURIComponent(query)}`
    ).pipe(map(response => response.courses));
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<CourseResponse>(this.apiUrl, course, {
      headers: this.authHeaders()
    }).pipe(map(response => response.course));
  }

  updateCourse(id: string, course: Course): Observable<Course> {
    return this.http.put<CourseResponse>(`${this.apiUrl}/${id}`, course, {
      headers: this.authHeaders()
    }).pipe(map(response => response.course));
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.authHeaders()
    });
  }

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}
