import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarService {
  private apiUrl = 'https://ifgiarnsisjtocdfujig.supabase.co/rest/v1';
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZ2lhcm5zaXNqdG9jZGZ1amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzIxNDIsImV4cCI6MjA2MjkwODE0Mn0.UU-AAOwKOjERLOwtzgxzidcQSEkOp8jLMI6ziZ-MWqE';

  constructor(private http: HttpClient) {}

  registro(usuario: any): Observable<any> {
  const headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Authorization': `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json'
  });

  return this.http.post(`${this.apiUrl}/usuarios`, usuario, { headers });
}
}
