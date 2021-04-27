import { Component, OnInit, Injector } from '@angular/core';
import { animate, state, style, transition, trigger, group } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from '../account.service';
import { IDebitOrdersDetail, IMandateOrdersDetail, IDebitOrder } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { pendingMandatesSkeletonData } from './../../core/data/skeleton-data';
import { debitOrdersIS as exisitingDebitOrdersSkeletonData } from './../../core/data/skeleton-data';
import { CommonUtility } from './../../core/utils/common';
import { BaseComponent } from '../../core/components/base/base.component';
@Component({
   templateUrl: './debit-orders.component.html',
   styleUrls: ['./debit-orders.component.scss']
})
export class DebitOrdersComponent extends BaseComponent implements OnInit {
   isDeclineMandateinProgress: boolean;
   isAcceptMandateinProgress: boolean;
   showMandateError: boolean;
   selectedMandateOrder: IMandateOrdersDetail;
   accountId: number;
   debitOrdersToApprove: IMandateOrdersDetail[] = [];
   activeDebitOrders: IDebitOrder[] = [];
   stoppedDebitOrders: IDebitOrder[] = [];
   dateformates = Constants.formats;
   skeletonMode: Boolean;
   disputingOrder: IDebitOrdersDetail;
   disputingIndex: number;
   mandateStatus = Constants.VariableValues.mandateStatus;
   isMandateOverayVisible: boolean;
   showMandateDone: boolean;
   accountNumber: number;
   accountType: string;
   accountName: string;
   debitOpsSuccess: {
      message: string,
      infoMsg: string
   };
   dateFormat = 'dd MMMM yyyy';
   dateFormatDebitOrdersList = Constants.formats.ddMMMyyyy;
   messages = Constants.messages.debitOrders;
   labels = Constants.labels.debitOrder;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   showDetailedDebitOrder = false;
   selectedAccountDetails: IDebitOrder;
   debitOrderCodes = Constants.VariableValues.debitOrder;

   constructor(private accountService: AccountService, private route: ActivatedRoute, injector: Injector, private router: Router) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.skeletonMode = true;
      const selectedAccount = this.accountService.getAccountData();
      this.getExistingDebitOrders(this.accountId);
      if (selectedAccount && selectedAccount.ItemAccountId === this.accountId) {
         this.accountNumber = selectedAccount.AccountNumber;
         this.accountType = CommonUtility.getAccountTypeName(selectedAccount.AccountType);
         this.accountName = selectedAccount.AccountName;
      }
   }
   getExistingDebitOrders(accountId: number) {
      // assign skeleton data till actual data comes from service
      this.activeDebitOrders = exisitingDebitOrdersSkeletonData;
      this.debitOrdersToApprove = pendingMandatesSkeletonData;
      this.stoppedDebitOrders = exisitingDebitOrdersSkeletonData;
      this.accountService.getDebitOrders(accountId).subscribe((data: any[]) => {
         this.activeDebitOrders = null;
         this.debitOrdersToApprove = null;
         if (data[1]) {
            const pendingMandates = data[1].filter(m => m.MandateStatus === this.mandateStatus.Pending);
            this.debitOrdersToApprove = pendingMandates;
         }
         const debitOrders = data[0];
         if (debitOrders) {
            this.activeDebitOrders = debitOrders.filter(debitOrder =>
               debitOrder.debitOrderType === this.debitOrderCodes.orderType.existing).reverse();
            this.stoppedDebitOrders = debitOrders.filter(debitOrder =>
               debitOrder.debitOrderType === this.debitOrderCodes.orderType.stopped).reverse();
         }
         this.skeletonMode = false;
      });
   }
   hideMandateOverlay() {
      this.isMandateOverayVisible = false;
      this.showMandateError = undefined;
      this.showMandateDone = undefined;

   }
   showMandateOverlay(mandateOrder) {
      this.selectedMandateOrder = mandateOrder;
      this.isMandateOverayVisible = true;
   }

   AcceptMandateOrder() {
      this.isAcceptMandateinProgress = true;
      this.accountService.AcceptMandateOrder({ autenticationStatusInd: Constants.MandateOrders.AcceptanceCode },
         { mandateId: this.selectedMandateOrder.MandateIdentifier }).subscribe(response => {
            this.isAcceptMandateinProgress = false;
            if (response && this.accountService.isMandateSuccess(response)) {
               this.showMandateDone = true;
               this.getExistingDebitOrders(this.accountId);
               this.debitOpsSuccess = {
                  message: 'Debit order approved successfully.',
                  infoMsg: 'The debit order will now be displayed as one of your monthly debit orders'
               };
            } else {
               this.showMandateError = true;
            }
         }, error => this.showMandateError = true);
   }
   DeclineMandateOrder() {
      this.isDeclineMandateinProgress = true;
      this.accountService.DeclineMandateOrder({ autenticationStatusInd: Constants.MandateOrders.RejectionCode },
         { mandateId: this.selectedMandateOrder.MandateIdentifier }).subscribe(response => {
            this.isDeclineMandateinProgress = false;
            if (response && this.accountService.isMandateSuccess(response)) {
               this.getExistingDebitOrders(this.accountId);
               this.showMandateDone = true;
               this.debitOpsSuccess = {
                  message: 'Debit order declined successfully.',
                  infoMsg: 'The debit order will not be displayed as one of your monthly debit orders.'
               };
            } else {
               this.showMandateError = true;
            }
         }, error => this.showMandateError = true);
   }
   onRetryMandate() {
      this.showMandateError = undefined;
   }

   // navigate from details view to listing view
   goToPreviousPage() {
      if (this.showDetailedDebitOrder) {
         this.showDetailedDebitOrder = !this.showDetailedDebitOrder;
         this.skeletonMode = true;
         this.getExistingDebitOrders(this.accountId);
      } else {
         this.router.navigateByUrl(encodeURI(Constants.routeUrls.accountDetail + this.accountId));
      }
   }
   showDebitOrderDetails(orderDetails: IDebitOrder) {
      this.selectedAccountDetails = orderDetails;
      this.showDetailedDebitOrder = true;
   }
   hideDetails(event: boolean) {
      if (event) {
         this.showDetailedDebitOrder = false;
         this.skeletonMode = true;
         this.getExistingDebitOrders(this.accountId);
      } else {
         this.showDetailedDebitOrder = true;
      }
   }
}
