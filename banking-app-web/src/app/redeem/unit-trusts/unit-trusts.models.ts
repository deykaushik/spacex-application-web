import * as models from '../../core/services/models';
import { IAccountDetail, IProductItem } from '../../core/services/models';
import { IWorkflowStepModel } from '../../shared/components/work-flow/work-flow.models';
import { UnitTrustsBuyModel } from './unit-trusts-buy/unit-trusts-buy.model';
import { UnitTrustsReviewModel } from './unit-trusts-review/unit-trusts-review.model';

/**
 * Enum for unit tursts redemption steps.
 *
 * @export
 * @enum {number}
 */
export enum UnitTrustsStep {
   buy = 1,
   review = 2,
   success = 3
}

/**
 * Contract for unit trusts workflow steps.
 *
 * @export
 * @interface IUnitTrustWorkflowSteps
 */
export interface IUnitTrustWorkflowSteps {
   buy: IWorkflowStepModel<UnitTrustsBuyModel>;
   review: IWorkflowStepModel<UnitTrustsReviewModel>;
}

/**
 * Contract for unit trusts buy model.
 *
 * @export
 * @interface IUnitTrustsBuy
 */
export interface IUnitTrustsBuy {
   fromAccount: IAccountDetail;
   toAccounts: IProductItem[];
   yourReference: string;
   transactionReference?: string;
   randValue: number;
   gbValue: number;
   requestDate: Date;
   accountNumberFromDashboard?: string;
}
