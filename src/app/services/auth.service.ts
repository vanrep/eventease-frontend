import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // url base de tu backend
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private apiService: ApiService) { }

  login(email: string, pwd: string) {
    const loginResult = this.apiService.post('/auth/login', { email, password: pwd });
    loginResult.subscribe((res) => {
        console.log(res);
    });
  }
  // hacer petición GET
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  // hacer petición POST
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body);
  }
}