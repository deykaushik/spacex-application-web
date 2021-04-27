import { IWorkflowModel } from '../../../shared/components/work-flow/work-flow.models';
import { IChargesAndFeesPay } from '../charges-and-fees.models';
import { IAccountDetail } from '../../../core/services/models';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { Constants } from '../../../core/utils/constants';

export class ChargesAndFeesPayModel implements IWorkflowModel {

   /** Account identifier from which redemption is initiated. */
   public accountNumberFromDashboard?: string;
   /** Account from which redemption will be done. */
   private fromAccount: IAccountDetail;
   /** Unit tursts account to which redemption will be done. */
   private forAccount: IAccountDetail;
   /** Reference for account type */
   private accountType: string;
   /** Reference text for transaction tracking. */
   private yourReference = '';
   /** Transaction reference generate by server. */
   private transactionReference = '';
   /** Holds product category */
   private productCategory: string;
   /** Reference for cost in gb points */
   private costPoints: number;
   /** Reference for cost in rands */
   private costRands: number;
   /** Date on which redemption request is initiated. */
   private requestDate: Date;
   /** Amount formatter pipe. */
   private amountTransform = new AmountTransformPipe();
   /** Reference for supplier code*/
   private supplierCode: string;
   /** Reference for supplier name*/
   private supplierName: string;
   /** Reference for prduct code*/
   private productCode: string;
   /** Reference for prduct name*/
   private productName: string;
   /** Reference for domicile branch number*/
   private domicileBranchNumber: string;
   /**
    * Get the title to be shown in workflow, it will be updated based on the navigation
    * state of the component.
    *
    * @param {boolean} isNavigated
    * @param {boolean} [isDefault]
    * @returns {string}
    * @memberof ChargesAndFeesPayModel
    */
   getStepTitle(isNavigated: boolean, isDefault?: boolean): string {
      let title: string;
      const amountPipeSettings = Constants.amountPipeSettings.amountWithLabel;
      if (isNavigated && !isDefault) {
         const formatedRandValue = this.amountTransform.transform(this.costRands.toString(), amountPipeSettings);
         title = `Redemption of ${formatedRandValue} from my ${this.fromAccount.nickname} account to my
         Charges and Fees today`;
      } else {
         title = Constants.labels.redeemForChargesAndFees;
      }
      return title;
   }

   /**
    * Get the object model which contains the all value of the current state of model.
    *
    * @returns {IChargesAndFeesPay}
    * @memberof ChargesAndFeesPayModel
    */
   getViewModel(): IChargesAndFeesPay {
      return {
         fromAccount: this.fromAccount,
         forAccount: this.forAccount,
         accountType: this.accountType,
         costPoints: this.costPoints,
         costRands: this.costRands,
         productCategory: this.productCategory,
         yourReference: this.yourReference,
         transactionReference: this.transactionReference,
         requestDate: this.requestDate,
         accountNumberFromDashboard: this.accountNumberFromDashboard,
         supplierCode: this.supplierCode,
         supplierName: this.supplierName,
         productCode: this.productCode,
         productName : this.productName,
         domicileBranchNumber : this.domicileBranchNumber
      };
   }

   /**
    * Update the saved model with the new model passed in.
    *
    * @param {IUnitTrustsBuy} newVm
    * @memberof UnitTrustsBuyModel
    */
   updateModel(newVm: IChargesAndFeesPay) {
      this.fromAccount = newVm.fromAccount;
      this.forAccount = newVm.forAccount;
      this.productCategory = newVm.productCategory;
      this.accountType = newVm.accountType;
      this.costPoints = newVm.costPoints;
      this.costRands = newVm.costRands;
      this.yourReference = newVm.yourReference;
      this.transactionReference = newVm.transactionReference;
      this.requestDate = newVm.requestDate;
      this.accountNumberFromDashboard = newVm.accountNumberFromDashboard;
      this.supplierCode = newVm.supplierCode;
      this.supplierName = newVm.supplierName;
      this.productCode = newVm.productCode;
      this.productName = newVm.productName;
      this.domicileBranchNumber = newVm.domicileBranchNumber;
   }
}
