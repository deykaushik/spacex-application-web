import { PayAmountModel } from './pay-amount/pay-amount.model';
import { PayForModel } from './pay-for/pay-for.model';
import { PayToModel } from './pay-to/pay-to.model';
import { PayReviewModel } from './pay-review/pay-review.model';

import * as models from '../core/services/models';
import { IWorkflowStepModel } from '../shared/components/work-flow/work-flow.models';
import {
   IBank, IBranch, IBeneficiaryData, IContactCardNotification,
   IPaymentReason
} from './../core/services/models';

export enum PaymentStep {
   payTo = 1,
   payAmount = 2,
   payFor = 3,
   review = 4,
   success = 5
}

export interface IPaymentWorkflowSteps {
   payAmount: IWorkflowStepModel<PayAmountModel>;
   payFor: IWorkflowStepModel<PayForModel>;
   payTo: IWorkflowStepModel<PayToModel>;
   payReview: IWorkflowStepModel<PayReviewModel>;
}

export interface IPayAmountVm {
   isInstantPay: boolean;
   isTransferLimitExceeded: boolean;
   isValid: boolean;
   availableTransferLimit: number;
   allowedTransferLimit: number;
   transferAmount: number;
   selectedAccount?: models.IAccountDetail;
   paymentDate: Date;
   recurrenceFrequency: string;
   numRecurrence?: number;
   reccurenceDay: number;
   repeatType?: string;
   endDate?: any;
   repeatDurationText?: string;
   repeatStatusText?: string;
   accountFromDashboard?: string;
   crossBorderPaymentAmount?: string;
   beneficiaryAmount?: string;
   paymentExchangeRate?: string;
   remittanceCharge?: string;
   totalPaymentAmount?: string;
   beneficiaryCurrency?: string;
   selectedCurrency?: string;
   availableInstantTransferLimit?: number;
}

export interface IPayForVm {
   yourReference: string;
   theirReference: string;
   notificationInput: string;
   notification: any;
   contactCardNotifications?: IContactCardNotification[];
   paymentReason?: IPaymentReason;
   crossBorderSmsNotificationInput?: string;
}

export interface IPayToVm {
   recipientName: string;
   accountNumber: string;
   bankName: string;
   branchName: string;
   mobileNumber: string;
   bank?: IBank;
   branch?: IBranch;
   accountType: string;
   accountTypeName?: string;
   beneficiaryData?: IBeneficiaryData;
   isRecipientPicked?: boolean;
   isShowBankName?: boolean;
   isReadOnly?: boolean;
   paymentType: number;
   creditCardNumber: string;
   isCrossBorderPaymentActive: boolean; // user selected foreign pay option
   crossBorderPayment?: ICrossBorderVm; // crossborder payment vm
   isCrossBorderAllowed?: boolean; // permission from environment
   isCrossBorderPaymentServiceAvailable?: boolean; // service availability status
   isRecipientValid?: boolean;
   banks?: IBank[];
}

export interface ICrossBorderVm {
   country?: ICrossBorderCountry;
   bank: ICrossBorderBank;
   personalDetails?: ICrossBorderRecipientDetails;
   beneficiaryDetails?: ICrossBorderBeneficiaryDetails;
}

interface ICrossBorderBeneficiaryDetails {
   beneficiaryAccountName: string;
   beneficiaryAccountStatus?: string;
   beneficiaryAccountType?: string;
   beneficiaryCurrency?: string;
   checkReference?: string;
   transactionID?: string;
   residentialStatus?: string;
}
export interface ICrossBorderCountry {
   countryName: string;
   code: string;
}

export interface ICrossBorderBank {
   bankName: string;
   accountNumber: string;
}

export interface ICrossBorderRecipientDetails {
   gender?: string;
   idPassportNumber: string;
   recipientMobileNo: string;
   recipientAddress: string;
   recipientCityVillage: string;
   recipientStateProvince: string;
   recipientZip: string;
}

export interface IPayReviewVm {
   isSaveBeneficiary: boolean;
}

export class PaymentDetail implements models.IPaymentDetail {
   transactionID?: string;
   startDate: string;
   bFName?: string;
   bank?: string;
   beneficiaryID?: string;
   sortCode?: string;
   myDescription: string;
   beneficiaryDescription?: string;
   amount: number;
   instantPayment?: boolean;
   nextTransDate?: string;
   favourite?: boolean;
   fromAccount: models.IPaymentAccount;
   toAccount?: models.IPaymentAccount;
   notificationDetail?: models.IPaymentNotification;
   saveBeneficiary?: boolean;
   destinationNumber?: string;
   isVoucherAmount?: boolean;
}
export class PaymentDetailWithGUID implements models.IPaymentDetailWithGUID {
   requestId: string;
   payments: models.IPaymentDetail[];
}

export class PrepaidDetailWithGUID implements models.IPrepaidDetailWithGUID {
   requestId: string;
   prepaids: models.IPaymentDetail[];
}
