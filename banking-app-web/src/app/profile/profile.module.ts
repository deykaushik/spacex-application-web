import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../core/core.module';
import { SharedModule } from './../shared/shared.module';

import { ProfileComponent } from './profile.component';
import { ProfileEditComponent } from './profile-details/profile-edit/profile-edit.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ContactDetailsComponent } from './profile-details/contact-details/contact-details.component';
import { ProfileService } from './profile.service';
import { ViewBankerComponent } from './view-banker/view-banker.component';
@NgModule({
   imports: [
      CommonModule,
      ProfileRoutingModule,
      SharedModule
   ],
   declarations: [
      ProfileComponent,
      ProfileEditComponent,
      ProfileDetailsComponent,
      ChangePasswordComponent,
      ViewBankerComponent,
      ContactDetailsComponent
   ],
   providers: [
      ProfileService
   ]
})
export class ProfileModule { }
