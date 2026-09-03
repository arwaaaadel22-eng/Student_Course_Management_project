import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthUser {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  phone?: string;
  role: 'student' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  role?: 'student' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = 'http://localhost:3000/auth';
  private tokenKey = 'token';
  private userKey = 'user';

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(details: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, details);
  }

  setAuth(token: string, user: AuthUser): void {
    const normalizedUser = {
      ...user,
      id: user.id || user._id || this.getTokenUserId(token) || ''
    };
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(normalizedUser));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);

    return user ? JSON.parse(user) as AuthUser : null;
  }

  getUserId(): string | null {
    const user = this.getUser();

    return user?.id || user?._id || this.getTokenUserId(this.getToken());
  }

  private getTokenUserId(token: string | null): string | null {
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])) as { id?: string };
      return payload.id || null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}