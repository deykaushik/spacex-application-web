import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from './../../../test-util';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { AmountTransformPipe } from './../../pipes/amount-transform.pipe';
import { AccountService } from '../../../dashboard/account.service';
import { EditScheduledPaymentComponent } from './edit-scheduled-payment.component';
import { Constants } from '../../../core/utils/constants';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { IAccountDetail, IClientDetails } from '../../../core/services/models';
import { GaTrackingService } from '../../../core/services/ga.service';


const observerPrepaid = new BehaviorSubject(null);
const observerTransfer = new BehaviorSubject(null);
const observerPayment = new BehaviorSubject(null);

const accounts = [{
   accountNumber: '123456',
   availableBalance: 24567,
   currentBalance: 34567,
   nickname: 'Test account',
   accountLevel: '',
   accountRules: null,
   accountType: '',
   allowCredits: false,
   allowDebits: false,
   currency: 'R',
   isAlternateAccount: false,
   isPlastic: true,
   isRestricted: false,
   itemAccountId: '324324',
   productCode: '',
   productDescription: '',
   profileAccountState: '',
   sourceSystem: '',
   viewAvailBal: true,
   viewCredLim: false,
   viewCurrBal: false,
   viewMinAmtDue: false,
   viewStmnts: false
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

const transactionDetail = {
   'batchID': 2060015,
   'transactionID': 29117114,
   'capturedDate': '2017-09-20T00:00:00',
   'startDate': '2017-09-20T00:00:00',
   'nextTransDate': '2017-09-20T00:00:00',
   'beneficiaryID': 0,
   'sortCode': '196005',
   'bFName': 'UNKNOWN',
   'myDescription': 'test',
   'beneficiaryDescription': 'test',
   'fromAccount': { 'accountNumber': '1713277581' },
   'toAccount': { 'accountNumber': '1042853096', accountType: 'CA' },
   'amount': 100.0,
   'reoccurrenceItem': {
      'reoccurrenceFrequency': 'Monthly',
      'recInstrID': 2050467,
      'reoccurrenceOccur': 12,
      'reoccOccurrencesLeft': 11,
      'reoccurrenceToDate': '2018-09-16T00:00:00',
      'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
   }
};

const accountServiceStub = {
   getScheduledPaymentDetail: jasmine.createSpy('getScheduledPaymentDetail').and.returnValue(Observable.of(transactionDetail)),
   getScheduledTransferDetail: jasmine.createSpy('getScheduledTransferDetail').and.returnValue(Observable.of(transactionDetail)),
   getScheduledPrepaidDetail: jasmine.createSpy('getScheduledPrepaidDetail').and.returnValue(Observable.of(transactionDetail)),
   getPaymentAccounts: jasmine.createSpy('getPaymentAccounts').and.returnValue(Observable.of(accounts)),
   getTransferAccounts: jasmine.createSpy('getTransferAccounts').and.returnValue(Observable.of(accounts)),
   getPrepaidAccounts: jasmine.createSpy('getPrepaidAccounts').and.returnValue(Observable.of(accounts)),
   saveScheduledPaymentDetail: jasmine.createSpy('saveScheduledPaymentDetail').and.returnValue(Observable.of(metadata)),
   saveScheduledTransferDetail: jasmine.createSpy('saveScheduledTransferDetail').and.returnValue(Observable.of(metadata)),
   saveScheduledPrepaidDetail: jasmine.createSpy('saveScheduledPrepaidDetail').and.returnValue(Observable.of(metadata)),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(true),
   saveSuccessState: jasmine.createSpy('saveSuccessState'),
   removeScheduledTransferDetail: jasmine.createSpy('removeScheduledTransferDetail').and
      .returnValue(Observable.of({ response: 'success' })),
      createGUID : jasmine.createSpy('createGUID')
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};

const transactionDetailFutureDated = {
   'batchID': 2060015,
   'transactionID': 29117114,
   'capturedDate': '2017-09-20T00:00:00',
   'startDate': '2017-09-20T00:00:00',
   'nextTransDate': '2017-09-20T00:00:00',
   'beneficiaryID': 0,
   'sortCode': '196005',
   'bFName': 'UNKNOWN',
   'myDescription': 'test',
   'beneficiaryDescription': 'test',
   'fromAccount': { 'accountNumber': '1713277581' },
   'toAccount': { 'accountNumber': '1042853096', accountType: 'CA' },
   'amount': 100.0
};

const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/scheduled/:id', component: testComponent },
   { path: 'Mobile/:id', component: testComponent },
   { path: 'recipient', component: testComponent },
];
const clientDetails: IClientDetails = {
   FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
   EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
};
const clientProfileDetailsServiceStub = {
   setDefaultAccountId: jasmine.createSpy('setDefaultAccountId'),
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.callFake((accs: IAccountDetail[]) => {
      return accs.find(acc => acc.itemAccountId === '2');
   }),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
};
describe('EditScheduledPaymentComponent', () => {
   let component: EditScheduledPaymentComponent;
   let fixture: ComponentFixture<EditScheduledPaymentComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [EditScheduledPaymentComponent, AmountTransformPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam), FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub }, SystemErrorService,
         {
            provide: ActivatedRoute, useValue: {
               params: Observable.of({
                  transactionType: 'Payment',
                  transactionID: 1
               })
            }
         }, {
            provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(EditScheduledPaymentComponent);
      component = fixture.componentInstance;
      component.transactionDetail = transactionDetail;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it(`should validate number of repetitions allowed for various
  payment frequencies & number of repititions.`, () => {
         component.selectedPaymentFrequency = Constants.editPaymentRecurrenceFrequency.monthly;
         component.vm.reoccurrenceItem.reoccurrenceOccur = 0;
         expect(component.isNumReccurencesInvalid()).toBeTruthy();

         component.vm.reoccurrenceItem.reoccurrenceOccur = 12;
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.reoccurrenceItem.reoccurrenceOccur = 13;
         expect(component.isNumReccurencesInvalid()).toBeTruthy();

         component.selectedPaymentFrequency = Constants.editPaymentRecurrenceFrequency.weekly;
         component.vm.reoccurrenceItem.reoccurrenceOccur = -1;
         expect(component.isNumReccurencesInvalid()).toBeTruthy();

         component.vm.reoccurrenceItem.reoccurrenceOccur = 52;
         expect(component.isNumReccurencesInvalid()).toBeFalsy();

         component.vm.reoccurrenceItem.reoccurrenceOccur = 53;
         expect(component.isNumReccurencesInvalid()).toBeTruthy();
      });

   it('should check for changing payment frequency', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(Constants.editPaymentRecurrenceFrequency.weekly);
         expect(component.selectedPaymentFrequency).toBe(Constants.editPaymentRecurrenceFrequency.weekly);
      });
   });

   it('should get accounts for all types', () => {
      component.transactionType = Constants.SchedulePaymentType.prepaid.name;
      component.getAccounts().subscribe((response) => {
         expect(response).toBe(accounts);
      });

      component.transactionType = Constants.SchedulePaymentType.transfer.name;
      component.getAccounts().subscribe((response) => {
         expect(response).toBe(accounts);
      });
   });

   it('should set selected account', () => {
      component.onAccountSelection(accounts[0]);
      expect(component.selectedAccount).toBe(accounts[0]);
   });

   it('should get sub frequency type for monthy payment', () => {
      const result = component.getPaymentRecurrenceSubFrequencyType(Constants.editPaymentRecurrenceFrequency.monthly.code);
      expect(result).toBe('DayOfMonth');
   });

   it('should get sub frequency type for monthy payment', () => {
      const result = component.getPaymentRecurrenceSubFrequency(Constants.editPaymentRecurrenceFrequency.monthly.code, '2016-11-11');
      expect(result).toBe('11');
   });

   it('should change notification successfully', () => {
      const SMSselected = component.notifications.find(m => m.value === Constants.notificationTypes.SMS);
      component.onNotificationChange(SMSselected);
      expect(component.vm.notificationDetail.notificationType).toBe(SMSselected.value);
   });

   // when all values are valid
   it('form should be validated with valid Email values ', () => {
      component.vm.notificationDetail = {
         notificationAddress: 'abc@nagarro.com',
         notificationType: Constants.notificationTypes.email
      };
      expect(component.isNotificationValid()).toBe(true);
   });


   // when all values are valid
   it('form should be invalidated with invalid Email values ', () => {
      component.vm.notificationDetail = {
         notificationAddress: 'abc@nagarro',
         notificationType: Constants.notificationTypes.email
      };
      expect(component.isNotificationValid()).toBeFalsy();
   });

   // when all values are valid
   it('form should be invalidated with Empty Email value ', () => {
      component.vm.notificationDetail = {
         notificationAddress: '',
         notificationType: Constants.notificationTypes.email
      };
      expect(component.isNotificationValid()).toBeFalsy();
   });

   // when all values are valid
   it('form should be validated with valid SMS number values ', () => {
      component.vm.notificationDetail = {
         notificationAddress: '1234567891',
         notificationType: Constants.notificationTypes.SMS
      };
      expect(component.isNotificationValid()).toBeTruthy();
   });


   // when SMS number is not valid
   it('form should be validated with invalid SMS number values ', () => {
      component.vm.notificationDetail = {
         notificationAddress: '123',
         notificationType: Constants.notificationTypes.SMS
      };
      expect(component.isNotificationValid()).toBeFalsy();
   });

   // when all values are valid
   it('form should be validated with valid None notification ', () => {
      component.vm.notificationDetail = {
         notificationAddress: '123456789',
         notificationType: Constants.notificationTypes.none
      };
      expect(component.isNotificationValid()).toBeTruthy();
   });

   it('form should be validated with no notification details', () => {
      component.vm.notificationDetail = null;
      expect(component.isNotificationValid()).toBeTruthy();
   });

   it('should handle mobile number change', () => {
      component.onMobileNumberChange(1234567891);
      expect(component.isValid).toBeDefined();
   });

   it('should handle amount change', () => {
      component.onAmountChange('abc');
      expect(component.isAmountValid).toBeFalsy();

      component.onAmountChange('100');
      expect(component.isAmountValid).toBeTruthy();
   });
   it('should call delete transaction', () => {
      component.transactionType = Constants.SchedulePaymentType.transfer.name;
      component.vm = transactionDetail;
      component.removeScheduleTransaction();
   });

   it('should update details for all types', () => {
      component.transactionType = Constants.SchedulePaymentType.payment.name;
      component.updateScheduledPayment();

      component.transactionType = Constants.SchedulePaymentType.transfer.name;
      component.updateScheduledPayment();

      component.transactionType = Constants.SchedulePaymentType.prepaid.name;
      component.updateScheduledPayment();

      delete component.transactionDetail.reoccurrenceItem;
      component.updateScheduledPayment();

   });

   it('should call set notification', () => {
      component.transactionType = Constants.SchedulePaymentType.transfer.name;
      component.setNotificationDetails();
   });

   it('should redirect to schedule payment if there is account id', () => {
      component.accountId = 1;
      component.checkResponse({ status: true });
   });

});


