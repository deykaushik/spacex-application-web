import { Constants } from './../../core/utils/constants';
import { CommonUtility } from './../../core/utils/common';

import { IWorkflowModel, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';
import { IPayAmountVm } from '../payment.models';
import { IAccountDetail } from '../../core/services/models';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { environment } from '../../../environments/environment';
export class PayAmountModel implements IWorkflowModel {
   isInstantPay = false;
   isTransferLimitExceeded: boolean;
   isValid: boolean;
   availableTransferLimit: number;
   allowedTransferLimit: number;
   transferAmount: number;
   selectedAccount: IAccountDetail;
   paymentDate: Date = new Date();
   current = new Date();
   endDate: Date = CommonUtility.getNextEndDate(this.current);
   repeatDurationText = '';
   repeatStatusText = '';
   recurrenceFrequency: string = null;
   numRecurrence = 0;
   reccurenceDay = 0;
   amountTransform = new AmountTransformPipe();
   accountFromDashboard?: string;
   repeatType?: string;
   crossBorderPaymentAmount?: number;
   beneficiaryAmount?: string;
   paymentExchangeRate?: string;
   remittanceCharge?: string;
   totalPaymentAmount?: string;
   beneficiaryCurrency?: string;
   selectedCurrency?: string;

   getStepTitle(isNavigated: boolean, isDefault?: boolean, crossBorderPayment?: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         if (crossBorderPayment) {
            const amount = this.amountTransform.transform(this.transferAmount + '');
            const crossBorderPaymentAmount = this.amountTransform.transform(this.crossBorderPaymentAmount + '');
            title = `You have chosen to pay ${this.beneficiaryCurrency} ${this.beneficiaryAmount} (R${this.totalPaymentAmount})`;
         } else {
            const amount = this.amountTransform.transform(this.transferAmount + '');
            title = `Pay ${amount} from my account-` +
               `${this.selectedAccount.nickname}`;

            if (this.recurrenceFrequency !== null) {
               title += ` repeated  ${CommonUtility.getJourneyOccuranceMessage(this.recurrenceFrequency,
                  this.repeatType, this.endDate, this.numRecurrence)}`;
            } else if (this.paymentDate > new Date() && this.recurrenceFrequency === null) {
               // Check for Recurrence - Never (future date)
               title += ` on  ${CommonUtility.getJourneyOccuranceMessage(this.recurrenceFrequency,
                  this.repeatType, this.paymentDate, this.numRecurrence)}`;
            } else {
               title += ` today.`;
            }
         }
      } else {
         if (crossBorderPayment) {
            title = Constants.labels.payAmountCrossPaymentTitle;
         } else {
            title = Constants.labels.payAmountTitle;
         }
      }
      return title;
   }

   getViewModel(): IPayAmountVm {
      return {
         isInstantPay: this.isInstantPay,
         isTransferLimitExceeded: this.isTransferLimitExceeded,
         isValid: this.isValid,
         availableTransferLimit: this.availableTransferLimit,
         allowedTransferLimit: this.allowedTransferLimit,
         transferAmount: this.transferAmount,
         selectedAccount: this.selectedAccount,
         numRecurrence: this.numRecurrence === 0 ? null : this.numRecurrence,
         paymentDate: this.paymentDate,
         reccurenceDay: this.reccurenceDay,
         recurrenceFrequency: this.recurrenceFrequency,
         accountFromDashboard: this.accountFromDashboard,
         repeatType: this.repeatType,
         endDate: this.endDate,
         repeatDurationText: this.repeatDurationText,
         repeatStatusText: this.repeatStatusText,
         beneficiaryAmount: this.beneficiaryAmount,
         paymentExchangeRate: this.paymentExchangeRate,
         remittanceCharge: this.remittanceCharge,
         totalPaymentAmount: this.totalPaymentAmount,
         beneficiaryCurrency: this.beneficiaryCurrency,
         selectedCurrency: this.selectedCurrency
      };
   }

   updateModel(vm: IPayAmountVm): void {
      this.isInstantPay = vm.isInstantPay;
      this.isTransferLimitExceeded = vm.isTransferLimitExceeded;
      this.isValid = vm.isValid;
      this.availableTransferLimit = vm.availableTransferLimit;
      this.allowedTransferLimit = vm.allowedTransferLimit;
      this.transferAmount = vm.transferAmount;
      this.selectedAccount = vm.selectedAccount;
      this.repeatType = vm.repeatType;
      this.endDate = vm.endDate;
      this.repeatDurationText = vm.repeatDurationText;
      this.repeatStatusText = vm.repeatStatusText;
      if (vm.numRecurrence !== null) {
         this.numRecurrence = vm.numRecurrence;
      }
      this.paymentDate = vm.paymentDate;
      this.recurrenceFrequency = vm.recurrenceFrequency;
      this.accountFromDashboard = vm.accountFromDashboard;
      this.beneficiaryAmount = vm.beneficiaryAmount;
      this.paymentExchangeRate = vm.paymentExchangeRate;
      this.remittanceCharge = vm.remittanceCharge;
      this.totalPaymentAmount = vm.totalPaymentAmount;
      this.beneficiaryCurrency = vm.beneficiaryCurrency;
      this.selectedCurrency = vm.selectedCurrency;
   }
}
