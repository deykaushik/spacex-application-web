import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { CommonUtility } from '../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import { GaTrackingService } from '../../core/services/ga.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { SharedModule } from '../../shared/shared.module';
import { TransferService } from './../transfer.service';
import { TransferReviewComponent } from './transfer-review.component';

const transferServiceStub = {
   transferWorkflowSteps: {
      amountStep: {
         isDirty: false
      },
      reviewStep: {
         isDirty: false
      }
   },
   getTransferAmountVm: jasmine.createSpy('getTransferAmountVm').and.returnValue({
      amount: 0,
      selectedFromAccount: null,
      selectedToAccount: null,
      repeatType: 'endDate',
      reference: null,
      reoccurrenceItem: {
         reoccurrenceFrequency: null,
         reoccurrenceOccur: null,
         reoccSubFreqVal: null,
         reoccurrenceToDate: null
      },
      payDate: Date.now()
   }),
   updateexecEngineRef: () => { },
   getTransferDetailInfo: jasmine.createSpy('getTransferDetailInfo').and.returnValue(
      {
         bFName: 'name',
         bank: 'bank',
         amount: 1234,
         toAccount: {
            accountNumber: '1234'
         },
         fromAccount: {
            accountNumber: '1234'
         },
         myDescription: 'abc',
         beneficiaryDescription: 'abc'
      }),
   saveTransferReviewInfo: jasmine.createSpy('saveTransferReviewInfo'),
   saveTransferAmountInfo: jasmine.createSpy('saveTransferAmountInfo'),
   makeTransfer: jasmine.createSpy('makeTransfer').and.callFake(function (validate = true) {
      return returnValueMakeTransfer;
   }),
   isTransferStatusValid: jasmine.createSpy('isTransferStatusValid').and.returnValue(true),
   updateTransactionID: jasmine.createSpy('updateTransactionID'),
   raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
   createGUID: jasmine.createSpy('createGUID'),
   raiseSystemErrorforAPIFailure: jasmine.createSpy('raiseSystemErrorforAPIFailure').and.callFake(() => { })
};
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

const routerTestingParam = [
   { path: 'transfer/status', component: TransferReviewComponent }
];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('TransferReviewComponent', () => {
   let component: TransferReviewComponent;
   let fixture: ComponentFixture<TransferReviewComponent>;
   let transferService: TransferService;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TransferReviewComponent, AmountTransformPipe],
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: TransferService, useValue: transferServiceStub }, SystemErrorService,
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransferReviewComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      transferService = fixture.debugElement.injector.get(TransferService);
      fixture.detectChanges();
   });

   it('should be created', inject([TransferService], (service: TransferService) => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
   }));

   it('should contain step handler', () => {
      expect(component.nextClick).toBeDefined();
   });
   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should load status component on every transfer failure ', () => {
      transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and.returnValue(false);
      component.nextClick(4);

      transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(4);
      expect(component.isButtonLoader.emit).toHaveBeenCalled();
   });


   it('should load status component on every transfer failure ', () => {
      transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and.returnValue(true);
      transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.callFake(function (validate = true) {
         if (validate) {
            return returnValueMakeTransfer;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(4);
      expect(transferService.raiseSystemErrorforAPIFailure).toHaveBeenCalled();
   });
   it('should load status component on every step failure ', () => {
      transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and.returnValue(true);
      transferService.makeTransfer = jasmine.createSpy('makeTransfer').and.callFake(function (validate = true) {
         if (validate) {
            return returnValueMakeTransfer;
         } else {
            transferService.isTransferStatusValid = jasmine.createSpy('isTransferStatusValid').and.returnValue(false);
            return returnValueMakeTransfer;
         }
      });
      const spy = spyOn(router, 'navigateByUrl');
      component.nextClick(4);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/transfer/status');
   });
});
