import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPaymentComponent } from './review-payment.component';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { FundTripService } from '../fund-trip.service';
import { COMPONENT_VARIABLE } from '@angular/platform-browser/src/dom/dom_renderer';
import { FormsModule } from '@angular/forms';
import { ReviewPaymentModel } from './review-payment.model';
import { Constants } from '../../../core/utils/constants';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ITermsAndConditions } from '../../../core/services/models';

const labels = Constants.labels;

const quote = {
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

const paymentVM = {
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

const paymentReviewVM = {
  isPaymentSuccessful: true,
  cardNumber: 1234,
  transactionResponse: 'transactionResponse'
};

const mockTnCData: ITermsAndConditions = {
  noticeTitle: 'noticeTitle',
  noticeType: 'noticeType',
  versionNumber: 1,
  newVersionNumber: 2,
  acceptedDateTime: 'acceptedDateTime',
  noticeDetails: {
    noticeContent: '7VjNbhs3EL4HyDsMfDBsQLKt2E1jWYohu0phwFEEySiQ3ijurJYNl9yQXNvbV+uhj9RX6JDc1X8OLYq6gApY1i45pL' +
      'jfN/PNzP7x2++96+dcwiMaK7TqH3ROzg4AFdeJUPP+QenS9ruD6/evX/WmyEsjXDXSTnCkEYBefd0bM8PmhhXZ+0PprsbAJbO2/9HqkTY5' +
      'k2BdJbF/+LXU7urjYPLj3agLZzyPn8LB928KF2cP5/ShPabjwQgkozMMR+2fB2s75Fa3mbKi7edLNscuBKP1HT58Gj1Ayjj2b5kUMyP8xMN' +
      'k8NPwHn4Y3t4PJoOHu08jb+oh6CqWoy3IHgqDqXiGPsQNdfwCZRdDpVFdyzPMmW3nghttderaXOddnaaESP1VLzxtjqS7RXN5unrtj7q48U++' +
      'uBn7q9ev/h6qnbN3O2G9/udAXjvtTsSnTKIFhya33X3F4LMugRmEDA3OKmCly7QRFhNwGhKcCQcuQ2Az/Uj/Odelckf2GJ6Ey+JM7ocsMAtCJY' +
      'Izh8kJHE017QSD1NCIgglaNLTBDVNf4B7nwkrmKKihDcNnntEjINxq5YyWYHBexlnbgs7l287xyb6Sc9fQkiCdn1hyGXNAo4ywnCEqgjyl5yG2yK' +
      'giKnUaSDH4tRQGc/TM0NgKpvDm6OIYmErg6Lvjxv62NIaUtQrjDSMWBty14NIbdS7Pz1v0a1yWXn2BSSKqlHRpwxouDKdfMESZFytZdeNZ/ea82Txn' +
      'CfnLIxOSzSR6B8uRBivQSlb0PFB6v6MHCsuK0hTaIgEbXGp/feBJENjOEOcyhJ1Q8PYMElbZhr6EEPLXeeVRI/ZsuCUkUcwVYE3ovmOotFviswkOpEbn' +
      '5MurEpggZQhDbu+t0C7wjh7tIBGWG/RhxUzlY0I/MUVZmhaErLJpv6V1kxhC+0tM8FlnRAHCAvfgSYlJC2rGqNopSV282mzx5ZORSWKiyoOa7CSvjpjzZc' +
      'TUPxMTkPMKq9P9ZSACTUUhYeWl1zK5AeavCzBbO9Ak/igEqOr0i1azfivQVqog6osc0MTfUuc9+7RxJngWz0KJgGtFZb+L5G6UEpRuXoKtb/QB/' +
      'ypZ48Hn4WS62SLsp9vuqIxepIi/uHh5NHwYxUowilpK4ShsRuET63bSVmdKjJWapkjkzueoUMRRY0m39kWawP8Kdgt1YkUhRa1NjRYF/QoVaqNYHj' +
      'FBTfRGibq3EDJFcah56duN6IB1/5FsVULTweSmqXqCO05WOpOCnJG2iMtsWRTauLgwODAdlfGwPd363ES2RML/jrziyNp3aP512W7c6M9ZlCnoUNWS' +
      '+S+linOhode+HFpdYpf7VAUuy2jOKCwCu/SrJDHGUyBFLkhYch8Tf5F6SvMUar7KxmSPI+kOGPUgT4tWf1PYDXrAqP8mvLbYbQRrqf6+eCLUWxH/jTcyj' +
      '6goJUzRPAqO0eSDUFQbC0LrjsJQSjFH387cUqCZmD3WrerFFm40M8lVsNhX6urwc77Piz2Fl6kvSj+pgAv1MWis0zq8q8ljM76GyLdQ2wZqa3j9cRdTvdPl2' +
      '+/e6eLteO9044X5nw==',
    versionDate: 'versionDate'
  }
};

const routerStub = {
  navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(true)
};

describe('ReviewPaymentComponent', () => {
  let component: ReviewPaymentComponent;
  let fixture: ComponentFixture<ReviewPaymentComponent>;

  const fundTripServiceStub = {
    getGetQuoteVm: jasmine.createSpy('getGetQuoteVm').and.returnValue(quote),
    getPaymentDetailsVm: jasmine.createSpy('getPaymentDetailsVm').and.returnValue(paymentVM),
    getPaymentReviewVm: jasmine.createSpy('getPaymentReviewVm').and.returnValue(paymentReviewVM),
    fundTrip: jasmine.createSpy('fundTrip').and.returnValue(Observable.of(paymentReviewVM)),
    savePaymentReviewInfo: jasmine.createSpy('savePaymentReviewInfo'),
    getSarbTnc: jasmine.createSpy('getSarbTnc').and.returnValue(Observable.of(mockTnCData))
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewPaymentComponent, AmountTransformPipe],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: Router, useValue: routerStub }, { provide: FundTripService, useValue: fundTripServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    const instance = new ReviewPaymentModel;
    component.tnc = true;
    component.tncSarb = true;
    component.tncPDF = true;
    expect(component).toBeTruthy();
    instance.getStepTitle(true, true);
    expect(component.getQuoteVm.currency.ccycde).toEqual(quote.currency.ccycde);
    instance.getStepTitle(true, false);
    const vm = instance.getViewModel();
    instance.updateModel(vm);
    expect(component.paymentDetailsVm.amount).toEqual(paymentVM.amount);
    expect(component.paymentReviewVm.cardNumber).toEqual(paymentReviewVM.cardNumber);
    fundTripServiceStub.getSarbTnc().subscribe(response => {
      expect(component.noticeContent).toEqual(mockTnCData);
    });
  });

  it('should trip fund', () => {
    component.fundTrip();
    fundTripServiceStub.fundTrip().subscribe();
    expect(fundTripServiceStub.savePaymentReviewInfo).toHaveBeenCalled();
    expect(routerStub.navigateByUrl).toHaveBeenCalled();
  });

  it('should react on next click', () => {
    component.nextClick();
    expect(fundTripServiceStub.fundTrip).toHaveBeenCalled();
  });

  it('should validate', () => {
    component.tnc = true;
    component.tncSarb = true;
    component.tncPDF = true;
    spyOn(component.isComponentValid, 'emit');
    component.validate();
    expect(component.isComponentValid.emit).toBeTruthy();
  });

  it('should toggle on clicking sarb link', () => {
    component.showSARBTerms = true;
    component.onClickSarbLink();
    expect(component.showSARBTerms).toBeFalsy();
  });
});

