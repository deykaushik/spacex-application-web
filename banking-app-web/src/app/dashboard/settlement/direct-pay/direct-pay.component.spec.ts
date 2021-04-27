import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { AccountService } from '../../../dashboard/account.service';
import { PreFillService } from '../../../core/services/preFill.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { DirectPayComponent } from './direct-pay.component';
import { IAccountDetail, ISettlementDetail, IDashboardAccount, IPrepaidAccountDetail } from '../../../core/services/models';

const mockSATransferAccounts: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '2001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'SA',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
}];

const mockCCTransferAccounts: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '3001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'CC',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
}];

const mockNonTransferAccounts: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '1001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'HL',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
}];

const mockTransferAccounts: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '1001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'CA',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
},
{
   itemAccountId: '2',
   accountNumber: '1001004346',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'SA',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
},
{
   itemAccountId: '3',
   accountNumber: '1001004347',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'HL',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
}];

const accountToTransfer: IDashboardAccount = {
   AccountName: 'Inv CA0',
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
   ItemAccountId: '1',
   InterestRate: 0,
   settlementAmt: 100
};


const mockSettlementData: ISettlementDetail = {
   settlementAmt: 100,
   settlementDate: '01-01-0001',
   accountToTransfer: accountToTransfer,
   loanAccountNumber: 71130770001
};

const mockPaymentAccounts: IPrepaidAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '1001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'CA',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 42250354156.29,
   currentBalance: 42250482237.21,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
}];

const mockAccountData: IDashboardAccount = {
   AccountName: 'MFC SL',
   Balance: 1000.00,
   AvailableBalance: 900.00,
   AccountNumber: 1009017640,
   AccountType: 'IS',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
};

const accountServiceStub = {
   getTransferAccounts: jasmine.createSpy('getTransferAccounts').and.returnValue(Observable.of(mockTransferAccounts)),
   getSettlementData: jasmine.createSpy('getSettlementData').and.returnValue(mockSettlementData),
   setSettlementData: jasmine.createSpy('setSettlementData'),
   getPaymentAccounts: jasmine.createSpy('getPaymentAccounts').and.returnValue(Observable.of(mockPaymentAccounts)),
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData)
};

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const preFillServiceStub = new PreFillService();
preFillServiceStub.settlementDetail = mockSettlementData;

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const mockCADormantAccount: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '1001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'CA',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: false,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
}];

describe('DirectPayComponent', () => {
   let component: DirectPayComponent;
   let fixture: ComponentFixture<DirectPayComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [DirectPayComponent, AmountTransformPipe],
         providers: [{ provide: AccountService, useValue: accountServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }), snapshot: {} } },
         { provide: PreFillService, useValue: preFillServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }],
         schemas: [NO_ERRORS_SCHEMA],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DirectPayComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should close overlay and navigate to account detail', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.isHlSettlement = false;
      component.isMFCSettlement = false;
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/1');
   });

   it('should show transfer now overlay for pl settlement', () => {
      component.isMFCSettlement = false;
      component.isHlSettlement = false;
      component.showTransferNow();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.transferNowTemplate);
   });

   it('should show other payment modes overlay', () => {
      component.showOtherPaymentModes();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.otherPaymentModesTemplate);
   });

   it('should show terms overlay', () => {
      component.showTerms();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.termsTemplate);
   });

   it('should show quote overlay', () => {
      component.showQuote();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.settlementQuoteTemplate);
   });

   it('should close the terms overlay', () => {
      component.onTermsClose(true);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.directPayTemplate);
   });

   it('should close the payment mode overlay', () => {
      component.onOtherPaymentModesClose(true);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.directPayTemplate);
   });

   it('should close the transfer now overlay', () => {
      component.onTransferNowClose(true);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.directPayTemplate);
   });

   it('should close the quote overlay', () => {
      component.onQuoteClose(true);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.directPayTemplate);
   });

   it('should not show transfer option if transfer accounts api response has empty response', () => {
      accountServiceStub.getTransferAccounts.and.returnValue(Observable.of([]));
      component.findFromCASAAccounts();
      expect(component.allowTransfer).toBe(false);
   });

   it('should not show tranfer option if transferable accounts are not found', () => {
      accountServiceStub.getTransferAccounts.and.returnValue(Observable.of(mockNonTransferAccounts));
      component.findFromCASAAccounts();
      expect(component.allowTransfer).toBe(false);
   });

   it('should show transfer option for saving from account', () => {
      accountServiceStub.getTransferAccounts.and.returnValue(Observable.of(mockSATransferAccounts));
      component.findFromCASAAccounts();
      expect(component.allowTransfer).toBe(true);
   });

   it('should not show transfer option for credit card from account', () => {
      accountServiceStub.getTransferAccounts.and.returnValue(Observable.of(mockCCTransferAccounts));
      component.findFromCASAAccounts();
      expect(component.allowTransfer).toBe(false);
   });

   it('should not show transfer option for an error', () => {
      accountServiceStub.getTransferAccounts.and.returnValue(mockAccountServiceError);
      component.findFromCASAAccounts();
      expect(component.allowTransfer).toBe(false);
   });

   it('should not show transfer option for dormant CA account', () => {
      accountServiceStub.getTransferAccounts.and.returnValue(Observable.of(mockCADormantAccount));
      component.findFromCASAAccounts();
      expect(component.allowTransfer).toBe(false);
   });

   it('should show settlement request for MFC loans', () => {
      component.accountType = 'IS';
      component.ngOnInit();
      expect(component.isMFCSettlement).toBe(true);
   });

   it('should navigate to Pay for MFC settlement', () => {
      component.isMFCSettlement = true;
      component.settlementDetails = mockSettlementData;
      const spy = spyOn(router, 'navigateByUrl');
      component.showTransferNow();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/payment');
   });

   it('should close overlay only', () => {
      component.accountType = 'IS';
      spyOn(component.onClose, 'emit');
      component.closeOverlay();
      expect(component.isOverlayVisible).toBe(false);
      expect(component.onClose.emit).toHaveBeenCalledWith(true);
   });

   it('should not show payment option for an API error', () => {
      accountServiceStub.getPaymentAccounts.and.returnValue(mockAccountServiceError);
      component.findPayAccounts();
      expect(component.allowTransfer).toBe(false);
   });

   it('should not show payment option If there are no accounts in response', () => {
      accountServiceStub.getPaymentAccounts.and.returnValue(Observable.of([]));
      component.findPayAccounts();
      expect(component.allowTransfer).toBe(false);
   });

   it('should show settlement request for pl loans', () => {
      mockAccountData.AccountType = 'PL';
      accountServiceStub.getAccountData.and.returnValue(mockAccountData);
      component.ngOnInit();
      expect(component.isPlSettlement).toBe(true);
   });

   it('should show settlement request for pl loans', () => {
      mockAccountData.AccountType = 'HL';
      accountServiceStub.getAccountData.and.returnValue(mockAccountData);
      component.ngOnInit();
      expect(component.isHlSettlement).toBe(true);
   });

   it('should navigate to Transfer for HL settlement', () => {
      component.isHlSettlement = true;
      const spy = spyOn(router, 'navigateByUrl');
      component.showTransferNow();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/transfer');
   });

});
