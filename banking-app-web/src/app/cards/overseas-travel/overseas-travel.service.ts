import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ApiService } from './../../core/services/api.service';
import { ICountrycodes, IOverseasTravelDetails, IPlasticCard, IMetaData } from '../../core/services/models';

@Injectable()
export class OverseaTravelService {
   emitOtnSuccess = new EventEmitter<boolean>();
   overseasTravelDetails: IOverseasTravelDetails;
   card: IPlasticCard[];
   plasticId: number;
   plasticCards: IPlasticCard[];
   countriesLists: ICountrycodes[];

   constructor(private apiService: ApiService) {
      this.overseasTravelDetails = {} as IOverseasTravelDetails;
   }
   setPlasticId(plasticId: number) {
      this.plasticId = plasticId;
   }

   getPlasticId(): number {
      return this.plasticId;
   }

   setOtnSucces() {
      this.emitOtnSuccess.emit(true);
   }

   setOverseasTravelDetails(overseasDetails: IOverseasTravelDetails) {
      this.overseasTravelDetails = overseasDetails;
   }

   getOverseasTravelDetails(): IOverseasTravelDetails {
      return this.overseasTravelDetails;
   }

   setCardDetails(cardDetails: IPlasticCard[]) {
      this.card = cardDetails;
   }

   getCardDetails(): IPlasticCard[] {
      return this.card;
   }

   setPlasticCards(plasticCards: IPlasticCard[]) {
      this.plasticCards = plasticCards;
   }

   getPlasticCards(): IPlasticCard[] {
      return this.plasticCards;
   }

   setCountriesData(countriesLists: ICountrycodes[]) {
      this.countriesLists = countriesLists;
   }

   getCountriesData(): ICountrycodes[] {
      return this.countriesLists;
   }

   /* get countries lists from API */
   getCountryLists(): Observable<ICountrycodes[]> {
      return this.apiService.CountryListDetails.getAll().map((response) => response ? response.data : []);
   }

   createOverseasTravelNotificationDetails(overseasTravelDetails: IOverseasTravelDetails): Observable<IMetaData> {
      return this.apiService.OverseasTravelNotification.create(overseasTravelDetails, '').map((response) => response.metadata);
   }
}

