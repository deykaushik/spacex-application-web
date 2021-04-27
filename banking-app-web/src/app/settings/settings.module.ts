import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { ProfileLimitsComponent } from './profile-limits/profile-limits.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { StatementsComponent } from './statements/statements.component';
import { AccountsComponent } from './accounts/accounts.component';
import { LimitsWidgetComponent } from './profile-limits/limits-widget/limits-widget.component';
import { SharedModule } from './../shared/shared.module';
import { ProfileLimitsService } from './profile-limits/profile-limits.service';
import { LinkAccountsComponent } from './link-accounts/link-accounts.component';
import { AccountService } from './../dashboard/account.service';
import { DefaultAccountComponent } from './default-account/default-account.component';
import { AccountVisibilityComponent } from './account-visibility/account-visibility.component';
import { AnnualCreditReviewComponent } from './annual-credit-review/annual-credit-review.component';
import { CardService } from '../cards/card.service';

@NgModule({
   imports: [
      CommonModule,
      SettingsRoutingModule,
      SharedModule
   ],
   declarations: [
      SettingsComponent,
      ProfileLimitsComponent,
      ManageUsersComponent,
      NotificationsComponent,
      StatementsComponent,
      AccountsComponent,
      LimitsWidgetComponent,
      LinkAccountsComponent,
      DefaultAccountComponent,
      AccountVisibilityComponent,
      AnnualCreditReviewComponent
   ],
   providers: [ProfileLimitsService, AccountService, BsModalService, CardService, BsModalRef]
})
export class SettingsModule { }
