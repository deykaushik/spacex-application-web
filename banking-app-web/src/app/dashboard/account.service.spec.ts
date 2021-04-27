import { TestBed, inject } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { Constants } from '../core/utils/constants';
import { AccountService } from './account.service';
import { TermsService } from '../shared/terms-and-conditions/terms.service';
import { ApiService } from '../core/services/api.service';
import {
   IDashboardAccounts, ITransactionDetail, IScheduledTransaction, IDebitOrdersDetail, IMandateOrdersDetail, ILinkableAccounts,
   IRefreshAccountsApiResult, IStatementPreferences, IDisputeOrderPost, IDashboardAccount, IAccountBalanceDetail,
   ITransactionDetailIS, IApiResponse, IAccountRename, ISharedContact, ISharedAccount, ISharedRecipient, ISharedCustomer,
   IClientDetails, IShareAccountReq, IUniversalBranchCode, IClientAccountDetail, IAccountLists, ILinkedAccount,
   IOverdraftAttempts, IChangeOverdraftLimitRequest, IValidation, ISettlementDetail, ISettlementQuote, IPostalCode,
   IDebitOrder, IDebitOrderReasonsData, IStopOrderPost, ICancelStopOrderPost, ILoanDebitOrderDetails, IManagePaymentDetailsPost,
   IBank, ITermsAndConditions, IStatementDownload, ITransactionMetaData, ICrossBorderRequest, IIncomeTaxResponseData,
   IIncomeTaxResponse, IFicaResult, IAccount, IViewNoticeDetails, INoticePayload, IDeposit
} from './../core/services/models';
import { stat } from 'fs';

const mockAccounts: IDashboardAccounts[] = [{
   'ContainerName': 'Bank', 'Accounts':
      [
         {
            'AccountName': 'STOP CHEQU',
            'Balance': 580303387,
            'AvailableBalance': 580287819.94,
            'AccountNumber': 1009000675,
            'AccountType': 'CA',
            'AccountIcon': 'glyphicon-account_current',
            'NewAccount': true,
            'LastUpdate': '2017-08-18 10:51:01 AM',
            'InstitutionName': 'Nedbank (South Africa)',
            'Currency': '&#x52;',
            'SiteId': '16390',
            'ItemAccountId': '1',
            'InterestRate': 0
         }
      ],
   'ContainerIcon': 'glyphicon-account_current',
   'Assets': 179946723978.75
},
{
   'ContainerName': 'Foreign',
   'Accounts': [
      {
         'AccountName': 'TRVL CRD 1',
         'Balance': 49824,
         'AvailableBalance': 49824,
         'AccountNumber': 5299850000006426,
         'AccountType': 'CC',
         'AccountIcon': '',
         'NewAccount': true,
         'LastUpdate': '2018-05-31 04:04:42 PM',
         'InstitutionName': 'Nedbank (South Africa)',
         'Currency': '&#x52;',
         'SiteId': '16390',
         'ItemAccountId': '101',
         'InterestRate': 0,
         'IsShow': true,
         'IsProfileAccount': true,
         'ProductType': 'MAS',
         'Pockets': [{
            'Currency': 'AUD',
            'Balance': 1000,
            'Priority': 1
         },
         {
            'Currency': 'CAD',
            'Balance': 1000,
            'Priority': 2
         },
         {
            'Currency': 'EUR',
            'Balance': 1000,
            'Priority': 3
         },
         {
            'Currency': 'GBP',
            'Balance': 1000,
            'Priority': 4
         },
         {
            'Currency': 'ILS',
            'Balance': 1000,
            'Priority': 5
         },
         {
            'Currency': 'JPY',
            'Balance': 1000,
            'Priority': 6
         },
         {
            'Currency': 'USD',
            'Balance': 1000,
            'Priority': 7
         }]
      }],
   'ContainerIcon': 'glyphicon-account_current',
   'Assets': 179946723978.75
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

const mockFica: IFicaResult = {
   isFica: true
};

const mockFicaResult: IApiResponse = {
   data: mockFica
};

const mockAccount: IAccount = {
   nickname: 'Inv CA2',
   accountType: 'CA',
   accountNumber: 232345523
};

const mockAccountsDetail: IApiResponse = {
   data: mockAccount
};

const mockNotice: IViewNoticeDetails = {
   noticeID: 'NOW2018062815',
   noticeDate: '2018-10-05T00:00:00',
   noticeAmount: 2040,
   capitalDisposalAccount:
   {
      accountNumber: 123456789,
      accountType: 'DS'
   }
};

const mockNoticeDetails: IApiResponse = {
   data: mockNotice
};

const accountListEnable: IAccountLists = {
   accountList: mockDashboardAccounts
};

const mockTransactions: ITransactionDetail[] = [{
   TransactionId: null,
   Description: 'Test MR bonus 3768000010300602',
   Amount: 2764.0,
   Debit: false,
   Account: '841709000015',
   PostedDate: '2017-10-27 12:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 9298.0,
   Currency: 'GB',
   ShortDescription: null
}];
const selectedAccount = {
   AccountName: 'STOP CHEQU',
   Balance: 580303387,
   AvailableBalance: 580287819.94,
   AccountNumber: 1009000675,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0,
   IsAlternateAccount: false
};
const mockScheduleTransactions: IScheduledTransaction[] = [{
   'batchID': 2060015,
   'transactionID': 29117114,
   'capturedDate': '2017-09-20T00:00:00',
   'startDate': '2017-09-20T00:00:00',
   'nextTransDate': '2017-09-20T00:00:00',
   'beneficiaryID': 0,
   'sortCode': '196005',
   'bFName': 'UNKNOWN',
   'myDescription': 'test',
   'beneficiaryDescription': 'test',
   'fromAccount': { 'accountNumber': '1713277581' },
   'toAccount': { 'accountNumber': '1042853096', accountType: 'CA' },
   'amount': 100.0,
   'reoccurrenceItem': {
      'reoccurrenceFrequency': 'Monthly',
      'recInstrID': 2050467,
      'reoccurrenceOccur': 12,
      'reoccOccurrencesLeft': 11,
      'reoccurrenceToDate': '2018-09-16T00:00:00',
      'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
   },
}];

const mockMandateList: IMandateOrdersDetail[] = [{
   'DebtorName': 'STEPHEN LEVITT',
   'DebtorAccountNumber': '2131234',
   'CreditorName': 'MFC',
   'MandateInitiationDate': '2017-07-26 12:00:00 AM',
   'MandateStatus': 'Active',
   'MandateReferenceNumber': '0002201707260000001453',
   'MandateIdentifier': '0002201707260000001453',
   'ContractReference': '20170726122834',
   'InstalmentAmount': 2986.04,
   'MandateAuthenticationDate': '2017-07-26 12:00:00 AM'
}, {
   'DebtorName': 'STEPHEN LEVITT',
   'DebtorAccountNumber': '222222',
   'CreditorName': 'MFC',
   'MandateInitiationDate': '2017-07-26 12:00:00 AM',
   'MandateStatus': 'Pending',
   'MandateReferenceNumber': '0002201707260000001453',
   'MandateIdentifier': '0002201707260000001453',
   'ContractReference': '20170726122834',
   'InstalmentAmount': 2986.04,
   'MandateAuthenticationDate': '2017-07-26 12:00:00 AM'
}];
const mockdebitOrders: IDebitOrder[] = [{
   'itemAccountId': '2',
   'accountDebited': '1944082565',
   'chargeAmount': 55,
   'contractReferenceNr': ' ',
   'creditorName': 'OLDMUTCOL    19466228920180601',
   'debitOrderType': 'EXE',
   'disputed': false,
   'frequency': '2',
   'lastDebitDate': '2018-06-01T00:00:00',
   'statementDate': '2018-06-01T00:00:00',
   'statementLineNumber': 8,
   'statementNumber': 1017,
   'subTranCode': '00',
   'tranCode': '1424',
   'installmentAmount': 100
},
{
   'itemAccountId': '2',
   'creditorName': 'PREMIUMCOLTEST02DP RF12BQL5',
   'installmentAmount': 20,
   'accountDebited': '1001004221',
   'lastDebitDate': '2018-05-07T00:00:00',
   'frequency': '',
   'contractReferenceNr': ' ',
   'debitOrderType': 'EXE',
   'statementNumber': 1607,
   'statementLineNumber': 12,
   'statementDate': '2018-05-07T00:00:00',
   'tranCode': '1468',
   'chargeAmount': 55,
   'subTranCode': '00',
   'disputed': true
},
{
   'itemAccountId': '2',
   'creditorName': 'PREMIUMCOLTEST02DP RF12BQL5',
   'installmentAmount': 200,
   'accountDebited': '1001004221',
   'lastDebitDate': '2018-05-07T00:00:00',
   'frequency': '',
   'contractReferenceNr': ' ',
   'debitOrderType': 'EXE',
   'statementNumber': 1607,
   'statementLineNumber': 12,
   'statementDate': '2018-05-07T00:00:00',
   'tranCode': '1468',
   'chargeAmount': 55,
   'subTranCode': '00',
   'disputed': false
}];
const mockScheduleResponse = {
   'data': mockScheduleTransactions
};
const mockScheduleResponseByTransactionId = {
   'data': mockScheduleTransactions[0]
};

const mockScheduleDetailResponse = {
   'data': mockScheduleTransactions[0]
};

const accountsResponse = {
   'data': []
};

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
}];
const mockGetAccountStatementPreferences: IApiResponse = {
   data: {
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
   },
   metadata: {
      resultData: [
         {
            transactionID: '34526',
            resultDetail: [
               {
                  operationReference: 'SUCCESS',
                  result: 'R00',
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
};
const mockPostalCode: IApiResponse = {
   data: [{
      city: 'abcd',
      postalCode: '2345',
      suburb: 'xyz',
      postalCodeType: 'street'
   },
   {
      city: 'efgh',
      postalCode: '7890',
      suburb: 'tuv',
      postalCodeType: 'street'
   },
   {
      city: 'ABCD',
      postalCode: '7654',
      suburb: 'efg',
      postalCodeType: 'street'
   }],
   metadata: {
      resultData: [
         {
            transactionID: '34526',
            resultDetail: [
               {
                  operationReference: 'SUCCESS',
                  result: 'R00',
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
};
const mockStatementPreferencesDetails: IStatementPreferences = {
   itemAccountId: '1',
   accountNumber: '1001037693',
   frequency: 'BTM',
   deliveryMode: 'EMAIL',
   email: ['GUNJAL138@GMAIL.COM'],
   postalAddress: {
      addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
      city: 'JOHANNESBURG',
      postalCd: '2191'
   },
   physicalAddress: 'JOHANNESBURG',
};
const mockStatementResponse: IApiResponse = {
   data: mockStatementPreferencesDetails
};
const mockLinkAccountsResponse = { 8002684602501: 'R00', 8001724876001: 'R00' };

const mockRefreshAccountsApiResponse: IRefreshAccountsApiResult = {
   result: {
      resultCode: 0,
      resultMessage: ''
   }
};
const mockLoanDebitOrders: IApiResponse = {
   'data': [
      {
         'itemAccountId': '13',
         'accountNumber': '711647500000001',
         'currentBalance': 193650.28,
         'assetDetails': {
            'description': '2011 U KIA SPORTAGE 2.0 A/T',
            'chassisNumber': 'KNAPC811MB7135729',
            'engineNumber': 'G4KDBS026445'
         },
         'interestRate': 18.0,
         'paymentFrequency': 'Monthly',
         'totalInstallment': 5283.52,
         'nextInstallmentDate': '2018-07-30T02:00:00+02:00',
         'paymentMethod': 'Cash',
         'bankName': 'ABSA BANK (PREF BRANCH CODE)',
         'bankBranchCode': 632005,
         'bankAccNumber': '9071836461',
         'bankAccountType': 'CA',
         'similarAccounts': [{
            'itemAccountId': '12',
            'accountNumber': '711347600000001',
            'currentBalance': 278073.0
         }, {
            'itemAccountId': '13',
            'accountNumber': '711647500000001',
            'currentBalance': 193650.28
         }]
      }],
   'metadata': {
      'resultData': [{
         'transactionID': '13',
         'resultDetail': [{
            'operationReference': 'DealInfoEnq',
            'result': 'R00',
            'status': 'SUCCESS',
            'reason': 'SUCCESS'
         }]
      },
      {
         'transactionID': '13',
         'resultDetail': [{
            'operationReference': 'DealAssetInfoEnq',
            'result': 'R00',
            'status': 'SUCCESS',
            'reason': 'SUCCESS'
         }]
      }]
   }
};
const mockManagePaymentDetailsPost: IManagePaymentDetailsPost = {
   'installmentAmount': 5000,
   'paymentDate': '2018-07-30T02:00:00+02:00',
   'bankName': 'ABSA BANK (PREF BRANCH CODE)',
   'bankBranchCode': 632005,
   'bankAccNumber': '9071836461',
   'accountType': 'CA',
   'additionalAccounts': [{
      'itemAccountId': '12',
      'accountNumber': '711347600000001',
      'currentBalance': 278073.0
   }, {
      'itemAccountId': '13',
      'accountNumber': '711647500000001',
      'currentBalance': 193650.28
   }]
};
const mockTermsConditions: IApiResponse = {
   data: {
      noticeType: 'DDD',
      versionNumber: 0.06,
      acceptedDateTime: '2018-07-05 11:16:15 AM',
      noticeDetails: {
         versionDate: '2018-07-05 11:05:53 AM',
         presentationTemplateType: 'PAGE_TEMPLATE',
         noticePresentationTemplate: `7b0HYBxJliUmL23Ke39K9UrX4HShCIBgEyTYkEAQ7MGIzeaS7B1pRy
          MpqyqBymVWZV1mFkDM7Z28995777333nvvvfe6O51OJ/ff/z9cZmQBbPbOStrJniGAqsgfP358Hz8i/se/9x98
          /Hu8W5TpZV43RbX87KPd8c5Hab6cVrNiefHZR+v2fPvgo9/j6PG7pnzUtNdl3szzvO20JwjL5hE1+eyjeduuHt
          29e3V1Nb66N67qi7u7Dx8+vPt7v35+902dLZvzql7YF+btYvgV/vajozTlvtt8sSqzNk8XWTudf/bRXXyj3xHM
          7TybztMmL/Np+9lHr/Ppui7a6xdVW0zzu/JDXtBXLrO6yCZlni6zRf7ZR23etOZ726Jc59vVuQX6Mquzizpbz
          T9K7xpQd31Y5kPg7WBNqtm1/WsI9u/GCKSzogGg7Wrdrtbtdt5MsxVPw3XefGQ6Rbce0Md3bX+CjqHGkfnAkO5I/nSzePRr/D8=`,
         noticeContent: `pVTBbtNAEL1X6j+MgtRTSQgtlKpOqyJx4BJFhB8Yr8f20vWumd1N8Ldx4JP4BWZtxw0cIBK
          nbHZn3rx58zw/v//IHr41BnbEXju7mi3nr2ZAVrlC22o1i6F8+W72cH9+lm1JRdahW7ugFckNQDaesw0yVoxtfX9h
          wt1287gGg5L/YX1Rhbvzs3S7gULzygQGNLqyK0NlSK/pbbH5d9xyDp9r7YHpayQfoHDkwboALpc4glAT5GifIDho
          8IkAbQctdg3ZIOcCfMy/kArp/RB78eLq9m6A1Ewp0gN68CSoMYC2fSSToR0mlIqpjwJXgnFoT+X+eg4fLew07VNm
          wmzZCZj3QrUYuE9UGxflR6fm9lBEOrXIVRJo1KDBTtj7tu93KNcShw5yKh0/F9MDgVNLXM/hUVQdKbaoi4SQZCJu
          PNTEJP3ttTFSCBpnqRslNocpYCFSKir6McmQKhSeQSQf3HXQJ3cS20b2MQk/juz/B/EmDULIJgP1NFEpjgQluwYK
          DJQAj02DEqMPGaHGMGZ4mQzLJ9K7TBoNdVJCMjE3wr7rexu0J4ERVEJVD5HzU9m+Fba9qIJXkDLINHDYO36CWpya
          E1lQrmkNBdHUY9C+RBUca9P1DShnS83NkBeO/YFlOdlj6PhkYjeJGDaA+4mSdVBqi2ZSb3KB+OsSojXJ7QhKbKhLr
          UatnVKxFUMMZGW+KrA8muO4y/RNMpXEPPhGDCd+CbKwYHl9cMwa04Vkvo/apO0Fn6iKpr/1sA2Cj1x4eFS9a5a3N7
          eXzxqWka329YA/yXRwwN/2RY07OpqDFoi9/m3I/SktxfQnWzwvy2wxLdNs8cd+/QU=`,
         channelID: 3
      }
   },
   metadata: {
      resultData: []
   }
};
const mockBankData: IBank = {
   bankCode: '001',
   bankName: 'Test',
   rTC: true,
   universalCode: '100',
   branchCodes: [{
      branchCode: '001',
      branchName: 'Test Branch'
   }]
};
const _DashboardAccounts = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockAccounts));
const _MfcLoanDetails = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockLoanDebitOrders));
const _AccountTransactions = jasmine.createSpy('get').and.callFake((itemAccountId) => {
   return Observable.of(mockTransactionList);
});
const _GraphTransactions = jasmine.createSpy('get').and.callFake((itemAccountId) => {
   return Observable.of(mockTransactionList);
});
const _ScheduledTransfer = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockScheduleResponse);
});

const _ScheduledMobileTrasactions = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockScheduleResponse);
});
const _ScheduledPayment = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockScheduleResponse);
});
const _DebitOrders = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return ([{ 'data': mockdebitOrders }]);
});
const _DebitOrdersMandates = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return ([{ 'Data': mockMandateList }]);
});

