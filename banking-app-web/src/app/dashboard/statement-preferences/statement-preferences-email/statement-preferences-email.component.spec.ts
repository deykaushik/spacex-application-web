import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { IStatementPreferences, IStatementDetails } from '../../../core/services/models';
import { StatementPreferencesEmailComponent } from './statement-preferences-email.component';
import { assertModuleFactoryCaching } from '../../../test-util';

const mockGetAccountStatementPreferences: IStatementPreferences = {
   itemAccountId: '1',
   accountNumber: '1001037693',
   frequency: 'MONTHLY',
   deliveryMode: 'EMAIL',
   email: ['GUNJAL138@GMAIL.COM', 'TEST@GAS.COM'],
   postalAddress: {
      addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
      city: 'JOHANNESBURG',
      postalCd: '2191'
   }
};
const mockAccountStatementPreferences: IStatementPreferences = {
   itemAccountId: '1',
   accountNumber: '1001037693',
   frequency: 'MONTHLY',
   deliveryMode: 'EMAIL',
   email: ['GUNJAL138@GMAIL.COM', 'GUNJAL138@GMAIL.COM'],
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
describe('StatementPreferencesEmailComponent', () => {
   let component: StatementPreferencesEmailComponent;
   let fixture: ComponentFixture<StatementPreferencesEmailComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [StatementPreferencesEmailComponent],
         imports: [FormsModule],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StatementPreferencesEmailComponent);
      component = fixture.componentInstance;
      component.buttonGroup = [{ label: 'Post', value: 'POST' }, { label: 'Email', value: 'EMAIL' }];
      component.statementPreferencesDetails = mockGetAccountStatementPreferences;
      component.statementDetails = mockStatementDetails;
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.statementPreferencesDetails.email = undefined;
      expect(component).toBeTruthy();
   });
   it('should check for casa account', () => {
      component.statementDetails.accountType = 'CA';
      component.constants.accountTypes.currentAccountType.code = 'CA';
      component.ngOnInit();
      expect(component.isCasa).toBe(true);
   });
   it('should check for MFC account', () => {
      component.statementDetails.accountType = 'IS';
      component.constants.accountTypes.mfcvafLoanAccountType.code = 'IS';
      component.ngOnInit();
      expect(component.isMfc).toBe(true);
   });

   it('should emit click event', () => {
      const testForm = <NgForm>{
         value: {
            primaryEmail: mockAccountStatementPreferences.email[0],
            secondaryEmail: mockAccountStatementPreferences.email[1]
         }
      };
      component.updateStatementPreferences(testForm);
      fixture.detectChanges();
      component.changeStatementPreferencesDetails.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });
   it('should be remove secondary email field when secondary email is empty', () => {
      const testForm = <NgForm>{
         value: {
            primaryEmail: mockAccountStatementPreferences.email[0],
            secondaryEmail: ''
         }
      };
      component.updateStatementPreferences(testForm);
      fixture.detectChanges();
      expect(component.addSecondaryEmailOption).toBe(true);
      expect(component.secondaryEmailVisible).toBe(false);
   });
   it('should return false when secondary email is not valid', () => {
      const testForm = <NgForm>{
         value: {
            primaryEmail: mockAccountStatementPreferences.email[0],
            secondaryEmail: '1@1....'
         }
      };
      component.updateStatementPreferences(testForm);
      fixture.detectChanges();
      expect(component.updateStatementPreferences(testForm)).toBe(false);
   });
   it('should return false when primary email is empty ', () => {
      const testForm = <NgForm>{
         value: {
            primaryEmail: '',
            secondaryEmail: ''
         }
      };
      component.updateStatementPreferences(testForm);
      fixture.detectChanges();
      expect(component.updateStatementPreferences(testForm)).toBe(false);
   });

   it('should be add secondary email address', () => {
      component.addSecondaryEmail();
      expect(component.addSecondaryEmailOption).toBe(false);
      expect(component.secondaryEmailVisible).toBe(true);
   });

   it('should be delete secondary email address', () => {
      component.statementPreferencesDetails.email[1] = '1@1.com';
      component.deleteSecondaryEmail();
      expect(component.addSecondaryEmailOption).toBe(true);
      expect(component.secondaryEmailVisible).toBe(false);
   });
   it('should be on focus in input field', () => {
      component.onFocus();
      expect(component.statementDetails.isGroupDisabled).toBe(false);
   });
   it('should be call isDisable', () => {
      component.statementDetails.isGroupDisabled = false;
      component.statementPreferencesDetails.deliveryMode = '';
      component.statementDetails.inProgress = false;
      expect(component.isDisable(true)).toBe(true);
   });
   it('should be call isDisable return false', () => {
      component.statementDetails.isGroupDisabled = false;
      component.statementPreferencesDetails.deliveryMode = 'Email';
      component.statementDetails.inProgress = false;
      expect(component.isDisable(false)).toBe(false);
   });
   it('should invalidate primary email on change', () => {
      component.onPrimaryEmailChange('bob');
      expect(component.isValidPrimaryEmail).toBe(false);
   });

   it('should validate primary email on change', () => {
      component.onPrimaryEmailChange('bob@bob.com');
      expect(component.isValidPrimaryEmail).toBe(true);
   });
   it('should invalidate secondary email on change', () => {
      component.onSecondaryEmailChange('bob');
      expect(component.isValidSecondaryEmail).toBe(false);
   });

   it('should validate secondary email on change', () => {
      component.onSecondaryEmailChange('bob@bob.com');
      expect(component.isValidSecondaryEmail).toBe(true);
   });

   it('should compare secondary email with primary email on change and display error if both are same', () => {
      const testForm = {
         form: {
            controls: {
               primaryEmail: {
                  value: 'test@test.com'
               },
               secondaryEmail: {
                  value: 'test@test.com',
                  setErrors: function () { return true; }
               }
            }
         }
      };
      component.checkEqual(testForm);
      fixture.detectChanges();
      expect(component.checkSame).toBe(true);
   });
   it('should compare secondary email with primary email on change and hide error message if both are diffrent', () => {
      const testForm = {
         form: {
            controls: {
               primaryEmail: {
                  value: 'test@test.com'
               },
               secondaryEmail: {
                  value: 'test@t.com',
                  setErrors: function () { return true; }
               }
            }
         }
      };
      component.checkEqual(testForm);
      fixture.detectChanges();
      expect(component.checkSame).toBe(false);
   });
});
