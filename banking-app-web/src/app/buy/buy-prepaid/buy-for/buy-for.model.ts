import { Constants } from './../../../core/utils/constants';
import { IBuyForVm } from '../buy.models';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';


export class BuyForModel implements IWorkflowModel {
   yourReference: string;
   notificationType: string;
   notificationInput: string;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title: string;
      if (isNavigated && !isDefault) {
         title = `Your reference: For ${this.yourReference}`;
         if (this.notificationType && this.notificationInput) {
            title += ` Send an ${this.notificationType} notification to ${this.notificationInput}`;
         }
      } else {
         title = Constants.labels.buyLabels.buyForTitle;
      }
      return title;
   }
   getViewModel(): IBuyForVm {
      return {
         yourReference: this.yourReference,
         notificationType: this.notificationType,
         notificationInput: this.notificationInput
      };
   }

   updateModel(vm: IBuyForVm): void {
      this.yourReference = vm.yourReference;
      this.notificationType = vm.notificationType;
      this.notificationInput = vm.notificationInput;
   }
}
