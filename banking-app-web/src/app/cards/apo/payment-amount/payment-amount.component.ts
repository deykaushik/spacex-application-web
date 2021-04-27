import { Component, OnInit, ViewChild, AfterViewInit, Injector } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ApoService } from '../apo.service';
import { IPaymentAmountOptions, IAutoPayDetail } from '../apo.model';
import { ApoConstants } from '../apo-constants';
import { Constants } from '../../../core/utils/constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-payment-amount',
   templateUrl: './payment-amount.component.html',
   styleUrls: ['./payment-amount.component.scss']
})
export class PaymentAmountComponent extends BaseComponent implements OnInit, AfterViewInit {

   isFormValid: boolean;
   autoPayModelDetails: IAutoPayDetail;
   @ViewChild('preferredAmountForm') preferredAmountForm;
   autoPay = ApoConstants.apo;
   paymentAmountOptions: IPaymentAmountOptions[];
   selectedAmountOption: string;
   isPreferredSelected: boolean;
   isValidSelection: boolean;
   selectedPaymentOption: IPaymentAmountOptions;
   pattern = Constants.patterns;
   paymentOptions = ApoConstants.apo.paymentAmountOptions;
   model = { preferredAmount: null };
   workflowSteps: IStepper[];
   operationMode: string;
   isToolTipEnabled: boolean;
   maxLimit: number;
   isAmountValid: boolean;
   paymentAmountGAEvents = GAEvents.AutomaticPaymentOrder;

   constructor(private workflowService: WorkflowService, private autopayService: ApoService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.selectedAmountOption = this.autoPay.values.emptyString;
      this.isToolTipEnabled = true;
      this.isAmountValid = true;
      this.paymentAmountOptions = null;
      this.selectedPaymentOption = {} as IPaymentAmountOptions;
      this.isPreferredSelected = false;
      this.isValidSelection = false;
      this.maxLimit = this.autoPay.values.maxLimit;
      this.workflowSteps = this.workflowService.workflow;
      this.paymentAmountOptions = this.convertToPaymentAmountRadioObject(this.paymentOptions);
      this.autoPayModelDetails = {} as IAutoPayDetail;
      this.autoPayModelDetails = this.autopayService.getAutoPayDetails();
      this.operationMode = this.autopayService.getMode();
      if (this.operationMode === this.autoPay.values.edit || this.workflowSteps[1].valid) {
         this.selectedPaymentOption = this.paymentAmountOptions
            .find(paymentModel => paymentModel.type === this.autoPayModelDetails.autoPayMethod);
         if (this.selectedPaymentOption.value === this.paymentOptions.preferred.value) {
            this.model.preferredAmount = this.autoPayModelDetails.autoPayAmount;
         } else {
            this.model.preferredAmount = this.autoPay.values.emptyString;
         }
         this.onPaymentAmountOptionChange(this.selectedPaymentOption);
      } else {
         this.selectedPaymentOption = this.paymentAmountOptions
            .find(paymentObject => paymentObject.label === this.paymentOptions.total.label);
         this.onPaymentAmountOptionChange(this.selectedPaymentOption);
      }
   }
   ngAfterViewInit() {
      if (this.preferredAmountForm && this.preferredAmountForm.valueChanges) {
         this.preferredAmountForm.valueChanges
            .subscribe(values => this.validate());
      }
   }
   /* Validating preferred amount */
   validate() {
      this.isFormValid = this.model && this.model.preferredAmount && parseInt(this.model.preferredAmount, 10) > 0
         ? (this.operationMode === this.autoPay.values.add ? this.preferredAmountForm.valid &&
            this.model.preferredAmount !== this.autoPay.values.amountPrefix : this.preferredAmountForm.valid) : false;
   }
   inputKeyPress(event) {
      if (event.target.value.indexOf('.') !== -1) {
         this.isAmountValid = event.target.value.length <= this.autoPay.values.maxLimit;
      } else {
         this.isAmountValid = event.target.value.length <= this.autoPay.values.minLimit;
      }
      return !(event.key === 'e');
   }
   onAmountChange(value: string) {
      this.model.preferredAmount = value;
      this.validate();
   }
   /* setting the selected payment option validating further with  is preferred amount selected and setting the amount value */
   public onPaymentAmountOptionChange(paymentOption: IPaymentAmountOptions) {
      this.selectedPaymentOption = paymentOption;
      this.selectedAmountOption = paymentOption.value;
      if (this.selectedAmountOption === this.paymentOptions.preferred.value) {
         this.isPreferredSelected = true;
         this.isValidSelection = false;
      } else {
         this.isPreferredSelected = false;
         this.isValidSelection = true;
      }
   }
   /**
    * Check if preferred option selected . If yes then check if amount is entered or form is valid
    * Push to Service and navigate to next step
    */
   public goToNextStep() {
      if (this.isFormValid || this.isValidSelection) {
         if (this.isValidSelection && !this.isPreferredSelected) {
            this.setPaymentAmountObject(this.selectedAmountOption, null);
            this.navigateToNextStep();
         } else if (this.isPreferredSelected && this.model.preferredAmount !== this.autoPay.values.emptyString && this.isAmountValid) {
            this.setPaymentAmountObject(this.selectedAmountOption, this.model.preferredAmount);
            this.navigateToNextStep();
         }
      }
   }
   public setPaymentAmountObject(paymentOption, preferredAmount) {
      switch (paymentOption) {
         case this.autoPay.values.preferredContent:
            this.autoPayModelDetails.autoPayMethod = this.autoPay.values.preferred;
            this.autoPayModelDetails.autoPayAmount = this.model.preferredAmount;
            this.sendEvent(this.paymentAmountGAEvents.chooseAmount.eventAction,
               this.paymentAmountGAEvents.chooseAmount.label, null, this.paymentAmountGAEvents.chooseAmount.category);
            break;
         case this.autoPay.values.minimumContent:
            this.autoPayModelDetails.autoPayMethod = this.autoPay.values.minimum;
            this.autoPayModelDetails.autoPayAmount = this.autoPay.values.emptyString;
            this.sendEvent(this.paymentAmountGAEvents.minimumAmount.eventAction,
               this.paymentAmountGAEvents.minimumAmount.label, null, this.paymentAmountGAEvents.minimumAmount.category);
            break;
         default:
            this.autoPayModelDetails.autoPayMethod = this.autoPay.values.total;
            this.autoPayModelDetails.autoPayAmount = this.autoPay.values.emptyString;
            this.sendEvent(this.paymentAmountGAEvents.totalAmount.eventAction,
               this.paymentAmountGAEvents.totalAmount.label, null, this.paymentAmountGAEvents.totalAmount.category);
      }

      this.autopayService.setAutoPayDetails(this.autoPayModelDetails);
   }
   public navigateToNextStep() {
      this.sendEvent(this.paymentAmountGAEvents.timeTakenOnAmountScreen.eventAction,
         this.paymentAmountGAEvents.timeTakenOnAmountScreen.label, null, this.paymentAmountGAEvents.timeTakenOnAmountScreen.category);
      this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[2].step);
   }
   public convertToPaymentAmountRadioObject(paymentAmountConstObj) {
      const paymentAmountOptions = [];
      for (const keys in paymentAmountConstObj) {
         paymentAmountOptions.push(paymentAmountConstObj[keys]);
      }
      return paymentAmountOptions;
   }
}

