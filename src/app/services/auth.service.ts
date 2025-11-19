import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface User {
  name?: string;
  email: string;
  password: string;
  // Add other fields if required
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // Adjust based on your backend

  constructor(private http: HttpClient) {}

  // ✅ Register User
  register(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }

  // ✅ Login User
  login(user: User): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, user);
  }

  // ✅ Check if user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Logout User
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
  }

  // ✅ Get logged-in user info
  getUser(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/getUser`, { headers });
  }
}
