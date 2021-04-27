import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes-guard.service';
import { GoBackGuard } from '../../core/guards/go-back-guard.service';

import { LandingComponent } from './landing/landing.component';
import { ChargesAndFeesStatusComponent } from './charges-and-fees-status/charges-and-fees-status.component';

const routes:  Routes = [
   { path: '', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard] },
   { path: 'status', component: ChargesAndFeesStatusComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   { path: ':accountnumber', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard]}
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports:  [RouterModule]
})
export class ChargesAndFeesRoutingModule {

}
