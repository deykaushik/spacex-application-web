import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Injector } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { ITransferMetaData } from './../../core/services/models';
import { TransferStatusComponent } from './transfer-status.component';
import { TransferService } from './../transfer.service';
import { ITransferAmountVm } from '../transfer.models';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { GaTrackingService } from '../../core/services/ga.service';
import { ReportsService } from '../../reports/reports.service';

describe('TransferStatusComponent', () => {
   let location: Location;
   let router: Router;
   let component: TransferStatusComponent;
   let fixture: ComponentFixture<TransferStatusComponent>;
   let transferService: TransferService;

   function getActiveAccountsData() {
      return {
         itemAccountId: '1',
         accountNumber: '1001004345',
         productCode: '017',
         productDescription: 'TRANSACTOR',
         isPlastic: false,
         accountType: 'CA',
         nickname: 'TRANS 02',
         sourceSystem: 'Profile System',
         currency: 'ZAR',
         availableBalance: 13268.2,
         currentBalance: 13317.2,
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
      };
   }

   const returnValueMakeTransfer = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: ''
               },
               {
                  operationReference: 'ABC',
                  result: 'FV01',
                  status: 'ERROR',
                  reason: ''
               }
            ]
         }
      ]
   });
   const returnValueMakeTransferNoTransaction = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'ABC',
                  result: 'FV01',
                  status: 'FAILURE',
                  reason: ''
               }
            ]
         }
      ]
   });
   const transferReturnValue: any = {
      bFName: 'John Doe',
      startDate: '2017-08-18T00:00:00',
      nextTransDate: '2017-08-18T00:00:00',
      bank: 'National Bank',
      amount: 1234,
      toAccount: {
         accountNumber: '1234',
         accountType: 'OA'
      },
      fromAccount: {
         accountNumber: '1234',
         accountType: 'CA'
      }
   };

   const transferAmountVmValue: ITransferAmountVm = {
      allowedTransferLimit: 1000,
      amount: 125,
      payDate: null,
      isValid: false,
      reoccurrenceItem: null,
      isTransferLimitExceeded: false,
      selectedToAccount: getActiveAccountsData(),
      selectedFromAccount: getActiveAccountsData(),
      availableTransferLimit: 12345
   };


   const transferServiceStub = {
      getTransferDetailInfo: jasmine.createSpy('getTransferDetailInfo').and.returnValue(transferReturnValue),
      isTransferStatusNavigationAllowed: jasmine.createSpy('isTransferStatusNavigationAllowed').and.returnValue(true),
      clearTransferDetails: jasmine.createSpy('clearTransferDetails').and.callThrough,
      updateTransactionID: jasmine.createSpy('updateTransactionID').and.callThrough,
      retryTransfer: jasmine.createSpy('retryTransfer').and.returnValue(returnValueMakeTransfer),
      makeTransfer: jasmine.createSpy('makeTransfer').and.returnValue(Observable.fromPromise(new Promise(function (resolve, reject) {
         reject('Unsuccessful');
      }))),
      updateexecEngineRef: () => { },
      getTransferAmountVm: jasmine.createSpy('getTransferAmountVm').and.returnValue(transferAmountVmValue),
      raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
      createGUID: jasmine.createSpy('createGUID'),
      raiseSystemErrorforAPIFailure: jasmine.createSpy('raiseSystemErrorforAPIFailure').and.callFake(() => { })
   };

   const gaTrackingServiceStub = {
      sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [TransferStatusComponent, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: TransferService, useValue: transferServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ReportsService, useValue: { open: jasmine.createSpy('open').and.returnValue(undefined) } }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransferStatusComponent);
      component = fixture.componentInstance;
      transferService = fixture.debugElement.injector.get(TransferService);
      router = TestBed.get(Router);
      location = TestBed.get(Location);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should contain new transfer', () => {
      expect(component.newTransfer).toBeDefined();
   });

   it('should contain Go to Dahsboard', () => {
      expect(component.goToDashboard).toBeDefined();
   });

   it('should defined heading ', () => {
      expect(component.heading).toBeDefined();
   });

   it('should defined  transfer status ', () => {
      expect(component.successful).toBeDefined();
   });

   it('should redirect to transfer on new transfer', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.newTransfer();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/transfer');
   }));

   it('should fetch transfer details on init', () => {
      expect(component.transferDetail).toBeDefined();
   });
   it('should redirect to dashboard if navigated', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.goToDashboard();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   }));

   it('should redirect to transfer if navigation is not allowed',
      inject([Injector], (injector: Injector) => {
         const spy = spyOn(router, 'navigateByUrl');
         transferService.isTransferStatusNavigationAllowed = jasmine.createSpy('isTransferStatusNavigationAllowed').and.returnValue(false);
         const comp = new TransferStatusComponent(router, transferService, injector, null);
         comp.ngOnInit();
         const url = spy.calls.first().args[0];
         expect(url).toBe('/transfer');
      }));

   it('should set successful to true on transfer successful', fakeAsync(() => {
      transferReturnValue.transactionID = '1234';
      transferService.getTransferDetailInfo = jasmine.createSpy('getTransferDetailInfo').and.returnValue(transferReturnValue);
      component.ngOnInit();
      expect(component.successful).toBe(true);
   }));

   it('should set successful to false if transfer not-successful', fakeAsync(() => {
      transferReturnValue.transactionID = '';
      transferService.getTransferDetailInfo = jasmine.createSpy('getTransferDetailInfo').and.returnValue(transferReturnValue);
      component.ngOnInit();
      expect(component.successful).toBe(false);
   }));

   it('should load unsuccessful transfer status and not disable retry button', () => {
      transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and.returnValue(false);
      transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.callFake(function (validate = false) {
         if (!validate) {
            return returnValueMakeTransfer;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.retryTransfer();
      expect(component.successful).toBe(false);
      expect(component.disableRetryButton).toBe(false);
   });
   it('should load successful transfer status and disable retry button if clicked once on every transfer success  ', () => {
      transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and.returnValue(true);

      transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.callFake(function (validate = false) {
         if (!validate) {
            return returnValueMakeTransfer;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.retryTransfer();
      expect(component.successful).toBe(true);
   });

   it('should retry the transfer upto 3 times on payment failure', fakeAsync(() => {
      component.retryTransfer();
      expect(component.successful).toBe(false);
      component.retryTransfer();
      expect(component.successful).toBe(false);
      component.retryTransfer();
      expect(component.successful).toBe(false);
      component.retryTransfer();
      expect(component.disableRetryButton).toBe(true);
   }));

   it('should show unsuccessful status and not disable try again button if on retry transfer is successful but transfer status is invalid ',
      () => {
         transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and.returnValue(false);
         transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
         component.retryTransfer();
         expect(component.successful).toBe(false);
         expect(component.disableRetryButton).toBe(false);
      });

   it('should load unsuccessful transfer status and disable retry button', () => {
      transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and
         .callFake(function (metadata: ITransferMetaData) {
            transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and
               .callFake(function (metadataObj: ITransferMetaData) {
                  return false;
               });
            transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.callFake(function (validate = false) {
               if (!validate) {
                  return returnValueMakeTransferNoTransaction;
               } else {
                  return Observable.create(observer => {
                     observer.error(new Error('error'));
                     observer.complete();
                  });
               }
            });
            return true;
         });
      transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.callFake(function (validate = false) {
         if (!validate) {
            return returnValueMakeTransfer;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.retryTransfer();
      expect(component.successful).toBe(false);
      expect(component.disableRetryButton).toBe(false);
   });


   it('should load unsuccessful transfer status when second call fails', () => {
      transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and.returnValue(true);
      let calledFirstTime = false;
      transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.callFake(function (validate = false) {
         if (!calledFirstTime) {
            calledFirstTime = true;
            return returnValueMakeTransfer;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.retryTransfer();
      expect(component.successful).toBe(false);
      expect(transferService.raiseSystemErrorforAPIFailure).toHaveBeenCalled();
   });

});
