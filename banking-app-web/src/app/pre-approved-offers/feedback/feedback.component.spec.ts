import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackComponent } from './feedback.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { FormsModule } from '@angular/forms';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { Subject } from '../../../../node_modules/rxjs/Subject';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { WrongInformationComponent } from '../wrong-information/wrong-information.component';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from '../../test-util';

const preApprovedOffersServiceStub = {
  feedbackPayload: '',
  offersObservable: new Subject(),
  getScreenContent: jasmine.createSpy('getScreenContent').and.returnValue(Observable.create(obs => {
    obs.next([{ content: [] }, []]);
    obs.complete();
  })),
  sendUserContent: jasmine.createSpy('sendUserContent').and.callFake((payload, offerId, constants) => {
    // navigateTORoute = true;
    return Observable.create(obs => {
      obs.next();
      obs.complete();
    });
  })
};

const RouterStub = {
  navigateByUrl: jasmine.createSpy('navigateByUrl').and.callFake(url => { return; })
};

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackComponent, BottomButtonComponent, SpinnerComponent, WrongInformationComponent ],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: Router, useValue: RouterStub},
        {provide: PreApprovedOffersService,   useValue: preApprovedOffersServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    component.reasons = [false, true, true, false, false];
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should handle onCheckboxClick', () => {
    const reason = {};
    component.onCheckboxClick(1, reason);
    expect(component.isSubmitDisabled).toBeFalsy();
    const reasons = { more: true, exclusive: true};
    component.onCheckboxClick(1, reasons);
    expect(component.isWrongInfo).toBeFalsy();
    expect(component.reasons[1]).toBeTruthy();
    component.onCheckboxClick(3, reasons);
    expect(component.reasons[3]).toBeFalsy();
  });

  it('should handle submitFeedback', () => {
    component.content = [{ id: 1, content: 'a' }, { id: 2, content: 'b' }, { id: 3, content: 'c' }];
    component.submitFeedback();
    expect(component.isSubmitDisabled).toBeFalsy();
    component.isWrongInfo = true;
    component.submitFeedback();
    expect(component.showWrongInfo).toBeTruthy();
  });

  it('should handle cancle() and navigateToFeedback()', () => {
    component.cancel();
    component.navigateToFeedback();
    expect(component.showWrongInfo ).toBeFalsy();
  });

});
