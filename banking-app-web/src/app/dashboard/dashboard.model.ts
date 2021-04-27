import * as models from '../core/services/models';
import { IScheduledTransactionType } from '../core/services/models';

export interface IDashboardVm {
   accounts: models.IDashboardAccounts;
}

export interface IAccountConfig {
   type: string;
   title: string;
   currentBalance: string;
   availableBalance: string;
   settlementAmount?: string;
   outstandingBalance?: string;
   balanaceNotPaid?: string;
   interimInterest?: string;
   registeredAmount?: string;
}

export interface ISchedulePaymentConatiner {
   totalAmount: number;
   data: IScheduledTransactionType[];
   month: string;
   totalTransaction: number;
}
export interface INotification {
   message: string;
   type: string;
}
