import { Constants } from './../../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IPaymentDetailsVm } from '../fund-trip.model';
import { ITransferAccount, IAccountDetail } from '../../../core/services/models';

export class PaymentDetailsModel implements IWorkflowModel {
   amount: number;
   toAccount: IAccountDetail;
   reference: string;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      const title = Constants.labels.fundTripLabels.getQuoteTitle;
      return title;
   }

   getViewModel(): IPaymentDetailsVm {
      return {
         amount: this.amount,
         toAccount: this.toAccount,
         reference: this.reference
      };
   }

   updateModel(vm: IPaymentDetailsVm): void {
      this.amount = vm.amount;
      this.toAccount = vm.toAccount;
      this.reference = vm.reference;
   }
}
