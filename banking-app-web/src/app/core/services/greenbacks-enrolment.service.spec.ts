import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { ApiService } from './api.service';
import { GreenbacksEnrolmentService } from './greenbacks-enrolment.service';
import { ClientProfileDetailsService } from './client-profile-details.service';
import { IDashboardAccounts, IDashboardAccount } from './models';
import { TermsService } from './../../shared/terms-and-conditions/terms.service';

// mock api data.
const rewardsRes = {
   data: {
      enrolReferenceNumber: '578142',
      rewardsAccountList: [
         {
            rewardsAccountNumber: '950711166186',
            rewardsAccountType: 'Consumer',
            rewardsProgram: 'GB',
            rewardsAccountStatus: 'Open',
            rewardsAccountBalance: '7972',
            rewardsAccountCurrency: 'GB'
         }
      ]
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: '',
                  result: 'R00',
                  status: 'Customer Enroled',
                  reason: ''
               }
            ]
         }
      ]
   }
};

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

const mockAccountListWithRewards = [{
   ContainerName: 'Rewards',
   Accounts: []
}];

const apiStub = {
   EnrolGreenbacks: {
      create: jasmine.createSpy('EnrolGreenbacks').and.returnValue(Observable.of(rewardsRes))
   },
   TermsAndConditionsItem: {
      getAll: jasmine.createSpy('TermsAndConditionsItem')
         .and.returnValue(Observable.of({
            data: {
               noticeDetails: {
                  noticeContent: ''
               }
            }
         }))
   }
};

let isAccepted = false;

const termsStub = {
   filterTerms: jasmine.createSpy('filterTerms')
      .and.callFake(function () {
            if (isAccepted) {
               return [];
            } else {
               return [{
                  noticeType: 'TTT',
                  noticeDetails: {
                     noticeContent: 'items content'
                  }
               }];
            }
      }),
   getTerms: jasmine.createSpy('getTerms')
      .and.returnValue(Observable.of({
         data: [{
            noticeType: 'TTT',
            noticeDetails: {
               noticeContent: ''
            }
         }]
      })),
   decodeTerms: jasmine.createSpy('decodeTerms')
      .and.returnValue('accepted content'),
   accept: jasmine.createSpy('accept')
      .and.returnValue(Observable.of(true))
};

const clientDetailsStub = {
   getClientPreferenceDetails: jasmine.createSpy('EnrolGreenbacks').and.returnValue({
      CisNumber: 123,
      PassportNo: 'abc',
      Resident: 'ZA',
      IdOrTaxIdNo: 1234
   })
};

const store = {};
let service: GreenbacksEnrolmentService;
let termsService: TermsService;

describe('GreenbacksEnrolmentService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [
            GreenbacksEnrolmentService,
            { provide: ApiService, useValue: apiStub },
            { provide: TermsService, useValue: termsStub },
            { provide: ClientProfileDetailsService, useValue: clientDetailsStub }
         ]
      });

      spyOn(localStorage, 'getItem').and.callFake(function (key) {
         return store[key];
      });
      spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
         return store[key] = value + '';
      });
      spyOn(localStorage, 'removeItem').and.callFake(function (key, value) {
         return '';
      });
   });

   beforeEach(inject([GreenbacksEnrolmentService, TermsService],
      (svc: GreenbacksEnrolmentService, terms: TermsService) => {
         service = svc;
         termsService = terms;
      }));

   it('should call resetCustomerStorage method if GBProgram eligibility is false', () => {
      const rewardAcounts = [{
         ContainerName: 'Rewards',
         Accounts: [{
            AccountNumber: 851309614323,
            AccountType: 'Rewards',
            AvailableBalance: 25762,
            RewardsProgram: 'GB',
            RandBalance: 715.61,
            AccountName: 'Greenbacks',
            Balance: 1234,
            AccountIcon: '',
            NewAccount: false,
            LastUpdate: '',
            InstitutionName: '',
            Currency: '',
            SiteId: '',
            ItemAccountId: '',
            InterestRate: 2
         } as IDashboardAccount],
         ContainerIcon: '',
         Assets: 124
      }];
      spyOn(service, 'resetCustomerStorage');
      service.updateForEnrolmentToGreenbacks(rewardAcounts);
      expect(service.resetCustomerStorage).toHaveBeenCalled();
   });

   it('should called enrolment API and with correct parameters', () => {
      service.enrolCustomer().subscribe(res => {
         expect(res).not.toBeNull();
      });

      const payload = service.getCustomerEnrolmentPayload();

      expect(apiStub.EnrolGreenbacks.create).toHaveBeenCalledWith(payload);
   });

   it('should return account number for newly created account', () => {
      const accNumber = service.getEnroledAccountNumber(rewardsRes.data);

      expect(accNumber).toBe(rewardsRes.data.rewardsAccountList[0].rewardsAccountNumber);
   });


   it('should return terms and conditions data from items call if not accepted', () => {
      service.fetchTermsAndConditions();
      const content = service.termsToAccept[0].noticeDetails.noticeContent;
      expect(content).toBe('items content');
   });

   it('should return terms and conditions data from accepted call if accepted', () => {
      isAccepted = true;
      service.fetchTermsAndConditions();
      const content = service.termsToAccept[0].noticeDetails.noticeContent;
      expect(content).toBe('accepted content');
   });

   it('should call accept method on terms accept request', () => {
      service.termsToAccept = [{}];
      service.acceptTermsAndConditions().subscribe(res => {
         expect(termsService.accept).toHaveBeenCalled();
      });
      service.termsToAccept = null;
      service.acceptTermsAndConditions().subscribe(res => {
         expect(res).toBeDefined();
      });
   });

   it('should add GB account data to account list if not having any account', () => {
      const data = service.updateForEnrolmentToGreenbacks([]);
      expect(data[0].Accounts.length).toEqual(1);
      expect(data[0].Accounts[0].AccountType).toEqual('Rewards');
   });

   it('should add GB account data to account list on having other rewards program', () => {
      const accountsList: any = mockAccountListWithRewards;
      accountsList[0].Accounts = mockAmexRewardsAccounts;
      const data = service.updateForEnrolmentToGreenbacks(accountsList);
      expect(data[0].Accounts.length).toEqual(2);
   });

   it('should not add GB account data to account list on if already has', () => {
      const accountsList: any = mockAccountListWithRewards;
      accountsList[0].Accounts = mockGreenbackRewardsAccounts;
      const data = service.updateForEnrolmentToGreenbacks(accountsList);
      expect(data[0].Accounts.length).toEqual(1);
   });

   it('should store customerId in localstorage', () => {
      service.storeCustomerInLocalStorage();
      expect(localStorage.setItem).toHaveBeenCalledWith('customerId', '123');
   });

   it('should remove customerId from localstorage', () => {
      service.resetCustomerStorage();
      expect(localStorage.removeItem).toHaveBeenCalledWith('customerId');
   });

   it('should return true if customerId in localstorage is same as logged in user', () => {
      expect(service.isCustomerEnroled()).toBe(true);
   });

   it('should return false if customerId in localstorage is not same as logged in user', () => {
      clientDetailsStub.getClientPreferenceDetails.and.returnValue({
         CisNumber: 343,
         PassportNo: 'abc',
         Resident: 'ZA',
         IdOrTaxIdNo: 1234
      });
      expect(service.isCustomerEnroled()).toBe(false);
   });
});