const metadataFailure = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const accountServiceStub1 = {
   getScheduledPaymentDetail: jasmine.createSpy('getScheduledPaymentDetail').and.returnValue(Observable.of(transactionDetailFutureDated)),
   getScheduledTransferDetail: jasmine.createSpy('getScheduledTransferDetail').and.returnValue(Observable.of(transactionDetailFutureDated)),
   getScheduledPrepaidDetail: jasmine.createSpy('getScheduledPrepaidDetail').and.returnValue(Observable.of(transactionDetailFutureDated)),
   getPaymentAccounts: jasmine.createSpy('getPaymentAccounts').and.returnValue(Observable.of(accounts)),
   getTransferAccounts: jasmine.createSpy('getTransferAccounts').and.returnValue(Observable.of(accounts)),
   getPrepaidAccounts: jasmine.createSpy('getPrepaidAccounts').and.returnValue(Observable.of(accounts)),
   saveScheduledPaymentDetail: jasmine.createSpy('saveScheduledPaymentDetail').and.returnValue(Observable.of(metadataFailure)),
   saveScheduledTransferDetail: jasmine.createSpy('saveScheduledTransferDetail').and.returnValue(Observable.of(metadataFailure)),
   saveScheduledPrepaidDetail: jasmine.createSpy('saveScheduledPrepaidDetail').and.returnValue(Observable.of(metadataFailure)),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(false),
   createGUID : jasmine.createSpy('createGUID')
};

