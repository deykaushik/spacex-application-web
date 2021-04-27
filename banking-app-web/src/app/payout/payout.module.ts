import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';
import { environment } from './../../environments/environment';
import { LandingComponent } from './landing/landing.component';
import { PayoutRoutingModule } from './payout-routing.module';
import { InitiatePayoutComponent } from './initiate-payout/initiate-payout.component';
import { PayOutDetailsComponent } from './pay-out-details/pay-out-details.component';
import { PayOutTypeComponent } from './pay-out-type/pay-out-type.component';
import { ContactPersonComponent } from './contact-person/contact-person.component';
import { SummaryComponent } from './summary/summary.component';
import { WorkflowService } from '../core/services/stepper-work-flow-service';
import { PayoutService } from './payout.service';
import { CoreModule } from '../core/core.module';
import { AuthGuardService } from '../core/guards/auth-guard.service';
import { FinalDoneComponent } from './final-done/final-done.component';
import { PopupComponent } from './popup/popup.component';
import { PopupDiscardComponent } from './popup-discard/popup-discard.component';
import { PayoutTermsComponent } from './payout-terms/payout-terms.component';



@NgModule({
   imports: [
      CommonModule,
      SharedModule,
      PayoutRoutingModule
   ],
   entryComponents: [LandingComponent, InitiatePayoutComponent, PayOutDetailsComponent,
      PayOutTypeComponent, ContactPersonComponent, SummaryComponent, PayoutTermsComponent],
   declarations: [LandingComponent, PayOutDetailsComponent, InitiatePayoutComponent, PayOutTypeComponent,
      ContactPersonComponent, SummaryComponent, FinalDoneComponent, PopupComponent,
      PopupDiscardComponent, PayoutTermsComponent],
   providers: [PayoutService, WorkflowService, AuthGuardService]
})
export class PayoutModule { }
