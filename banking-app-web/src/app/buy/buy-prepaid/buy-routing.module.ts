import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { LandingComponent } from './landing/landing.component';
import { BuyStatusComponent } from './buy-status/buy-status.component';
import { UnsavedChangesGuard } from '../../core/guards/unsaved-changes-guard.service';
import { GoBackGuard } from '../../core/guards/go-back-guard.service';

const routes: Routes = [
   { path: '', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard] },
   { path: 'status', component: BuyStatusComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   { path: ':accountnumber', component: LandingComponent, canDeactivate: [UnsavedChangesGuard, GoBackGuard], canLoad: [GoBackGuard]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class BuyRoutingModule { }
