import { Component, OnInit } from '@angular/core';
import { Constants } from '../core/utils/constants';
import { INavigationModel, IClientDetails, IDcarRangeDetails } from '../core/services/models';
import { ClientProfileDetailsService } from '../core/services/client-profile-details.service';
import { AccountService } from '../dashboard/account.service';
import { LoaderService } from '../core/services/loader.service';
import { ProfileService } from './profile.service';

@Component({
   selector: 'app-profile',
   templateUrl: './profile.component.html',
   styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

   public navMenus: INavigationModel[];
   public navTitle: String;
   clientDetails: IClientDetails;
   SecOfficerCd = '0';
   isViewBanker = false;
   division: string;
   private viewBankerNavigation: INavigationModel = Constants.VariableValues.profile.viewBankerNav;
   constructor(private clientService: ClientProfileDetailsService,
      private loader: LoaderService,
      private profileService: ProfileService) { }

   ngOnInit() {
      this.loader.show();
      this.navMenus = Constants.VariableValues.profile.navMenus;
      this.navTitle = Constants.VariableValues.profile.title;
      this.getDcarDetails();
   }

   getDcarDetails() {

      this.clientDetails = this.clientService.getClientPreferenceDetails();
      if (this.clientDetails) {
         this.SecOfficerCd = this.clientDetails.SecOfficerCd;
      }
      if (this.SecOfficerCd) {
         this.clientService.SecOfficerCd = this.SecOfficerCd;
         this.profileService.getDcarRange(this.SecOfficerCd).subscribe(response => {
            if (response) {
               this.isDecarRangeBanker(response[0]);
            }
         }, (error) => {
            this.isViewBanker = false;
            this.clientService.isViewBanker = this.isViewBanker;
         });
      }
   }

   isDecarRangeBanker(dcarRangeResponse: IDcarRangeDetails) {
      const navs = this.navMenus.filter((menu) => menu.url === this.viewBankerNavigation.url);
      if (dcarRangeResponse && (dcarRangeResponse.division === 'RRB' || dcarRangeResponse.division === 'BB')) {
         this.isViewBanker = true;
         if (navs && !navs.length) {
            this.navMenus.push(this.viewBankerNavigation);
         }
         this.division = dcarRangeResponse.division;
      } else {
         if (navs && navs.length) {
            const objIndex = this.navMenus.findIndex((menu) => menu.url === this.viewBankerNavigation.url);
            this.navMenus.splice(objIndex, 1);
         }
         this.isViewBanker = false;
      }
      this.loader.hide();
      this.clientService.isViewBanker = this.isViewBanker;
   }
}
