import { Component, OnInit, Output, EventEmitter, OnDestroy, Renderer2, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { OpenAccountService } from '../open-account.service';
import { Constants } from '../constants';
import { DOCUMENT } from '@angular/common';

@Component({
   selector: 'app-open-new-account',
   templateUrl: './open-new-account.component.html',
   styleUrls: ['./open-new-account.component.scss']
})
export class OpenNewAccountComponent implements OnInit, OnDestroy {
   labels = Constants.labels.openAccount;
   openAccountMessages = Constants.messages.openNewAccount;
   openAccountValues = Constants.variableValues.openNewAccount;
   isChecked = true;
   isOverlayVisible: boolean;
   closeBtnText = this.labels.closeBtnText;
   isTermsAndCondition: boolean;
   isRightOptions: boolean;
   showReasonError: boolean;
   isValidClientType: boolean;
   clientType: string;
   showLoader = true;

   constructor(private router: Router, private openAccountService: OpenAccountService,
      private clientProfileDetailsService: ClientProfileDetailsService, private render: Renderer2,
      @Inject(DOCUMENT) private document: Document) { }

   ngOnInit() {
      this.render.setStyle(this.document.body, 'overflow-y', 'hidden');
      this.isOverlayVisible = true;
      this.clientProfileDetailsService.clientDetailsObserver
      .subscribe(response => {
         if (response) {
            this.clientType = response.ClientType;
            this.getFicaStatus();
         }
      });
   }

   getFicaStatus() {
      this.showLoader = true;
      this.openAccountService.getficaStatus()
      .finally(() => {
            this.showLoader = false;
         })
      .subscribe(result => {
         if (result.isFica && ((this.clientType !== this.openAccountValues.clientType51) ||
            (this.clientType !== this.openAccountValues.clientType52)) ) {
            this.isTermsAndCondition = true;
            this.showReasonError = false;
         } else {
            this.showReasonError = true;
            this.isValidClientType = (this.clientType === this.openAccountValues.clientType51
               || this.clientType === this.openAccountValues.clientType52);
         }
      }, error => {
            this.router.navigateByUrl(Constants.routeUrls.dashboard);
      });
   }

   isCheck(value) {
      this.isChecked = !this.isChecked;
   }

   onAccept() {
      this.isRightOptions = true;
      this.isTermsAndCondition = false;
   }

   backToOverview() {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   closeOverlay(value) {
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }

   showDashboard(value) {
      this.closeOverlay(value);
   }

   ngOnDestroy() {
      this.render.setStyle(this.document.body, 'overflow-y', 'auto');
   }
}
