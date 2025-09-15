import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'invoice-generator',
    loadChildren: () => import('./pages/routes').then(m => m.routes)
  },
  {
    path: '**',
    redirectTo: 'invoice-generator'
  }
];
