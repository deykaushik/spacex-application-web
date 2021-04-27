import { Component, OnInit, Output, EventEmitter, Input, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../core/components/base/base.component';
import { IAccountBalanceDetail, IOverdraftAttempts } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { AccountService } from '../../account.service';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-overdraft-limit-view',
   templateUrl: './overdraft-limit-view.component.html',
   styleUrls: ['./overdraft-limit-view.component.scss']
})
export class OverdraftLimitViewComponent extends BaseComponent implements OnInit {
   @Output() backToCard: EventEmitter<boolean> = new EventEmitter<boolean>();

   overdraftAttempt: number;
   usedAmount: number;
   progressBar: number;
   availableOverdraftBalance: number;
   isChangeLimit: boolean;
   isCancelLimit: boolean;
   labels = Constants.labels.overdraft;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   OverdraftRouteUrls = Constants.routeUrls;
   isSkeletonMode: boolean;
   itemAccountId: number;
   accountBalanceDetails: IAccountBalanceDetail;
   overdraftAttemptMsg: string;

   constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router, injector: Injector) {
      super(injector);
      this.route.params.subscribe(params => this.itemAccountId = params.accountId);
   }

   ngOnInit() {
      this.isChangeLimit = false;
      this.isCancelLimit = false;
      this.isSkeletonMode = true;
      this.getAccountBalancesAndOverdraftLimit(this.itemAccountId);
   }

   /* Get account balances and overdraft limit/amount */
   getAccountBalancesAndOverdraftLimit(itemAccountId: number) {
      this.accountService.getAccountBalanceDetail(itemAccountId).subscribe((response) => {
         this.accountBalanceDetails = response;
         this.getAccountOverdraftLimit();
         this.getAccountOverdraftAttempt(this.itemAccountId);
      }, error => {
         this.isSkeletonMode = false;
      });
   }

   /* Get the overdraft limit and calculate used-amount, avaiable overdraft balance */
   getAccountOverdraftLimit() {
      if (this.accountBalanceDetails.availableBalance > 0) {
         this.usedAmount = this.accountBalanceDetails.availableBalance >= this.accountBalanceDetails.overdraftLimit ? 0 :
            this.accountBalanceDetails.overdraftLimit - this.accountBalanceDetails.availableBalance;
      } else {
         this.usedAmount = this.accountBalanceDetails.overdraftLimit;
      }
      this.progressBar = 100 * this.usedAmount / this.accountBalanceDetails.overdraftLimit;
      this.availableOverdraftBalance = this.accountBalanceDetails.overdraftLimit - this.usedAmount;
   }

   /* Get overdraft attempts */
   getAccountOverdraftAttempt(itemAccountId: number) {
      this.accountService.getAccountOverdraftAttempts(itemAccountId).subscribe((response) => {
         this.overdraftAttempt = response.data.overdraftAttempts;
         this.overdraftAttemptMsg = CommonUtility.format(this.labels.overdraftAttempt, response.data.remainingTime,
            response.data.remainingTime === '1' ? this.labels.hour : this.labels.hours);
         this.isSkeletonMode = false;
      }, error => {
         this.isSkeletonMode = false;
      });
   }

   /* Close overlay and navigate to account details page */
   closeOverlay() {
      this.router.navigateByUrl(encodeURI(this.OverdraftRouteUrls.accountDetail + this.itemAccountId));
   }

   /*to resolved disable button issue in Edge browser  */
   overdraftChangeLimit(label: string) {
      if (!this.overdraftAttempt && !this.isSkeletonMode) {
         if (label === this.labels.changeLimit) {
            const changeGAEvent = GAEvents.manageOverdraft.change;
            this.sendEvent(changeGAEvent.eventAction, changeGAEvent.label, null, changeGAEvent.category);
            this.isChangeLimit = !this.isChangeLimit;
         } else {
            const cancelGAEvent = GAEvents.manageOverdraft.cancel;
            this.sendEvent(cancelGAEvent.eventAction, cancelGAEvent.label, null, cancelGAEvent.category);
            this.isCancelLimit = !this.isCancelLimit;
         }
      }
   }
}
