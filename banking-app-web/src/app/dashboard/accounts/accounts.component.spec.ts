import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { assertModuleFactoryCaching } from './../../test-util';
import { GreenbacksEnrolmentService } from './../../core/services/greenbacks-enrolment.service';
import { IRefreshAccountsApiResult, IDashboardAccounts, IRenameAccount } from '../../core/services/models';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { AccountService } from '../account.service';
import { AccountsComponent } from './accounts.component';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';


let mockActiveAccounts: IDashboardAccounts[] = [{
   'ContainerName': 'Bank', 'Accounts':
      [
         {
            'AccountName': 'STOP CHEQU', 'Balance': 580303387,
            'AvailableBalance': 580287819.94, 'AccountNumber': 1009000675,
            'AccountType': 'CA', 'AccountIcon': 'glyphicon-account_current',
            'NewAccount': true, 'LastUpdate': '2017-08-18 10:51:01 AM',
            'InstitutionName': 'Nedbank (South Africa)', 'Currency': '&#x52;',
            'SiteId': '16390', 'ItemAccountId': '1',
            'InterestRate': 0
         }
      ],
   'ContainerIcon': 'glyphicon-account_current',
   'Assets': 179946723978.75
}];

const mockRewardJoinData = [{
   ContainerName: 'Rewards',
   Accounts: [{
      AccountName: 'Greenbacks',
      Balance: 0,
      AvailableBalance: 0,
      AccountNumber: '',
      AccountType: 'GB'
   }]
}];

const mockAccountsWithRewards: IDashboardAccounts[] = [
   {
      'ContainerName': 'Bank', 'Accounts':
         [
            {
               'AccountName': 'STOP CHEQU', 'Balance': 580303387,
               'AvailableBalance': 580287819.94, 'AccountNumber': 1009000675,
               'AccountType': 'CA', 'AccountIcon': 'glyphicon-account_current',
               'NewAccount': true, 'LastUpdate': '2017-08-18 10:51:01 AM',
               'InstitutionName': 'Nedbank (South Africa)', 'Currency': '&#x52;',
               'SiteId': '16390', 'ItemAccountId': '1',
               'InterestRate': 0
            }
         ],
      'ContainerIcon': 'glyphicon-account_current',
      'Assets': 179946723978.75
   }, {
      'ContainerName': 'Rewards',
      'Accounts':
         [
            {
               'AccountName': 'Rewards',
               'Balance': 580303387,
               'AvailableBalance': 580287819.94,
               'AccountNumber': 1009000675,
               'AccountType': 'Rewards',
               'AccountIcon': 'glyphicon-account_current',
               'NewAccount': true,
               'LastUpdate': '2017-08-18 10:51:01 AM',
               'InstitutionName': 'Nedbank (South Africa)',
               'Currency': 'MR',
               'SiteId': '16390',
               'ItemAccountId': '2',
               'InterestRate': 0
            }
         ],
      'ContainerIcon': 'glyphicon-account_current',
      'Assets': 179946723978.75
   },
   {
      'ContainerName': 'Forex', 'Accounts':
         [
            {
               'AccountName': 'USD',
               'Balance': 580303387,
               'AvailableBalance': 580287819.94,
               'AccountNumber': 1009000675,
               'AccountType': 'CFC',
               'AccountIcon': 'glyphicon-account_current',
               'NewAccount': true,
               'LastUpdate': '2017-08-18 10:51:01 AM',
               'InstitutionName': 'Nedbank (South Africa)',
               'Currency': '&#x24;',
               'SiteId': '16390',
               'ItemAccountId': '3',
               'InterestRate': 0
            }
         ],
      'ContainerIcon': 'glyphicon-account_current',
      'Assets': 179946723978.75
   }];

const mockAccountsWithInvestments: IDashboardAccounts[] = [{
   'ContainerName': 'Investment',
   'Accounts': [{
      'AccountName': 'Df Account',
      'Balance': 30000.0,
      'AvailableBalance': 30000.0,
      'AccountNumber': parseInt('23626775-9996', 0),
      'AccountType': 'DS',
      'AccountIcon': '',
      'NewAccount': true,
      'LastUpdate': '2018-05-15 04:02:17 PM',
      'InstitutionName': 'Nedbank (South Africa)',
      'Currency': '&#x52;',
      'SiteId': '16390',
      'ItemAccountId': '6',
      'InterestRate': 8.9,
      'IsProfileAccount': true
   }, {
      'AccountName': 'Df Account',
      'Balance': 25500.0,
      'AvailableBalance': 25500.0,
      'AccountNumber': parseInt('23626775-9997', 0),
      'AccountType': 'DS',
      'AccountIcon': '',
      'NewAccount': true,
      'LastUpdate': '2018-05-15 04:02:17 PM',
      'InstitutionName': 'Nedbank (South Africa)',
      'Currency': '&#x52;',
      'SiteId': '16390',
      'ItemAccountId': '7',
      'InterestRate': 7.8,
      'IsProfileAccount': true
   }, {
      'AccountName': 'Df Account',
      'Balance': 25500.0,
      'AvailableBalance': 25500.0,
      'AccountNumber': 23626774,
      'AccountType': 'DS',
      'AccountIcon': '',
      'NewAccount': true,
      'LastUpdate': '2018-05-15 04:02:17 PM',
      'InstitutionName': 'Nedbank (South Africa)',
      'Currency': '&#x52;',
      'SiteId': '16390',
      'ItemAccountId': '7',
      'InterestRate': 7.8,
      'IsProfileAccount': true
   }],
   'ContainerIcon': 'glyphicon-account_current',
   'Assets': 179946723978.75
}];

