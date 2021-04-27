import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { assertModuleFactoryCaching } from './../../test-util';
import { AccountDetailComponent } from './account-detail.component';
import { AccountCardComponent } from './../account-card/account-card.component';
import { AccountTransactionsComponent } from './../account-transactions/account-transactions.component';
import {
      IDashboardAccounts, IDashboardAccount, IClientDetails, IAccountBalanceDetail, IClientAccountDetail, ISettlementDetail,
      ITransactionDetail, IApiResponse, ITransactionMetaData, IAccountInfo, INoticePayload, IProductDetails, IViewNoticeDetails
} from '../../core/services/models';
import { IAccountConfig } from './../dashboard.model';
import { AccountService } from '../account.service';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { PreFillService } from '../../core/services/preFill.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import { GaTrackingService } from './../../core/services/ga.service';
import { UpliftDormancyComponent } from './../uplift-dormancy/uplift-dormancy.component';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Constants } from './../../core/utils/constants';
import { AccountBalanceDetailComponent } from './../account-balance-detail/account-balance-detail.component';

import { AlertActionType } from '../../shared/enums';
import { accountData } from '../../core/data/skeleton-data';
import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';
import { environment } from '../../../environments/environment.qa';

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
      InterestRate: 0,
      MaintainOptions: {
            PlaceNotice: 'PlaceNotice',
            DeleteNotice: 'DeleteNotice'
      }
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
}, {
      AccountName: 'Inv CA2',
      Balance: 0,
      AvailableBalance: 0,
      AccountNumber: 1009017640,
      AccountType: 'TC',
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

const mockAccountTransactions: ITransactionDetail[] = [{
      Currency: 'USD',
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
},
{
      Currency: 'EUR',
      TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
      Description: 'PAYMENT - THANK YOU',
      Amount: 28000,
      Debit: false,
      Account: '377093000052084',
      PostedDate: '2017-09-23 02:00:00 AM',
      CategoryId: 0,
      ChildTransactions: [],
      OriginalCategoryId: 0,
      RunningBalance: 2000
}];

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

const mockHomeLoanAccount: IDashboardAccount = {
      AccountName: 'EARLSMERE',
      Balance: 0.0,
      AvailableBalance: 0.0,
      AccountNumber: 8966219016001,
      AccountType: 'HL',
      AccountIcon: '',
      NewAccount: true,
      LastUpdate: '2018-06-26 07:05:20 AM',
      InstitutionName: 'Nedbank (South Africa)',
      Currency: '&#x52;',
      SiteId: '16390',
      ItemAccountId: '6',
      InterestRate: 0.0,
      IsShow: false,
      IsProfileAccount: true,
      ProductType: ' ',
      Pockets: []
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
      RewardsProgram: 'GB',
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

const mockSuccessMetadata = {
      resultData: [
            {
                  resultDetail: [
                        {
                              operationReference: 'Settlement Quote',
                              result: 'R00',
                              status: 'SUCCESS',
                              reason: ''
                        }
                  ]
            }
      ]
};

const mockSettlementSuccessResponse: IApiResponse = {
      data: mockSettlementDetails,
      metadata: mockSuccessMetadata
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

const mockCasaTransactions: ITransactionDetail[] = [{
      Account: '1944122702',
      Amount: 60,
      CategoryId: 0,
      Currency: null,
      ChildTransactions: [],
      Debit: true,
      Description: 'iMali - 11 Dec',
      OriginalCategoryId: null,
      PostedDate: '2017-12-11 12:00:00 AM',
      RunningBalance: 2631865.14,
      StatementDate: '2017-11-16T00:00:00',
      StatementLineNumber: 18,
      StatementNumber: 694,
      TransactionId: null
}, {
      Account: '1944122702',
      Amount: 60,
      CategoryId: 0,
      Currency: null,
      ChildTransactions: [],
      Debit: true,
      Description: 'iMali - 11 Dec',
      OriginalCategoryId: null,
      PostedDate: '2017-12-11 12:00:00 AM',
      RunningBalance: 2631865.14,
      StatementDate: '2017-11-16T00:00:00',
      StatementLineNumber: 18,
      StatementNumber: 23,
      TransactionId: null
}, {
      Account: '1944122702',
      Amount: 60,
      CategoryId: 0,
      Currency: null,
      ChildTransactions: [],
      Debit: true,
      Description: 'iMali - 11 Dec',
      OriginalCategoryId: null,
      PostedDate: '2017-12-11 12:00:00 AM',
      RunningBalance: 2631865.14,
      StatementDate: '2017-11-16T00:00:00',
      StatementLineNumber: 18,
      StatementNumber: 18,
      TransactionId: null
}, {
      Account: '1944122702',
      Amount: 60,
      CategoryId: 0,
      Currency: null,
      ChildTransactions: [],
      Debit: true,
      Description: 'iMali - 11 Dec',
      OriginalCategoryId: null,
      PostedDate: '2017-12-11 12:00:00 AM',
      RunningBalance: 2631865.14,
      StatementDate: '2017-11-16T00:00:00',
      StatementLineNumber: 18,
      StatementNumber: 11,
      TransactionId: null
}];
const mockCasaTransactionsStatementNumberOne: ITransactionDetail[] = [{
      Account: '1944122702',
      Amount: 60,
      CategoryId: 0,
      Currency: null,
      ChildTransactions: [],
      Debit: true,
      Description: 'iMali - 11 Dec',
      OriginalCategoryId: null,
      PostedDate: '2017-12-11 12:00:00 AM',
      RunningBalance: 2631865.14,
      StatementDate: '2017-11-16T00:00:00',
      StatementLineNumber: 18,
      StatementNumber: 4,
      TransactionId: null
}, {
      Account: '1944122702',
      Amount: 60,
      CategoryId: 0,
      Currency: null,
      ChildTransactions: [],
      Debit: true,
      Description: 'iMali - 11 Dec',
      OriginalCategoryId: null,
      PostedDate: '2017-12-11 12:00:00 AM',
      RunningBalance: 2631865.14,
      StatementDate: '2017-11-16T00:00:00',
      StatementLineNumber: 18,
      StatementNumber: 1,
      TransactionId: null
}];
const mockTransactionsMetadata: ITransactionMetaData = {
      'resultData': [
            {
                  'resultDetail': [
                        {
                              'operationReference': 'Transaction history',
                              'result': 'R10',
                              'status': '',
                              'reason': 'Failure'
                        }
                  ]
            }
      ]
};

const mockBalanceDetailHL: IAccountBalanceDetail = {
      accountName: 'BOND A/C',
      accountNumber: '8605376000101',
      accountType: 'HL',
      currency: '&#x52;',
      outstandingBalance: 1.17,
      nextInstallmentAmount: 3519.45,
      amountInArrears: -181726.91,
      nextPaymentDue: 3519.45,
      nextPaymentDate: '2018-05-01T05:30:00+05:30',
      interestRate: 8.25,
      loanAmount: 405000,
      email: 'test@gmail.com',
      paymentTerm: '240',
      termRemaining: '64 months',
      balanceNotPaidOut: 10000,
      registeredAmount: 405000,
      accruedInterest: 0,
      isSingleBond: true,
      PropertyAddress: '6, WABOOM, 40672, Sandton',
      nameAndSurname: 'Mr Brian Bernard Sheinuk',
      contactNumber: '+27991365718'
};
const mockBalanceDetails: IProductDetails = {
      investmentDetailsList: [{
            investmentProductType: 'DS',
            investmentProductName: 'INV'
      }]
};

const mockBalanceDetailInvestment: IApiResponse = {
      data: mockBalanceDetails
};

const mockStatementPreferenceSuccessResponse: IApiResponse = {
      data: {
            itemAccountId: '1',
            accountNumber: '1001037693',
            frequency: 'MONTHLY',
            deliveryMode: 'EMAIL',
            paymentMethod: 'DEBO',
            email: ['GUNJAL138@GMAIL.COM', 'TEST@GAS.COM'],
            postalAddress: {
                  addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
                  city: 'JOHANNESBURG',
                  postalCd: '2191'
            }
      },
      metadata: {
            resultData: [{
                  resultDetail: [{
                        operationReference: 'Transaction',
                        result: 'R0V1',
                        status: 'PENDING',
                        reason: 'pending'
                  }]
            }]
      }
};

const mockStatementPreferenceResponse: IApiResponse = {
      data: {},
      metadata: {
            resultData: [{
                  transactionID: '64523',
                  resultDetail: [{
                        operationReference: 'Transaction',
                        result: 'R0V1',
                        status: 'PENDING',
                        reason: 'pending'
                  }]
            }]
      }
};

const mockMFCLoanAccount: IDashboardAccount = {
      AccountName: 'MFC-SL',
      Balance: 123112.23,
      AvailableBalance: 0,
      AccountNumber: 5009017640,
      AccountType: 'IS',
      AccountIcon: 'glyphicon-account_loan',
      NewAccount: true,
      LastUpdate: '2017-08-18 10:51:01 AM',
      InstitutionName: 'Nedbank (South Africa)',
      Currency: '&#x52;',
      SiteId: '16390',
      ItemAccountId: '6',
      InterestRate: 0
};

const mockAccountInfo: IAccountInfo = {
      AccountNumber: '12786-9987',
      AvailableBalance: 345678,
      AccountType: 'DS',
};

const mockNoticeData: INoticePayload = {
      requestId: '123',
      notices: [{
            investmentNumber: '123456-5678',
            noticeDate: '2018-08-03',
            noticeAmount: 500,
            capitalDisposalAccount:
                  {
                        accountNumber: 123456789,
                        accountType: 'DS'
                  }
      }],
};

const mockHomeLoanBalances: IAccountBalanceDetail = {
      accountHolderName: 'MEV. G S MULDER',
      accountName: 'VERBAND',
      accountNumber: '8025808100101',
      accountType: 'HL',
      currency: '&#x52;',
      outstandingBalance: 65579.6,
      nextInstallmentAmount: 1723.62,
      interestRate: 9.25,
      loanAmount: 855799.95,
      paymentTerm: '197 months',
      termRemaining: '43 months',
      balanceNotPaidOut: 0.0,
      registeredAmount: 910000.0,
      accruedInterest: 99.72,
      isShowSettlement: false,
      isShowSettlementAmount: false,
      isSingleBond: false,
      isJointBond: false,
      loanDescription: 'HOEWE 88 PROTEARIF         KRUGERSDORP LAND./HOEW.',
      isShowHLSettlement: true,
      PropertyAddress: '0, HAYES, 30420, ',
      contactNumber: '27990491507',
      email: 'THEROSEBOX@MWEB.CO.ZA',
      nameAndSurname: 'Mnr Joachim Jacobus Mulder'
};
const mockHomeLoanStatusDetails: IApiResponse = {
      data: {
            isManageLoanEnabled: true,
            isJointBondEnabled: true,
            isCancelLoanEnabled: true,
            isNinetyDaysNoticeEnabled: true,
            isHomeLoanPaidUp: true
      },
      metadata: {
            resultData: [
                  {
                        resultDetail: [
                              {
                                    operationReference: 'LoanProductsManagement',
                                    result: 'R00',
                                    status: 'SUCCESS',
                                    reason: ''
                              }
                        ]
                  }
            ]
      }
};

const mockInvalidHomeLoanStatusDetails: IApiResponse = {
      data: {},
      metadata: {
            resultData: [
                  {
                        resultDetail: [
                              {
                                    operationReference: 'LoanProductsManagement',
                                    result: 'R02',
                                    status: 'FAILURE',
                                    reason: ''
                              }
                        ]
                  }
            ]
      }
};

const mockPockets = [
      {
            currency: {
                  currency: 'USD',
                  amount: 1000
            },
            priority: 2
      },
      {
            currency: {
                  currency: 'EUR',
                  amount: 2000
            },
            priority: 1
      }
];

const systemErrorServiceStub = {
      closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

const testComponent = class { };
const routerTestingParam = [
      { path: 'dashboard/account/scheduled/:id', component: testComponent },
      { path: 'dashboard/account/statement-preferences/:id', component: testComponent }
];
const mockBalanceDetailError = Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
});
const bsModalServiceStub = {
      show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
            return {
                  content: {
                        getApproveItStatus: Observable.of(true),
                        resendApproveDetails: Observable.of(true),
                        getOTPStatus: Observable.of(true),
                        otpIsValid: Observable.of(true),
                        updateSuccess: Observable.of(true),
                        processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
                        processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
                        processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
                  }
            };
      }),
      onShow: jasmine.createSpy('onShow'),
      onShown: jasmine.createSpy('onShown'),
      onHide: jasmine.createSpy('onHide'),
      onHidden: {
            asObservable: jasmine.createSpy('onHidden asObservable').and.callFake(function () {
                  return Observable.of(true);
            })
      },
};

