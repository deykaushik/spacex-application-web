import { Component, OnInit, Injector, Renderer2, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreditLimitService } from '../credit-limit.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { IncomeExpensesComponent } from '../income-expenses/income-expenses.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { CreditDocumentsComponent } from '../documents/documents.component';
import { CreditSummaryComponent } from '../summary/summary.component';
import { BaseComponent } from '../../../core/components/base/base.component';
import { GAEvents } from '../../../core/utils/ga-event';
import { ICreditLimitMaintenance } from '../../../core/services/models';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { AddStepItem } from '../../../shared/components/stepper-work-flow/add-step-item';

@Component({
   selector: 'app-credit-landing',
   templateUrl: './credit-landing.component.html',
   styleUrls: ['./credit-landing.component.scss']
})
export class CreditLandingComponent extends BaseComponent implements OnInit, OnDestroy {

   isRequestCreditLimit: boolean;
   isProcessStarted: boolean;
   accountId: string;
   creditLimitDetails: ICreditLimitMaintenance;
   labels = CreditLimitMaintenance.labels;
   messages = CreditLimitMaintenance.messages;
   routerUrls = CreditLimitMaintenance.routerUrls;
   steppers: AddStepItem[];
   navigationSteps: string[];
   exitUrl: string;
   dropOffEvents = GAEvents.RequestCreditLimitIncrease;

   constructor(private workflowService: WorkflowService, private creditLimitService: CreditLimitService,
      private route: ActivatedRoute, private render: Renderer2, private router: Router, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.creditLimitDetails = {} as ICreditLimitMaintenance;
      this.creditLimitDetails = this.creditLimitService.getCreditLimitMaintenanceDetails();
      this.isRequestCreditLimit = false;
      this.isProcessStarted = false;
      this.exitUrl = this.routerUrls.dashboard + this.accountId;
      this.creditLimitService.setAccountId(this.accountId);
      this.navigationSteps = [];
      this.steppers = [
         new AddStepItem(IncomeExpensesComponent),
         new AddStepItem(CreditDocumentsComponent),
         new AddStepItem(ContactDetailsComponent),
         new AddStepItem(CreditSummaryComponent)
      ];
      this.openCreditLimitIncrease();
      this.navigationSteps = CreditLimitMaintenance.steps;
      this.workflowService.workflow = [{ step: this.navigationSteps[0], valid: false, isValueChanged: false },
      { step: this.navigationSteps[1], valid: false, isValueChanged: false },
      { step: this.navigationSteps[2], valid: false, isValueChanged: false },
      { step: this.navigationSteps[3], valid: false, isValueChanged: false }];
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
   }
   openCreditLimitIncrease() {
      this.isRequestCreditLimit = true;
   }
   changeRequestCreditLimit(event) {
      if (event) {
         this.isProcessStarted = true;
      } else {
         this.router.navigateByUrl(this.routerUrls.dashboard + this.accountId);
         this.changeProcessStarted(false);
      }
      this.isRequestCreditLimit = false;
   }
   changeProcessStarted(event) {
      this.isProcessStarted = event;
   }
   ngOnDestroy() {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
   }
   onCurrentStepIndex(event) {
      this.creditLimitDetails = this.creditLimitService.getCreditLimitMaintenanceDetails();
      switch (event) {
         case 1:
            if (this.creditLimitDetails.statementRetrival) {
               this.sendEvent(this.dropOffEvents.dropOffFromBankDetails.eventAction,
                  this.dropOffEvents.dropOffFromBankDetails.label, null,
                  this.dropOffEvents.dropOffFromBankDetails.category);
            } else {
               this.sendEvent(this.dropOffEvents.dropOffFromDocumentConsent.eventAction,
                  this.dropOffEvents.dropOffFromDocumentConsent.label, null,
                  this.dropOffEvents.dropOffFromDocumentConsent.category);
            }
            break;
         case 2:
            this.sendEvent(this.dropOffEvents.dropOffFromContactDetails.eventAction,
               this.dropOffEvents.dropOffFromContactDetails.label, null,
               this.dropOffEvents.dropOffFromContactDetails.category);
            break;
         case 3:
            this.sendEvent(this.dropOffEvents.dropOffFromSummary.eventAction,
               this.dropOffEvents.dropOffFromSummary.label, null,
               this.dropOffEvents.dropOffFromSummary.category);
            break;
         default:
            this.sendEvent(this.dropOffEvents.dropOffFromIncomeAndExpenses.eventAction,
               this.dropOffEvents.dropOffFromIncomeAndExpenses.label, null,
               this.dropOffEvents.dropOffFromIncomeAndExpenses.category);
            break;
      }
   }
}
