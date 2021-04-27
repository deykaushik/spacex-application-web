import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { LogoffComponent } from './logoff/logoff.component';
import { ProfileBlockedComponent } from './profile-blocked/profile-blocked.component';
import { TermsAndConditionsAuthComponent } from './terms-and-conditions/terms-and-conditions-auth.component';

const routes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', component: LoginComponent },
   { path: 'logoff', component: LogoffComponent },
   { path: 'profileBlocked', component: ProfileBlockedComponent },
   { path: 'terms', component: TermsAndConditionsAuthComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class AuthRoutingModule { }
