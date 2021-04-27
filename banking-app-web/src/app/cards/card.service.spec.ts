import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { CardService } from './card.service';
import { ApiService } from './../core/services/api.service';
import { Constants } from '../core/utils/constants';
import { IPlasticCard, IDashboardAccounts, IDashboardAccount, IReplaceCardPayload,
       ITransactionDetailIS, IApiResponse } from './../core/services/models';

const mockCardsEmpty = {};

const mockCards: IPlasticCard[] = [{
   plasticId: 1,
   plasticNumber: '123456 0000 7891',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   cardAccountNumber: '999',
   owner: false,
   availableBalance: 123,
   allowATMLimit: false,
   allowBranch: false,
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   isCardFreeze: false,
   F2FBranch: '',
   ItemAccountId: '1234'
},
{
   plasticId: 2,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   cardAccountNumber: '999',
   owner: false,
   availableBalance: 123,
   allowATMLimit: false,
   allowBranch: false,
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   isCardFreeze: false,
   F2FBranch: '',
   ItemAccountId: '1234'
},
{
   plasticId: 3,
   plasticNumber: '123456 0000 7892',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   cardAccountNumber: '999',
   owner: false,
   availableBalance: 123,
   allowATMLimit: false,
   allowBranch: false,
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   isCardFreeze: false,
   F2FBranch: '',
   ItemAccountId: '1234'
},
{
   plasticId: 4,
   plasticNumber: '123456 0000 7892',
   plasticStatus: 'Blocked',
   plasticType: '',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   cardAccountNumber: '999',
   owner: false,
   availableBalance: 123,
   allowATMLimit: false,
   allowBranch: false,
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   isCardFreeze: false,
   F2FBranch: '',
   ItemAccountId: '1234'
}];
const mockCardsData = { data: mockCards };
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
   InterestRate: 0
}];

const plNumber = '';
const acId = 1234;

