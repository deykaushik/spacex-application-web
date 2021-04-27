import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { AccountListComponent } from './account-list.component';
import { IAccountDetail, IClientDetails } from './../../../core/services/models';
import { By } from '@angular/platform-browser';
import { AmountTransformPipe } from './../../pipes/amount-transform.pipe';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';

describe('AccountListComponent', () => {
   let component: AccountListComponent;
   let fixture: ComponentFixture<AccountListComponent>;

   const clientDetails: IClientDetails = {
      FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
      CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
      EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
      Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
   };
   const defaultAccount = { accountType: 'test', accountNumber: '121313', accountName: 'test', itemAccountId: 2 };
   const clientProfileDetailsServiceStub = {
      setDefaultAccountId: jasmine.createSpy('setDefaultAccountId'),
      getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.callFake((accounts: IAccountDetail[]) => {
         return accounts.find(acc => acc.itemAccountId === defaultAccount.itemAccountId.toString());
      }),
      getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
   };
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [AccountListComponent, AmountTransformPipe],
         providers: [{ provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountListComponent);
      component = fixture.componentInstance;
      component.accounts = [{
         accountNumber: '123456',
         availableBalance: 24567,
         currentBalance: 34567,
         nickname: 'Test account',
         accountLevel: '',
         accountRules: null,
         accountType: '',
         allowCredits: false,
         allowDebits: false,
         currency: 'R',
         isAlternateAccount: false,
         isPlastic: true,
         isRestricted: false,
         itemAccountId: '324324',
         productCode: '',
         productDescription: '',
         profileAccountState: '',
         sourceSystem: '',
         viewAvailBal: true,
         viewCredLim: false,
         viewCurrBal: false,
         viewMinAmtDue: false,
         viewStmnts: false
      }];
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should return correct account type style for different account types', () => {
      expect(component.getStyle('CA')).toBe('current');

      expect(component.getStyle('SA')).toBe('savings');

      expect(component.getStyle('CC')).toBe('credit-card');

      expect(component.getStyle('NC')).toBe('loan');
      expect(component.getStyle('IS')).toBe('loan');
      expect(component.getStyle('HL')).toBe('loan');

      expect(component.getStyle('TD')).toBe('investment');
      expect(component.getStyle('DS')).toBe('investment');
      expect(component.getStyle('INV')).toBe('investment');
      expect(component.getStyle('Rewards')).toBe('rewards');
      expect(component.getStyle('')).toBe('default');
   });

   it('should invoke account selection event', () => {
      component.onAccountSelect(null);
      component.onAccountSelection.subscribe((data) => {
         expect(data).toBeFalsy();
      });
   });

   it('should invoke isDisable', () => {
      expect(component.isDisabled(undefined)).toBeFalsy();
      expect(component.isDisabled({ allowDebits: true })).toBeFalsy();
      component.isToAccountFlag = true;
      expect(component.isDisabled({ allowCredits: true })).toBeFalsy();
   });

   it('should return unique ID', () => {
      component.title = 'From Account';
      const id = component.getID();
      expect(id).toBe('from_account');
   });
});
