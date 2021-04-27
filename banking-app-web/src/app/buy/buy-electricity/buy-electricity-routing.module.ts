import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes-guard.service';
import { LandingComponent } from './landing/landing.component';
import { BuyElectricityStatusComponent } from './buy-electricity-status/buy-electricity-status.component';
import { GoBackGuard } from '../../core/guards/go-back-guard.service';
import { TermsConditionGuard } from '../../core/guards/terms-condition.guard';

const routes: Routes = [
   {
      path: '', component: LandingComponent,
      canDeactivate: [UnsavedChangesGuard, GoBackGuard],
      canLoad: [GoBackGuard],
      canActivate: [TermsConditionGuard]
   },
   { path: 'status', component: BuyElectricityStatusComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   {
      path: ':accountnumber', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard],
      canActivate: [TermsConditionGuard]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class BuyElectricityRoutingModule { }
