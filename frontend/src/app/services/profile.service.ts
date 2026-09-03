import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService, AuthUser } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProfile(userId: string): Observable<AuthUser> {
    return this.http.get<{ user: AuthUser }>(`${this.apiUrl}/${userId}`).pipe(
      map(response => response.user)
    );
  }

  updateProfile(
    userId: string,
    changes: Pick<AuthUser, 'firstName' | 'lastName' | 'age' | 'phone'>
  ): Observable<AuthUser> {
    return this.http.put<{ user: AuthUser }>(`${this.apiUrl}/${userId}`, changes).pipe(
      map(response => response.user)
    );
  }
}