const getScheduledPaymentDetail = jasmine.createSpy('get').and.callFake((id) => {
   return Observable.of(mockScheduleResponseByTransactionId);
});

const getScheduledTransferDetail = jasmine.createSpy('get').and.callFake((id) => {
   return Observable.of(mockScheduleResponseByTransactionId);
});

const getScheduledPrepaidDetail = jasmine.createSpy('get').and.callFake((id) => {
   return Observable.of(mockScheduleResponseByTransactionId);
});

const _ScheduledTransferDetail = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockScheduleDetailResponse);
});

const _ScheduledMobileTrasactionDetail = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockScheduleDetailResponse);
});
const _ScheduledPaymentDetail = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockScheduleDetailResponse);
});
const _getAccountStatementPreferences = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockGetAccountStatementPreferences);
});
const updateAccountStatementPreferences = jasmine.createSpy('update').and.callFake((urlParam) => {
   return Observable.of({ metadata: metadata });
});
const statusSatementPreferences = jasmine.createSpy('create').and.returnValue(Observable.of(mockGetAccountStatementPreferences));
const getPostalCodes = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockPostalCode));

const _LinkableAccounts = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockLinkableAccounts));
const _LinkableAccountsCreate = jasmine.createSpy('create').and.returnValue(Observable.of(mockLinkAccountsResponse));
const _RefreshAccounts = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockRefreshAccountsApiResponse));
const _updateMfcLoanDetails = jasmine.createSpy('update').and.callFake((urlParam) => {
   return Observable.of(UpdateMFCAPIResp);
});
const _getAllBanks = jasmine.createSpy('getAllBanks').and.returnValue(Observable.of({ data: [mockBankData] }));
const _getTerms = jasmine.createSpy('getTermsAndConditionsForMFC').and.returnValue(Observable.of(mockTermsConditions));

const metadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const mockRenameDetail: IAccountRename = {
   NickName: 'Saving account'
};

const renameResultData = {
   AccountNumber: '1058272047',
   AccountNickName: 'Internet'
};

const _SaveAccountName = jasmine.createSpy('update').and.callFake((urlParam) => {
   return Observable.of({ data: renameResultData });
});

const _SaveTransaction = jasmine.createSpy('update').and.callFake((urlParam) => {
   return Observable.of({ metadata: metadata });
});
const disputeMetadata: IApiResponse = {
   data: null,
   metadata: {
      'resultData': [
         {
            'resultDetail': [
               {
                  'operationReference': 'DisputeDebitOrder',
                  'result': 'R00',
                  'status': 'SUCCESS',
                  'reason': 'Success'
               }
            ]
         }
      ]
   }
};
const mockReasons: IDebitOrderReasonsData = {
   'data': [
      {
         'channelTechType': '80',
         'code': '12',
         'description': 'CTEX'
      },
      {
         'channelTechType': '80',
         'code': '13',
         'description': 'CTAM'
      },
      {
         'channelTechType': '100',
         'code': '10',
         'description': 'I haven\'t authorized this debit on my account'
      },
      {
         'channelTechType': '100',
         'code': '11',
         'description': 'I was debited more than I agreed to'
      },
      {
         'channelTechType': '100',
         'code': '12',
         'description': 'I have cancelled the service '
      },
      {
         'channelTechType': '100',
         'code': '13',
         'description': 'The debit has been previously stopped'
      },
      {
         'channelTechType': '100',
         'code': '14',
         'description': 'Other'
      },
      {
         'channelTechType': '0',
         'code': '0',
         'description': ' '
      }
   ]
};
const _saveDisputeOrder = jasmine.createSpy('create').and.callFake((urlParam) => {
   return Observable.of(disputeMetadata);
});

const _saveStopOrder = jasmine.createSpy('create').and.callFake((urlParam) => {
   return Observable.of(disputeMetadata);
});

const _removeStoppedOrder = jasmine.createSpy('remove').and.callFake((urlParam) => {
   return Observable.of(disputeMetadata);
});

const _createNotice = jasmine.createSpy('remove').and.callFake((urlParam) => {
   return Observable.of(disputeMetadata);
});

const _debitOrderReasons = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockReasons);
});

const _Accounts = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(accountsResponse);
});

const _FicaStatus = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockFicaResult);
});

const _NoticeAccount = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockAccountsDetail);
});

const _NoticeDetails = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockNoticeDetails);
});

const removeScheduledPayment = jasmine.createSpy('removeScheduledPaymentDetail').and.returnValue(Observable.of({ metadata: metadata }));
const removeScheduledTransfer = jasmine.createSpy('removeScheduledTransferDetail').and.returnValue(Observable.of({ metadata: metadata }));
const removeSchedulesPrepaid = jasmine.createSpy('removeScheduledPrepaidDetail').and.returnValue(Observable.of({ metadata: metadata }));

const mandateMetadata = {
   'MetaData':
   {
      'ResultCode': 'R00', 'Message': 'Success', 'InvalidFieldList': null,
      'result': { 'resultCode': 0, 'resultMessage': '' }
   }, 'Data': null
};

const manageMandateOrders = jasmine.createSpy('ManageMandateOrders').and.returnValue(Observable.of(mandateMetadata));

const testComponent = class { };
const routerTestingParam = [
   { path: 'Mobile/:id', component: testComponent },
];

const shareAccountSuccessMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'POA',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const shareAccountFailureMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'POA',
               result: 'R11',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const mockShareAccountSuccessResponse = {
   data: [],
   metadata: shareAccountSuccessMetadata
};

const mockSharedAccounts: ISharedAccount[] = [{
   accountNumber: '24324123456',
   accountName: 'Uncle Bob',
   accountType: 'Saving Account',
   branchCode: '19876'
}];

const mockSharedContacts: ISharedContact[] = [{
   emailId: 'uncle@bob.com',
   phoneNumber: '',
   id: 1
}];

const mockSharedRecipients: ISharedRecipient[] = [{
   partyName: '',
   contactDetail: mockSharedContacts
}];

const mockSharedCustomers: ISharedCustomer[] = [{
   identifierType: 'CIS',
   identifier: '123456789098'
}];

function getUniveralBranchCodes(): IUniversalBranchCode[] {
   return [{
      accountType: 'CA',
      branchCode: '198765'
   }, {
      accountType: 'SA',
      branchCode: '198765'
   }, {
      accountType: 'HL',
      branchCode: '170305'
   }, {
      accountType: 'PL',
      branchCode: '198765'
   }];
}

const mockUniversalBranchCodes: IUniversalBranchCode[] = getUniveralBranchCodes();
const mockUniversalBranchCodesAPIResponse: IApiResponse = {
   data: mockUniversalBranchCodes
};

const _ShareAccount = jasmine.createSpy('shareAccount').and.returnValue(Observable.of(mockShareAccountSuccessResponse));
const _UniversalBranchCodes = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockUniversalBranchCodesAPIResponse));
const mockUpliftAccountDormancy: IApiResponse = {
   data: {},
   metadata: {
      resultData: [
         {
            transactionID: '0',
            resultDetail: [
               {
                  operationReference: 'SUCCESS',
                  result: 'R00',
                  status: 'PENDING'
               }
            ]
         }
      ]
   }
};

