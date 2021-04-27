import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileLimitsComponent } from './profile-limits/profile-limits.component';
import { SettingsComponent } from './settings.component';
import { AccountsComponent } from './accounts/accounts.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { StatementsComponent } from './statements/statements.component';
import { LinkAccountsComponent } from './link-accounts/link-accounts.component';
import { AccountVisibilityComponent } from './account-visibility/account-visibility.component';
import { DefaultAccountComponent } from './default-account/default-account.component';
import { AnnualCreditReviewComponent } from './annual-credit-review/annual-credit-review.component';

const routes: Routes = [
   {
      path: '',
      component: SettingsComponent,
      children: [
         {
            path: '',
            redirectTo: 'profile-limits',
            pathMatch: 'full'
         },
         {
            path: 'profile-limits',
            component: ProfileLimitsComponent
         },
         {
            path: 'accounts',
            component: AccountsComponent
         },
         {
            path: 'users',
            component: ManageUsersComponent
         },
         {
            path: 'notifications',
            component: NotificationsComponent
         },
         {
            path: 'statements',
            component: StatementsComponent
         },
         {
            path: 'link-accounts',
            component: LinkAccountsComponent
         },
         {
            path: 'account-visibility',
            component: AccountVisibilityComponent
         },
         {
            path: 'default-account',
            component: DefaultAccountComponent
         },
         {
            path: 'annual-credit-review',
            component: AnnualCreditReviewComponent
         }]
   }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class SettingsRoutingModule { }
