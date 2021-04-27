import { Router } from '@angular/router';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { CreditLimitService } from '../credit-limit.service';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { ICreditLimitMaintenance } from '../../../core/services/models';

@Component({
   selector: 'app-credit-success',
   templateUrl: './success.component.html',
   styleUrls: ['./success.component.scss']
})
export class CreditSuccessComponent implements OnInit {

   labels = CreditLimitMaintenance.labels;
   messages = CreditLimitMaintenance.messages;
   informations = CreditLimitMaintenance.informations;
   title: string;
   status: string;
   accountId: string;
   creditLimitDetails: ICreditLimitMaintenance;
   routerUrls = CreditLimitMaintenance.routerUrls;

   constructor(private creditLimitService: CreditLimitService, private router: Router,
      private render: Renderer2) {
   }

   ngOnInit() {
      this.accountId = this.creditLimitService.getAccountId();
      this.creditLimitDetails = this.creditLimitService.getCreditLimitMaintenanceDetails();
      this.title = this.informations.yourDone;
      this.status = this.informations.yourDoneStatus;
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
   }

   goToOverview() {
      this.render.setStyle(document.body, 'overflow-y', 'auto');
      this.router.navigateByUrl(this.routerUrls.dashboard + this.accountId);
   }
}