const mockUnilateralLimitIndicatorAPIResp: IApiResponse = {
   data: [{
      unilateralLimitIndicator: true,
      isAvailable: true,
      accountName: 'CC',
      plastics: [
         { plasticId: '2', plasticNumber: '377095500181958' },
         { plasticId: '13', plasticNumber: '5412830000809351' }
      ]
   }],
   metadata: {
      resultData: [{
         resultDetail: [
            { operationReference: 'TRANSACTION', result: 'R00', status: 'SUCCESS', reason: 'Success' }
         ]
      }]
   }
};
const failureLoanDebitOrder: IApiResponse = {
   data: [],
   metadata: {
      resultData: [
         {
            transactionID: '41',
            resultDetail: [
               {
                  operationReference: 'DebitOrderEnquiry',
                  result: 'R02',
                  status: 'FAILURE'
               }
            ]
         }
      ]
   }
};
const mockUnilateralLimitIndicatorUpdateAPIResp: IApiResponse = {
   'metadata': {
      'resultData': [
         {
            'transactionID': '0',
            'resultDetail': [
               {
                  'operationReference': 'TRANSACTION',
                  'result': 'R00',
                  'status': 'SUCCESS',
                  'reason': 'Success'
               }
            ]
         }
      ]
   }
};
const UpdateMFCAPIResp: IApiResponse = {
   'metadata': {
      'resultData': [
         {
            'transactionID': '0',
            'resultDetail': [
               {
                  'operationReference': 'TRANSACTION',
                  'result': 'R00',
                  'status': 'SUCCESS',
                  'reason': 'Success'
               }
            ]
         }
      ]
   }
};

const _UpliftAccountDormancy = jasmine.createSpy('update').and.returnValue(Observable.of(mockUpliftAccountDormancy));
const _UpliftAccountDormancyStatus = jasmine.createSpy('create').and.returnValue(Observable.of(mockUpliftAccountDormancy));

const _UnilateralLimitIndicatorDetails = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockUnilateralLimitIndicatorAPIResp));
const _UnilateralLimitIndicatorUpdate
   = jasmine.createSpy('update').and.returnValue(Observable.of(mockUnilateralLimitIndicatorUpdateAPIResp));
const _OutOfBandOtpStatus = jasmine.createSpy('getApproveItOtpStatus').and.returnValue(Observable.of({
   transactionVerificationCode: 'TVCCODE', verificationReferenceId: '213'
}));
const mockGreenbackRewardsAccounts: any[] = [{
   AccountNumber: 851309614323,
   AccountType: 'Rewards',
   AvailableBalance: 25762,
   RewardsProgram: 'GB',
   RandBalance: 715.61
}];

const mockAmexRewardsAccounts: any[] = [{
   AccountNumber: 951309614323,
   AccountType: 'Rewards',
   RewardsProgram: 'MR',
   RandBalance: 715.61
}];

const isAPImetadata = {
   'resultData': [
      {
         'resultDetail': [
            {
               'operationReference': 'Balance Enquiry',
               'result': 'R00',
               'status': 'SUCCESS',
               'reason': 'Success'
            }
         ]
      }
   ]
};

const mockTransactionList: IApiResponse = {
   data: mockTransactions,
   metadata: isAPImetadata
};
const mockNoResponseTransactionList: IApiResponse = {
   data: null,
   metadata: isAPImetadata
};
const mockTransactionDetails = {
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
   TransactionId: 'CPS|Item1|6096fdd3-e2ce-56bd-9772-d3f5d9d19b98',
   AccountNumber: '1944122702',
   TransactionType: 'Payment (Debit Order)',
   TransactionDescription: 'INSURECASH4000545980-133708320',
   TransactionAmount: 37.8,
   TransactionDate: '2017-12-08T00:00:00',
   ReferenceNumber: '6031171208023792',
   ErrorCode: 'R00',
   TypeData: {
      type: 'Payment (Debit Order)',
      data: {}
   }
};
const successMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Transaction Details',
               result: 'R00',
               status: 'SUCCESS',
               reason: 'Successful'
            }
         ]
      }
   ]
};

const mockISTransactionDetails: ITransactionDetailIS = {
   data: mockTransactionDetails,
   metadata: successMetadata
};

const mockAccountBalanceDetail: IAccountBalanceDetail = {
   movementsDue: -10000.0,
   unclearedEffects: 0.0,
   accruedFees: 0.0,
   pledgedAmount: 0.0,
   crInterestDue: 1482.96,
   crInterestRate: 1.0,
   overdraftLimit: 15900.0,
   dbInterestDue: 0.0,
   dbInterestRate: 9.25
};

const mockClientAccountDetail: IClientAccountDetail = {
   AccountHolderName: 'CURRENT',
   IsAlternateAccount: false
};

const mockAccountBalanceDetailData = {
   type: 'CA',
   data: mockAccountBalanceDetail
};

const mockAccountBalanceDetailAPI: IApiResponse = {
   data: mockAccountBalanceDetailData,
   metadata: isAPImetadata
};

const failureMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Transaction Details',
               result: 'R06',
               status: 'Failure',
               reason: ''
            }
         ]
      }
   ]
};
const mockISTransactionDetailsFailure: ITransactionDetailIS = {
   metadata: failureMetadata
};
const _AccountDetails = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockClientAccountDetail));

const _AccountBalanceDetails = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockAccountBalanceDetailAPI));

const _TransactionDetails = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockISTransactionDetails));

const _PartWithdrawalAmount = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockISTransactionDetails));

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

const mockSettlementDetailsAPIResponse: IApiResponse = {
   data: mockSettlementDetails,
   metadata: mockSuccessMetadata
};

const _SettlementDetails = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockSettlementDetailsAPIResponse));

const settlementQuoteSuccessMetadata = {
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

const mockOverdraftAttempt: IOverdraftAttempts = {
   remainingTime: '',
   overdraftAttempts: 5
};

const mockOverdraftAttempts: IApiResponse = {
   data: mockOverdraftAttempt
};

const _AccountOverdraftAttempts = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockOverdraftAttempts));

const ODsuccessMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'POA',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const settlementQuoteFailureMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Settlement Quote',
               result: 'R11',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const mockSettlementQuoteAPISuccessResponse = {
   data: [],
   metadata: settlementQuoteSuccessMetadata
};

const mockSettlementQuoteAPIFailureResponse = {
   data: [],
   metadata: settlementQuoteFailureMetadata
};

const _SettlementQuotes = jasmine.createSpy('create').and.returnValue(Observable.of(mockSettlementQuoteAPISuccessResponse));
const mockChangeAccountOverdraftLimit = {
   metadata: ODsuccessMetadata
};

const mockChangeOverdraftLimitRequest: IChangeOverdraftLimitRequest = {
   requestType: '',
   itemAccountId: '1',
   newOverdraftLimit: 0,
   currentOverdraftLimit: 0,
   email: '',
   phoneNumber: '',
   reason: ''
};

const _AccountOverdraftLimit = jasmine.createSpy('update').and.returnValue(Observable.of(mockChangeAccountOverdraftLimit));

function getOverdraftValidations(): IValidation[] {
   return [{
      validationType: 'Overdraft',
      setting: [
         {
            validationKey: 'Minimum',
            validationValue: '100'
         },
         {
            validationKey: 'Maximum',
            validationValue: '250000'
         }
      ]
   }];
}

const mockOverdraftValidations: IValidation[] = getOverdraftValidations();
const mockOverdraftValidationsAPIResponse: IApiResponse = {
   data: mockOverdraftValidations
};

const _OverdraftValidations = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockOverdraftValidationsAPIResponse));

const mockAccountListWithRewards = [{
   ContainerName: 'Rewards',
   Accounts: []
}];

const mockNoStatus: IApiResponse = {
   data: null,
   metadata: null
};
const _getAdvancedSearchData = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockTransactionList));

const mockDocumentRequest: IApiResponse = {
   data: null,
   metadata: null
};

const termsServiceStub = {
   decodeTerms: jasmine.createSpy('decodeTerms').and.returnValue('value')
};

const mockStatementData: IStatementDownload = {
   'resultCode': 'ECS-SERVICE-SEARCH-000',
   'resultMessage': 'Results found',
   'documentSearchResultRowList': [
      {
         'accountNumber': '1338054201',
         'startDate': new Date('2018-05-18T22:00:00.000Z'),
         'documentClass1': 'ARRANGEMENT',
         'documentClass2': 'MAINTENANCE',
         'documentType': 'STATEMENT',
         'effectiveDate': '2018-06-19',
         'effectiveTime': '2018-06-19T22:00:00.000Z',
         'documentStatus': 'APPROVED',
         'documentUrl': `ENCRYPTED_mainKey_%2FmNn4qW2GIg4nS4m4tH2QA%3D%3D_AsYWypnvwIgZ0n10FeDtw5HVNnCxhJXrJPkL
         ewFlJR301%2BFcxq8Ct5PGfyg1iWov4VkayHZOUxvSAiQy6PG7aJMHlSqTsiQPZkbIuFQmEpjIVXD89kh0gNBfbe%2FB9N8Pm8J
         ciWm2HE5FMdSn9jqCUSH4MUCL7U4j6PQVsQOZCNs%2BTDM3%2BNtlKcfbHZ8fnTASlB1rW348aUJn7MfQP497MRsnUqo4NlmgT%
         2BFJbTkhylnmmTN5aPg7IA52rAJ%2B2JRJ`
      }
   ]
};
const _updateTerms = jasmine.createSpy('update').and.callFake((query, routeParams) => {
   return Observable.of({
      data: null,
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'update terms successfully',
                     result: 'R00',
                     status: 'SUCCESS',
                     reason: 'Success'
                  }
               ]
            }
         ]
      }
   });
});

const mockScheduledData: IIncomeTaxResponse[] = [{
   'accountNumber': 37683506,
   'partyNumber': 110017270200,
   'documentClass1': 'ARRANGEMENT',
   'documentClass2': 'MAINTENANCE',
   'documentClass3': 'INVESTMENT',
   'documentType': 'TAX_CERTIFICATE',
   'documentTitle': '',
   'effectiveDate': new Date('2017-02-27'),
   'effectiveTime': new Date('2017-02-27T22:00:00.000Z'),
   'documentStatus': 'APPROVED',
   'documentUrl': `ENCRYPTED_mainKey_1fp7rzQZqOVow%2FenEmCDHg%3D%3D_RHAr1R3W5LkensMdT8cn2l0lsrh0Pi5G%2FenYVLvW4gsKtPG9i4Yul7
                  3oZYiiuYiqBMnRX1ZDwAX1vJy9FIaAivnYO4O6qCFEi6AxZxQanGBDZnV41YFambWO8%2Fwyo4O3fC%2FJQvl2hL%2BCyFnD%2Fp0UFuQL
                  d0AURQppsG6Zn%2FlvxJtQU9TnMnHggNbxn5KtvkinLGTMFBjCiBsryXL5BsQ2wwxKUlLvccEVnrjZXCd85gB9f8igIfFMPnOak4kzv%2BL0`
}];
const mockAPIResponse: IIncomeTaxResponseData = {
   'resultCode': 'ECS-SERVICE-SEARCH-000',
   'resultMessage': 'Results found',
   'documentSearchResultRowList': mockScheduledData
};

const _getDocumentsList = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockDocumentRequest));
const _sendPaidUpLetter = jasmine.createSpy('create').and.returnValue(Observable.of(mockDocumentRequest));

const _getStatementData = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockStatementData));
const _getStatementDownload = jasmine.createSpy('getAll').and.returnValue(Observable.of(true));
const _getStartDateStatement = jasmine.createSpy('getBlob').and.returnValue(Observable.of(true));
const _getIncomeTaxYears = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockAPIResponse));

const mockCorssBorderSuccessMetadata: ITransactionMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'mfccrossborderletter',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const mockCrossBorderRequestSuccessResponse: IApiResponse = {
   data: {},
   metadata: mockCorssBorderSuccessMetadata
};

const mockCancelLoan: IApiResponse = {
   data: {
      status: ''
   },
   metadata: {
      resultDetail: [{
         operationReference: '',
         result: 'SUCCESS',
         status: 'R00',
         reason: ''
      }]
   }
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
      resultDetail: [{
         operationReference: 'LoanProductsManagement',
         result: 'SUCCESS',
         status: 'R00',
         reason: ''
      }]
   }
};

