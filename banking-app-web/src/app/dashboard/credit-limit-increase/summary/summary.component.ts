import { Router } from '@angular/router';
import { Component, OnInit, Injector } from '@angular/core';
import { CreditLimitService } from '../credit-limit.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { ICreditLimitMaintenance } from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-credit-summary',
   templateUrl: './summary.component.html',
   styleUrls: ['./summary.component.scss']
})
export class CreditSummaryComponent extends BaseComponent implements OnInit {

   labels = CreditLimitMaintenance.labels;
   messages = CreditLimitMaintenance.messages;
   routerUrls = CreditLimitMaintenance.routerUrls;
   workflowSteps: IStepper[];
   creditLimitDetails: ICreditLimitMaintenance;
   accountId: string;
   showLoader: boolean;
   isAccept: boolean;
   summaryDetails: ICreditLimitMaintenance;
   createRequestCreditLimitIncrease = GAEvents.RequestCreditLimitIncrease;
   constructor(private workflowService: WorkflowService, private creditLimitService: CreditLimitService,
      private router: Router, injector: Injector, private errorService: SystemErrorService) {
      super(injector);
   }

   ngOnInit() {
      this.workflowSteps = this.workflowService.workflow;
      this.creditLimitDetails = this.creditLimitService.getCreditLimitMaintenanceDetails();
      this.accountId = this.creditLimitService.getAccountId();
      this.isAccept = this.creditLimitDetails.statementRetrival;
      this.creditLimitService.setSummaryDetails(this.creditLimitDetails);
   }
   goToSuccess() {
      if (this.isAccept) {
         this.showLoader = true;
         this.summaryDetails = this.creditLimitService.getSummaryDetails();
         this.summaryDetails.plasticId = parseInt(this.accountId, 10);
         this.creditLimitService.requestCreditLimitIncrease(this.summaryDetails).finally(() => {
            this.showLoader = false;
         }).subscribe(response => {
            if (response && response.metadata) {
               const status = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.transaction);
               if (status.isValid) {
                  this.sendEvent(this.createRequestCreditLimitIncrease.createCreditLimitIncrease.eventAction,
                     this.createRequestCreditLimitIncrease.createCreditLimitIncrease.label, null,
                     this.createRequestCreditLimitIncrease.createCreditLimitIncrease.category);
                  this.creditLimitDetails.statementRetrival ?
                     this.router.navigateByUrl(encodeURI(this.routerUrls.success + this.accountId)) :
                     this.router.navigateByUrl(encodeURI(this.routerUrls.review + this.accountId));
               } else {
                  this.errorService.raiseError({ error: status.reason });
               }
            }
         });
      }
   }
   onAccept() {
      this.isAccept = !this.isAccept;
   }
   goToOption(value) {
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[value].step);
   }
}
