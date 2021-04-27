import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { InitiatePayoutComponent } from './initiate-payout/initiate-payout.component';
import { UnsavedChangesGuard } from '../core/guards/unsaved-changes-guard.service';
import { GoBackGuard } from '../core/guards/go-back-guard.service';
import { FinalDoneComponent } from './final-done/final-done.component';


const routes: Routes = [
   { path: ':accountId', component: LandingComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   { path: 'initiate/:accountId', component: InitiatePayoutComponent },
   { path: 'done/:type/:accountId', component: FinalDoneComponent },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class PayoutRoutingModule { }
