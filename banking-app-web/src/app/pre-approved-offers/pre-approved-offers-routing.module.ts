import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GoBackGuard } from '../core/guards/go-back-guard.service';
import { LandingComponent } from './landing/landing.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { NotificationsComponent } from './notifications/notifications.component';


const routes: Routes = [
   { path: '', component: NotificationsComponent },
   { path: ':offerid', component: GetStartedComponent },
   { path: ':offerid/apply', component: LandingComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class PreApprovedOffersRoutingModule { }
