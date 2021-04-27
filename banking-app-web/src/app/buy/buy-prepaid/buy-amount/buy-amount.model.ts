import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { IPrepaidAccountDetail } from './../../../core/services/models';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IBuyAmountVm } from '../buy.models';
import { IAccountDetail } from '../../../core/services/models';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';

export class BuyAmountModel implements IWorkflowModel {
   startDate: Date = new Date();
   current = new Date();
   endDate: Date = CommonUtility.getNextEndDate(this.current);
   repeatDurationText = '';
   repeatType?: string;
   amountTransform = new AmountTransformPipe();
   productCode: string;
   rechargeType: string;
   bundleType: string;
   amount = 0;
   recurrenceFrequency: string = null;
   numRecurrence = '';
   selectedAccount: IPrepaidAccountDetail;
   accountNumberFromDashboard?: string;
   get displayBundle(): string {
      let temp = this.bundleType;
      if (temp) {
         let split = temp.split(' ');
         switch (this.rechargeType) {
            case Constants.changeDisplayBundel.Data: split.splice(1, 0, Constants.changeDisplayBundel.Data.toLowerCase());
               split[split.length - 1] = this.amountTransform.transform(this.amount.toFixed(2) + '');
               break;
            case Constants.changeDisplayBundel.SMS:
               split[split.length - 1] = this.amountTransform.transform(this.amount.toFixed(2) + '');
               break;
            default:
               let tempAmount;
               if (this.bundleType === Constants.labels.buyLabels.buyAmountLabels.ownAmount) {
                  tempAmount = this.amount;
               } else {
                  tempAmount = this.amount.toFixed(2);
               }
               split = [this.amountTransform.transform(tempAmount + ''), this.rechargeType.toLowerCase()];
         }
         temp = split.join(' ');
      } else {
         temp = this.amountTransform.transform(this.amount.toFixed(2) + '');
      }
      return temp;
   }
   getStepTitle(isNavigated: boolean, isDefault?: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         title = `${this.displayBundle} from my account-` +
            `${this.selectedAccount.nickname}`;

         if (this.recurrenceFrequency !== null) {
            title += ` repeated  ${CommonUtility.getJourneyOccuranceMessage(this.recurrenceFrequency,
               this.repeatType, this.endDate, this.numRecurrence)}`;
         } else if (this.startDate > new Date() && this.recurrenceFrequency === null) {
            // Check for Recurrence - Never (future date)
            title += ` on  ${CommonUtility.getJourneyOccuranceMessage(this.recurrenceFrequency,
               this.repeatType, this.startDate, this.numRecurrence)}`;
         } else {
            title += ` today.`;
         }
      } else {
         title = Constants.labels.buyLabels.buyAmountTitle;
      }
      return title;
   }
   getViewModel(): IBuyAmountVm {
      return {
         startDate: this.startDate,
         productCode: this.productCode,
         rechargeType: this.rechargeType,
         bundleType: this.bundleType,
         amount: this.amount,
         repeatType: this.repeatType,
         endDate: this.endDate,
         recurrenceFrequency: this.recurrenceFrequency,
         numRecurrence: this.numRecurrence,
         selectedAccount: this.selectedAccount,
         displayBundle: this.displayBundle,
         accountNumberFromDashboard: this.accountNumberFromDashboard,
         repeatDurationText: this.repeatDurationText
      };
   }

   updateModel(vm: IBuyAmountVm): void {
      this.startDate = vm.startDate;
      this.productCode = vm.productCode;
      this.rechargeType = vm.rechargeType;
      this.bundleType = vm.bundleType;
      this.amount = vm.amount;
      this.repeatType = vm.repeatType;
      this.endDate = vm.endDate;
      this.recurrenceFrequency = vm.recurrenceFrequency;
      this.numRecurrence = vm.numRecurrence;
      this.selectedAccount = vm.selectedAccount;
      this.repeatDurationText = vm.repeatDurationText;
      this.accountNumberFromDashboard = vm.accountNumberFromDashboard;
   }
}
