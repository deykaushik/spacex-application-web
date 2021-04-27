import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetQuoteComponent } from './get-quote.component';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { FundTripService } from '../fund-trip.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { GetQuoteModel } from './get-quote.model';

const quote = {
  currency: {
    ccycde: 'EUR',
    ccyname: 'ccyname',
    Ccyno: 'ccyno',
    Multydivind: 'Multydivind',
    Decimalpoints: 1
  },
  fromCurrencyValue: 'fromCurrencyValue',
  toCurrencyValue: 'toCurrencyValue',
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

const mockOperatingHours = {
  data: {
    operatingHours: [
      {
        dayOfWeek: 'Monday',
        startTime: '07:30',
        endTime: '23:00'
      },
      {
        dayOfWeek: 'Tuesday',
        startTime: '07:30',
        endTime: '23:00'
      },
      {
        dayOfWeek: 'Wednesday',
        startTime: '07:30',
        endTime: '23:00'
      },
      {
        dayOfWeek: 'Thursday',
        startTime: '07:30',
        endTime: '23:00'
      },
      {
        dayOfWeek: 'Friday',
        startTime: '07:30',
        endTime: '23:00'
      },
      {
        dayOfWeek: 'Saturday',
        startTime: '07:30',
        endTime: '23:00'
      },
      {
        dayOfWeek: 'Sunday',
        startTime: '07:30',
        endTime: '23:00'
      }
    ],
    cutOffTime: 15
  }
};

const currRates = {
  quotationReference: 'quoRef',
  foreignCurrenciesTransactions: [{
    foreignCurrency: {
      buyCurrency: { currency: 'EUR' },
      sellCurrency: { amount: 10 }
    },
    exchangeRate: 1234,
    commisionCharge: { amount: 100 },

  }],
};

const routerStub = {
  navigate: jasmine.createSpy('navigate').and.returnValue(true)
};

describe('GetQuoteComponent', () => {
  let component: GetQuoteComponent;
  let fixture: ComponentFixture<GetQuoteComponent>;

  const fundTripServiceStub = {
    getGetQuoteVm: jasmine.createSpy('getGetQuoteVm').and.returnValue(quote),
    getCurrencies: jasmine.createSpy('getCurrencies').and.returnValue(Observable.of({ data: 'EUR' })),
    getCurrencyConversionRates: jasmine.createSpy('getCurrencyConversionRates').and.returnValue(Observable.of(currRates)),
    saveGetQuoteInfo: jasmine.createSpy('saveGetQuoteInfo'),
    getOperatingHours: jasmine.createSpy('getOperatingHours').and.returnValue(Observable.of(mockOperatingHours))
  };

  const dataServiceStub = {
    getData: jasmine.createSpy('getData').and.returnValue(quote.clientDetails),
    getTripStatus: jasmine.createSpy('getTripStatus').and.returnValue('ACTV')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetQuoteComponent, AmountTransformPipe],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      providers: [{ provide: Router, useValue: routerStub },
      { provide: DataService, useValue: dataServiceStub }, { provide: FundTripService, useValue: fundTripServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    fundTripServiceStub.getCurrencies().subscribe();
    expect(component.currencies).toEqual('EUR');
    expect(component).toBeTruthy();
    expect(component.vm).toBeDefined();
    expect(component.vm.clientDetails).toBeDefined();
    component.vm = null;
    // expect(component.vm.clientDetails).toEqual(quote.clientDetails);
  });

  it('should validate', () => {
    spyOn(component.isComponentValid, 'emit');
    component.validate();
    expect(component.isComponentValid.emit).toHaveBeenCalled();
  });

  it('should change currency type', () => {
    spyOn(component.showNextButton, 'emit');
    component.ngOnInit();
    component.onCurrencyTypeChanged(quote.currency);
    expect(component.vm.currency.ccycde).toEqual(quote.currency.ccycde);
    expect(component.showNextButton.emit).toHaveBeenCalled();
  });

  it('should change amount', () => {
    spyOn(component.showNextButton, 'emit');
    component.ngOnInit();
    component.onAmountChange(9876);
    expect(component.vm.fromCurrencyValue).toEqual(9876);
    expect(component.showNextButton.emit).toHaveBeenCalled();
  });

  it('should set decimal to six digits', () => {
   expect(component.fixedPrecision(12321.123123123)).toEqual('12321.123123');
   expect(component.fixedPrecision(12321.123)).toEqual(12321.123);
 });

  it('should calculate quote', () => {
    spyOn(component.showNextButton, 'emit');
    component.calculateQuote('');
    expect(component.quotationSection).toBeTruthy();
    expect(component.quoteDetails['EUR'].exchangeRate).toEqual(currRates.foreignCurrenciesTransactions[0].exchangeRate);
    expect(component.showNextButton.emit).toHaveBeenCalled();
  });

  it('should decline click', () => {
    spyOn(component.showNextButton, 'emit');
    component.declineClick();
    expect(component.vm.currency).toBeNull();
    expect(component.showNextButton.emit).toHaveBeenCalled();
  });

  it('should get conversion rates', () => {
    const res = component.getConversionRates(['a'], 1);
    expect(res.currencies[0].buyCurrency.currency).toEqual('a');
  });

  it('should save quote info', () => {
    component.showOperatingHourMessage = true;
    component.nextClick(1);
    expect(fundTripServiceStub.saveGetQuoteInfo).toHaveBeenCalled();
  });

  it('should click step', () => {
    component.stepClick({ activeStep: 1, stepClicked: 2 });
  });

  it('should parse exchange rates', () => {
    const mockRetes = {
      quotationReference: 'quoRef',
      minutesToServiceShutdown: 15,
      foreignCurrenciesTransactions: [{
        foreignCurrency: {
          buyCurrency: { currency: 'EUR' },
          sellCurrency: { amount: 10 }
        },
        exchangeRate: 1234,
        commisionCharge: { amount: 100 },

      }],
    };
    component.parseExchangeRates(mockRetes);
    expect(component.showOperatingHourMessage).toBeFalsy();
  });

  it('should parse exchange Rate', () => {
    const rate = component.formatExchangeRate(2, 'ZAR');
    expect(rate).toEqual(1 / 2);
  });
});

describe('GetQuoteComponent', () => {
  let component: GetQuoteComponent;
  let fixture: ComponentFixture<GetQuoteComponent>;

  const fundTripServiceStub = {
    getGetQuoteVm: jasmine.createSpy('getGetQuoteVm').and.returnValue(quote),
    getCurrencies: jasmine.createSpy('getCurrencies').and.returnValue(Observable.of({ data: 'EUR' })),
    getCurrencyConversionRates: jasmine.createSpy('getCurrencyConversionRates').and.returnValue(Observable.throw({ error: 400 })),
    saveGetQuoteInfo: jasmine.createSpy('saveGetQuoteInfo'),
    getOperatingHours: jasmine.createSpy('getOperatingHours').and.returnValue(Observable.of(mockOperatingHours))
  };

  const dataServiceStub = {
    getData: jasmine.createSpy('getData').and.returnValue(null),
    getTripStatus: jasmine.createSpy('getTripStatus').and.returnValue('FUTY')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetQuoteComponent, AmountTransformPipe],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      providers: [{ provide: Router, useValue: routerStub },
      { provide: DataService, useValue: dataServiceStub }, { provide: FundTripService, useValue: fundTripServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    const instance = new GetQuoteModel;
    instance.getStepTitle(true, true);
    fundTripServiceStub.getCurrencies().subscribe();
    expect(routerStub.navigate).toHaveBeenCalled();
  });
});

describe('GetQuoteComponent', () => {
  let component: GetQuoteComponent;
  let fixture: ComponentFixture<GetQuoteComponent>;

  const fundTripServiceStub = {
    getGetQuoteVm: jasmine.createSpy('getGetQuoteVm').and.returnValue(quote),
    getCurrencies: jasmine.createSpy('getCurrencies').and.returnValue(Observable.of({ data: 'EUR' })),
    getCurrencyConversionRates: jasmine.createSpy('getCurrencyConversionRates').and.returnValue(Observable.throw({ error: 400 })),
    saveGetQuoteInfo: jasmine.createSpy('saveGetQuoteInfo'),
    getOperatingHours: jasmine.createSpy('getOperatingHours').and.returnValue(Observable.of(mockOperatingHours))
  };

  const dataServiceStub = {
    getData: jasmine.createSpy('getData').and.returnValue(quote.clientDetails),
    getTripStatus: jasmine.createSpy('getTripStatus').and.returnValue('ACTV')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GetQuoteComponent, AmountTransformPipe],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      providers: [{ provide: Router, useValue: routerStub },
      { provide: DataService, useValue: dataServiceStub }, { provide: FundTripService, useValue: fundTripServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should throw error on currency type change', () => {
    component.onCurrencyTypeChanged('EUR');
    fundTripServiceStub.getCurrencyConversionRates().subscribe(response => { response = response; }, (error) => {
      expect(component.loading).toBeFalsy();
    });
  });

  it('should throw error on calculate currency quote', () => {
    component.calculateQuote('EUR');
    fundTripServiceStub.getCurrencyConversionRates().subscribe(response => { response = response; }, (error) => {
      expect(component.loading).toBeFalsy();
    });
  });
});
