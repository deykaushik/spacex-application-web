import { DecimalPipe } from '@angular/common';
import { element } from 'protractor';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Injector } from '@angular/core';
import { BuyService } from './../buy.service';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { ITransactionFrequency } from '../../../core/utils/models';
import { IBuyAmountVm } from '../buy.models';
import { IWorkflowChildComponent, IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import {
   IAccountDetail, IPrepaidAccountDetail, IPrepaidServiceProviderProducts,
   IPrepaidServiceProviderProductsDetail, IPrepaidLimitDetail, IRadioButtonItem
} from './../../../core/services/models';
import { IDatePickerConfig } from 'ng2-date-picker';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-buy-amount',
   templateUrl: './buy-amount.component.html',
   styleUrls: ['./buy-amount.component.scss']
})

export class BuyAmountComponent extends BaseComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {
   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChild('buyAmountForm') buyAmountForm;
   vm: IBuyAmountVm;
   rechargeType: string;
   preciseBundleAmount: Number;
   bundleMessage = '';
   selectedProduct: IPrepaidServiceProviderProducts;
   selectedBundleType: string;
   selectedAccount: IPrepaidAccountDetail;
   availableTransferLimit = 0;
   allowedTransferLimit = 0;
   isTransferLimitExceeded: boolean;
   accounts: IAccountDetail[] = [];
   rechargeTypes: string[] = [];
   products: IPrepaidServiceProviderProducts[] = [];
   bundleAmountTypes: IPrepaidServiceProviderProductsDetail[] = [];
   isValid = true;
   showBundleAmountSelect = false;
   showBundleAmountBox = false;
   insufficientFunds = false;
   isMinimumViolated: boolean;
   isMaximumExceeded: boolean;
   allowedMinimumValue = Constants.payMinimumVariableValues.amountMinValue;
   allowedMaximumValue = Constants.payPrepaidVariableValues.amountMaxValue;
   numberPrecisionFormat = Constants.decimalPipeSettings.numberPrecisionFormat;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
   selectedPaymentFrequency: ITransactionFrequency = this.paymentRecurrenceFrequencies[0].value;
   showOwnAmount = false;
   showAirtime = true;
   labels = Constants.labels;
   isSameDate = true;
   todayDate = new Date();
   repeatPurchaseMessage = Constants.labels.repeatPurchaseErrorMessage;
   repeatPaymentdisableMessage = Constants.labels.repeatPaymentdisableMessage;
   repeatPaymentwithRecurringDisabledMessage = Constants.labels.repeatPaymentwithRecurringDisabledMessage;

   formatDate: Moment;
   formatEndDate: Moment;
   repeatTypeValues: IRadioButtonItem[];
   minPaymentDate = moment();
   maxPaymentDate = CommonUtility.getNextDate(new Date(), 1, 'years');
   config = CommonUtility.getConfig(this.minPaymentDate, this.maxPaymentDate);
   minPaymentEndDate = CommonUtility.getNextDate(new Date(), 1, 'days');
   maxPaymentEndDate = CommonUtility.getNextDate(new Date(), 1, 'years');
   endConfig = CommonUtility.getConfig(this.minPaymentEndDate, this.maxPaymentEndDate);
   skeletonMode: Boolean;
   ownAmountText = 'Own Amount';
   isSchedulePaymentDisabled = false;
   isRecurringPaymentDisabled = false;
   private repeatTypesConstant = Constants.VariableValues.repeatType;
   endDateRepeatTypeConstant = Constants.VariableValues.endDateRepeatType;
   constructor(private buyService: BuyService, private decimalPipe: DecimalPipe,
      private clientProfileDetailsService: ClientProfileDetailsService, injector: Injector) {
      super(injector);
   }

   // Populate the bundle dropdown with the available bundles for a product

