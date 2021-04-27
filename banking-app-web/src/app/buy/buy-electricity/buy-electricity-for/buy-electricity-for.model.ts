import { Constants } from './../../../core/utils/constants';
import { IBuyElectricityForVm } from '../buy-electricity.models';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';


export class BuyElectricityForModel implements IWorkflowModel {
   yourReference: string;
   notificationType: string;
   notificationInput: string;
   lastTshwanValidateNo: String;
   lastTshwanValidateAmount: number;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title: string;
      if (isNavigated && !isDefault) {
         title = `Your reference: For ${this.yourReference}`;
         if (this.notificationType && this.notificationInput) {
            title += ` Send an ${this.notificationType} notification to ${this.notificationInput}`;
         }
      } else {
         title = Constants.labels.buyElectricityLabels.buyForTitle;
      }
      return title;
   }

   getViewModel(): IBuyElectricityForVm {
      return {
         yourReference: this.yourReference,
         notificationType: this.notificationType,
         notificationInput: this.notificationInput,
         lastTshwanValidateAmount: this.lastTshwanValidateAmount,
         lastTshwanValidateNo: this.lastTshwanValidateNo
      };
   }

   updateModel(vm: IBuyElectricityForVm): void {
      this.yourReference = vm.yourReference;
      this.notificationType = vm.notificationType;
      this.notificationInput = vm.notificationInput;
      this.lastTshwanValidateAmount = vm.lastTshwanValidateAmount;
      this.lastTshwanValidateNo = vm.lastTshwanValidateNo;
   }
}
