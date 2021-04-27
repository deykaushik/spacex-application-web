import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { OverseasSuccessComponent } from './overseas-travel/overseas-success/overseas-success.component';

const routes: Routes = [
   { path: '', component: LandingComponent },
   { path: ':accountId', component: LandingComponent },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class CardsRoutingModule { }
