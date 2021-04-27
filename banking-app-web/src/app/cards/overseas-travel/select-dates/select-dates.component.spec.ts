import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import * as moment from 'moment';

import { SelectDatesComponent } from './select-dates.component';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OverseaTravelService } from '../overseas-travel.service';
import { IContactPerson, IOverseasTravelDetails } from '../../../core/services/models';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../core/utils/constants';
import { assertModuleFactoryCaching } from '../../../test-util';

const mockOverseasContactPerson: IContactPerson = {
   name: '',
   number: ''
};
const mockLocalContactPerson: IContactPerson = {
   name: '',
   number: ''
};
const mockStartDate = '2018-04-05';
const mockEndDate = '2018-08-08';
const mockOverseasTravelDetails: IOverseasTravelDetails = {
   fromDate: '2018-04-05',
   toDate: '',
   plasticId: [],
   countries: [],
   primaryNumber: '',
   alteranteNumber: '',
   email: '',
   contactNumber: '',
   overseasContactPerson: mockOverseasContactPerson,
   localContactPerson: mockLocalContactPerson
};
const overseaTravelServiceStub = {
   setOverseasTravelDetails: jasmine.createSpy('setOverseasTravelDetails'),
   getOverseasTravelDetails: jasmine.createSpy('getOverseasTravelDetails').and.returnValue(mockOverseasTravelDetails),
};
const navigationSteps = Constants.overseasTravel.steps;

const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false },
{ step: navigationSteps[4], valid: false, isValueChanged: false }];


describe('SelectDatesComponent', () => {
   let component: SelectDatesComponent;
   let fixture: ComponentFixture<SelectDatesComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SelectDatesComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [WorkflowService, { provide: OverseaTravelService, useValue: overseaTravelServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(SelectDatesComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call setStartDate method', () => {
      component.startDate = moment(mockStartDate);
      component.endDate = moment(mockEndDate);
      component.isFormValid();
      component.setStartDate(mockStartDate);
      expect(component.validForm).toBe(true);
   });

   it('should call setStartDate method when step is valid', () => {
      component.workflowSteps[1].valid = true;
      component.overseasTravelDetails.fromDate = mockOverseasTravelDetails.fromDate;
      component.formatEndDate = moment(mockEndDate);
      component.setStartDate(mockStartDate);
      expect(component.overseasTravelDetails.fromDate).toEqual(mockStartDate);
   });

   it('should call setEndDate method', () => {
      component.startDate = moment(mockStartDate);
      component.endDate = moment(mockEndDate);
      component.isFormValid();
      component.setEndDate(mockEndDate);
      expect(component.validForm).toBe(true);
   });

   it('should call on next click method', () => {
      component.startDate = moment(mockStartDate);
      component.endDate = moment(mockEndDate);
      component.onNextClick();
      expect(component.workflowSteps[1].valid).toBe(true);
      expect(component.overseasTravelDetails.fromDate).toEqual(mockStartDate);
      expect(component.overseasTravelDetails.toDate).toBe(mockEndDate);
   });

   it('should assign start date to end date when start date selected greater than end date', () => {
      component.formatEndDate = moment('2018-08-08');
      component.setStartDate('2018-10-10');
      expect(component.formatEndDate).toEqual(moment('2018-10-10'));
   });
});
