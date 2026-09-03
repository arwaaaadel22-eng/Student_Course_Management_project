import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IEnrollmentResponse } from '../models/enrollment.model';

import { Observable } from 'rxjs/internal/Observable';

@Service()
export class EnrollmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:3000/enrollments';

  private authHeaders() {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  getMyEnrollments(): Observable<IEnrollmentResponse> {
    return this.http.get<IEnrollmentResponse>(this.apiUrl, this.authHeaders());
  }

  cancelEnrollment(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, this.authHeaders());
  }
}