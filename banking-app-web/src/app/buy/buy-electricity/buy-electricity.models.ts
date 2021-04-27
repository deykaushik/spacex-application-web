import { BuyElectricityToModel } from './buy-electricity-to/buy-electricity-to.model';
import { BuyElectricityReviewModel } from './buy-electricity-review/buy-electricity-review.model';
import { BuyElectricityAmountModel } from './buy-electricity-amount/buy-electricity-amount.model';

import * as models from '../../core/services/models';
import { IWorkflowStepModel } from '../../shared/components/work-flow/work-flow.models';
import {
   IBuyElectricityAccountDetail,
   IBuyElectricityMeterValidationDetails,
   IBuyElectricityDetail,
   ITransferAccount,
   IBank,
   IBranch,
   IPaymentNotification,
   IBuyElectricityDetailWithGUID,
   IBuyElectricityMeterValidationDetailsWithGUID
} from '../../core/services/models';

import { BuyElectricityForModel } from './buy-electricity-for/buy-electricity-for.model';


export enum BuyElectricityStep {
   buyTo = 1,
   buyAmount = 2,
   buyFor = 3,
   review = 4,
   success = 5
}

export interface IBuyElectricityWorkflowSteps {
   buyTo: IWorkflowStepModel<BuyElectricityToModel>;
   buyAmount: IWorkflowStepModel<BuyElectricityAmountModel>;
   buyFor: IWorkflowStepModel<BuyElectricityForModel>;
   buyReview: IWorkflowStepModel<BuyElectricityReviewModel>;
}
export interface IBuyElectricityAccount {
   accountNumber: string;
   accountType: string;
}

export class BuyElectricityDetail implements IBuyElectricityDetail {
   transactionID?: string;
   fbeTransactionId?: string;
   startDate: string;
   amount: number;
   fromAccount: ITransferAccount;
   destinationNumber: string;
   myDescription: string;
   productCode: string;
   serviceProvider: string;
   beneficiaryID?: number;
   errorMessage?: string;
   saveBeneficiary?: boolean;
   bFName?: string;
   notificationDetails?: IPaymentNotification[];
}

export class BuyElectricityDetailWithGUID implements IBuyElectricityDetailWithGUID {
   requestId: string;
   prepaids: IBuyElectricityDetail[];
}
export class BuyElectricityMeterValidationDetails implements IBuyElectricityMeterValidationDetails {
   destinationNumber: string;
   productCode: string;
   serviceProvider: string;
}
export class BuyElectricityMeterValidationDetailsWithGUID implements IBuyElectricityMeterValidationDetailsWithGUID {
   requestId: string;
   prepaids: IBuyElectricityMeterValidationDetails[];
}
export class BuyFromAccount {
   accountNumber: string;
   constructor(accountNumber) {
      this.accountNumber = accountNumber;
   }
}
export class BuyElectricityAmountInArrearsDetails {
   destinationNumber: string;
   productCode: string;
   serviceProvider: string;
   amount: number;
   fromAccount: BuyFromAccount;
}

export class BuyElectricityAmountInArrearsDetailsWithGUID {
   requestId: string;
   prepaids: BuyElectricityAmountInArrearsDetails[];
}
export interface IBuyElectricityToVm {
   recipientName: string;
   meterNumber: string;
   serviceProvider: string;
   productCode: string;
   isVmValid: boolean;
   beneficiaryID?: number;
   fbeElectricityUnits?: number;
   fbeClaimedDate?: Date;
   fbeTransactionID?: string;
   fbeRecipientName?: string;
   beneficiaryData?: models.IBeneficiaryData;
   isRecipientPicked?: boolean;
   isReadOnly?: boolean;
}

export interface IBuyElectricityAmountVm {
   startDate: Date;
   amount: number;
   electricityAmountInArrears?: number;
   selectedAccount?: IBuyElectricityAccountDetail;
   fbeElectricityUnits?: number;
   fbeTransactionID?: string;
   errorMessage?: string;
   accountNumberFromDashboard?: string;
}

export interface IBuyElectricityForVm {
   yourReference: string;
   notificationType: string;
   notificationInput: string;
   lastTshwanValidateNo?: String;
   lastTshwanValidateAmount?: number;
}

export interface IBuyElectricityReviewVm {
   isSaveBeneficiary: boolean;
}


