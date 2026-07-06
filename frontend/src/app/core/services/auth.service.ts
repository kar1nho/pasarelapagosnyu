import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginDto } from '../../modules/auth/models/login.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'nyu_token';
  private readonly USER_KEY = 'nyu_user';
  private readonly apiUrl = environment.authUrl;

  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private _currentUser$ = new BehaviorSubject<any>(null);

  isLoggedIn$ = this._isLoggedIn$.asObservable();
  currentUser$ = this._currentUser$.asObservable();

  constructor(private http: HttpClient) {}

  checkSession(): void {
    const token = this.getToken();
    const user = this.getStoredUser();

    if (token && user) {
      this._isLoggedIn$.next(true);
      this._currentUser$.next(user);
    }
  }

  login(dto: LoginDto): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/login`,
      dto
    ).pipe(
      tap(res => {
        const token = res.access_token || res.token;

        if (token) {
          localStorage.setItem(this.TOKEN_KEY, token);
        }

        if (res.user) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.user));
          this._currentUser$.next(res.user);
        }

        this._isLoggedIn$.next(true);
      })
    );
  }

  getTokenByPrivateKey(privateKey: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/token`,
      { privateKey }
    ).pipe(
      tap(res => {
        const user = {
          service: res.service,
          role: 'SYSTEM'
        };

        localStorage.setItem(this.TOKEN_KEY, res.access_token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        this._isLoggedIn$.next(true);
        this._currentUser$.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    this._isLoggedIn$.next(false);
    this._currentUser$.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    return this.getStoredUser();
  }

  private getStoredUser(): any {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}