describe('EditScheduledPaymentComponent', () => {
   let component: EditScheduledPaymentComponent;
   let fixture: ComponentFixture<EditScheduledPaymentComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [EditScheduledPaymentComponent, AmountTransformPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam), FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub1 }, SystemErrorService,
         {
            provide: ActivatedRoute, useValue: {
               params: Observable.of({
                  transactionType: 'Payment',
                  transactionID: 1
               })
            }
         },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         {
            provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(EditScheduledPaymentComponent);
      component = fixture.componentInstance;
      component.transactionDetail = transactionDetail;
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should update details for all types', () => {
      component.transactionType = Constants.SchedulePaymentType.payment.name;
      component.updateScheduledPayment();

      component.transactionType = Constants.SchedulePaymentType.transfer.name;
      component.updateScheduledPayment();

      component.transactionType = Constants.SchedulePaymentType.prepaid.name;
      component.updateScheduledPayment();
   });
});

const accountServiceStub2 = {
   getScheduledPaymentDetail: jasmine.createSpy('getScheduledPaymentDetail').and.returnValue(Observable.of(transactionDetail)),
   getScheduledTransferDetail: jasmine.createSpy('getScheduledTransferDetail').and.returnValue(Observable.of(transactionDetail)),
   getScheduledPrepaidDetail: jasmine.createSpy('getScheduledPrepaidDetail').and.returnValue(Observable.of(transactionDetail)),
   getPaymentAccounts: jasmine.createSpy('getPaymentAccounts').and.returnValue(Observable.of(accounts)),
   getTransferAccounts: jasmine.createSpy('getTransferAccounts').and.returnValue(Observable.of(accounts)),
   getPrepaidAccounts: jasmine.createSpy('getPrepaidAccounts').and.returnValue(Observable.of(accounts)),
   createGUID : jasmine.createSpy('createGUID'),
   saveScheduledPaymentDetail: jasmine.createSpy('saveScheduledPaymentDetail').and.returnValue(Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
   })),
   saveScheduledTransferDetail: jasmine.createSpy('saveScheduledTransferDetail').and.returnValue(Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
   })),
   saveScheduledPrepaidDetail: jasmine.createSpy('saveScheduledPrepaidDetail').and.returnValue(Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
   })),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(false),
   removeScheduledTransferDetail: jasmine.createSpy('removeScheduledTransferDetail').and.returnValue(Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
   })),
   removeScheduledPrepaidDetail: jasmine.createSpy('removeScheduledPrepaidDetail').and.returnValue(observerPrepaid),
   removeScheduledPaymentDetail: jasmine.createSpy('removeScheduledPaymentDetail').and.returnValue(observerPayment),
};

