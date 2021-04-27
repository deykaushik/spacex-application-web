import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoBackGuard } from '../core/guards/go-back-guard.service';
import { LandingComponent } from './landing/landing.component';
import { PlaceNoticeComponent } from './place-notice/place-notice.component';
import { CancelLoanComponent } from './cancel-loan/cancel-loan.component';

const routes: Routes = [
   { path: ':accountId', component: LandingComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   { path: 'placenotice/:accountId', component: PlaceNoticeComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] },
   { path: 'cancelloan/:accountId', component: CancelLoanComponent, canDeactivate: [GoBackGuard], canLoad: [GoBackGuard] }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ManageLoanRoutingModule { }
