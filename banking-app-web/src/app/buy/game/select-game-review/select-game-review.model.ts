import { Constants } from './../../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../../shared/components/work-flow/work-flow.models';

export class SelectGameReviewModel implements IWorkflowModel {
   getStepTitle(isNavigated: boolean, isDefault: boolean): string {
      return Constants.labels.lottoLabels.selectGameReviewTitle;
   }
}
