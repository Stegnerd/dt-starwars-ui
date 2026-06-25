import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'starships', pathMatch: 'full' },
  {
    path: 'starships',
    loadComponent: () =>
      import('./pages/starships/starships-list/starships-list.component').then(
        (m) => m.StarshipsListComponent
      )
  }
];
