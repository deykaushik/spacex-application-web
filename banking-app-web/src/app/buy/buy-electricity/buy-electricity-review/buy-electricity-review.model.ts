import { Constants } from '.././../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IBuyElectricityReviewVm } from '../buy-electricity.models';

export class BuyElectricityReviewModel implements IWorkflowModel {
   isSaveBeneficiary = true;

   getStepTitle(): string {
      return Constants.labels.buyElectricityLabels.buyReview;
   }

   getViewModel(): IBuyElectricityReviewVm {
      return {
         isSaveBeneficiary: this.isSaveBeneficiary
      };
   }

   updateModel(vm: IBuyElectricityReviewVm): void {
      this.isSaveBeneficiary = vm.isSaveBeneficiary;
   }
}
