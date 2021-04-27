import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Injector } from '@angular/core';
import { BuyElectricityService } from './../buy-electricity.service';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { ITransactionFrequency } from '../../../core/utils/models';
import { IBuyElectricityAmountVm } from '../buy-electricity.models';
import { IWorkflowChildComponent, IStepInfo } from '.././../../shared/components/work-flow/work-flow.models';
import { IAccountDetail, IBuyElectricityAccountDetail, IBuyElectricityLimitDetail } from './../../../core/services/models';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-buy-electricity-amount',
   templateUrl: './buy-electricity-amount.component.html',
   styleUrls: ['./buy-electricity-amount.component.scss']
})

export class BuyElectricityAmountComponent extends BaseComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {

   @Output() isComponentValid = new EventEmitter<boolean>();
   @Output() isButtonLoader = new EventEmitter<boolean>();

   @ViewChild('buyElectricityAmountForm') buyElectricityAmountForm;
   vm: IBuyElectricityAmountVm;
   availableTransferLimit = 0;
   allowedTransferLimit = 0;
   isTransferLimitExceeded: boolean;
   isValid = true;
   insufficientFunds = false;
   labels = Constants.labels;
   accounts: IAccountDetail[] = [];
   selectedAccount: IBuyElectricityAccountDetail;
   allowedMinimumValue = Constants.buyElectricityVariableValues.amountMinValue;
   allowedMaximumValue = Constants.buyElectricityVariableValues.amountMaxValue;
   isMinimumViolated: boolean;
   isMaximumExceeded: boolean;
   skeletonMode: boolean;
   areAccountsLoaded = false;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   constructor(private buyElectricityService: BuyElectricityService, private clientProfileDetailsService: ClientProfileDetailsService,
      injector: Injector) {
      super(injector);
   }

   private getElectricityLimits() {
      this.buyElectricityService.getElectricityLimits().subscribe(response => {
         this.updateTranferLimit(response);
         this.allowedTransferLimit = this.availableTransferLimit;
      }, (error) => {
         this.isComponentValid.emit(false);
         this.isButtonLoader.emit(false);
      });
   }

   // get updated transfer limit
   private updateTranferLimit(payLimits: IBuyElectricityLimitDetail[]) {
      const paymentLimit = payLimits.find(limit => {
         return limit.limitType === Constants.VariableValues.settings.widgetTypes.payment;
      });
      const buyLimit = payLimits.find(limit => {
         return limit.limitType === Constants.VariableValues.settings.widgetTypes.prepaid;
      });
      this.availableTransferLimit = Math.min(paymentLimit.userAvailableDailyLimit, buyLimit.userAvailableDailyLimit);
      this.skeletonMode = false;
      this.validate();
   }

   ngOnInit() {
      this.skeletonMode = true;
      this.vm = this.buyElectricityService.getBuyElectricityAmountVm();
      this.buyElectricityService.accountsDataObserver.subscribe(accounts => {
         this.accounts = accounts ? accounts : [];
         this.setAccountFrom();
         this.areAccountsLoaded = this.accounts.length !== 0;
         this.selectedAccount = this.vm.selectedAccount || this.clientProfileDetailsService.getDefaultAccount(this.accounts)
            || this.accounts[0];
         this.onAccountSelection(this.selectedAccount);
      });
      this.getElectricityLimits();
      this.isComponentValid.emit(false);
   }

   setAccountFrom() {
      if (!this.vm.selectedAccount && this.vm.accountNumberFromDashboard) {
         this.vm.selectedAccount = this.accounts.filter((ac) => {
            return ac.itemAccountId === this.vm.accountNumberFromDashboard;
         })[0];
      }
   }

   ngAfterViewInit() {
      this.buyElectricityAmountForm.valueChanges
         .subscribe(values => this.validate());
   }
   // handle amount change
   onAmountChange(value) {
      this.vm.amount = value;
      this.allowedTransferLimit = this.availableTransferLimit - value;
      this.isTransferLimitExceeded = this.allowedTransferLimit < 0;
      this.isMinimumViolated = value < this.allowedMinimumValue && this.vm.amount > 0;
      this.isMaximumExceeded = value > this.allowedMaximumValue;
      this.insufficientFunds = this.vm.amount > 0 && this.vm.amount > this.vm.selectedAccount.availableBalance;
      this.isValid = !this.isMinimumViolated && !this.isMaximumExceeded && !this.isTransferLimitExceeded && this.vm.amount > 0
         && !this.insufficientFunds;
      this.validate();
   }
   onAccountSelection(account: IAccountDetail) {
      this.vm.selectedAccount = account;
      this.insufficientFunds = this.vm.amount > 0 && this.vm.amount > this.vm.selectedAccount.availableBalance;
      this.isValid = !this.isMinimumViolated && !this.isMaximumExceeded && !this.isTransferLimitExceeded && this.vm.amount > 0
         && !this.insufficientFunds;
      this.validate();
   }

   // handle account selection
   validate() {
      const valid = this.isValid
         && this.buyElectricityAmountForm.valid
         && this.vm.amount > 0
         && !this.insufficientFunds
         && !!this.vm.selectedAccount
         && !this.skeletonMode;

      this.isComponentValid.emit(valid);
   }

   nextClick(currentStep: number) {
      this.buyElectricityService.saveBuyElectricityAmountInfo(this.vm);
   }

   stepClick(stepInfo: IStepInfo) {

   }
}
