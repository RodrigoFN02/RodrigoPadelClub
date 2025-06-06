import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = 'https://ifgiarnsisjtocdfujig.supabase.co/rest/v1/reservas';
  private apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmZ2lhcm5zaXNqdG9jZGZ1amlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzIxNDIsImV4cCI6MjA2MjkwODE0Mn0.UU-AAOwKOjERLOwtzgxzidcQSEkOp8jLMI6ziZ-MWqE'; // sustituye por la real y mantenla segura

   constructor(private http: HttpClient) {}

  registrarReserva(reserva: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, reserva, { headers });
  }

  obtenerReservas(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    });
  }
getReservas() {
  const headers = new HttpHeaders({
    apikey: this.apiKey,
    Authorization: `Bearer ${this.apiKey}`
  });
  return this.http.get<any[]>(`${this.apiUrl}/reservas`, { headers });
}

}
