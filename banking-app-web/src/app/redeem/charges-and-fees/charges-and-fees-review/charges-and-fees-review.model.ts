import {IWorkflowModel } from '../../../shared/components/work-flow/work-flow.models';
import { Constants } from '../../../core/utils/constants';

export class ChargesAndFeesReviewModel implements IWorkflowModel {
   /**
    * Get the title to be shown in workflow, it will be updated based on the navigation
    * state of the component.
    * @returns {string}
    * @memberof ChargesAndFeesReviewModel
    */
   getStepTitle(): string {
      return Constants.labels.reviewTransaction;
   }
}
