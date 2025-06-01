import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SociosService {
  private apiUrl = 'https://ifgiarnsisjtocdfujig.supabase.co/rest/v1/socios';
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZ2lhcm5zaXNqdG9jZGZ1amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzIxNDIsImV4cCI6MjA2MjkwODE0Mn0.UU-AAOwKOjERLOwtzgxzidcQSEkOp8jLMI6ziZ-MWqE';

  private headers = new HttpHeaders({
    'apikey': this.apiKey,
    'Authorization': `Bearer ${this.apiKey}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  });

  constructor(private http: HttpClient) {}

  /**
   * Comprueba si el usuario ya es socio
   */
  comprobarSocio(id_usuario: number): Observable<{ esSocio: boolean }> {
    const url = `${this.apiUrl}?id_usuario=eq.${id_usuario}`;
    return this.http.get<any[]>(url, { headers: this.headers }).pipe(
      map((res) => ({ esSocio: res.length > 0 }))
    );
  }

  /**
   * Registra un nuevo socio
   */
  registrarSocio(socio: { id_usuario: number, nombre_socio: string }): Observable<any> {
    return this.http.post(this.apiUrl, socio, { headers: this.headers });
  }

  /**
   * Elimina la suscripción del socio
   */
  eliminarSocio(id_usuario: number): Observable<any> {
    const url = `${this.apiUrl}?id_usuario=eq.${id_usuario}`;
    const deleteHeaders = this.headers.set('Prefer', 'return=minimal');
    return this.http.delete(url, { headers: deleteHeaders });
  }
}
