import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ApoService } from './apo.service';
import { IAutoPayDetail, IAvsCheck, IAvsCheckDetail } from './apo.model';
import {
   IAccountDetail, IBranch, IBank, INoticeDetails, ITermsAndConditions,
   IPlasticCard, IDashboardAccount, IDashboardAccounts
} from '../../core/services/models';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { ApiService } from '../../core/services/api.service';


const autoPayDetails: IAutoPayDetail = {
   payToAccount: '589846 076131664 5',
   payToAccountName: 'MR 1RICH GARFIELD',
   autoPayInd: true,
   statementDate: '2018-07-04T00:00:00',
   dueDate: '2018-07-29T00:00:00',
   camsAccType: 'NGB',
   autoPayMethod: 'F',
   autoPayAmount: '',
   branchOrUniversalCode: '123456',
   nedbankIdentifier: true,
   mandateAction: true,
   payFromAccount: '6666666666666',
   payFromAccountType: '2',
   monthlyPaymentDay: '19',
   autoPayTerm: '00',
   allowTermsAndCond: true
};
const nedBankAccounts: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '1001004345',
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
   }
}];
const mockAccounts: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1234,
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
   AccountNumber: 123,
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

const mockAccounts2: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 123,
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
   AccountNumber: 1235,
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
   ContainerName: 'Investment',
   Accounts: mockAccounts2,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}, {
   ContainerName: 'Card',
   Accounts: mockAccounts,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];
