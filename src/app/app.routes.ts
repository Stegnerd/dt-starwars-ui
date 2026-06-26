import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'starships', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'starships',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/starships/starships-list/starships-list.component').then(
        (m) => m.StarshipsListComponent
      )
  }
];
