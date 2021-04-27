import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { AccountVisibilityComponent } from './account-visibility.component';
import { AccountService } from '../../dashboard/account.service';

import {
   IDashboardAccounts, IDashboardAccount, ILinkableAccounts, IRefreshAccountsApiResult,
   ILinkedAccount,
   IAccountLists
} from '../../core/services/models';
import { AlertActionType } from '../../shared/enums';
import { GaTrackingService } from '../../core/services/ga.service';

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

const mockDashboardAccounts: ILinkedAccount[] =
   [
      {
         itemAccountId: '1',
         accountNumber: '377095400260134',
         accountName: 'Test',
         accountType: 'CC',
         enabled: true
      },
      {
         itemAccountId: '2',
         accountNumber: '5298740000743030',
         accountName: 'SEPLASTIC',
         accountType: 'CC',
         enabled: true
      },
      {
         itemAccountId: '3',
         accountNumber: '5898460761469956',
         accountName: 'CC',
         accountType: 'CC',
         enabled: true
      }
   ];

const mockAccountHideShow: any = {
   metadata: {
      resultData:
         [{
            transactionID: '1',
            resultDetail: [{
               operationReference: 'CustAcctPreferenceMaint',
               result: 'R00',
               status: 'SUCCESS',
               reason: 'SUCCESSFUL'
            }]
         }]
   }
};
const mockAccountHideShowError: IAccountLists[] = undefined;

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

const mockValidResponse = {};

const mockInvalidResponse = { 8002684602501: 'R00', 8001724876001: 'R15' };

const mockRefreshAccountsApiResponse: IRefreshAccountsApiResult = {
   result: {
      resultCode: 0,
      resultMessage: ''
   }
};

const accountServiceStub = {

   getLinkableAccounts: jasmine.createSpy('getLinkableAccounts').and.returnValue(Observable.of(mockLinkableAccounts)),
   getHideShowAccounts: jasmine.createSpy('updateAccountEnable').and.returnValue(Observable.of(mockDashboardAccounts)),
   getEnabledAccounts: jasmine.createSpy('updateAccountEnable').and.returnValue(Observable.of(mockAccountHideShow)),
   getEnabledAccountsWithError: jasmine.createSpy('updateAccountEnable').and.returnValue(Observable.of(mockAccountHideShowError)),
   getEnabledAccountsResponse: jasmine.createSpy('updateAccountEnable')
      .and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      })),
   linkAccounts: jasmine.createSpy('linkAccounts').and
      .returnValues(Observable.of(mockValidResponse), Observable.of(mockInvalidResponse),
         Observable.create(observer => {
            observer.error(new Error('error'));
         }),
         Observable.of(mockValidResponse),
   ),

   refreshAccounts: jasmine.createSpy('refreshAccounts').and.returnValue(Observable.of(mockRefreshAccountsApiResponse)),
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('AccountVisibilityComponent', () => {
   let component: AccountVisibilityComponent;
   let fixture: ComponentFixture<AccountVisibilityComponent>;
   let service: AccountService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [AccountVisibilityComponent, SkeletonLoaderPipe],
         providers: [{ provide: AccountService, useValue: accountServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountVisibilityComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.isEnabled = true;
      service = fixture.debugElement.injector.get(AccountService);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should not hide or show account in case of API response is empty', () => {
      service.updateAccountEnable = accountServiceStub.getEnabledAccountsWithError;
      component.saveAccountVisibility(mockDashboardAccounts[0]);
      expect(component.notificationType).toBe('ERROR');
   });

   it('should not hide or show account in case of API response gives error', () => {
      service.updateAccountEnable = accountServiceStub.getEnabledAccountsResponse;
      fixture.detectChanges();
      component.saveAccountVisibility(mockDashboardAccounts[0]);
      expect(component.notificationType).toBe('ERROR');
   });

   it('should not be able to hide account from dashboard when user tries to hide last account', () => {
      service.updateAccountEnable = accountServiceStub.getEnabledAccounts;
      for (const account in component.accountsShowHide) {
         component.accountsShowHide[account].enabled = false;
      }
      component.saveAccountVisibility(mockDashboardAccounts[0]);
      expect(component.accountsShowHide[0].isFreezed).toBe(false);
   });

   it('should close the notification', () => {
      component.onAlertLinkSelected(AlertActionType.Close);
      expect(component.isNotification).toBe(false);
   });
}
);
