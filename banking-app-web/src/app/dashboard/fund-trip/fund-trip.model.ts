import { GetQuoteModel } from './get-quote/get-quote.model';
import { PaymentDetailsModel } from './payment-details/payment-details.model';
import { ReviewPaymentModel } from './review-payment/review-payment.model';

import * as models from '../../core/services/models';
import { IWorkflowStepModel } from '../../shared/components/work-flow/work-flow.models';
import { ITransferAccount, IAccountDetail, IPurchaseAccount } from '../../core/services/models';

export enum FundTripStep {
   getQuote = 1,
   paymentDetails = 2,
   reviewPayment = 3,
   success = 4
}

export interface IFundTripWorkflowSteps {
   getQuote: IWorkflowStepModel<GetQuoteModel>;
   paymentDetails: IWorkflowStepModel<PaymentDetailsModel>;
   reviewPayment: IWorkflowStepModel<ReviewPaymentModel>;
}

export interface ICurrency {
   ccycde: string;
   ccyname: string;
   Ccyno: number;
   Multydivind: string;
   Decimalpoints: number;
}

export interface IGetQuoteVm {
   currency: ICurrency;
   fromCurrencyValue: number;
   toCurrencyValue: string;
   clientDetails?: IClientDetails;
   quotationReference?: string;
}

export interface IPaymentDetailsVm {
   amount: number;
   toAccount: IAccountDetail;
   reference: string;
}

export interface IAmount {
   currency: string;
   amount: number;
}

export interface IPaymentReviewVm {
   isPaymentSuccessful: boolean;
   cardNumber: number;
   transactionReference: string;
   transferDate: string;
   totalAmount: IAmount;
   senderReference: string;
}

export interface IConversionRate {
   exchangeRate: number;
   commisionCharge: number;
   sellCurrencyAmount: number;
}

export interface IClientDetails {
   email: string;
   passportNumber: number;
   rsaId: string;
   areaCode: number;
   phoneNumber: number;
   floor: string;
   building: string;
   streetNumber: number;
   streetName: string;
   suburb: string;
   city: string;
   postalCode: number;
   fromAccount?: IPurchaseAccount;
   transactionReference: string;
}

export interface IConversionFilterCOnversionRate {
   currencies: ISingleCurrency[];
   activeTripReference?: string;
   futureTripReference?: string;
}
export interface IBuyCurrency {
   currency: string;
   amount: number;
}
export interface ISingleCurrency {
   buyCurrency: IBuyCurrency;
   sellCurrency: IBuyCurrency;
}
export interface IOperatingHour {
   dayOfWeek: string;
   startTime: string;
   endTime: string;
}
