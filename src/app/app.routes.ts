import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Cambiado para que empiece en el Login
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'detalle',
    loadComponent: () => import('./pages/detalle/detalle.page').then( m => m.DetallePage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then( m => m.PerfilPage)
  },
];