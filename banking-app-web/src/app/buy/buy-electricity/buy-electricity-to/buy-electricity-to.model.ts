import { Constants } from './../../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IBuyElectricityToVm } from '../buy-electricity.models';
import { IBeneficiaryData } from '../../../core/services/models';


export class BuyElectricityToModel implements IWorkflowModel {
   recipientName: string;
   serviceProvider: string;
   meterNumber: string;
   productCode: string;
   isVmValid: boolean;
   fbeElectricityUnits?: number;
   fbeClaimedDate?: Date;
   fbeTransactionID?: string;
   fbeRecipientName?: string;
   beneficiaryID: number;
   beneficiaryData: IBeneficiaryData;
   isRecipientPicked?: boolean;
   isReadOnly?: boolean;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         title = `Buying electricity for ${this.recipientName} - ${this.meterNumber}`;
      } else {
         title = Constants.labels.buyElectricityLabels.buyToTitle;
      }
      return title;
   }

   getViewModel(): IBuyElectricityToVm {
      return {
         recipientName: this.recipientName,
         meterNumber: this.meterNumber,
         serviceProvider: this.serviceProvider,
         productCode: this.productCode,
         isVmValid: this.isVmValid,
         fbeClaimedDate: this.fbeClaimedDate,
         fbeElectricityUnits: this.fbeElectricityUnits,
         fbeTransactionID: this.fbeTransactionID,
         beneficiaryID: this.beneficiaryID,
         fbeRecipientName: this.fbeRecipientName,
         beneficiaryData: this.beneficiaryData,
         isRecipientPicked: this.isRecipientPicked,
         isReadOnly: this.isReadOnly,
      };
   }

   updateModel(vm: IBuyElectricityToVm): void {
      this.recipientName = vm.recipientName;
      this.meterNumber = vm.meterNumber,
         this.productCode = vm.productCode,
         this.serviceProvider = vm.serviceProvider;
      this.isVmValid = vm.isVmValid;
      this.fbeElectricityUnits = vm.fbeElectricityUnits;
      this.fbeTransactionID = vm.fbeTransactionID;
      this.fbeClaimedDate = vm.fbeClaimedDate;
      this.beneficiaryID = vm.beneficiaryID;
      this.fbeRecipientName = vm.fbeRecipientName;
      this.beneficiaryData = vm.beneficiaryData;
      this.isRecipientPicked = vm.isRecipientPicked;
      this.isReadOnly = vm.isReadOnly;
   }
}
