import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { PreFillService } from '../../../core/services/preFill.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { ApoService } from '../apo.service';
import { ApoLandingComponent } from './apo-landing.component';
import { IAutoPayDetail } from '../apo.model';
import { ApoConstants } from '../apo-constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { assertModuleFactoryCaching } from '../../../test-util';
import { GaTrackingService } from '../../../core/services/ga.service';

const apoServiceStub = {
   setId: jasmine.createSpy('setId'),
   setMode: jasmine.createSpy('setMode'),
   setAutoPayDetails: jasmine.createSpy('setAutoPayDetails'),
   emitApoSuccess: new EventEmitter<boolean>()
};
const autoPayDetails: IAutoPayDetail = {
   payToAccount: '589846 076131664 5',
   payToAccountName: 'MR 1RICH GARFIELD',
   autoPayInd: true,
   statementDate: '2018-07-04T00:00:00',
   dueDate: '2018-07-29T00:00:00',
   camsAccType: 'ATT',
   autoPayMethod: 'F',
   autoPayAmount: '',
   branchOrUniversalCode: '123456',
   nedbankIdentifier: true,
   mandateAction: true,
   payFromAccount: '6666666666666',
   payFromAccountType: '2',
   monthlyPaymentDay: '19',
   autoPayTerm: '00',
   allowTermsAndCond: true
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
const navigationSteps = ApoConstants.apo.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];
const preFillServiceStub = new PreFillService();
preFillServiceStub.preFillAutoPayDetail = autoPayDetails;

describe('ApoLandingComponent', () => {
   let component: ApoLandingComponent;
   let fixture: ComponentFixture<ApoLandingComponent>;
   let workflowService: WorkflowService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ApoLandingComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [WorkflowService,
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: ApoService, useValue: apoServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(ApoLandingComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call the emit apo success', () => {
      apoServiceStub.emitApoSuccess.emit(false);
      spyOn(component.onSuccess, 'emit');
      component.showSuccess();
      component.ngOnInit();
      expect(component.onSuccess.emit).toHaveBeenCalledWith(false);
   });
   it('should hide the payment amount option for charge card', () => {
      component.apoDetails = autoPayDetails;
      component.operationMode = 'edit';
      fixture.detectChanges();
      component.setApoOptions();
      expect(component.steppers.length).toBe(3);
   });
   it('should set the options in edit mode', () => {
      component.apoDetails.camsAccType = 'NGB';
      component.operationMode = 'edit';
      fixture.detectChanges();
      component.setApoOptions();
      expect(component.steppers.length).toBe(4);
   });
   it('should set the options in edit mode for charge card', () => {
      component.apoDetails.camsAccType = 'ATT';
      component.operationMode = 'edit';
      fixture.detectChanges();
      component.setApoOptions();
      expect(component.steppers.length).toBe(3);
   });
   it('should call closeStepperOverlay', () => {
      spyOn(component.onSuccess, 'emit');
      component.closeStepperOverlay(true);
      expect(component.onSuccess.emit).toHaveBeenCalledWith(false);
   });
   it('should call showSuccess', () => {
      spyOn(component.onSuccess, 'emit');
      component.showSuccess();
      expect(component.onSuccess.emit).toHaveBeenCalledWith(false);
   });
   it('should hide the stepper', () => {
      spyOn(component.onHide, 'emit');
      component.hideStepper(false);
      expect(component.onHide.emit).toHaveBeenCalledWith(false);
   });
   it('should call onCurrentStepIndex on drop of option one when cams type is ATT', () => {
      component.apoDetails.camsAccType = 'ATT';
      component.onCurrentStepIndex(1);
      expect(component.closeApoGAEvent.dropOffFromPayFrom.eventAction)
         .toBe('click_on_payfromscreen_dropoff');
   });
   it('should call onCurrentStepIndex on drop of option three when cams type is ATT', () => {
      component.apoDetails.camsAccType = 'ATT';
      component.onCurrentStepIndex(2);
      expect(component.closeApoGAEvent.dropOffFromPaymentDate.eventAction)
         .toBe('click_on_paymentdatescreen_dropoff');
   });
   it('should call onCurrentStepIndex on drop of option one when cams type is not ATT', () => {
      component.apoDetails.camsAccType = 'NGB';
      component.onCurrentStepIndex(1);
      expect(component.closeApoGAEvent.dropOffFromPayFrom.eventAction)
         .toBe('click_on_payfromscreen_dropoff');
   });
   it('should call onCurrentStepIndex on drop of option two when cams type is not ATT', () => {
      component.onCurrentStepIndex(2);
      expect(component.closeApoGAEvent.dropOffFromPaymentAmount.eventAction)
         .toBe('click_on_paymentamountscreen_dropoff');
   });
   it('should call onCurrentStepIndex on drop of option three when cams type is not ATT', () => {
      component.onCurrentStepIndex(3);
      expect(component.closeApoGAEvent.dropOffFromPaymentDate.eventAction)
         .toBe('click_on_paymentdatescreen_dropoff');
   });
});
