import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { StepperWorkFlowComponent } from '../../shared/components/stepper-work-flow/stepper-work-flow.component';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ColoredOverlayComponent } from '../../shared/overlays/colored-overlay/overlay.component';
import { FeedbackComponent } from '../feedback/feedback.component';
import { StepperNavBarComponent } from '../../shared/components/stepper-work-flow/stepper-nav-bar/stepper-nav-bar.component';
import { SharedModule } from '../../shared/shared.module';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { WindowRefService } from '../../core/services/window-ref.service';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { SystemErrorComponent } from '../../shared/components/system-services/system-services.component';
import { AlertModule } from '../../../../node_modules/ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from '../../test-util';
const workflowServiceStub = {
  workflow: [{ step: 'one', valid: true, isValueChanged: true },
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
describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingComponent,
        BottomButtonComponent,
        ColoredOverlayComponent,
        SpinnerComponent,
        SystemErrorComponent,
        FeedbackComponent ],
      imports: [FormsModule, AlertModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          WindowRefService,
          { provide: WorkflowService, useValue: workflowServiceStub },
          { provide: ActivatedRoute, useValue: {
            params: Observable.of({
              offerId: 1
            })
          } },
          PreApprovedOffersService,
          { provide: Router , useValue: {}}
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle exitProcess()', () => {
    component.exitProcess();
    expect(component.showFeedbackScreen).toBeTruthy();
  });

  it('should handle cancel()', () => {
    component.cancel();
    expect(component.showFeedbackScreen).toBeFalsy();
  });
});
