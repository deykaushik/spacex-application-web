import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { LinkAccountsComponent } from './link-accounts.component';
import { AccountService } from '../../dashboard/account.service';

import { IDashboardAccounts, IDashboardAccount, ILinkableAccounts, IRefreshAccountsApiResult } from '../../core/services/models';

const mockAccounts: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
},
{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0
}];

const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccounts,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];

const mockLinkableAccounts: ILinkableAccounts[] = [{
   Balance: -1124609.02,
   AvailableBalance: 0,
   AccountNumber: '8002684602501',
   AccountType: 'HL',
   Status: 'OPE',
   NewAccount: true,
   LastUpdate: '2017-10-27 03:40:10 PM',
   Currency: '&#x52;',
   SiteId: 16390,
   InterestRate: 0
},
{
   Balance: 14852.25,
   AvailableBalance: 0,
   AccountNumber: '8001724876001',
   AccountType: 'HL',
   Status: 'OPE',
   NewAccount: true,
   LastUpdate: '2017-10-27 03:48:47 PM',
   Currency: '&#x52;',
   SiteId: 16390,
   InterestRate: 0
}];

const mockValidResponse = { 8002684602501: 'R00', 8001724876001: 'R00' };

const mockInvalidResponse = { 8002684602501: 'R00', 8001724876001: 'R15' };

const mockRefreshAccountsApiResponse: IRefreshAccountsApiResult = {
   result: {
      resultCode: 0,
      resultMessage: ''
   }
};

const accountServiceStub = {

   getLinkableAccounts: jasmine.createSpy('getLinkableAccounts').and.returnValue(Observable.of(mockLinkableAccounts)),

   getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),

   linkAccounts: jasmine.createSpy('linkAccounts').and
      .returnValues(Observable.of(mockValidResponse), Observable.of(mockInvalidResponse),
      Observable.create(observer => {
         observer.error(new Error('error'));
      }),
      Observable.of(mockValidResponse),
   ),

   refreshAccounts: jasmine.createSpy('refreshAccounts').and.returnValue(Observable.of(mockRefreshAccountsApiResponse))
};

describe('LinkAccountsComponent', () => {
   let component: LinkAccountsComponent;
   let fixture: ComponentFixture<LinkAccountsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LinkAccountsComponent, AmountTransformPipe],
         providers: [{ provide: AccountService, useValue: accountServiceStub }],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LinkAccountsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should link accounts and show success message in case of success', () => {
      component.accountsToLink = mockLinkableAccounts;

      component.onLinkAccountClick();
      expect(component.showSuccessMsg).toBe(true);
   });

   it('should link accounts and show error message in case of failure', () => {
      component.accountsToLink = mockLinkableAccounts;

      component.onLinkAccountClick();
      expect(component.showErrorMsg).toBe(true);
   });

   it('should show error in case link accounts give error', () => {
      component.accountsToLink = mockLinkableAccounts;

      component.onLinkAccountClick();
      expect(component.showErrorMsg).toBe(true);

      component.tryAgainForLinkAccounts();
      expect(component.showSuccessMsg).toBe(true);
   });

   it('should handle non defined response in case link accounts', () => {
      expect(component.isResponseValid(undefined, [])).toBe(false);
   });

   it('should select/deselect account link object for linkage on checkbox select/deselect', () => {
      component.selectLinkCheckBox(mockLinkableAccounts[0]);
      expect(component.accountsToLink).toContain(mockLinkableAccounts[0]);

      component.selectLinkCheckBox(mockLinkableAccounts[0]);
      expect(component.accountsToLink).not.toContain(mockLinkableAccounts[0]);
   });

   it('should close success message on sucess icon click', () => {
      component.closeSuccessMessage();
      expect(component.showSuccessMsg).toBe(false);
   });

   it('should return current class for CA account', () => {
      expect(component.getAccountTypeStyle('CA')).toBe('current');
   });

   it('should return current class for SA account', () => {
      expect(component.getAccountTypeStyle('SA')).toBe('savings');
   });
});
