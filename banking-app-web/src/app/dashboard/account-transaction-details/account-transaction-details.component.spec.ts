import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../test-util';
import { AccountTransactionDetailsComponent } from './account-transaction-details.component';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { LocaleDatePipe } from './../../shared/pipes/locale-date.pipe';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { AccountService } from '../account.service';
import { Observable } from 'rxjs/Observable';
import {
   ITransactionData, ITransactionDetail, ITransactionDetailIS, ITypeDataTransactionData,
   IDashboardAccount
} from '../../core/services/models';
import { Constants } from '../../core/utils/constants';

const successMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Transaction Details',
               result: 'R00',
               status: 'SUCCESS',
               reason: 'Successful'
            }
         ]
      }
   ]
};

const failureMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Transaction Details',
               result: 'R06',
               status: 'Failure',
               reason: ''
            }
         ]
      }
   ]
};

const mockTransactionDetails: ITransactionData = {
   AccountNumber: '1944122702',
   TransactionType: 'Payment (Debit Order)',
   TransactionDescription: 'INSURECASH4000545980-133708320',
   TransactionAmount: 37.8,
   TransactionDate: '2017-12-08T00:00:00',
   ReferenceNumber: '6031171208023792',
   ErrorCode: 'R00',
   TransactionId: null,
   Description: null,
   Amount: null,
   Debit: false,
   Account: '1944122702',
   PostedDate: '2017-12-08T00:00:00',
   CategoryId: null,
   ChildTransactions: [],
   OriginalCategoryId: null,
   RunningBalance: null,
   TypeData: {
      type: 'Payment (Debit Order)',
      data: {}
   }
};

const mockTransactionWithoutTransId: ITransactionData = {
   Account: '1944122702',
   Amount: 60,
   CategoryId: 0,
   Currency: null,
   ChildTransactions: [],
   Debit: true,
   Description: 'iMali - 11 Dec',
   OriginalCategoryId: null,
   PostedDate: '2017-12-11 12:00:00 AM',
   RunningBalance: 2631865.14,
   StatementDate: '2017-11-16T00:00:00',
   StatementLineNumber: 18,
   StatementNumber: 694,
   TransactionId: null,
   AccountNumber: undefined,
   TransactionType: undefined,
   TransactionDescription: undefined,
   TransactionAmount: undefined,
   TransactionDate: undefined,
   ReferenceNumber: undefined,
   ErrorCode: undefined,
   TypeData: undefined
};

const transactionWithTransactionId: ITransactionData = {
   Account: '1944122702',
   Amount: 60,
   CategoryId: 0,
   Currency: null,
   ChildTransactions: [],
   Debit: true,
   Description: 'iMali - 11 Dec',
   OriginalCategoryId: null,
   PostedDate: '2017-12-11 12:00:00 AM',
   RunningBalance: 2631865.14,
   StatementDate: '2017-11-16T00:00:00',
   StatementLineNumber: 18,
   StatementNumber: 694,
   TransactionId: 'CPS|Item1|6096fdd3-e2ce-56bd-9772-d3f5d9d19b98',
   AccountNumber: '1944122702',
   TransactionType: 'Payment (Debit Order)',
   TransactionDescription: 'INSURECASH4000545980-133708320',
   TransactionAmount: 37.8,
   TransactionDate: '2017-12-08T00:00:00',
   ReferenceNumber: '6031171208023792',
   ErrorCode: 'R00',
   TypeData: {
      type: 'Payment (Debit Order)',
      data: {}
   }
};

const mockTransactionDetailsApiSuccessResponse: ITransactionDetailIS = {
   data: mockTransactionDetails,
   metadata: successMetadata
};

const mockTransactionDetailsApiFailureResponse: ITransactionDetailIS = {
   metadata: failureMetadata
};

const accountServiceStub = {
   getTransactionDetails: jasmine.createSpy('getTransactionDetails')
      .and.returnValue(Observable.of(mockTransactionDetailsApiSuccessResponse)),
   getTransactionDetailsFailure: Observable.of(mockTransactionDetailsApiFailureResponse)
};

describe('AccountTransactionDetailsComponent', () => {
   let component: AccountTransactionDetailsComponent;
   let fixture: ComponentFixture<AccountTransactionDetailsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [AccountTransactionDetailsComponent, AmountTransformPipe, LocaleDatePipe, SkeletonLoaderPipe],
         providers: [{ provide: AccountService, useValue: accountServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountTransactionDetailsComponent);
      component = fixture.componentInstance;
      component.transaction = transactionWithTransactionId;
      component.visibleTransactionDetails = undefined;
      component.index = 0;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should create close transaction details section', () => {
      component.closeTransactionDetails();
      fixture.detectChanges();
      component.onCloseClicked.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });

   it('should populate transaction details for api call failure metadata', () => {
      accountServiceStub.getTransactionDetails.and.returnValue(accountServiceStub.getTransactionDetailsFailure);
      component.setSelectedTransactionDetail();
      expect(component.transaction.TransactionId).toBe('CPS|Item1|6096fdd3-e2ce-56bd-9772-d3f5d9d19b98');
      expect(component.visibleTransactionDetails).toEqual(component.transaction);
   });

   it('should populate transaction details without transaction ID', () => {
      component.transaction = mockTransactionWithoutTransId;
      component.setSelectedTransactionDetail();
      expect(component.visibleTransactionDetails).toEqual(mockTransactionWithoutTransId);
   });

   it('should not have decimal for rewards', () => {
      component.accountType = Constants.labels.dashboardRewardsAccountTitle;
      component.ngOnInit();
      expect(component.amountPipeConfig).toEqual({ noDecimal: true });
   });

   it('should have proper amountPipeConfig for account types other than rewards', () => {
      const amountWithLabelAndSign = Constants.amountPipeSettings.amountWithLabelAndSign;
      component.accountType = 'SA';
      component.ngOnInit();
      expect(component.amountPipeConfig).toEqual(amountWithLabelAndSign);
   });

   it('should provide the correct game type', () => {
      expect(component.getGameType(Constants.transactionDetailsLabels.gameTypeTitles.lot)).toEqual('Lotto');
      expect(component.getGameType('PWB')).toEqual('Powerball');
   });

   it('should set the correct transaction details for respective types', () => {
      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.EFTDepo;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('stopOrderEftDebitOrderInternal');

      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.EFTTran;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('stopOrderEftDebitOrderInternal');

      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.EFTPay;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('stopOrderEftDebitOrderInternal');

      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.STO;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('stopOrderEftDebitOrderInternal');

      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.DOI;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('stopOrderEftDebitOrderInternal');

      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.IMA;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('iMaliTemplate');

      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.LOT;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('lottoTemplate');

      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.PPE;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('prepaidElectricityTemplate');

      component.transaction.TransactionType = Constants.transactionDetailsLabels.transactionTypeConstants.PPP;
      component.setTransactionDetails(component.transaction);
      expect(component.setTransactionDetailsView).toEqual('prepaidAirtimeTemplate');
   });

});
