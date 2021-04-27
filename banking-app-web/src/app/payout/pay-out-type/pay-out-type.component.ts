import { Component, OnInit, Output, EventEmitter, AfterViewChecked } from '@angular/core';
import { PayoutService } from '../payout.service';
import { IBuildingPayout } from '../payout.models';
import { Constants } from '../../core/utils/constants';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { PreFillService } from '../../core/services/preFill.service';

@Component({
   selector: 'app-pay-out-type',
   templateUrl: './pay-out-type.component.html',
   styleUrls: ['./pay-out-type.component.scss']
})

export class PayOutTypeComponent implements OnInit, AfterViewChecked {
   payoutStepData: IBuildingPayout;
   showFinalPopup: boolean;
   payoutTypeLabel = Constants.labels.buildingLoan.paymentType;
   workflowSteps: IStepper[];
   propertyAddress: string;
   constructor(private payoutService: PayoutService, private workflowService: WorkflowService, private prefillService: PreFillService) { }
   ngOnInit() {
      this.propertyAddress = this.prefillService.buildingBalanceData ? this.prefillService.buildingBalanceData.PropertyAddress : '';
      this.payoutStepData = this.payoutService.payoutData;
      this.workflowSteps = this.workflowService.workflow;
   }
   ngAfterViewChecked() {
      if (this.showFinalPopup) {
         this.workflowSteps[0].isValueChanged = true;
      } else {
         this.workflowSteps[0].isValueChanged = false;
      }
   }
   onPayoutTypeSelect(payoutType: string) {
      this.payoutStepData.propertyAddress = this.propertyAddress;
      if (payoutType === this.payoutTypeLabel.progress.toLowerCase()) {
         this.payoutStepData.payOutType = this.payoutTypeLabel.progress;
         this.payoutService.payoutData = this.payoutStepData;
         this.workflowSteps[0] = { step: this.workflowSteps[0].step, valid: true, isValueChanged: false };
         this.workflowService.workflow = this.workflowSteps;
         this.workflowService.stepClickEmitter.emit(this.workflowSteps[1].step);
      } else if (payoutType === this.payoutTypeLabel.final.toLowerCase()) {
         this.payoutStepData.payOutType = this.payoutTypeLabel.final;
         this.payoutService.payoutData = this.payoutStepData;
         this.showFinalPopup = true;
      }
   }
   userAction(popupAction: string) {
      this.showFinalPopup = false;
      if (popupAction === this.payoutTypeLabel.next) {
         this.payoutStepData.propertyAddress = this.propertyAddress;
         this.payoutStepData.payOutType = this.payoutTypeLabel.final;
         this.payoutService.payoutData = this.payoutStepData;
         this.workflowSteps[0] = { step: this.workflowSteps[0].step, valid: true, isValueChanged: false };
         this.workflowService.workflow = this.workflowSteps;
         this.workflowService.stepClickEmitter.emit(this.workflowSteps[1].step);
      }
   }
}