   private populateAvailableBundles() {
      this.bundleAmountTypes = [];
      this.selectedProduct = this.products.filter(element => {
         element.productDescription = element.productDescription.
            replace(`${Constants.labels.buyLabels.buyAmountLabels.Prepaid} `, '');
         if (element.productCode !== Constants.labels.buyLabels.buyAmountLabels.DailyBundleProductCode) {
            element.productDescription = element.productDescription.
               replace(` ${Constants.labels.buyLabels.buyAmountLabels.Bundle}`, '');
         }
         if (this.rechargeType === element.productDescription) {
            this.vm.productCode = element.productCode;
            return element;
         }
      })[0];
      // If products are found for the selected recharge type
      if (this.selectedProduct) {

         if (this.IsAllInOneConfigurationDefined()) {
            this.selectedProduct.productDetails.forEach(element => {
               this.PushBundleAmountElement(element);
            });
         } else {
            const productAmountFormatConfig = Constants.labels.buyLabels.ProductAmountandFormat.filter(i => {
               return i.providerCode === this.buyService.getBuyToVm().serviceProvider &&
                  i.productCode === this.selectedProduct.productCode;
            });
            if (productAmountFormatConfig && productAmountFormatConfig.length > 0
               && productAmountFormatConfig[0].productsIncluded != null) {
               const itemsToInclude = this.selectedProduct.productDetails.filter(i => {
                  return productAmountFormatConfig[0].productsIncluded.some(u => u.amountValue === i.amountValue &&
                     u.bundleList === i.bundleList && u.bundleValue === i.bundleValue);
               });
               if (itemsToInclude && itemsToInclude.length > 0) {
                  this.bundleAmountTypes.push(...itemsToInclude);
               } else {
                  this.bundleAmountTypes.push(...this.selectedProduct.productDetails);
               }
            } else {
               this.bundleAmountTypes.push(...this.selectedProduct.productDetails);
            }
         }
         if (this.selectedProduct.productCode === Constants.labels.buyLabels.buyAmountLabels.AirtimeProductCode) {
            this.showOwnAmount = true;
         } else {
            this.showOwnAmount = false;
         }

         // If edit data has bundletype then show it
         if (this.vm.bundleType) {
            this.selectedBundleType = this.vm.bundleType;
            // If edit data bundle type is airtime then show amount box
            if (this.selectedBundleType === Constants.labels.buyLabels.buyAmountLabels.ownAmount) {
               this.showBundleAmountBox = true;
            } else {
               this.showBundleAmountBox = false;
            }
         } else {
            this.onBundleAmountTypeChanged(this.bundleAmountTypes[0]);
         }
      } else {
         this.onBundleAmountTypeChanged(Constants.labels.buyLabels.buyAmountLabels.ownAmount);
      }
   }
   public getAmountLiteral(bundleAmountType): string {
      const precisedAmount = this.decimalPipe.transform(bundleAmountType.amountValue, this.numberPrecisionFormat);
      this.preciseBundleAmount = Number(precisedAmount);
      if (this.IsAllInOneConfigurationDefined()) {
         const amountLiteral = `R${precisedAmount} for `;
         const proivderConfig = Constants.labels.buyLabels.multipleBundle.filter(i => {
            return i.providerCode === this.buyService.getBuyToVm().serviceProvider;
         });
         const bundleValueConfig = proivderConfig[0].allowedBundle.filter(i => i.amountValue === bundleAmountType.amountValue);
         return amountLiteral + bundleValueConfig[0].bundleAmountLiteral;
      }
      const productFormats = Constants.labels.buyLabels.ProductAmountandFormat.filter(i => {
         return i.providerCode === this.buyService.getBuyToVm().serviceProvider &&
            i.productCode === this.selectedProduct.productCode;
      });
      if (productFormats && productFormats.length > 0) {
         switch (productFormats[0].ProductFormat) {
            case Constants.labels.buyLabels.CurrencyOnly:
               {
                  return `R${precisedAmount}`;
               }
         }
      }
      if (bundleAmountType.bundleList === Constants.labels.buyLabels.buyAmountLabels.AirtimeBundleList) {
         return `R${precisedAmount}`;
      } else {
         return `${bundleAmountType.bundleValue}${bundleAmountType.bundleList} for R${precisedAmount}`;
      }
   }
   //  show bundle amount box if own amount is selected and sets bundle type and amount accordingly.
   private showSelectedBundle(bundleAmountType) {
      if (bundleAmountType === Constants.labels.buyLabels.buyAmountLabels.ownAmount) {
         this.vm.bundleType = Constants.labels.buyLabels.buyAmountLabels.ownAmount;
         this.vm.amount = 0;
         this.isValid = false;
         this.showBundleAmountBox = true;
      } else {
         this.vm.bundleType = this.getAmountLiteral(bundleAmountType);
         if (bundleAmountType.bundleList === Constants.labels.buyLabels.buyAmountLabels.AirtimeBundleList) {
            this.onAmountChange(bundleAmountType.amountValue);
            this.showBundleAmountBox = false;
            this.showAirtime = true;
         } else {
            this.onAmountChange(bundleAmountType.amountValue);
            this.showBundleAmountBox = false;
            this.showAirtime = false;
         }
      }
      this.selectedBundleType = this.vm.bundleType;
   }

