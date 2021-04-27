import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { GetQuoteComponent } from './get-quote/get-quote.component';
import { LandingComponent } from './landing/landing.component';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';
import { ReviewPaymentComponent } from './review-payment/review-payment.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { SharedModule } from '../../shared/shared.module';
import { FundTripService} from './fund-trip.service';
import { GoBackGuard } from '../../core/guards/go-back-guard.service';

const routes: Routes = [
   {
      path: '',
      component: LandingComponent
   },
   {
      path: 'status',
      component: PaymentStatusComponent
   }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [FundTripService],
  declarations: [GetQuoteComponent, LandingComponent, PaymentDetailsComponent, ReviewPaymentComponent, PaymentStatusComponent],
  exports: [RouterModule],
  entryComponents: [GetQuoteComponent, PaymentDetailsComponent, ReviewPaymentComponent, PaymentStatusComponent]
})
export class FundTripRoutingModule { }
