import { Component, OnInit } from '@angular/core';
import { SociosService } from '../../../servicios/socios.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../../componentes/dialog/dialog.component';

@Component({
  selector: 'app-socios',
  imports: [CommonModule, DialogComponent],
  standalone: true,
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {
  mensaje = '';
  usuario: any;
  esSocio = false;

  constructor(
    private apiService: SociosService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const usuarioStr = localStorage.getItem('usuario'); // Asumiendo que lo guardaste con esa clave
    if (usuarioStr) {
      this.usuario = JSON.parse(usuarioStr);

      this.apiService.comprobarSocio(this.usuario.id).subscribe({
        next: (respuesta) => {
          this.esSocio = respuesta.esSocio;
        },
        error: (err) => {
          console.error('Error comprobando si es socio', err);
        }
      });
    }
  }

  registrarSocio() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { mensaje: '¿Estás seguro de que quieres hacerte socio del club?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const socioData = {
          id_usuario: this.usuario.id,
          nombre_socio: this.usuario.nombre
        };

        this.apiService.registrarSocio(socioData).subscribe({
          next: () => {
            this.esSocio = true;
            this.mensaje = '✅ ¡Ya eres socio del club!';
          },
          error: () => {
            this.mensaje = '❌ Error al registrar como socio.';
          }
        });
      }
    });
  }

  cancelarSuscripcion() {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { mensaje: '¿Seguro que deseas cancelar tu suscripción como socio?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.eliminarSocio(this.usuario.id).subscribe({
          next: () => {
            this.esSocio = false;
            this.mensaje = '🗑️ Has cancelado tu suscripción como socio.';
          },
          error: () => {
            this.mensaje = '❌ Error al cancelar la suscripción.';
          }
        });
      }
    });
  }
}
