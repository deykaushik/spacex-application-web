import { DatePipe } from '@angular/common';
import { TermsService } from './../shared/terms-and-conditions/terms.service';
import { TestBed, inject } from '@angular/core/testing';
import { PayoutService } from './payout.service';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs/Observable';
import { IBank, IMetaData, IApiResponse } from '../core/services/models';
import { IBuildingLoanPayout, IBuildingPayout } from './payout.models';
import { TokenManagementService } from '../core/services/token-management.service';
import { assertModuleFactoryCaching } from '../test-util';

const mockTnCData: IApiResponse = {
   data: {
      noticeType: 'HLN',
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

const mockBankData: IBank[] = [{
   bankCode: '001',
   bankName: 'Test',
   rTC: true,
   universalCode: '100',
   branchCodes: [{
      branchCode: '001',
      branchName: 'Test Branch'
   }]
}];

const mockBuildingRequest: IBuildingLoanPayout = {
   payOutType: 'PROGRESS',
   payOutAmount: 543543,
   contactTo: 'MYSELF',
   isPayOutAmount: false,
   buildingRecipientDetails: {
      bankName: 'NEDBANK',
      recipientName: 'George James',
      bankAccountNumber: '64523675627'
   },
   buildingCustomerDetails: {
      personContactNumber: '+2754635463',
      personName: 'George James',
      email: 'georgeja@nedbank.co.za'
   }
};

const mockPayoutMyselfData: IBuildingPayout = {
   propertyAddress: 'address line 1',
   payOutType: 'PROGRESS',
   amount: '543543',
   recipientName: 'George James',
   bank: 'NEDBANK',
   accountNumber: '64523675627',
   contactType: 'MYSELF',
   personName: 'George James',
   personContactNumber: '+2754635463',
   email: 'georgeja@nedbank.co.za',
   accountId: '3'
};

const mockRequestMetadata = () => {
   return {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'BUILDING LOAN OPERATION',
                  result: 'R00',
                  status: 'SUCCESS',
               }
            ]
         }
      ]
   };
};
// mock api data.
const failedResCount = 0;
const _tncData = jasmine.createSpy('getAll').and.callFake(function () {
   return Observable.of(mockTnCData);
});
const apiServiceStub = {
   Banks: {
      getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: mockBankData }))
   },
   TermsAndConditionsItem: {
      getAll: _tncData
   },
   BuildingLoanPayout: {
      create: jasmine.createSpy('create').and.callFake((itemAccountId) => {
         return Observable.of({ metadata: mockRequestMetadata });
      })
   }
};
const termsStub = {
   decodeTerms: jasmine.createSpy('decodeTerms')
      .and.returnValue('val')
};
describe('PayoutService', () => {
   let payoutService: PayoutService;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [PayoutService, TermsService, TokenManagementService, DatePipe, {
            provide: ApiService, useValue: apiServiceStub
         },
            {
               provide: TermsService, useValue: termsStub
            }]
      });
   });
   beforeEach(inject([PayoutService], (service: PayoutService) => {
      payoutService = service;
   }));
   it('should be created', () => {
      expect(payoutService).toBeTruthy();
   });
   it('should return the banks data', () => {
      payoutService.getBanks().subscribe(resp => {
         expect(resp).toBeDefined();
      });
   });
   it('should return the request object ', () => {
      expect(payoutService.getCreateRequestData(mockPayoutMyselfData)).toEqual(mockBuildingRequest);
   });
   it('should return the metadata ', () => {
      payoutService.createBuildingLoanPayout(mockBuildingRequest, { itemAccountId: 3 }).subscribe(resp => {
         expect(resp).toBeDefined();
      });
   });
   it('should return the payout object', () => {
      payoutService.payoutData = mockPayoutMyselfData;
      expect(payoutService.payoutData).toEqual(mockPayoutMyselfData);
   });
   it('should return terms and conditions data', () => {
      const data = payoutService.getTermsAndConditionsResult();
      expect(data).not.toBeNull();
   });
   it('should get terms and conditions data accepted', () => {
      const mockTnCAccepted = mockTnCData;
      const tncData = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockTnCData));
      payoutService.getTermsAndConditionsResult().subscribe((response) => {
         tncData.and.returnValue(mockTnCAccepted);
         expect(response).toBe(mockTnCAccepted.data);
      });
   });
   it('should get terms and conditions data accepted', () => {
      const mockTnCAccepted = mockTnCData;
      payoutService.getTermsAndConditionsResult().subscribe((response) => {
         expect(response).toBe(mockTnCAccepted.data);
      });
   });
});
