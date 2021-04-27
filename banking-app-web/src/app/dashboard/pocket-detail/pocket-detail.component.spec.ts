import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap';
import { assertModuleFactoryCaching } from './../../test-util';
import { SharedModule } from './../../shared/shared.module';
import { PocketDetailComponent } from './pocket-detail.component';
import { AccountCardComponent } from './../account-card/account-card.component';
import { AccountTransactionsComponent } from './../account-transactions/account-transactions.component';
import {
  IDashboardAccounts, IDashboardAccount, IClientDetails, IAccountBalanceDetail, IClientAccountDetail, ISettlementDetail,
  ITransactionDetail, IApiResponse
} from '../../core/services/models';
import { IAccountConfig } from './../dashboard.model';
import { AccountService } from '../account.service';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { PreFillService } from '../../core/services/preFill.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import { UpliftDormancyComponent } from './../uplift-dormancy/uplift-dormancy.component';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Constants } from './../../core/utils/constants';
import { AccountBalanceDetailComponent } from './../account-balance-detail/account-balance-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AlertActionType } from '../../shared/enums';

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
  ItemAccountId: '7',
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
},
{
  AccountName: 'Investment',
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
}, {
  AccountName: 'FCA',
  Balance: 0,
  AvailableBalance: 0,
  AccountNumber: 6009017640,
  AccountType: 'CFC',
  AccountIcon: 'glyphicon-account_current',
  NewAccount: true,
  LastUpdate: '2017-08-18 10:51:01 AM',
  InstitutionName: 'Nedbank (South Africa)',
  Currency: '&#x24;',
  SiteId: '16390',
  ItemAccountId: '4',
  InterestRate: 0
}];



const FCAAccounts: IDashboardAccount[] = [
  {
    AccountName: 'TRVL CRD 1',
    Balance: 49824,
    AvailableBalance: 49824,
    AccountNumber: 5299850000006426,
    AccountType: 'TC',
    AccountIcon: '',
    NewAccount: true,
    LastUpdate: '2018-05-31 04:04:42 PM',
    InstitutionName: 'Nedbank (South Africa)',
    Currency: '&#x52;',
    SiteId: '16390',
    ItemAccountId: '1',
    InterestRate: 0,
    IsShow: true,
    IsProfileAccount: true,
    ProductType: 'MAS',
    Pockets: [{
      Currency: 'AUD',
      Balance: 1000,
      Priority: 1
    },
    {
      Currency: 'CAD',
      Balance: 1000,
      Priority: 2
    },
    {
      Currency: 'EUR',
      Balance: 1000,
      Priority: 3
    },
    {
      Currency: 'GBP',
      Balance: 1000,
      Priority: 4
    },
    {
      Currency: 'ILS',
      Balance: 1000,
      Priority: 5
    },
    {
      Currency: 'JPY',
      Balance: 1000,
      Priority: 6
    },
    {
      Currency: 'USD',
      Balance: 1000,
      Priority: 7
    }]
  }];


const mockDashboardAccounts: IDashboardAccounts[] = [
  {
    ContainerName: 'Bank',
    Accounts: mockAccounts,
    ContainerIcon: 'glyphicon-account_current',
    Assets: 747248542.18
  },
  {
    ContainerName: 'Foreign',
    Accounts: FCAAccounts,
    ContainerIcon: 'glyphicon-account_current',
    Assets: 747248542.18
  }];

const mockAccountTransactions: ITransactionDetail[] = [{
  TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
  Description: 'PAYMENT - THANK YOU',
  Amount: 28000,
  Debit: false,
  Account: '377093000052084',
  PostedDate: '2017-09-26 02:00:00 AM',
  CategoryId: 0,
  ChildTransactions: [],
  OriginalCategoryId: 0,
  RunningBalance: 1000
}];

const mockForeignTransactionData: ITransactionDetail[] = [{
  Description: 'FUNDS LOADED ONTO CARD',
  Currency: 'USD',
  Amount: 1000,
  RunningBalance: 0,
  Debit: false,
  Account: '5299850000006426',
  PostedDate: '2018-06-01T00:00:00',
  CategoryId: 0,
  TransactionId: '01',
  ChildTransactions: [],
  OriginalCategoryId: 0,
},
{
  Description: 'FUNDS CASHED OUT',
  Currency: 'USD',
  Amount: -1000,
  RunningBalance: 0,
  Debit: true,
  Account: '5299850000006426',
  PostedDate: '2018-05-19T00:00:00',
  CategoryId: 0,
  TransactionId: null,
  ChildTransactions: [],
  OriginalCategoryId: 0,
}
];

