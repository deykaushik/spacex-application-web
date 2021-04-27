import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from '../../../../../test-util';
import { AccountService } from '../../../../account.service';
import { WorkflowService } from '../../../../../core/services/stepper-work-flow-service';
import { DriverInformationComponent } from './driver-information.component';
import { ICrossBorderRequest, IDriverDetails } from '../../../../../core/services/models';
import { IStepper } from '../../../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../../../core/utils/constants';

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
      licensePlateNumber: 'Uma',
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

const accountServiceSuccessStub = {
   setMfcCrossBorderRequest: jasmine.createSpy('setMfcCrossBorderRequest').and.returnValue(null),
   getMfcCrossBorderRequest: jasmine.createSpy('getMfcCrossBorderRequest').and.returnValue(mockCrossBorderRequest),
};


const navigationSteps: string[] = Constants.labels.buildingLoan.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

describe('DriverInformationComponent', () => {
   let component: DriverInformationComponent;
   let fixture: ComponentFixture<DriverInformationComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [DriverInformationComponent],
         providers: [WorkflowService, { provide: AccountService, useValue: accountServiceSuccessStub }]
      })
         .compileComponents();
   }));
   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(DriverInformationComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should navigate to email', () => {
      component.driverInfoList = mockCrossBorderRequest.crossBorder.driverDetails;
      component.onNextClick();
      expect(component.mfcCrossBorderRequest.crossBorder.driverDetails.length).toBe(1);
   });

   it('should add driver add inf0', () => {
      component.numberOfDriverInfo = 0;
      component.driverInfoList = [];
      component.addDriverInfo();
      expect(component.driverInfoList.length).toBe(1);
   });

   it('should change is driver nominate', () => {
      const labels = Constants.labels.statementAndDocument.documents.mfc.driverInformation;
      component.onTypeChange(labels.nominateDriver[0]);
      expect(component.isDriverNominate).toBe('YES');
   });

   it('should intiaize the driver info details', () => {
      const mockMockCrossBorderRequest = mockCrossBorderRequest;
      mockMockCrossBorderRequest.crossBorder.driverDetails = null;
      accountServiceSuccessStub.getMfcCrossBorderRequest.and.returnValue(mockMockCrossBorderRequest);
      component.ngOnInit();
      expect(component.numberOfDriverInfo).toBe(2);
   });

});
