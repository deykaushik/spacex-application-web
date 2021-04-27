import { Component, OnInit, Injector } from '@angular/core';
import { Constants } from '../../core/utils/constants';
import { Router } from '@angular/router';
import { PayoutService } from '../payout.service';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IBuildingPayout, IMetaData } from '../payout.models';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { GAEvents } from '../../core/utils/ga-event';
import { BaseComponent } from '../../core/components/base/base.component';

@Component({
   selector: 'app-summary',
   templateUrl: './summary.component.html',
   styleUrls: ['./summary.component.scss']
})

export class SummaryComponent extends BaseComponent implements OnInit {
   summaryLabels = Constants.labels.buildingLoan;
   amountLabel: string;
   showLoader: boolean;
   workflowSteps: IStepper[];
   payoutStepData: IBuildingPayout;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   paymentAmount: string;
   paymentType: string;
   amountTransform = new AmountTransformPipe();
   isOverlayView: boolean;

   constructor(private router: Router, private payoutService: PayoutService, private workflowService: WorkflowService, injector: Injector) {
      super(injector);
   }
   ngOnInit() {
      this.payoutStepData = this.payoutService.payoutData;
      this.paymentAmount = this.payoutStepData.amount === this.summaryLabels.max ? this.summaryLabels.maxAmount :
         this.amountTransform.transform(this.payoutStepData.amount);
      this.paymentType = this.payoutStepData.payOutType === this.summaryLabels.final ?
         this.summaryLabels.final : this.summaryLabels.progress;
      this.workflowSteps = this.workflowService.workflow;
      this.amountLabel = Constants.labels.amount;
   }
   requestPayOut() {
      if (this.workflowService.getFirstInvalidStep() === this.workflowSteps.length - 1) {
         this.showLoader = true;
         this.payoutService.createBuildingLoanPayout(this.payoutService.
            getCreateRequestData(this.payoutStepData),
            { itemAccountId: this.payoutStepData.accountId }).subscribe((response: IMetaData) => {
               if (response) {
                  if ((response.resultData[0].resultDetail[0].status) === Constants.metadataKeys.success) {
                     this.router.navigateByUrl(Constants.routeUrls.payoutDone + this.payoutStepData.payOutType.toLowerCase()
                        + '/' + this.payoutStepData.accountId);
                     const paymentRequestSubmitted = GAEvents.requestPaymentAction.paymentRequestSubmitted;
                     this.sendEvent(paymentRequestSubmitted.eventAction, paymentRequestSubmitted.label,
                        null, paymentRequestSubmitted.category);
                  }
                  this.showLoader = false;
               }
            });
      }
   }
   onEditClick(stepIndex: number) {
      this.workflowService.finalStepEditEmitter.emit(this.workflowSteps[stepIndex].step);
   }
   formatTelephone(contactNumber: string): string {
      let contactNum = contactNumber.replace(/[\s]/g, '');
      const internationalCode = Constants.VariableValues.countryCode + ' ';
      contactNum = contactNum.replace(contactNum.substring(0, 3), contactNum.substring(0, 3) + ' ');
      contactNum = contactNum.replace(contactNum.substring
         (contactNum.indexOf(internationalCode),
         contactNum.indexOf(internationalCode) + 6), contactNum.substring
            (contactNum.indexOf(internationalCode),
            contactNum.indexOf(internationalCode) + 6) + ' ');
      contactNum = contactNum.replace(contactNum.substring(contactNum.indexOf(internationalCode),
         contactNum.indexOf(internationalCode) + 10)
         , contactNum.substring(contactNum.indexOf(internationalCode),
            contactNum.indexOf(internationalCode) + 10) + ' ');
      return contactNum;
   }
   openTermsModal() {
      this.isOverlayView = true;
   }
   closeTermsModal() {
      this.isOverlayView = false;
   }
}