const mockRefreshAccountsApiResponse: IRefreshAccountsApiResult = {
   result: {
      resultCode: 0,
      resultMessage: ''
   }
};
const clientProfileDetailsServiceStub = {
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue([])
};
const accountServiceStub = {
   getDashboardAccounts: function () {
      return new BehaviorSubject(mockActiveAccounts);
   },
   getAccountConfig: jasmine.createSpy('getAccountConfig').and.returnValue([]),
   refreshAccounts: jasmine.createSpy('refreshAccounts').and.returnValue(Observable.of(mockRefreshAccountsApiResponse)),
   accountsRefreshObservable: new Subject<boolean>(),
   resetDashboardAccountsData: jasmine.createSpy('resetDashboardAccountsData'),
   setDashboardAccountsData: jasmine.createSpy('setDashboardAccountsData'),
};

const gbEnrolmentStub = {
   updateForEnrolmentToGreenbacks: jasmine.createSpy('updateForEnrolmentToGreenbacks').and.returnValue(mockRewardJoinData)
};

const preFillServiceStub = {};

const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
};
const preApprovedOffersServiceStub = {
      offersObservable: new BehaviorSubject(null),
      isPreApprovedOffersActive: true,
      updateForPreApproveOffers: jasmine.createSpy('updateForPreApproveOffers').and.callFake(accountContainer => {
            return [{ ContainerName: 'Loan', Accounts: [], ContainerIcon: 'ContainerIcon1', Assets: 1 },
                    { ContainerName: 'Loan', Accounts: [], ContainerIcon: 'ContainerIcon2', Assets: 2 }];
      })
};

describe('AccountsComponent', () => {
   let component: AccountsComponent;
   let fixture: ComponentFixture<AccountsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [AccountsComponent, SkeletonLoaderPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
{provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub },
            { provide: AccountService, useValue: accountServiceStub },
            { provide: GreenbacksEnrolmentService, useValue: gbEnrolmentStub },
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
      accountServiceStub.accountsRefreshObservable.next(null);
   });

   it('should remove rewards if feature is turned off', () => {
      mockActiveAccounts = mockAccountsWithRewards;
      const accountsWithoutRewards = mockAccountsWithRewards.filter(acc => acc.ContainerName !== 'Rewards');
      component.showRewardsFeature = false;
      component.getAccountData();
      expect(component.accountContainers).toEqual(accountsWithoutRewards);
      component.showPreApprovedOffers = true;
      component.getAccountData();
      expect(component.accountContainers.length).toEqual(2);
   });

   it('should update nickname of all investment accounts under same investor', () => {
      const renameAccount = {} as IRenameAccount;
      renameAccount.AccountNickName = 'test';
      renameAccount.AccountNumber = '23626775-9996';
      component.accountContainers = mockAccountsWithInvestments;
      component.onAccountNameUpdate(renameAccount);
      expect(component.accountContainers[0].Accounts[1].AccountName).toBe('test');
      expect(component.accountContainers[0].Accounts[2].AccountName).toBe('Df Account');
   });

   it('should add reward data/join if feature is turned on', () => {
      component.canEnrolGreenbacks = true;
      component.getAccountData();
      expect(component.accountContainers).toEqual(mockRewardJoinData as any);
   });

   it('should not add reward data/join if feature is turned off', () => {
      component.canEnrolGreenbacks = false;
      component.getAccountData();
      expect(component.accountContainers).toEqual(mockActiveAccounts);
      mockActiveAccounts = mockAccountsWithRewards;
      const accountsWithoutRewards = mockAccountsWithRewards.filter(acc => acc.ContainerName !== 'Rewards');
      component.showRewardsFeature = false;
      component.canEnrolGreenbacks = true;
      component.getAccountData();
      expect(component.accountContainers).toEqual(accountsWithoutRewards);
   });
});
