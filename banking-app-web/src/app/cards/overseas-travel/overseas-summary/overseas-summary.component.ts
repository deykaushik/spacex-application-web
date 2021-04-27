import { Component, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseComponent } from '../../../core/components/base/base.component';
import { OverseaTravelService } from '../overseas-travel.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IOverseasTravelDetails, IPlasticCard, IMetaData } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { GAEvents } from '../../../core/utils/ga-event';
import { CommonUtility } from '../../../core/utils/common';
@Component({
   selector: 'app-overseas-summary',
   templateUrl: './overseas-summary.component.html',
   styleUrls: ['./overseas-summary.component.scss']
})
export class OverseasSummaryComponent extends BaseComponent implements OnInit {
   labels = Constants.overseasTravel.labels;
   workflowSteps: IStepper[];
   overseasTravelDetails: IOverseasTravelDetails;
   cards: IPlasticCard[];
   countries: string[];
   dateFormat: string = Constants.formats.ddmmyyyywithdash;
   isButtonLoader = false;

   constructor(private workflowService: WorkflowService, private overseaTravelService: OverseaTravelService,
      private router: Router, private route: ActivatedRoute, injector: Injector, private errorService: SystemErrorService) {
      super(injector);
   }

   ngOnInit() {
      this.workflowSteps = this.workflowService.workflow;
      this.overseasTravelDetails = this.overseaTravelService.getOverseasTravelDetails();
      this.cards = this.overseaTravelService.getCardDetails();
   }

   submitOverseasTravelDetails() {
      this.isButtonLoader = true;
      const overseasTravelNotificationGAEvents = GAEvents.overseasTravelNotification.submitUseCardOverseas;
      const category = GAEvents.overseasTravelNotification.category;
      this.sendEvent(overseasTravelNotificationGAEvents.label,
         overseasTravelNotificationGAEvents.eventAction,
         overseasTravelNotificationGAEvents.value, category);
      this.overseaTravelService.createOverseasTravelNotificationDetails(this.overseasTravelDetails)
      .finally(() => {
         this.isButtonLoader = false;
      }).subscribe((response: IMetaData) => {
         const status = CommonUtility.getTransactionStatus(response, Constants.metadataKeys.transaction);
         if (status.isValid) {
            this.overseaTravelService.setOtnSucces();
         } else {
            this.errorService.raiseError({ error: status.reason });
         }
      });
   }

   onEditClick(stepIndex: number) {
      this.workflowService.finalStepEditEmitter.emit(this.workflowSteps[stepIndex].step);
   }
}
