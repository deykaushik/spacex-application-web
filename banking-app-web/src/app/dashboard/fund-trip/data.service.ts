import { Injectable, EventEmitter } from '@angular/core';
import { IClientDetails } from './fund-trip.model';

@Injectable()
export class DataService {
   public clientDetails: IClientDetails;
   public tripStatus: string;

   constructor() {

   }


   setData(trip: any, account: any) {
      this.clientDetails = {
         passportNumber: trip.passportNumber,
         email: trip.clientContactDetails.eMail,
         areaCode: trip.clientContactDetails.phoneNumber.areaCode,
         phoneNumber: trip.clientContactDetails.phoneNumber.phoneNumber,
         rsaId: trip.clientRsaId.clientIdentifier,
         floor: trip.clientAddress.floor,
         building: trip.clientAddress.building,
         streetNumber: trip.clientAddress.streetNumber,
         streetName: trip.clientAddress.streetName,
         suburb: trip.clientAddress.suburb,
         city: trip.clientAddress.city,
         postalCode: trip.clientAddress.postalCode,
         fromAccount: account,
         transactionReference: trip.transactionReference
      };
      this.tripStatus = trip.tripStatus;
   }
   getData() {
      return this.clientDetails;
   }
   getTripStatus() {
      return this.tripStatus;
   }
}
