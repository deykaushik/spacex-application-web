import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from '../../../test-util';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { CreditLimitService } from '../credit-limit.service';
import { RequestCreditLimitComponent } from './request-credit-limit.component';
import { IClientDetails } from '../../../core/services/models';

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
const creditLimitServiceStub = {
   setCreditLimitMaintenanceDetails: jasmine.createSpy('setCreditLimitMaintenanceDetails')
};
describe('RequestCreditLimitComponent', () => {
   let component: RequestCreditLimitComponent;
   let fixture: ComponentFixture<RequestCreditLimitComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RequestCreditLimitComponent],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
            { provide: CreditLimitService, useValue: creditLimitServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RequestCreditLimitComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call onClose', () => {
      spyOn(component.changeRequestCreditLimit, 'emit');
      component.onClose(true);
      expect(component.isRequestCreditLimit).toBe(true);
   });
   it('should call getClientPreferenceDetails for single ', () => {
      component.getClientPreferenceDetails();
      expect(component.creditLimitDetails.primaryClientDebtReview).toBe('N');
   });
   it('should call getClientPreferenceDetails for married out of cop with accural', () => {
      clientProfileDetailsServiceStub.getClientPreferenceDetails.and.returnValue({ MaritalStatus: 'M', MarriageType: '02' });
      component.getClientPreferenceDetails();
      expect(component.creditLimitDetails.primaryClientDebtReview).toBe('N');
      expect(component.creditLimitDetails.spouseDebtReview).toBe('');
   });
   it('should call getClientPreferenceDetails for married out of cop without accural', () => {
      clientProfileDetailsServiceStub.getClientPreferenceDetails.and.returnValue({ MaritalStatus: 'M', MarriageType: '04' });
      component.getClientPreferenceDetails();
      expect(component.creditLimitDetails.primaryClientDebtReview).toBe('N');
      expect(component.creditLimitDetails.spouseDebtReview).toBe('');
   });
   it('should call getClientPreferenceDetails married in cop', () => {
      clientProfileDetailsServiceStub.getClientPreferenceDetails.and.returnValue({ MaritalStatus: 'M', MarriageType: '01' });
      component.getClientPreferenceDetails();
      expect(component.creditLimitDetails.primaryClientDebtReview).toBe('N');
      expect(component.creditLimitDetails.spouseDebtReview).toBe('N');
   });
   it('should call getClientPreferenceDetails married but out of marriage type', () => {
      clientProfileDetailsServiceStub.getClientPreferenceDetails.and.returnValue({ MaritalStatus: 'M', MarriageType: '20' });
      component.getClientPreferenceDetails();
      expect(component.isAllowToApply).toBe(false);
   });
   it('should call getClientPreferenceDetails else part', () => {
      clientProfileDetailsServiceStub.getClientPreferenceDetails.and.returnValue({ MaritalStatus: 'U', MarriageType: '' });
      component.getClientPreferenceDetails();
      expect(component.isAllowToApply).toBe(true);
   });
   it('should call openTooltip method', () => {
      component.isTooltipOpen = true;
      component.openTooltip();
      expect(component.isTooltipOpen).toBe(false);
   });
   it('should call onAccept method', () => {
      component.isAllowToApply = true;
      component.isAccept = true;
      component.onAccept();
      expect(component.isAccept).toBe(false);
   });
   it('should call getStarted method', () => {
      spyOn(component.changeRequestCreditLimit, 'emit');
      component.isRequestCreditLimit = false;
      component.isAccept = true;
      component.getStarted();
      expect(component.changeRequestCreditLimit.emit).toHaveBeenCalledWith(component.isRequestCreditLimit);
   });
});
