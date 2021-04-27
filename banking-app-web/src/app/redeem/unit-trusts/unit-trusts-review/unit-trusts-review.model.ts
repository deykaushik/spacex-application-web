import { Constants } from './../../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';

/**
 * Workflow model for unit trusts review component.
 *
 * @export
 * @class UnitTrustsReviewModel
 * @implements {IWorkflowModel}
 */
export class UnitTrustsReviewModel implements IWorkflowModel {

   /**
    * Get the title text to be shown in review component.
    *
    * @returns {string}
    * @memberof UnitTrustsReviewModel
    */
   getStepTitle(): string {
      return Constants.labels.reviewTransaction;
   }
}

