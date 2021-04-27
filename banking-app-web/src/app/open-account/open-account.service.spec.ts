import { TestBed, inject } from '@angular/core/testing';

import { OpenAccountService } from './open-account.service';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs/Observable';
import { IApiResponse, IFicaResult, IAccount, IViewNoticeDetails, ITransactionDetailIS, INoticePayload } from '../core/services/models';
import { TermsService } from '../shared/terms-and-conditions/terms.service';

const mockOpenAccountData: IApiResponse = {
   data: {}
};

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

const mockFica: IFicaResult = {
   isFica: true
};

const mockFicaResult: IApiResponse = {
   data: mockFica
};

const mockISTransactionDetails: ITransactionDetailIS = {
   data: mockTransactionDetails,
   metadata: successMetadata
};

const mockNoStatus: IApiResponse = {
   data: null,
   metadata: null
};

const _FicaStatus = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockFicaResult);
});

const _getEntryAmount = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});

const _getAllProducts = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});
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
   return Observable.of(mockTermsConditions);
});

const _updateTermsForOpenNewAccount = jasmine.createSpy('update').and.callFake((urlParam) => {
   return Observable.of({ metadata: metadata });
});

const _PartWithdrawalAmount = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockISTransactionDetails));

const termsServiceStub = {
   decodeTerms: jasmine.createSpy('decodeTerms').and.returnValue('value')
};

const _openAccount = jasmine.createSpy('getAll').and.callFake((urlParam) => {
   return Observable.of(mockOpenAccountData);
});

describe('OpenAccountService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [OpenAccountService, {
            provide: TermsService, useValue: termsServiceStub
         },
            {
               provide: ApiService, useValue: {
                  EntryAmount: {
                     getAll: _getEntryAmount
                  },
                  AllProductsDetails: {
                     getAll: _getAllProducts
                  },
                  FicaStatus: {
                     getAll: _FicaStatus
                  },
                  PartWithdrawalAmount: {
                     getAll: _PartWithdrawalAmount
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
                  },
                  OpenAccount: {
                     create: _openAccount
                  }
               }
            }]
      });
   });

   it('should be created', inject([OpenAccountService], (service: OpenAccountService) => {
      expect(service).toBeTruthy();
   }));

   it('should get entry amount', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getEntryAmount().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));
   it('should get all products list', inject([OpenAccountService], (service: OpenAccountService) => {
      const age = 20;
      const clienttype = 30;
      service.getAllProducts(age, clienttype).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));
   it('should get investor accounts using all 3 filters', inject([OpenAccountService], (service: OpenAccountService) => {
      const isDeposit = 'yes';
      const accountType = '32 days notice';
      const age = 20;
      const clienttype = 30;
      service.getAllAccountTypeFilteredProduct(500, isDeposit, accountType, age, clienttype).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));
   it('should get the minimum entry amount', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getMinimumEntryAmount();
      expect(response).toBeUndefined();
   }));

   it('should get the selected account amount', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setMinimumEntryAmount(500);
      const result = service.getMinimumEntryAmount();
      expect(result).toBe(500);
   }));
   it('entered amount is noy valid', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getAmountForOpenNewAccount();
      expect(response).toBeUndefined();
   }));
   it('should get the selected account amount', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setAmountForOpenNewAccount(500);
      const result = service.getAmountForOpenNewAccount();
      expect(result).toBe(500);
   }));
   it('should be get the product details', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getProductDetails();
      expect(response).toBeUndefined();
   }));

   it('should be get the selected account amount', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setProductDetails({ name: '32 days notice' });
      const result = service.getProductDetails();
      expect(result['name']).toBe('32 days notice');
   }));
   it('should be get the deposit details', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getDepositDetails();
      expect(response).toBeUndefined();
   }));

   it('should be get the selected account amount', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setDepositDetails({ depositAmount: 1000 });
      const result = service.getDepositDetails();
      expect(result['depositAmount']).toBe(1000);
   }));

   it('should be get the interest details', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getInterestDetails();
      expect(response).toBeDefined();
   }));

   it('should be get the selected account amount', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setInterestDetails({ interestAmount: 1000 });
      const result = service.getInterestDetails();
      expect(result['interestAmount']).toBe(1000);
   }));

   it('should get the recurring details', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getRecurringDetails();
      expect(response).toBeDefined();
   }));

   it('should get the selected account amount', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setRecurringDetails({ recurringAmount: 700 });
      const result = service.getRecurringDetails();
      expect(result['recurringAmount']).toBe(700);
   }));

   it('should set the recurring flag', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getRecurringEdit();
      expect(response).toBeUndefined();
   }));

   it('should show the recurring edit', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setRecurringEdit(true);
      const result = service.getRecurringEdit();
      expect(result).toBe(true);
   }));

   it('should show the interest edit', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getInterestEdit();
      expect(response).toBeUndefined();
   }));

   it('should get interest rdit info', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setInterestEdit(true);
      const result = service.getInterestEdit();
      expect(result).toBe(true);
   }));

   it('should get the realtimerate', inject([OpenAccountService], (service: OpenAccountService) => {
      const response = service.getRealTimeInterestRate();
      expect(response).toBeUndefined();
   }));

   it('should set the real time rate', inject([OpenAccountService], (service: OpenAccountService) => {
      service.setRealTimeInterestRate(7);
      const result = service.getRealTimeInterestRate();
      expect(result).toBe(7);
   }));

   it('should get initial deposit', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getInitialDeposit().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get investor accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getInvestor().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get investor pay out accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getInterestPayout().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get investor pay out accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      const productType = 15;
      const amount = 100;
      const term = 1;
      service.getInterestRate(productType, amount, term).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get investor pay out accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      const productType = 15;
      const amount = 100;
      const freq = 'M';
      const terms = 12;
      service.getFixedInterestRate(productType, amount, freq, terms).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should be get investore pay out accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getTermsAndConditionsForOpenNewAccount().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should update terms and codition for open new account', inject([OpenAccountService], (service: OpenAccountService) => {
      service.updateTermsAndConditionsForOpenNewAccount().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should call fica status', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getficaStatus().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should return minimum entry amount ', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getPartWithdrawalAmount(100).subscribe(response => {
         expect(_PartWithdrawalAmount).toHaveBeenCalled();
      });
   }));

   it('should call open new account', inject([OpenAccountService], (service: OpenAccountService) => {
      service.openAccount(mockOpenAccountData, 'transfer').subscribe(response => {
         expect(_openAccount).toHaveBeenCalled();
      });
   }));
});

