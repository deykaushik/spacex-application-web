import { TestBed, inject } from '@angular/core/testing';

import { BeneficiaryService } from './beneficiary.service';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { IBankDefinedBeneficiary, IContactCard } from './models';

describe('BeneficiaryService', () => {
   function getBankApprovedData(): IBankDefinedBeneficiary {
      return {
         bDFID: '0000010',
         bDFName: 'STANDARD BANK CARD DIVISION',
         sortCode: 205
      };
   }

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
            }],
         contactCardNotifications: [{
            notificationAddress: 'swapnilp@yahoo.com',
            notificationType: 'EMAIL', notificationDefault: true,
            notificationParents: []
         }],
         beneficiaryRecentTransactDetails: []
      };
   }

   let _getBankApprovedData, _getContactCards,
      mockBankApprovedData: IBankDefinedBeneficiary,
      mockContactCardData: IContactCard;

   mockBankApprovedData = getBankApprovedData();
   mockContactCardData = getContactCardData();
   _getBankApprovedData = jasmine.createSpy('getBankApprovedData').and.returnValue(Observable.of({ data: [mockBankApprovedData] }));
   _getContactCards = jasmine.createSpy('getContactCards').and.returnValue(Observable.of({ data: [mockContactCardData] }));
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [BeneficiaryService,
            {
               provide: ApiService, useValue: {
                  BankDefinedBeneficiaries: {
                     getAll: _getBankApprovedData
                  },
                  ContactCards: {
                     getAll: _getContactCards
                  }
               }
            }]
      });
   });

   it('should be created', inject([BeneficiaryService], (service: BeneficiaryService) => {
      expect(service).toBeTruthy();
   }));

   it('should get bank approved details', inject([BeneficiaryService], (service: BeneficiaryService) => {
      service.getBankApprovedBeneficiaries().subscribe(data => {
         const _bankApproved = data[0];
         expect(_bankApproved.bDFID).toBe(mockBankApprovedData.bDFID);
         expect(_bankApproved.bDFName).toBe(mockBankApprovedData.bDFName);
         expect(_bankApproved.sortCode).toBe(mockBankApprovedData.sortCode);
      });
      expect(_getBankApprovedData).toHaveBeenCalled();
   }));

   it('should get contact card details', inject([BeneficiaryService], (service: BeneficiaryService) => {
      service.getContactCards().subscribe(data => {
         const _contactCard = data[0];
         expect(_contactCard.contactCardDetails).toBe(mockContactCardData.contactCardDetails);
         expect(_contactCard.beneficiaryRecentTransactDetails).toBe(mockContactCardData.beneficiaryRecentTransactDetails);
         expect(_contactCard.contactCardID).toBe(mockContactCardData.contactCardID);
         expect(_contactCard.contactCardName).toBe(mockContactCardData.contactCardName);
      });
      expect(_getBankApprovedData).toHaveBeenCalled();
   }));
});


describe('BeneficiaryService for NO Content', () => {

   const _getBankApprovedData = jasmine.createSpy('getBankApprovedData').and.returnValue(Observable.of(null));
   const _getContactCards = jasmine.createSpy('getContactCards').and.returnValue(Observable.of(null));
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [BeneficiaryService,
            {
               provide: ApiService, useValue: {
                  BankDefinedBeneficiaries: {
                     getAll: _getBankApprovedData
                  },
                  ContactCards: {
                     getAll: _getContactCards
                  }
               }
            }]
      });
   });

   it('should be created', inject([BeneficiaryService], (service: BeneficiaryService) => {
      expect(service).toBeTruthy();
   }));

   it('should get contact card details', inject([BeneficiaryService], (service: BeneficiaryService) => {
      service.getContactCards().subscribe(data => {
         expect(data.length).toBe(0);
      });
      service.getBankApprovedBeneficiaries().subscribe(data => {
         expect(data.length).toBe(0);
      });
      expect(_getBankApprovedData).toHaveBeenCalled();
      expect(_getContactCards).toHaveBeenCalled();
   }));

});
