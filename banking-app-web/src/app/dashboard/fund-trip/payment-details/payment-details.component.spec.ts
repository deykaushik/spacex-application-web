import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailsComponent } from './payment-details.component';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { FundTripService } from '../fund-trip.service';
import { PaymentService } from '../../../payment/payment.service';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { Observable } from 'rxjs/Observable';
import {PaymentDetailsModel} from './payment-details.model';
import { IPrepaidLimitDetail } from '../../../core/services/models';

const paymentVM = {
  amount: 10,
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

const tempAccount = {
  itemAccountId: 'newitemAccountId',
  accountNumber: 'newaccountNumber',
  productCode: 'newproductCode',
  productDescription: 'newproductDescription',
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
};

const paymentLimit = {
  availableLimit: { amount: 100 },
  annualLimit: { amount: 1000 },
  transactionLimit: { amount: 100 }
};

const clientProfileDetailsServiceStub = {
  getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(tempAccount)
};

const quoteVM = {
  currency: {
    ccycde: 'EUR',
    ccyname: 'ccyname',
    Ccyno: 'ccyno',
    Multydivind: 'Multydivind',
    Decimalpoints: 1
  },
  fromCurrencyValue: 'fromCurrencyValue',
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
    }
  },
  quotationReference: 'quotationReference'
};

const mockPaymentLimit: IPrepaidLimitDetail[] = [{
  limitType: 'limitType',
  dailyLimit: 100,
  userAvailableDailyLimit: 100,
  maxDailyLimit: 100,
  isTempLimit: true,
  maxTmpDateRangeLimit: 100
}];

const fundTripServiceStub = {
  getPaymentDetailsVm: jasmine.createSpy('getPaymentDetailsVm').and.returnValue(paymentVM),
  getPaymentLimits: jasmine.createSpy('getPaymentLimits').and.returnValue(Observable.of(paymentLimit)),
  savePaymentDetailsInfo : jasmine.createSpy('savePaymentDetailsInfo'),
  getGetQuoteVm : jasmine.createSpy('getGetQuoteVm').and.returnValue(quoteVM),
  getPaymentLimit : jasmine.createSpy('getPaymentLimit').and.returnValue(Observable.of(mockPaymentLimit))
};

const paymentServiceStub = {
  getActiveCasaAccounts: jasmine.createSpy('getActiveCasaAccounts').and.returnValue(Observable.of([paymentVM.toAccount]))
};


describe('PaymentDetailsComponent', () => {
  let component: PaymentDetailsComponent;
  let fixture: ComponentFixture<PaymentDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentDetailsComponent, AmountTransformPipe],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
        { provide: FundTripService, useValue: fundTripServiceStub },
        { provide: PaymentService, useValue: paymentServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    component.ngOnInit();
    fundTripServiceStub.getPaymentLimits().subscribe();
    expect(component).toBeTruthy();
    expect(component.transactionLimit).toEqual(100);
    paymentServiceStub.getActiveCasaAccounts().subscribe();
    expect(component.accounts[0].accountNumber).toEqual('accountNumber');
    expect(component.vm.toAccount.accountNumber).toEqual('newaccountNumber');
    expect(component.vm.amount).toEqual(paymentVM.amount);
    const instance = new PaymentDetailsModel;
    instance.getStepTitle(true, true);
  });

  it('should change amount', () => {
    component.onAmountChange(1000);
    expect(component.vm.amount).toEqual(1000);
    expect(component.insufficientFunds).toBeTruthy();
  });

  it('should select account', () => {
    component.ngOnInit();
    component.onAccountSelection(tempAccount);
    expect(component.vm.toAccount.accountNumber).toEqual('newaccountNumber');
    expect(component.insufficientFunds).toBeTruthy();
  });

  it('should go to next step', () => {
    component.nextClick(1);
    expect(fundTripServiceStub.savePaymentDetailsInfo).toHaveBeenCalled();
  });

  it('should omit special chars', () => {
    expect(component.omitSpecialChar({charCode : 50})).toBeTruthy();
  });
});