const gaTrackingServiceStub = {
      sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const mockDashboardAccountData = [{
      ContainerName: 'ContainerName',
      Accounts: [{
            AccountName: 'AccountName',
            Balance: 1000,
            AvailableBalance: 1000,
            AccountNumber: 1234,
            AccountType: 'TC',
            AccountIcon: 'AccountIcon',
            NewAccount: true,
            LastUpdate: 'LastUpdate',
            InstitutionName: 'InstitutionName',
            Currency: 'USD',
            SiteId: 'SiteId',
            ItemAccountId: 'ItemAccountId',
            InterestRate: 10,
            AccountStatusCode: 'AccountStatusCode',
            IsShow: true,
            RewardsProgram: 'RewardsProgram',
            isEditInProcess: true,
            IsProfileAccount: true,
            ProductType: 'ProductType',
            settlementAmt: 100,
            MaintainOptions: {
                  PlaceNotice: 'PlaceNotice',
                  DeleteNotice: 'DeleteNotice'
            }
      }],
      ContainerIcon: 'ContainerIcon',
      Assets: 4
}];

const mockNotice: IViewNoticeDetails[] = [{
   noticeID: 'NOW123456',
   noticeDate: '2018-08-03',
   noticeAmount: 500,
   capitalDisposalAccount:
   {
     accountNumber: 123456789,
     accountType: 'DS'
   }
 }];

describe('AccountDetailComponent', () => {
      let component: AccountDetailComponent;
      let fixture: ComponentFixture<AccountDetailComponent>;
      let router: Router;
      let service: AccountService;
      let modalService: BsModalService;

      const accountServiceStub = {
            getAccountTransactions: jasmine.createSpy('getAccountTransactions').and.returnValue(Observable.of(mockAccountTransactions)),
            getGraphTransactions: jasmine.createSpy('getGraphTransactions').and.returnValue(Observable.of(mockAccountTransactions)),
            getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),
            getAccountConfig: jasmine.createSpy('getAccountConfig').and.returnValue(mockAccountConfig),
            setAccountData: jasmine.createSpy('setAccountData'),
            getDashboardAccountsData: jasmine.createSpy('getDashboardAccountsData'),
            getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockAccountBalanceDetails)),
            getGraphTransactionsForIS: Observable.of(mockRewardsTransactions),
            hasTransactionsAndDetailsForIS: jasmine.createSpy('hasTransactionsAndDetailsForIS').and.returnValue(false),
            getGraphTransactionsForFca: Observable.of(mockFcaTransactions),
            getSettlementDetails: jasmine.createSpy('getSettlementDetails').and.returnValue(Observable.of(mockSettlementSuccessResponse)),
            setSettlementData: jasmine.createSpy('setSettlementData'),
            setTransactionsForCASA: jasmine.createSpy('setTransactionsForCASA'),
            getTransactionsForCASA: jasmine.createSpy('getTransactionsForCASA').and.returnValue([]),
            getBalanceDetails: jasmine.createSpy('getBalanceDetails').and.returnValue(Observable.of(mockBalanceDetailHL)),
            getAccountStatementPreferences: jasmine.createSpy('getAccountStatementPreferences')
                  .and.returnValue(Observable.of(mockStatementPreferenceResponse)),
            statusStatementPreferences: jasmine.createSpy('statusStatementPreferences')
                  .and.returnValue(Observable.of(mockStatementPreferenceSuccessResponse)),
            getApproveItOtpStatus: jasmine.createSpy('getApproveItOtpStatus').and.returnValue(
                  Observable.of(mockStatementPreferenceResponse)),
            getNotice: jasmine.createSpy('getNotice').and.returnValue(Observable.of(mockBalanceDetailHL)),
            getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockHomeLoanAccount),
            transactionSearchModeEmitter: new EventEmitter<boolean>(),
            getHomeLoanStatus: jasmine.createSpy('getHomeLoanStatus').and.returnValue(Observable.of(mockHomeLoanStatusDetails)),
            getPockets: jasmine.createSpy('getPockets').and.returnValue(Observable.of(mockPockets))
      };

      assertModuleFactoryCaching();
      beforeEach(async(() => {
            TestBed.configureTestingModule({
                  imports: [RouterTestingModule.withRoutes(routerTestingParam)],
                  declarations: [AccountDetailComponent, SkeletonLoaderPipe, AmountTransformPipe],
                  schemas: [CUSTOM_ELEMENTS_SCHEMA],
                  providers: [
                        { provide: TermsService, userValue: {} },
                        { provide: AccountService, useValue: accountServiceStub },
                        { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }) } },
                        PreFillService,
                        { provide: SystemErrorService, useValue: systemErrorServiceStub },
                        { provide: ClientProfileDetailsService, useValue: clientPreferencesStub },
                        { provide: BsModalService, useValue: bsModalServiceStub },
                        { provide: GaTrackingService, useValue: gaTrackingServiceStub }
                  ]
            })
                  .compileComponents();
      }));

      beforeEach(() => {
            fixture = TestBed.createComponent(AccountDetailComponent);
            component = fixture.componentInstance;
            component.lastAmountDeducted = 0;
            component.lastBalance = 0;
            component.skeletonMode = true;
            router = TestBed.get(Router);
            modalService = TestBed.get(BsModalService);
            service = fixture.debugElement.injector.get(AccountService);
            component.isNoticeFlag = true;
            fixture.detectChanges();
      });

      it('should be created', () => {
            expect(component).toBeTruthy();
      });

      it('should refresh data on account change', () => {
            component.onAccountChange(mockAccounts[1]);
            expect(component.accountId).toBe(2);
            expect(accountServiceStub.getAccountTransactions).toHaveBeenCalled();
            // component.onAccountChange(mockAccounts[1]);
            component.onAccountChange(mockAccounts[4]);
            expect(component.pockets[0].currency.currency).toEqual(mockPockets[0].currency.currency);
      });
      it('should refresh data on account change for HL account', () => {
            spyOn(component, 'getHomeLoanBalanceDetails');
            component.onAccountChange(mockHomeLoanAccount);
            expect(component.getHomeLoanBalanceDetails).toHaveBeenCalled();
      });
      it('should request for balance details for HL account', () => {
            component.getHomeLoanBalanceDetails();
            expect(component.homeLoanSkeletonMode).toBe(false);
      });
      it('should call getFilteredTypeAccounts', () => {
            component.getFilteredTypeAccounts(mockAccounts[2].AccountType, '33');
            expect(component.featureVisible).toBe(false);
      });
      it('should update the current account type', () => {
            component.accountId = 1;
            component.updateAccountType(mockDashboardAccounts);

            expect(component.accountType).toBe('CA');
      });

      it('shouldnt try updating balance when transactions are not available', () => {
            component.balance = 1000;
            component.availableBalance = 1000;
            expect(component.updateRunningBalance([])).toEqual([]);
      });

      it('should handle starting balance for default account type', () => {
            component.accountType = 'abc';
            component.balance = 0;
            expect(component.getStartingBalance()).toEqual(0);
      });

      it('should set account container data', () => {
            service.getDashboardAccountsData = jasmine.createSpy('getDashboardAccountsData').and
                  .returnValue(mockDashboardAccounts);
            fixture.detectChanges();
            component.getAccountData();
            expect(component.accountContainers).toBe(mockDashboardAccounts);
      });

      it('should show success of error message', () => {
            const $event = {
                  message: '',
                  showMessage: true,
                  isSuccess: true
            };
            component.notifications($event);
            expect(component.isSuccess).toBeTruthy();
            expect(component.isDormantAccount).toBeFalsy();
      });

      it('should close notification message', () => {
            component.onAlertLinkSelected(AlertActionType.Close);
            expect(component.isErrorShown).toBeFalsy();
      });
      it('should refresh data on rewards account change', () => {
            component.accountType = Constants.VariableValues.accountTypes.rewardsAccountType.code;
            accountServiceStub.getGraphTransactions.and.returnValue(accountServiceStub.getGraphTransactionsForIS);
            component.onAccountChange(mockRewardsAccounts[0]);
            expect(component.accountId).toBe(1);
            expect(component.transactionHistoryFailed).toBe(false);
            expect(component.noMoreTransactions).toBe(false);
            expect(component.showLoader).toBe(false);
            expect(accountServiceStub.getTransactionsForCASA()).toEqual([]);
            expect(component.isGreenbacksAccount).toBeTruthy();
      });

      it('should set investment to true if accounts has investement account', () => {
            expect(component.hasUnitTrustsInvAccount).toBeTruthy();
      });

      it('should set the startingBalance for TD accounts', () => {
            component.accountType = Constants.VariableValues.accountTypes.treasuryInvestmentAccountType.code;
            component.getStartingBalance();
            expect(component.balance).toBe(0);
      });

      it('should set the convert currency for FCA accounts to be provided to graph', () => {
            component.accountType = Constants.VariableValues.accountTypes.foreignCurrencyAccountType.code;
            accountServiceStub.getAccountTransactions.and.returnValue(accountServiceStub.getGraphTransactionsForFca);
            accountServiceStub.getGraphTransactions.and.returnValue(accountServiceStub.getGraphTransactionsForFca);
            component.onAccountChange(mockAccounts[3]);
            expect(component.currency).toBe('$');
      });

      it('should navigate on settlement request quote click', () => {
            component.accountType = 'PL';
            component.accountId = 10;
            const spy = spyOn(router, 'navigateByUrl');
            component.onSettlementQuoteClick();
            const url = spy.calls.first().args[0];
            expect(url).toBe('/dashboard/account/settlement/request-quote/10');
      });

      it('should select personal loan and get settlement details', () => {
            component.onAccountChange(mockPersonalLoanAccount);
            expect(component.accountType).toBe('PL');
            expect(accountServiceStub.getSettlementDetails).toHaveBeenCalled();
            expect(component.settlementDetails).toBe(mockSettlementDetails);
            expect(component.settlementFeatureProps.showSettleLoanBtn).toBe(true);
            expect(component.settlementFeatureProps.showAmount).toBe(true);
      });

      it('should return settlement error property as an error', () => {
            accountServiceStub.getSettlementDetails.and.returnValue(mockAccountServiceError);
            component.getSettlemetDetails(mockPersonalLoanAccount);
            expect(systemErrorServiceStub.closeError).toHaveBeenCalled();
            expect(component.settlementFeatureProps.showError).toBe(true);
      });

      it('should call API for transactions lazy loading in case of CASA accounts', () => {
            const mockResponse: ITransactionDetail[] = [{
                  TransactionId: null,
                  Description: 'FCA account',
                  Amount: 2764.0,
                  Debit: false,
                  Account: '601710000014',
                  PostedDate: '2017-10-27 12:00:00 AM',
                  CategoryId: 0,
                  ChildTransactions: [],
                  OriginalCategoryId: 0,
                  RunningBalance: 9000,
                  Currency: '&#x24;',
                  ShortDescription: null
            }];
            component.transactions = mockCasaTransactions;
            component.lastBalance = 10000;
            component.lastAmountDeducted = 1000;
            component.viewMoreTransactions();
            expect(service.getAccountTransactions).toHaveBeenCalledWith(1, false, 11);
            expect(component.noMoreTransactions).toBe(false);
            expect(component.transactions).toEqual(mockResponse);
      });

      it('should not call API for transactions lazy loading in case of CASA accounts', () => {
            component.transactions = mockCasaTransactions.concat(mockCasaTransactionsStatementNumberOne);
            component.viewMoreTransactions();
            expect(component.message).toBe('No more transactions found');
            expect(component.noMoreTransactions).toBe(true);
      });

      it('should API return R10 as statuscode for casa transactions lazy loading, stop lazy loading', () => {
            service.getAccountTransactions = jasmine.createSpy('getAccountTransactions').and.returnValue(
                  Observable.of(mockTransactionsMetadata));
            component.viewMoreTransactions();
            expect(component.message).toBe('No more transactions found');
            expect(component.noMoreTransactions).toBe(true);
      });

      it('should API return R11 as statuscode for casa transactions lazy loading, stop lazy loading', () => {
            mockTransactionsMetadata.resultData[0].resultDetail[0].result = 'R11';
            service.getAccountTransactions = jasmine.createSpy('getAccountTransactions').and.returnValue(
                  Observable.of(mockTransactionsMetadata));
            component.viewMoreTransactions();
            expect(component.message).toBe('No more transactions found');
            expect(component.noMoreTransactions).toBe(true);
      });
      it('should API return R01 as statuscode for casa transactions lazy loading, show error message', () => {
            mockTransactionsMetadata.resultData[0].resultDetail[0].result = 'R01';
            service.getAccountTransactions = jasmine.createSpy('getAccountTransactions').and.returnValue(
                  Observable.of(mockTransactionsMetadata));
            component.viewMoreTransactions();
            expect(component.message).toBe('Something is wrong');
            expect(component.transactionHistoryFailed).toBe(true);
      });
      it('should API return metadata as statuscode for transactions of any account type for first call, should set data to be empty',
            () => {
                  mockTransactionsMetadata.resultData[0].resultDetail[0].result = 'R01';
                  service.getAccountTransactions = jasmine.createSpy('getAccountTransactions').and.returnValue(
                        Observable.of(mockTransactionsMetadata));
                  component.onAccountChange(mockAccounts[1]);
                  expect(component.transactions).toEqual([]);
                  expect(component.showMoreTransactionsButton).toBe(false);
            });
      it('should get transaction listing lazy loading error', () => {
            const errorText = 'Something is wrong';
            service.getAccountTransactions = jasmine.createSpy('getAccountTransactions')
                  .and.returnValue(Observable.create(observer => {
                        observer.error(new Error('error'));
                        observer.complete();
                  }));
            fixture.detectChanges();
            component.viewMoreTransactions();
            expect(component.transactionHistoryFailed).toEqual(true);
            expect(component.message).toEqual(errorText);
      });
      it(`should not call API for transactions lazy loading in case of CASA
   accounts with empty transactions and R00 by hiding view more transaction button`, () => {
                  component.transactions = mockCasaTransactions;
                  accountServiceStub.getAccountTransactions.and.returnValue(Observable.of([]));
                  component.viewMoreTransactions();
                  expect(service.getAccountTransactions).toHaveBeenCalledWith(1, false, 11);
                  expect(component.noMoreTransactions).toBe(true);
            });

      it('should call onStatementPreferencesClick for the approve it popup', () => {
            component.statementPreferencesClicked = true;
            component.accountId = 1;
            component.onStatementPreferencesClick();
            expect(component.statementPreferencesClicked).toBe(false);
      });

      it('should show the statement preferences details once approve it is already done', () => {
            accountServiceStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockStatementPreferenceSuccessResponse));
            component.statementPreferencesClicked = true;
            component.accountId = 1;
            component.onStatementPreferencesClick();
            expect(component.statementPreferencesClicked).toBe(true);
            expect(router.navigateByUrl(encodeURI('/dashboard/account/statement-preferences/' + component.accountId))).toBeTruthy();

      });

      it('should go for error part if anything went wrong on API', () => {
            accountServiceStub.getAccountStatementPreferences.and.returnValue(Observable.create(observer => {
                  observer.error(new Error('error'));
                  observer.complete();
            }));
            component.statementPreferencesClicked = true;
            component.accountId = 1;
            component.onStatementPreferencesClick();
            expect(component.statementPreferencesClicked).toBe(true);
      });

      it('should call resend approve details', () => {
            accountServiceStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockStatementPreferenceResponse));
            component.bsModalRef = modalService.show(
                  OutofbandVerificationComponent,
                  Object.assign(
                        {},
                        {
                              animated: true,
                              keyboard: false,
                              backdrop: true,
                              ignoreBackdropClick: true
                        },
                        { class: '' }
                  )
            );
            component.statementPreferencesClicked = true;
            component.accountId = 1;
            component.resendApproveDetails();
            expect(component.transactionID).toEqual(mockStatementPreferenceResponse.metadata.resultData[0].transactionID);
      });
      it('should call resend approve details for false case', () => {
            accountServiceStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockStatementPreferenceSuccessResponse));
            component.statementPreferencesClicked = true;
            component.accountId = 1;
            component.resendApproveDetails();
            expect(component.statementPreferencesClicked).toBe(true);
      });
      it('should call resend approve details for error case', () => {
            accountServiceStub.getAccountStatementPreferences.and.returnValue(Observable.create(observer => {
                  observer.error(new Error('error'));
                  observer.complete();
            }));
            component.statementPreferencesClicked = true;
            component.accountId = 1;
            component.resendApproveDetails();
            expect(component.statementPreferencesClicked).toBe(true);
      });
      it('should return false from approve it update success', () => {
            service.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
                  .and.returnValue(Observable.of(mockStatementPreferenceResponse));
            modalService.show = jasmine.createSpy('getApproveItStatus').and.callFake(function () {
                  return {
                        content: {
                              getApproveItStatus: Observable.of(true),
                              resendApproveDetails: Observable.of(true),
                              getOTPStatus: Observable.of(true),
                              otpIsValid: Observable.of(true),
                              updateSuccess: Observable.of(false),
                              processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
                              processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
                              processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
                        }
                  };
            });
            fixture.detectChanges();
            component.statementPreferencesClicked = true;
            component.accountId = 1;
            component.onStatementPreferencesClick();
            expect(component.statementPreferencesClicked).toEqual(true);
      });
      it('Should correctly update running balance when more transactions are loaded in case of non  travel account', () => {
            component.lastBalance = 10000;
            component.lastAmountDeducted = 1000;
            let expectedBalance = 0;
            const updatedTransactions = component.updateRunningBalance(mockCasaTransactions, true);
            expectedBalance = component.lastBalance - component.lastAmountDeducted;
            expect(updatedTransactions[0].RunningBalance).toEqual(expectedBalance);
      });
      it('should validate and show request building loan', () => {
            component.buildingLoanBalance = mockBalanceDetailHL;
            component.requestPayOutToggle = true;
            component.isBuildingLoanFeature();
            expect(component.showRequestBuildingLoan).toBe(true);
      });

      it('should settlement quote to be true', () => {
            component.onAccountChange(mockMFCLoanAccount);
            expect(component.accountType).toBe('IS');
            expect(component.settlementFeatureProps.showSettlementQuoteBtn).toBe(true);
            expect(component.showSettlementQuote()).toBe(true);
      });

      it('should settlement quote to be false', () => {
            mockMFCLoanAccount.Balance = -100.00;
            component.onAccountChange(mockMFCLoanAccount);
            expect(component.accountType).toBe('IS');
            expect(component.settlementFeatureProps).toBe(undefined);
            expect(component.showSettlementQuote()).toBe(undefined);
      });

      it('should navigate on settlement request quote click for MFC', () => {
            component.onAccountChange(mockMFCLoanAccount);
            const spy = spyOn(router, 'navigateByUrl');
            component.onSettlementQuoteClick();
            const url = spy.calls.first().args[0];
            expect(url).toBe('/dashboard/account/settlement/request-quote/6');
      });

      it('should call handleTransactionsError function', () => {
            component.handleTransactionsError();
            expect(component.transactionHistoryFailed).toBe(true);
            expect(component.showLoader).toBe(false);
            expect(component.noMoreTransactions).toBe(true);
      });
      it('should call accountInfo function', () => {
            component.accountInfo(mockAccountInfo);
            expect(component.isViewSubmittedNotice).toBe(true);
      });
      it('should call viewNotices function', () => {
            component.accountId = 2;
            component.viewNotices();
            expect(component.isViewNotices).toBe(true);
      });
      it('should call isNotices function', () => {
            component.isOpenNewAccount = true;
            component.isNotices(false);
            expect(component.isViewNotices).toBe(false);
      });
      it('should call showNotice function', () => {
            component.showNotice(mockNoticeData);
            expect(component.isViewNotices).toBe(false);
            expect(component.showNoticeFlow).toBe(true);
      });

      it('should call getInvestmentType function', () => {
            accountServiceStub.getBalanceDetails.and.returnValue(Observable.of(mockBalanceDetailInvestment));
            component.getInvestmentType();
            expect(component.showRequestBuildingLoan).toBe(false);
      });

      it('should navigate to account view more details', () => {
            const spy = spyOn(router, 'navigateByUrl');
            component.onAccountDetailsClick();
            const url = spy.calls.first().args[0];
            expect(url).toBe('/dashboard/account/detail/1/view-more');
      });

      it('should check to show view payment option for loans', () => {
            const loanFeature = environment.features.loanPaymentDetails;
            component.showLoanDebitOrder = true;
            expect(component.checkLoanPaymentOption()).toBe(true);
      });

      it('should check to show manage payment option for loans', () => {
            const mfcFeature = environment.features.mfcPaymentDetails;
            component.showMFCDebitOrder = true;
            expect(component.checkLoanPaymentOption()).toBe(true);
      });

      it('should call get home loan balance details If account type is Home Loan and toggel is ON', () => {
            component.settlementHlToggle = true;
            spyOn(component, 'getHomeLoanBalanceDetails');
            component.onAccountChange(mockHomeLoanAccount);
            expect(component.getHomeLoanBalanceDetails).toHaveBeenCalled();
      });

      it('should show home loan settlement quote feature', () => {
            accountServiceStub.getAccountBalanceDetail.and.returnValue(Observable.of(mockHomeLoanBalances));
            component.requestPayOutToggle = false;
            component.settlementHlToggle = true;
            component.onAccountChange(mockHomeLoanAccount);
            expect(component.settlementFeatureProps.showSettlementQuoteBtn).toBe(true);
      });

      it('should not show home loan settlement quote feature', () => {
            mockHomeLoanBalances.isShowHLSettlement = false;
            accountServiceStub.getAccountBalanceDetail.and.returnValue(Observable.of(mockHomeLoanBalances));
            component.onAccountChange(mockHomeLoanAccount);
            expect(component.settlementFeatureProps).toBe(undefined);
      });

      it('should navigate on settlement request quote click for HL account', () => {
            component.accountType = 'HL';
            component.accountId = 11;
            const spy = spyOn(router, 'navigateByUrl');
            component.onSettlementQuoteClick();
            const url = spy.calls.first().args[0];
            expect(url).toBe('/dashboard/account/settlement/request-quote/11');
      });

      it('should be show submit notice button', () => {
            component.labels.placeNotice = 'Y';
            component.submitNotice('Y', 'Y');
            expect(component.deleteNotice).toBe(true);
            expect(component.isNow).toBe(true);
      });

      it('should be hide submit notice button', () => {
            component.labels.placeNotice = 'Y';
            component.submitNotice('N', 'N');
            expect(component.deleteNotice).toBe(false);
            expect(component.isNow).toBe(false);
      });

      it('should send event for the creditCardAccountType', () => {
            component.accountType = 'CC';
            component.cardsTabAccessedProdTypeGAEvent.value = Constants.accountTypesForEvents.creditCard;
            component.sendEventAccountType();
            expect(component.cardsTabAccessedProdTypeGAEvent.value).toEqual(Constants.accountTypesForEvents.creditCard);
      });

      it('should send event for the savingAccountType', () => {
            component.accountType = 'SA';
            component.cardsTabAccessedProdTypeGAEvent.value = Constants.accountTypesForEvents.savings;
            component.sendEventAccountType();
            expect(component.cardsTabAccessedProdTypeGAEvent.value).toEqual(Constants.accountTypesForEvents.savings);
      });

      it('should send event for the currentAccountType', () => {
            component.accountType = 'CA';
            component.cardsTabAccessedProdTypeGAEvent.value = Constants.accountTypesForEvents.current;
            component.sendEventAccountType();
            expect(component.cardsTabAccessedProdTypeGAEvent.value).toEqual(Constants.accountTypesForEvents.current);
      });

      it('should set event value empty for invalid account type', () => {
            component.accountType = 'invalid';
            component.sendEventAccountType();
            expect(component.cardsTabAccessedProdTypeGAEvent.value).toEqual('');
      });

      it('should set search mode', () => {
            const value = true;
            component.setSearchMode(value);
            expect(component.searchMode).toBe(value);
      });
      it('transaction Search mode emitter', () => {
            const value = true;
            accountServiceStub.transactionSearchModeEmitter.subscribe(data => {
                  component.setSearchMode(value);
                  expect(component.searchMode).toBe(value);
            });
      });
      it('transaction Search mode emitter from ngOninit', () => {
            accountServiceStub.transactionSearchModeEmitter.emit(true);
            component.ngOnInit();
            expect(component.showRequestBuildingLoan).toBe(false);
      });
      it('on click of mfc payment', () => {
            spyOn(component, 'sendEvent');
            component.setMFCDetails();
            expect(component.sendEvent).toHaveBeenCalled();
      });
      it('on click of home loan account', () => {
            spyOn(component, 'sendEvent');
            component.setHomeLoanDetails();
            expect(component.sendEvent).toHaveBeenCalled();
      });
      it('on click of personal loan account', () => {
            spyOn(component, 'sendEvent');
            component.setPersonalLoanDetails();
            expect(component.sendEvent).toHaveBeenCalled();
      });
      it('on click of loan when account type is mfc', () => {
            spyOn(component, 'setMFCDetails');
            component.showMFCDebitOrder = true;
            component.loanClicked();
            expect(component.setMFCDetails).toHaveBeenCalled();
      });
      it('on click of loan when account is for home loan', () => {
            spyOn(component, 'setHomeLoanDetails');
            component.showMFCDebitOrder = false;
            component.accountType = 'HL';
            component.loanClicked();
            expect(component.setHomeLoanDetails).toHaveBeenCalled();
      });
      it('on click of loan when account is for personal loan', () => {
            spyOn(component, 'setPersonalLoanDetails');
            component.showMFCDebitOrder = false;
            component.accountType = 'PL';
            component.loanClicked();
            expect(component.setPersonalLoanDetails).toHaveBeenCalled();
      });
      it('on click of debit Order', () => {
            spyOn(component, 'sendEvent');
            component.debitOrderClicked();
            expect(component.sendEvent).toHaveBeenCalled();
      });

      it('should call statement and document for mfc accounts', () => {
            const spy = spyOn(router, 'navigateByUrl');
            component.accountType = 'IS';
            component.onStatementDocumentClick();
            const url = spy.calls.first().args[0];
            const itemAccountId = 1;
            expect(url).toBe(Constants.routeUrls.statementDocument + itemAccountId);
      });

      it('should redirect to statement and document url', () => {
            const spy = spyOn(router, 'navigateByUrl');
            component.onStatementDocumentClick();
            const url = spy.calls.first().args[0];
            const itemAccountId = 1;
            expect(url).toBe(Constants.routeUrls.statementDocument + itemAccountId);
      });

      it('should call onStatementPreferencesClick function if account is unit trust ', () => {
            component.accountType = 'INV';
            component.onStatementDocumentClick();
            component.onStatementPreferencesClick();
            expect(component.statementPreferencesClicked).toBe(true);
      });

      it('should call onRequestCreditLimitIncreaseClick function', () => {
            const spy = spyOn(router, 'navigateByUrl');
            component.accountId = 1;
            component.onRequestCreditLimitIncreaseClick();
            const url = spy.calls.first().args[0];
            expect(url).toBe(Constants.routeUrls.requestCreditLimitIncrease + component.accountId);
      });
      it('should return manage loan as true for home loan account', () => {
            component.manageLoanToggle = true;
            component.onAccountChange(mockHomeLoanAccount);
            expect(component.manageLoan).toBe(true);
      });
      it('should return manage loan as true', () => {
            component.isManageLoan();
            expect(component.manageLoan).toBe(true);
      });
      it('should return manage loan as false', () => {
            const mockManageLoanFalse = mockHomeLoanStatusDetails;
            mockManageLoanFalse.data.isManageLoanEnabled = false;
            accountServiceStub.getHomeLoanStatus.and.returnValue(Observable.of(mockManageLoanFalse));
            component.isManageLoan();
            expect(component.manageLoan).toBe(false);
      });
      it('should return manage loan as false for empty response', () => {
            accountServiceStub.getHomeLoanStatus.and.returnValue(Observable.of({}));
            component.isManageLoan();
            expect(component.manageLoan).toBe(false);
      });
      it('should return manage loan as false for invalid response', () => {
            accountServiceStub.getHomeLoanStatus.and.returnValue(Observable.of(mockInvalidHomeLoanStatusDetails));
            component.isManageLoan();
            expect(component.manageLoan).toBe(false);
      });
      it('should return 0 if nothing is passed to get pocket balance', () => {
            expect(component.getPocketBalance(null)).toEqual(0);
      });
      it('should return manage loan as false for non home loan account', () => {
         component.manageLoanToggle = true;
         component.manageLoan = true;
         component.onAccountChange(mockPersonalLoanAccount);
         expect(component.manageLoan).toBe(false);
      });
      it('should call show notice method', () => {
         component.isOpenNewAccount = true;
         component.showNotices();
         expect(component.isViewSubmittedNotice).toBe(false);
      });
      it('should call show notice with response', () => {
         component.isOpenNewAccount = true;
         accountServiceStub.getNotice.and.returnValue(Observable.of(mockNotice));
         component.showNotices();
         expect(component.isViewSubmittedNotice).toBe(true);
      });
      it('should call transaction click method', () => {
         component.isTransactionClick(true);
         expect(component.showNoticeFlow).toBe(false);
      });
});

