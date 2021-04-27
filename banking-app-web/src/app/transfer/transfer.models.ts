import { TransferAmountModel } from './transfer-amount/transfer-amount.model';
import { TransferReviewModel } from './transfer-review/transfer-review.model';
import { ITransferDetail, ITransferDetailsDoublePayment } from './../core/services/models';
import { IWorkflowStepModel } from '../shared/components/work-flow/work-flow.models';
import { IAccountDetail, ITransferAccount, IReoccurenceModel } from '../core/services/models';

export enum TransferStep {
   amount = 1,
   review = 2
}

export interface ITransferWorkflowSteps {
   amountStep: IWorkflowStepModel<TransferAmountModel>;
   reviewStep: IWorkflowStepModel<TransferReviewModel>;
}

export interface ITransferAmountVm {
   availableTransferLimit: number;
   amount: number;
   selectedFromAccount: IAccountDetail;
   selectedToAccount: IAccountDetail;
   payDate: any;
   isValid: boolean;
   isTransferLimitExceeded: boolean;
   allowedTransferLimit: number;
   repeatType?: string;
   endDate?: any;
   repeatDurationText?: string;
   repeatStatusText?: string;
   reoccurrenceItem: IReoccurenceModel;
   accountFromDashboard?: string;
   accountToTransfer?: string;
}

export interface ITransferReviewVm {
   amount: number;
}

export class TransferDetailsDoublePayment implements ITransferDetailsDoublePayment {
   requestId: string;
   transfers: ITransferDetail[];
}

export class TransferDetail implements ITransferDetail {
   transactionID?: string;
   favourite: boolean;
   startDate: string;
   amount: number;
   nextTransDate?: string;
   fromAccount: ITransferAccount;
   toAccount: ITransferAccount;
   reoccurrenceItem: IReoccurenceModel;
   accountFromDashboard?: string;
}
export class ReoccurenceModel implements IReoccurenceModel {
   reoccurrenceFrequency: string;
   reoccurrenceOccur: Number;
   reoccSubFreqVal: string;
}
