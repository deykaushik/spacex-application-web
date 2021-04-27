import { Constants } from './../../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IBuyReviewVm } from '../buy.models';

export class BuyReviewModel implements IWorkflowModel {
   isSaveBeneficiary = true;

   getStepTitle(): string {
      return Constants.labels.buyLabels.buyReviewHeader;
   }
   getViewModel(): IBuyReviewVm {
      return {
         isSaveBeneficiary: this.isSaveBeneficiary
      };
   }

   updateModel(vm: IBuyReviewVm): void {
      this.isSaveBeneficiary = vm.isSaveBeneficiary;
   }
}

