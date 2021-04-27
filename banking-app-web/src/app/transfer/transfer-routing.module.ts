import { UnsavedChangesGuard } from '../core/guards/unsaved-changes-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { TransferStatusComponent } from './transfer-status/transfer-status.component';
import { GoBackGuard } from '../core/guards/go-back-guard.service';
const routes: Routes = [
   { path: '', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard] },
   { path: 'status', component: TransferStatusComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   { path: ':accountnumber', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard] },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class TransferRoutingModule { }
