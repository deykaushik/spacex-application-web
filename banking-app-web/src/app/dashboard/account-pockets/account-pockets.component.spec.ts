import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountPocketsComponent } from './account-pockets.component';
import { ITransactionDetail } from '../../core/services/models';

const mockAccountTransactions: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 28000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-26 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}, {
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 9000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-27 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 10000
}];

const mockAccountTransactionsLessSpaced: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 28000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-26 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}, {
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 9000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-26 04:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 10000
}, {
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 9000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-26 06:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 10000
}];

const mockAccountSkeletonData: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: null,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2115-09-26 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}];

const pastDateTransactions: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 28000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2016-5-26 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}, {
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 9000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-10-27 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 10000
}];
