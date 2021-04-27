import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ViewRecipientComponent } from './view-recipient/view-recipient.component';
import { EditRecipientComponent } from './edit-recipient/edit-recipient.component';
import { LandingComponent } from './landing/landing.component';
import { SharedModule } from './../shared/shared.module';
import { RecipientRoutingModule } from './recipient-routing.module';
import { RecipientService } from './recipient.service';
import { BuyElectricityModule } from '../buy/buy-electricity/buy-electricity.module';
import { AccountService } from '../dashboard/account.service';
import { DashboardModule } from '../dashboard/dashboard.module';
import { RepeatTransactionComponent } from './repeat-transaction/repeat-transaction.component';
import { PaymentService } from '../payment/payment.service';
import { RecentRecipientTransactionsComponent } from './recent-recipient-transactions/recent-recipient-transactions.component';
import { RepeatTransactionStatusComponent } from './repeat-transaction-status/repeat-transaction-status.component';

@NgModule({
   imports: [
      CommonModule,
      RecipientRoutingModule,
      SharedModule,
      FormsModule,
      BuyElectricityModule
   ],
   declarations: [ViewRecipientComponent, EditRecipientComponent, LandingComponent,
       RecentRecipientTransactionsComponent, RepeatTransactionComponent, RepeatTransactionStatusComponent],
   providers: [RecipientService, BsModalService, BsModalRef, AccountService, PaymentService]
})
export class RecipientModule { }
