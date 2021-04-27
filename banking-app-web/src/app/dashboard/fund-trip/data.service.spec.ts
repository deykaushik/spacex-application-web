import { DataService } from './data.service';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { assertModuleFactoryCaching } from './../../test-util';

const tripData = {
   passportNumber: 1234,
   clientContactDetails: {
      eMail: 'eMail',
      phoneNumber: {
         areaCode: 1,
         phoneNumber: 9876,
      }
   },
   clientRsaId: {
      clientIdentifier: 'clientIdentifier'
   },
   clientAddress: {
      floor: '1',
      building: 'building',
      streetNumber: 1,
      streetName: 'streetName',
      suburb: 'suburb',
      city: 'city',
      postalCode: 12
   }
};

const accountData = {
   AccountNumber: 'AccountNumber',
   accountType: 'accountType',
   AccountName: 'AccountName'
};

describe('DataService', () => {

   let dataservice: DataService;

   assertModuleFactoryCaching();

   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule, HttpClientModule],
         providers: [DataService]
      });
   });

   beforeEach(inject([DataService], (service: DataService) => {
      dataservice = service;
   }));

   it('should be created', () => {
      expect(dataservice).toBeTruthy();
   });

   it('should set client details', () => {
      dataservice.setData(tripData, accountData);
      expect(dataservice.clientDetails.passportNumber).toEqual(tripData.passportNumber);
      expect(dataservice.clientDetails.phoneNumber).toEqual(tripData.clientContactDetails.phoneNumber.phoneNumber);
   });

   it('should get client details', () => {
      dataservice.setData(tripData, accountData);
      const clientDetails = dataservice.getData();
      expect(clientDetails.passportNumber).toEqual(tripData.passportNumber);
      expect(clientDetails.phoneNumber).toEqual(tripData.clientContactDetails.phoneNumber.phoneNumber);
   });

});