const transactionDetail2 = {
   'batchID': 2060015,
   'transactionID': 29117114,
   'capturedDate': '2017-09-20T00:00:00',
   'startDate': '2017-09-20T00:00:00',
   'nextTransDate': '2017-09-20T00:00:00',
   'beneficiaryID': 0,
   'sortCode': '196005',
   'bFName': 'UNKNOWN',
   'myDescription': 'test',
   'beneficiaryDescription': 'test',
   'fromAccount': { 'accountNumber': '1713277581' },
   'toAccount': { 'accountNumber': '1042853096', accountType: 'CA' },
   'amount': 100.0,
   'reoccurrenceItem': {
      'reoccurrenceFrequency': 'Weekly',
      'recInstrID': 2050467,
      'reoccurrenceOccur': 12,
      'reoccOccurrencesLeft': 11,
      'reoccurrenceToDate': '2018-09-16T00:00:00',
      'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
   }
};
describe('EditScheduledPaymentComponent', () => {
   let component: EditScheduledPaymentComponent;
   let fixture: ComponentFixture<EditScheduledPaymentComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [EditScheduledPaymentComponent, AmountTransformPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam), FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: AccountService, useValue: accountServiceStub2 }, SystemErrorService,
         {
            provide: ActivatedRoute, useValue: {
               params: Observable.of({
                  transactionType: 'Payment',
                  transactionID: 1
               })
            }
         },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         {
            provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(EditScheduledPaymentComponent);
      component = fixture.componentInstance;
      component.transactionDetail = transactionDetail2;
      fixture.detectChanges();
      observerPayment.next('data');
      observerPrepaid.next('data');
   });
   it('should update details for all types', () => {
      component.transactionType = Constants.SchedulePaymentType.payment.name;
      component.updateScheduledPayment();

      component.transactionType = Constants.SchedulePaymentType.transfer.name;
      component.updateScheduledPayment();

      component.transactionType = Constants.SchedulePaymentType.prepaid.name;
      component.updateScheduledPayment();
   });

   it('should delete transaction for all types', () => {
      component.transactionType = Constants.SchedulePaymentType.payment.name;
      component.vm = transactionDetail;
      component.removeScheduleTransaction();
      observerPayment.error('failure');

      component.transactionType = Constants.SchedulePaymentType.transfer.name;
      component.removeScheduleTransaction();

      component.vm = transactionDetail;
      component.transactionType = Constants.SchedulePaymentType.prepaid.name;
      component.removeScheduleTransaction();
      observerPrepaid.error('failed');
   });

   it('should call open and close delete modal', () => {
      component.closeDeleteOverlay();
      expect(component.isDeleteOverlay).toBeFalsy();
      component.openDeleteOverlay();
      expect(component.isDeleteOverlay).toBeTruthy();
      component.handleError();
      expect(component.isDeleteFailed).toBeTruthy();
   });

   it('should call disbale try again after total of 4 time', () => {
      component.transactionType = Constants.SchedulePaymentType.payment.name;
      component.updateScheduledPayment();
      component.updateScheduledPayment();
      component.updateScheduledPayment();
      component.updateScheduledPayment();
      component.updateScheduledPayment();

      component.vm = transactionDetail;
      component.removeScheduleTransaction();
      component.removeScheduleTransaction();
      component.removeScheduleTransaction();
      component.removeScheduleTransaction();
      component.removeScheduleTransaction();
   });
});

