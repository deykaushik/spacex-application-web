import { TestBed, inject } from '@angular/core/testing';
import { Constants } from '../utils/constants';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IGaEvent, IGaPageTracking } from './models';
import { IClientDetails, IClientPreferenceDetails, IAccountDetail } from './models';

import { SystemErrorService } from './system-services.service';
import { GaTrackingService } from './ga.service';
import { WindowRefService } from './window-ref.service';
import { ClientProfileDetailsService } from './client-profile-details.service';


const mockEventObject: IGaEvent = {
   category: 'test',
   label: 'test',
   action: 'test',
   value: 'test'
};

describe('GaTrackingService', () => {

   function IClientDetailsStub(): IClientDetails {
      return {
         CisNumber: 123,
         FirstName: 'test',
         SecondName: '',
         Surname: 'test',
         FullNames: 'test',
         CellNumber: '',
         EmailAddress: '',
         BirthDate: '',
         FicaStatus: 0,
         SegmentId: '',
         IdOrTaxIdNo: 0,
         SecOfficerCd: '',
         Address: {
            AddressLines: [{ AddressLine: 'abc' }],
         }
      };
   }
   const clientDetails: IClientDetails = {
      FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
      CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
      EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
      Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
   };
   const clientProfileDetailsServiceStub = {
      clientDetailsObserver: new BehaviorSubject<IClientDetails>(IClientDetailsStub()),
      getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
      getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
   };

   class MockRouter {
      public ne = new NavigationEnd(0, '/', '/');
      public events = new Observable(observer => {
         observer.next(this.ne);
         observer.complete();
      });
   }

   const SystemErrorServiceStub = {
      getError: function () {
         return Observable.of({
            url: '/'
         });
      }
   };

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [GaTrackingService,
            {
               provide: WindowRefService,
               useValue: {
                  nativeWindow: { gtag: () => { } }
               }
            },
            {
               provide: Router,
               useClass: MockRouter
            },
            {
               provide: ClientProfileDetailsService,
               useValue: clientProfileDetailsServiceStub
            },
            {
               provide: SystemErrorService,
               useValue: SystemErrorServiceStub
            }]
      });
   });

   it('should be created', inject([GaTrackingService], (service: GaTrackingService) => {
      expect(service).toBeTruthy();
   }));

   it('should send ga event with custom objects', inject([GaTrackingService], (service: GaTrackingService) => {
      service.sendEvent(mockEventObject);
   }));

   it('should set category parameter', inject([GaTrackingService], (service: GaTrackingService) => {
      service.changeCategory('abc');
      expect(service.category).toBe('abc');
   }));

});
