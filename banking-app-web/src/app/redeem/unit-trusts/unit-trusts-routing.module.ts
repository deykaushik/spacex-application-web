import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes-guard.service';
import { GoBackGuard } from '../../core/guards/go-back-guard.service';

import { LandingComponent } from './landing/landing.component';
import { UnitTrustsStatusComponent } from './unit-trusts-status/unit-trusts-status.component';

const routes: Routes = [
   { path: '', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard] },
   { path: 'status', component: UnitTrustsStatusComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   { path: ':accountnumber', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class UnitTrustsRoutingModule { }
