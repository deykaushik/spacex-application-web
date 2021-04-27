import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../../../../core/utils/constants';
import { IStepper } from '../../../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { WorkflowService } from '../../../../../core/services/stepper-work-flow-service';
import { AccountService } from '../../../../account.service';
import { SystemErrorService } from './../../../../../core/services/system-services.service';
import { ClientProfileDetailsService } from '../../../../../core/services/client-profile-details.service';
import { BaseComponent } from '../../../../../core/components/base/base.component';
import { ICrossBorderRequest, IApiResponse } from '../../../../../core/services/models';
import { CommonUtility } from '../../../../../core/utils/common';
import { NotificationTypes } from '../../../../../core/utils/enums';
import { GAEvents } from '../../../../../core/utils/ga-event';

@Component({
   selector: 'app-email',
   templateUrl: './email.component.html',
   styleUrls: ['./email.component.scss']
})
export class EmailComponent extends BaseComponent implements OnInit {

   labels = Constants.labels.statementAndDocument.documents.mfc.email;
   values = Constants.VariableValues.statementAndDocument;
   emailPattern = Constants.patterns.email;
   workflowSteps: IStepper[];
   corssBorderRequest: ICrossBorderRequest;
   isAccepted: boolean;
   recipientEmail: string;
   status: NotificationTypes = NotificationTypes.None;
   showLoader: boolean;
   notificationTypes = NotificationTypes;
   retryCount = 0;
   retryLimitExceeded = false;
   isOverlayVisible = false;
   isValidEmail: boolean;

   constructor(private workflowService: WorkflowService, private accountService: AccountService,
      private router: Router, private systemErrorService: SystemErrorService,
      private clientPreferences: ClientProfileDetailsService, injector: Injector) {
         super(injector);
   }

   ngOnInit() {
      this.corssBorderRequest = this.accountService.getMfcCrossBorderRequest();
      this.workflowSteps = this.workflowService.workflow;
      this.getDefaultEmail();
   }

   getDefaultEmail() {
      const clientDetails = this.clientPreferences.getClientPreferenceDetails();
      this.recipientEmail = clientDetails && clientDetails.EmailAddress ? clientDetails.EmailAddress : '';
      this.onEmailChange(this.recipientEmail);
   }

   onNextClick() {
      this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[2].step);
   }

   onRequest() {
      if (this.retryCount <= this.values.tryAgainLimit) {
         this.showLoader = true;
         this.accountService.sendCrossBorderRequest(this.getRequest())
            .finally(() => {
               this.showLoader = false;
            })
            .subscribe((response: IApiResponse) => {
               if (response && response.metadata) {
                  const resp = CommonUtility.getTransactionStatus(response.metadata, Constants.metadataKeys.crossBorderLetter);
                  this.status = resp.isValid ? NotificationTypes.Success : NotificationTypes.Error;
                  if (resp.isValid) {
                     this.sendGAEvent();
                  }
               }
            }, (error) => {
               this.systemErrorService.closeError();
               this.status = NotificationTypes.Error;
            });
         this.retryLimitExceeded = this.retryCount === this.values.tryAgainLimit;
      } else {
         this.retryLimitExceeded = true;
      }
   }

   getRequest(): ICrossBorderRequest {
      this.corssBorderRequest.emailId = this.recipientEmail;
      return this.corssBorderRequest;
   }

   onRetryRequest(isRetried: boolean) {
      if (isRetried) {
         this.retryCount++;
         this.onRequest();
      } else {
         this.closeOverlay();
      }
   }

   closeOverlay() {
      this.isOverlayVisible = false;
      this.router.navigateByUrl(encodeURI(Constants.routeUrls.statementDocument + this.corssBorderRequest.itemAccountId));
   }

   onEmailChange(recipientEmail: string) {
      this.isValidEmail = CommonUtility.isValidEmail(recipientEmail);
   }

   sendGAEvent() {
      const category = CommonUtility.format(GAEvents.statementsAndDocuments.success.category,
         Constants.VariableValues.statementAndDocument.mfc);
      const eventAction = CommonUtility.format(GAEvents.statementsAndDocuments.success.eventAction,
         Constants.VariableValues.statementAndDocument.mfc, this.values.crossBorderLetter);
      this.sendEvent(eventAction, GAEvents.statementsAndDocuments.success.label, null, category);
   }
}