const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccounts,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];
describe('CardService', () => {

   const _getAllPlasticCardsWithId = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockCards));
   const _getAllPlasticCards = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockCards));
   let observer;
   const observable = new Observable(observe => {
      observer = observe;
   });
   const _updateCard = jasmine.createSpy('update').and.callFake((query, routeParams) => {
      return Observable.of({
         data: null,
         metadata: {
            resultData: [
               {
                  resultDetail: [
                     {
                        operationReference: 'Atm limit update',
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
   const updateLimitResponse = {
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'Atm limit update',
                     result: 'R00',
                     status: 'SUCCESS',
                     reason: 'Success'
                  }
               ]
            }
         ]
      }
   };

   const updateDebitLimitResponse = {
     MetaData: {
         InvalidFieldList: null,
         Message: null,
         result: {
            resultCode: 0,
            resultMessage: null
         },
         ResultCode: null
      }
   };


   const updateLimitCreditCardsResponse: ITransactionDetailIS = {
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'Atm limit update',
                     result: 'R00',
                     status: 'SUCCESS',
                     reason: 'Success'
                  }
               ]
            }
         ]
      }
   };

   const _updateCardLimit = jasmine.createSpy('update').and.callFake((payload, query, routeParams) => {
      return observable;
   });
   const _updateCardLimitCreditCard = jasmine.createSpy('update').and.callFake((payload, query, routeParams) => {
      return observable;
   });
   const _updateCardActionListSuccessData = {
      Data: null,
      metadata: {
         resultData:
            [{
               resultDetail:
                  [{
                     operationReference: 'Get Card Details',
                     result: 'R00',
                     status: 'SUCCESS',
                     reason: 'Success'
                  }]
            }]
      }
   };

   const updateActivateCardMockResponse: IApiResponse = {
      data: null,
      metadata: {
         resultData:
            [{
               resultDetail:
                  [{
                     operationReference: 'Update Card Details',
                     result: 'R00',
                     status: 'SUCCESS',
                     reason: 'Success'
                  }]
            }]
      }
   };
   const _updateCardActionList = jasmine.createSpy('update').and.callFake((urlParam) => {
      return Observable.of(_updateCardActionListSuccessData);
   });

   const updateActivateCard = jasmine.createSpy('update').and.callFake((urlParam) => {
      return Observable.of(updateActivateCardMockResponse);
   });

   const _updateDebitCardLimit = jasmine.createSpy('update').and.callFake((payload, query, routeParams) => {
      return Observable.of({
         Data: null,
         MetaData: {
            InvalidFieldList: null,
            Message: null,
            result: {
               resultCode: 0,
               resultMessage: null
            },
            ResultCode: null
         }
      });
   });
   const _replaceCard = jasmine.createSpy('update').and.callFake((query, routeParams) => {
      return Observable.of({
         Data: null,
         metadata: {
            resultData:
               [{
                  resultDetail:
                     [{
                        operationReference: 'Get Card Details',
                        result: 'R00',
                        status: 'SUCCESS',
                        reason: 'Success'
                     }]
               }]
         }
      });
   });
   const _allAccounts = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockDashboardAccounts));
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [
            CardService,
            {
               provide: ApiService, useValue: {
                  PlasticCardsWithId: {
                     getAll: _getAllPlasticCardsWithId
                  },
                  PlasticCards: {
                     getAll: _getAllPlasticCards
                  },
                  BlockCard: {
                     update: _updateCard
                  },
                  CreditCardAtmLimit: {
                     update: _updateCardLimitCreditCard,
                     getAll: jasmine.createSpy('getAll')
                  },
                  DebitCardAtmLimit: {
                     update: _updateCardLimit,
                     getAll: jasmine.createSpy('getAll')
                  },
                  DashboardAccounts: {
                     getAll: _allAccounts
                  },
                  ReplaceCard: {
                     update: _replaceCard
                  },
                  UpdateCardActionList: {
                     update: _updateCardActionList
                  },
                  UpdateActivateCard: {
                        update: updateActivateCard
                     }
               }
            }
         ]
      });
   });

   it('should be created', inject([CardService], (service: CardService) => {
      expect(service).toBeTruthy();
   }));

   it('should get all plastic cards', inject([CardService, ApiService],
      (service: CardService, apiService: ApiService) => {
         apiService.PlasticCardsWithId.getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockCardsData));
         service.getPlasticCards(1).subscribe(response => {
            expect(response.length).toBe(mockCards.length);
            expect(response[0].plasticNumber).toBe(mockCards[0].plasticNumber);
            expect(response[0].plasticStatus).toBe(mockCards[0].plasticStatus);
            expect(response[0].expiryDate).toBe(mockCards[0].expiryDate);
         });
      }));

   it('should get account specific plastic cards', inject([CardService, ApiService],
      (service: CardService, apiService: ApiService) => {
         const accountId = 123;
         apiService.PlasticCardsWithId.getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockCardsData));
         service.getPlasticCards(accountId).subscribe(response => {
            expect(response.length).toBe(mockCards.length);
            expect(response[0].plasticNumber).toBe(mockCards[0].plasticNumber);
            expect(response[0].plasticStatus).toBe(mockCards[0].plasticStatus);
            expect(response[0].expiryDate).toBe(mockCards[0].expiryDate);
         });
      }));
   it('should get account else parts', inject([CardService, ApiService],
      (service: CardService, apiService: ApiService) => {
         apiService.PlasticCards.getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockCardsData));
         service.getPlasticCards().subscribe(response => {
            expect(response.length).toBe(mockCards.length);
            expect(response[0].plasticNumber).toBe(mockCards[0].plasticNumber);
            expect(response[0].plasticStatus).toBe(mockCards[0].plasticStatus);
            expect(response[0].expiryDate).toBe(mockCards[0].expiryDate);
         });
      }));
   it('should handle empty response in if part', inject([CardService, ApiService],
      (service: CardService, apiService: ApiService) => {
         apiService.PlasticCardsWithId.getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockCardsEmpty));
         const accountId = 999;
         service.getPlasticCards(accountId).subscribe(response => {
            expect(response['Data']).toBeUndefined();
         });
      }));

   it('should handle empty response in else part', inject([CardService, ApiService],
      (service: CardService, apiService: ApiService) => {
         apiService.PlasticCards.getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockCardsEmpty));
         service.getPlasticCards().subscribe(response => {
            expect(response['Data']).toBeUndefined();
         });
      }));

   it('should check for updating the card limit with true', inject([CardService], (service: CardService) => {
      service.cardLimitUpdateEmitter.subscribe(isLimitUpdatedStatus => {
         expect(isLimitUpdatedStatus.isLimitUpdated).toBe(true);
      });
      service.updateCardLimit(mockCards[0].plasticNumber, 100, 200, 1, 2000);
      observer.next(updateLimitCreditCardsResponse);
   }));

   it('should check for updating the card limit with false', inject([CardService], (service: CardService) => {
      service.cardLimitUpdateEmitter.subscribe(isLimitUpdatedStatus => {
         expect(isLimitUpdatedStatus.isLimitUpdated).toBe(false);
      });
      updateLimitResponse.metadata.resultData[0].resultDetail[0].result = 'R01';
      service.updateCardLimit(mockCards[0].plasticNumber, 100, 200, 1, 2000);
      observer.next(updateLimitResponse);
   }));

   it('should check for updating the card limit with false when http fails', inject([CardService], (service: CardService) => {
      service.cardLimitUpdateEmitter.subscribe(isLimitUpdatedStatus => {
         expect(isLimitUpdatedStatus.isLimitUpdated).toBe(false);
      });
      updateLimitResponse.metadata.resultData[0].resultDetail[0].result = 'R01';
      service.updateCardLimit(mockCards[0].plasticNumber, 100, 200, 1, 2000);
      observer.error(null);
   }));
   it('should get credit card limit', inject([CardService], (service: CardService) => {
      expect(service.getCreditCardLimit(mockCards[0].plasticId)).toBeUndefined();
   }));
   it('should get debit card limit', inject([CardService], (service: CardService) => {
      expect(service.getDebitCardLimit(mockCards[0].plasticNumber)).toBeUndefined();
   }));
   it('should check block card status metadata for success', inject([CardService], (service: CardService) => {
      expect(service.checkCardBlockedStatus({
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
      }})).toBe(true);
   }));

   it('should check block card status metadata for failure', inject([CardService], (service: CardService) => {
      expect(service.checkCardBlockedStatus({
      data: {},
      metadata: {
         resultData: [
            {
               transactionID: '0',
               resultDetail: [
                  {
                     operationReference: 'SUCCESS',
                     result: 'R01',
                     status: 'PENDING'
                  }
               ]
            }
         ]
      }})).toBe(false);
   }));

   it('should retry blocking card for given card number & reason', inject([CardService], (service: CardService) => {
      expect(service.retryBlockingCard(123, 'xxx', 'lost')).toBeUndefined();
   }));

   it('should try blocking the card with given card number & reason', inject([CardService], (service: CardService) => {
      expect(service.blockCard(123, 'xxx', 'lost')).toBeUndefined();
   }));

   it('should redirect to branch locator for replace card collection', inject([CardService], (service: CardService) => {
      const payload: IReplaceCardPayload = {
         cardnumber: 'xxx',
         reason: 'lost',
         branchcode: '9',
         branchName: 'nedbank branch',
         isCourier: false
      };
      expect(service.replaceCardBranchSelector(payload, null, 1)).toBeUndefined();
   }));

   it('should redirect to branch locator for replace card collection for courier', inject([CardService], (service: CardService) => {
      const payload: IReplaceCardPayload = {
         cardnumber: 'xxx',
         reason: 'lost',
         branchcode: '9',
         branchName: 'nedbank branch',
         isCourier: true
      };
      expect(service.replaceCardBranchSelector(payload, null, 1)).toBeUndefined();
   }));

   it('should replace card', inject([CardService], (service: CardService) => {
      expect(service.replaceCard(123, 'xxx', 'lost')).toBeUndefined();
   }));

   it('should retry replace card for given card number & reason', inject([CardService], (service: CardService) => {
      expect(service.retryReplaceCard(123, 'xxx', 'lost', '9', 'nedbank branch')).toBeUndefined();
   }));

   it('should check status of replace card for given card number & reason', inject([CardService], (service: CardService) => {
      expect(service.checkCardReplacementStatus(undefined)).toBeFalsy();
   }));

   it('should hide block card status popup for given card number & reason', inject([CardService], (service: CardService) => {
      expect(service.closeBlockCardStatusPopup()).toBeUndefined();
   }));

   it('should hide replace card status popup for given card number & reason', inject([CardService], (service: CardService) => {
      expect(service.closeReplaceCardStatusPopup()).toBeUndefined();
   }));

   it('should close replace card status popup for given card number & reason', inject([CardService], (service: CardService) => {
      expect(service.closeReplaceCardPopup()).toBeUndefined();
   }));

   it('should retry to  replace card collection', inject([CardService], (service: CardService) => {
      const payload: IReplaceCardPayload = {
         cardnumber: 'xxx',
         reason: 'lost',
         branchcode: '9',
         branchName: 'nedbank branch'
      };
      expect(service.replaceCardBranchSelector(payload, Function)).toBeUndefined();
   }));

   it('should get all accounts ', inject([CardService], (service: CardService) => {
      service.getDashboardAccounts().subscribe(res => {
         expect(res).toBeDefined();
         expect(res.length).toBe(mockDashboardAccounts.length);
      });
   }));

   it('should check for updating the debit card limit with true', inject([CardService], (service: CardService) => {
      service.cardLimitUpdateEmitter.subscribe(isLimitUpdatedStatus => {
         expect(isLimitUpdatedStatus.isLimitUpdated).toBe(false);
      });
      updateDebitLimitResponse.MetaData.result.resultCode = 0;
      service.updateDebitCardLimit(mockCards[0].plasticNumber, 100, 200, '123');
      observer.next(updateLimitResponse);
   }));

   it('should check for updating the debit card limit with false', inject([CardService], (service: CardService) => {
      service.cardLimitUpdateEmitter.subscribe(isLimitUpdatedStatus => {
         expect(isLimitUpdatedStatus.isLimitUpdated).toBe(false);
      });
      updateDebitLimitResponse.MetaData.result.resultCode = 1;
      service.updateDebitCardLimit(mockCards[0].plasticNumber, 100, 200, '1234');
      observer.next(updateLimitResponse);
   }));

   it('should check for updating the debit card limit with false when http fails', inject([CardService], (service: CardService) => {
      service.cardLimitUpdateEmitter.subscribe(isLimitUpdatedStatus => {
         expect(isLimitUpdatedStatus.isLimitUpdated).toBe(false);
      });
      updateDebitLimitResponse.MetaData.result.resultCode = 1;
      service.updateDebitCardLimit(mockCards[0].plasticNumber, 100, 200, '1234');
      observer.error(null);
   }));

   it('should emit replaceBlockCardEmitter on replaceBlockCard', inject([CardService], (service: CardService) => {
      service.replaceBlockCard(mockCards[0].plasticNumber, '');
      service.replaceBlockCardEmitter.subscribe(status => {
         expect(status).toBe(true);
      });
   }));

   it('should check for updating the card status', inject([CardService], (service: CardService) => {
      service.updateCardActionList(123).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe('R00');
         expect(_updateCardActionList).toHaveBeenCalled();
      });
   }));

   it('should check for updating the activate card status', inject([CardService], (service: CardService) => {
      service.updateActivateCard(123).subscribe(response => {
         expect(response).toBeDefined();
         expect(response).toBe(updateActivateCardMockResponse);
         expect(updateActivateCard).toHaveBeenCalled();
      });
   }));
});
