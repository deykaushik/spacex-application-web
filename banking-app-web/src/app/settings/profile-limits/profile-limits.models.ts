import { IDatePickerConfig } from 'ng2-date-picker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ISecureTransaction, ILimitDetail, IChangedLimitDetail } from '../../core/services/models';

export interface ILimitWidgetModel {
   type: string;
   headerText: string;
   limitTypeSelected: string;
   displayLimit: number;
   limitStartDate?: string;
   limitEndDate?: Moment;
   minEndDate?: Moment;
   maxEndDate?: Moment;
   calendarConfig?: IDatePickerConfig;
   expiresOn?: string;
}

export class LimitDetail {
   newLimit: number;
   isTemp: string;
   transactionID?: string;
   secureTransaction?: ISecureTransaction;
   limitType?: string;
   tempLimitEnd?: string;
   isTempLimit?: boolean;
}
export interface IPartialLimitFailure {
   limitDetail: ILimitDetail;
   reason: string;
}
export interface IFailureLimits {
   limittype?: string;
   status?: string;
   reason?: string;
}
export class PartialLimit implements IPartialLimitFailure {
   limitDetail: ILimitDetail;
   reason: string;
}
export interface ILimitsList {
   limitDetail: IChangedLimitDetail[];
}
export class LimitsList implements ILimitsList {
   limitDetail: IChangedLimitDetail[];
}
export interface ILimitTypes {
   limitType: string;
   isTempLimit: boolean;
}