const _crossBorderRequest = jasmine.createSpy('shareAccount').and.returnValue(Observable.of(mockCrossBorderRequestSuccessResponse));
const _homeLoanStatus = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockHomeLoanStatusDetails));
const mockCrossBorderRequest: ICrossBorderRequest = {
   itemAccountId: '7',
   documentType: 'mfccrossborderletter',
   crossBorder: {
      countries: [
         {
            name: 'Mozambique'
         }
      ],
      dateOfLeaving: '2018-08-22',
      dateOnReturn: '2018-08-27',
      licensePlateNumber: 'Uma',
      insuranceCompanyName: 'FORBES',
      insurancePolicyNumber: '123456',
      driverDetails: [
         {
            name: 'BOB',
            surname: 'JAMES',
            driverLicenseNumber: 'DLN',
            idOrPassportNumber: 'PN'
         }
      ]
   },
   emailId: 'bob@nedbank.co.za'
};

const mockOpenAccountData: IApiResponse = {
   data: {}
};

const mockTripsByCardNumber = {
   validTripLoaded: true,
   trips: [
      {
         clientEnterpriseNumber: {
            clientIdentifier: '1234589',
            clientIdType: {
               code: 'IdCode',
               description: 'IdDesc'
            }
         },
         clientRsaId: {
            clientIdentifier: '9875244',
            clientIdType: {
               code: 'RsaIdCode',
               description: 'RsaIdDesc'
            }
         },
         clientContactDetails: {
            firstName: 'AAA',
            lastName: 'ZZZ',
            phoneNumber: {
               countryCode: '1',
               areaCode: '23',
               phoneNumber: '1234534'
            },
            eMail: 'abc@xyz.com'
         },
         departureDate: '2018-08-20',
         destination: 'USA',
         passportExpiryDate: '2026-02-18',
         passportNumber: 'H123456',
         returnDate: '2018-09-20',
         ticketNumber: 'TICK123',
         topupAllowed: 'true',
         transactionReference: 'TR1234',
         tripStatus: 'ACTV',
         borderPost: 'BEIT BRIDGE',
         clientReference: 'CR432',
         clientAddress: {
            streetNumber: '24',
            streetName: 'Street12',
            building: 'Bldn123',
            floor: '2',
            complex: 'CMX1',
            unit: 'U1',
            suburb: 'Sub1',
            city: 'New York',
            postalCode: '1242'
         }
      }
   ]
};

const _getEntryAmount = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});

const _getAllProducts = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});

const _createLoadTrip = jasmine.createSpy('create').and.returnValue(Observable.of({ tripdata: 'fakedata' }));

const _getAllTripsByCardNumber = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockTripsByCardNumber));

const _getAllTripCountries = jasmine.createSpy('getAll').and.returnValue(Observable.of({ tripCountries: 'fakeData' }));

const _getAllTripBorderList = jasmine.createSpy('getAll').and.returnValue(Observable.of({ tripBorder: 'fakeData' }));

const _getInitialDeposit = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});

const _getInvestor = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});

const _getInterestPayout = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});

const _getInterestRate = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});
const _getTermsAndConditionsForOpenNewAccount = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});

const _getTravelCurrencyPockets = jasmine.createSpy('getAll').and.returnValue(Observable.of(
   { data: 'mockTravelcurrencyPockets' }));
const _updateTermsForOpenNewAccount = jasmine.createSpy('update').and.callFake((urlParam) => {
   return Observable.of({ metadata: metadata });
});
const _updateTravelCurrencyPockets = jasmine.createSpy('update').and.returnValue(Observable.of({ data: 'mockData' }));

const _createUpliftDormantAccountStatus = jasmine.createSpy('create').and.returnValue(Observable.of({ data: ['a'] }));

