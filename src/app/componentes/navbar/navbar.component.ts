import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilComponent } from '../perfil/perfil.component'; // Asegúrate de tener esta ruta bien
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [PerfilComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  datos: any;
  mostrarPerfil = false;

  constructor(private ruter: Router) {}

  ngOnInit() {
    const datosUsuario = localStorage.getItem('usuario');
    if (datosUsuario) {
      this.datos = JSON.parse(datosUsuario);

    }
  }
  actualizarDatos(nuevosDatos: any) {
    this.datos = nuevosDatos;
  }
  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.ruter.navigate(['']);
  }

  reservas() {
    this.ruter.navigate([`/reservas/${this.datos.nombre}`]);
  }

  eventos() {
    this.ruter.navigate([`/eventos/${this.datos.nombre}`]);
  }

  contactos() {
    this.ruter.navigate([`/contacto/${this.datos.nombre}`]);
  }

  socios() {
    this.ruter.navigate([`/socios/${this.datos.nombre}`]);
  }

  home() {
    this.ruter.navigate([`/home/${this.datos.nombre}`]);
  }

  abrirPerfil() {
    this.mostrarPerfil = true;
  }

  cerrarPerfil() {
    this.mostrarPerfil = false;
  }
  cerrarMenu() {
  const navbarCollapse = document.getElementById('navbarNav');
  if (navbarCollapse?.classList.contains('show')) {
    navbarCollapse.classList.remove('show');
  }
}
}
