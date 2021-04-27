import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePinPasswordComponent } from './profile-pin-password/profile-pin-password.component';
import { ApproveItComponent } from './approve-it/approve-it.component';
import { RegisterLandingComponent } from './register-landing/register-landing.component';
import { UnsavedChangesGuard } from '../core/guards/unsaved-changes-guard.service';
import { GoBackGuard } from '../core/guards/go-back-guard.service';

const routes: Routes = [
   {
      path: '', component: RegisterLandingComponent,
      canDeactivate: [GoBackGuard]
   },
   { path: 'profile', component: ProfilePinPasswordComponent },
   { path: 'approveit', component: ApproveItComponent },
   { path: 'landing', component: RegisterLandingComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class RegisterRoutingModule { }
