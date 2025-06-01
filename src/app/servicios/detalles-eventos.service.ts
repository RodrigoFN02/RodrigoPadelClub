import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetallesEventosService {
  private apiUrl = 'https://ifgiarnsisjtocdfujig.supabase.co/rest/v1/detalles_eventos';
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZ2lhcm5zaXNqdG9jZGZ1amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzIxNDIsImV4cCI6MjA2MjkwODE0Mn0.UU-AAOwKOjERLOwtzgxzidcQSEkOp8jLMI6ziZ-MWqE';

  constructor(private http: HttpClient) {}

  registrarUsuarioEnEvento(idUsuario: string, idEvento: number): Observable<any> {
    const headers = new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    });

    const body = {
      id_usuario: idUsuario,
      id_evento: idEvento
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
  obtenerRegistro(idUsuario: string, idEvento: number): Observable<any[]> {
  const headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Authorization': `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json'
  });

  const url = `${this.apiUrl}?id_evento=eq.${idEvento}&id_usuario=eq.${idUsuario}`;

  return this.http.get<any[]>(url, { headers });
}
}
