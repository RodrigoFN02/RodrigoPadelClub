import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PerfilService } from '../../servicios/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() datosActualizados = new EventEmitter<any>();

  perfilForm: FormGroup;
  errorContrasena = '';

  constructor(private fb: FormBuilder, private cambios: PerfilService) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{1,50}$/)]],
      email: ['', [Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)]],
      telefono: ['', [Validators.pattern(/^\d{9}$/)]],
      contrasena: ['', [Validators.pattern(/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      confirmarContrasena: ['']
    }, { validators: this.passwordsIguales });
  }

  ngOnInit() {
    const datos = localStorage.getItem('usuario');
    if (datos) {
      const usuario = JSON.parse(datos);
      this.usuarioActual = usuario;
      this.perfilForm.patchValue({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        telefono: usuario.telefono || ''
      });
    }
  }
  usuarioActual: any;

  passwordsIguales(group: FormGroup) {
    const pass = group.get('contrasena')?.value;
    const repite = group.get('confirmarContrasena')?.value;

    if ((pass || repite) && pass !== repite) {
      return { noCoinciden: true };
    }
    return null;
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarCambios() {
    this.errorContrasena = '';

    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const { nombre, email, telefono, contrasena } = this.perfilForm.value;

    if (contrasena && contrasena === this.usuarioActual.password) {
      this.errorContrasena = 'La nueva contraseña no puede ser igual a la anterior.';
      return;
    }

    const datosActualizados = {
      nombre,
      email,
      telefono,
      contrasena: contrasena ? contrasena : this.usuarioActual.password
    };

    this.cambios.actualizarUsuarioPorId(this.usuarioActual.id, datosActualizados).subscribe({
      next: (res) => {
        const usuarioActualizado = {
          ...this.usuarioActual,
          ...datosActualizados
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        this.datosActualizados.emit(usuarioActualizado);
        this.cerrarModal();

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (err) => {
        console.error('Error al actualizar en Supabase:', err);
        this.errorContrasena = 'Error al guardar los cambios. Intenta de nuevo.';
      }
    });
  }


}
