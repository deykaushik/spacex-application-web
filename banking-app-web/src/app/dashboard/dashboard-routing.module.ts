import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundTripModule } from './fund-trip/fund-trip.module';
import { LandingComponent } from './landing/landing.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';
import { PocketDetailComponent} from './pocket-detail/pocket-detail.component';
import { DebitOrdersComponent } from './debit-orders/debit-orders.component';
import { ScheduledPaymentsComponent } from './scheduled-payments/scheduled-payments.component';

import { ViewSchedulePaymentComponent } from '../shared/components/view-schedule-payment/view-schedule-payment.component';
import { EditScheduledPaymentComponent } from '../shared/components/edit-scheduled-payment/edit-scheduled-payment.component';
import { StatementPreferencesComponent } from './statement-preferences/statement-preferences.component';
import { AccountViewMoreDetailComponent } from './account-view-more-detail/account-view-more-detail.component';
import { DirectPayComponent } from './settlement/direct-pay/direct-pay.component';
import { RequestQuoteComponent } from './settlement/request-quote/request-quote.component';
import { LocateBranchComponent } from './uplift-dormancy/locate-branch/locate-branch.component';
import { OverdraftLimitViewComponent } from './overdraft/overdraft-limit-view/overdraft-limit-view.component';
import { PocketTripsComponent } from './pocket-trips/pocket-trips.component';
import { StatementsDocumentsComponent } from './statements-documents/statements-documents.component';
import { ManagePaymentDetailsComponent } from './manage-payment-details/manage-payment-details.component';
import { CreditLandingComponent } from './credit-limit-increase/credit-landing/credit-landing.component';
import { CreditSuccessComponent } from './credit-limit-increase/success/success.component';
import { ReviewComponent } from './credit-limit-increase/review/review.component';
import { IncomeTaxDetailsComponent } from './statements-documents/documents/document-IT3B/income-tax-details.component';
import { MfcLandingComponent } from './statements-documents/documents/document-mfc/mfc-landing/mfc-landing.component';
import { StatusComponent } from './statements-documents/documents/document-mfc/status/status.component';

const routes: Routes = [
   { path: '', component: LandingComponent },
   { path: 'account/detail/:accountId', component: AccountDetailComponent },
   { path: 'account/pocket/:accountId/:pocketCurrency', component: PocketDetailComponent },
   { path: 'account/scheduled/:accountId', component: ScheduledPaymentsComponent },
   { path: 'account/scheduled/:accountId/:transactionType/:transactionID', component: ViewSchedulePaymentComponent },
   { path: 'account/scheduled/:accountId/:transactionType/:transactionID/edit', component: EditScheduledPaymentComponent },
   { path: 'account/detail/:accountId/debit-orders', component: DebitOrdersComponent },
   { path: 'account/detail/:accountId/manage-payment', component: ManagePaymentDetailsComponent },
   { path: 'account/statement-preferences/:accountId', component: StatementPreferencesComponent },
   { path: 'account/detail/:accountId/view-more', component: AccountViewMoreDetailComponent },
   { path: 'account/settlement/direct-pay/:accountId', component: DirectPayComponent },
   { path: 'account/settlement/request-quote/:accountId', component: RequestQuoteComponent },
   { path: 'account/settlement/request-quote/:accountId/:directPay', component: RequestQuoteComponent },
   { path: 'account/upliftdormancy/branchlocator/:accountId', component: LocateBranchComponent},
   { path: 'account/overdraft/limit-view/:accountId', component: OverdraftLimitViewComponent },
   { path: 'account/detail/trip/:accountId', component: PocketTripsComponent },
   { path: 'fundtrip', loadChildren: 'app/dashboard/fund-trip/fund-trip.module#FundTripModule'},
   { path: 'account/statement-document/:accountId', component: StatementsDocumentsComponent },
   { path: 'account/statement-document/cross-border/:accountId', component: MfcLandingComponent },
   { path: 'account/statement-document/cross-border/status/:accountId', component: StatusComponent },
   { path: 'account/credit/limit/:accountId', component: CreditLandingComponent },
   { path: 'account/credit/limit/success/:accountId', component: CreditSuccessComponent },
   { path: 'account/credit/limit/review/:accountId', component: ReviewComponent },
   { path: 'account/it3b/:accountId', component: IncomeTaxDetailsComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class DashboardRoutingModule { }
