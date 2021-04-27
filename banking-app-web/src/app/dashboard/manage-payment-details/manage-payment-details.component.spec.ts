import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../account.service';
import { LoaderService } from '../../core/services/loader.service';
import { ManagePaymentDetailsComponent } from './manage-payment-details.component';
import { ILoanDebitOrderDetails, ITermsAndConditions, IDashboardAccount } from '../../core/services/models';
import { assertModuleFactoryCaching } from './../../test-util';
import { CommonUtility } from '../../core/utils/common';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { GaTrackingService } from '../../core/services/ga.service';

const mockLoanDebitOrders: ILoanDebitOrderDetails = {
   accountNumber: '711647500000001',
   currentBalance: '193650.28',
   assetDetails: {
      description: '2011 U KIA SPORTAGE 2.0 A/T',
      chassisNumber: 'KNAPC811MB7135729',
      engineNumber: 'G4KDBS026445'
   },
   interestRate: 15,
   paymentFrequency: 'monthly',
   totalInstallment: 5283.52,
   nextInstallmentDate: '2018-07-30T02:00:00+02:00',
   paymentMethod: 'Cash',
   bankName: 'ABSA BANK (PREF BRANCH CODE)',
   bankBranchCode: 632005,
   bankAccNumber: '9071836461',
   bankAccountType: 'CA',
   expiryDate: '1900-01-01T02:00:00+02:00',
   effectiveDate: '1900-01-01T02:00:00+02:00',
   similarAccounts: [{ itemAccountId: '`12', accountNumber: '711647500000001', currentBalance: 193650.28 }]
};
const mockLoanDebitOrdersBankDetails: ILoanDebitOrderDetails = {
   accountNumber: '711647500000001',
   currentBalance: '193650.28',
   assetDetails: {
      description: '2011 U KIA SPORTAGE 2.0 A/T',
      chassisNumber: 'KNAPC811MB7135729',
      engineNumber: 'G4KDBS026445'
   },
   interestRate: 15,
   paymentFrequency: 'monthly',
   totalInstallment: 5283.52,
   nextInstallmentDate: '2018-07-30T02:00:00+02:00',
   paymentMethod: 'Debit',
   bankName: 'ABSA BANK (PREF BRANCH CODE)',
   bankBranchCode: 632005,
   bankAccNumber: '9071836461',
   bankAccountType: 'CA',
   similarAccounts: [{ itemAccountId: '12', accountNumber: '711647500000001', currentBalance: 193650.28 }]
};

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
   ItemAccountId: '12',
   InterestRate: 0
}];
const accountServiceStub = {
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData[0]),
   getLoanDebitOrders: jasmine.createSpy('getLoanDebitOrders').and.returnValue(Observable.of([mockLoanDebitOrders])),
   getLoanDebitOrderStatusCode: Observable.of('R02')
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('ManagePaymentDetailsComponent', () => {
   let component: ManagePaymentDetailsComponent;
   let fixture: ComponentFixture<ManagePaymentDetailsComponent>;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ManagePaymentDetailsComponent, SkeletonLoaderPipe, AmountTransformPipe],
         imports: [RouterTestingModule, FormsModule],
         providers: [LoaderService,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 12 }), snapshot: {} } }],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ManagePaymentDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      router = TestBed.get(Router);
      component.accountId = '2';
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should not go to previous pageif showDetails is true', () => {
      component.showDetails = true;
      component.goToPreviousPage();
      expect(component.showDetails).toBe(false);
      expect(component.showList).toBe(true);
   });
   it('should go to previous page i.e on click of < from manage payment details page', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.goToPreviousPage();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/detail/2');
   });

   it('call api to get loan account payment details', () => {
      accountServiceStub.getLoanDebitOrders.and.returnValue(Observable.of([mockLoanDebitOrders]));
      component.accountId = '12';
      component.defaultDate = '1900-01-01T02:00:00+02:00';
      component.ngOnInit();
      expect(component.loanAccountType).toBe('CA');
   });
   it('showLoanDetails', () => {
      component.showLoanDetails(0);
      expect(component.showDetails).toBe(true);
   });
   it('showLoanDetails for HL', () => {
      component.loanAccountType = 'HL';
      component.showLoanDetails(0);
      expect(component.showDetails).toBe(true);
   });
   it('showLoanDetails for PL', () => {
      component.loanAccountType = 'PL';
      component.showLoanDetails(0);
      expect(component.showDetails).toBe(true);
   });
   it('status code is R02', () => {
      accountServiceStub.getLoanDebitOrders.and.returnValue(accountServiceStub.getLoanDebitOrderStatusCode);
      component.accountId = '12';
      component.ngOnInit();
      expect(component.loanAccountType).toBe('CA');
      expect(component.isClosedLoan).toBe(true);
   });
});
