import { Routes } from '@angular/router';
import { CarModelComponent } from './car-model/car-model.component';
import { CarConfigComponent } from './car-config/car-config.component';
import { CarSummaryComponent } from './car-summary/car-summary.component';

export const routes: Routes = [
    { path: '', redirectTo: '/car-model', pathMatch: 'full' },
    { path: 'car-model', component: CarModelComponent },
    { path: 'car-config', component: CarConfigComponent },
    { path: 'car-summary', component: CarSummaryComponent },
    { path: '**', component: CarModelComponent }
];
