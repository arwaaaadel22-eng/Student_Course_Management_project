import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEnrollmentResponse } from '../models/enrollment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private readonly http: HttpClient) {}

  getMyEnrollments(): Observable<IEnrollmentResponse> {
    return this.http.get<IEnrollmentResponse>(this.apiUrl);
  }

  cancelEnrollment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}