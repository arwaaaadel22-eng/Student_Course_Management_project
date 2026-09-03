import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IEnrollmentResponse } from '../models/enrollment.model';

import { Observable } from 'rxjs/internal/Observable';

@Service()
export class Enrolmentservice {
    private http =inject(HttpClient);
    private apiurl = "http://127.0.0.1:5000"
    token = localStorage.getItem('token')

    getmyenrollments():Observable<IEnrollmentResponse> {
       return this.http.get<IEnrollmentResponse>(`${this.apiurl}/enrollments`,
         
            {headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
    }

    cancelenrollment(id: string): Observable<any> {
        return this.http.delete<any>(`${this.apiurl}/enrollments/${id}`,
        {headers: {
            'Authorization': `Bearer ${this.token}`
        }   
        });
    }
}
