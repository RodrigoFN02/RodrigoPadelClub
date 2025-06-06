import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReservaService } from '../../../servicios/reserva.service';
import { formatDate } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Subscription } from 'rxjs';

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
  horasOcupadas: string[] = []; // NUEVO
  subscripciones: Subscription[] = [];

  constructor(private fb: FormBuilder, private reservaService: ReservaService) {
    this.reservaForm = this.fb.group({
      nombre: ['', [Validators.required]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      pista: ['1', [Validators.required, pistaValidator]]
    });
  }

  ngOnInit() {
  this.cargarReservas();

  this.subscripciones.push(
    this.reservaForm.get('fecha')!.valueChanges.subscribe(() => this.actualizarHorasOcupadas()),
    this.reservaForm.get('pista')!.valueChanges.subscribe(() => this.actualizarHorasOcupadas())
  );
}

  actualizarReservasYHoras() {
    const fecha = this.reservaForm.get('fecha')?.value;
    const pista = this.reservaForm.get('pista')?.value;

    if (!fecha || !pista) {
      this.horasOcupadas = [];
      return;
    }

    const fechaStr = formatDate(fecha, 'yyyy-MM-dd', 'en');
    this.reservaService.obtenerReservas().subscribe(res => {
      this.reservas = res;
      this.horasOcupadas = res
        .filter(r => r.fecha === fechaStr && r.n_pista == pista)
        .map(r => r.hora);

      const horaSeleccionada = this.reservaForm.get('hora')?.value;
      if (this.horasOcupadas.includes(horaSeleccionada)) {
        this.reservaForm.get('hora')?.setErrors({ ocupada: true });
      } else {
        this.reservaForm.get('hora')?.setErrors(null);
      }
    });
  }

actualizarReservasYValidar() {
  this.reservaService.obtenerReservas().subscribe(res => {
    this.reservas = res;
    this.actualizarHorasOcupadas();
    this.validarHoraSeleccionada();
  });
}
cargarReservas() {
  this.reservaService.obtenerReservas().subscribe(res => {
    this.reservas = res;
    this.actualizarHorasOcupadas();
  });
}
actualizarHorasOcupadas() {
  const fecha = this.reservaForm.get('fecha')?.value;
  const pista = this.reservaForm.get('pista')?.value;

  if (!fecha || !pista) {
    this.horasOcupadas = [];
    return;
  }

  const fechaStr = formatDate(fecha, 'yyyy-MM-dd', 'en');


  this.horasOcupadas = this.reservas
    .filter(r => r.fecha === fechaStr && String(r.n_pista) === String(pista))
    .map(r => r.hora.substring(0,5)); 

  const horaSeleccionada = this.reservaForm.get('hora')?.value;
  if (horaSeleccionada && this.horasOcupadas.includes(horaSeleccionada)) {
    this.reservaForm.get('hora')?.setErrors({ ocupada: true });
  } else {
    this.reservaForm.get('hora')?.setErrors(null);
  }
}

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
    this.reservaForm.get('hora')?.setErrors({ ocupada: true });
  } else {
    this.reservaForm.get('hora')?.setErrors(null);
  }
}

horaOcupadaEnFecha(hora: string): boolean {
  return this.horasOcupadas.includes(hora);
}

enviar() {
  if (this.reservaForm.invalid) {
    this.reservaForm.markAllAsTouched();
    return;
  }

  const fecha = this.reservaForm.get('fecha')?.value;
  const pista = this.reservaForm.get('pista')?.value;
  const hora = this.reservaForm.get('hora')?.value;

  const fechaStr = formatDate(fecha, 'yyyy-MM-dd', 'en');
  const estaOcupada = this.reservas.some(r =>
    r.fecha === fechaStr && r.hora === hora && r.n_pista == pista
  );

  if (estaOcupada) {
    this.mensaje = 'La hora seleccionada ya está ocupada. Por favor, elige otra.';
    return;
  }

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  if (!usuario.id) {
    this.mensaje = 'Error: No se encontró usuario logueado.';
    return;
  }

  const reserva = {
    nombre: this.reservaForm.value.nombre,
    fecha: fechaStr,
    hora,
    n_pista: pista,
    id_usuario: usuario.id
  };

  this.reservaService.registrarReserva(reserva).subscribe({
    next: () => {
      this.mensaje = 'Reserva registrada correctamente.';
      this.reservaForm.reset({ pista: '1' });
      this.cargarReservas();
    },
    error: () => {
      this.mensaje = 'Error al registrar la reserva.';
    }
  });
}

}
function pistaValidator(control: AbstractControl): ValidationErrors | null {
  const pista = Number(control.value);
  return Number.isInteger(pista) && pista >= 1 && pista <= 9 ? null : { pistaInvalida: true };
}
