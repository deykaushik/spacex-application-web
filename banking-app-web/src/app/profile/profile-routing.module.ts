import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ViewBankerComponent } from './view-banker/view-banker.component';

const routes: Routes = [
   {
      path: '',
      component: ProfileComponent,
      children: [
         {
            path: '',
            redirectTo: 'profile-details',
            pathMatch: 'full'
         },
         {
            path: 'profile-details',
            component: ProfileDetailsComponent
         },
         {
            path: 'change-password',
            component: ChangePasswordComponent
         },
         {
            path: 'view-banker',
            component: ViewBankerComponent
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ProfileRoutingModule { }
