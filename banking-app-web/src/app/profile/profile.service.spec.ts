import { TestBed, inject } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { ApiService } from '../core/services/api.service';
import { Observable } from 'rxjs/Observable';
import { IClientDetails, IClientPreferenceDetails } from '../core/services/models';

describe('ProfileService', () => {
   function getClientDetails(): IClientDetails {
      return {
         CisNumber: 110282180605,
         FirstName: 'Marc',
         SecondName: '',
         Surname: 'Schutte',
         FullNames: 'Mr Marc Schutte',
         CellNumber: '+27992180605',
         EmailAddress: '',
         BirthDate: '1977-03-04T22:00:00Z',
         FicaStatus: 701,
         SegmentId: 'AAAZZZ',
         IdOrTaxIdNo: 7703055072088,
         SecOfficerCd: '36407',
         AdditionalPhoneList: [
            {
               AdditionalPhoneType: 'BUS',
               AdditionalPhoneNumber: '(086) 1828828'
            },
            {
               AdditionalPhoneType: 'CELL',
               AdditionalPhoneNumber: '+27992180605'
            },
            {
               AdditionalPhoneType: 'HOME',
               AdditionalPhoneNumber: '(078) 2228519'
            }
         ],
         Address: {
            AddressLines: [
               {
                  AddressLine: 'G12 KYLEMORE'
               },
               {
                  AddressLine: 'THE MARINA RESIDENTS DOCK ROAD'
               },
               {
                  AddressLine: 'WATERFRONT'
               }
            ],
            AddressCity: 'CAPE TOWN',
            AddressPostalCode: '08001'
         }
      };
   }

   function getClientPreferences(): IClientPreferenceDetails[] {
      return [
         {
            PreferenceKey: 'PreferredName',
            PreferenceValue: 'Heineken'
         }
      ];
   }

   let _getClientDetails, _getClientPreferences, _saveClientPreferences,
      mockClientDetailsData: IClientDetails,
      mockClientPreferencesData: IClientPreferenceDetails[];

   mockClientDetailsData = getClientDetails();
   mockClientPreferencesData = getClientPreferences();
   _getClientDetails = jasmine.createSpy('getClientDetails').and.returnValue(Observable.of(mockClientDetailsData));
   _getClientPreferences = jasmine.createSpy('getClientPreferences').and.returnValue(Observable.of([mockClientPreferencesData]));
   _saveClientPreferences = jasmine.createSpy('saveClientPreferences').and.returnValue(Observable.of('OK'));
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ProfileService,
            {
               provide: ApiService, useValue: {
                  clientDetails: {
                     getAll: _getClientDetails
                  },
                  clientPreferences: {
                     getAll: _getClientPreferences,
                     create: _saveClientPreferences
                  }
               }
            }]
      });
   });

   it('should be created', inject([ProfileService], (service: ProfileService) => {
      expect(service).toBeTruthy();
   }));

   it('should get client details', inject([ProfileService], (service: ProfileService) => {
      service.getClients().subscribe(data => {
         expect(data).toBe(mockClientDetailsData);
      });
      expect(_getClientDetails).toHaveBeenCalled();
   }));

   it('should get client preferences details', inject([ProfileService], (service: ProfileService) => {
      service.getPreferences().subscribe(data => {
         const _clientPreference = data[0];
         expect(_clientPreference).toBe(mockClientPreferencesData);
      });
      expect(_getClientPreferences).toHaveBeenCalled();
   }));

   it('should save client preferences details', inject([ProfileService], (service: ProfileService) => {
      service.saveClientPreferenceName(mockClientPreferencesData[0]).subscribe(data => {
         expect(data).toBe('OK');
      });
      expect(_saveClientPreferences).toHaveBeenCalled();
   }));
});


describe('ProfileService for nocontent', () => {

   const _noContent = jasmine.createSpy('getAll').and.returnValue(Observable.of(null));
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [ProfileService,
            {
               provide: ApiService, useValue: {
                  clientDetails: {
                     getAll: _noContent
                  },
                  clientPreferences: {
                     getAll: _noContent,
                  }
               }
            }]
      });
   });

   it('should be created', inject([ProfileService], (service: ProfileService) => {
      expect(service).toBeTruthy();
   }));
   it('should handle empty data', inject([ProfileService], (service: ProfileService) => {
      service.getClients().subscribe(res => {
         expect(res).toBeDefined();
      });
   }));
   it('should be handle no prefrence data', inject([ProfileService], (service: ProfileService) => {
      service.getPreferences().subscribe(res => {
         expect(res).toBe(null);
      });
   }));
});
