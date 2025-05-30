import { Routes } from '@angular/router';
import { LoginComponent } from './vistas/login/login.component';
import { RegistroComponent } from './vistas/registro/registro.component';
import { LayoutComponent } from './vistas/layout/layout.component';
import { ContactoComponent } from './vistas/layout/contacto/contacto.component';
import { EventosComponent } from './vistas/layout/eventos/eventos.component';
import { HomeComponent } from './vistas/layout/home/home.component';
import { ReservasComponent } from './vistas/layout/reservas/reservas.component';
import { SociosComponent } from './vistas/layout/socios/socios.component';
import { ErrorComponent } from './vistas/error/error.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home/:usuario', component: HomeComponent },
      { path: 'contacto/:usuario', component: ContactoComponent },
      { path: 'eventos/:usuario', component: EventosComponent },
      { path: 'reservas/:usuario', component: ReservasComponent },
      { path: 'socios/:usuario', component: SociosComponent }
    ]
  },
  { path: '**', component: ErrorComponent }
];
