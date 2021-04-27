import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from './../../../test-util';
import { AccountService } from './../../account.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { RequestQuoteComponent } from './request-quote.component';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { HighlightPipe } from './../../../shared/pipes/highlight.pipe';
import { IDashboardAccount, ISettlementDetail, IApiResponse, ITransactionMetaData } from '../../../core/services/models';
import { ISettlementNotificationTypes } from '../../../core/utils/enums';

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

const mockSuccessMetadata: ITransactionMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Settlement Quote',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const mockFailureMetadataWithRO4Status: ITransactionMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Settlement Quote',
               result: 'R04',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const mockFailureMetadataWithRO2Status: ITransactionMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Settlement Quote',
               result: 'R02',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const mockFailureMetadataWithStatus: ITransactionMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Settlement Quote',
               result: '',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const mockSettlementDetails: ISettlementDetail = {
   settlementAmt: 500.00,
   settlementDate: '01-01-2018'
};

const mockMFCSettlementDetails: ISettlementDetail = {
   settlementAmt: 200.00,
   settlementDate: '01-01-2018',
   loanSettled: true
};

const mockHLSettlementDetails: ISettlementDetail = {
   settlementAmt: 100.00,
   settlementDate: '7-12-2019',
   quoteRequestedOn: '07-08-2018',
   quoteValidUntil: '07-14-2018'
};

const mockSettlementSuccessResponse: IApiResponse = {
   data: mockSettlementDetails,
   metadata: mockSuccessMetadata
};

const mockMFCSettlementSuccessResponse: IApiResponse = {
   data: mockMFCSettlementDetails,
   metadata: mockSuccessMetadata
};

const mockMFCSettlementFailureR04Response: IApiResponse = {
   data: mockMFCSettlementDetails,
   metadata: mockFailureMetadataWithRO4Status
};

const mockMFCSettlementFailureR02Response: IApiResponse = {
   data: mockMFCSettlementDetails,
   metadata: mockFailureMetadataWithRO2Status
};

const mockMFCSettlementFailureResponse: IApiResponse = {
   data: mockMFCSettlementDetails,
   metadata: mockFailureMetadataWithStatus
};

const mockHLSettlementSuccessResponse: IApiResponse = {
   data: mockHLSettlementDetails,
   metadata: mockSuccessMetadata
};


const mockHLAccountData: any = {
   AccountName: 'HL',
   Balance: 1000.00,
   AvailableBalance: 900.00,
   AccountNumber: 8009017640,
   AccountType: 'HL',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0,
   accountHolderName: 'MISS',
   loanDescription: 'Loan Desc',
   isJointBond: false
};

const mockPLAccountData: IDashboardAccount = {
   AccountName: 'PL',
   Balance: 1000.00,
   AvailableBalance: 900.00,
   AccountNumber: 8009017640,
   AccountType: 'PL',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '3',
   InterestRate: 0
};


const accountServiceStub = {
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData),
   getSettlementDetails: jasmine.createSpy('getSettlementDetails').and.returnValue(Observable.of(mockSettlementSuccessResponse)),
   setSettlementData: jasmine.createSpy('setSettlementData').and.returnValue(null),
};

const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(Observable.of(null)),
   hideError: jasmine.createSpy('hideError').and.returnValue(Observable.of(null)),
   getError: jasmine.createSpy('getError').and.returnValue(Observable.of({ error: new Error('error') }))
};

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const notificationTypes = ISettlementNotificationTypes;

