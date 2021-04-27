import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PreFillService } from '../../core/services/preFill.service';
import { assertModuleFactoryCaching } from '../../test-util';
import { ManageLoanService } from '../manage-loan.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import { AccountService } from '../../dashboard/account.service';
import { PlaceNoticeComponent } from './place-notice.component';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { IHomeLoanStatus, IApiResponse, ITransactionStatus, IAccountBalanceDetail } from '../../core/services/models';
import { NotificationTypes } from '../../core/utils/enums';

const mockInValidTransactionStatus: ITransactionStatus = {
   isValid: false,
   reason: '',
   status: 'FAILURE',
   result: 'R01'
};

const mockPlaceNoticeRes: IApiResponse = {
   data: {
      status: ''
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'LoanProductsManagement',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   }
};

const mockBalanceDetail: IAccountBalanceDetail = {
   accountName: 'BOND A/C',
   accountNumber: '8605376000101',
   accountType: 'HL',
   currency: '&#x52;',
   outstandingBalance: 1.17,
   nextInstallmentAmount: 3519.45,
   amountInArrears: -181726.91,
   nextPaymentDue: 3519.45,
   nextPaymentDate: '2018-05-01T05:30:00+05:30',
   interestRate: 8.25,
   loanAmount: 405000,
   email: 'test@gmail.com',
   paymentTerm: '240',
   termRemaining: '64 months',
   balanceNotPaidOut: 10000,
   registeredAmount: 405000,
   accruedInterest: 0,
   isSingleBond: true,
   PropertyAddress: '6, WABOOM, 40672, Sandton',
   nameAndSurname: 'Mr Brian Bernard Sheinuk',
   contactNumber: '+27991365718',
   loanCancellationDate: '2018-05-01T05:30:00+05:30',
   loanCancellationNoticeExpiryDate: '2018-06-01T05:30:00+05:30',
   loanExpectedClosureDate: '2018-07-01T05:30:00+05:30'
};

const mockPlaceServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});
const testComponent = class { };
const routes: Routes = [
   { path: '', component: testComponent },
   { path: 'account/detail/:accountId', component: testComponent }
];
const manageLoanServiceStub = {
   cancelLoan: jasmine.createSpy('cancelLoan').and.returnValue(Observable.of(mockPlaceNoticeRes))
};

const mockHomeLoanStatusData: IHomeLoanStatus = {
   isManageLoanEnabled: true,
   isJointBondEnabled: true,
   isNinetyDaysNoticeEnabled: true,
   isLoanPaidUp: true
};

const preFillServiceStub = new PreFillService();
preFillServiceStub.homeLoanStatusData = mockHomeLoanStatusData;

const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

const accountServiceStub = {
   getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockBalanceDetail)),
};

describe('PlaceNoticeComponent', () => {
   let component: PlaceNoticeComponent;
   let fixture: ComponentFixture<PlaceNoticeComponent>;
   let router: Router;
   const notificationTypes = NotificationTypes;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PlaceNoticeComponent, SkeletonLoaderPipe],
         schemas: [NO_ERRORS_SCHEMA],
         imports: [RouterTestingModule.withRoutes(routes)],
         providers: [{ provide: ManageLoanService, useValue: manageLoanServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 1 }), snapshot: {} } },
         { provide: PreFillService, useValue: preFillServiceStub },
         { provide: SystemErrorService, useValue: systemErrorServiceStub },
         { provide: AccountService, useValue: accountServiceStub },
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(PlaceNoticeComponent);
      component = fixture.componentInstance;
      component.homeLoanStatusData = mockHomeLoanStatusData;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should show confirm popup', () => {
      component.confirmPopup = false;
      component.showHideConfirmPopup();
      expect(component.confirmPopup).toBe(true);
   });

   it('should hide confirm popup', () => {
      component.confirmPopup = true;
      component.showHideConfirmPopup();
      expect(component.confirmPopup).toBe(false);
   });

   it('should return status as success for submit place notice', () => {
      component.submitPlaceNotice();
      expect(component.status).toBe(notificationTypes.Success);
   });

   it('should return status as error If service returns empty response', () => {
      manageLoanServiceStub.cancelLoan.and.returnValue(Observable.of({}));
      component.submitPlaceNotice();
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should return error for submit place notice', () => {
      manageLoanServiceStub.cancelLoan.and.returnValue(mockPlaceServiceError);
      component.submitPlaceNotice();
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should not be allow retry if it reaches limit', () => {
      component.retryCount = 3;
      component.onRetry(true);
      expect(component.retryLimitExceeded).toBe(true);
   });

   it('should close the overlay navigate to manage loan if retry is false', () => {
      component.accountId = '1';
      const spy = spyOn(router, 'navigateByUrl');
      component.onRetry(false);
      expect(component.isOverlayVisible).toBe(false);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/manageloan/1');
   });

   it('should close the overlay and navigate to manage loan', () => {
      component.accountId = '1';
      const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/manageloan/1');
   });

   it('should status as error for invalid RO1 response', () => {
      component.handleStatus(mockInValidTransactionStatus);
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should status as error for invalid RO4 response', () => {
      const mockInValidR04TransactionStatus = mockInValidTransactionStatus;
      mockInValidR04TransactionStatus.result = 'R04';
      component.handleStatus(mockInValidR04TransactionStatus);
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should show notice in progress', () => {
      const mockInValidR02TransactionStatus = mockInValidTransactionStatus;
      mockInValidR02TransactionStatus.result = 'R02';
      component.handleStatus(mockInValidR02TransactionStatus);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.noticeInProgress);
   });

   it('should status as success for valid R03 response', () => {
      const mockValidR03TransactionStatus = mockInValidTransactionStatus;
      mockValidR03TransactionStatus.result = 'R03';
      mockValidR03TransactionStatus.isValid = true;
      component.handleStatus(mockValidR03TransactionStatus);
      expect(component.status).toBe(notificationTypes.Success);
   });

   it('should show notice exist for valid R05 response', () => {
      const mockValidR05TransactionStatus = mockInValidTransactionStatus;
      mockValidR05TransactionStatus.result = 'R05';
      mockValidR05TransactionStatus.isValid = false;
      component.handleStatus(mockValidR05TransactionStatus);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.noticeExist);
   });

   it('should have additional details when retry limit exceeded is false', () => {
      component.retryLimitExceeded = false;
      component.setErrorDetails();
      expect(component.statusDetail.description).toBeUndefined();
      expect(component.statusDetail.description2).toBeUndefined();
   });

   it('should have additional details when retry limit exceeded is true', () => {
      component.retryLimitExceeded = true;
      component.setErrorDetails();
      expect(component.statusDetail.description).toBe('For more information contact us on:');
      expect(component.statusDetail.description2).toBe('0860 555 111');
   });

   it('should submit place notice when user clicked yes', () => {
      spyOn(component, 'submitPlaceNotice').and.callThrough();
      component.userActionClick('Yes');
      expect(component.submitPlaceNotice).toHaveBeenCalled();
   });

   it('should clsoe the popup when user clicked no', () => {
      component.confirmPopup = true;
      spyOn(component, 'showHideConfirmPopup').and.callThrough();
      component.userActionClick('No');
      expect(component.showHideConfirmPopup).toHaveBeenCalled();
      expect(component.confirmPopup).toBe(false);
   });

});
