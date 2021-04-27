import { Component, Input, OnInit, Injector } from '@angular/core';

import { ClientProfileDetailsService } from './../../core/services/client-profile-details.service';
import { IBankerDetail } from '../../core/services/models';
import { WindowRefService } from './../../core/services/window-ref.service';
import { BaseComponent } from '../../core/components/base/base.component';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { GAEvents } from '../../core/utils/ga-event';
import { Router } from '@angular/router';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { ProfileService } from '../profile.service';

@Component({
   selector: 'app-view-banker',
   templateUrl: './view-banker.component.html',
   styleUrls: ['./view-banker.component.scss']
})

export class ViewBankerComponent extends BaseComponent implements OnInit {
   mailtoLink: string;
   skeletonMode = false;
   telephoneNumber: string;
   bankerName = '';
   bankerEmail: string;
   bankerDetails: IBankerDetail;
   apiFailed = false;
   bankerImage: string;
   noBanker = false;
   retryServiceCount = 0;
   isFailedBlockClose = true;
   isImageAvailable = false;
   bankerDetailMock: IBankerDetail;
   SecOfficerCd = '0';
   isViewBanker: boolean;
   labels = Constants.labels.viewBanker;
   division: string;
   isDetailView = false;
   profileMenu = Constants.labels.headerMenuLables.profile;

   constructor(private profileService: ProfileService,
      private clientService: ClientProfileDetailsService,
      private router: Router,
      private headerMenuService: HeaderMenuService,
      private windowRef: WindowRefService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.isViewBanker = this.clientService.isViewBanker;
      this.SecOfficerCd = this.clientService.SecOfficerCd;

      this.mailtoLink = 'mailto:';
      this.getBankerDetails();
   }
   formatTelephone(contactNumber: string) {
      let contactNum = contactNumber.indexOf('(0)') === -1 ? contactNumber.replace(/[\s]/g, '')
         : (contactNumber.replace('(0)', '')).replace(/[\s]/g, '');
      if (contactNumber.indexOf('0') === 0) {
         contactNum = contactNum.replace(contactNum.substring(0, 2), contactNum.substring(0, 2) + ' ');
      } else {
         contactNum = contactNum.replace(contactNum.substring(0, 3), contactNum.substring(0, 3) + ' ');
      } contactNum = contactNum.replace(contactNum.substring
         (contactNum.indexOf('+27 '), contactNum.indexOf('+27 ') + 6), contactNum.substring
            (contactNum.indexOf('+27 '), contactNum.indexOf('+27 ') + 6) + ' ');
      contactNum = contactNum.replace(contactNum.substring(contactNum.indexOf('+27 '), contactNum.indexOf('+27 ') + 10)
         , contactNum.substring(contactNum.indexOf('+27 '), contactNum.indexOf('+27 ') + 10) + ' ');
      return contactNum;
   }

   sendMail() {
      this.windowRef.nativeWindow.location.href = this.mailtoLink + this.bankerEmail.toLowerCase();
      const viewBanker = Object.assign({}, GAEvents.viewBanker.emailAddressClick);
      viewBanker.value = this.division;
      viewBanker.label += this.division;
      this.sendEvent(viewBanker.eventAction, viewBanker.label,
         viewBanker.value, viewBanker.category);
   }

   getBankerDetails() {
      this.skeletonMode = true;
      if (this.SecOfficerCd) {
         this.profileService.getBankerDetails(this.SecOfficerCd).subscribe(response => {
            if (response) {
               this.setBankerDetails(response);
               const viewBankerSuccess = Object.assign({}, GAEvents.viewBanker.success);
               viewBankerSuccess.value = this.division;
               viewBankerSuccess.label += this.division;
               this.sendEvent(viewBankerSuccess.eventAction, viewBankerSuccess.label,
                  viewBankerSuccess.value, viewBankerSuccess.category);
            }
         }, (error) => {
            this.apiFailed = true;
            this.isFailedBlockClose = false;
            const viewBankerFailed = Object.assign({}, GAEvents.viewBanker.failure);
            viewBankerFailed.value = this.division;
            viewBankerFailed.label += this.division;
            this.bankerEmail = this.labels.defaultEmail;
            this.telephoneNumber = this.labels.defaultPhone;
            this.sendEvent(viewBankerFailed.eventAction, viewBankerFailed.label,
               viewBankerFailed.value, viewBankerFailed.category);
            this.skeletonMode = false;
         });
      }
   }

   retryService() {
      this.retryServiceCount = this.retryServiceCount + 1;
      if (this.retryServiceCount < 3) {
         this.isFailedBlockClose  =  true;
         this.getBankerDetails();
      }
      if (this.retryServiceCount > 2) {
         this.router.navigateByUrl('/dashboard');
      }
   }
   getBankerInitials(bankerFullName: string): string {
      if (bankerFullName) {
         return CommonUtility.getAcronymName(bankerFullName);
      }
   }
   setBankerDetails(serviceResponse: IBankerDetail) {
      this.bankerDetails = serviceResponse;
      if ((this.bankerDetails.bankerPicture).length > 0) {
         this.bankerImage = 'data:image/jpeg;base64,' + this.bankerDetails.bankerPicture;
         this.isImageAvailable = true;
      }
      this.apiFailed = false;
      this.noBanker = this.bankerDetails.isDefaultBanker;
      if (!this.noBanker) {
         this.bankerEmail = this.bankerDetails.emailAddress.toLowerCase();
         this.bankerName = this.bankerDetails.firstName + ' ' + this.bankerDetails.lastName;
         if (this.bankerDetails.cellPhoneNumber) {
            this.telephoneNumber = this.formatTelephone(this.bankerDetails.cellPhoneNumber);
            this.skeletonMode = false;
         } else if (this.bankerDetails.workNumber) {
            this.telephoneNumber = this.formatTelephone(this.bankerDetails.workNumber);
            this.skeletonMode = false;
         } else {
            this.profileService.getBankerDetails('0').subscribe(noBankerResponse => {
               const noBankerDetails = noBankerResponse as IBankerDetail;
               this.telephoneNumber = this.formatTelephone(noBankerDetails.workNumber);
               this.bankerEmail = this.bankerEmail ? this.bankerEmail.toLowerCase() : noBankerDetails.emailAddress.toLowerCase();
               this.skeletonMode = false;
            });
         }
      } else {
         this.telephoneNumber = this.formatTelephone(this.bankerDetails.workNumber);
         this.bankerEmail = this.bankerDetails.emailAddress.toLowerCase();
         this.skeletonMode = false;
      }
   }

   openProfileMenu(menuText: string) {
      this.headerMenuService.openHeaderMenu(menuText);
   }
}
