import { Constants } from './../../core/utils/constants';
import { IWorkflowModel, IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';
import { ITransferReviewVm } from '../transfer.models';


export class TransferReviewModel implements IWorkflowModel {
   getStepTitle(): string {
      return Constants.labels.reviewTransfer;
   }
}
