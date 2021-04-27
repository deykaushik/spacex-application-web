import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { ViewSchedulePaymentComponent } from './view-schedule-payment.component';
import { AccountService } from '../../../dashboard/account.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from './../../pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../pipes/skeleton-loader.pipe';
import { IScheduledTransaction } from '../../../core/services/models';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { GaTrackingService } from '../../../core/services/ga.service';

const scheduledTransaction: IScheduledTransaction = {
   batchID: 2060015,
   transactionID: 29117114,
   capturedDate: '2017-09-20T00:00:00',
   startDate: '2017-11-03T13:00:00',
   nextTransDate: '2017-09-20T00:00:00',
   beneficiaryID: 0,
   sortCode: '196005',
   bFName: 'UNKNOWN',
   myDescription: 'test',
   beneficiaryDescription: 'test',
   fromAccount: { 'accountNumber': '1713277581' },
   toAccount: { 'accountNumber': '1042853096', accountType: 'CA' },
   amount: 100.0,
   reoccurrenceItem: {
      reoccurrenceFrequency: 'Monthly',
      recInstrID: 2050467,
      reoccurrenceOccur: 12,
      reoccOccurrencesLeft: 11,
      reoccurrenceToDate: '2018-09-16T00:00:00',
      reoccSubFreqType: 'DayOfMonth',
      reoccSubFreqVal: '16'
   }
};

const mockStateData = {
   transaction: scheduledTransaction,
   isSuccess: true
};

const observerPrepaid = new BehaviorSubject(null);
const observerTransfer = new BehaviorSubject(null);
const observerPayment = new BehaviorSubject(null);
const scheduledTransactionWithoutRecurr: IScheduledTransaction = {
   batchID: 2060015,
   transactionID: 29117114,
   capturedDate: '2017-09-20T00:00:00',
   startDate: '2017-09-20T00:00:00',
   nextTransDate: '2017-09-20T00:00:00',
   beneficiaryID: 0,
   sortCode: '196005',
   bFName: 'UNKNOWN',
   myDescription: 'test',
   beneficiaryDescription: 'test',
   fromAccount: { 'accountNumber': '1713277581' },
   toAccount: { 'accountNumber': '1042853096', accountType: 'CA' },
   amount: 100.0,
};

const mockStateData2 = {
   transaction: scheduledTransactionWithoutRecurr,
   isSuccess: true
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};
const accountServiceStub = {
   getScheduledPaymentDetail: jasmine.createSpy('getScheduledPaymentDetail').and.returnValue(Observable.of(scheduledTransaction)),
   getScheduledPrepaidDetail: jasmine.createSpy('getScheduledPrepaidDetail').and.returnValue(Observable.of(scheduledTransaction)),
   getScheduledTransferDetail: jasmine.createSpy('getScheduledTransferDetail').and.returnValue(Observable.of(scheduledTransaction)),
   removeScheduledTransferDetail: jasmine.createSpy('removeScheduledTransferDetail').and.returnValue(Observable.of({
      response: 'success'
   })),
   removeScheduledPrepaidDetail: jasmine.createSpy('removeScheduledPrepaidDetail').and.returnValue(Observable.of({
      response: 'success'
   })),
   removeScheduledPaymentDetail: jasmine.createSpy('removeScheduledPaymentDetail').and.returnValue(Observable.of({
      response: 'success'
   })),
   getSuccessState: jasmine.createSpy('getSuccessState').and.returnValue(mockStateData),
   resetSuccessState: jasmine.createSpy('resetSuccessState '),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(true)
};
const accountServiceStub2 = {
   getScheduledPaymentDetail: jasmine.createSpy('getScheduledPaymentDetail').and.returnValue(Observable.of(scheduledTransaction)),
   getScheduledPrepaidDetail: jasmine.createSpy('getScheduledPrepaidDetail').
   and.returnValue(Observable.of(scheduledTransactionWithoutRecurr)),
   getScheduledTransferDetail: jasmine.createSpy('getScheduledTransferDetail').and
      .returnValue(Observable.of(scheduledTransactionWithoutRecurr)),
   removeScheduledTransferDetail: jasmine.createSpy('removeScheduledTransferDetail').and.returnValue(observerTransfer),
   removeScheduledPrepaidDetail: jasmine.createSpy('removeScheduledPrepaidDetail').and.returnValue(observerPrepaid),
   removeScheduledPaymentDetail: jasmine.createSpy('removeScheduledPaymentDetail').and.returnValue(observerPayment),
   getSuccessState: jasmine.createSpy('getSuccessState').and.returnValue(mockStateData2),
   resetSuccessState: jasmine.createSpy('resetSuccessState '),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(false)
};
const location = {
   go: jasmine.createSpy('go'),
   back: jasmine.createSpy('back'),
   replaceState: jasmine.createSpy('replaceState'),
   isCurrentPathEqualTo: jasmine.createSpy('isCurrentPathEqualTo')
};
const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/scheduled/:id', component: testComponent },
   { path: 'Mobile/:id', component: testComponent },
   { path: 'recipient', component: testComponent }
];
describe('ViewSchedulePaymentComponent', () => {
   let component: ViewSchedulePaymentComponent;
   let fixture: ComponentFixture<ViewSchedulePaymentComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ViewSchedulePaymentComponent, SkeletonLoaderPipe, AmountTransformPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ transactionType: 'Payment', transactionID: 29117114 }) } },
         { provide: Location, useValue: location }, SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ViewSchedulePaymentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.transactionType = 'Mobile';
      expect(component).toBeTruthy();
   });
   it('shoukd call goBack function', () => {
      component.goBack();
   });
   it('should be call remove schedule transaction for payment', () => {
      component.removeScheduleTransaction();
      expect(accountServiceStub.removeScheduledPaymentDetail).toHaveBeenCalled();
   });
   it('should set visible visible on hide overlay', () => {
      component.hideOverlay(true);
      expect(component.showModal).toBe(true);
   });
});

