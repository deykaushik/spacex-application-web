import * as models from '../../core/services/models';
import { IAccountDetail } from '../../core/services/models';

export interface IQuickPayRecipient {
   beneficiaryID: number;
   beneficiaryName: string;
   bankName: string;
   accountNumber: number;
   accountType: string;
   beneficiaryReference: string;
   beneficiaryType: string;
   myReference: string;
   instantPaymentAvailable: boolean;
   branchCode: string;
   bankCode: string;
}

export interface IQuickPayWorkFlowSteps {
   payAmount: boolean;
   payReview: boolean;
   payStatus: boolean;
}