   // get all the products of selected service provider from the previous step
   private getProducts() {
      const buyToModel = this.buyService.getBuyToVm();
      const serviceProvideCode = buyToModel.serviceProvider;
      const serviceProvideName = buyToModel.serviceProviderName;
      this.buyService.getServiceProvidersProducts(serviceProvideCode).
         subscribe(response => {
            this.products = response;
            response.forEach(element => {
               element.productDescription = element.productDescription.
                  replace(`${Constants.labels.buyLabels.buyAmountLabels.Prepaid} `, '');
               if (element.productCode !== Constants.labels.buyLabels.buyAmountLabels.DailyBundleProductCode) {
                  element.productDescription = element.productDescription.
                     replace(` ${Constants.labels.buyLabels.buyAmountLabels.Bundle}`, '');
               }
               if (Constants.rechargeTypesAccepted[serviceProvideName].indexOf(element.productDescription) !== -1) {
                  this.rechargeTypes.push(element.productDescription);
               }
            });
            this.rechargeType = this.vm.rechargeType || this.rechargeTypes[0];
            this.vm.rechargeType = this.rechargeType;
            this.populateAvailableBundles();
            this.validateProviderConfiguration(this.buyService.getBuyToVm().serviceProvider,
               (this.selectedProduct) ? this.selectedProduct.productCode : '');
         });
   }

   // gets prepaid limit
   private getPrepaidLimits() {
      this.buyService.getPrepaidLimit().subscribe(response => {
         this.updateTranferLimit(response);
         this.allowedTransferLimit = this.availableTransferLimit;

         this.allowedTransferLimit = this.availableTransferLimit - this.vm.amount;
         this.isTransferLimitExceeded = this.allowedTransferLimit < 0;
         this.isValid = !this.isTransferLimitExceeded && this.vm.amount > 0;

         this.skeletonMode = false;
         this.validate();
      });
   }
   private PushBundleAmountElement(element: IPrepaidServiceProviderProductsDetail) {
      const multipleBundleConfiguration = this.bundleAmountTypes.filter(i => {
         return i.amountValue === element.amountValue;
      });
      if (!(this.bundleAmountTypes && this.bundleAmountTypes.length > 0
         && multipleBundleConfiguration && multipleBundleConfiguration.length > 0)) {
         this.bundleAmountTypes.push(element);
      }
   }
   private IsAllInOneConfigurationDefined(): boolean {
      const providerConfig = Constants.labels.buyLabels.multipleBundle.filter(i => {
         return i.providerCode === this.buyService.getBuyToVm().serviceProvider;
      });
      return (providerConfig && providerConfig.length > 0 &&
         this.selectedProduct.productCode === Constants.labels.buyLabels.buyAmountLabels.ALLInOneProductCode);
   }
   // get updated transfer limit
   private updateTranferLimit(payLimits: IPrepaidLimitDetail[]) {
      const paymentLimit = payLimits.find(limit => {
         return limit.limitType === Constants.VariableValues.settings.widgetTypes.payment;
      });
      const buyLimit = payLimits.find(limit => {
         return limit.limitType === Constants.VariableValues.settings.widgetTypes.prepaid;
      });
      this.availableTransferLimit = Math.min(paymentLimit.userAvailableDailyLimit, buyLimit.userAvailableDailyLimit);
   }
   ngOnInit() {
      this.isComponentValid.emit(false);
      this.skeletonMode = true;
      this.vm = this.buyService.getBuyAmountVm();
      this.buyService.accountsDataObserver.subscribe(accounts => {
         this.accounts = accounts ? accounts : [];
         this.setAccountFrom();
         this.selectedAccount = this.vm.selectedAccount || this.clientProfileDetailsService.getDefaultAccount(this.accounts)
            || this.accounts[0];
         this.onAccountSelection(this.selectedAccount);
      });
      this.populatePaymentFrequency(this.vm.recurrenceFrequency);
      this.formatDate = moment(this.vm.startDate);
      this.formatEndDate = moment(this.vm.endDate);
      this.getProducts();
      this.getPrepaidLimits();
      this.repeatTypeValues = CommonUtility.getRepeatType();
      this.selectedRepeatType(this.vm.repeatType);
   }

