// perfil.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'https://ifgiarnsisjtocdfujig.supabase.co/rest/v1/usuarios';
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZ2lhcm5zaXNqdG9jZGZ1amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzIxNDIsImV4cCI6MjA2MjkwODE0Mn0.UU-AAOwKOjERLOwtzgxzidcQSEkOp8jLMI6ziZ-MWqE';

  constructor(private http: HttpClient) {}

  actualizarUsuarioPorId(id: number, datos: any): Observable<any> {
    const headers = new HttpHeaders({
      apikey: this.apiKey,
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'  // para que devuelva los nuevos datos
    });

    return this.http.patch(`${this.apiUrl}?id=eq.${id}`, datos, { headers });
  }
}
