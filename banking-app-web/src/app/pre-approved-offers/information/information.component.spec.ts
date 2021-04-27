import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationComponent } from './information.component';

import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { FormsModule } from '@angular/forms';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { ColoredOverlayComponent } from '../../shared/overlays/colored-overlay/overlay.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SystemErrorComponent } from '../../shared/components/system-services/system-services.component';
import { AlertModule } from '../../../../node_modules/ngx-bootstrap';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { flatten } from '../../../../node_modules/@angular/router/src/utils/collection';
import { EventEmitter } from '@angular/core';
import { WrongInformationComponent } from '../wrong-information/wrong-information.component';
import { DoneComponent } from '../done/done.component';
import { assertModuleFactoryCaching } from '../../test-util';

const workflowServiceStub = {
  workflow: [{ step: 'one', valid: true, isValueChanged: true},
    { step: 'two', valid: true, isValueChanged: false },
    { step: 'three', valid: false, isValueChanged: true },
    { step: 'four', valid: false, isValueChanged: false }],

  stepClickEmitter: new EventEmitter<string>()
};

const ActivatedRouteStub = {
  params: Observable.create(obs => {
    obs.next({ offerid: 1 });
    obs.complete();
  })
};

let navigateTORoute = false;
const RouteStub = {
  navigate: jasmine.createSpy('navigate').and.callFake(arr => {
    navigateTORoute = true;
    return true;
  })
};

const preApprovedOffersServiceStub = {
  offersObservable: new Subject(),
  getInvolvedParties: jasmine.createSpy('getInvolvedParties').and.returnValue(Observable.create(obs => {
    obs.next([{ content: [] }, []]);
    obs.complete();
  })),
  getGetInformationVm: jasmine.createSpy('getGetInformationVm').and.returnValue({ screen: [], isInfoWrong: [1, 2] }),
  changeOfferStatusById: jasmine.createSpy('changeOfferStatusById').and.callFake((payload, offerId) => {
    return Observable.create(obs => {
      obs.next();
      obs.complete();
    });
  }),
  updateInformationVm: jasmine.createSpy('updateInformationVm').and.callFake((inf) => {
    return;
  })
};
describe('InformationComponent', () => {
  let component: InformationComponent;
  let fixture: ComponentFixture<InformationComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationComponent,
        AmountTransformPipe,
        BottomButtonComponent,
        ColoredOverlayComponent,
        SpinnerComponent,
        SystemErrorComponent,
        WrongInformationComponent,
        DoneComponent
       ],
      imports: [FormsModule, AlertModule],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        {provide: WorkflowService, useValue: workflowServiceStub },
        { provide: Router, useValue: RouteStub },
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle goBack()', () => {
    component.goBack();
    expect(navigateTORoute).toBeTruthy();
  });

  it('should handle acceptClientDetails ()', () => {
    component.acceptClientDetails();
    expect(component.showWrongInfo).toBeTruthy();

    component.informationVm = { screen: [{name: '', value: '', subText: ''}], isInfoWrong: false };
    component.acceptClientDetails();
    expect(component.workflowStep[0].valid).toBeTruthy();
  });

  it('should handle cancle()', () => {
    component.cancel();
    expect(component.showWrongInfo ).toBeFalsy();
  });
});
