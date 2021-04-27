import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from '../../test-util';
import { PreFillService } from '../../core/services/preFill.service';
import { ManageLoanService } from '../manage-loan.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import { CancelLoanComponent } from './cancel-loan.component';
import { IHomeLoanStatus, IApiResponse, ITransactionStatus } from '../../core/services/models';
import { NotificationTypes } from '../../core/utils/enums';
import { HighlightPipe } from '../../shared/pipes/highlight.pipe';


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


describe('CancelLoanComponent', () => {
   let component: CancelLoanComponent;
   let fixture: ComponentFixture<CancelLoanComponent>;
   let router: Router;
   const notificationTypes = NotificationTypes;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CancelLoanComponent, HighlightPipe],
         schemas: [NO_ERRORS_SCHEMA],
         imports: [FormsModule, RouterTestingModule.withRoutes(routes)],
         providers: [{ provide: ManageLoanService, useValue: manageLoanServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 1 }), snapshot: {} } },
         { provide: PreFillService, useValue: preFillServiceStub },
         { provide: SystemErrorService, useValue: systemErrorServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CancelLoanComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should show confirm popup', () => {
      component.homeLoanStatusData = mockHomeLoanStatusData;
      component.confirmPopup = false;
      component.showHideConfirmPopup();
      expect(component.confirmPopup).toBe(true);
   });

   it('should hide confirm popup', () => {
      component.confirmPopup = true;
      component.showHideConfirmPopup();
      expect(component.confirmPopup).toBe(false);
   });

   it('should show success template', () => {
      component.reqCancelNotice();
      expect(component.selectedTemplate).toBe(fixture.componentInstance.successTemplate);
   });

   it('should return status as error If service returns empty response', () => {
      manageLoanServiceStub.cancelLoan.and.returnValue(Observable.of({}));
      component.reqCancelNotice();
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should return error for submit place notice', () => {
      manageLoanServiceStub.cancelLoan.and.returnValue(mockPlaceServiceError);
      component.reqCancelNotice();
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should not be allow retry if it reaches limit', () => {
      component.retryCount = 3;
      component.onRetry(true);
      expect(component.retryLimitExceeded).toBe(true);
   });

   it('should close the overlay and navigate to manage loan if retry is false', () => {
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

   it('should show success template for valid R03 response', () => {
      const mockValidR03TransactionStatus = mockInValidTransactionStatus;
      mockValidR03TransactionStatus.result = 'R03';
      mockValidR03TransactionStatus.isValid = true;
      component.handleStatus(mockValidR03TransactionStatus);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.successTemplate);
   });

   it('should navigate to place notice', () => {
      component.accountId = '1';
      const spy = spyOn(router, 'navigateByUrl');
      component.onClickPlaceNotice();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/manageloan/placenotice/1');
   });

   it('should in validate recipient email on change', () => {
      component.onEmailChange('bob');
      expect(component.isValidEmail).toBe(false);
   });

   it('should validate recipient email on change', () => {
      component.onEmailChange('bob@bob.com');
      expect(component.isValidEmail).toBe(true);
   });

   it('should select cancel req in progress template for invalid R02 response', () => {
      const mockInValidR02TransactionStatus = mockInValidTransactionStatus;
      mockInValidR02TransactionStatus.result = 'R02';
      mockInValidR02TransactionStatus.isValid = false;
      component.handleStatus(mockInValidR02TransactionStatus);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.cancelReqInProgressTemplate);
   });

   it('should not have additional details when retry limit exceeded is false', () => {
      component.retryLimitExceeded = false;
      component.setErrorDetails();
      expect(component.statusDetail.description).toBeUndefined();
      expect(component.statusDetail.description2).toBeUndefined();
   });

   it('should have additional details when retry limit exceeded is true', () => {
      component.retryLimitExceeded = true;
      component.setErrorDetails();
      expect(component.statusDetail.description).toBe('Contact us:');
      expect(component.statusDetail.description2).toBe('0860 555 111');
   });

   it('should be true when isEarlyTerminationFee event returns true', () => {
      component.onEarlyTerminationFee(true);
      expect(component.applyCancellationFee).toBe(true);
   });

   it('should be false when isEarlyTerminationFee event returns false', () => {
      component.onEarlyTerminationFee(false);
      expect(component.applyCancellationFee).toBe(false);
   });

   it('should select cancel req received template for invalid R05 response', () => {
      const mockInValidR02TransactionStatus = mockInValidTransactionStatus;
      mockInValidR02TransactionStatus.result = 'R05';
      mockInValidR02TransactionStatus.isValid = false;
      component.handleStatus(mockInValidR02TransactionStatus);
      expect(component.selectedTemplate).toBe(fixture.componentInstance.cancelReqReceivedTemplate);
   });

   it('should status as error for other invalid response', () => {
      const mockInValidOtherTransactionStatus = mockInValidTransactionStatus;
      mockInValidOtherTransactionStatus.result = 'R07';
      mockInValidOtherTransactionStatus.isValid = false;
      component.handleStatus(mockInValidOtherTransactionStatus);
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should call cancel notice for action YES', () => {
      spyOn(component, 'reqCancelNotice').and.callThrough();
      component.userActionClick('Yes');
      expect(component.reqCancelNotice).toHaveBeenCalled();
   });

   it('should call show hide confirm popup for action NO', () => {
      component.confirmPopup = true;
      spyOn(component, 'showHideConfirmPopup').and.callThrough();
      component.userActionClick('No');
      expect(component.showHideConfirmPopup).toHaveBeenCalled();
      expect(component.confirmPopup).toBe(false);
   });

});