const getNedBankAccount = jasmine.createSpy('getAll').and.callFake((query, routeParams) => {
   return Observable.of({
      data: nedBankAccounts,
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'get NedBank Accounts',
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
const branches: IBranch[] = [{
   branchName: 'abc',
   branchCode: '45678',
   displayName: 'nedbank',
   acceptsRealtimeAVS: false
}];
const banks: IBank[] = [{
   bankCode: '12345',
   bankName: 'NedBank',
   rTC: false,
   universalCode: '',
   acceptsRealtimeAVS: false,
   acceptsBatchAVS: false,
   branchCodes: branches
}, {
   bankCode: '032',
   bankName: 'NEDBANK INCORP. FBC',
   rTC: false,
   branchCodes: [
      {
         branchName: 'FBC FIDELITY BANK PENSIONS',
         branchCode: '780117'
      },
      {
         branchName: 'PORT ELIZABETH',
         branchCode: '780017'
      }
   ]
}];

const getBanks = jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: banks }));
const getApo = jasmine.createSpy('getAll').and.callFake((query, routeParams) => {
   return Observable.of({
      data: autoPayDetails,
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'APO added successfully',
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
const createApo = jasmine.createSpy('create').and.callFake((query, routeParams) => {
   return Observable.of({
      data: null,
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'APO added successfully',
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
const updateApo = jasmine.createSpy('update').and.callFake((query, routeParams) => {
   return Observable.of({
      data: null,
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'APO updated successfully',
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
const removeApo = jasmine.createSpy('remove').and.callFake((query, routeParams) => {
   return Observable.of({
      data: null,
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'APO deleted successfully',
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
const updateTerms = jasmine.createSpy('update').and.callFake((query, routeParams) => {
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
const details: INoticeDetails = {
   noticeContent: 'value',
   versionDate: '05-20-2018'
};
const termsAndConditions: ITermsAndConditions = {
   noticeTitle: 'apo',
   noticeType: 'AAC',
   versionNumber: 1.02,
   newVersionNumber: 1.03,
   acceptedDateTime: '05-20-2018',
   noticeDetails: details
};
const getTerms = jasmine.createSpy('getAll').and.callFake((query, routeParams) => {
   return Observable.of({
      data: termsAndConditions,
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'get terms successfully',
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
const createAvs = jasmine.createSpy('create').and.callFake((query, routeParams) => {
   return Observable.of({
      data: {
         verificationResults: {
            accountExists: 'Y',
            identificationNumberMatched: 'Y',
            accountActive: 'Y',
            canDebitAccount: 'Y'
         }
      },
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'AVS',
                     result: 'R00',
                     status: 'SUCCESS',
                     reason: 'SUCCESS'
                  }
               ]
            }
         ]
      }
   });
});
const termsServiceStub = {
   decodeTerms: jasmine.createSpy('decodeTerms').and.returnValue('value')
};

const bankDetail: IAvsCheckDetail = {
   accountNumber: '1234567',
   branchCode: '1234',
   accountType: '2',
   bankName: 'abc'
};
const bankDetails: IAvsCheck = {
   account: bankDetail
};
const mockCard: IPlasticCard = {
   plasticId: 1,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   cardAccountNumber: '999',
   ItemAccountId: '',
   isCardFreeze: false
};
describe('ApoService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ApoService,
            {
               provide: TermsService, useValue: termsServiceStub
            },
            {
               provide: ApiService, useValue: {
                  Banks: {
                     getAll: getBanks
                  },
                  APOCardDetails: {
                     getAll: getApo,
                     create: createApo,
                     update: updateApo
                  },
                  DeleteAPOCardDetails: {
                     remove: removeApo
                  },
                  TransferAccounts: {
                     getAll: getNedBankAccount
                  },
                  TermsAndConditionsItem: {
                     update: updateTerms,
                     getAll: getTerms
                  },
                  AVSCheck: {
                     create: createAvs
                  }
               }
            }]
      });
   });

   it('should be created', inject([ApoService], (service: ApoService) => {
      expect(service).toBeTruthy();
   }));
   it('should set operation mode', inject([ApoService], (service: ApoService) => {
      service.setMode('edit');
      expect(service.getMode()).toBe('edit');
   }));
   it('should set plastic id ', inject([ApoService], (service: ApoService) => {
      service.setId('1');
      expect(service.getId()).toBe('1');
   }));
   it('should set and get account id', inject([ApoService], (service: ApoService) => {
      service.setAccountId(1);
      expect(service.getAccountId()).toBe(1);
   }));
   it('should return all the banks', inject([ApoService], (service: ApoService) => {
      expect(service.getBanks().subscribe((response) => {
         const bank = response[0];
         expect(bank.bankName).toBe('NedBank');
      }));
      expect(getBanks).toHaveBeenCalled();
   }));
   it('should set auto pay details', inject([ApoService], (service: ApoService) => {
      service.setAutoPayDetails(autoPayDetails);
      expect(service.getAutoPayDetails()).toBe(autoPayDetails);
   }));
   it('should set auto pay summary details', inject([ApoService], (service: ApoService) => {
      service.setAutoPaySummary(autoPayDetails);
      expect(service.getAutoPaySummary().autoPayInd).toBe(true);
      expect(service.getAutoPaySummary().autoPayMethod).toBe(autoPayDetails.autoPayMethod);
   }));
   it('should set auto pay summary details with empty autoPayTerm', inject([ApoService], (service: ApoService) => {
      autoPayDetails.autoPayAmount = '1000';
      autoPayDetails.autoPayTerm = '';
      autoPayDetails.monthlyPaymentDay = '';
      service.setAutoPaySummary(autoPayDetails);
      expect(service.getAutoPaySummary().autoPayInd).toBe(true);
      expect(service.getAutoPaySummary().autoPayMethod).toBe(autoPayDetails.autoPayMethod);
   }));
   it('should add apo details', inject([ApoService], (service: ApoService) => {
      expect(service.addApoDetails(autoPayDetails, '1').subscribe((response) => {
         expect(response.metadata).toBeDefined();
      }));
      expect(createApo).toHaveBeenCalled();
   }));
   it('should update apo details', inject([ApoService], (service: ApoService) => {
      expect(service.updateApoDetails(autoPayDetails, '1').subscribe((response) => {
         expect(response.metadata).toBeDefined();
      }));
      expect(updateApo).toHaveBeenCalled();
   }));
   it('should delete apo details', inject([ApoService], (service: ApoService) => {
      expect(service.deleteAutoPayDetails(autoPayDetails, '1').subscribe((response) => {
         expect(response.metadata).toBeDefined();
      }));
      expect(removeApo).toHaveBeenCalled();
   }));
   it('should accept terms and conditions details', inject([ApoService], (service: ApoService) => {
      expect(service.acceptTermsAndConditions('AAC', termsAndConditions).subscribe((response) => {
         expect(response.metadata).toBeDefined();
      }));
      expect(updateTerms).toHaveBeenCalled();
   }));
   it('should get nedbank account details', inject([ApoService], (service: ApoService) => {
      expect(service.getNedbankAccounts().subscribe((response) => {
         expect(response).toBe(nedBankAccounts);
      }));
      expect(getNedBankAccount).toHaveBeenCalled();
   }));
   it('should create avs check', inject([ApoService], (service: ApoService) => {
      expect(service.verifyAvsStatus(bankDetails).subscribe((response) => {
         expect(response.metadata).toBeDefined();
      }));
      expect(createAvs).toHaveBeenCalled();
   }));
   it('should get terms and conditions', inject([ApoService], (service: ApoService) => {
      expect(service.getTermsAndConditions('AAC', 'latest').subscribe((response) => {
         expect(response).toBeDefined();
      }));
      expect(getTerms).toHaveBeenCalled();
   }));
   it('should get terms and conditions return null', inject([ApoService], (service: ApoService) => {
      expect(service.getTermsAndConditions('AAC', 'latest').subscribe((response) => {
         expect(response).toBeDefined();
      }));
      expect(getTerms).toHaveBeenCalled();
   }));
   it('should get PlasticCardDetails', inject([ApoService], (service: ApoService) => {
      expect(service.getPlasticCardDetails('1').subscribe((response) => {
         expect(response).toBeDefined();
      }));
      expect(getApo).toHaveBeenCalled();
   }));
   it('should call setAPOSuccess', inject([ApoService], (service: ApoService) => {
      spyOn(service.emitApoSuccess, 'emit');
      service.setAPOSuccess();
      expect(service.emitApoSuccess.emit).toHaveBeenCalledWith(true);
   }));
   it('should call setAPODeleteSuccess', inject([ApoService], (service: ApoService) => {
      spyOn(service.emitApoDeleteSuccess, 'emit');
      service.setAPODeleteSuccess();
      expect(service.emitApoDeleteSuccess.emit).toHaveBeenCalledWith(true);
   }));
   it('should set CardDetails', inject([ApoService], (service: ApoService) => {
      service.setCardDetails(mockCard);
      expect(service.getCardDetails()).toBe(mockCard);
   }));
   it('should set and get DashboardAccounts', inject([ApoService], (service: ApoService) => {
      service.setDashboardAccounts(mockDashboardAccounts);
      expect(service.getDashboardAccounts()).toBe(mockDashboardAccounts);
   }));
   it('should set and get cached nedbank accounts ', inject([ApoService], (service: ApoService) => {
      service.setCachedNedBankAccounts(nedBankAccounts);
      expect(service.getCachedNedBankAccounts()).toBe(nedBankAccounts);
   }));
   it('should set and get other bank accounts ', inject([ApoService], (service: ApoService) => {
      service.setOtherBankAccounts(banks);
      expect(service.getOtherBankAccounts()).toBe(banks);
   }));
   it('should set and get cached terms and conditions ', inject([ApoService], (service: ApoService) => {
      service.setCachedTermsAndConditions(termsAndConditions);
      expect(service.getCachedTermsAndConditions()).toBe(termsAndConditions);
   }));
});

const NoContentResponse = jasmine.createSpy('getAll').and.returnValue(Observable.of(null));
describe('ApoService NoContent', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ApoService,
            {
               provide: TermsService, useValue: termsServiceStub
            },
            {
               provide: ApiService, useValue: {
                  Banks: {
                     getAll: NoContentResponse
                  },
                  APOCardDetails: {
                     getAll: NoContentResponse,
                     create: NoContentResponse,
                     update: NoContentResponse
                  },
                  DeleteAPOCardDetails: {
                     remove: NoContentResponse
                  },
                  TransferAccounts: {
                     getAll: NoContentResponse
                  },
                  TermsAndConditionsItem: {
                     update: NoContentResponse,
                     getAll: NoContentResponse
                  },
                  AVSCheck: {
                     create: NoContentResponse
                  }
               }
            }]
      });
   });
   it('should return all the banks', inject([ApoService], (service: ApoService) => {
      expect(service.getBanks().subscribe((response) => {
         expect(response).toBeDefined();
      }));
      expect(NoContentResponse).toHaveBeenCalled();
   }));
   it('should get nedbank account details', inject([ApoService], (service: ApoService) => {
      expect(service.getNedbankAccounts().subscribe((response) => {
         expect(response).toBeDefined();
      }));
      expect(NoContentResponse).toHaveBeenCalled();
   }));
   it('should get terms and conditions', inject([ApoService], (service: ApoService) => {
      expect(service.getTermsAndConditions('AAC', 'accept').subscribe((response) => {
         expect(response).toBe(false);
      }));
      expect(NoContentResponse).toHaveBeenCalled();
   }));
});
