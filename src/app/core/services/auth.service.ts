import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthResponseDto, LoginDto, RegisterDto, UserState } from '../models/auth.models';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  // Reactive state using Angular Signals
  public currentUser: WritableSignal<UserState> = signal({
    username: null,
    role: null,
    isAuthenticated: false
  });

  constructor(private http: HttpClient) {
    this.loadStateFromStorage();
  }

  login(data: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, data).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  register(data: RegisterDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/register`, data).pipe(
      tap(res => this.handleAuthResponse(res))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.currentUser.set({ username: null, role: null, isAuthenticated: false });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  private handleAuthResponse(res: AuthResponseDto) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('username', res.username);
    
    this.currentUser.set({
      username: res.username,
      role: res.role,
      isAuthenticated: true
    });
  }

  private loadStateFromStorage() {
    const token = this.getToken();
    const role = this.getRole();
    const username = localStorage.getItem('username');

    if (token && role && username) {
      this.currentUser.set({ username, role, isAuthenticated: true });
    }
  }
}
