import { TestBed, inject } from '@angular/core/testing';
import { ApiService } from './api.service';
import { ClientProfileDetailsService } from './client-profile-details.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const mockClientData = {
   FirstName: 'Test',
   Lastname: 'Test'
};
const mockPreferencedata = [{
   PreferenceKey: 'PreferredName',
   PreferenceValue: 'test'
}];
const getAllClient = jasmine.createSpy('getAll').and.returnValue(Observable.of(mockClientData));

const accountData = [{
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

let preferenceSubject = new Subject();
const mockPreferencedata2 = [{
   PreferenceKey: 'PreferredName',
   PreferenceValue: 'test'
},
{
   PreferenceKey: 'DefaultAccount',
   PreferenceValue: '1'
}];
const getAllPreferenceNull = jasmine.createSpy('getAll').and.returnValue(preferenceSubject);
describe('ClientProfileDetailsService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ClientProfileDetailsService, {
            provide: ApiService,
            useValue: {
               clientDetails: {
                  getAll: getAllClient
               },
               clientPreferences: {
                  getAll: getAllPreferenceNull
               }
            }
         }]
      });
   });

   it('should be created', inject([ClientProfileDetailsService], (service: ClientProfileDetailsService) => {
      expect(service).toBeTruthy();
   }));
   it('should be return undefined when there is no default account in preference data'
      , inject([ClientProfileDetailsService], (service: ClientProfileDetailsService) => {
         service.getClientDetail();
         preferenceSubject.next(null);
         preferenceSubject.complete();
         service.clientDetailsObserver.subscribe( clientData => {
            if (clientData !== null) {
                 expect(service.getDefaultAccount(accountData)).toBeUndefined();
            }
         });
      }));

    it('should return clientDetails', inject([ClientProfileDetailsService], (service: ClientProfileDetailsService) => {
      service.getClientDetail();
      service.clientDetailsObserver.subscribe( clientData => {
         if (clientData !== null) {
               expect(service.getClientPreferenceDetails()).toBe(clientData);
         }
      });
      expect(service.getClientPreferenceDetails()).toBeUndefined();
    }));
   it('should return account when there is Deault account in preference data'
      , inject([ClientProfileDetailsService], (service: ClientProfileDetailsService) => {
         preferenceSubject = new Subject();
         getAllPreferenceNull.and.returnValue(preferenceSubject);
         service.getClientDetail();
         preferenceSubject.next(mockPreferencedata2);
         preferenceSubject.complete();
         service.clientDetailsObserver.subscribe( clientData => {
            if (clientData !== null) {
                  expect(service.getDefaultAccount(accountData)).toBe(accountData[0]);
            }
         });
      }));

      it('should not set Preferred name when there is no key for Preferred Name'
      , inject([ClientProfileDetailsService], (service: ClientProfileDetailsService) => {
         preferenceSubject = new Subject();
         mockPreferencedata2[0].PreferenceKey = 'Test';
         getAllPreferenceNull.and.returnValue(preferenceSubject);
         service.getClientDetail();
         preferenceSubject.next(mockPreferencedata2);
         preferenceSubject.complete();
         service.clientDetailsObserver.subscribe( clientData => {
            if (clientData !== null) {
                  expect(service.getDefaultAccount(accountData)).toBe(accountData[0]);
            }
         });
      }));
});