describe('AccountService', () => {

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [AccountService, {
            provide: TermsService, useValue: termsServiceStub
         }, {
               provide: ApiService, useValue: {
                  GetAllTripBorderPosts: {
                     getAll: _getAllTripBorderList
                  },
                  TravelCardCurrencyPockets: {
                     getAll: _getTravelCurrencyPockets,
                     update: _updateTravelCurrencyPockets
                  },
                  GetAllTripCountries: {
                     getAll: _getAllTripCountries
                  },
                  loadNewTrip: {
                     create: _createLoadTrip
                  },
                  getAllTripsByCardNumber: {
                     getAll: _getAllTripsByCardNumber
                  },
                  DashboardAccounts: {
                     getAll: _DashboardAccounts
                  },
                  AccountTransactions: {
                     getAll: _AccountTransactions
                  },
                  GraphTransactions: {
                     getAll: _GraphTransactions
                  },
                  ScheduledTransfer: {
                     getAll: _ScheduledTransfer,
                     remove: removeScheduledTransfer
                  },
                  ScheduledMobileTrasactions: {
                     getAll: _ScheduledMobileTrasactions,
                     remove: removeSchedulesPrepaid
                  },
                  AccountStatementPreferences: {
                     getAll: _getAccountStatementPreferences
                  },
                  UpdateStatementPreferences: {
                     update: updateAccountStatementPreferences
                  },
                  StatementPreferencesStatus: {
                     create: statusSatementPreferences
                  },
                  PostalCodes: {
                     getAll: getPostalCodes
                  },
                  ScheduledPayment: {
                     getAll: _ScheduledPayment
                  },
                  ScheduledTransferDetail: {
                     getAll: _ScheduledTransferDetail,
                     update: _SaveTransaction
                  },
                  ScheduledPaymentDetail: {
                     getAll: _ScheduledPaymentDetail,
                     update: _SaveTransaction
                  },
                  ScheduledPrepaidDetail: {
                     getAll: _ScheduledMobileTrasactionDetail,
                     update: _SaveTransaction
                  },
                  PaymentAccounts: {
                     getAll: _Accounts
                  },
                  TransferAccounts: {
                     getAll: _Accounts
                  },
                  PrepaidAccounts: {
                     getAll: _Accounts
                  },
                  RemoveScheduledPaymentDetail: {
                     remove: removeScheduledPayment
                  },
                  AccountDebitOrders: {
                     getAll: _DebitOrders
                  },
                  AccountMandateOrders: {
                     getAll: _DebitOrdersMandates
                  },
                  DisputeanOrder: {
                     create: _saveDisputeOrder
                  },
                  StopDebitOrder: {
                     create: _saveStopOrder
                  },
                  CancelStopOrder: {
                     remove: _removeStoppedOrder
                  },
                  DebitOrderReasons: {
                     getAll: _debitOrderReasons
                  },
                  LinkableAccounts: {
                     getAll: _LinkableAccounts
                  },
                  linkAccounts: {
                     create: _LinkableAccountsCreate
                  },
                  refreshAccounts: {
                     getAll: _RefreshAccounts
                  },
                  ManageMandateOrders: {
                     create: manageMandateOrders
                  },
                  clientPreferences: {
                     create: jasmine.createSpy('create').and.returnValue(Observable.of('OK'))
                  },
                  ShareAccount: {
                     create: _ShareAccount
                  },
                  UniversalBranchCodes: {
                     getAll: _UniversalBranchCodes
                  },
                  UpliftDormantAccount: {
                     update: _UpliftAccountDormancy
                  },
                  UpliftDormantAccountStatus: {
                     create: _UpliftAccountDormancyStatus
                  },
                  LinkedHideShowAccounts: {
                     getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({ 'data': accountListEnable }))
                  },
                  UpdateEnableAccount: {
                     update: jasmine.createSpy('update').and.returnValue(Observable.of({ metadata }))
                  },
                  UnilateralLimitIndicatorDetails: {
                     getAll: _UnilateralLimitIndicatorDetails
                  },
                  UnilateralLimitIndicatorUpdate: {
                     update: _UnilateralLimitIndicatorUpdate
                  },
                  OutOfBandOtpStatus: {
                     create: _OutOfBandOtpStatus
                  },
                  AccountDetails: {
                     getAll: _AccountDetails
                  },
                  AccountBalanceDetails: {
                     getAll: _AccountBalanceDetails
                  },
                  TransactionDetails: {
                     getAll: _TransactionDetails
                  },
                  AccountOverdraftAttempts: {
                     getAll: _AccountOverdraftAttempts
                  },
                  AccountOverdraftLimit: {
                     create: _AccountOverdraftLimit
                  },
                  OverdraftValidations: {
                     getAll: _OverdraftValidations
                  },
                  RenameAccount: {
                     update: _SaveAccountName
                  },
                  SettlementDetails: {
                     getAll: _SettlementDetails
                  },
                  SettlementQuotes: {
                     create: _SettlementQuotes
                  },
                  LoanDebitOrders: {
                     getAll: _MfcLoanDetails,
                     update: _updateMfcLoanDetails
                  },
                  Banks: {
                     getAll: _getAllBanks
                  },
                  TermsAndConditionsItem: {
                     update: _updateTerms,
                     getAll: _getTerms
                  },
                  DocumentRequest: {
                     getAll: _getDocumentsList,
                     create: _sendPaidUpLetter
                  },
                  StatementDownload: {
                     getAll: _getStatementData
                  },
                  StartDateStatement: {
                     getAll: _getStatementDownload,
                     getBlob: _getStartDateStatement
                  },
                  IncomeTaxYears: {
                     getAll: _getIncomeTaxYears
                  },
                  CrossBorderRequest: {
                     create: _crossBorderRequest
                  },
                  HomeLoanStatus: {
                     getAll: _homeLoanStatus
                  },
                  FicaStatus: {
                     getAll: _FicaStatus
                  },
                  LinkedAccounts: {
                     getAll: _NoticeAccount
                  },
                  DeleteNotice: {
                     remove: _removeStoppedOrder
                  },
                  NowStatus: {
                     create: _UpliftAccountDormancyStatus
                  },
                  NoticeDetails: {
                     create: _createNotice,
                     getAll: _NoticeDetails
                  },
                  PartWithdrawalAmount: {
                     getAll: _PartWithdrawalAmount
                  },
                  EntryAmount: {
                     getAll: _getEntryAmount
                  },
                  AllProductsDetails: {
                     getAll: _getAllProducts
                  },
                  DepositDetails: {
                     getAll: _getInitialDeposit
                  },
                  Investor: {
                     getAll: _getInvestor
                  },
                  InterestRate: {
                     getAll: _getInterestRate
                  },
                  AcceptTermsAndConditionsForOpenNewAccount: {
                     getAll: _getTermsAndConditionsForOpenNewAccount,
                     update: _updateTermsForOpenNewAccount
                  }
               }
            }, DatePipe]
      });
   });

   it('should be created', inject([AccountService], (service: AccountService) => {
      expect(service).toBeTruthy();
   }));

   it('should be get accounts list', inject([AccountService], (service: AccountService) => {
      service.getDashboardAccounts().subscribe(response => {
         expect(response).toBeDefined();
         const container: IDashboardAccounts = response[0];
         expect(container.ContainerName).toBe(mockAccounts[0].ContainerName);
         expect(container.Accounts.length).toBe(mockAccounts[0].Accounts.length);
         if (container.Accounts.length) {
            const firstAccount = container.Accounts[0], firstMockAcc = mockAccounts[0].Accounts[0];
            expect(firstAccount.AccountName).toBe(firstMockAcc.AccountName);
            expect(firstAccount.AccountNumber).toBe(firstMockAcc.AccountNumber);
            expect(firstAccount.AccountType).toBe(firstMockAcc.AccountType);
            expect(firstAccount.AvailableBalance).toBe(firstMockAcc.AvailableBalance);
            expect(firstAccount.Balance).toBe(firstMockAcc.Balance);
            expect(firstAccount.AccountIcon).toBe(firstMockAcc.AccountIcon);
         }
         expect(_DashboardAccounts).toHaveBeenCalled();
      });
   }));

   it('should get account container title', inject([AccountService], (service: AccountService) => {
      const bankContainer = service.getAccountConfig('Bank');
      expect(bankContainer.title).toBe(Constants.labels.dashboardBankAccountTitle);
      expect(bankContainer.currentBalance).toBe(Constants.labels.currentBalance);
      expect(bankContainer.availableBalance).toBe(Constants.labels.availableBalance);
   }));
   it('should be get transaction list', inject([AccountService], (service: AccountService) => {
      service.getAccountTransactions(1).subscribe(response => {
         expect(response).toBeDefined();
         const transaction: ITransactionDetail = response[0];
         expect(transaction.TransactionId).toBe(mockTransactionList.data[0].TransactionId);
         expect(transaction.Description).toBe(mockTransactionList.data[0].Description);
         expect(transaction.Amount).toBe(mockTransactionList.data[0].Amount);
         expect(transaction.Debit).toBe(mockTransactionList.data[0].Debit);
         expect(transaction.Account).toBe(mockTransactionList.data[0].Account);
         expect(transaction.PostedDate).toBe(mockTransactionList.data[0].PostedDate);
         expect(transaction.CategoryId).toBe(mockTransactionList.data[0].CategoryId);
         expect(transaction.ChildTransactions).toBe(mockTransactionList.data[0].ChildTransactions);
         expect(transaction.OriginalCategoryId).toBe(mockTransactionList.data[0].OriginalCategoryId);
         expect(transaction.RunningBalance).toBe(mockTransactionList.data[0].RunningBalance);

         expect(_AccountTransactions).toHaveBeenCalled();
      });
   }));

   it('should be get accounts list', inject([AccountService], (service: AccountService) => {
      service.getDashboardAccounts().subscribe(response => {
         expect(response).toBeDefined();
         const container: IDashboardAccounts = response[0];
         expect(container.ContainerName).toBe(mockAccounts[0].ContainerName);
         expect(container.Accounts.length).toBe(mockAccounts[0].Accounts.length);
         if (container.Accounts.length) {
            const firstAccount = container.Accounts[0], firstMockAcc = mockAccounts[0].Accounts[0];
            expect(firstAccount.AccountName).toBe(firstMockAcc.AccountName);
            expect(firstAccount.AccountNumber).toBe(firstMockAcc.AccountNumber);
            expect(firstAccount.AccountType).toBe(firstMockAcc.AccountType);
            expect(firstAccount.AvailableBalance).toBe(firstMockAcc.AvailableBalance);
            expect(firstAccount.Balance).toBe(firstMockAcc.Balance);
            expect(firstAccount.AccountIcon).toBe(firstMockAcc.AccountIcon);
         }
         expect(_DashboardAccounts).toHaveBeenCalled();
      });
   }));

   it('should get account container title', inject([AccountService], (service: AccountService) => {
      const bankContainer = service.getAccountConfig('Bank');
      expect(bankContainer.title).toBe(Constants.labels.dashboardBankAccountTitle);
      expect(bankContainer.currentBalance).toBe(Constants.labels.currentBalance);
      expect(bankContainer.availableBalance).toBe(Constants.labels.availableBalance);
   }));
   it('should be get transaction list', inject([AccountService], (service: AccountService) => {
      service.getAccountTransactions(1).subscribe(response => {
         expect(response).toBeDefined();
         const transaction: ITransactionDetail = response[0];
         expect(transaction.TransactionId).toBe(mockTransactionList.data[0].TransactionId);
         expect(transaction.Description).toBe(mockTransactionList.data[0].Description);
         expect(transaction.Amount).toBe(mockTransactionList.data[0].Amount);
         expect(transaction.Debit).toBe(mockTransactionList.data[0].Debit);
         expect(transaction.Account).toBe(mockTransactionList.data[0].Account);
         expect(transaction.PostedDate).toBe(mockTransactionList.data[0].PostedDate);
         expect(transaction.CategoryId).toBe(mockTransactionList.data[0].CategoryId);
         expect(transaction.ChildTransactions).toBe(mockTransactionList.data[0].ChildTransactions);
         expect(transaction.OriginalCategoryId).toBe(mockTransactionList.data[0].OriginalCategoryId);
         expect(transaction.RunningBalance).toBe(mockTransactionList.data[0].RunningBalance);

         expect(_AccountTransactions).toHaveBeenCalled();
      });
   }));

   it('should return true if it hasTransactions from IS', inject([AccountService], (service: AccountService) => {
      expect(service.hasTransactionsAndDetailsForIS('CA')).toBe(true);
      expect(service.hasTransactionsAndDetailsForIS('IS')).toBe(true);
      expect(service.hasTransactionsAndDetailsForIS('NC')).toBe(false);
   }));

   it('should be able to get graph transaction list', inject([AccountService], (service: AccountService) => {
      service.getGraphTransactions(1, 'CA').subscribe(response => {
         expect(response).toBeDefined();
      });

      service.getGraphTransactions(1, 'INV').subscribe(response => {
         expect(response).toBeDefined();
      });

      service.getGraphTransactions(1, 'NC').subscribe(response => {
         expect(response).toBeDefined();
      });

      service.getGraphTransactions(1, 'IS').subscribe(response => {
         expect(response).toBeDefined();
      });

      service.getGraphTransactions(1, 'HL').subscribe(response => {
         expect(response).toBeDefined();
      });

      service.getGraphTransactions(1, 'TD').subscribe(response => {
         expect(response).toBeDefined();
      });

      service.getGraphTransactions(1, 'DS').subscribe(response => {
         expect(response).toBeDefined();
      });

      service.getGraphTransactions(90000123463, 'Rewards').subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should be get al the schedule transfers', inject([AccountService], (service: AccountService) => {
      const urlParam = {
         transactiontype: 'scheduled',
         page: 1,
         pagesize: 10,
         fromItemAccountID: this.accountNumber
      };
      service.getScheduledTransfer(urlParam).subscribe(response => {
         expect(response).toBeDefined();
         const transaction: IScheduledTransaction = response[0];
         expect(transaction.batchID).toBe(mockScheduleTransactions[0].batchID);
         expect(transaction.myDescription).toBe(mockScheduleTransactions[0].myDescription);
         expect(transaction.amount).toBe(mockScheduleTransactions[0].amount);
         expect(transaction.toAccount).toBe(mockScheduleTransactions[0].toAccount);
         expect(transaction.fromAccount).toBe(mockScheduleTransactions[0].fromAccount);
         expect(transaction.bFName).toBe(mockScheduleTransactions[0].bFName);
         expect(transaction.nextTransDate).toBe(mockScheduleTransactions[0].nextTransDate);
         expect(_ScheduledTransfer).toHaveBeenCalled();
      });
   }));

   it('should be get al the schedule prepaid transactions', inject([AccountService], (service: AccountService) => {
      const urlParam = {
         transactiontype: 'scheduled',
         page: 1,
         pagesize: 10,
         fromItemAccountID: this.accountNumber
      };
      service.getScheduledMobileTrasactions(urlParam).subscribe(response => {
         expect(response).toBeDefined();
         const transaction: IScheduledTransaction = response[0];
         expect(transaction.batchID).toBe(mockScheduleTransactions[0].batchID);
         expect(transaction.myDescription).toBe(mockScheduleTransactions[0].myDescription);
         expect(transaction.amount).toBe(mockScheduleTransactions[0].amount);
         expect(transaction.toAccount).toBe(mockScheduleTransactions[0].toAccount);
         expect(transaction.fromAccount).toBe(mockScheduleTransactions[0].fromAccount);
         expect(transaction.bFName).toBe(mockScheduleTransactions[0].bFName);
         expect(transaction.nextTransDate).toBe(mockScheduleTransactions[0].nextTransDate);
         expect(_ScheduledMobileTrasactions).toHaveBeenCalled();
      });
   }));

   it('should be get al the schedule payment', inject([AccountService], (service: AccountService) => {
      const urlParam = {
         transactiontype: 'scheduled',
         page: 1,
         pagesize: 10,
         fromItemAccountID: this.accountNumber
      };
      service.getScheduledPayment(urlParam).subscribe(response => {
         expect(response).toBeDefined();
         const transaction: IScheduledTransaction = response[0];
         expect(transaction.batchID).toBe(mockScheduleTransactions[0].batchID);
         expect(transaction.myDescription).toBe(mockScheduleTransactions[0].myDescription);
         expect(transaction.amount).toBe(mockScheduleTransactions[0].amount);
         expect(transaction.toAccount).toBe(mockScheduleTransactions[0].toAccount);
         expect(transaction.fromAccount).toBe(mockScheduleTransactions[0].fromAccount);
         expect(transaction.bFName).toBe(mockScheduleTransactions[0].bFName);
         expect(transaction.nextTransDate).toBe(mockScheduleTransactions[0].nextTransDate);
         expect(_ScheduledPayment).toHaveBeenCalled();
      });
   }));

   it('should be get the selected account', inject([AccountService], (service: AccountService) => {
      const response = service.getAccountData();
      expect(response).toBeUndefined();

   }));

   it('should be set the current account', inject([AccountService], (service: AccountService) => {
      service.setAccountData({ itemAccountId: 10, accountNumber: 10002010012 });
      const result = service.getAccountData();
      expect(result['itemAccountId']).toBe(10);
      expect(result['accountNumber']).toBe(10002010012);
   }));

   it('should be remove schedule transaction detail for transaction id for prepaid',
      inject([AccountService], (service: AccountService) => {
         const transactionID = 29117114;
         const recInstrID = { recInstrID: 1 };
         service.removeScheduledPrepaidDetail(transactionID, recInstrID).subscribe(response => {
            expect(removeSchedulesPrepaid).toHaveBeenCalled();
         });
      }));

   it('should be get account statement preferences details ', inject([AccountService], (service: AccountService) => {
      service.getAccountStatementPreferences('111').subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(mockGetAccountStatementPreferences);
      });
   }));
   it('should be update account statement preferences details', inject([AccountService], (service: AccountService) => {
      service.updateAccountStatementPreferences(mockStatementPreferencesDetails).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(metadata);
      });
   }));
   it('should return account status statement delivery preferences', inject([AccountService], (service: AccountService) => {
      service.statusStatementPreferences('1234').subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(mockGetAccountStatementPreferences);
      });
   }));
   it('should return postal codes for statement delivery preferences', inject([AccountService], (service: AccountService) => {
      service.getPostalCodes('STREET', 'riv').subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(mockPostalCode.data);
      });
   }));
   it('should be remove schedule transaction detail for transaction id for payment',
      inject([AccountService], (service: AccountService) => {
         const transactionID = 29117114;
         const recInstrID = { recInstrID: 1 };
         service.removeScheduledPaymentDetail(transactionID, recInstrID).subscribe(response => {
            expect(removeScheduledPayment).toHaveBeenCalled();
         });

      }));

   it('should be remove schedule transaction detail for transaction id for transfer',
      inject([AccountService], (service: AccountService) => {
         const transactionID = 29117114;
         const recInstrID = { recInstrID: 1 };
         service.removeScheduledTransferDetail(transactionID, recInstrID).subscribe(response => {
            expect(removeScheduledTransfer).toHaveBeenCalled();
         });
      }));

   it('should be get payment transaction detail', inject([AccountService], (service: AccountService) => {
      service.getScheduledPaymentDetail(12345).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(mockScheduleTransactions[0]);
         expect(_ScheduledPaymentDetail).toHaveBeenCalled();
      });
   }));

   it('should be get prepaid transaction detail', inject([AccountService], (service: AccountService) => {
      service.getScheduledPrepaidDetail(12345).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(mockScheduleTransactions[0]);
         expect(_ScheduledMobileTrasactionDetail).toHaveBeenCalled();
      });
   }));

   it('should be get transafer transaction detail', inject([AccountService], (service: AccountService) => {
      service.getScheduledTransferDetail(12345).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(mockScheduleTransactions[0]);
         expect(_ScheduledTransferDetail).toHaveBeenCalled();
      });
   }));

   it('should be save payment transaction detail', inject([AccountService], (service: AccountService) => {
      service.saveScheduledPaymentDetail(mockScheduleTransactions[0]).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(metadata);
         expect(_SaveTransaction).toHaveBeenCalled();
      });
   }));

   it('should be save prepaid transaction detail', inject([AccountService], (service: AccountService) => {
      service.saveScheduledPrepaidDetail(mockScheduleTransactions[0]).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(metadata);
         expect(_SaveTransaction).toHaveBeenCalled();
      });
   }));

   it('should be save transfer transaction detail', inject([AccountService], (service: AccountService) => {
      service.saveScheduledTransferDetail(mockScheduleTransactions[0]).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(metadata);
         expect(_SaveTransaction).toHaveBeenCalled();
      });
   }));

   it('should return transaction status', inject([AccountService], (service: AccountService) => {
      expect(service.isTransactionStatusValid(metadata)).toBe(true);
   }));

   it('should get payment accounts', inject([AccountService], (service: AccountService) => {
      service.getPaymentAccounts().subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toEqual([]);
         expect(_Accounts).toHaveBeenCalled();
      });
   }));

   it('should call fica status', inject([AccountService], (service: AccountService) => {
      service.getficaStatus().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should return minimum entry amount ', inject([AccountService], (service: AccountService) => {
      service.getPartWithdrawalAmount(100).subscribe(response => {
         expect(_PartWithdrawalAmount).toHaveBeenCalled();
      });
   }));

   it('should return account balance details forn NOW', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getBalanceDetails(itemAccountId).subscribe(response => {
         expect(response).toBeDefined();
         expect(_AccountBalanceDetails).toHaveBeenCalled();
      });
   }));

   it('should return account notices for NOW', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getNotice(itemAccountId).subscribe(response => {
         expect(response).toBeDefined();
         expect(_NoticeDetails).toHaveBeenCalled();
      });
   }));

   it('should call deleteNotice for creted notice in NOW', inject([AccountService], (service: AccountService) => {
      const noticeId = 'NOW1234';
      service.deleteNotice(noticeId).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get accounts for view notices ', inject([AccountService], (service: AccountService) => {
      service.getAccountsForNotice().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get transfer accounts', inject([AccountService], (service: AccountService) => {
      service.getTransferAccounts().subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toEqual([]);
         expect(_Accounts).toHaveBeenCalled();
      });
   }));

   it('should get prepaid accounts', inject([AccountService], (service: AccountService) => {
      service.getPrepaidAccounts().subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toEqual([]);
         expect(_Accounts).toHaveBeenCalled();
      });
   }));

   it('should save and get success state', inject([AccountService], (service: AccountService) => {
      service.saveSuccessState(mockScheduleTransactions[0]);
      const successState = service.getSuccessState();
      expect(successState.isSuccess).toBe(true);
   }));

   it('should reset success state', inject([AccountService], (service: AccountService) => {
      service.resetSuccessState();
      const successState = service.getSuccessState();
      expect(successState).toBe(null);
   }));
   it('should get all the debit orders and mandates',
      inject([AccountService], (service: AccountService) => {
         service.getDebitOrders(2).subscribe(response => {
            expect(response).toBeDefined();
            const debitOrders: IDebitOrdersDetail = response[0];
            expect(debitOrders[0].accountDebited).toBe(mockdebitOrders[0].accountDebited);
            expect(debitOrders[0].statementLineNumber).toBe(mockdebitOrders[0].statementLineNumber);
            expect(_DebitOrders).toHaveBeenCalled();
            const mandate: IMandateOrdersDetail = response[1];
            expect(mandate[0].MandateStatus).toBe(mockMandateList[0].MandateStatus);
            expect(mandate[0].DebtorAccountNumber).toBe(mockMandateList[0].DebtorAccountNumber);
            expect(_DebitOrdersMandates).toHaveBeenCalled();
         });
      }));
   it('should save a Dispute on debit order',
      inject([AccountService], (service: AccountService) => {
         const orderInfo: IDisputeOrderPost = {
            transactionReference: mockdebitOrders[0].creditorName,
            installmentAmount: mockdebitOrders[0].installmentAmount,
            lastDebitDate: mockdebitOrders[0].lastDebitDate,
            reason: '10',
            description: '',
            subTranCode: mockdebitOrders[0].subTranCode
         };
         service.disputeAnOrder(mockdebitOrders[0].itemAccountId, orderInfo).subscribe(response => {
            expect(response).toBeDefined();
            expect(response).toBe(true);
         });
      }));

   it('should save a stop on debit order',
      inject([AccountService], (service: AccountService) => {
         disputeMetadata.metadata.resultData[0].resultDetail[0].operationReference = 'AddStopPayments';
         const orderInfo: IStopOrderPost[] = [{
            lastDebitDate: mockdebitOrders[0].lastDebitDate,
            tranCode: mockdebitOrders[0].tranCode,
            installmentAmount: mockdebitOrders[0].installmentAmount,
            creditorName: mockdebitOrders[0].creditorName,
            statementNumber: mockdebitOrders[0].statementNumber,
            statementLineNumber: mockdebitOrders[0].statementLineNumber,
            statementDate: mockdebitOrders[0].statementDate,
            reasonCode: '11',
            contractReferenceNr: mockdebitOrders[0].contractReferenceNr,
            chargeAmount: mockdebitOrders[0].chargeAmount,
            subTranCode: mockdebitOrders[0].subTranCode
         }];
         service.stopDebitOrder(mockdebitOrders[0].itemAccountId, orderInfo).subscribe(response => {
            expect(response).toBeDefined();
            expect(response).toBe(true);
         });
      }));
   it('should cancel a stop on debit order',
      inject([AccountService], (service: AccountService) => {
         disputeMetadata.metadata.resultData[0].resultDetail[0].operationReference = 'DeleteStoppedPayments';
         const orderInfo: ICancelStopOrderPost = {
            installmentAmount: mockdebitOrders[0].installmentAmount,
            tranCode: mockdebitOrders[0].tranCode,
            lastDebitDate: mockdebitOrders[0].stoppedDate,
            sequenceNumber: mockdebitOrders[0].sequenceNumber
         };
         service.cancelStopDebitOrder(mockdebitOrders[0].itemAccountId, orderInfo).subscribe(response => {
            expect(response).toBeDefined();
            expect(response).toBe(true);
         });
      }));
   it('should get reasons on debit order stop or reverse',
      inject([AccountService], (service: AccountService) => {
         service.getDebitOrderReasons('disputedebitorderreasons').subscribe(response => {
            expect(response).toBeDefined();
            expect(response).toBe(mockReasons.data);
         });
      }));
   it('should return linkable accounts', inject([AccountService], (service: AccountService) => {
      service.getLinkableAccounts().subscribe(response => {
         expect(response[0].AccountNumber).toBe('8002684602501');
         expect(response[0].AccountType).toBe('HL');
      });
   }));

   it('should link accounts', inject([AccountService], (service: AccountService) => {
      service.linkAccounts(mockLinkableAccounts).subscribe((response) => {
         expect(response).toBe(mockLinkAccountsResponse);
      });
   }));

   it('should refresh accounts', inject([AccountService], (service: AccountService) => {
      service.refreshAccounts().subscribe((response) => {
         expect(response).toBe(mockRefreshAccountsApiResponse);
      });
   }));

   it('should accept/decline mandate', inject([AccountService], (service: AccountService) => {
      service.AcceptMandateOrder({ autenticationStatusInd: Constants.MandateOrders.AcceptanceCode },
         { mandateId: 1 }).subscribe(response => {
            expect(manageMandateOrders).toHaveBeenCalled();
         });
      service.DeclineMandateOrder({ autenticationStatusInd: Constants.MandateOrders.RejectionCode },
         { mandateId: 2 }).subscribe(response => {
            expect(manageMandateOrders).toHaveBeenCalled();
         });
   }));

   it('should validate accept/decline mandate response', inject([AccountService], (service: AccountService) => {
      expect(service.isMandateSuccess(mandateMetadata.MetaData)).toBeTruthy();
   }));
   it('should set default account', inject([AccountService], (service: AccountService) => {
      service.setDefaultAccount([{ PreferenceKey: 'DefaultAccount', PreferenceValue: '2' }])
         .subscribe(response => {
            expect(response).toEqual('OK');
         });
   }));
   it('should share account details to recipients', inject([AccountService], (service: AccountService) => {
      const shareAccountReq: IShareAccountReq = {
         channel: 'Email',
         sharedAccountDetails: mockSharedAccounts,
         sharedRecipientDetails: mockSharedRecipients,
         sharedCustomerDetails: mockSharedCustomers,
      };
      service.shareAccount(shareAccountReq).subscribe((response) => {
         expect(response).toBe(mockShareAccountSuccessResponse);
      });
   }));
   it('should return universal branch codes', inject([AccountService], (service: AccountService) => {
      service.getUniversalBranchCodes().subscribe((response) => {
         expect(response).toBe(mockUniversalBranchCodes);
      });
   }));

   it('should return account details', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getAccountDetails(itemAccountId).subscribe(response => {
         expect(response).toBeDefined();
         expect(_AccountDetails).toHaveBeenCalled();
      });
   }));

   it('should return account balance details', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getAccountBalanceDetail(itemAccountId).subscribe(response => {
         expect(response).toBeDefined();
         expect(_AccountBalanceDetails).toHaveBeenCalled();
      });
   }));
   it('should call uplift dormancy API', inject([AccountService], (service: AccountService) => {
      const dormancyRequest = {
         secureTransaction: {
            verificationStatusEnum: 'APPROVED',
            verificationReferenceId: 0,
            customId: ''
         }
      };

      service.upliftAccountDormancy(1, dormancyRequest).subscribe((response) => {
         expect(_UpliftAccountDormancy).toHaveBeenCalled();
      });
   }));

   it('should call uplift dormancy status  API', inject([AccountService], (service: AccountService) => {
      service.upliftAccountDormancyStatus('7890').subscribe((response) => {
         expect(_UpliftAccountDormancyStatus).toHaveBeenCalled();
      });
   }));

   it('should call getApproveItStatusNow  API', inject([AccountService], (service: AccountService) => {
      service.getApproveItStatusNow().subscribe((response) => {
         service.updateTransactionID('1234');
         expect(_UpliftAccountDormancyStatus).toBeDefined();
      });
   }));

   it('should get hideandshow account', inject([AccountService], (service: AccountService) => {
      service.getHideShowAccounts()
         .subscribe(response => {
            expect(response).toBeDefined();
         });
   }));
   it('should get update enabled account', inject([AccountService], (service: AccountService) => {
      service.updateAccountEnable(accountListEnable, 'HIDDEN')
         .subscribe(response => {
            expect(response).toBeDefined();
         });
   }));

   it('should return unilateral limit indicator details', inject([AccountService], (service: AccountService) => {
      service.getUnilateralLimitIndicator().subscribe(response => {
         expect(response).toBe(mockUnilateralLimitIndicatorAPIResp);
      });
   }));

   it('should update unilateral limit indicator', inject([AccountService], (service: AccountService) => {
      const unilateralLimitIndicator = true;
      const unilateralIndicatorToAll = false;
      const plasticId = 1;
      service.updateUnilateralLimitIndicator(unilateralIndicatorToAll, unilateralLimitIndicator, plasticId).subscribe(response => {
         expect(response).toBeDefined(mockUnilateralLimitIndicatorUpdateAPIResp);
      });
   }));

   it('should update unilateral limit indicator of master toggle', inject([AccountService], (service: AccountService) => {
      const unilateralLimitIndicator = false;
      const unilateralIndicatorToAll = true;
      service.updateUnilateralMasterToggleIndicator(unilateralIndicatorToAll, unilateralLimitIndicator).subscribe(response => {
         expect(response).toBeDefined(mockUnilateralLimitIndicatorUpdateAPIResp);
      });
   }));

   it('should return approve it OTP status', inject([AccountService], (service: AccountService) => {
      const tvsCode = 'TVCCODE';
      const referenceId = '213';
      service.getApproveItOtpStatus(tvsCode, referenceId).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should return account details', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getAccountDetails(itemAccountId).subscribe(response => {
         expect(response).toBeDefined();
         expect(_AccountDetails).toHaveBeenCalled();
      });
   }));

   it('should return account balance details', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getAccountBalanceDetail(itemAccountId).subscribe(response => {
         expect(response).toBeDefined();
         expect(_AccountBalanceDetails).toHaveBeenCalled();
      });
   }));

   it('should be overdraft account', inject([AccountService], (service: AccountService) => {
      const overdraftLimit = 100;
      service.setAccountData(selectedAccount);
      const response = service.getAccountData();
      expect(service.isOverDraftAccount(overdraftLimit)).toBe(true);
   }));

   it('should not be overdraft account', inject([AccountService], (service: AccountService) => {
      const overdraftLimit = 0;
      service.setAccountData({ IsAlternateAccount: true });
      const response = service.getAccountData();
      expect(service.isOverDraftAccount(overdraftLimit)).not.toBe(true);
   }));

   it('should be able to get transaction details for selected transaction', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      const transactionId = 'CPS|Item1|6096fdd3-e2ce-56bd-9772-d3f5d9d19b98';
      service.getTransactionDetails(itemAccountId, transactionId).subscribe(response => {
         expect(_TransactionDetails).toHaveBeenCalled();
      });
   }));

   it('should return overdraft attempts', inject([AccountService], (services: AccountService) => {
      const accountId = 1;
      services.getAccountOverdraftAttempts(accountId).subscribe(response => {
         expect(response).toBeDefined();
         expect(_AccountOverdraftAttempts).toHaveBeenCalled();
      });
   }));

   it('should change or cancel overdarft', inject([AccountService], (services: AccountService) => {
      const accountId = 1;
      services.changeAccountOverdraftLimit(mockChangeOverdraftLimitRequest).subscribe(response => {
         expect(_AccountOverdraftLimit).toHaveBeenCalled();
      });
   }));

   it('should get validations for overdraft', inject([AccountService], (services: AccountService) => {
      const query = { 'validationType': 'Overdraft' };
      services.getOverdraftValidations(query).subscribe(response => {
         expect(response).toBe(mockOverdraftValidations);
      });
   }));
   it('should be save account name', inject([AccountService], (service: AccountService) => {
      const ItemAccountId = '1';
      service.saveAccountName(mockRenameDetail, ItemAccountId).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(renameResultData);
         expect(_SaveAccountName).toHaveBeenCalled();
      });
   }));

   it('should get account number', inject([AccountService], (service: AccountService) => {
      expect(service.getAccountNumber(1234567)).toBeTruthy();
   }));

   it('should return settlement details', inject([AccountService], (service: AccountService) => {
      service.getSettlementDetails('1').subscribe((response) => {
         expect(response).toBe(mockSettlementDetailsAPIResponse);
      });
   }));

   it('should send settlement quote to recipient', inject([AccountService], (service: AccountService) => {
      const mockSettlementQuote: ISettlementQuote = {
         itemAccountId: '1',
         emailId: 'bob@bob.com'
      };
      service.sendSettlementQuote(mockSettlementQuote).subscribe((response) => {
         expect(response).toBe(mockSettlementQuoteAPISuccessResponse);
      });

      service.sendSettlementQuote(mockSettlementQuote, 'IS').subscribe(response => {
         expect(response.data.settlementAmt).toBe(100.00);
      });
   }));

   it('should be set settlement data', inject([AccountService], (service: AccountService) => {
      service.setSettlementData(mockSettlementDetails);
      const settlementData = service.getSettlementData();
      expect(settlementData.settlementAmt).toBe(100.00);
   }));

   it('should return true if account is primary', inject([AccountService], (service: AccountService) => {
      service.setAccountData({ IsAlternateAccount: false });
      expect(service.isPrimaryAccount()).toBe(true);
   }));

   it('should return false if account is alternate', inject([AccountService], (service: AccountService) => {
      service.setAccountData({ IsAlternateAccount: true });
      expect(service.isPrimaryAccount()).toBe(false);
   }));
   it('should return mfc debit order details', inject([AccountService], (service: AccountService) => {
      service.getLoanDebitOrders(13, 'DealInfoEnq').subscribe(response => {
         expect(response).toBeDefined();
         expect(_MfcLoanDetails).toHaveBeenCalled();
      });
   }));
   it('should update mfc debit order details', inject([AccountService], (service: AccountService) => {
      service.updateMfcDebitOrders('12', mockManagePaymentDetailsPost).subscribe(response => {
         expect(response).toBeDefined();
         expect(_updateMfcLoanDetails).toHaveBeenCalled();
      });
   }));
   it('should return bank details', inject([AccountService], (service: AccountService) => {
      service.getBanks().subscribe(response => {
         const banks = response[0];
         expect(banks.bankName).toEqual(mockBankData.bankName);
      });
      expect(_getAllBanks).toHaveBeenCalled();
   }));
   it('should return terms details', inject([AccountService], (service: AccountService) => {
      service.getTermsAndConditionsForMFC('latest').subscribe(response => {
         expect(_getTerms).toHaveBeenCalled();
      });

   }));

   it('should return document list', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getDocumentsList(itemAccountId).subscribe(response => {
         expect(_getDocumentsList).toHaveBeenCalled();
      });
   }));

   it('should show message in statement and document', inject([AccountService], (service: AccountService) => {
      const message = {
         showAlert: true,
         displayMessageText: '',
         action: 2,
         alertType: 2
      };
      service.currentAlertMessage.subscribe((value) => {
         expect(value.alertType).toBe(2);
      });
      service.showAlertMessage(message);
   }));

   it('should send document request', inject([AccountService], (service: AccountService) => {
      const request = {
         documentType: 'settlementLetter',
         itemAccountId: '1',
         emailId: 'abc@nedbank.co.za'
      };
      service.sendPaidUpLetter(request).subscribe(response => {
         expect(_sendPaidUpLetter).toHaveBeenCalled();
      });
   }));

   it('should return search transactions details', inject([AccountService], (service: AccountService) => {
      service.getAdvancedSearchData(1, new Date(), new Date()).subscribe(response => {
         const transaction: ITransactionDetail = response[0];
         expect(response).toBeDefined();
         expect(transaction.TransactionId).toBe(mockTransactionList.data[0].TransactionId);
      });
      expect(_AccountTransactions).toHaveBeenCalled();
   }));
   it('should be search transaction details', inject([AccountService], (service: AccountService) => {
      service.transactionSearchMode(true);
      const value = service.transactionSearchMode(true);
      expect(service.transactionSearchModeEmitter.emit()).toBe(value);
   }));
   it('set mfc update post data', inject([AccountService], (service: AccountService) => {
      service.setMfcUpdatePostData(mockManagePaymentDetailsPost);
      const value = service.getMfcUpdatePostData();
      expect(value).toBe(mockManagePaymentDetailsPost);
   }));
   it('should call to get statement download', inject([AccountService], (service: AccountService) => {
      service.getStatementDownload('2018-09-19T22:00:00.000Z', '2018-09-25T22:00:00.000Z', '1338054201').subscribe(response => {
         expect(response).toBeDefined();
      });
   }));
   it('should call to get start date statement', inject([AccountService], (service: AccountService) => {
      const documentUrl = `ENCRYPTED_mainKey_%2FmNn4qW2GIg4nS4m4tH2QA%3D%3D_AsYWypnvwIgZ0n10FeDtw5HVNnCxhJXrJPkL
      ewFlJR301%2BFcxq8Ct5PGfyg1iWov4VkayHZOUxvSAiQy6PG7aJMHlSqTsiQPZkbIuFQmEpjIVXD89kh0gNBfbe%2FB9N8Pm8J
      ciWm2HE5FMdSn9jqCUSH4MUCL7U4j6PQVsQOZCNs%2BTDM3%2BNtlKcfbHZ8fnTASlB1rW348aUJn7MfQP497MRsnUqo4NlmgT%
      2BFJbTkhylnmmTN5aPg7IA52rAJ%2B2JRJ`;
      service.getStartDateStatement(documentUrl).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));
   it('should call to get income tax years', inject([AccountService], (service: AccountService) => {
      const yearEnd = new Date().getFullYear();
      const yesrStart = yearEnd - 5;
      service.getIncomeTaxYears(yesrStart, yearEnd, '1338054201').subscribe(response => {
         expect(response).toBeDefined();
      });
   }));
   it('set corss border rerquest', inject([AccountService], (service: AccountService) => {
      service.setMfcCrossBorderRequest(mockCrossBorderRequest);
      expect(service.getMfcCrossBorderRequest()).toBe(mockCrossBorderRequest);
   }));
   it('should accept terms and conditions details for mfc update', inject([AccountService], (service: AccountService) => {
      expect(service.acceptTermsAndConditions(mockTermsConditions.data).subscribe((response) => {
         expect(response.metadata).toBeDefined();
      }));
      expect(_updateTerms).toHaveBeenCalled();
   }));

   it('should be get home loan status', inject([AccountService], (service: AccountService) => {
      service.getHomeLoanStatus(1).subscribe(response => {
         expect(response).toBe(mockHomeLoanStatusDetails);
      });
   }));
   it('should load trip', inject([AccountService], (service: AccountService) => {
      spyOn(service.loadTripStatusEmitter, 'emit');
      service.loadTrip('post data', 1234).subscribe(resp => {
         expect(resp).toEqual({ tripdata: 'fakedata' });
      });
      expect(service.loadTripStatusEmitter.emit).toBeTruthy();
   }));

   it('should get all trips by cardnumber', inject([AccountService], (service: AccountService) => {
      service.getAllTrips(1234).subscribe(resp => {
         expect(resp.toBeDefined);
         expect(resp.validTripLoaded).toBeTruthy();
      });
   }));
   it('should get trip country list', inject([AccountService], (service: AccountService) => {
      service.getTripCountryList().subscribe(resp => {
         expect(resp).toEqual({ tripCountries: 'fakeData' });
      });
   }));

   it('should get trip border list', inject([AccountService], (service: AccountService) => {
      service.getTripBorderPostList().subscribe(resp => {
         expect(resp).toEqual({ tripBorder: 'fakeData' });
      });
   }));

   it('should get pockets', inject([AccountService], (service: AccountService) => {
      service.getPockets(1234).subscribe(response => {
         expect(response.data).toEqual('mockTravelcurrencyPockets');
      });
   }));

   it('should change pocket priority', inject([AccountService], (service: AccountService) => {
      const mockPrioritydata = [{
         currency: {
            currency: 'USD',
            amount: 1000
         },
         priority: 1
      }];
      service.changePocketPriority(1234, mockPrioritydata).subscribe(response => {
         expect(response.data).toEqual('mockData');
      });
   }));

   it('should notify accounts update', inject([AccountService], (service: AccountService) => {
      service.notifyAccountsUpdate();
      service.accountsRefreshObservable.subscribe(response => {
         expect(response).toBeTruthy();
      });
   }));

   it('should set and get Dashboard account data', inject([AccountService], (service: AccountService) => {
      const mockdashboards: IDashboardAccounts[] = [{
         ContainerName: 'ContainerName',
         Accounts: [{
            AccountName: 'AccountName',
            Balance: 1000,
            AvailableBalance: 1000,
            AccountNumber: 1234,
            AccountType: 'AccountType',
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
            isEditInProcess: false,
            IsProfileAccount: true,
            ProductType: 'ProductType',
            settlementAmt: 100,
            // Pockets?: any[];
            // FirstAvailableWithdrawalDate?: Date;
            MaintainOptions: {
               PlaceNotice: 'PlaceNotice',
               DeleteNotice: 'DeleteNotice'
            }
         }],
         ContainerIcon: 'ContainerIcon',
         Assets: 2
      }];
      service.setDashboardAccountsData(mockdashboards);
      const dashboardAccounts: IDashboardAccounts[] = service.getDashboardAccountsData();
      expect(dashboardAccounts[0].ContainerName).toEqual(mockdashboards[0].ContainerName);
      expect(dashboardAccounts[0].Accounts[0].AccountName).toEqual(mockdashboards[0].Accounts[0].AccountName);
   }));

   it('should reset dashboard accounts data', inject([AccountService], (service: AccountService) => {
      service.resetDashboardAccountsData();
      const dashboards = service.getDashboardAccountsData();
      expect(dashboards).toBeNull();
   }));

   it('should get approve status', inject([AccountService], (service: AccountService) => {
      const status = service.getApproveItStatus('transactionID').subscribe(response => {
         expect(response.metadata.resultData[0].resultDetail[0].operationReference).toEqual('SUCCESS');
      });
   }));
});

