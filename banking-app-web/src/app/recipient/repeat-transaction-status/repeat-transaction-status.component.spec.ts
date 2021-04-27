import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';
import { fakeAsync } from '@angular/core/testing';
import { tick } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../test-util';
import { Constants } from '../../core/utils/constants';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { PaymentService } from '../../payment/payment.service';
import { RepeatTransactionStatusComponent } from './repeat-transaction-status.component';

describe('RepeatTransactionStatusComponent', () => {
  let component: RepeatTransactionStatusComponent;
  let fixture: ComponentFixture<RepeatTransactionStatusComponent>;
  let paymentService: PaymentService;
  let router;
 const paymentDetails: any = {
  bFName: 'name',
  bank: 'bank',
  amount: 1234,
  toAccount: {
     accountNumber: '1234'
  },
  fromAccount: {
     accountNumber: '1234',
     accountType: 'CC'
  },
  cellphone: '123',
  myDescription: 'abc',
  beneficiaryDescription: 'abc'
};

const paymentReturnValue: any = {
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
  beneficiaryDescription: 'abc',
  transactionID: '1234',
  paymentDetails: {
     resultData: [
        {
           resultDetail: [
              {
                 operationReference: 'TRANSACTION',
                 result: 'FV01',
                 status: 'SUCCESS',
                 reason: '',
              },
              {
                 operationReference: 'ABC',
                 result: 'FV01',
                 status: 'ERROR',
                 reason: ''
              },
           ],
           transactionID: 123
        }
     ]
  },
};
  const paymentServiceStub = {
    getPaymentDetailInfo: jasmine.createSpy('getPaymentDetailInfo').and.returnValue(paymentReturnValue),
    clearPaymentDetails: jasmine.createSpy('clearPaymentDetails').and.callThrough,
    getPayForVm: jasmine.createSpy('getPayForVm').and.returnValue(paymentDetails),
    getPayToVm: jasmine.createSpy('getPayToVm').and.returnValue({ isAccountPayment: false }),
    getPaymentStatus: jasmine.createSpy('getPaymentStatus').and.returnValue(false),
    getPayAmountVm: jasmine.createSpy('getPayToVm').and.returnValue({ selectedAccount: { accountType: 'CC', productCode: 'abc' } }),
    paymentDetails: {
       resultData: [
          {
             resultDetail: [
                {
                   operationReference: 'TRANSACTION',
                   result: 'FV01',
                   status: 'SUCCESS',
                   reason: '',
                },
                {
                   operationReference: 'ABC',
                   result: 'FV01',
                   status: 'ERROR',
                   reason: ''
                },
             ],
             transactionID: 123
          }
       ]
    }
 };

  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [RepeatTransactionStatusComponent, AmountTransformPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: PaymentService, useValue: paymentServiceStub }
      ]
   })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatTransactionStatusComponent);
    component = fixture.componentInstance;
    paymentService = fixture.debugElement.injector.get(PaymentService);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle invalid recipient saved error', () => {
    paymentService.isInvalidRecipientSaved = Constants.Statuses.No;
    const comp = new RepeatTransactionStatusComponent(router, paymentService);
    comp.ngOnInit();
    component.ngOnInit();
    expect(component.apiFailureMessage).toBe(Constants.labels.BenificiaryErrorMsg);
  });

  it('should handle successful payment', () => {
    paymentService.getPaymentStatus = jasmine.createSpy('getPaymentStatus').and.returnValue(true);
    const comp = new RepeatTransactionStatusComponent(router, paymentService);
    comp.ngOnInit();
    component.ngOnInit();
    expect(component.successful).toBe(true);
  });

  it('should redirect to payment on new payment', fakeAsync(() => {
    const spy = spyOn(router, 'navigateByUrl');
    component.newPayment();
    tick();
    const url = spy.calls.first().args[0];
    expect(url).toBe('/payment');
 }));

 it('should redirect to dashboard on Go to overview', fakeAsync(() => {
  const spy = spyOn(router, 'navigateByUrl');
  component.navigateToDashboard();
  tick();
  const url = spy.calls.first().args[0];
  expect(url).toBe('/dashboard');
}));

it('should clear payment details on destroy', () => {
  const comp = new RepeatTransactionStatusComponent(router, paymentService);
  comp.ngOnDestroy();
  expect(paymentService.paymentDetails.bFName).toBeUndefined();
});
});
