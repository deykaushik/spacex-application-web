import { Component, ViewChild, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ITransactionDetail, ITravelCardPriorityDetails } from '../../core/services/models';
import * as moment from 'moment';
import { Moment } from 'moment';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface IBalaceInfo {
   y: number;
   t: Date;
   amount: number;
}

@Component({
   selector: 'app-account-pockets',
   templateUrl: './account-pockets.component.html',
   styleUrls: ['./account-pockets.component.scss']
})
export class AccountPocketsComponent implements OnInit {
   _pockets: ITravelCardPriorityDetails[];
   @Input() accountType: string;
   @Input('pockets')
   set pockets(value: ITravelCardPriorityDetails[]) {
       this._pockets = this.sortPockets(value);
   }
   @Input() accountNumber: number;
   @Input() itemAccountId: number;
   amountTransform = new AmountTransformPipe();
   skeletonMode: boolean;
   labels = Constants.labels;
   editMode = false;
   isDrag = null;
   isShowMessageBlock = false;
   showPocketPriority = environment.features.travelCardPriority;
   statusMessage = '';
   constructor(private router: Router, private accountServeice: AccountService) { }

   ngOnInit() {
      this._pockets = this.sortPockets(this._pockets);
   }

   getCurrencyName(currency: string) {
      return currency ? Constants.currencies[currency].fullName : '';
   }

   getCurrencySymbol(currency: string) {
      return currency ? Constants.currencies[currency].symbol : '';
   }

   onPocketClick(accountId: string, itemPocketCurrency: string) {
      if (itemPocketCurrency && accountId) {
         this.router.navigateByUrl(encodeURI('/dashboard/account/pocket/' + accountId + '/' + itemPocketCurrency));
      }
   }

   changePriority() {
      this.editMode = !this.editMode;
   }

   savePriorityOrder() {
      const tempPriority = [];
      this._pockets.forEach(pocket => {
         tempPriority.push({currency: {currency: pocket.currency.currency, amount: pocket.currency.amount}, priority: pocket.priority});
      });
      this.accountServeice.changePocketPriority(this.accountNumber, tempPriority).subscribe((savedStatus) => {
            this.editMode = !this.editMode;
            this.handleSuccessMessage(Constants.labels.priorityUpdateSuccessfulMessage);
      }, ((errorResponse) => {
         if (errorResponse.status === 200) {
            this.editMode = !this.editMode;
            this.handleSuccessMessage(Constants.labels.priorityUpdateSuccessfulMessage);
         }
      }));

   }

   cancelChangePriority() {
      this.editMode = !this.editMode;
   }

   reOrderPriority() {
      this._pockets.forEach((pocket, index) => {
         pocket.priority = index + 1;
      });
   }

   autoCloseMessageBlock() {
      setTimeout(() => {
         this.closeMessageBlock();
      }, Constants.VariableValues.settings.messageHideTimeout);
   }

   closeMessageBlock() {
      this.isShowMessageBlock = false;
   }

   handleSuccessMessage(message) {
      this.statusMessage = message;
      this.isShowMessageBlock = true;
      this.autoCloseMessageBlock();
   }

   enableDragIcon(index) {
      this.isDrag = index;
   }

   disableDragIcon(index) {
      this.isDrag = null;
   }

   sortPockets(pockets) {
      if (pockets && pockets.length) {
         return pockets.sort((a, b) => {
            return a.priority - b.priority;
        });
      }
   }
}