describe('RequestQuoteComponent', () => {
   let component: RequestQuoteComponent;
   let fixture: ComponentFixture<RequestQuoteComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [RequestQuoteComponent, AmountTransformPipe, HighlightPipe],
         providers: [{ provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }), snapshot: {} } },
                     { provide: AccountService, useValue: accountServiceStub },
                     { provide: SystemErrorService, useValue: systemErrorServiceStub },
                     { provide: GaTrackingService, useValue: gaTrackingServiceStub }],
         schemas: [NO_ERRORS_SCHEMA],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RequestQuoteComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
      expect(component.accountId).toBe('1');
   });

   it('should close overlay and navigate to account detail', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(component.isOverlayVisible).toBe(false);
      expect(url).toBe('/dashboard/account/detail/1');
   });

   it('should show settle email quote overlay', () => {
      component.showQuote();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.settlementQuoteEmailTemplate);
   });

   it('should show settle terms overlay', () => {
      component.showTerms();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.termsTemplate);
   });

   it('should show settle loan overlay', () => {
      component.showSettleLoan();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.directPayTemplate);
   });

   it('should show HL settle loan overlay', () => {
      component.isMFCSettlementQuote = false;
      component.isHLSettlementQuote = true;
      component.showSettleLoan();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.directPayTemplate);
   });

   it('should show settle loan status overlay', () => {
      component.showSettlementStatus();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.settlementStatus);
   });

   it('should close the settlemet email quote overlay', () => {
      component.onEmailQuoteClose(true);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.settlementQuoteTemplate);
   });

   it('should close the settlemet terms overlay', () => {
      component.onTermsClose(true);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.settlementQuoteTemplate);
   });

   it('should close the settlemet pay overlay', () => {
      component.onDirectPayClose(true);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.settlementQuoteTemplate);
   });

   it('should show technical error for an API error', () => {
      accountServiceStub.getSettlementDetails.and.returnValue(mockAccountServiceError);
      component.getSettlementDetails();
      expect(component.settlementQuoteStatus).toBe(notificationTypes.TechnicalError);
   });

   it('should show loan closure screen', () => {
      accountServiceStub.getSettlementDetails.and.returnValue(Observable.of(mockMFCSettlementSuccessResponse));
      component.getSettlementDetails();
      expect(component.settlementQuoteStatus).toBe(notificationTypes.ClosureProcess);
   });

   it('should show technical error for an API has empty respose', () => {
      accountServiceStub.getSettlementDetails.and.returnValue(Observable.of({}));
      component.getSettlementDetails();
      expect(component.settlementQuoteStatus).toBe(notificationTypes.TechnicalError);
   });

   it('should show technical error for an API returns RO4 status', () => {
      accountServiceStub.getSettlementDetails.and.returnValue(Observable.of(mockMFCSettlementFailureR04Response));
      component.getSettlementDetails();
      expect(component.settlementQuoteStatus).toBe(notificationTypes.TechnicalError);
   });

   it('should show settlement quote error for an API returns RO2 status', () => {
      accountServiceStub.getSettlementDetails.and.returnValue(Observable.of(mockMFCSettlementFailureR02Response));
      component.getSettlementDetails();
      expect(component.settlementQuoteStatus).toBe(notificationTypes.QuoteGenerateError);
   });

   it('should show technical error for an API returns invalid response', () => {
      accountServiceStub.getSettlementDetails.and.returnValue(Observable.of(mockMFCSettlementFailureResponse));
      component.getSettlementDetails();
      expect(component.settlementQuoteStatus).toBe(notificationTypes.TechnicalError);
   });

   it('should close overlay and navigate to account detail If retry limit is exceeded', () => {
     component.onRetrySettlementQuote(false);
     const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(component.isOverlayVisible).toBe(false);
      expect(url).toBe('/dashboard/account/detail/1');
   });

   it('should not be allow retry settlement quote if it reaches limit', () => {
      component.retryCount = 3;
      component.onRetrySettlementQuote(true);
      expect(component.retryLimitExceeded).toBe(true);
   });

   it('should be home loan settlment', () => {
      component.accountId = '2';
      accountServiceStub.getAccountData.and.returnValue(mockHLAccountData);
      accountServiceStub.getSettlementDetails.and.returnValue(Observable.of(mockHLSettlementSuccessResponse));
      component.ngOnInit();
      expect(component.isHLSettlementQuote).toBe(true);
   });

   it('should be personal loan settlment', () => {
      component.accountId = '3';
      accountServiceStub.getAccountData.and.returnValue(mockPLAccountData);
      component.ngOnInit();
      expect(component.isPLSettlementQuote).toBe(true);
   });

   it('should return true if settlement quote has closure status', () => {
      component.settlementQuoteStatus = 3;
      expect(component.getSettlementQuoteStatus()).toBe(true);
   });

   it('should return true if settlement quote has technical error', () => {
      component.settlementQuoteStatus = 2;
      expect(component.getSettlementQuoteStatus()).toBe(true);
   });

   it('should return true if settlement quote has quote error', () => {
      component.settlementQuoteStatus = 1;
      expect(component.getSettlementQuoteStatus()).toBe(true);
   });

   it('should return true if settlement quote has quote error', () => {
      component.settlementQuoteStatus = 4;
      expect(component.getSettlementQuoteStatus()).toBe(false);
   });

   it('should close overlay and navigate to account detail for home loan settlement', () => {
      component.isHLSettlementQuote = true;
      component.accountId = '1';
      const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(component.isOverlayVisible).toBe(false);
      expect(url).toBe('/dashboard/account/detail/1');
   });

   it('should show settlement technical error for an API returns RO2 status', () => {
      accountServiceStub.getSettlementDetails.and.returnValue(Observable.of(mockMFCSettlementFailureR02Response));
      component.isMFCSettlementQuote = false;
      component.isHLSettlementQuote = true;
      component.getSettlementDetails();
      expect(component.settlementQuoteStatus).toBe(notificationTypes.TechnicalError);
   });

});
