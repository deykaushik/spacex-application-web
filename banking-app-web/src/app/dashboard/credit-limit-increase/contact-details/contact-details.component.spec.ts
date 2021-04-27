import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { assertModuleFactoryCaching } from '../../../test-util';
import { CreditLimitService } from '../credit-limit.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { ContactDetailsComponent } from './contact-details.component';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { IPhoneNumber, IClientDetails } from '../../../core/services/models';

const creditLimitIncrease = {
   plasticId: 42,
   grossMonthlyIncome: 10,
   netMonthlyIncome: 10,
   otherIncome: 10,
   monthlyCommitment: 10,
   monthlyDebt: 10,
   bankName: 'Nedbank',
   branchNumber: '198765',
   accountNumber: '9876543',
   preferContactNumber: '123455',
   primaryClientDebtReview: 'N',
   spouseDebtReview: 'N',
   statementRetrival: true
};
const creditLimitServiceStub = {
   getCreditLimitMaintenanceDetails: jasmine.createSpy('getCreditLimitMaintenanceDetails').and.returnValue(creditLimitIncrease),
   setCreditLimitMaintenanceDetails: jasmine.createSpy('setCreditLimitMaintenanceDetails')
};

const phoneNumber: IPhoneNumber = {
   phoneNumber: '012345678',
   isValid: true
};
const clientDetails: IClientDetails = {
   FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
   EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: [], MaritalStatus: 'U', MarriageType: '02'
};
const clientProfileDetailsServiceStub = {
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
};
const navigationSteps = CreditLimitMaintenance.steps;
describe('ContactDetailsComponent', () => {
   let component: ContactDetailsComponent;
   let fixture: ComponentFixture<ContactDetailsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ContactDetailsComponent],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CreditLimitService, useValue: creditLimitServiceStub },
         { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub }, WorkflowService]
      })
         .compileComponents();
   }));
   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(ContactDetailsComponent);
      component = fixture.componentInstance;
      service.workflow = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
      { step: navigationSteps[1], valid: false, isValueChanged: false },
      { step: navigationSteps[2], valid: false, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call onContactNumber method for true case', () => {
      component.getPhoneNumber(phoneNumber);
      expect(component.isContactNumberValid).toBe(true);
   });

   it('should call goToSummary method ', () => {
      component.isContactNumberValid = true;
      component.goToSummary();
      expect(component.workflowSteps[2].valid).toBe(true);
   });
});
