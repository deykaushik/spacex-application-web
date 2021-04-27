import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IBuyElectricityAccountDetail } from './../../../core/services/models';
import { IBuyElectricityAmountVm } from '../buy-electricity.models';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
export class BuyElectricityAmountModel implements IWorkflowModel {

   startDate: Date = new Date();
   productCode: string;
   amount = 0;
   selectedAccount: IBuyElectricityAccountDetail;
   electricityAmountInArrears = 0;
   amountTransform = new AmountTransformPipe();
   accountNumberFromDashboard?: string;

   getStepTitle(isNavigated: boolean, isDefault?: boolean): string {
      let title = '';
      if (isNavigated && !isDefault) {
         const amount = this.amountTransform.transform(this.amount + '');
         title = `${amount} prepaid electricity from my ` +
            `${CommonUtility.getAccountTypeName(this.selectedAccount.accountType)} account`;
      } else {
         title = Constants.labels.buyElectricityLabels.buyAmountTitle;
      }
      return title;
   }
   getViewModel(): IBuyElectricityAmountVm {
      return {
         startDate: this.startDate,
         amount: this.amount,
         selectedAccount: this.selectedAccount,
         electricityAmountInArrears: this.electricityAmountInArrears,
         accountNumberFromDashboard: this.accountNumberFromDashboard
      };
   }

   updateModel(vm: IBuyElectricityAmountVm): void {
      this.startDate = vm.startDate;
      this.amount = vm.amount;
      this.selectedAccount = vm.selectedAccount;
      this.electricityAmountInArrears = vm.electricityAmountInArrears;
      this.accountNumberFromDashboard = vm.accountNumberFromDashboard;
   }
}