describe('ReviewPaymentComponent', () => {
  let component: ReviewPaymentComponent;
  let fixture: ComponentFixture<ReviewPaymentComponent>;
  const fundTripServiceStub = {
    getGetQuoteVm: jasmine.createSpy('getGetQuoteVm').and.returnValue(quote),
    getPaymentDetailsVm: jasmine.createSpy('getPaymentDetailsVm').and.returnValue(paymentVM),
    getPaymentReviewVm: jasmine.createSpy('getPaymentReviewVm').and.returnValue(paymentReviewVM),
    fundTrip: jasmine.createSpy('fundTrip').and.returnValue(Observable.throw({ error: 200 })),
    savePaymentReviewInfo: jasmine.createSpy('savePaymentReviewInfo'),
    getSarbTnc: jasmine.createSpy('getSarbTnc').and.returnValue(Observable.of(mockTnCData))
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewPaymentComponent, AmountTransformPipe],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: Router, useValue: routerStub }, { provide: FundTripService, useValue: fundTripServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should return error on fund trip', () => {
    spyOn(component.isButtonLoader, 'emit').and.returnValue(false);
    component.fundTrip();
    fundTripServiceStub.fundTrip().subscribe(response => { response = response; }, (error) => {
      expect(component.isButtonLoader.emit).toHaveBeenCalled();
    });
  });
});
