import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../../servicios/eventos.service';
import { CardComponent } from '../../../componentes/card/card.component';
import { DetallesEventosService } from '../../../servicios/detalles-eventos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  imports:[CardComponent,CommonModule],
  standalone:true,
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: any[] = [];

  constructor(private eventosService: EventosService,private detallesEventosService: DetallesEventosService) {}

  ngOnInit(): void {
    this.eventosService.obtenerEventos().subscribe({
      next: (data) => {
        this.eventos = data.map(evento => ({
          ...evento,
          imagen: `assets/eventos/evento${evento.id_evento + '.jpg' || 'default.jpg'}`
        }));
      },
      error: (err) => console.error('Error al obtener eventos', err)
    });
  }
  apuntarse(idEvento: number): void {
  const usuarioString = localStorage.getItem('usuario');
  if (!usuarioString) {
    alert('Debes iniciar sesión para apuntarte.');
    return;
  }

const usuario = JSON.parse(usuarioString);
const idUsuario = usuario.id;
  const confirmacion = window.confirm('¿Estás seguro de que quieres apuntarte a este evento?');
  if (!confirmacion) {
    alert('Has cancelado la operación.');
    return;
  }

  // Comprobar si ya está registrado
  this.detallesEventosService.obtenerRegistro(idUsuario, idEvento).subscribe({
    next: (registros) => {
      if (registros.length > 0) {
        alert('Usted ya está registrado en este evento.');
      } else {
        this.detallesEventosService.registrarUsuarioEnEvento(idUsuario, idEvento).subscribe({
          next: () => alert('¡Gracias por apuntarte al evento, te esperamos con ansias!'),
          error: (err) => {
            console.error('Error al registrar al evento:', err);
            alert('Hubo un problema al apuntarte.');
          }
        });
      }
    },
    error: (err) => {
      console.error('Error al comprobar registro:', err);
      alert('No se pudo verificar si ya estás registrado.');
    }
  });
}
}
