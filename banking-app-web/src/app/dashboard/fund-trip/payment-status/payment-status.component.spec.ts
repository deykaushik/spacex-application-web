import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusComponent } from './payment-status.component';
import { Router } from '@angular/router';
import { FundTripService } from '../fund-trip.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IPaymentReviewVm, IGetQuoteVm, IPaymentDetailsVm } from '../fund-trip.model';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';

const quote: IGetQuoteVm = {
  currency: {
    ccycde: 'EUR',
    ccyname: 'ccyname',
    Ccyno: 1,
    Multydivind: 'Multydivind',
    Decimalpoints: 1
  },
  fromCurrencyValue: 100,
  toCurrencyValue: '100',
  clientDetails: {
    email: 'email',
    passportNumber: 1234,
    rsaId: 'rsaId',
    areaCode: 1,
    phoneNumber: 987654,
    floor: 'floor',
    building: 'building',
    streetNumber: 1,
    streetName: 'streetName',
    suburb: 'suburb',
    city: 'city',
    postalCode: 1,
    fromAccount: {
      AccountNumber: 'AccountNumber',
      accountType: 'accountType',
      AccountName: 'AccountName'
    },
    transactionReference : 'transactionReference'
  },
  quotationReference: 'quotationReference'
};

const paymentVM: IPaymentDetailsVm = {
  amount: 1,
  toAccount: {
    itemAccountId: 'itemAccountId',
    accountNumber: 'accountNumber',
    productCode: 'productCode',
    productDescription: 'productDescription',
    isPlastic: true,
    accountType: 'accountType',
    nickname: 'nickname',
    sourceSystem: 'sourceSystem',
    currency: 'currency',
    availableBalance: 1,
    currentBalance: 1,
    profileAccountState: 'profileAccountState',
    accountLevel: 'accountLevel',
    rewardsProgram: 'rewardsProgram',
    viewAvailBal: true,
    viewStmnts: true,
    isRestricted: true,
    viewCurrBal: true,
    viewCredLim: true,
    viewMinAmtDue: true,
    isAlternateAccount: false,
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
      onceOffiMaliFrom: true,
      InternationalRemittance: true
    }
  },
  reference: 'reference'
};

const paymentReviewVM: IPaymentReviewVm = {
  isPaymentSuccessful: true,
  cardNumber: 1234,
  transactionReference: 'transactionReference',
  transferDate: new Date().toDateString(),
  totalAmount: {
    currency: 'USD',
    amount: 1000
  },
  senderReference: 'senderReference'
};

const fundTripServiceStub = {
  getGetQuoteVm: jasmine.createSpy('getGetQuoteVm').and.returnValue(quote),
  getPaymentDetailsVm: jasmine.createSpy('getPaymentDetailsVm').and.returnValue(paymentVM),
  getPaymentReviewVm: jasmine.createSpy('getPaymentReviewVm').and.returnValue(paymentReviewVM)
};

const routerStub = {
  navigate: jasmine.createSpy('navigate').and.returnValue(true)
};

describe('PaymentStatusComponent', () => {
  let component: PaymentStatusComponent;
  let fixture: ComponentFixture<PaymentStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentStatusComponent, AmountTransformPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: Router, useValue: routerStub }, { provide: FundTripService, useValue: fundTripServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(component.paymentDetailsVm.amount).toEqual(paymentVM.amount);
    expect(component.paymentReviewVm.cardNumber).toEqual(paymentReviewVM.cardNumber);
    expect(component.getQuoteVm.currency.ccycde).toEqual(quote.currency.ccycde);
  });

  it('should navigate to trips', () => {
    component.navigateToTrips();
    expect(routerStub.navigate).toHaveBeenCalled();
  });
});