const mockAccountConfig: IAccountConfig = {
  type: 'Card',
  title: 'Credit Cards',
  currentBalance: 'Current Balance',
  availableBalance: 'Available Balance'
};



function getClientDetails(): IClientDetails {
  return {
    CisNumber: 110282180605,
    FirstName: 'Marc',
    SecondName: '',
    Surname: 'Schutte',
    FullNames: 'Mr Marc Schutte',
    CellNumber: '+27992180605',
    EmailAddress: '',
    BirthDate: '1977-03-04T22:00:00Z',
    FicaStatus: 701,
    SegmentId: 'AAAZZZ',
    IdOrTaxIdNo: 7703055072088,
    SecOfficerCd: '36407',
    AdditionalPhoneList: [
      {
        AdditionalPhoneType: 'BUS',
        AdditionalPhoneNumber: '(086) 1828828'
      },
      {
        AdditionalPhoneType: 'CELL',
        AdditionalPhoneNumber: '+27992180605'
      },
      {
        AdditionalPhoneType: 'HOME',
        AdditionalPhoneNumber: '(078) 2228519'
      }
    ],
    Address: {
      AddressLines: [
        {
          AddressLine: 'G12 KYLEMORE'
        },
        {
          AddressLine: 'THE MARINA RESIDENTS DOCK ROAD'
        },
        {
          AddressLine: 'WATERFRONT'
        }
      ],
      AddressCity: 'CAPE TOWN',
      AddressPostalCode: '08001'
    }
  };
}
const mockClientDetailsData = getClientDetails();
const clientPreferencesStub = {
  getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetailsData),
};


const mockRewardsAccounts: IDashboardAccount[] = [{
  AccountName: 'Greenbacks',
  Balance: 2196,
  AvailableBalance: 61,
  AccountNumber: 601710000004,
  AccountType: 'Rewards',
  AccountIcon: null,
  NewAccount: null,
  LastUpdate: null,
  InstitutionName: null,
  Currency: 'GB',
  SiteId: null,
  ItemAccountId: '1',
  InterestRate: null
}];
const mockDashboardIsAccounts: IDashboardAccounts[] = [{
  ContainerName: 'Rewards',
  Accounts: mockRewardsAccounts,
  ContainerIcon: null,
  Assets: null
}];

const mockRewardsTransactions: ITransactionDetail[] = [{
  TransactionId: null,
  Description: 'Test MR bonus 3768000010300602',
  Amount: 2764.0,
  Debit: false,
  Account: '601710000004',
  PostedDate: '2017-10-27 12:00:00 AM',
  CategoryId: 0,
  ChildTransactions: [],
  OriginalCategoryId: 0,
  RunningBalance: 9298.0,
  Currency: 'GB',
  ShortDescription: null
}];

const mockFcaTransactions: ITransactionDetail[] = [{
  TransactionId: null,
  Description: 'FCA account',
  Amount: 2764.0,
  Debit: false,
  Account: '601710000014',
  PostedDate: '2017-10-27 12:00:00 AM',
  CategoryId: 0,
  ChildTransactions: [],
  OriginalCategoryId: 0,
  RunningBalance: 9298.0,
  Currency: '&#x24;',
  ShortDescription: null
}];


const mockAccountBalanceDetails: IAccountBalanceDetail = {
  movementsDue: 0,
  unclearedEffects: 0,
  accruedFees: 0,
  pledgedAmount: 0,
  crInterestDue: 0,
  crInterestRate: 0,
  dbInterestDue: 0,
  overdraftLimit: 10000,
  dbInterestRate: 16.25,
  isShowSettlement: true,
  isShowSettlementAmount: true
};

const mockSettlementDetails: ISettlementDetail = {
  settlementAmt: 100.00,
  settlementDate: '01-01-2018'
};

