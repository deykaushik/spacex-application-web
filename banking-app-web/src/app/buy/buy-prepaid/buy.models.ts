import { BuyToModel } from './buy-to/buy-to.model';
import { BuyReviewModel } from './buy-review/buy-review.model';
import { BuyAmountModel } from './buy-amount/buy-amount.model';

import * as models from '../../core/services/models';
import { IWorkflowStepModel } from '../../shared/components/work-flow/work-flow.models';
import {
   IBuyPrepaidDetail,
   ITransferAccount,
   IReoccurenceModel, IBank, IBranch,
   IPrepaidServiceProviderProductsDetail, IPrepaidAccountDetail, IBuyprepaidDetailsWithGUID
} from '../../core/services/models';

import { BuyForModel } from './buy-for/buy-for.model';


export enum BuyStep {
   buyTo = 1,
   buyAmount = 2,
   buyFor = 3,
   review = 4,
   success = 5
}

export interface IBuymentWorkflowSteps {
   buyTo: IWorkflowStepModel<BuyToModel>;
   buyReview: IWorkflowStepModel<BuyReviewModel>;
   buyAmount: IWorkflowStepModel<BuyAmountModel>;
   buyFor: IWorkflowStepModel<BuyForModel>;
}
export interface IBuyAccount {
   accountNumber: string;
   accountType: string;
}

export interface IBuyAmountRecurrence {
   reoccurrenceFrequency: string;
   reoccurrenceOccur: number;
   reoccSubFreqVal: string;
}

export interface IBuyAmountVm {
   startDate: Date;
   productCode: string;
   rechargeType: string;
   bundleType: string;
   amount: number;
   recurrenceFrequency: string;
   numRecurrence: string;
   repeatType?: string;
   endDate?: any;
   repeatDurationText?: string;
   repeatStatusText?: string;
   selectedAccount: IPrepaidAccountDetail;
   displayBundle?: String;
   accountNumberFromDashboard?: string;
}

export interface IBuyToVm {
   recipientName: string;
   mobileNumber: string;
   serviceProvider: string;
   serviceProviderName: string;
   beneficiaryID?: number;
   beneficiaryData?: models.IBeneficiaryData;
   isRecipientPicked?: boolean;
   isReadOnly?: boolean;
}

export interface IBuyReviewVm {
   isSaveBeneficiary: boolean;
}

export class BuyPrepaidDetail implements IBuyPrepaidDetail {
   transactionID?: string;
   startDate: string;
   amount: number;
   fromAccount: ITransferAccount;
   destinationNumber: string;
   myDescription: string;
   productCode: string;
   serviceProvider: string;
   favourite: boolean;
   isVoucherAmount: boolean;
   beneficiaryID?: number;
   reoccurrenceItem?: IReoccurenceModel;
}
export class ReoccurenceModel implements IReoccurenceModel {
   reoccurrenceFrequency: string;
   reoccurrenceOccur: Number;
   reoccSubFreqVal: string;
}

export interface IBuyForVm {
   yourReference: string;
   notificationType: string;
   notificationInput: string;
}
export class BuyPrepaidDetailWithGUID implements IBuyprepaidDetailsWithGUID {
   requestId: string;
   prepaids: IBuyPrepaidDetail[];
}
