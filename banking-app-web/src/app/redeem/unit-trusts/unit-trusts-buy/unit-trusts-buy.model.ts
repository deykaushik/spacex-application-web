import { Constants } from './../../../core/utils/constants';
import { IDashboardAccount, IAccountDetail, IProductItem } from './../../../core/services/models';
import { IUnitTrustsBuy } from './../unit-trusts.models';
import { IWorkflowModel } from '../../../shared/components/work-flow/work-flow.models';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';

/**
 * Workflow model for unit tursts buy component.
 *
 * @export
 * @class UnitTrustsBuyModel
 * @implements {IWorkflowModel}
 */
export class UnitTrustsBuyModel implements IWorkflowModel {

   /** Account identifier from which redemption is initiated. */
   public accountNumberFromDashboard?: string;
   /** Account from which redemption will be done. */
   private fromAccount: IAccountDetail;
   /** Unit tursts account to which redemption will be done. */
   private toAccounts: IProductItem[];
   /** Reference text for transaction tracking. */
   private yourReference = '';
   /** Transaction reference generate by server. */
   private transactionReference = '';
   /** Total rand value of redemption. */
   private randValue = 0;
   /** Total rewards value of redemption. */
   private gbValue = 0;
   /** Date on which redemption request is initiated. */
   private requestDate: Date;
   /** Amount formatter pipe. */
   private amountTransform = new AmountTransformPipe();

   /**
    * Get the title to be shown in workflow, it will be updated based on the navigation
    * state of the component.
    *
    * @param {boolean} isNavigated
    * @param {boolean} [isDefault]
    * @returns {string}
    * @memberof UnitTrustsBuyModel
    */
   getStepTitle(isNavigated: boolean, isDefault?: boolean): string {
      let title: string;
      const amountPipeSettings = Constants.amountPipeSettings.amountWithLabel,
         formatedRandValue = this.amountTransform.transform(this.randValue.toString(), amountPipeSettings);
      if (isNavigated && !isDefault) {
         title = `Redemption of ${formatedRandValue} from my ${this.fromAccount.nickname} account to my
         Unit Trusts today`;
         if (this.yourReference) {
            title += ` Your reference is ${this.yourReference}`;
         }
      } else {
         title = Constants.labels.buyTitle;
      }
      return title;
   }

   /**
    * Get the object model which contains the all value of the current state of model.
    *
    * @returns {IUnitTrustsBuy}
    * @memberof UnitTrustsBuyModel
    */
   getViewModel(): IUnitTrustsBuy {
      return {
         fromAccount: this.fromAccount,
         toAccounts: this.toAccounts,
         yourReference: this.yourReference,
         transactionReference: this.transactionReference,
         randValue: this.randValue,
         gbValue: this.gbValue,
         requestDate: this.requestDate,
         accountNumberFromDashboard: this.accountNumberFromDashboard
      };
   }

   /**
    * Update the saved model with the new model passed in.
    *
    * @param {IUnitTrustsBuy} newVm
    * @memberof UnitTrustsBuyModel
    */
   updateModel(newVm: IUnitTrustsBuy) {
      this.fromAccount = newVm.fromAccount;
      this.toAccounts = newVm.toAccounts;
      this.yourReference = newVm.yourReference;
      this.transactionReference = newVm.transactionReference;
      this.randValue = newVm.randValue;
      this.gbValue = newVm.gbValue;
      this.requestDate = newVm.requestDate;
      this.accountNumberFromDashboard = newVm.accountNumberFromDashboard;
   }
}
