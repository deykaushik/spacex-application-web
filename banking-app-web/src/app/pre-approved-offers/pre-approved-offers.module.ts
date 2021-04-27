import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing/landing.component';
import { InformationComponent } from './information/information.component';
import { PreApprovedOffersRoutingModule } from './pre-approved-offers-routing.module';
import { WorkflowService } from '../core/services/stepper-work-flow-service';
import { SharedModule } from '../shared/shared.module';
import { OfferComponent } from './offer/offer.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { WrongInformationComponent } from './wrong-information/wrong-information.component';
import { DoneComponent } from './done/done.component';
import { ReviewComponent } from './review/review.component';
import { DisclosuresComponent } from './disclosures/disclosures.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PreApprovedOffersRoutingModule
  ],
  entryComponents: [InformationComponent, OfferComponent, ReviewComponent, DisclosuresComponent],
  declarations: [GetStartedComponent , LandingComponent, InformationComponent,
  OfferComponent, FeedbackComponent, WrongInformationComponent, DoneComponent, ReviewComponent,
  DisclosuresComponent, NotificationsComponent],
  providers: [WorkflowService]
})
export class PreApprovedOffersModule { }
