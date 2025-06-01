import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservaService } from '../../../servicios/reserva.service';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-reserva',
  templateUrl: './reservas.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  reservaForm: FormGroup;
  mensaje = '';
  reservas: any[] = [];
  horasTotales = ['09:00', '10:00', '11:00', '12:00', '13:00', '17:00', '18:00', '19:00', '20:00'];

  constructor(private fb: FormBuilder, private reservaService: ReservaService) {
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      pista: ['1', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.reservaService.obtenerReservas().subscribe(res => {
      this.reservas = res;
    });

    // Cuando cambie fecha o pista, comprobamos si la hora seleccionada sigue válida
    this.reservaForm.get('fecha')?.valueChanges.subscribe(() => this.validarHoraSeleccionada());
    this.reservaForm.get('pista')?.valueChanges.subscribe(() => this.validarHoraSeleccionada());
  }

  // Verifica si la hora seleccionada está ocupada para la fecha y pista actuales
  validarHoraSeleccionada() {
    const fecha = this.reservaForm.get('fecha')?.value;
    const pista = this.reservaForm.get('pista')?.value;
    const horaSeleccionada = this.reservaForm.get('hora')?.value;

    if (!fecha || !horaSeleccionada || !pista) return;

    const fechaStr = formatDate(fecha, 'yyyy-MM-dd', 'en');
    const estaOcupada = this.reservas.some(r =>
      r.fecha === fechaStr && r.hora === horaSeleccionada && r.n_pista == pista
    );

    if (estaOcupada) {
      // Si está ocupada, limpiamos la hora para obligar a seleccionar otra
      this.reservaForm.get('hora')?.setValue('');
    }
  }

  horaOcupadaEnFecha(hora: string, fecha: Date | null, pista: string | number): boolean {
    if (!fecha || !pista) return false;

    const fechaStr = formatDate(fecha, 'yyyy-MM-dd', 'en');
    return this.reservas.some(r =>
      r.fecha === fechaStr && r.hora === hora && r.n_pista == pista
    );
  }

  enviar() {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (!usuario.id) {
      this.mensaje = 'Error: No se encontró usuario logueado.';
      return;
    }

    const reserva = {
      nombre: this.reservaForm.value.nombre,
      fecha: formatDate(this.reservaForm.value.fecha, 'yyyy-MM-dd', 'en'),
      hora: this.reservaForm.value.hora,
      n_pista: this.reservaForm.value.pista,
      id_usuario: usuario.id
    };

    this.reservaService.registrarReserva(reserva).subscribe({
      next: () => {
        this.mensaje = 'Reserva registrada correctamente.';
        this.reservaForm.reset({ pista: '1' });
        this.reservas.push(reserva); // actualiza localmente para reflejar cambios inmediatos
      },
      error: () => {
        this.mensaje = 'Error al registrar la reserva.';
      }
    });
  }
}
