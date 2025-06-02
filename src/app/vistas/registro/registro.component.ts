
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RegistrarService } from '../../servicios/registrar.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private registro: RegistrarService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]{1,50}$/)
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
        ]
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{9}$/)
        ]
      ],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)
        ]
      ],
      repetirContrasena: ['', Validators.required]
    }, { validators: this.passwordsIguales });
  }

  // Validador personalizado
  passwordsIguales(group: FormGroup) {
    const pass = group.get('contrasena')?.value;
    const repite = group.get('repetirContrasena')?.value;
    return pass === repite ? null : { noCoinciden: true };
  }

  registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const { nombre, email, telefono, contrasena } = this.registroForm.value;

    this.registro.registro({ nombre, email, telefono, contrasena }).subscribe({
      next: () => {
        this.mensaje = 'Registro exitoso. Redirigiendo...';
        setTimeout(() => this.router.navigate(['']), 2000);
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al registrar el usuario';
      }
    });
  }
}
