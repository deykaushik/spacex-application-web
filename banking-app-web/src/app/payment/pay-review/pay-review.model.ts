import { IWorkflowModel } from '../../shared/components/work-flow/work-flow.models';
import { IPayReviewVm } from '../payment.models';
import { Constants } from './../../core/utils/constants';

export class PayReviewModel implements IWorkflowModel {
   isSaveBeneficiary = true;

   getStepTitle(): string {
      return Constants.labels.payReviewTitle;
   }

   getViewModel(): IPayReviewVm {
      return {
         isSaveBeneficiary: this.isSaveBeneficiary
      };
   }

   updateModel(vm: IPayReviewVm): void {
      this.isSaveBeneficiary = vm.isSaveBeneficiary;
   }
}
