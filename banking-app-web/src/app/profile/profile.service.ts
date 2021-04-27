import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from './../core/services/api.service';
import { IDcarRangeDetails, IBankerDetail } from './../core/services/models';
import { ClientPreferences } from './profile.models';


@Injectable()
export class ProfileService {

   constructor(private apiService: ApiService) { }

   getClients(): Observable<any> {
      return this.apiService.clientDetails.getAll().map((response) => response ? response : {});
   }
   getPreferences(): Observable<any> {
      return this.apiService.clientPreferences.getAll();
   }
   saveClientPreferenceName(clientPreference: ClientPreferences): Observable<any> {
      return this.apiService.clientPreferences.create([clientPreference]).map((response) => response);
   }

   // get the banker details
   getBankerDetails(secOfficerCd: string): Observable<IBankerDetail> {
      const routeParams = { secOfficerCd: secOfficerCd };
      return this.apiService.BankerDetails.getAll(null, routeParams).map((response) => response ? response.data : null);
   }

   // get the dcar range
   getDcarRange(dcarNumber: string): Observable<IDcarRangeDetails> {
      const routeParams = { dcarNumber: dcarNumber };
      return this.apiService.DcarRange.getAll(null, routeParams).map((response) => response ? response.data : null);
   }
}
