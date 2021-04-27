import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneComponent } from './done.component';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { Router } from '@angular/router';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { assertModuleFactoryCaching } from '../../test-util';

let content = 'If you need help or have any questions, call us on {phoneNumber} or email us at {email}.';
const values = {
  email: { type: 'emailAddress', value: 'PLAdmin@nedbank.co.za' },
  phoneNumber: { type: 'phoneNumber', value: '0860 555 111' }
};

const preApprovedOffersServiceStub = {
  offersObservable: new Subject(),
  getScreenMessage: jasmine.createSpy('getScreenMessage').and.returnValue(Observable.create(obs => {
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


describe('DoneComponent', () => {
  let component: DoneComponent;
  let fixture: ComponentFixture<DoneComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneComponent, BottomButtonComponent, SpinnerComponent ],
      providers: [
        { provide: Router, useValue: RouterStub },
        { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
  it('should handle the getContent()', () => {
    let result = component.getContent(content, values);
    component.done();
    const teststring = 'If you need help or have any questions, call us on 0860 555 111 or'
    + ' email us at <a href="mailto:PLAdmin@nedbank.co.za">PLAdmin@nedbank.co.za</a>.';
    expect(result).toBe(teststring);
    content = 'Your loan will be paid into your Nedbank salary account ending in ****123.';
    result = component.getContent(content, values);
    expect(result).toBe(content);
  });
});