describe('OpenAccountService for No Content', () => {
   const NoContentResponse = jasmine.createSpy('getAll').and.returnValue(Observable.of(null));
   const NoContentResponseCreate = jasmine.createSpy('create').and.returnValue(Observable.of(mockNoStatus));

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [OpenAccountService,
            {
            provide: TermsService, useValue: termsServiceStub
         },
            {
               provide: ApiService, useValue: {
                  FicaStatus: {
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
                  },
                  OpenAccount: {
                     create: NoContentResponse
                  }
               }
            }]
      });
   });

   it('should get minimum entry amount', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getEntryAmount().subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should get all product list', inject([OpenAccountService], (service: OpenAccountService) => {
      const age = 20;
      const clienttype = 30;
      service.getAllProducts(age, clienttype).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
   it('should get investor accounts using all 3 filters', inject([OpenAccountService], (service: OpenAccountService) => {
      const isDeposit = 'yes';
      const accountType = '32 days notice';
      const age = 20;
      const clienttype = 30;
      service.getAllAccountTypeFilteredProduct(500, isDeposit, accountType, age, clienttype).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get initial deposit', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getInitialDeposit().subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get investor accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getInvestor().subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get investore pay out accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getInterestPayout().subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get investore pay out accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      const productType = 15;
      const amount = 100;
      const term = 1;
      service.getInterestRate(productType, amount, term).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should get investor pay out accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      const productType = 15;
      const amount = 100;
      const freq = 'M';
      const terms = 12;
      service.getFixedInterestRate(productType, amount, freq, terms).subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should be get investore pay out accounts', inject([OpenAccountService], (service: OpenAccountService) => {
      service.getTermsAndConditionsForOpenNewAccount().subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should update terms and codition for open new account', inject([OpenAccountService], (service: OpenAccountService) => {
      service.updateTermsAndConditionsForOpenNewAccount().subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));

   it('should call open new account', inject([OpenAccountService], (service: OpenAccountService) => {
      service.openAccount(mockOpenAccountData, 'transfer').subscribe(response => {
         expect(NoContentResponse).toHaveBeenCalled();
      });
   }));
});
