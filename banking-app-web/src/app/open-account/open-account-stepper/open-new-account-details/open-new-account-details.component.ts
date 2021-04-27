import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OpenAccountService } from '../../open-account.service';
import { Constants } from '../../constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IDeposit } from '../../../core/services/models';

@Component({
   selector: 'app-open-new-account-details',
   templateUrl: './open-new-account-details.component.html',
   styleUrls: ['./open-new-account-details.component.scss']
})

export class OpenNewAccountDetailsComponent implements OnInit {
   workflowSteps: IStepper[];
   labels = Constants.labels.openAccount;
   values = Constants.variableValues.openNewAccount;
   openAccountMessages = Constants.messages.openNewAccount;
   depositDetails = true;
   interestDetails: boolean;
   recurringDetails: boolean;
   isDepositCompleted: boolean;
   isInterestCompleted: boolean;
   isInterestTab: boolean;
   isRecurringTab: boolean;
   productDetails: IDeposit;
   isNoticeDeposit: boolean;
   productName: string;
   interestRate: number;
   isrecurring: boolean;
   isInterest: boolean;

   @Input() accountInformation;
   @Output() stepperback = new EventEmitter<boolean>();
   @Output() onHide = new EventEmitter();

   constructor(private workflowService: WorkflowService, private openAccountService: OpenAccountService) { }

   ngOnInit() {
      this.productDetails = this.openAccountService.getProductDetails();
      if (this.productDetails) {
         this.productName = this.productDetails.name;
         this.interestRate = this.productDetails.realtimerate;
         if (this.productDetails.noticeDeposit === this.labels.noticeDeposit) {
            this.isNoticeDeposit = true;
         }
      }
      this.workflowSteps = this.workflowService.getWorkflow();
      this.isrecurring = this.openAccountService.getRecurringEdit();
      if (this.isrecurring) {
         this.recurringDetails = true;
         this.isRecurringTab = true;
         this.isInterestTab = false;
         this.depositDetails = false;
         this.isInterestCompleted = true;
         this.isDepositCompleted = true;
      }
      this.isInterest = this.openAccountService.getInterestEdit();
      if (this.isInterest) {
         this.depositDetails = false;
         this.interestDetails = true;
         this.isDepositCompleted = true;
         this.isInterestTab = true;
      }
   }

   setFlags(interestCompleted: boolean, interest: boolean, recurring: boolean) {
      this.isInterestCompleted = interestCompleted;
      this.isInterestTab = interest;
      this.isRecurringTab = recurring;
   }

   accountFlags(data) {
      this.depositDetails = data[0].depositFlag;
      this.interestDetails = data[0].interestFlag;
      this.recurringDetails = data[0].recurringFlag;
      if (this.depositDetails) {
         this.isDepositCompleted = false;
         this.isInterestTab = false;
      }
      if (this.interestDetails) {
         this.isDepositCompleted = true;
         this.setFlags(false, true, false);
      }
      if (this.recurringDetails) {
         this.setFlags(true, false, true);
      }
   }

   recurringNext() {
      this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
      this.workflowService.setWorkflow(this.workflowSteps);
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[2].step);
   }

   interestNext() {
      this.recurringNext();
   }

   showDetails(deposit: boolean, interest: boolean, recurring: boolean) {
      const detailFlag: any = [{
         depositFlag: deposit,
         interestFlag: interest,
         recurringFlag: recurring
      }];
      this.accountFlags(detailFlag);
   }

   depositClick() {
      if (this.isDepositCompleted) {
         this.isRecurringTab = false;
         this.isInterestCompleted = false;
         this.showDetails(true, false, false);
      }
   }

   interestClick() {
      if (this.isInterestCompleted) {
         this.showDetails(false, true, false);
      }
   }
}
