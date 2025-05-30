import { Component } from '@angular/core';
import { AccesoService } from '../../servicios/acceso.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  usuario = '';
  password = '';
  mensaje = '';
  usuarios: any[] = [];
  error: string = '';

  constructor(private sesion : AccesoService, private ruta: Router) {}

  login() {
    if (!this.usuario || !this.password) {
      this.mensaje = 'Debes introducir usuario y contraseña';
      return;
    }

    this.sesion.login(this.usuario, this.password).subscribe({
      next: (respuesta: any[]) => {
        if (respuesta.length > 0) {
          const userData = respuesta[0];
          localStorage.setItem('usuario', JSON.stringify(userData));
          console.log(localStorage)
          this.ruta.navigate([`/home/${userData.nombre}`]);
        } else {
          this.mensaje = 'Usuario o contraseña incorrectos';
        }
      },
      error: (err) => {
        console.error('Supabase error:', err);
        this.mensaje = 'Error al conectar con Supabase';
      }
    });
  }
}

