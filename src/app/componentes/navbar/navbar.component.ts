import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  datos:any
  ngOnInit() {
  const datosUsuario = localStorage.getItem('usuario');
  if (datosUsuario) {
    this.datos = JSON.parse(datosUsuario);
    console.log('Usuario logueado:', this.datos);
  }
}
  constructor ( private ruter: Router){}
  cerrarSesion() {
    localStorage.removeItem('usuario');
    console.log(localStorage)
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
  home(){
    this.ruter.navigate([`/home/${this.datos.nombre}`]);
  }
}
