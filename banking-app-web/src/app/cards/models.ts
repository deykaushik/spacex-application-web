export interface ICardBlockMetadata {
   ResultCode: string;
   Message: string;
   InvalidFieldList: any;
   result: ICardBlockApiResult;
}

export interface ICardBlockApiResult {
   resultCode: number;
   resultMessage: string;
}

export interface ICardBlockResponse {
   Data: any;
   MetaData: ICardBlockMetadata;
}

export interface ICardLimitInfo {
  camsAtmCashLimit: number;
  camsDailyAtmCash: number;
}

export interface ICardLimitResponse {
   Data: ICardLimitInfo;
}

export interface ICardBlockResult {
   plasticId?: number;
   cardNumber: string;
   reason: string;
   success: boolean;
}
export interface ICardLimitUpdateResult {
   isLimitUpdated: boolean;
   oldLimit: number;
   newLimit: number;
   cardNumber: string;
   accountId?: string;
   DCIndicator?: string;
   plasticId?: number;
   camsDailyAtmCash?: number;
}

export interface ICardBlockInfo {
   plasticId: number;
   cardNumber: string;
   reason: string;
   cardType?: string;
}

export interface ICardReplaceInfo extends ICardBlockInfo {
   cardType: string;
   branchCode: string;
   branchName: string;
   allowBranch?: boolean;
}

export interface ICardReplaceResponse extends ICardBlockResponse {
   Data: any;
   MetaData: ICardBlockMetadata;
}

export interface ICardReplaceResult {
   cardNumber?: string;
   reason?: string;
   cardType?: string;
   branchCode?: string;
   success: boolean;
   branchName: string;
   plasticId?: number;
}

export interface ICardActionListsData {
   action: string;
   result?: boolean;
}

export interface ICardActionListsresultDetail {
   operationReference: string;
   result: string;
   status: string;
   reason: string;
}

export interface ICardActionLists {
   data: ICardActionListsData[];
   metadata: {
      resultData: [{
         resultDetail: ICardActionListsresultDetail[];
      }]
   };
}

export interface IStatusWarning {
  header: string;
  title: string;
  subTitle: string;
  type: string;
  typeParam: string;
  value: boolean;
}

export interface ICardUpdateActionListData {
  action: string;
  result: boolean;
  plasticId: number;
  eventSuccessful: boolean;
}

export interface ICardActionListsData {
   action: string;
   result?: boolean;
}

export interface ICardActionListsresultDetail {
   operationReference: string;
   result: string;
   status: string;
   reason: string;
}

export interface ICardActionLists {
   data: ICardActionListsData[];
   metadata: {
      resultData: [{
         resultDetail: ICardActionListsresultDetail[];
      }]
   };
}

export interface IStatusWarning {
  header: string;
  title: string;
  subTitle: string;
  type: string;
  typeParam: string;
  value: boolean;
}

export interface ICardUpdateActionListData {
  action: string;
  result: boolean;
  plasticId: number;
  eventSuccessful: boolean;
}
