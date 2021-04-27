import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferComponent } from './offer.component';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { EventEmitter } from '@angular/core';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { ApiService } from '../../core/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
// tslint:disable-next-line:import-blacklist
import { Observable, Subject } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { assertModuleFactoryCaching } from '../../test-util';

const workflowServiceStub = {
  workflow: [{ step: 'one', valid: true, isValueChanged: true },
  { step: 'two', valid: true, isValueChanged: false },
  { step: 'three', valid: false, isValueChanged: true },
  { step: 'four', valid: false, isValueChanged: false }],

  stepClickEmitter: new EventEmitter<string>()
};

const  OfferVm = {
  isDropdownOpen: true,
  skeletonMode: false,
  monthlyPayment: 1687,
  config: { min: 1000, max: 50000, step: 100 },
  loanValue: 5000,
  selectedTerm: { term: 1, minimum: 1000, maximum: 3000, interestRate: 22 },
  terms: [],
  termsAvailable: [{ term: 12, minimum: 1000, maximum: 10000, interestRate: 10.7 },
    { term: 24, minimum: 10000, maximum: 25000, interestRate: 12.7 },
    { term: 48, minimum: 30000, maximum: 40000, interestRate: 16.7 },
    { term: 60, minimum: 30000, maximum: 50000, interestRate: 18.7 },
    { term: 36, minimum: 25000, maximum: 40000, interestRate: 14.7 }],
  showCalculate: false,
  amountInvalid: false
};

const loanInformation = {
  fieldSections: [
    { title: 'Total monthly repayment', fields: Array(3), total: 'R1 659.67 p/m' },
    { title: 'Details of your loan', fields: Array(7), total: '' }],
  ranges: [
    { term: 12, minimum: 1000, maximum: 10000, interestRate: 10.7 },
    { term: 24, minimum: 10000, maximum: 25000, interestRate: 12.7 },
    { term: 48, minimum: 30000, maximum: 40000, interestRate: 16.7 },
    { term: 60, minimum: 30000, maximum: 50000, interestRate: 18.7 },
    { term: 36, minimum: 25000, maximum: 40000, interestRate: 14.7 }
  ],
  totalMonthlyRepayment: 1659.67
};

const loan = { term: 12, minimum: 1000, maximum: 10000, interestRate: 10.7 };
const apiServiceStub = {
};

const preApprovedOffersServiceStub = {
  getLoanInformation: jasmine.createSpy('getLoanInformation').and.returnValue(Observable.create(obs => {
    obs.next(loanInformation);
    obs.complete();
  })),
  getGetOfferVm: jasmine.createSpy('getGetOfferVm ').and.callFake(() => {
    return OfferVm;
  }),
  changeOfferStatusById: jasmine.createSpy('changeOfferStatusById').and.callFake(() => {
    return Observable.create(obs => {
      obs.next();
      obs.complete();
    });
  })
};

describe('OfferComponent', () => {
  let component: OfferComponent;
  let fixture: ComponentFixture<OfferComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferComponent ],
      imports: [SharedModule],
      providers: [
        { provide: WorkflowService, useValue: workflowServiceStub },
        { provide: ActivatedRoute, useValue: {
          params: Observable.of({
            offerId: 1
          })
        } },
        { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub },
        { provide: Router , useValue: {}},
        { provide: ApiService, useValue: apiServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    OfferVm.terms = [];
  });
  it('should handle showCalculate', () => {
    loan.term = 60;
    component.onTermChange(loan);
    expect(component.offerVm.showCalculate).toBeFalsy();
    loan.term = 30;
    component.onTermChange(loan);
    expect(component.offerVm.showCalculate).toBeTruthy();
  });

  it('should handle onSliderValueChanged', () => {
    component.onSliderValueChanged(5000);
    expect(component.offerVm.showCalculate).toBeTruthy();
  });

  it('should handle onAmountChange', () => {
    component.onAmountChange({target: { value: 5000 }});
    expect(component.offerVm.showCalculate).toBeTruthy();
    component.offerVm.showCalculate = false;
    component.onAmountChange({ target: { value: 500000 } });
    expect(component.offerVm.showCalculate).toBeTruthy();
  });
  it('should handle calculate', () => {
    component.calculate();
    expect(component.offerVm.skeletonMode).toBeFalsy();
  });

  it('should handle formatAmount', () => {
    component.formatAmount({ target: { value: 'R5000.00' } });
    expect(component.offerVm.loanValue).toBe(5000);
  });
  it('should handle next()', () => {
    component.next();
    expect(component.workflowStep[2].valid).toBeFalsy();
  });
});
