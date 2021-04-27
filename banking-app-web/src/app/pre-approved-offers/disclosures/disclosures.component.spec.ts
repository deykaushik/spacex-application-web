import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisclosuresComponent } from './disclosures.component';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { SharedModule } from '../../shared/shared.module';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { IRadioButtonItem } from '../../core/services/models';
import { DoneComponent } from '../done/done.component';

const limitTypes: IRadioButtonItem[] = [
  {label: 'option 1', value: '0', subTitle: 'sub 1'},
  { label: 'option 2', value: '1', subTitle: 'sub 2' }
];

const Disclosure = {
  data: [
    {
      name: 'disclosures',
      content: [
        {
          type: 'text', id: 1, title: 'Debit order mandate',
          content: [ 'You agree that we may debit your Nedbank salary account on the day your salary is paid.' ]
        },
        {
          type: 'text', id: 2, title: 'Credit and fraud check mandate',
          content: [ 'By accepting this offer, you agree that Nedbank may do credit and fraud checks when necessary.' ]
        },
        {
          type: 'text', id: 3, title: 'Honesty', content: [ 'You confirm that the information you’ve provided is correct.' ]
        },
        {
          type: 'option',
          id: 5,
          title: 'Spousal consent',
          description: `If you’re married in community of property or if you were married outside of South Africa, your spouse must agree
           in writing to your taking up this loan.`,
          required: true,
          content: [
            'You confirm that your spouse has agreed in writing.',
            'This does not apply to me.'
          ]
        },
        {
          type: 'dropdown',
          id: 6,
          title: 'Purpose of loan',
          description: '', required: true, content: [ 'Death/Funeral costs', 'Debt consolidation', 'Education cost', 'Furniture' ]
        }
      ]
    },
    {
      name: 'disclaimers',
      content: [
        {
          type: 'link',
          id: 7,
          title: 'View your policy terms and conditions.',
          content: [
            'https://www.nedbank.co.za/content/dam/nedbank/site-assets/Personal/Personal_Loans/TsandC/Personal_Loans_T&C.pdf'
          ],
          errorText: '*To continue with this application, please read and accept your policy terms and conditions.'
        },
        {
          type: 'text', id: 8, title: '', content: [ 'Your documents will be emailed to the address below.'  ]
        },
        {
          type: 'email',
          id: 9,
          title: 'Email',
          required: true,
          errorText: '*Please enter a valid email address.',  content: [ 'example.email.from.MDM@nedbank-example.co.za' ]
        }
      ]
    }
  ],
  metadata: { version: '1.4.0', status: 'error', message: 'There was an error', corid: 980759332 }
};

const preApprovedOffersServiceStub = {
  getDisclosureContent: jasmine.createSpy('getDisclosureContent').and.returnValue(Observable.create(obs => {
    obs.next(Disclosure);
    obs.complete();
  })),
  getGetDisclosureVm: jasmine.createSpy('getGetDisclosureVm ').and.callFake(() => {
    return { data: []};
  }),
  changeOfferStatusById: jasmine.createSpy('changeOfferStatusById').and.callFake(() => {
    return Observable.create(obs => {
      obs.next();
      obs.complete();
    });
  })
};

describe('DisclosuresComponent', () => {
  let component: DisclosuresComponent;
  let fixture: ComponentFixture<DisclosuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclosuresComponent, DoneComponent ],
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
        { provide: Router, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisclosuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    preApprovedOffersServiceStub.getGetDisclosureVm = jasmine.createSpy('').and.returnValue(Disclosure);
    expect(component).toBeTruthy();
  });
  it('should handle onLimitTypeChange()', () => {
    component.onLimitTypeChange(limitTypes[0]);
    expect(component.disclosureVm.selectedType).toBe('0');
  });

  it('should handle onTermChange()', () => {
    component.onTermChange('term');
    component.disclosureVm.email = 'email';
    component.onTermChange('term');
    expect(component.disclosureVm.allIsValid).toBeFalsy();
    component.disclosureVm.email = 'dddd@gmail.com';
    component.disclosureVm.selectedTerm = 'email';
    component.onTermChange('term');
    component.next();
    expect(component.disclosureVm.allIsValid).toBeTruthy();
  });

  it('should handle TermAndCondtions()', () => {
    component.TermAndCondtions(true);
    expect(component.disclosureVm.termAndCondtions).toBeTruthy();
  });

  it('should handle emailCheck() function', () => {
    const event = {target: {value: 'email'}};
    component.emailCheck(event);
    expect(component.disclosureVm.errorTextBool).toBeTruthy();
    event.target.value = 'dddd@gmail.com';
    component.disclosureVm.selectedTerm = 'term';
    component.emailCheck(event);
    expect(component.disclosureVm.errorTextBool).toBeFalsy();
  });
  it('should handle confirm()', () => {
    component.confirm();
    expect(component.disclosureVm.showDoneScreen).toBeTruthy();
  });

});
