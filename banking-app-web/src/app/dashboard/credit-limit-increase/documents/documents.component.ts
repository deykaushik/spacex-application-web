import { Component, OnInit } from '@angular/core';
import { CreditLimitService } from '../credit-limit.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { AccountService } from '../../account.service';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { ICreditLimitMaintenance, IAccountDetail } from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from './../../../core/utils/constants';

@Component({
   selector: 'app-credit-documents',
   templateUrl: './documents.component.html',
   styleUrls: ['./documents.component.scss']
})
export class CreditDocumentsComponent implements OnInit {

   labels = CreditLimitMaintenance.labels;
   messages = CreditLimitMaintenance.messages;
   label = Constants.labels.reportFraud;
   value = Constants.VariableValues.reportFraud;
   isDone: boolean;
   workflowSteps: IStepper[];
   banks = CreditLimitMaintenance.banks;
   selectedFromAccounts: IAccountDetail[];
   selectedFromAccount: IAccountDetail;
   creditLimitDetails: ICreditLimitMaintenance;
   isSelected: boolean;
   skeletonMode: boolean;
   cachedCurrentAccounts: IAccountDetail[];

   constructor(private workflowService: WorkflowService, private creditLimitService: CreditLimitService,
      private accountService: AccountService) { }

   ngOnInit() {
      this.workflowSteps = this.workflowService.workflow;
      this.creditLimitDetails = this.creditLimitService.getCreditLimitMaintenanceDetails();
      if (this.workflowSteps[1].valid) {
         this.isDone = this.workflowSteps[1].valid && this.creditLimitDetails.statementRetrival;
         this.isSelected = true;
         this.selectedFromAccount = this.creditLimitDetails && this.creditLimitDetails.selectedAccount ?
            this.creditLimitDetails.selectedAccount : null;
      } else {
         this.isSelected = false;
      }
      this.cachedCurrentAccounts = this.creditLimitService.getCachedCurrentAccounts();
      if (this.cachedCurrentAccounts) {
         this.selectedFromAccounts = this.cachedCurrentAccounts;
         this.loadFields();
      } else {
         this.getCurrentAccounts();
      }
   }

   getCurrentAccounts() {
      this.skeletonMode = true;
      this.accountService.getTransferAccounts().finally(() => {
         this.skeletonMode = false;
      }).subscribe(response => {
         const accounts = response;
         if (accounts && accounts.length > 0) {
            this.selectedFromAccounts = CommonUtility.transferFromAccounts(accounts)
               .filter(acc => acc.accountType === this.labels.currentAccount);
            this.creditLimitService.setCachedCurrentAccounts(this.selectedFromAccounts);
            this.loadFields();
         }
      });
   }

   loadFields() {
      /* when user entered on first time we are loading nedbank account details as a default one
         if the user select not to provide the details and again he is coming to the same option from the next option
         on that time also we are loading the same. */
      if (this.selectedFromAccounts && this.selectedFromAccounts[0]) {
         if (!this.workflowSteps[1].valid || (this.workflowSteps[1].valid && !this.creditLimitDetails.statementRetrival)) {
            this.creditLimitDetails.bankName = this.banks[0].bankName;
            this.creditLimitDetails.branchNumber = this.banks[0].branchNumber;
            this.selectedFromAccount = this.selectedFromAccounts[0];
            this.creditLimitDetails.selectedAccount = this.selectedFromAccount;
         }
         this.creditLimitDetails.accountNumber = this.creditLimitDetails.accountNumber ? this.creditLimitDetails.accountNumber :
            this.selectedFromAccounts[0].accountNumber;
      }
   }

   onFromAccountSelection(selectedFromAccount) {
      this.selectedFromAccount = selectedFromAccount;
      this.creditLimitDetails.selectedAccount = selectedFromAccount;
      this.creditLimitDetails.accountNumber = selectedFromAccount.accountNumber;
   }

   openStatement(event) {
      this.isSelected = !event;
   }
   onProvideManually() {
      this.creditLimitDetails.bankName = '';
      this.creditLimitDetails.accountNumber = '';
      this.creditLimitDetails.branchNumber = '';
      this.creditLimitDetails.statementRetrival = false;
      this.creditLimitService.setCreditLimitMaintenanceDetails(this.creditLimitDetails);
      this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
      this.workflowService.workflow = this.workflowSteps;
      this.workflowService.stepClickEmitter.emit(this.workflowSteps[2].step);
   }

   onProvide(event) {
      this.creditLimitDetails.statementRetrival = event;
      this.isSelected = event;
   }

   onBankSelected(selectedBank) {
      this.creditLimitDetails.bankName = selectedBank.bankName;
      this.creditLimitDetails.branchNumber = selectedBank.branchNumber;
      this.creditLimitDetails.accountNumber = '';
      if (selectedBank.bankName === this.banks[0].bankName) {
         if (this.cachedCurrentAccounts) {
            this.selectedFromAccounts = this.cachedCurrentAccounts;
            this.loadFields();
         } else {
            this.getCurrentAccounts();
         }
      }
   }
   onAccountNumber(event): boolean {
      if (event.key === 'e') {
         return false;
      } else {
         return (event.target.value.length <= 9) ? true : false;
      }
   }

   goToContactDetails(event) {
      if (!event && this.creditLimitDetails.accountNumber) {
         this.creditLimitDetails.statementRetrival = true;
         this.creditLimitService.setCreditLimitMaintenanceDetails(this.creditLimitDetails);
         this.isDone = true;
         this.workflowSteps[1] = { step: this.workflowSteps[1].step, valid: true, isValueChanged: false };
         this.workflowService.workflow = this.workflowSteps;
         this.workflowService.stepClickEmitter.emit(this.workflowSteps[2].step);
      }
   }
}
