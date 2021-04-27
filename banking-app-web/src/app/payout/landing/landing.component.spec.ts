import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PreFillService } from './../../core/services/preFill.service';
import { WindowRefService } from './../../core/services/window-ref.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ApiService } from './../../core/services/api.service';
import { LandingComponent } from './landing.component';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';
import { PayoutService } from '../payout.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { assertModuleFactoryCaching } from '../../test-util';
import { TrusteerService } from '../../core/services/trusteer-service';
import { GaTrackingService } from '../../core/services/ga.service';
import { Constants } from '../../core/utils/constants';
import { IStepper } from '../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { GAEvents } from '../../core/utils/ga-event';

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
const payoutServiceStub = {
   setId: jasmine.createSpy('setId')
};
const navigationSteps = Constants.labels.buildingLoan.steps;
const mockworkflowsteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }
];
describe('LandingComponent payout', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: PayoutService, useValue: {} },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            TermsService, WorkflowService, TokenManagementService, ApiService, HttpClient, HttpHandler, TrusteerService,
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 3 }) } }, WindowRefService, PreFillService]
      }).compileComponents();
   }));
   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });
   it('should create component', () => {
      expect(component).toBeTruthy();
   });
   it('should send event when exit from payment details stepper', () => {
      component.requestPaymentAction.paymentDetailsPageExit = GAEvents.requestPaymentAction.paymentDetailsPageExit;
      component.onCurrentStepIndex(1);
      expect(component.requestPaymentAction.paymentDetailsPageExit.eventAction).
         toEqual(GAEvents.requestPaymentAction.paymentDetailsPageExit.eventAction);
      expect(component.requestPaymentAction.paymentDetailsPageExit.label).
         toEqual(GAEvents.requestPaymentAction.paymentDetailsPageExit.label);

   });

   it('should send event when exit from summery page stepper', () => {
      component.requestPaymentAction.summaryPageExit = GAEvents.requestPaymentAction.summaryPageExit;
      component.onCurrentStepIndex(3);
      expect(component.requestPaymentAction.summaryPageExit.eventAction).
         toEqual(GAEvents.requestPaymentAction.summaryPageExit.eventAction);
      expect(component.requestPaymentAction.summaryPageExit.label).
         toEqual(GAEvents.requestPaymentAction.summaryPageExit.label);
   });
});
