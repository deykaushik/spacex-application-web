import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenAccountRoutingModule } from './open-account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AccountService } from '../dashboard/account.service';
import { OpenAccountService } from './open-account.service';
import { WorkflowService } from '../core/services/stepper-work-flow-service';
import { OpenNewAccountComponent } from './open-new-account/open-new-account.component';
import { RightOptionsComponent } from './right-options/right-options.component';
import { OpenAccountSuccessComponent } from './open-account-success/open-account-success.component';
import { StepperComponent } from './open-account-stepper/stepper/stepper.component';
import { DepositDetailsComponent } from './open-account-stepper/open-new-account-details/deposit-details/deposit-details.component';
import { InterestDetailsComponent } from './open-account-stepper/open-new-account-details/interest-details/interest-details.component';
import { ProductDetailsComponent } from './open-account-stepper/product-details/product-details.component';
import { RecurringPaymentComponent } from './open-account-stepper/open-new-account-details/recurring-payment/recurring-payment.component';
import { OpenNewAccountDetailsComponent } from './open-account-stepper/open-new-account-details/open-new-account-details.component';
import { ReviewDetailsComponent } from './open-account-stepper/review-details/review-details.component';
import {ProcessingTimeComponent} from './processing-time/processing-time.component';
import { ExitPopUpComponent } from './open-account-stepper/exit-pop-up/exit-pop-up.component';

@NgModule({
   imports: [
      CommonModule,
      OpenAccountRoutingModule,
      SharedModule
   ],
   declarations: [OpenNewAccountComponent, RightOptionsComponent, OpenAccountSuccessComponent, ReviewDetailsComponent,
      StepperComponent, DepositDetailsComponent, InterestDetailsComponent, ProductDetailsComponent, OpenNewAccountDetailsComponent,
      RecurringPaymentComponent, ProcessingTimeComponent, ExitPopUpComponent],
   entryComponents: [ProductDetailsComponent, OpenNewAccountDetailsComponent, ReviewDetailsComponent],
   providers: [AccountService, OpenAccountService, WorkflowService]
})
export class OpenAccountModule { }
