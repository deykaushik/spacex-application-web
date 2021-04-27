import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, Resolve } from '@angular/router';

import { AuthGuardService } from './core/guards/auth-guard.service';
import { UnauthorizedComponent } from './core/components/unauthorized/unauthorized.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { GoBackGuard } from './core/guards/go-back-guard.service';
import { RefreshGuard } from './core/guards/refresh.guard';
import { CheckLoginGuard } from './core/guards/check-login.guard';

const routes: Routes = [
   {
      path: '',
      children: [
         { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
         {
            path: 'dashboard',
            canLoad: [AuthGuardService, GoBackGuard],
            canActivate: [CheckLoginGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
         },
         {
            path: 'payment',
            canLoad: [AuthGuardService],
            loadChildren: 'app/payment/payment.module#PaymentModule'
         },
         {
            path: 'transfer',
            canLoad: [AuthGuardService],
            loadChildren: 'app/transfer/transfer.module#TransferModule'
         },
         {
            path: 'buy',
            canLoad: [AuthGuardService],
            loadChildren: 'app/buy/buy-prepaid/buy.module#BuyModule'
         },
         {
            path: 'cards',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/cards/cards.module#CardsModule'
         },
         {
            path: 'auth',
            loadChildren: 'app/auth/auth.module#AuthModule'
         },
         {
            path: 'register',
            loadChildren: 'app/register/register.module#RegisterModule'
         },
         {
            path: 'unauthorized',
            component: UnauthorizedComponent
         },
         {
            path: 'finances',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/buy/buy-prepaid/buy.module#BuyModule'
         },
         {
            path: 'settings',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/settings/settings.module#SettingsModule'
         },
         {
            path: 'commingsoon',
            loadChildren: 'app/comming-soon/comming-soon.module#CommingSoonModule'
         },
         {
            path: 'branchlocator',
            canLoad: [GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/branch-locator/branch-locator.module#BranchLocatorModule'
         },
         {
            path: 'buyElectricity',
            canLoad: [AuthGuardService],
            loadChildren: 'app/buy/buy-electricity/buy-electricity.module#BuyElectricityModule'
         },
         {
            path: 'unitTrusts',
            canLoad: [AuthGuardService],
            loadChildren: 'app/redeem/unit-trusts/unit-trusts.module#UnitTrustsModule'
         },
         {
            path: 'chargesAndFees',
            canLoad: [AuthGuardService],
            loadChildren: 'app/redeem/charges-and-fees/charges-and-fees.module#ChargesAndFeesModule'
         },
         {
            path: 'game',
            canLoad: [AuthGuardService],
            loadChildren: 'app/buy/game/game.module#GameModule'
         },
         {
            path: 'profile',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/profile/profile.module#ProfileModule'
         },
         {
            path: 'feedback',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/feedback/feedback.module#FeedbackModule'
         },
         {
            path: 'recipient',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/recipient/recipient.module#RecipientModule'
         },
         {
            path: 'payout',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/payout/payout.module#PayoutModule'
         },
         {
            path: 'maintenance',
            canLoad: [GoBackGuard],
            canDeactivate: [GoBackGuard],
            component: MaintenanceComponent
         },
         {
            path: 'manageloan',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/manage-loan/manage-loan.module#ManageLoanModule'
         },
         {
            path: 'open-account',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/open-account/open-account.module#OpenAccountModule'
         },
         {
            path: 'offers',
            canLoad: [AuthGuardService, GoBackGuard],
            canDeactivate: [GoBackGuard],
            loadChildren: 'app/pre-approved-offers/pre-approved-offers.module#PreApprovedOffersModule'
         },
         {
            path: '**',
            redirectTo: '/login'
         }
      ]
   }
];

@NgModule({
   imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })],
   exports: [RouterModule]
})
export class AppRoutingModule { }
