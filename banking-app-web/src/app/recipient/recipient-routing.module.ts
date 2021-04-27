import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingComponent } from './landing/landing.component';
import { EditRecipientComponent } from './edit-recipient/edit-recipient.component';
import { ViewRecipientComponent } from './view-recipient/view-recipient.component';
import { ViewSchedulePaymentComponent } from '../shared/components/view-schedule-payment/view-schedule-payment.component';
import { RepeatTransactionComponent } from './repeat-transaction/repeat-transaction.component';
import { RepeatTransactionStatusComponent } from './repeat-transaction-status/repeat-transaction-status.component';

const routes: Routes = [
   {
      path: '', component: LandingComponent,
      children: [
         { path: 'view', component: ViewRecipientComponent },
         { path: 'edit', component: EditRecipientComponent }
      ]
   },
   { path: 'payment', component: RepeatTransactionComponent },
   { path: 'payment/status', component: RepeatTransactionStatusComponent },
   { path: 'scheduled/:transactionType/:transactionID', component: ViewSchedulePaymentComponent },
   { path: ':action', component: LandingComponent },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class RecipientRoutingModule { }

