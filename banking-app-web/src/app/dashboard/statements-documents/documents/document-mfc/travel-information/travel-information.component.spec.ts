import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../../account.service';
import { WorkflowService } from '../../../../../core/services/stepper-work-flow-service';
import { ICrossBorderRequest } from '../../../../../core/services/models';
import { TravelInformationComponent } from './travel-information.component';
import { IStepper } from '../../../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../../../core/utils/constants';
import { assertModuleFactoryCaching } from '../../../../../test-util';

const accountServiceSuccessStub = {
   setMfcCrossBorderRequest: jasmine.createSpy('setMfcCrossBorderRequest').and.returnValue([]),
   getMfcCrossBorderRequest: jasmine.createSpy('getMfcCrossBorderRequest').and.returnValue([]),
};

const navigationSteps: string[] = Constants.labels.buildingLoan.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

const mockCrossBorderRequest: ICrossBorderRequest = {
   itemAccountId: '7',
   documentType: 'mfccrossborderletter',
   crossBorder: {
      countries: [
         {
            name: 'Mozambique'
         }
      ],
      dateOfLeaving: '2018-08-22',
      dateOnReturn: '2018-08-27',
      licensePlateNumber: '123456',
      insuranceCompanyName: 'FORBES',
      insurancePolicyNumber: '123456',
      driverDetails: [
         {
            name: 'BOB',
            surname: 'JAMES',
            driverLicenseNumber: 'DLN',
            idOrPassportNumber: 'PN'
         }
      ]
   },
   emailId: 'bob@nedbank.co.za'
};

describe('TravelInformationComponent', () => {
   let component: TravelInformationComponent;
   let fixture: ComponentFixture<TravelInformationComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [TravelInformationComponent],
         providers: [WorkflowService, { provide: AccountService, useValue: accountServiceSuccessStub }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(TravelInformationComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set leaving date', () => {
      const date = new Date();
      component.setLeavingDate(date);
      expect(component.dateOfLeaving).toBe(date);
   });

   it('should set returning date', () => {
      const date = new Date();
      component.setRetuningDate(date);
      expect(component.dateOnReturn).toBe(date);
   });

   it('should select country', () => {
      const country = { name: 'SA' };
      component.selectedCountry = [];
      component.selectedCountry.push(country);
      component.onCountrySelect(0, 'Zimbabwe');
      expect(component.selectedCountry[0].name).toBe('Zimbabwe');
   });

   it('should add another country', () => {
      component.selectedCountry = [];
      component.addAnotherCountry();
      expect(component.selectedCountry[0].name).toBe('Choose one');
   });

   it('should assign travel information if cross border have data', () => {
      accountServiceSuccessStub.getMfcCrossBorderRequest.and.returnValue(mockCrossBorderRequest);
      component.ngOnInit();
      expect(component.selectedCountry[0].name).toBe('Mozambique');
   });

   it('should navigate to driver information', () => {
      component.selectedCountry = [{ name: 'Zimbabwe' }];
      component.onNextClick();
      expect(component.crossBorder.countries).toBe(component.selectedCountry);
   });
});
