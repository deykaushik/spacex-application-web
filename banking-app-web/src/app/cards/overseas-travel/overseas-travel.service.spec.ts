import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';


import { OverseaTravelService } from './overseas-travel.service';
import { ApiService } from '../../core/services/api.service';

import { IOverseasTravelDetails, IPlasticCard, IMetaData, ICountrycodes } from '../../core/services/models';
import { assertModuleFactoryCaching } from '../../test-util';


const overseaTravelDetails: IOverseasTravelDetails = {
   fromDate: '2018-08-08',
   toDate: '2018-11-02',
   plasticId: ['13'],
   countries: ['CHAD', 'CANADA'],
   primaryNumber: '27814482411',
   alteranteNumber: '',
   email: 'J.BREWIS@INTEKOM.CO.ZA',
   contactNumber: '27646464657',
   overseasContactPerson: { 'name': '', 'number': '' },
   localContactPerson: { 'name': '', 'number': '' }
};

const mockRequestMetadata: IMetaData =  {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'Success'
               }
            ]
         }
      ]
};


const countryLists = jasmine.createSpy('getAll').and.callFake((query, routeParams) => {
   return Observable.of({
      data: null,
      metadata: {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'get country list',
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

const mockCards: IPlasticCard[] = [{
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
}, {
   plasticId: 2,
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
}];

const mockCountryListsData: ICountrycodes[] = [
   {
      code: '1234',
      description: 'Canada'
   },
   {
      code: '5678',
      description: 'India'
   },
   {
      code: '4567',
      description: 'Cuba'
   }
];

const mockPlasticId = 1;

describe('OverseaTravelService', () => {
   let overseaTravelService: OverseaTravelService;
   assertModuleFactoryCaching();
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [OverseaTravelService, {
            provide: ApiService, useValue: {
               CountryListDetails: {
                  getAll: countryLists
               },
               OverseasTravelNotification: {
                  create: jasmine.createSpy('create').and.returnValue(Observable.of({ metadata: mockRequestMetadata }))
               }
            }
         }]
      });
   });
   beforeEach(inject([OverseaTravelService], (service: OverseaTravelService) => {
      overseaTravelService = service;
   }));

   it('should be created', inject([OverseaTravelService], (service: OverseaTravelService) => {
      expect(service).toBeTruthy();
   }));

   it('should set Overseas Travel Details', inject([OverseaTravelService], (service: OverseaTravelService) => {
      service.setOverseasTravelDetails(overseaTravelDetails);
      expect(service.getOverseasTravelDetails()).toBe(overseaTravelDetails);
   }));
   it('should get Overseas Travel Details', inject([OverseaTravelService], (service: OverseaTravelService) => {
      expect(service.getCountryLists().subscribe((response) => {
         const oversea = response;
         expect(oversea).toBeDefined();
      }));
      expect(countryLists).toHaveBeenCalled();
   }));

   it('shoud set card details', inject([OverseaTravelService], (service: OverseaTravelService) => {
      service.setCardDetails(mockCards);
      expect(service.getCardDetails()).toBe(mockCards);
   }));

   it('shoud set all plastic cards and get all plastic cards', inject([OverseaTravelService], (service: OverseaTravelService) => {
      service.setPlasticCards(mockCards);
      expect(service.getPlasticCards()).toBe(mockCards);
   }));

   it('should return the metadata ', () => {
      overseaTravelService.createOverseasTravelNotificationDetails(overseaTravelDetails).subscribe(resp => {
         expect(resp).toBeDefined();
      });
   });

   it('shoud set and get plastic id', inject([OverseaTravelService], (service: OverseaTravelService) => {
      service.setPlasticId(mockPlasticId);
      expect(service.getPlasticId()).toBe(mockPlasticId);
   }));

   it('shoud emit true on calling setOtnSuccess method', inject([OverseaTravelService], (service: OverseaTravelService) => {
      spyOn(service.emitOtnSuccess, 'emit');
      service.setOtnSucces();
      expect(service.emitOtnSuccess.emit).toHaveBeenCalledWith(true);
   }));

   it('shoud set and get countries data', inject([OverseaTravelService], (service: OverseaTravelService) => {
      service.setCountriesData(mockCountryListsData);
      expect(service.getCountriesData()).toBe(mockCountryListsData);
   }));
});
