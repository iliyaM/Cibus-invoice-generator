import {Routes} from '@angular/router';
import {InvoiceGeneratorComponent} from './invoice-generator/invoice-generator.component';

export const routes: Routes = [
  {
    path: '',
    component: InvoiceGeneratorComponent
  },
  { path: '**', redirectTo: '' }
];