describe('AccountService for No Content', () => {
   const NoContentResponse = jasmine.createSpy('getAll').and.returnValue(Observable.of(null));
   const NoContentResponseUpdate = jasmine.createSpy('update').and.returnValue(Observable.of(null));
   const NoContentResponseCreate = jasmine.createSpy('create').and.returnValue(Observable.of(mockNoStatus));
   const NoStatusResponseCreate = jasmine.createSpy('create').and.returnValue(Observable.of(null));
   const NoContentResponseTransactionListing = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockNoResponseTransactionList));
   const NoContentTransactionDetails = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockISTransactionDetailsFailure));
   const NoContentResponseLoanDO = jasmine.createSpy('getAll').and.returnValue(Observable.of(failureLoanDebitOrder));
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [AccountService, {
            provide: TermsService, useValue: termsServiceStub
         }, {
               provide: ApiService, useValue: {
                  DashboardAccounts: {
                     getAll: NoContentResponse
                  },
                  AccountTransactions: {
                     getAll: NoContentResponseTransactionListing
                  },
                  GraphTransactions: {
                     getAll: NoContentResponseTransactionListing
                  },
                  ScheduledTransfer: {
                     getAll: NoContentResponse
                  },
                  ScheduledMobileTrasactions: {
                     getAll: NoContentResponse
                  },
                  AccountStatementPreferences: {
                     getAll: NoContentResponse
                  },
                  UpdateStatementPreferences: {
                     update: NoContentResponseUpdate
                  },
                  StatementPreferencesStatus: {
                     create: NoStatusResponseCreate
                  },
                  PostalCodes: {
                     getAll: NoContentResponse
                  },
                  ScheduledPayment: {
                     getAll: NoContentResponse
                  },
                  ScheduledTransferDetail: {
                     getAll: NoContentResponse
                  },
                  ScheduledPaymentDetail: {
                     getAll: NoContentResponse
                  },
                  ScheduledPrepaidDetail: {
                     getAll: NoContentResponse
                  },
                  PaymentAccounts: {
                     getAll: NoContentResponse
                  },
                  TransferAccounts: {
                     getAll: NoContentResponse
                  },
                  PrepaidAccounts: {
                     getAll: NoContentResponse
                  },
                  AccountDebitOrders: {
                     getAll: NoContentResponse
                  },
                  AccountMandateOrders: {
                     getAll: NoContentResponse
                  },
                  LinkableAccounts: {
                     getAll: NoContentResponse
                  },
                  refreshAccounts: {
                     getAll: NoContentResponse
                  },
                  ShareAccount: {
                     create: NoContentResponse
                  },
                  UniversalBranchCodes: {
                     getAll: NoContentResponse
                  },
                  UnilateralLimitIndicatorUpdate: {
                     update: NoContentResponse
                  },
                  OutOfBandOtpStatus: {
                     create: NoContentResponse
                  },
                  AccountBalanceDetails: {
                     getAll: NoContentResponse
                  },
                  AccountDetails: {
                     getAll: NoContentResponse
                  },
                  TransactionDetails: {
                     getAll: NoContentTransactionDetails
                  },
                  SettlementDetails: {
                     getAll: NoContentResponse
                  },
                  SettlementQuotes: {
                     create: NoContentResponse
                  },
                  OverdraftValidations: {
                     getAll: _OverdraftValidations
                  },
                  LoanDebitOrders: {
                     getAll: NoContentResponseLoanDO,
                     update: NoContentResponse
                  },
                  DisputeanOrder: {
                     create: NoContentResponseCreate
                  },
                  StopDebitOrder: {
                     create: NoContentResponseCreate
                  },
                  CancelStopOrder: {
                     remove: NoContentResponseCreate
                  },
                  DebitOrderReasons: {
                     getAll: NoContentResponse
                  },
                  Banks: {
                     getAll: NoContentResponse
                  },
                  TermsAndConditionsItem: {
                     update: NoContentResponse,
                     getAll: NoContentResponse
                  },
                  CrossBorderRequest: {
                     create: NoContentResponse
                  },
                  HomeLoanStatus: {
                     getAll: NoContentResponse
                  },
                  FicaStatus: {
                     getAll: NoContentResponse
                  },
                  LinkedAccounts: {
                     getAll: NoContentResponse
                  },
                  DeleteNotice: {
                     remove: NoContentResponseCreate
                  },
                  NoticeDetails: {
                     create: NoContentResponseCreate,
                     getAll: NoContentResponse
                  },
                  PartWithdrawalAmount: {
                     getAll: NoContentResponse
                  },
                  EntryAmount: {
                     getAll: NoContentResponse
                  },
                  AllProductsDetails: {
                     getAll: NoContentResponse
                  },
                  DepositDetails: {
                     getAll: NoContentResponse
                  },
                  Investor: {
                     getAll: NoContentResponse
                  },
                  InterestRate: {
                     getAll: NoContentResponse
                  },
                  AcceptTermsAndConditionsForOpenNewAccount: {
                     getAll: NoContentResponse,
                     update: NoContentResponse
                  }
               }
            }, DatePipe]
      });
   });

   it('should be get accounts list', inject([AccountService], (service: AccountService) => {
      service.getDashboardAccounts().subscribe(response => {
         expect(response).toBeNull();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get transaction list', inject([AccountService], (service: AccountService) => {
      service.getAccountTransactions(1).subscribe(response => {
         expect(response).toBeDefined();
         expect(NoContentResponseTransactionListing).toHaveBeenCalled();
      });
   }));

   it('should be get al the schedule transfers', inject([AccountService], (service: AccountService) => {
      const urlParam = {
         transactiontype: 'scheduled',
         page: 1,
         pagesize: 10,
         fromItemAccountID: this.accountNumber
      };
      service.getScheduledTransfer(urlParam).subscribe(response => {
         expect(response.length).toBe(0);
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get al the schedule prepaid transactions', inject([AccountService], (service: AccountService) => {
      const urlParam = {
         transactiontype: 'scheduled',
         page: 1,
         pagesize: 10,
         fromItemAccountID: this.accountNumber
      };
      service.getScheduledMobileTrasactions(urlParam).subscribe(response => {
         expect(response.length).toBe(0);
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get al the schedule payment', inject([AccountService], (service: AccountService) => {
      const urlParam = {
         transactiontype: 'scheduled',
         page: 1,
         pagesize: 10,
         fromItemAccountID: this.accountNumber
      };
      service.getScheduledPayment(urlParam).subscribe(response => {
         expect(response.length).toBe(0);
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get payment transaction detail', inject([AccountService], (service: AccountService) => {
      service.getScheduledPaymentDetail(12345).subscribe(response => {
         expect(response).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get prepaid transaction detail', inject([AccountService], (service: AccountService) => {
      service.getScheduledPrepaidDetail(12345).subscribe(response => {
         expect(response).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get transafer transaction detail', inject([AccountService], (service: AccountService) => {
      service.getScheduledTransferDetail(12345).subscribe(response => {
         expect(response).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should get payment accounts', inject([AccountService], (service: AccountService) => {
      service.getPaymentAccounts().subscribe(response => {
         expect(response.length).toBe(0);
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should call fica ', inject([AccountService], (service: AccountService) => {
      service.getficaStatus().subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should call partWithdrawal ', inject([AccountService], (service: AccountService) => {
      service.getPartWithdrawalAmount(100).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should return account balance detail NOW', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getBalanceDetails(itemAccountId).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should return account notices for NOW', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getNotice(itemAccountId).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should call deleteNotice for creted notice in NOW', inject([AccountService], (service: AccountService) => {
      const noticeId = 'NOW1234';
      service.deleteNotice(noticeId).subscribe(response => {
         expect(NoContentResponseCreate).toHaveBeenCalled();
      });
   }));

   it('should get accounts for notices', inject([AccountService], (service: AccountService) => {
      service.getAccountsForNotice().subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should get transfer accounts', inject([AccountService], (service: AccountService) => {
      service.getTransferAccounts().subscribe(response => {
         expect(response.length).toBe(0);
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should get prepaid accounts', inject([AccountService], (service: AccountService) => {
      service.getPrepaidAccounts().subscribe(response => {
         expect(response.length).toBe(0);
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should return account details', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      service.getAccountDetails(itemAccountId).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should be able to get transaction details for selected transaction', inject([AccountService], (service: AccountService) => {
      const itemAccountId = 1;
      const transactionId = 'CPS|Item1|6096fdd3-e2ce-56bd-9772-d3f5d9d19b98';
      service.getTransactionDetails(itemAccountId, transactionId).subscribe(response => {
         expect(NoContentTransactionDetails).toHaveBeenCalled();
      });
   }));
   it('should return settlement details', inject([AccountService], (service: AccountService) => {
      const itemAccountId = '1';
      service.getSettlementDetails(itemAccountId).subscribe((response) => {
         expect(response).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should send settlement quote to recipient', inject([AccountService], (service: AccountService) => {
      const mockSettlementQuote: ISettlementQuote = {
         itemAccountId: '1',
         emailId: 'bob@bob.com'
      };
      service.sendSettlementQuote(mockSettlementQuote).subscribe((response) => {
         expect(response).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should return validations for overdraft', inject([AccountService], (service: AccountService) => {
      const query = { 'validationType': 'Overdraft' };
      service.getOverdraftValidations(query).subscribe((response) => {
         expect(response).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should set transactions data for Casa', inject([AccountService], (service: AccountService) => {
      expect(service.setTransactionsForCASA([])).toBeUndefined();
   }));

   it('should return transactions data for casa', inject([AccountService], (service: AccountService) => {
      service.setTransactionsForCASA([]);
      expect(service.getTransactionsForCASA().length).toEqual(0);
   }));
   it('should return mfc debit order details', inject([AccountService], (service: AccountService) => {
      service.getLoanDebitOrders(13, 'DealInfoEnq').subscribe(response => {
         expect(response).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should dispute an order', inject([AccountService], (service: AccountService) => {
      const orderInfo: IDisputeOrderPost = {
         transactionReference: mockdebitOrders[0].creditorName,
         installmentAmount: mockdebitOrders[0].installmentAmount,
         lastDebitDate: mockdebitOrders[0].lastDebitDate,
         reason: '10',
         description: '',
         subTranCode: mockdebitOrders[0].subTranCode
      };
      service.disputeAnOrder(mockdebitOrders[0].itemAccountId, orderInfo).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(false);
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should save a stop on debit order',
      inject([AccountService], (service: AccountService) => {
         disputeMetadata.metadata.resultData[0].resultDetail[0].operationReference = 'AddStopPayments';
         const orderInfo: IStopOrderPost[] = [{
            lastDebitDate: mockdebitOrders[0].lastDebitDate,
            tranCode: mockdebitOrders[0].tranCode,
            installmentAmount: mockdebitOrders[0].installmentAmount,
            creditorName: mockdebitOrders[0].creditorName,
            statementNumber: mockdebitOrders[0].statementNumber,
            statementLineNumber: mockdebitOrders[0].statementLineNumber,
            statementDate: mockdebitOrders[0].statementDate,
            reasonCode: '11',
            contractReferenceNr: mockdebitOrders[0].contractReferenceNr,
            chargeAmount: mockdebitOrders[0].chargeAmount,
            subTranCode: mockdebitOrders[0].subTranCode
         }];
         service.stopDebitOrder(mockdebitOrders[0].itemAccountId, orderInfo).subscribe(response => {
            expect(response).toBeDefined();
            expect(response).toBe(false);
            expect(NoContentResponse).toHaveBeenCalled();
         });
      }));
   it('should create notice', inject([AccountService], (service: AccountService) => {
      const noticeDetail: INoticePayload = {
         requestId: 'sdsdsdsds232dsdsds',
         notices: [
            {
               investmentNumber: '43434434-3232',
               noticeDate: '2018-09-11',
               noticeAmount: 400,
               capitalDisposalAccount:
               {
                  accountNumber: 123456789,
                  accountType: 'DS'
               }
            }
         ],
      };
      service.createNotice(noticeDetail, 'Transfer').subscribe(response => {
         expect(_createNotice).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should cancel a stop on debit order',
      inject([AccountService], (service: AccountService) => {
         disputeMetadata.metadata.resultData[0].resultDetail[0].operationReference = 'DeleteStoppedPayments';
         const orderInfo: ICancelStopOrderPost = {
            installmentAmount: mockdebitOrders[0].installmentAmount,
            tranCode: mockdebitOrders[0].tranCode,
            lastDebitDate: mockdebitOrders[0].stoppedDate,
            sequenceNumber: mockdebitOrders[0].sequenceNumber
         };
         service.cancelStopDebitOrder(mockdebitOrders[0].itemAccountId, orderInfo).subscribe(response => {
            expect(response).toBeDefined();
            expect(response).toBe(false);
            expect(NoContentResponse).toHaveBeenCalled();
         });
      }));
   it('should get reasons on debit order stop or reverse',
      inject([AccountService], (service: AccountService) => {
         service.getDebitOrderReasons('disputedebitorderreasons').subscribe(response => {
            expect(response).toBeDefined();
            expect(NoContentResponse).toHaveBeenCalled();
         });
      }));
   it('should update mfc debit order details', inject([AccountService], (service: AccountService) => {
      service.updateMfcDebitOrders('12', mockManagePaymentDetailsPost).subscribe(response => {
         expect(response).toBeDefined();
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should handle response for no conent for banks',
      inject([AccountService], (service: AccountService) => {
         service.getBanks().subscribe(response => {
            expect(NoContentResponse).toHaveBeenCalled();
         });
      }));
   it('should return terms details', inject([AccountService], (service: AccountService) => {
      service.getTermsAndConditionsForMFC('latest').subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('CreateGuidShouldNotReturnEmpty', inject([AccountService],
      (service: AccountService) => {
         service.schdedulePaymentGUID = '';
         service.createGUID();
         expect(service.schdedulePaymentGUID).not.toBe('');
      }));
   it('should handle response for no search transactions details', inject([AccountService], (service: AccountService) => {
      service.getAdvancedSearchData(1, new Date(), new Date()).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should send cross border request', inject([AccountService], (service: AccountService) => {
      service.sendCrossBorderRequest(mockCrossBorderRequest).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should be get home loan status', inject([AccountService], (service: AccountService) => {
      service.getHomeLoanStatus(1).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
});
