import { Component, OnInit, Renderer2, OnDestroy, Injector, Input, Output, EventEmitter } from '@angular/core';
import { AddStepItem } from '../../../shared/components/stepper-work-flow/add-step-item';
import { OverseaTravelService } from '../overseas-travel.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { SelectCardComponent } from '../select-card/select-card.component';
import { SelectDatesComponent } from '../select-dates/select-dates.component';
import { SelectCountriesComponent } from '../select-countries/select-countries.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { OverseasSummaryComponent } from '../overseas-summary/overseas-summary.component';
import { BaseComponent } from '../../../core/components/base/base.component';
import { Constants } from '../../../core/utils/constants';
import { GAEvents } from '../../../core/utils/ga-event';


@Component({
   selector: 'app-overseas-landing',
   templateUrl: './overseas-landing.component.html',
   styleUrls: ['./overseas-landing.component.scss']
})
export class OverseasLandingComponent extends BaseComponent implements OnInit, OnDestroy {
   @Input() plasticId: number;
   @Output() onHide = new EventEmitter();
   steppers: AddStepItem[];
   footerStepper: AddStepItem[];
   navigationSteps: string[];
   category = GAEvents.overseasTravelNotification.category;
   dropoffGAEvents = GAEvents.overseasTravelNotification;

   constructor(private workflowService: WorkflowService, injector: Injector, private overseaTravelService: OverseaTravelService,
       private render: Renderer2) {
      super(injector);
   }

   ngOnInit() {
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
      this.navigationSteps = [];
      this.overseaTravelService.setPlasticId(this.plasticId);
      this.steppers = [
         new AddStepItem(SelectCardComponent),
         new AddStepItem(SelectDatesComponent),
         new AddStepItem(SelectCountriesComponent),
         new AddStepItem(ContactDetailsComponent),
         new AddStepItem(OverseasSummaryComponent)
      ];
      this.navigationSteps = Constants.overseasTravel.steps;
      this.workflowService.workflow = [{ step: this.navigationSteps[0], valid: false, isValueChanged: false },
      { step: this.navigationSteps[1], valid: false, isValueChanged: false },
      { step: this.navigationSteps[2], valid: false, isValueChanged: false },
      { step: this.navigationSteps[3], valid: false, isValueChanged: false },
      { step: this.navigationSteps[4], valid: false, isValueChanged: false }];
   }

   onCurrentStepIndex(event) {
      switch (event) {
         case 0: {
            this.dropoffGAEvents.dropOffSelectCard = GAEvents.overseasTravelNotification.dropOffSelectCard;
            this.sendEvent(this.dropoffGAEvents.dropOffSelectCard.label, this.dropoffGAEvents.dropOffSelectCard.eventAction,
               this.dropoffGAEvents.dropOffSelectCard.value, this.category);
            break;
         }
         case 1: {
            this.dropoffGAEvents.dropOffSelectDates = GAEvents.overseasTravelNotification.dropOffSelectDates;
            this.sendEvent(this.dropoffGAEvents.dropOffSelectDates.label, this.dropoffGAEvents.dropOffSelectDates.eventAction,
               this.dropoffGAEvents.dropOffSelectDates.value, this.category);
            break;
         }
         case 2: {
            this.dropoffGAEvents.dropOffSelectCountries = GAEvents.overseasTravelNotification.dropOffSelectCountries;
            this.sendEvent(this.dropoffGAEvents.dropOffSelectCountries.label, this.dropoffGAEvents.dropOffSelectCountries.eventAction,
               this.dropoffGAEvents.dropOffSelectCountries.value, this.category);
            break;
         }
         case 3: {
            this.dropoffGAEvents.dropOffContactDetails = GAEvents.overseasTravelNotification.dropOffContactDetails;
            this.sendEvent(this.dropoffGAEvents.dropOffContactDetails.label, this.dropoffGAEvents.dropOffContactDetails.eventAction,
               this.dropoffGAEvents.dropOffContactDetails.value, this.category);
            break;
         }
         case 4: {
            this.dropoffGAEvents.dropOffSummary = GAEvents.overseasTravelNotification.dropOffSummary;
            this.sendEvent(this.dropoffGAEvents.dropOffSummary.label, this.dropoffGAEvents.dropOffSummary.eventAction,
               this.dropoffGAEvents.dropOffSummary.value, this.category);
            break;
         }
      }
   }

   hideStepper(event: boolean) {
    this.onHide.emit(event);
   }

   ngOnDestroy() {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
   }

}
