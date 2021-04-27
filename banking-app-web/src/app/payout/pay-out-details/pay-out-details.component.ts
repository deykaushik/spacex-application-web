import { Component, OnInit, ViewChild, AfterViewChecked, EventEmitter, Output } from '@angular/core';
import { IBuildingPayout } from '../payout.models';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IRadioButtonItem, IBank } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { PayoutService } from '../payout.service';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { PreFillService } from '../../core/services/preFill.service';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
   selector: 'app-pay-out-details',
   templateUrl: './pay-out-details.component.html',
   styleUrls: ['./pay-out-details.component.scss']
})

export class PayOutDetailsComponent implements OnInit, AfterViewChecked {
   @ViewChild('payOutDetailsForm') payOutDetailsForm;
   @Output() discardContinueEmitter = new EventEmitter<boolean>();
   payoutDetailsAmount: string;
   isTransferLimitExceeded: boolean;
   isPayoutAmountEmpty = false;
   isPayoutAmountValid = true;
   availableTransferLimit: number;
   payoutDetailsName: string;
   isPayoutNameEmpty = false;
   isPayoutNameValid = true;
   payoutDetailsBank: string;
   displayPayoutDetailsSelectedBank: string;
   listPayoutDetailsBank: IBank[];
   payoutDetailsAccType = true;
   isPayoutAccNumEmpty = false;
   isPayoutAccNumValid = true;
   isRadioValueSelected: boolean;
   payoutDetailsAccNum: string;
   isPayoutBankEmpty = false;
   isPayoutBankValid = true;
   isMaxValue: boolean;
   validKeys = Constants.labels.buildingLoan.validKeys;
   payoutDetailLabels = Constants.labels.buildingLoan.paymentDetail;
   payoutDetailMessages = Constants.messages.buildingLoan.paymentDetail;
   payoutDetailErrorMessages = Constants.messages.buildingLoan.paymentDetail.errorMessages;
   amountPaymentType: IRadioButtonItem[] = Constants.labels.buildingLoan.paymentDetail.radioValues.amountType;
   selectedAmountType: string;
   accDetail = this.payoutDetailLabels.radioGroupName;
   payoutStepData: IBuildingPayout;
   isDiscardChangesPopup: boolean;
   workflowSteps: IStepper[];
   isFormDirty: boolean;
   isTooltip: boolean;
   isAmountTypeSelected: boolean;

   constructor(private payoutService: PayoutService, private workflowService: WorkflowService, private prefillService: PreFillService) { }

   ngOnInit() {
      this.isAmountTypeSelected = true;
      this.isTooltip = false;
      if (this.prefillService.buildingBalanceData) {
         this.availableTransferLimit = this.prefillService.buildingBalanceData.balanceNotPaidOut;
      }
      this.isFormDirty = false;
      this.displayPayoutDetailsSelectedBank = '';
      this.getBanks();
      this.payoutStepData = this.payoutService.payoutData;
      this.workflowSteps = this.workflowService.workflow;
      if (this.payoutStepData.amount) {
         this.setPayoutDetails();
      } else {
         this.selectedAmountType = '';
         this.isMaxValue = false;
      }
      this.workflowService.changesEmitter.subscribe(isChanged => {
         this.isDiscardChangesPopup = isChanged;
      });
   }
   ngAfterViewChecked() {
      if (this.payOutDetailsForm && !this.isFormDirty) {
         this.isFormDirty = this.payOutDetailsForm.dirty;
         this.workflowSteps[1].isValueChanged = this.payOutDetailsForm.dirty;
         this.workflowService.workflow = this.workflowSteps;
      }
      if (this.payOutDetailsForm && this.isFormDirty && !this.workflowService.workflow[1].isValueChanged) {
         this.workflowSteps[1].isValueChanged = false;
         this.workflowService.workflow = this.workflowSteps;
      }
   }

   onPayoutAmountChange(amount: number) {
      this.payoutDetailsAmount = amount.toString();
      this.validateAmount(amount);
   }

   validateAmount(amount: number) {
      this.isTransferLimitExceeded = amount > this.availableTransferLimit;
      this.isPayoutAmountEmpty = !amount;
   }