const mockPersonalLoanAccount: IDashboardAccount = {
  AccountName: 'PL-SL',
  Balance: 123112.23,
  AvailableBalance: 0,
  AccountNumber: 4009017640,
  AccountType: 'PL',
  AccountIcon: 'glyphicon-account_loan',
  NewAccount: true,
  LastUpdate: '2017-08-18 10:51:01 AM',
  InstitutionName: 'Nedbank (South Africa)',
  Currency: '&#x52;',
  SiteId: '16390',
  ItemAccountId: '5',
  InterestRate: 0
};

const mockAccountServiceError = Observable.create(observer => {
  observer.error(new Error('error'));
  observer.complete();
});

const systemErrorServiceStub = {
  closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

const getStartingBalanceStub = {
  getStartingBalance: jasmine.createSpy('getStartingBalance').and.returnValue(null)
};

const bsModalServiceStub = {
  show: jasmine.createSpy('show'),
  onHide: jasmine.createSpy('onHide')
};

const testComponent = class { };
const routerTestingParam = [
  { path: 'dashboard/account/scheduled/:id', component: testComponent }
];

const mockPockets = [{
  currency: {
    currency: 'USD',
    amount: 1000
  },
  priority: 2
}, {
  currency: {
    currency: 'EUR',
    amount: 2000
  },
  priority: 1
}];

describe('PocketDetailComponent', () => {
  let component: PocketDetailComponent;
  let fixture: ComponentFixture<PocketDetailComponent>;
  let router: Router;
  let service: AccountService;
  let modalService: BsModalService;

  const accountServiceStub = {
    getAccountTransactions: jasmine.createSpy('getAccountTransactions').and.returnValue(Observable.of(mockAccountTransactions)),
    getGraphTransactions: jasmine.createSpy('getGraphTransactions').and.returnValue(Observable.of(mockAccountTransactions)),
    getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),
    getAccountConfig: jasmine.createSpy('getAccountConfig').and.returnValue(mockAccountConfig),
    setAccountData: jasmine.createSpy('setAccountData'),
    getDashboardAccountsData: jasmine.createSpy('getDashboardAccountsData').and.returnValue(mockDashboardAccounts),
    getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockAccountBalanceDetails)),
    getGraphTransactionsForIS: Observable.of(mockRewardsTransactions),
    hasTransactionsAndDetailsForIS: jasmine.createSpy('hasTransactionsAndDetailsForIS').and.returnValue(false),
    getGraphTransactionsForFca: Observable.of(mockFcaTransactions),
    getSettlementDetails: jasmine.createSpy('getSettlementDetails').and.returnValue(Observable.of(mockSettlementDetails)),
    setSettlementData: jasmine.createSpy('setSettlementData'),
    setTransactionsForCASA: jasmine.createSpy('setTransactionsForCASA'),
    getTransactionsForCASA: jasmine.createSpy('getTransactionsForCASA').and.returnValue([]),
    getPockets: jasmine.createSpy('getPockets').and.returnValue(Observable.of(mockPockets))
  };

  assertModuleFactoryCaching();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routerTestingParam)],
      declarations: [PocketDetailComponent, SkeletonLoaderPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BsModalService, useValue: bsModalServiceStub },
        { provide: TermsService, userValue: {} },
        { provide: AccountService, useValue: accountServiceStub },
        { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }) } },
        PreFillService,
        { provide: SystemErrorService, useValue: systemErrorServiceStub },
        { provide: ClientProfileDetailsService, useValue: clientPreferencesStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    fixture = TestBed.createComponent(PocketDetailComponent);
    component = fixture.componentInstance;
    component.pocketCurrency = 'USD';
    router = TestBed.get(Router);
    modalService = TestBed.get(BsModalService);
    service = fixture.debugElement.injector.get(AccountService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh data on account change', () => {
    component.onAccountChange(FCAAccounts[0]);
    expect(component.accountId).toBe(1);
    expect(accountServiceStub.getGraphTransactions).toHaveBeenCalled();
    component.onAccountChange(FCAAccounts[0]);
  });

  it('should return zero if no account passed', () => {
    // component.pockets = mockPockets;
    expect(component.getPocketBalance('')).toBe(0);
  });

  it('should return amount if currency is present', () => {
    expect(component.getPocketBalance('USD')).toBe(1000);
  });

  it('should return false if no account type passed', () => {
    component.getFilteredTypeAccounts('LL');
    expect(component.featureVisible).toBeTruthy();
  });

  it('should update transaction', () => {
    component.availableBalance = 1000;
    component.updateRunningBalance('USD', mockForeignTransactionData);
    expect(component.getStartingBalance()).toBe(1000);
  });

  it('should get default Starting Balance', () => {
    component.accountType = 'CC';
    component.balance = 2000;
    component.getStartingBalance();
    expect(component.getStartingBalance()).toBe(2000);
  });

  it('should return true if travel card trips are active', () => {
    component.showTravelCardTrips = true;
    expect(component.isTrvelCardTripsActive()).toBeTruthy();
  });
});