describe('ViewSchedulePaymentComponent', () => {
   let component: ViewSchedulePaymentComponent;
   let fixture: ComponentFixture<ViewSchedulePaymentComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ViewSchedulePaymentComponent, SkeletonLoaderPipe, AmountTransformPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub2 },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ transactionType: 'Transfer', transactionID: 10 }) } },
         { provide: Location, useValue: location }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      observerTransfer.next('sucess');
      fixture = TestBed.createComponent(ViewSchedulePaymentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should call remove schedule transaction for Transfer', () => {
      component.removeScheduleTransaction();
      component.removeScheduleTransaction();
      component.removeScheduleTransaction();
      component.removeScheduleTransaction();
      component.removeScheduleTransaction();
      expect(accountServiceStub2.removeScheduledTransferDetail).toHaveBeenCalled();
   });

   it('should call handle delete failed for transfer', () => {
      component.removeScheduleTransaction();
      observerTransfer.error('falied');
      expect(accountServiceStub2.removeScheduledTransferDetail).toHaveBeenCalled();
   });

});

describe('ViewSchedulePaymentComponent', () => {
   let component: ViewSchedulePaymentComponent;
   let fixture: ComponentFixture<ViewSchedulePaymentComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      observerPrepaid.next('sucess');
      TestBed.configureTestingModule({
         declarations: [ViewSchedulePaymentComponent, SkeletonLoaderPipe, AmountTransformPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub2 },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ transactionType: 'Mobile', transactionID: 10 }) } },
         { provide: Location, useValue: location }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ViewSchedulePaymentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should call remove schedule transaction for Prepaid', () => {
      component.removeScheduleTransaction();
      observerPrepaid.error('failed');
      expect(accountServiceStub2.removeScheduledPrepaidDetail).toHaveBeenCalled();
   });

   it('should handle remove schedule transaction failure for Payment', () => {
      observerPayment.next('sucess');
      component.transactionType = 'Payment';
      component.removeScheduleTransaction();
      observerPayment.error('failed');
      expect(accountServiceStub2.removeScheduledPrepaidDetail).toHaveBeenCalled();
   });
   it('should be call goToEdit', () => {
      component.goToEdit();
      component.goBack();

   });

   it('should call open delele modal', () => {
      component.openDeleteOverlay();
      expect(component.isDeleteOverlay).toBeTruthy();
   });
   it('should call iseditable', () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      component.transactionDetail.nextTransDate = currentTime.setHours(currentHour + 2).toString();
      expect(component.isNonEditable()).toBeFalsy();
   });

   it('should call delete modal', () => {
      component.closeDeleteOverlay();
      expect(component.isDeleteOverlay).toBeFalsy();
   });

   it('should call refresh modal', () => {
      component.refreshPayment();
      expect(component.showModal).toBeFalsy();
   });
   it('should set back to recipients when account id is undefined', () => {
      component.accountId = undefined;
      component.setBackUrl();
      expect(component.backUrl).toBe(Constants.path.recipient);
   });
   it('should set back to schedule payemnet when account id is defined', () => {
      component.accountId = 123;
      component.setBackUrl();
      expect(component.backUrl).toBe(CommonUtility.format(Constants.path.schedulePayment, component.accountId));
   });
});