   onPayoutNameChange(name: string) {
      this.payoutDetailsName = name;
      if (name.length === 1 && name === ' ') {
         setTimeout(() => {
            this.payoutDetailsName = '';
         }, 0);
      }
      this.validateName(name);
   }

   validateName(name: string) {
      this.isPayoutNameValid = name ? true : false;
      this.isPayoutNameEmpty = !this.isPayoutNameValid;
   }

   onAccountNumberKeyDown(eventKey: string) {
      if (this.validKeys.indexOf(eventKey) < 0) {
         if (eventKey === this.payoutDetailLabels.backspace) {
            return true;
         }
         return false;
      }
   }

   onPayoutDetailsBankChanged(bankName: string) {
      this.displayPayoutDetailsSelectedBank = bankName;
      this.validateBankName(bankName);
   }

   validateBankName(bankName: string) {
      this.isPayoutBankValid = bankName !== '' ? true : false;
      this.isPayoutBankEmpty = !this.isPayoutBankValid;
   }

   goToContactPerson() {
      this.isPayoutAmountEmpty = !this.isMaxValue && this.payoutDetailsAmount && this.payoutDetailsAmount.length <= 1;
      this.isAmountTypeSelected = this.selectedAmountType.length ? true : false;
      if (this.payOutDetailsForm.valid && !this.isPayoutBankEmpty && !this.isTransferLimitExceeded && this.isAmountTypeSelected) {
         this.payoutStepData.amount = this.selectedAmountType === this.payoutDetailLabels.max ? this.payoutDetailLabels.max :
            this.payoutDetailsAmount;
         this.payoutStepData.recipientName = this.payoutDetailsName;
         this.payoutStepData.bank = this.displayPayoutDetailsSelectedBank;
         this.payoutStepData.accountNumber = this.payoutDetailsAccNum.toString();
         this.payoutService.payoutData = this.payoutStepData;
         this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
         this.workflowService.workflow = this.workflowSteps;
         this.workflowService.stepClickEmitter.emit(this.workflowSteps[2].step);
      }
   }

   validatePayDetailsForm(payOutDetailsForm: FormGroup) {
      this.validateAllFields(payOutDetailsForm);
      this.isAmountTypeSelected = this.isAmountTypeSelected ? true : false;
      this.isPayoutBankValid = this.displayPayoutDetailsSelectedBank !== '' ? true : false;
      this.isPayoutBankEmpty = !this.isPayoutBankValid;
   }
   setPayoutDetails() {
      this.selectedAmountType = this.payoutStepData.amount === this.payoutDetailLabels.max ?
         this.amountPaymentType[0].value : this.amountPaymentType[1].value;
      this.isMaxValue = this.payoutStepData.amount === this.payoutDetailLabels.max ? true : false;
      this.payoutDetailsAmount = this.payoutStepData.amount;
      this.payoutDetailsName = this.payoutStepData.recipientName;
      this.displayPayoutDetailsSelectedBank = this.payoutStepData.bank;
      this.payoutDetailsAccNum = this.payoutStepData.accountNumber;
   }
   discardChangesPopup(userDiscardAction: string) {
      if (userDiscardAction === this.payoutDetailLabels.close) {
         this.isDiscardChangesPopup = false;
      } else {
         this.isDiscardChangesPopup = false;
         this.discardContinueEmitter.emit(true);
      }
   }
   getBanks() {
      this.payoutService.getBanks().subscribe((banks: IBank[]) => {
         this.listPayoutDetailsBank = banks;
      });
   }

   validateAllFields(formGroup: FormGroup) {
      Object.keys(formGroup.controls).forEach(field => {
         if (!this.payOutDetailsForm.controls[field].touched) {
            this.payOutDetailsForm.controls[field].markAsTouched({ onlySelf: true });
         }
      });
   }

   onAmountTypeChange(amountType: IRadioButtonItem) {
      this.selectedAmountType = amountType.value;
      this.isMaxValue = amountType.value === this.payoutDetailLabels.max ? true : false;
      this.isAmountTypeSelected = true;
      if (this.selectedAmountType === this.amountPaymentType[0].value) {
         this.isTransferLimitExceeded = false;
         this.isPayoutAmountEmpty = false;
      } else {
         this.validateAmount(parseFloat(this.payoutDetailsAmount));
      }
   }
}
