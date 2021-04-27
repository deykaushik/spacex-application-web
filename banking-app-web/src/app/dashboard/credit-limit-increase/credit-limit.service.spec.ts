import { TestBed, inject } from '@angular/core/testing';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { CreditLimitService } from './credit-limit.service';
import { ApiService } from '../../core/services/api.service';
import { IApiResponse, ICreditLimitMaintenance, IAccountDetail } from '../../core/services/models';

const mockAccountId = '1';
const mockcreditLimitDetails: ICreditLimitMaintenance = {
   plasticId: 1,
   grossMonthlyIncome: 40000,
   netMonthlyIncome: 45000,
   otherIncome: 10000,
   monthlyCommitment: 25000,
   monthlyDebt: 15000,
   bankName: 'Nedbank',
   branchNumber: '48102',
   accountNumber: '12345678902',
   preferContactNumber: '+27123456789',
   primaryClientDebtReview: 'No',
   spouseDebtReview: 'yes',
   statementRetrival: true
};
const mockRequestCreditLimitIncreaseResponse: IApiResponse = {
   data: {},
   metadata: {
      resultData: [{
         resultDetail: [{
            operationReference: 'Transaction',
            result: 'R00',
            status: 'SUCCESS',
            reason: 'SUCCESS'
         }]
      }]
   }
};

const mockCATransferAccounts: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '2001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'CA',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   },
   TransferAccountRules: {
      TransferTo: [
         {
            AccountType: 'CA',
            ProductCodes: [],
            ProductAccessType: 'Blocked'
         }
      ]
   }
},
{
   itemAccountId: '2',
   accountNumber: '2001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'CA',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   },
   TransferAccountRules: {
      TransferTo: [
         {
            AccountType: 'CA',
            ProductCodes: [],
            ProductAccessType: 'Blocked'
         }
      ]
   }
}];

describe('CreditLimitService', () => {
   let creditLimitService: CreditLimitService;
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [CreditLimitService,
            {
               provide: ApiService, useValue: {
                  RequestCreditLimitIncrease: {
                     create: jasmine.createSpy('create').and
                        .returnValue(Observable.of({ apiResponse: mockRequestCreditLimitIncreaseResponse }))
                  }
               }
            }]
      });
   });

   beforeEach(inject([CreditLimitService], (service: CreditLimitService) => {
      creditLimitService = service;
   }));

   it('should be created', inject([CreditLimitService], (service: CreditLimitService) => {
      expect(service).toBeTruthy();
   }));

   it('should set and get account id', inject([CreditLimitService], (service: CreditLimitService) => {
      service.setAccountId(mockAccountId);
      expect(service.getAccountId()).toEqual(mockAccountId);
   }));

   it('should set and get CreditLimitMaintenanceDetails', inject([CreditLimitService], (service: CreditLimitService) => {
      service.setCreditLimitMaintenanceDetails(mockcreditLimitDetails);
      expect(service.getCreditLimitMaintenanceDetails()).toEqual(mockcreditLimitDetails);
   }));
   it('should set and get SummaryDetails', inject([CreditLimitService], (service: CreditLimitService) => {
      service.setSummaryDetails(mockcreditLimitDetails);
      expect(service.getSummaryDetails()).toEqual(mockcreditLimitDetails);
   }));
   it('should set summaryDetails with default value for other income and spouseDebtReview',
      inject([CreditLimitService], (service: CreditLimitService) => {
         mockcreditLimitDetails.otherIncome = null;
         mockcreditLimitDetails.spouseDebtReview = null;
         service.setSummaryDetails(mockcreditLimitDetails);
         expect(service.getSummaryDetails().otherIncome).toEqual(0);
         expect(service.getSummaryDetails().spouseDebtReview).toEqual('');
      }));
   it('should return success response', () => {
      creditLimitService.requestCreditLimitIncrease(mockcreditLimitDetails).subscribe(response => expect(response).toBeDefined());
   });

   it('should set and get cached current accounts', inject([CreditLimitService], (service: CreditLimitService) => {
      service.setCachedCurrentAccounts(mockCATransferAccounts);
      expect(service.getCachedCurrentAccounts()[0].itemAccountId).toBe('1');
      expect(service.getCachedCurrentAccounts()[0].accountType).toBe('CA');
      expect(service.getCachedCurrentAccounts()[1].itemAccountId).toBe('2');
      expect(service.getCachedCurrentAccounts()).toBe(mockCATransferAccounts);
   }));
});
