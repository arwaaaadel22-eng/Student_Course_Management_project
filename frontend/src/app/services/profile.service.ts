import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, throwError, timeout } from 'rxjs';
import { AuthService, AuthUser } from './auth.service';

interface ProfileResponse {
  user: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly apiUrl = 'http://localhost:3000/users';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getProfile(userId: string): Observable<AuthUser> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/${userId}`, {
      headers: this.authHeaders()
    }).pipe(map(response => response.user));
  }

  updateProfile(
    userId: string,
    changes: Pick<AuthUser, 'firstName' | 'lastName' | 'age' | 'phone'>
  ): Observable<AuthUser> {
    if (!this.authService.getToken()) {
      return throwError(() => new Error('Authentication token is missing. Please sign in again.'));
    }

    return this.http.put<ProfileResponse>(`${this.apiUrl}/${userId}`, changes, {
      headers: this.authHeaders()
    }).pipe(
      timeout(10000),
      map(response => response.user)
    );
  }

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }
}
