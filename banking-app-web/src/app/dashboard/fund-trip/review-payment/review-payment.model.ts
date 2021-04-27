import { Constants } from './../../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IPaymentReviewVm, ICurrency, IAmount } from '../fund-trip.model';

export class ReviewPaymentModel implements IWorkflowModel {
   isPaymentSuccessful?: boolean;
   cardNumber?: number;
   transactionReference?: string;
   transferDate?: string;
   totalAmount?: IAmount;
   senderReference?: string;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         title = Constants.labels.fundTripLabels.reviewPaymentDetails;
      } else {
         title = Constants.labels.buyElectricityLabels.buyToTitle;
      }
      return title;
   }

   getViewModel(): IPaymentReviewVm {
      return {
         isPaymentSuccessful: this.isPaymentSuccessful,
         cardNumber: this.cardNumber,
         transactionReference: this.transactionReference,
         transferDate: this.transferDate,
         totalAmount: this.totalAmount,
         senderReference: this.senderReference
      };
   }

   updateModel(vm: IPaymentReviewVm): void {
      this.isPaymentSuccessful = vm && vm.cardNumber ? true : false;
      this.cardNumber = vm && vm.cardNumber ? vm.cardNumber : 0;
      this.transactionReference = vm && vm.transactionReference ? vm.transactionReference : null;
      this.transferDate = vm && vm.transferDate ? vm.transferDate : null;
      this.totalAmount = vm && vm.totalAmount ? vm.totalAmount : null;
      this.senderReference = vm && vm.senderReference ? vm.senderReference : null;
   }
}
