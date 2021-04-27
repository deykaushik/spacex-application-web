import { Component, OnInit } from '@angular/core';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { CommonUtility } from '../../core/utils/common';
import { IClientPreferenceDetails, IClientDetails } from '../../core/services/models';
import { ProfileDetails, ClientPreferences, IEditClientProfileEmitter } from '../profile.models';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-profile-details',
   templateUrl: './profile-details.component.html',
   styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {
   private clientProfileDetails: IClientDetails;
   public profileDetails: ProfileDetails;
   public preferenceName = '';
   public actualName = '';
   public clientPreference: ClientPreferences;
   public isSuccess: boolean;
   public isFailure: boolean;
   public clientInitials: string;
   profileMenu = Constants.labels.headerMenuLables.profile;
   constructor(private clientProfileDetailsService: ClientProfileDetailsService,
      private headerMenuService: HeaderMenuService) { }

   ngOnInit() {
      this.getClientProfileDetails();
      this.isSuccess = false;
      this.isFailure = false;
   }
   public updateClientPreferredName(val: IEditClientProfileEmitter) {
      if (val.Status) {
         this.preferenceName = val.PreferredName;
         this.updateClientObserve(val.PreferredName);
         this.isSuccess = val.Status;
      } else {
         this.isFailure = val.Status;
      }
   }
   public closeSuccessError() {
      this.isSuccess = false;
   }
   public closeFailureError() {
      this.isFailure = false;
   }

   private getClientProfileDetails() {
      this.clientProfileDetailsService.clientDetailsObserver.subscribe(clientDetails => {
         if (clientDetails) {
            this.clientProfileDetails = clientDetails;
            this.profileDetails = new ProfileDetails;
            this.profileDetails.FullNames = clientDetails.FullNames;
            this.profileDetails.RsaId = clientDetails.IdOrTaxIdNo;
            this.profileDetails.PassportNumber = clientDetails.PassportNo;
            this.profileDetails.Resident = clientDetails.Resident;
            this.actualName = clientDetails.FullNames;
            this.profileDetails.Address = clientDetails.Address;
            this.profileDetails.EmailAddress = clientDetails.EmailAddress;
            this.profileDetails.CellNumber = clientDetails.CellNumber;
            this.preferenceName = clientDetails.PreferredName ? clientDetails.PreferredName : clientDetails.FirstName;
            this.clientInitials = CommonUtility.getAcronymName(clientDetails.FullNames);
         }
      });

   }

   openProfileMenu(menuText: string) {
      this.headerMenuService.openHeaderMenu(menuText);
   }
   private updateClientObserve(val) {
      this.clientProfileDetails.PreferredName = val;
      this.clientProfileDetailsService.updateClientDetailsData(this.clientProfileDetails);
   }
}
