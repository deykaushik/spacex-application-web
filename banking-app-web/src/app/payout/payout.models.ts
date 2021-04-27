import { IResultDetail } from '../core/services/models';

export interface IBuildingPayout {
   propertyAddress?: string;
   payOutType?: string;
   amount?: string;
   recipientName?: string;
   bank?: string;
   accountNumber?: string;
   contactType?: string;
   personName?: string;
   personContactNumber?: string;
   email?: string;
   accountId?: string;
}

export interface IBuildingRecipientDetail {
   recipientName: string;
   bankName: string;
   bankAccountNumber: string;
}
export interface IBuildingCustomerDetail {
   personName: string;
   personContactNumber: string;
   email: string;
}
export interface IBuildingLoanPayout {
   payOutType: string;
   contactTo: string;
   payOutAmount: number;
   isPayOutAmount?: boolean;
   buildingRecipientDetails: IBuildingRecipientDetail;
   buildingCustomerDetails: IBuildingCustomerDetail;
}
export interface IResultData {
   resultDetail: IResultDetail[];
}
export interface IMetaData {
   resultData: IResultData[];
}