   setAccountFrom() {
      if (!this.vm.selectedAccount && this.vm.accountNumberFromDashboard) {
         this.vm.selectedAccount = this.accounts.filter((ac) => {
            return ac.itemAccountId === this.vm.accountNumberFromDashboard;
         })[0];
      }
   }

   selectedRepeatType(value) {
      this.vm.repeatType = value ? value : Object.getOwnPropertyNames(this.repeatTypesConstant)[0];
   }

   onRepeatTypeChange(repeatTypeSelectedItem) {
      this.vm.repeatType = repeatTypeSelectedItem.value;
   }

   onRechargeTypeChanged(rechargeType) {
      this.vm.rechargeType = rechargeType;
      this.rechargeType = this.vm.rechargeType;
      this.vm.bundleType = '';
      this.populateAvailableBundles();
      this.validate();
      this.validateProviderConfiguration(this.buyService.getBuyToVm().serviceProvider,
         (this.selectedProduct) ? this.selectedProduct.productCode : '');
   }

   validateProviderConfiguration(serviceProviderCode: string, productCode: string) {
      const providerConfig = Constants.labels.buyLabels.prepaiConfigurationOptions.filter(i => {
         return productCode !== '' && i.providerCode === serviceProviderCode &&
            i.productCode === productCode;
      });
      this.isSchedulePaymentDisabled = (providerConfig && providerConfig.length > 0) ? !providerConfig[0].futureDate : false;
      this.isRecurringPaymentDisabled = (providerConfig && providerConfig.length > 0) ? !providerConfig[0].recurring : false;
      this.bundleMessage = (providerConfig && providerConfig.length > 0 && providerConfig[0].notificationmessage !== '')
         ? providerConfig[0].notificationmessage : '';
      this.repeatPurchaseMessage = Constants.labels.repeatPurchaseErrorMessage;
      this.repeatPurchaseMessage = this.isSchedulePaymentDisabled ? this.repeatPaymentdisableMessage
         : (this.isRecurringPaymentDisabled) ? this.repeatPaymentwithRecurringDisabledMessage : this.repeatPurchaseMessage;
      if (this.isSchedulePaymentDisabled) {
         this.onPaymentFrequencyChanged(this.paymentRecurrenceFrequencies[0].value);
         this.vm.startDate = this.todayDate;
         this.formatDate = moment(this.vm.startDate);
      }
   }

   onBundleAmountTypeChanged(bundleAmountType) {
      this.showSelectedBundle(bundleAmountType);
      this.validate();
   }

   // handle amount change
   onAmountChange(value) {
      this.vm.amount = value;
      this.allowedMinimumValue = (this.rechargeType === Constants.prepaidRechargeType.airtime &&
         this.selectedBundleType === Constants.prepaidBundleType.ownAmount) ?
         Constants.payPrepaidVariableValues.amountMinValue :
         Constants.payMinimumVariableValues.amountMinValue;
      this.isMinimumViolated = this.vm.amount < this.allowedMinimumValue && this.vm.amount > 0;
      this.isMaximumExceeded = value > this.allowedMaximumValue;
      this.allowedTransferLimit = this.availableTransferLimit - value;
      this.isTransferLimitExceeded = this.allowedTransferLimit < 0;
      this.validatePaymentAmount(this.vm.selectedAccount.availableBalance);
   }

   validatePaymentAmount(availableBalance: number) {
      this.insufficientFunds = this.vm.amount > 0 && this.vm.amount > availableBalance;
      this.isValid = !this.isMinimumViolated &&
         ((this.rechargeType === Constants.prepaidRechargeType.airtime &&
            this.selectedBundleType === Constants.prepaidBundleType.ownAmount) ?
            !this.isMaximumExceeded : true) &&
         !this.insufficientFunds && this.vm.amount > 0 &&
         this.vm.amount <= availableBalance;
      this.validate();
   }

   // handle account selection
   onAccountSelection(account: IAccountDetail) {
      this.vm.selectedAccount = account;
      this.validatePaymentAmount(this.vm.selectedAccount.availableBalance);
   }

