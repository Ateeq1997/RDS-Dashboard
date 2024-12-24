// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define the AuthResponse interface
export interface AuthResponse {
    email: string;
    role: string;
    username: string;
    token: string; // Assuming token is part of the response
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:3001'; // Your API URL
    private currentUserSubject: BehaviorSubject<AuthResponse | null>;
    public currentUser: Observable<AuthResponse | null>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(
            JSON.parse(localStorage.getItem('currentUser') || 'null')
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string): Observable<HttpResponse<AuthResponse>> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }, { observe: 'response' })
            .pipe(map(response => {
                const user = response.body; // Extract user data
                if (user && user.token) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
                return response; // Return the entire response
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}
