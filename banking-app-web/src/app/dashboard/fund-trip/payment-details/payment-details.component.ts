import { Component, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { FundTripService } from '../fund-trip.service';
import { IGetQuoteVm, IPaymentDetailsVm } from '../fund-trip.model';
import { PaymentService } from '../../../payment/payment.service';
import { IAccountDetail, IPrepaidLimitDetail } from './../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { IStepInfo, IWorkflowChildComponent } from '../../../shared/components/work-flow/work-flow.models';
import { CommonUtility } from '../../../core/utils/common';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss']
})
export class PaymentDetailsComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {
  @ViewChild('getPaymentDetailsForm') getPaymentDetailsForm;
  @Output() isComponentValid = new EventEmitter<boolean>();
  vm: IPaymentDetailsVm;
  accounts: IAccountDetail[];
  selectedAccount: any;
  insufficientFunds = false;
  paymentLimits: any;
  transactionLimit: any;
  labels = Constants.labels;
  dailyPaymentLimit: IPrepaidLimitDetail[];
  getQuoteVm: IGetQuoteVm;
  referenceMaxLength = Constants.VariableValues.loadTripReferenceMaxLength;
  constructor(private clientProfileDetailsService: ClientProfileDetailsService,
    private fundTripService: FundTripService, private paymentService: PaymentService) { }

  ngOnInit() {
    this.getQuoteVm = this.fundTripService.getGetQuoteVm();
    this.vm = this.fundTripService.getPaymentDetailsVm();
    this.vm.amount = parseFloat(this.getQuoteVm.toCurrencyValue);
    this.fundTripService.getPaymentLimits(this.getQuoteVm.clientDetails.fromAccount.AccountNumber).subscribe(response => {
      this.paymentLimits = response;
      this.getTransactionLimit();
    });
    this.fundTripService.getPaymentLimit().subscribe(response => {
      this.dailyPaymentLimit = response;
      this.getTransactionLimit();
    });
    this.paymentService.getActiveCasaAccounts().subscribe(accounts => {
      this.accounts = accounts || [];
      this.selectedAccount = this.clientProfileDetailsService.getDefaultAccount(this.accounts)
        || this.accounts[0];
      this.vm.toAccount = this.selectedAccount;
      this.validate();
    });
  }

  ngAfterViewInit() {
    this.getPaymentDetailsForm.valueChanges
      .subscribe(values => {
        this.validate();
      });
  }

  validate() {
    let isValid = false;
    isValid = !this.insufficientFunds && this.getPaymentDetailsForm.valid && (this.vm.amount <= this.transactionLimit);
    this.isComponentValid.emit(isValid);
  }

  omitSpecialChar(event) {
   return CommonUtility.omitSpecialCharacter(event);
  }

  stepClick(stepInfo: IStepInfo) {
  }

  onAmountChange(value) {
    this.vm.amount = value;
    this.insufficientFunds = this.vm.amount > 0 && (this.vm.amount > this.vm.toAccount.availableBalance);
  }
  onAccountSelection(account: IAccountDetail) {
    this.vm.toAccount = account;
    this.insufficientFunds = this.vm.amount > 0 && this.vm.amount > this.vm.toAccount.availableBalance;
    this.validate();
  }

  nextClick(currentStep: number) {
    this.fundTripService.savePaymentDetailsInfo(this.vm);
  }

  getTransactionLimit() {
     if (this.paymentLimits && this.dailyPaymentLimit) {
      this.transactionLimit = Math.min(this.paymentLimits.availableLimit.amount, this.paymentLimits.annualLimit.amount,
         this.paymentLimits.transactionLimit.amount, this.dailyPaymentLimit[0].userAvailableDailyLimit);
         this.validate();
     }
  }

}