   setDate(value) {
      this.vm.startDate = value;
      this.minPaymentEndDate = CommonUtility.getNextDate(this.vm.startDate, 1, 'days');
      this.endConfig = CommonUtility.getConfig(this.minPaymentEndDate, this.formatEndDate);
      this.formatEndDate = moment(this.formatEndDate);
      this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.startDate, this.formatEndDate
         , this.selectedPaymentFrequency.code);
      if (value && this.todayDate) {
         this.isSameDate = CommonUtility.isSameDateAs(value, this.todayDate);
         if (this.isSameDate) {
            this.onPaymentFrequencyChanged(this.paymentRecurrenceFrequencies[0].value);
         }
      }
   }

   setEndDate(value) {
      this.vm.endDate = value;
      this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.startDate, this.vm.endDate
         , this.selectedPaymentFrequency.code);
   }

   populatePaymentFrequency(recurrenceFrequency: string) {
      switch (recurrenceFrequency) {
         case Constants.VariableValues.paymentRecurrenceFrequency.none.code:
            this.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.none;
            break;
         case Constants.VariableValues.paymentRecurrenceFrequency.monthly.code:
            this.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.monthly;
            break;
         case Constants.VariableValues.paymentRecurrenceFrequency.weekly.code:
            this.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.weekly;
            break;
         default:
            throw Error('invalid payment recurrence frequency');
      }
   }

   ngAfterViewInit() {
      this.buyAmountForm.valueChanges
         .subscribe(values => this.validate());
   }
   onPaymentFrequencyChanged(paymentFrequency: ITransactionFrequency) {
      this.selectedPaymentFrequency = paymentFrequency;
      if (this.selectedPaymentFrequency.code !== null) {
         this.vm.repeatDurationText = CommonUtility.getRepeatDurationText(this.vm.startDate, this.vm.endDate
            , this.selectedPaymentFrequency.code);
      }
      if (this.buyAmountForm.form.controls.numRecurrence) {
         this.buyAmountForm.form.controls.numRecurrence.reset();
      }
   }

   isNumReccurencesInvalid() {
      return this.isRecurrenceValueInvalid() ||
         this.isMonthlyRecurrenceInvalid() ||
         this.isWeeklyRecurrenceInvalid();
   }

   isRecurrenceValueInvalid(): boolean {
      if (this.vm.repeatType === this.endDateRepeatTypeConstant) {
         return false;
      } else {
         const isRecurrenceSelected = this.selectedPaymentFrequency !== Constants.VariableValues.paymentRecurrenceFrequency.none;
         return isRecurrenceSelected && (!this.vm.numRecurrence || parseInt(this.vm.numRecurrence, 10) <= 0);
      }
   }

   isMonthlyRecurrenceInvalid(): boolean {
      const isMonthlyRecurrence = this.selectedPaymentFrequency === Constants.VariableValues.paymentRecurrenceFrequency.monthly;
      return isMonthlyRecurrence
         && this.vm.numRecurrence
         && parseInt(this.vm.numRecurrence, 10) > Constants.VariableValues.paymentRecurrenceFrequency.monthly.maxValue;
   }

   isWeeklyRecurrenceInvalid(): boolean {
      const isWeeklyReccurence = this.selectedPaymentFrequency === Constants.VariableValues.paymentRecurrenceFrequency.weekly;
      return isWeeklyReccurence
         && this.vm.numRecurrence
         && parseInt(this.vm.numRecurrence, 10) > Constants.VariableValues.paymentRecurrenceFrequency.weekly.maxValue;
   }

   validate() {
      const valid = this.isValid
         && !this.isNumReccurencesInvalid()
         && this.buyAmountForm.valid
         && !!this.selectedAccount
         && !this.skeletonMode;
      this.isComponentValid.emit(valid);
   }

   nextClick(currentStep: number) {
      this.vm.recurrenceFrequency = this.selectedPaymentFrequency.code;
      if (this.vm.recurrenceFrequency === Constants.VariableValues.paymentRecurrenceFrequency.none.code) {
         this.vm.numRecurrence = null;
      }
      this.buyService.saveBuyAmountInfo(this.vm);
      this.sendEvent('buy_prepaid_bundle_type_and_account_click_on_next');
   }

   stepClick(stepInfo: IStepInfo) {
   }
}
