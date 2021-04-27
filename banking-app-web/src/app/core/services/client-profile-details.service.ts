import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IClientDetails, IClientPreferenceDetails, IAccountDetail, IClientPreferences } from './models';
import { ProfileDetails } from '../../profile/profile.models';
import { Constants } from '../utils/constants';

@Injectable()
export class ClientProfileDetailsService {
   private clientDetails: IClientDetails;
   private clientPreference: IClientPreferenceDetails;
   clientDetailsObserver: BehaviorSubject<IClientDetails>;
   isClientObserverUpdated: boolean;
   isViewBanker: boolean;
   SecOfficerCd = '0';

   public setDefaultAccountId(value) {
      this.clientDetails.DefaultAccountId = value;
   }

   constructor(private apiService: ApiService) {
      this.clientDetailsObserver = new BehaviorSubject<IClientDetails>(null);
   }

   private getClients(): Observable<any> {
      return this.apiService.clientDetails.getAll();
   }
   private getPreferences(): Observable<any> {
      return this.apiService.clientPreferences.getAll();
   }

   getClientDetail() {
      Observable.forkJoin(this.getPreferences(), this.getClients()).subscribe(results => {
         this.clientDetails = results[1];
         this.clientDetails.oldFullNames = this.clientDetails.FullNames;

         this.clientDetails.FullNames = this.getFullName(this.clientDetails.FirstName, this.clientDetails.Surname);
         this.setPreferredData(results[0]);
         this.updateClientDetailsData(this.clientDetails);
      });
   }

   updateClientDetailsData(clientDeatils) {
      this.clientDetailsObserver.next(clientDeatils);
      this.isClientObserverUpdated = true;
   }


   private setPreferredData(data: IClientPreferenceDetails[]) {
      if (data) {
         data.forEach((element) => {
            if (element.PreferenceKey === Constants.profile.PreferredName) {
               this.clientDetails.PreferredName = element.PreferenceValue;
            } else if (element.PreferenceKey === Constants.profile.DefaultAccount) {
               this.clientDetails.DefaultAccountId = element.PreferenceValue;
            }
         });
      }
   }

   private getFullName(firstName: string, surName?: string) {
      return firstName + ' ' + surName;
   }

   public getDefaultAccount(accounts: IAccountDetail[]) {
      let deafultAccount;
      if (this.clientDetails.DefaultAccountId && accounts && accounts.length > 0) {
         deafultAccount = accounts.find(account => account.itemAccountId === this.clientDetails.DefaultAccountId);
      }
      return deafultAccount;
   }
   public getClientPreferenceDetails(): IClientDetails {
      return this.clientDetails;
   }
}