describe('PocketDetailComponent', () => {
  let component: PocketDetailComponent;
  let fixture: ComponentFixture<PocketDetailComponent>;

  const mockAccountData = {
    AccountName: 'TRVL CRD 1',
    Balance: 49824,
    AvailableBalance: 49824,
    AccountNumber: 5299850000006426,
    AccountType: 'abcd',
    AccountIcon: '',
    NewAccount: true,
    LastUpdate: '2018-05-31 04:04:42 PM',
    InstitutionName: 'Nedbank (South Africa)',
    Currency: '&#x52;',
    SiteId: '16390',
    ItemAccountId: '1',
    InterestRate: 0,
    IsShow: true,
    IsProfileAccount: true,
    ProductType: 'MAS',
    Pockets: [{
      Currency: 'AUD',
      Balance: 1000,
      Priority: 1
    },
    {
      Currency: 'CAD',
      Balance: 1000,
      Priority: 2
    },
    {
      Currency: 'EUR',
      Balance: 1000,
      Priority: 3
    },
    {
      Currency: 'GBP',
      Balance: 1000,
      Priority: 4
    },
    {
      Currency: 'ILS',
      Balance: 1000,
      Priority: 5
    },
    {
      Currency: 'JPY',
      Balance: 1000,
      Priority: 6
    },
    {
      Currency: 'USD',
      Balance: 1000,
      Priority: 7
    }]
  };

  const routerStub = {
    navigateByUrl: jasmine.createSpy('navigateByUrl').and.returnValue(true)
  };

  const accountServiceStub = {
    getAccountTransactions: jasmine.createSpy('getAccountTransactions').and.returnValue(Observable.of(mockAccountTransactions)),
    getGraphTransactions: jasmine.createSpy('getGraphTransactions').and.returnValue(Observable.of(mockAccountTransactions)),
    getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),
    getAccountConfig: jasmine.createSpy('getAccountConfig').and.returnValue(mockAccountConfig),
    setAccountData: jasmine.createSpy('setAccountData'),
    getDashboardAccountsData: jasmine.createSpy('getDashboardAccountsData').and.returnValue(null),
    getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockAccountBalanceDetails)),
    getGraphTransactionsForIS: Observable.of(mockRewardsTransactions),
    hasTransactionsAndDetailsForIS: jasmine.createSpy('hasTransactionsAndDetailsForIS').and.returnValue(false),
    getGraphTransactionsForFca: Observable.of(mockFcaTransactions),
    getSettlementDetails: jasmine.createSpy('getSettlementDetails').and.returnValue(Observable.of(mockSettlementDetails)),
    setSettlementData: jasmine.createSpy('setSettlementData'),
    setTransactionsForCASA: jasmine.createSpy('setTransactionsForCASA'),
    getTransactionsForCASA: jasmine.createSpy('getTransactionsForCASA').and.returnValue([]),
    getPockets : jasmine.createSpy('getPockets').and.returnValue(Observable.of(mockPockets))
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PocketDetailComponent, SkeletonLoaderPipe],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: AccountService, useValue: accountServiceStub },
        { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }) } },
        { provide: Router, useValue: routerStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    fixture = TestBed.createComponent(PocketDetailComponent);
    component = fixture.componentInstance;
    component.pocketCurrency = 'USD';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate if account type is not TC', () => {
    component.onAccountChange(mockAccountData);
    expect(routerStub.navigateByUrl).toHaveBeenCalled();
  });

  it('should get dashboard accounts', () => {
    component.getAccountData();
    expect(accountServiceStub.getDashboardAccounts).toHaveBeenCalled();
    accountServiceStub.getDashboardAccounts().subscribe();
  });

});
