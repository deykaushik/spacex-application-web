import { Constants } from './../../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';
import { IGetQuoteVm, ICurrency, IClientDetails } from '../fund-trip.model';

export class GetQuoteModel implements IWorkflowModel {
   currency: ICurrency;
   fromCurrencyValue: number;
   toCurrencyValue: string;
   clientDetails: IClientDetails;
   quotationReference: string;

   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      const title = Constants.labels.fundTripLabels.getQuoteTitle;
      return title;
   }

   getViewModel(): IGetQuoteVm {
      return {
         currency: this.currency,
         fromCurrencyValue: this.fromCurrencyValue,
         toCurrencyValue: this.toCurrencyValue,
         clientDetails: this.clientDetails,
         quotationReference: this.quotationReference
      };
   }

   updateModel(vm: IGetQuoteVm): void {
      this.currency = vm.currency;
      this.fromCurrencyValue = vm.fromCurrencyValue;
      this.toCurrencyValue = vm.toCurrencyValue;
      this.clientDetails =  vm.clientDetails;
      this.quotationReference = vm.quotationReference;
   }
}
