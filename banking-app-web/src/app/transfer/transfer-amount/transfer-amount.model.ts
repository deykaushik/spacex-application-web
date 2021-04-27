import { Constants } from './../../core/utils/constants';
import { IAccountDetail, IReoccurenceModel } from '../../core/services/models';
import { IWorkflowModel, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';
import { ReoccurenceModel } from '../transfer.models';
import { CommonUtility } from './../../core/utils/common';
import { ITransferAmountVm } from '../transfer.models';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';

export class TransferAmountModel implements IWorkflowModel {
   availableTransferLimit: number;
   amount: number;
   selectedFromAccount: IAccountDetail;
   selectedToAccount: IAccountDetail;
   payDate: Date = new Date();
   current = new Date();
   endDate: Date = CommonUtility.getNextEndDate(this.current);
   repeatDurationText?: string;
   repeatStatusText?: string;

   isTransferLimitExceeded: boolean;
   allowedTransferLimit: number;
   isValid: boolean;
   reoccurrenceItem: IReoccurenceModel;
   errorMessage?: string;
   amountTransform = new AmountTransformPipe();
   accountFromDashboard?: string;
   repeatType?: string;
   accountToTransfer?: string;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         const amount = this.amountTransform.transform(this.amount + '');
         title = `Transfer ${amount} from my account-` +
            `${this.selectedFromAccount.nickname} ` +
            ` to my account-${this.selectedToAccount.nickname}`;

         if (this.reoccurrenceItem.reoccurrenceFrequency !== null) {
            title += ` repeated  ${CommonUtility.getJourneyOccuranceMessage(this.reoccurrenceItem.reoccurrenceFrequency,
               this.repeatType, this.endDate, this.reoccurrenceItem.reoccurrenceOccur)}`;
         } else if (this.payDate > new Date() && this.reoccurrenceItem.reoccurrenceFrequency === null) {
            // Check for Recurrence - Never (future date)
            title += ` on  ${CommonUtility.getJourneyOccuranceMessage(this.reoccurrenceItem.reoccurrenceFrequency,
               this.repeatType, this.payDate, this.reoccurrenceItem.reoccurrenceOccur)}`;
         } else {
            title += ` today.`;
         }
      } else {
         title = Constants.labels.howMuchYouLikeToTransfer;
      }
      return title;
   }
   getViewModel(): ITransferAmountVm {
      return {
         isTransferLimitExceeded: this.isTransferLimitExceeded,
         allowedTransferLimit: this.allowedTransferLimit,
         isValid: this.isValid,
         availableTransferLimit: this.availableTransferLimit,
         amount: this.amount,
         selectedFromAccount: this.selectedFromAccount,
         selectedToAccount: this.selectedToAccount,
         payDate: this.payDate,
         repeatType: this.repeatType,
         endDate: this.endDate,
         repeatDurationText: this.repeatDurationText,
         repeatStatusText: this.repeatStatusText,
         reoccurrenceItem: this.reoccurrenceItem ? this.reoccurrenceItem : new ReoccurenceModel(),
         accountFromDashboard: this.accountFromDashboard,
         accountToTransfer: this.accountToTransfer
      };
   }
   updateModel(vm: ITransferAmountVm): void {
      this.isTransferLimitExceeded = vm.isTransferLimitExceeded;
      this.allowedTransferLimit = vm.allowedTransferLimit;
      this.isValid = vm.isValid;
      this.availableTransferLimit = vm.availableTransferLimit;
      this.amount = vm.amount;
      this.selectedFromAccount = vm.selectedFromAccount;
      this.selectedToAccount = vm.selectedToAccount;
      this.payDate = vm.payDate;
      this.repeatType = vm.repeatType;
      this.endDate = vm.endDate;
      this.reoccurrenceItem = vm.reoccurrenceItem;
      this.repeatDurationText = vm.repeatDurationText;
      this.repeatStatusText = vm.repeatStatusText;
      this.accountFromDashboard = vm.accountFromDashboard;
      this.accountToTransfer = this.accountToTransfer;
   }
   clearModel(): void {
      this.isTransferLimitExceeded = undefined;
      this.allowedTransferLimit = undefined;
      this.isValid = undefined;
      this.availableTransferLimit = undefined;
      this.amount = undefined;
      this.payDate = undefined;
      this.repeatType = undefined;
      this.endDate = undefined;
      this.reoccurrenceItem = new ReoccurenceModel();
      this.repeatDurationText = undefined;
      this.repeatStatusText = undefined;
      this.accountFromDashboard = undefined;
      this.accountToTransfer = undefined;
   }
}
