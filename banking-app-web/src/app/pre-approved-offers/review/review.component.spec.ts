import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewComponent } from './review.component';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { SharedModule } from '../../shared/shared.module';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';

const ReviewVm = {
  fieldSections: [],
  isToolTip: [false, false, false],
  acceptCredit: true
};

const OfferVm = {
  fieldSections: [
    {
      title: 'Total monthly repayment',
      fields: [
        { name: 'Credit life insurance', value: 'R179.23', helpText: '', subText: '' },
        { name: 'Service fee', value: 'R69.00', helpText: '', subText: '' },
        { name: 'Base repayment', value: 'R1 411.44', helpText: '', subText: '' }
      ],
      total: 'R1 659.67 p/m'
    },

    {
     title: 'Details of your loan',
     fields: [
       { name: 'Amount we’ll pay into your account', value: 'R50 000.00', helpText: '', subText: '' },
       { name: 'Fixed interest rate', value: '21%', helpText: '', subText: '' },
       { name: 'Number of instalments', value: '60', helpText: '', subText: '' },
       { name: 'Initiation fee', value: 'R1 207.50', helpText: '', subText: '' },
       // tslint:disable-next-line:max-line-length
       { name: 'Credit cost multiple', value: '1.99', helpText: '', subText: 'The ratio of the total cost of credit (total amount, including costs and interest, that you’ll pay back) to the loan amount. This shows you the cost of each rand you borrow.' },
       { name: 'Total loan amount', value: 'R51 207.50', helpText: '', subText: 'Amount paid into your account plus an initiation fee.' },
       // tslint:disable-next-line:max-line-length
       { name: 'Total you’ll pay back', value: 'R99 580.20', helpText: '', subText: 'Total monthly instalments, including interest, credit insurance and a service fee' }
     ],
     total: ''
    }
  ],
  ranges: [
    { term: 12, minimum: 1000, maximum: 10000, interestRate: 10.7 },
    { term: 24, minimum: 10000, maximum: 25000, interestRate: 12.7 },
    { term: 48, minimum: 30000, maximum: 40000, interestRate: 16.7 },
    { term: 60, minimum: 30000, maximum: 50000, interestRate: 18.7 },
    { term: 36, minimum: 25000, maximum: 40000, interestRate: 14.7 }
  ],
  totalMonthlyRepayment: 1659.67
};

const workFlowStep: IStepper[] = [{ step: '', isValueChanged: false, valid: true },
 { step: '', isValueChanged: false, valid: true }, { step: '', isValueChanged : false, valid : true },
  { step: '', isValueChanged: false, valid: true }
];

const preApprovedOffersServiceStub = {
  getLoanInformation: jasmine.createSpy('getLoanInformation').and.returnValue(Observable.create(obs => {
    obs.next();
    obs.complete();
  })),
  getGetReviewVm: jasmine.createSpy('getGetReviewVm ').and.callFake(() => {
    return ReviewVm;
  }),
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

describe('ReviewComponent', () => {
  let component: ReviewComponent;
  let fixture: ComponentFixture<ReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewComponent ],
      imports: [SharedModule],
      providers: [
         WorkflowService,
        {
          provide: ActivatedRoute, useValue: {
            params: Observable.of({
              offerId: 1
            })
          }
        },
        { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub },
        { provide: Router, useValue: {
          navigate: jasmine.createSpy('navigate').and.returnValue([])
        } },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('should handle next()', () => {
    component.reviewVm.acceptCredit = false;
    component.next();
    component.reviewVm.acceptCredit = true;
    component.workflowStep = workFlowStep;
    component.next();
    expect(component.workflowStep[2].valid).toBeTruthy();
  });
});
