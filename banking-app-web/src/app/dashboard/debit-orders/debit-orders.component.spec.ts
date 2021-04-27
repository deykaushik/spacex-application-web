import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { DebitOrdersComponent } from './debit-orders.component';
import { ReverseOrderComponent } from './reverse-order/reverse-order.component';
import { ReverseOrderStatusComponent } from './reverse-order-status/reverse-order-status.component';
import { IDebitOrdersDetail, IMandateOrdersDetail, IDashboardAccount, IDebitOrder } from '../../core/services/models';
import { AccountService } from '../account.service';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SystemErrorService } from '../../core/services/system-services.service';

const mockMandateList: IMandateOrdersDetail[] = [{
   'DebtorName': 'STEPHEN LEVITT',
   'DebtorAccountNumber': '2131234',
   'CreditorName': 'MFC',
   'MandateInitiationDate': '2017-07-26 12:00:00 AM',
   'MandateStatus': 'Active',
   'MandateReferenceNumber': '0002201707260000001453',
   'MandateIdentifier': '0002201707260000001453',
   'ContractReference': '20170726122834',
   'InstalmentAmount': 2986.04,
   'MandateAuthenticationDate': '2017-07-26 12:00:00 AM'
}, {
   'DebtorName': 'STEPHEN LEVITT',
   'DebtorAccountNumber': '222222',
   'CreditorName': 'MFC',
   'MandateInitiationDate': '2017-07-26 12:00:00 AM',
   'MandateStatus': 'Pending',
   'MandateReferenceNumber': '0002201707260000001453',
   'MandateIdentifier': '0002201707260000001453',
   'ContractReference': '20170726122834',
   'InstalmentAmount': 2986.04,
   'MandateAuthenticationDate': '2017-07-26 12:00:00 AM'
}];
const mockAccountData: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0
}];
const mockdebitOrders: IDebitOrder[] = [{
   'itemAccountId': '2',
   'accountDebited': '1944082565',
   'chargeAmount': 55,
   'contractReferenceNr': ' ',
   'creditorName': 'OLDMUTCOL    19466228920180601',
   'debitOrderType': 'EXE',
   'disputed': false,
   'frequency': '2',
   'lastDebitDate': '2018-06-01T00:00:00',
   'statementDate': '2018-06-01T00:00:00',
   'statementLineNumber': 8,
   'statementNumber': 1017,
   'subTranCode': '00',
   'tranCode': '1424',
   'installmentAmount': 100
},
{
   'itemAccountId': '2',
   'creditorName': 'PREMIUMCOLTEST02DP RF12BQL5',
   'installmentAmount': 20,
   'accountDebited': '1001004221',
   'lastDebitDate': '2018-05-07T00:00:00',
   'frequency': '',
   'contractReferenceNr': ' ',
   'debitOrderType': 'EXE',
   'statementNumber': 1607,
   'statementLineNumber': 12,
   'statementDate': '2018-05-07T00:00:00',
   'tranCode': '1468',
   'chargeAmount': 55,
   'subTranCode': '00',
   'disputed': true
},
{
   'itemAccountId': '2',
   'creditorName': 'PREMIUMCOLTEST02DP RF12BQL5',
   'installmentAmount': 200,
   'accountDebited': '1001004221',
   'lastDebitDate': '2018-05-07T00:00:00',
   'frequency': '',
   'contractReferenceNr': ' ',
   'debitOrderType': 'EXE',
   'statementNumber': 1607,
   'statementLineNumber': 12,
   'statementDate': '2018-05-07T00:00:00',
   'tranCode': '1468',
   'chargeAmount': 55,
   'subTranCode': '00',
   'disputed': false
}];

const metadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const observerAccept = new BehaviorSubject(null);
const observerDecline = new BehaviorSubject(null);

const accountServiceStub = {
   getDebitOrders: jasmine.createSpy('getDebitOrders').and.returnValue(Observable.of([mockdebitOrders, mockMandateList])),
   AcceptMandateOrder: jasmine.createSpy('AcceptMandateOrder').and.returnValue(observerAccept),
   DeclineMandateOrder: jasmine.createSpy('DeclineMandateOrder').and.returnValue(observerDecline),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(true),
   isMandateSuccess: jasmine.createSpy('isTransactionStatusValid').and.returnValue(true),
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData[0])
};

