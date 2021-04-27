import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { StatementPreferencesPostalComponent } from './statement-preferences-postal.component';
import { IStatementPreferences, IStatementDetails } from '../../../core/services/models';
import { assertModuleFactoryCaching } from '../../../test-util';
import { GaTrackingService } from '../../../core/services/ga.service';

const mockGetAccountStatementPreferences: IStatementPreferences = {
   itemAccountId: '1',
   accountNumber: '1001037693',
   frequency: 'MONTHLY',
   deliveryMode: 'EMAIL',
   email: ['GUNJAL138@GMAIL.COM', 'TEST@GAS.COM'],
   paymentMethod: 'DEBO',
   postalAddress: {
      addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
      city: 'JOHANNESBURG',
      postalCd: '2191'
   }
};
const mockStatementDetails: IStatementDetails = {
   accountType: 'CA',
   isGroupDisabled: false,
   inProgress: false
};
const  gaTrackingServiceStub  =  {
   sendEvent:  jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('StatementPreferencesPostalComponent', () => {
   let component: StatementPreferencesPostalComponent;
   let fixture: ComponentFixture<StatementPreferencesPostalComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [StatementPreferencesPostalComponent],
         imports: [FormsModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers:  [{  provide:  GaTrackingService,  useValue:  gaTrackingServiceStub  }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StatementPreferencesPostalComponent);
      component = fixture.componentInstance;
      component.buttonGroup = [{ label: 'Post', value: 'POST' }, { label: 'Email', value: 'EMAIL' }];
      component.statementPreferencesDetails = mockGetAccountStatementPreferences;
      component.statementDetails = mockStatementDetails;
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.statementPreferencesDetails.postalAddress.addrLines = [];
      expect(component).toBeTruthy();
   });
   it('should be check casa account', () => {
      component.statementDetails.accountType = 'CA';
      component.constants.accountTypes.currentAccountType.code = 'CA';
      component.ngOnInit();
      expect(component.isFrequencyInfo).toBe(true);
   });
   it('should be check MFC account', () => {
      component.statementDetails.accountType = 'IS';
      component.constants.accountTypes.mfcvafLoanAccountType.code = 'IS';
      component.ngOnInit();
      expect(component.isMfc).toBe(true);
   });

   it('should emit click event', () => {
      component.changeStatementPreferencesDetails.subscribe((data) => {
         expect(data).toBeTruthy();
      });
      fixture.detectChanges();
      component.updateStatementPreferences();
   });
   it('should cal updateStatementPreferencesPostalAddress', () => {
      component.updateStatementPreferencesPostalAddress(mockGetAccountStatementPreferences);
      expect(component.statementPreferencesDetails).toEqual(mockGetAccountStatementPreferences);
   });
   it('should call openEditAddress', () => {
      component.openEditAddress();
      expect(component.statementDetails.isGroupDisabled).toBe(true);
      expect(component.isEditAddress).toBe(true);
   });
   it('should call closeEditAddress', () => {
      component.closeEditAddress();
      expect(component.statementDetails.isGroupDisabled).toBe(false);
      expect(component.isEditAddress).toBe(false);
   });
   it('should be call isDisable', () => {
      component.statementDetails.isGroupDisabled = true;
      component.statementPreferencesDetails.deliveryMode = '';
      component.statementDetails.inProgress = false;
      expect(component.isDisable()).toBe(true);
   });
   it('should be call isDisable return false', () => {
      component.statementDetails.isGroupDisabled = false;
      component.statementPreferencesDetails.deliveryMode = 'Email';
      component.statementDetails.inProgress = false;
      expect(component.isDisable()).toBe(false);
   });
});
