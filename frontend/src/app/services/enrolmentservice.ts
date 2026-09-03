import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IEnrollmentResponse } from '../models/enrollment.model';

import { Observable } from 'rxjs/internal/Observable';

@Service()
export class Enrolmentservice {
    private http =inject(HttpClient);
    private apiUrl = "http://127.0.0.1:3000/enrollments"
    token = localStorage.getItem('token')

    getmyenrollments():Observable<IEnrollmentResponse> {
       return this.http.get<IEnrollmentResponse>(`${this.apiUrl}`,
         
            {headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    cancelenrollment(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`,
        {headers: {
            'Authorization': `Bearer ${this.token}`
        }   
        });
    }
}

