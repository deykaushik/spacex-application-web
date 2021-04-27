import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, FormGroup, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { OverseaTravelService } from '../overseas-travel.service';
import { ContactDetailsComponent } from './contact-details.component';
import { IContactPerson, IOverseasTravelDetails, IClientDetails } from '../../../core/services/models';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../core/utils/constants';
import { assertModuleFactoryCaching } from '../../../test-util';


const mockOverseasContactPerson: IContactPerson = {
   name: 'aaaa',
   number: '11111'
};
const mockLocalContactPerson: IContactPerson = {
   name: 'bbbb',
   number: '2222'
};
const mockOverseasTravelDetails: IOverseasTravelDetails = {
   fromDate: '',
   toDate: '',
   plasticId: [],
   countries: [],
   primaryNumber: '',
   alteranteNumber: '444',
   email: '',
   contactNumber: '',
   overseasContactPerson: mockOverseasContactPerson,
   localContactPerson: mockLocalContactPerson
};
const clientDetails: IClientDetails = {
   FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
   EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
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
describe('ContactDetailsComponent', () => {
   let component: ContactDetailsComponent;
   let fixture: ComponentFixture<ContactDetailsComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ContactDetailsComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [FormsModule],
         providers: [WorkflowService,
            { provide: OverseaTravelService, useValue: overseaTravelServiceStub },
            {
               provide: ClientProfileDetailsService, useValue: {
                  getClientDetail: jasmine.createSpy('getClientDetail'),
                  getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
                  getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
               }
            }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(ContactDetailsComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      component.contactDetailsForm = new FormGroup({
         overseasNameRef: new FormControl(),
         localNameRef: new FormControl(),
         emailRef: new FormControl()
      });
      fixture.detectChanges();
   }));

   function updateForm() {
      component.contactDetailsForm.controls['overseasNameRef'].setValue('Abinaya');
      component.contactDetailsForm.controls['localNameRef'].setValue('Abinaya');
      component.contactDetailsForm.controls['emailRef'].setValue('abinaya');
   }

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set overseas contact and local contact details if any if them are non-empty value', () => {
      component.workflowSteps[3].valid = true;
      component.overseasTravelDetails.overseasContactPerson.name = 'Abinaya';
      component.overseasTravelDetails.overseasContactPerson.number = '24349979787';
      component.overseasTravelDetails.localContactPerson.name = 'Abinaya';
      component.overseasTravelDetails.localContactPerson.number = '24349979787';
      component.ngOnInit();
      expect(component.workflowSteps[3].valid).toBe(true);
      expect(component.isContactDetailsOpen).toBe(true);
   });

   it('should set isContactDetailsOpen to false if workflow step is invalid', () => {
      component.workflowSteps[3].valid = false;
      component.isContactDetailsOpen = false;
      component.ngOnInit();
      expect(component.workflowSteps[3].valid).toBe(false);
      expect(component.isContactDetailsOpen).toBe(false);
   });

   it('should be created for edit details', () => {
      component.workflowSteps[3] = { step: navigationSteps[3], valid: true, isValueChanged: false };
      component.ngOnInit();
      expect(component.overseasTravelDetails.alteranteNumber).toBe(mockOverseasTravelDetails.alteranteNumber);
   });
   it('should be created for edit details false case', () => {
      component.workflowSteps[3] = { step: navigationSteps[3], valid: false, isValueChanged: false };
      component.ngOnInit();
      expect(component.overseasTravelDetails.overseasContactPerson.name).toBe('');
   });
   it('should be call openOtherDetails false case ', () => {
      component.isContactDetailsOpen = true;
      component.openOtherDetails();
      expect(component.isContactDetailsOpen).toBe(false);
   });

   it('should be call openOtherDetails true case', () => {
      component.isContactDetailsOpen = false;
      component.openOtherDetails();
      expect(component.isContactDetailsOpen).toBe(true);
   });

   it('should be call openTooltip', () => {
      component.isTooltipOpen = true;
      component.openTooltip();
      expect(component.isTooltipOpen).toBe(false);
   });

   it('should check if the email is valid', () => {
      component.contactDetailsForm.controls['emailRef'].setValue('nedbank@nedbank.co.za');
      expect(component.checkEmailValid(component.contactDetailsForm, 'emailRef')).toBe(true);
   });

   it('should call onNextClick', () => {
      component.onNextClick();
      expect(component.overseasTravelDetails.primaryNumber).toBe(component.contactDetails.CellNumber);
   });
});
