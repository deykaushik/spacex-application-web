import { Constants } from './../../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IBuyToVm } from '../buy.models';
import { IAccountDetail, IBeneficiaryData } from '../../../core/services/models';


export class BuyToModel implements IWorkflowModel {

   recipientName: string;
   serviceProvider: string;
   mobileNumber: string;
   serviceProviderName: string;
   beneficiaryID?: number;
   beneficiaryData: IBeneficiaryData;
   isRecipientPicked?: boolean;
   isReadOnly?: boolean;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         title = `Buying ${this.serviceProviderName} prepaid for ${this.recipientName} - ${this.mobileNumber}`;
      } else {
         title = Constants.labels.buyLabels.buyToTitle;
      }
      return title;
   }

   getViewModel(): IBuyToVm {
      return {
         recipientName: this.recipientName,
         mobileNumber: this.mobileNumber,
         serviceProvider: this.serviceProvider,
         serviceProviderName: this.serviceProviderName,
         beneficiaryID: this.beneficiaryID,
         beneficiaryData: this.beneficiaryData,
         isRecipientPicked: this.isRecipientPicked,
         isReadOnly: this.isReadOnly,
      };
   }

   updateModel(vm: IBuyToVm): void {
      this.recipientName = vm.recipientName;
      this.mobileNumber = vm.mobileNumber;
      this.serviceProvider = vm.serviceProvider;
      this.serviceProviderName = vm.serviceProviderName;
      this.beneficiaryID = vm.beneficiaryID;
      this.beneficiaryData = vm.beneficiaryData;
      this.isRecipientPicked = vm.isRecipientPicked;
      this.isReadOnly = vm.isReadOnly;
   }
}