describe('AccountDetailComponent', () => {
      let component: AccountDetailComponent;
      let fixture: ComponentFixture<AccountDetailComponent>;
      let router: Router;
      let service: AccountService;
      let modalService: BsModalService;

      const accountServiceStub = {
            getAccountTransactions: jasmine.createSpy('getAccountTransactions').and.returnValue(Observable.of(mockAccountTransactions)),
            getGraphTransactions: jasmine.createSpy('getGraphTransactions').and.returnValue(Observable.of(mockAccountTransactions)),
            getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.throw({ error: 400 })),
            getAccountConfig: jasmine.createSpy('getAccountConfig').and.returnValue(mockAccountConfig),
            setAccountData: jasmine.createSpy('setAccountData'),
            getDashboardAccountsData: jasmine.createSpy('getDashboardAccountsData').and.returnValue(mockDashboardAccountData),
            getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockAccountBalanceDetails)),
            getGraphTransactionsForIS: Observable.of(mockRewardsTransactions),
            hasTransactionsAndDetailsForIS: jasmine.createSpy('hasTransactionsAndDetailsForIS').and.returnValue(false),
            getGraphTransactionsForFca: Observable.of(mockFcaTransactions),
            getSettlementDetails: jasmine.createSpy('getSettlementDetails').and.returnValue(Observable.of(mockSettlementSuccessResponse)),
            setSettlementData: jasmine.createSpy('setSettlementData'),
            setTransactionsForCASA: jasmine.createSpy('setTransactionsForCASA'),
            getTransactionsForCASA: jasmine.createSpy('getTransactionsForCASA').and.returnValue([]),
            getBalanceDetails: jasmine.createSpy('getBalanceDetails').and.returnValue(Observable.of(mockBalanceDetailHL)),
            getAccountStatementPreferences: jasmine.createSpy('getAccountStatementPreferences')
                  .and.returnValue(Observable.of(mockStatementPreferenceResponse)),
            statusStatementPreferences: jasmine.createSpy('statusStatementPreferences')
                  .and.returnValue(Observable.of(mockStatementPreferenceSuccessResponse)),
            getApproveItOtpStatus: jasmine.createSpy('getApproveItOtpStatus').and.returnValue(
                  Observable.of(mockStatementPreferenceResponse)),
            getNotice: jasmine.createSpy('getNotice').and.returnValue(Observable.of(mockBalanceDetailHL)),
            getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockHomeLoanAccount),
            transactionSearchModeEmitter: new EventEmitter<boolean>(),
            getHomeLoanStatus: jasmine.createSpy('getHomeLoanStatus').and.returnValue(Observable.of(mockHomeLoanStatusDetails)),
            getPockets: jasmine.createSpy('getPockets').and.returnValue(Observable.of(mockPockets))
      };

      assertModuleFactoryCaching();
      beforeEach(async(() => {
            TestBed.configureTestingModule({
                  imports: [RouterTestingModule.withRoutes(routerTestingParam)],
                  declarations: [AccountDetailComponent, SkeletonLoaderPipe, AmountTransformPipe],
                  schemas: [CUSTOM_ELEMENTS_SCHEMA],
                  providers: [
                        { provide: TermsService, userValue: {} },
                        { provide: AccountService, useValue: accountServiceStub },
                        { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }) } },
                        PreFillService,
                        { provide: SystemErrorService, useValue: systemErrorServiceStub },
                        { provide: ClientProfileDetailsService, useValue: clientPreferencesStub },
                        { provide: BsModalService, useValue: bsModalServiceStub },
                        { provide: GaTrackingService, useValue: gaTrackingServiceStub },
                  ]
            })
                  .compileComponents();
      }));
      beforeEach(() => {
            fixture = TestBed.createComponent(AccountDetailComponent);
            component = fixture.componentInstance;
            component.lastAmountDeducted = 0;
            component.lastBalance = 0;
            component.skeletonMode = true;
            router = TestBed.get(Router);
            modalService = TestBed.get(BsModalService);
            service = fixture.debugElement.injector.get(AccountService);
            fixture.detectChanges();
      });

      it('should handle error on refresh accounts', () => {
            component.refreshAccounts();
            accountServiceStub.getDashboardAccounts().subscribe(response => { response = response; }, error => {
                  expect(component.accountContainers[0].ContainerName).toEqual(mockDashboardAccountData[0].ContainerName);
            });
      });
});
