import { AmountTransformPipe } from './../shared/pipes/amount-transform.pipe';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsModalService, BsModalRef, ModalBackdropComponent } from 'ngx-bootstrap';
import { LandingComponent } from './landing/landing.component';
import { PayToComponent } from './pay-to/pay-to.component';
import { PayForComponent } from './pay-for/pay-for.component';
import { PayAmountComponent } from './pay-amount/pay-amount.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentService } from './payment.service';

import { SharedModule } from './../shared/shared.module';
import { PayStatusComponent } from './payment-status/pay-status.component';
import { PayReviewComponent } from './pay-review/pay-review.component';
import { RecipientService } from '../recipient/recipient.service';
import { ReportsModule } from '../reports/reports.module';

@NgModule({
   imports: [
      CommonModule,
      PaymentRoutingModule,
      SharedModule,
      FormsModule,
      ReportsModule
   ],
   declarations: [
      LandingComponent,
      PayToComponent,
      PayAmountComponent,
      PayForComponent,
      PayStatusComponent,
      PayReviewComponent
   ],
   entryComponents: [
      PayToComponent,
      PayAmountComponent,
      PayForComponent,
      PayStatusComponent,
      PayReviewComponent
   ],
   providers: [PaymentService, DatePipe, BsModalService, BsModalRef, ModalBackdropComponent, RecipientService]
})
export class PaymentModule { }
