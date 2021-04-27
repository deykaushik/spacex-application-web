import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { SwiperModule } from 'angular2-useful-swiper';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import 'hammerjs';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../shared/shared.module';
import { CardsRoutingModule } from './cards-routing.module';
import { CardService } from './card.service';
import { LandingComponent } from './landing/landing.component';
import { CardCarouselComponent } from './card-carousel/card-carousel.component';
import { CardComponent } from './card/card.component';
import { CardManageComponent } from './card-manage/card-manage.component';
import { UpdateCardLimitComponent } from './update-card-limit/update-card-limit.component';
import { UpdateCardLimitStatusComponent } from './update-card-limit-status/update-card-limit-status.component';
import { CardManageBlockedComponent } from './card-manage-blocked/card-manage-blocked.component';
import { BlockCardComponent } from './block-card/block-card.component';
import { CardBlockedStatusComponent } from './card-blocked-status/card-blocked-status.component';
import { ReplaceCardBranchLocatorComponent } from './replace-card-branch-locator/replace-card-branch-locator.component';
import { ReplaceCardStatusComponent } from './replace-card-status/replace-card-status.component';
import { environment } from './../../environments/environment';
import { ReplaceCardComponent } from './replace-card/replace-card.component';
import {
   CardToggleStatusComponent
} from './card-toggle-status/card-toggle-status.component';
import { ActivateCardComponent } from './activate-card/activate-card.component';
import { ApoLandingComponent } from './apo/apo-landing/apo-landing.component';
import { InRangeDateSelectorComponent } from './apo/inrange-date-selector/inrange-date-selector.component';
import { PayFromComponent } from './apo/pay-from/pay-from.component';
import { PaymentAmountComponent } from './apo/payment-amount/payment-amount.component';
import { PaymentDateComponent } from './apo/payment-date/payment-date.component';
import { SuccessComponent } from './apo/success/success.component';
import { InitiateAutopayComponent } from './apo/initiate-autopay/initiate-autopay.component';
import { SummaryComponent } from './apo/summary/summary.component';
import { OverseasLandingComponent } from './overseas-travel/overseas-landing/overseas-landing.component';
import { SelectCardComponent } from './overseas-travel/select-card/select-card.component';
import { SelectDatesComponent } from './overseas-travel/select-dates/select-dates.component';
import { SelectCountriesComponent } from './overseas-travel/select-countries/select-countries.component';
import { ContactDetailsComponent } from './overseas-travel/contact-details/contact-details.component';
import { OverseasSummaryComponent } from './overseas-travel/overseas-summary/overseas-summary.component';
import { OverseasSuccessComponent } from './overseas-travel/overseas-success/overseas-success.component';
import { ApoService } from './apo/apo.service';
import { WorkflowService } from '../core/services/stepper-work-flow-service';
import { AccountService } from '../dashboard/account.service';
import { PaymentService } from '../payment/payment.service';
import { OverseaTravelService } from './overseas-travel/overseas-travel.service';

@NgModule({
   imports: [
      CommonModule,
      CardsRoutingModule,
      ReactiveFormsModule,
      SwiperModule,
      SharedModule,
      AgmCoreModule.forRoot({
         apiKey: environment.googleMapApiKey
      }),
      AgmSnazzyInfoWindowModule,
      AgmJsMarkerClustererModule
   ],
   entryComponents: [ApoLandingComponent, InRangeDateSelectorComponent, PayFromComponent,
      PaymentAmountComponent, PaymentDateComponent, SuccessComponent, SummaryComponent,
      InitiateAutopayComponent, OverseasLandingComponent, SelectCardComponent,
      SelectDatesComponent, SelectCountriesComponent, ContactDetailsComponent, OverseasSummaryComponent, OverseasSuccessComponent],
   declarations: [LandingComponent, CardCarouselComponent, CardComponent, CardManageComponent,
      CardManageBlockedComponent, UpdateCardLimitComponent, UpdateCardLimitStatusComponent,
      CardBlockedStatusComponent, BlockCardComponent, ReplaceCardBranchLocatorComponent, ReplaceCardComponent,
      ReplaceCardStatusComponent, CardToggleStatusComponent, ActivateCardComponent,
      ApoLandingComponent, InRangeDateSelectorComponent, PayFromComponent, PaymentAmountComponent,
      PaymentDateComponent, SuccessComponent, SummaryComponent, InitiateAutopayComponent, OverseasLandingComponent, SelectCardComponent,
      SelectDatesComponent, SelectCountriesComponent, ContactDetailsComponent, OverseasSummaryComponent, OverseasSuccessComponent],
   providers: [CardService, ApoService, WorkflowService, AccountService, PaymentService, OverseaTravelService]
})
export class CardsModule { }