describe('DebitOrdersComponent', () => {
   let component: DebitOrdersComponent;
   let fixture: ComponentFixture<DebitOrdersComponent>;
   let accountService: AccountService;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [NO_ERRORS_SCHEMA],
         imports: [RouterTestingModule, BrowserAnimationsModule, FormsModule],
         declarations: [DebitOrdersComponent, SkeletonLoaderPipe, ReverseOrderStatusComponent, ReverseOrderComponent,
            AmountTransformPipe],
         providers: [{ provide: AccountService, useValue: accountServiceStub }, SystemErrorService,
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 2 }), snapshot: {} } }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DebitOrdersComponent);
      router = TestBed.get(Router);
      component = fixture.componentInstance;
      accountService = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should show skeleton loading before actual data comes', () => {
      expect(component.accountId).toBe(2);
      expect(accountServiceStub.getDebitOrders).toHaveBeenCalled();
   });

   it('should handle empty data', () => {
      accountService.getDebitOrders = jasmine.createSpy('getDebitOrders').and
         .returnValue(Observable.of([null, null]));
      component.getExistingDebitOrders(2);
      expect(component.activeDebitOrders).toBeNull();
      expect(component.debitOrdersToApprove).toBeNull();
   });

   it('should handle MandateOverlay hide and show ', () => {
      component.hideMandateOverlay();
      expect(component.isMandateOverayVisible).toBeFalsy();
      component.showMandateOverlay(mockMandateList[0]);
      expect(component.isMandateOverayVisible).toBeTruthy();
   });
   it('should handle retry mandate', () => {
      component.onRetryMandate();
      expect(component.showMandateError).toBeUndefined();
   });

   it('should handle accept and decline pending mandate', () => {
      component.selectedMandateOrder = mockMandateList[0];
      component.DeclineMandateOrder();
      observerDecline.next({ metadata: metadata });
      expect(component.showMandateError).toBeTruthy();
      component.AcceptMandateOrder();
      observerAccept.next({ metadata: metadata });
      expect(component.showMandateError).toBeTruthy();
   });

   it('should handle accpet/decline failure', () => {
      component.selectedMandateOrder = mockMandateList[0];
      component.AcceptMandateOrder();
      observerAccept.error('failure');
      expect(component.showMandateError).toBeTruthy();
      component.DeclineMandateOrder();
      observerDecline.error('failure');
      expect(component.showMandateError).toBeTruthy();
   });
   it('should go to previous page i.e listing of debit order on click of < from details', () => {
      component.showDetailedDebitOrder = true;
      component.goToPreviousPage();
      expect(component.showDetailedDebitOrder).toBe(false);
   });
   it('should go to previous page i.e account details on click of < from listing', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.showDetailedDebitOrder = false;
      component.goToPreviousPage();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/2');
   });
   it('should open debit order details and set order info for the same', () => {
      component.showDebitOrderDetails(mockdebitOrders[0]);
      expect(component.selectedAccountDetails).toBe(mockdebitOrders[0]);
      expect(component.showDetailedDebitOrder).toBe(true);
   });
   it('should hide debit order details if action of reverse/cancel stop/stop was successful', () => {
      component.hideDetails(true);
      expect(component.showDetailedDebitOrder).toBe(false);
   });
   it('should not hide debit order details if action of reverse/cancel stop/stop failed', () => {
      component.hideDetails(false);
      expect(component.showDetailedDebitOrder).toBe(true);
   });

});

describe('DebitOrdersComponent', () => {
   let component: DebitOrdersComponent;
   let fixture: ComponentFixture<DebitOrdersComponent>;
   let accountService: AccountService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [NO_ERRORS_SCHEMA],
         imports: [RouterTestingModule, BrowserAnimationsModule, FormsModule],
         declarations: [DebitOrdersComponent, SkeletonLoaderPipe, ReverseOrderStatusComponent, ReverseOrderComponent,
            AmountTransformPipe],
         providers: [{ provide: AccountService, useValue: accountServiceStub }, SystemErrorService,
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '2' }), snapshot: {} } }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DebitOrdersComponent);
      component = fixture.componentInstance;
      accountService = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be created when there is no data in service', () => {
      accountServiceStub.getAccountData.and.returnValue(undefined);
      expect(component).toBeTruthy();
   });
});
