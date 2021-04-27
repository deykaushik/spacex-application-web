import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongInformationComponent } from './wrong-information.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { Observable } from 'rxjs/Observable';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { Router } from '@angular/router';
import { assertModuleFactoryCaching } from '../../test-util';



const wrongInfo = [
  {
    name: '',
    content: [
      {
        type: 'text',
        id: 17,
        content: [
          'Tell us which information is wrong, or call us on {phoneNumber} to update your information.'
        ]
      },
      {
        type: 'checkbox',
        id: 18,
        content: [
          'Total monthly income'
        ]
      },
      {
        type: 'checkbox',
        id: 19,
        content: [
          'Total monthly living expenses'
        ]
      },
      {
        type: 'checkbox',
        id: 20,
        content: [
          'Total monthly debt obligations'
        ]
      },
      {
        type: 'text',
        id: 21,
        content: [
          'We’ll be in touch to help you.'
        ]
      }
    ]
  }
];

const preApprovedOffersServiceStub = {
  getScreenContent: jasmine.createSpy('getScreenContent').and.returnValue(Observable.create(obs => {
    obs.next([]);
    obs.complete();
  })),
  feedbackPayload: ['feedback1', 'feedback2', 'feedback3'],
  sendUserContent: jasmine.createSpy('sendUserContent').and.callFake(() => {
    return Observable.create(obs => {
      obs.next();
      obs.complete();
    });
  })
};
const RouteStub = {
  navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue([])
};

describe('WrongInformationComponent', () => {
  let component: WrongInformationComponent;
  let fixture: ComponentFixture<WrongInformationComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WrongInformationComponent ],
      imports: [SharedModule, FormsModule],
      providers: [
        { provide: Router, useValue: RouteStub },
        { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('shuold check onOptionSelect()', () => {
    component.options = [false, false, true, false];
    component.onOptionSelect();
    component.cancel();
    expect(component.isSubmitDisabled).toBeFalsy();
  });

  it('shuold check getContent()', () => {
    const data = wrongInfo[0].content[0];
    const values = {'phoneNumber': {'type': 'phoneNumber', 'value': '0860 103 582'}};
    const matchstring = 'Tell us which information is wrong, or call us on 0860 103 582 to update your information.';
    const content = component.getContent(data.content[0], values);
    expect(content).toBe(matchstring);
  });
  it('should handle the submitFeedback()', () => {
    component.options = [true, false, true, false];
    component.content = wrongInfo[0].content[0].content;
    component.submitFeedback();
    preApprovedOffersServiceStub.feedbackPayload = [];
    component.options = [false, true, true, false];
    component.submitFeedback();
    expect(component.options[0]).toBeFalsy();
  });
});
