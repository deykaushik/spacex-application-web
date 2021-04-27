import { Constants } from './../../../core/utils/constants';
import { AccountService } from '../../../dashboard/account.service';
import { FormsModule } from '@angular/forms';
import { IApiResponse, IDashboardAccounts, IDashboardAccount, IStatementPreferences, IMetaData } from '../../../core/services/models';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from '../../../core/services/loader.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { CommonUtility } from '../../../core/utils/common';
import { SkeletonLoaderPipe } from '../../../shared/pipes/skeleton-loader.pipe';
import { SharedModule } from '../../../shared/shared.module';
import { ApiService } from '../../../core/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { WindowRefService } from '../../../core/services/window-ref.service';
import { assertModuleFactoryCaching } from '../../../test-util';
import { StatementPreferencesComponent } from '../../statement-preferences/statement-preferences.component';
import { PreferencesComponent } from './preferences.component';

const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/scheduled/:id', component: testComponent },
   { path: 'Mobile/:id', component: testComponent },
];
const windowServiceStub = {
   nativeWindow: {
      innerWidth: 800
   }
};
const mockGetAccountStatementPreferences: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'Monthly',
      deliveryMode: 'EMAIL',
      email: ['GUNJAL138@GMAIL.COM', 'TEST@GAS.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {}

};
const mockUpdateAccountStatementPreferences: IMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Maintain Statement Preferences Delivery',
               result: 'R00',
               status: 'SUCCESS'
            }
         ]
      }
   ]
};

const mockAccountsData: IDashboardAccount[] = [{
   AccountName: 'Inv SA',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'SA',
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
   AccountName: 'Inv CA',
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
},
{
   AccountName: 'Inv CC',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CC',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '3',
   InterestRate: 0
},
{
   AccountName: 'Inv INV',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'INV',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '5',
   InterestRate: 0
}];

const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccountsData,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];

const mockAccountData: IDashboardAccount = {
   AccountName: 'Inv IS',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'IS',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '3',
   InterestRate: 0
};

const mockAccountDataWithINV: IDashboardAccount = {
   AccountName: 'Inv INV',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'INV',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '3',
   InterestRate: 0
};

const accountServiceStub = {
   getAccountStatementPreferences: jasmine.createSpy('getAccountStatementPreferences')
      .and.returnValue(Observable.of(mockGetAccountStatementPreferences)),
   updateAccountStatementPreferences:
   jasmine.createSpy('updateAccountStatementPreferences').and.returnValue(Observable.of(mockUpdateAccountStatementPreferences)),
   getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),
   setAccountData: jasmine.createSpy('setAccountData'),
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData),
   showAlertMessage: jasmine.createSpy('showAlertMessage').and.returnValue(true),
   getInvAccountData: jasmine.createSpy('getInvAccountData').and.returnValue(mockAccountDataWithINV)
};

describe('PreferencesComponent', () => {
   let component: PreferencesComponent;
   let fixture: ComponentFixture<PreferencesComponent>;
   let service: AccountService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam), SharedModule],
         declarations: [PreferencesComponent, StatementPreferencesComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [LoaderService,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: WindowRefService, useValue: windowServiceStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '3' }) } }]
      })
         .compileComponents();
   }));
   beforeEach(() => {
      fixture = TestBed.createComponent(PreferencesComponent);
      component = fixture.componentInstance;
      service = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
