import {
   Router,
   Event as RouterEvent,
   NavigationStart,
   NavigationEnd,
   NavigationCancel,
   NavigationError
} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IChatProperties, IClientDetails, IDcarRangeDetails } from '../../core/services/models';
import { ChatService } from '../../chat/chat.service';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { ISubscription } from '../../../../node_modules/rxjs/Subscription';
import { TrusteerService } from '../../core/services/trusteer-service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { AccountService } from '../account.service';

@Component({
   selector: 'app-landing',
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
   triggerSlide: boolean;
   showLottoPallet = environment.features.lottoPallet;
   showViewBankerFeature = environment.features.viewBanker;
   chatActive: boolean;
   showTrusteerSplash: boolean;
   showOpenNewAccount = environment.features.openNewAccount;
   clientDetails: IClientDetails;
   SecOfficerCd = '0';
   dcarRange: IDcarRangeDetails;
   isViewBanker = false;
   showNotification = environment.features.preApprovedOffers;
   isAccountsBlur = false;
   constructor(private chatService: ChatService,
      private trusteerService: TrusteerService,
      private clientService: ClientProfileDetailsService,
      private accountService: AccountService,
      private router: Router) {
   }
   ngOnInit() {
      this.chatService.getChatActive().subscribe((properties: IChatProperties) => {
         this.chatActive = properties.chatActive;
      });
      this.showTrusteerSplash = environment.features.trusteer;
      if (JSON.parse(localStorage.getItem('Trusteer')) &&
         JSON.parse(localStorage.getItem('TrusteerCount')) < environment.rapportSetting.showcount) {
         this.trusteerService.ShowTrusteer(true).subscribe((value) => {
            this.showTrusteerSplash = value;
         });
      } else {
         this.trusteerService.ShowTrusteer(true).subscribe((value) => {
            this.showTrusteerSplash = value;
         });
         this.trusteerService.CloseTrusteer();
         this.showTrusteerSplash = false;
      }
      this.router.events.subscribe((event: RouterEvent) => {
         this.navigationInterceptor(event);
      });
      this.getDcarDetails();
   }

   getDcarDetails() {
      this.clientDetails = this.clientService.getClientPreferenceDetails();
      if (this.clientDetails) {
         this.SecOfficerCd = this.clientDetails.SecOfficerCd;
      }
      if (this.SecOfficerCd) {
         this.accountService.getDcarRange(this.SecOfficerCd).subscribe(response => {
            if (response) {
               this.isDecarRangeBanker(response[0]);
            }
         }, (error) => {
            this.isViewBanker = false;
         });
      }
   }

   isDecarRangeBanker(dcarRangeResponse: IDcarRangeDetails) {
      this.dcarRange = dcarRangeResponse;
      if (this.dcarRange && (this.dcarRange.division === 'RRB' || this.dcarRange.division === 'BB')) {
         this.isViewBanker = true;
      } else {
         this.isViewBanker = false;
      }
   }

   navigationInterceptor(event: RouterEvent): void { }

   triggerSlider(value) {
      this.triggerSlide = value;
   }
   isQuickPayFocus(focus) {
      this.isAccountsBlur = focus;
   }
}
