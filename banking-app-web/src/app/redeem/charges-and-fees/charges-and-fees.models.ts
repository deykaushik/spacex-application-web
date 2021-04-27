import * as models from '../../core/services/models';
import { IWorkflowModel } from '../../shared/components/work-flow/work-flow.models';
import { IWorkflowStepModel } from '../../shared/components/work-flow/work-flow.models';
import { ChargesAndFeesPayModel } from './charges-and-fees-pay/charges-and-fees-pay.model';
import { ChargesAndFeesReviewModel } from './charges-and-fees-review/charges-and-fees-review.model';

export enum ChargesAndFeesStep {
   pay = 1,
   review = 2,
   success = 3
}

export interface IChargesAndFeesWorkFlowSteps {
   pay: IWorkflowStepModel<ChargesAndFeesPayModel>;
   review: IWorkflowStepModel<ChargesAndFeesReviewModel>;
}

/**
 * Contract for charges and fees pay model.
 *
 * @export
 * @interface IChargesAndFeesPay
 */
export interface IChargesAndFeesPay {
   fromAccount: models.IAccountDetail;
   forAccount: models.IAccountDetail;
   productCategory: string;
   accountType: string;
   costPoints: number;
   costRands: number;
   yourReference: string;
   transactionReference: string;
   requestDate: Date;
   accountNumberFromDashboard: string;
   supplierCode: string;
   supplierName: string;
   productCode: string;
   productName: string;
   domicileBranchNumber: string;
}

/**
 * Contract for bank/card charges and linkage fees.
 *
 * @interface IProgramme
 */
export interface IProgramme {
   programmeId: string;
   productCategories: IProductCategory[];
}

/**
 * Contract for product category.
 *
 * @interface IProductCategory
 */
export interface IProductCategory {
   productCategoryCode: string;
   supplierCode: string;
   supplierName?: string;
   productCategoryDescription: string;
   products: IProduct[];
}

/**
 * Contract for product.
 *
 * @interface IProduct
 */
export interface IProduct {
   productId: number;
   productName:  string;
   productCostPoints: number;
   productCostRands:  number;
   productCode: string;
}
