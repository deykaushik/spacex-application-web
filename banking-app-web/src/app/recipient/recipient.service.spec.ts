import { TestBed, inject } from '@angular/core/testing';

import { RecipientService } from './recipient.service';
import { Observable } from 'rxjs/Observable';
import { IBank, IContactCard } from '../core/services/models';
import { ApiService } from '../core/services/api.service';
import { Constants } from '../core/utils/constants';

function getBankMockData(): IBank[] {
   return [{
      bankCode: '001',
      bankName: 'Test',
      rTC: true,
      universalCode: '100',
      branchCodes: [{
         branchCode: '001',
         branchName: 'Test Branch'
      }]
   }];
}

const metadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'BENEFICIARYSAVED',
               result: 'FV01',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const failureMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'BENEFICIARYSAVED',
               result: 'FV01',
               status: 'FAILURE',
               reason: 'ekjjkevekbvk'
            }
         ]
      }
   ]
};

const addResponse = {
   data: {
      contactCardID: 1
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'BENEFICIARYSAVED',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   }
};

function getContactCardData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }, {
            accountType: 'CA', beneficiaryID: null,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CA', beneficiaryID: 4,
            beneficiaryName: 'Zahira Mahomed', accountNumber: null,
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PEL', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }
      ],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      },
      {
         notificationAddress: '',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      },
      {
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: null
      }],
      beneficiaryRecentTransactDetails: []
   };
}
describe('RecipientService', () => {
   let _getAllBanks: jasmine.Spy,
      _removeContactCard: jasmine.Spy,
      _addContactCard: jasmine.Spy,
      _approveITStatus: jasmine.Spy;

   beforeEach(() => {
      _getAllBanks = jasmine.createSpy('getAllBanks').and.returnValue(Observable.of({ data: getBankMockData() }));
      _removeContactCard = jasmine.createSpy('deleteRecipient').and.returnValue(Observable.of({
         metadata: metadata
      }));
      _addContactCard = jasmine.createSpy('addRecipient').and.returnValue(Observable.of(addResponse)),
      _approveITStatus = jasmine.createSpy('getApproveItStatus').and.returnValue(Observable.of({}));
      TestBed.configureTestingModule({
         providers: [RecipientService, {
            provide: ApiService, useValue: {
               Banks: {
                  getAll: _getAllBanks
               },
               ContactCard: {
                  remove: _removeContactCard,
                  updateById: _removeContactCard
               },
               AddContactCard: {
                  create: _addContactCard
               },
               OutOfBandOtpStatus : {
                  create: _approveITStatus
               },
               RecipientStatus: {
                  create: _approveITStatus
               }
            }
         }]
      });
   });

   it('should be created', inject([RecipientService], (service: RecipientService) => {
      expect(service).toBeTruthy();
   }));

   it('should be able to initiate recipient flow', inject([RecipientService], (service: RecipientService) => {
      expect(service.initiateRecepientFlow()).toBeUndefined();
   }));

   it('should delete recipient', inject([RecipientService], (service: RecipientService) => {
      service.deleteRecipient(1).subscribe((response) => {
         expect(response).toBeTruthy();
      });
      expect(_removeContactCard).toHaveBeenCalled();
   }));

   it('should return transaction status', inject([RecipientService], (service: RecipientService) => {
      const result = service.isTransactionStatusValid(metadata);
      expect(result).toBe(true);
   }));

   it('should update recipient', inject([RecipientService], (service: RecipientService) => {
      service.updateRecipient(getContactCardData(), false).subscribe((response) => {
         expect(response).toBeTruthy();
      });
      expect(_removeContactCard).toHaveBeenCalled();

      service.updateRecipient(getContactCardData()).subscribe((response) => {
         expect(response).toBeTruthy();
      });
      expect(_removeContactCard).toHaveBeenCalled();
   }));

   it('should add recipient', inject([RecipientService], (service: RecipientService) => {
      service.addRecipient(getContactCardData(), false).subscribe((response) => {
         expect(response).toBeTruthy();
      });
      expect(_addContactCard).toHaveBeenCalled();

      service.addRecipient(getContactCardData()).subscribe((response) => {
         expect(response).toBeTruthy();
      });
      expect(_addContactCard).toHaveBeenCalled();
   }));

   it('should return transaction status with reason', inject([RecipientService], (service: RecipientService) => {
      let result = service.getTransactionStatus(metadata);
      expect(result.isValid).toBe(true);

      result = service.getTransactionStatus(failureMetadata);
      expect(result.isValid).toBe(false);

      result = service.getTransactionStatus(null);
      expect(result.isValid).toBe(false);

      failureMetadata.resultData[0].resultDetail[0].operationReference = Constants.metadataKeys.secureTransaction;
      result = service.getTransactionStatus(failureMetadata);
      expect(result.isValid).toBe(false);
   }));

   it('should get ApproveIT OTP status', inject([RecipientService], (service: RecipientService) => {
      service.getApproveItOtpStatus('', '').subscribe((response) => {
         expect(response).toBeTruthy();
      });
      expect(_approveITStatus).toHaveBeenCalled();
   }));

   it('should get ApproveIT status', inject([RecipientService], (service: RecipientService) => {

    service.tempContactCard = {
       contactCardName: 'abc',
         secureTransaction: {
            verificationReferenceId: '1'
         }
      };

      service.getApproveItStatus().subscribe((response) => {
         expect(response).toBeTruthy();
      });
      expect(_approveITStatus).toHaveBeenCalled();
   }));
});
