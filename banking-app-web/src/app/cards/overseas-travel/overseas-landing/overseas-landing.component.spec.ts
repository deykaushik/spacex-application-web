import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OverseasLandingComponent } from './overseas-landing.component';
import { OverseaTravelService } from '../overseas-travel.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../core/utils/constants';
import { GaTrackingService } from '../../../core/services/ga.service';
import { GAEvents } from '../../../core/utils/ga-event';
import { TrusteerService } from '../../../core/services/trusteer-service';
import { assertModuleFactoryCaching } from '../../../test-util';


const overseaTravelServiceStub = {
      setPlasticId: jasmine.createSpy('setPlasticId')
};
const gaTrackingServiceStub = {
      sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
   };
const navigationSteps = Constants.overseasTravel.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false },
{ step: navigationSteps[4], valid: false, isValueChanged: false }];

describe('LandingComponent cardstepper', () => {
   let component: OverseasLandingComponent;
   let fixture: ComponentFixture<OverseasLandingComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [OverseasLandingComponent],
         providers: [TrusteerService, WorkflowService, { provide: OverseaTravelService, useValue: overseaTravelServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 3 }) } }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(OverseasLandingComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should send event when exit from select card stepper', () => {
      const event = 0;
      component.dropoffGAEvents.dropOffSelectCard = GAEvents.overseasTravelNotification.dropOffSelectCard;
      component.onCurrentStepIndex(event);
      expect(component.dropoffGAEvents.dropOffSelectCard.value).toEqual(GAEvents.overseasTravelNotification.dropOffSelectCard.value);
      expect(component.dropoffGAEvents.dropOffSelectCard.eventAction).
      toEqual(GAEvents.overseasTravelNotification.dropOffSelectCard.eventAction);
      expect(component.dropoffGAEvents.dropOffSelectCard.label).toEqual(GAEvents.overseasTravelNotification.dropOffSelectCard.label);

   });

   it('should send event when exit from select dates stepper', () => {
      const event = 1;
      component.dropoffGAEvents.dropOffSelectDates = GAEvents.overseasTravelNotification.dropOffSelectDates;
      component.onCurrentStepIndex(event);
      expect(component.dropoffGAEvents.dropOffSelectDates.value).toEqual(GAEvents.overseasTravelNotification.dropOffSelectDates.value);
      expect(component.dropoffGAEvents.dropOffSelectDates.eventAction).
      toEqual(GAEvents.overseasTravelNotification.dropOffSelectDates.eventAction);
      expect(component.dropoffGAEvents.dropOffSelectDates.label).toEqual(GAEvents.overseasTravelNotification.dropOffSelectDates.label);
   });

   it('should send event when exit from select countries stepper', () => {
      const event = 2;
      component.onCurrentStepIndex(event);
      component.dropoffGAEvents.dropOffSelectCountries = GAEvents.overseasTravelNotification.dropOffSelectCountries;
      component.onCurrentStepIndex(event);
      expect(component.dropoffGAEvents.dropOffSelectCountries.value).
      toEqual(GAEvents.overseasTravelNotification.dropOffSelectCountries.value);
      expect(component.dropoffGAEvents.dropOffSelectCountries.eventAction).
      toEqual(GAEvents.overseasTravelNotification.dropOffSelectCountries.eventAction);
      expect(component.dropoffGAEvents.dropOffSelectCountries.label).
      toEqual(GAEvents.overseasTravelNotification.dropOffSelectCountries.label);
   });

   it('should send event when exit from contact details stepper', () => {
      const event = 3;
      component.onCurrentStepIndex(event);
      component.dropoffGAEvents.dropOffContactDetails = GAEvents.overseasTravelNotification.dropOffContactDetails;
      component.onCurrentStepIndex(event);
      expect(component.dropoffGAEvents.dropOffContactDetails.value).
      toEqual(GAEvents.overseasTravelNotification.dropOffContactDetails.value);
      expect(component.dropoffGAEvents.dropOffContactDetails.eventAction).
      toEqual(GAEvents.overseasTravelNotification.dropOffContactDetails.eventAction);
      expect(component.dropoffGAEvents.dropOffContactDetails.label).
      toEqual(GAEvents.overseasTravelNotification.dropOffContactDetails.label);
    });

   it('should send event when exit from summary stepper', () => {
      const event = 4;
      component.onCurrentStepIndex(event);
      component.dropoffGAEvents.dropOffSummary = GAEvents.overseasTravelNotification.dropOffSummary;
      component.onCurrentStepIndex(event);
      expect(component.dropoffGAEvents.dropOffSummary.value).toEqual(GAEvents.overseasTravelNotification.dropOffSummary.value);
      expect(component.dropoffGAEvents.dropOffSummary.eventAction).toEqual(GAEvents.overseasTravelNotification.dropOffSummary.eventAction);
      expect(component.dropoffGAEvents.dropOffSummary.label).toEqual(GAEvents.overseasTravelNotification.dropOffSummary.label);
   });

   it('should emit event on calling hideStepper method', () => {
      spyOn(component.onHide, 'emit');
      const event = false;
      component.hideStepper(event);
      expect(component.onHide.emit).toHaveBeenCalledWith(event);
   });

});
