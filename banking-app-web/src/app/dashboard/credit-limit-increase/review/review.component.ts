import { Router } from '@angular/router';
import { Component, OnInit, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { CreditLimitService } from '../credit-limit.service';
import { WindowRefService } from '../../../core/services/window-ref.service';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { ICreditLimitMaintenance, IClientDetails } from '../../../core/services/models';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';

@Component({
   selector: 'app-review',
   templateUrl: './review.component.html',
   styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
   labels = CreditLimitMaintenance.labels;
   messages = CreditLimitMaintenance.messages;
   informations = CreditLimitMaintenance.informations;
   title: string;
   status: string;
   accountId: string;
   creditLimitDetails: ICreditLimitMaintenance;
   isTooltip: boolean;
   clientDetails: IClientDetails;

   constructor(private creditLimitService: CreditLimitService, private router: Router,
      private windowRef: WindowRefService, private render: Renderer2,
      private clientPreferences: ClientProfileDetailsService) { }

   ngOnInit() {
      this.accountId = this.creditLimitService.getAccountId();
      this.isTooltip = false;
      this.title = this.informations.almostDone;
      this.status = this.informations.almostDoneStatus;
      this.clientDetails = this.clientPreferences.getClientPreferenceDetails();
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
   }

   openTooltip(event) {
      this.isTooltip = event;
   }
   goToAccount(event) {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
      this.router.navigateByUrl('/dashboard/account/detail/' + this.accountId);
   }
   sendMail() {
      this.windowRef.nativeWindow.location.href = this.labels.mailTo +
         this.labels.body + this.clientDetails.FirstName + ' ' + this.clientDetails.Surname + ' #'
         + this.clientDetails.IdOrTaxIdNo + ' ' + this.labels.pleaseRemember;
   }
}
