import { Component, Input, OnInit, Injector, Output, EventEmitter } from '@angular/core';
import { IScheduledTransactionType, IScheduledTransaction } from '../../../core/services/models';
import { Router } from '@angular/router';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { BaseComponent } from '../../../core/components/base/base.component';

@Component({
   selector: 'app-scheduled-transaction',
   templateUrl: './scheduled-transaction.component.html',
   styleUrls: ['./scheduled-transaction.component.scss']
})
export class ScheduledTransactionComponent extends BaseComponent implements OnInit {
   isShowSuccessMessage: boolean;
   editUrl: string;
   showEditButton: boolean;
   showModal = false;
   @Output() editSchedule = new EventEmitter<IScheduledTransactionType>();
   @Input() scheduleTransactionDetail: IScheduledTransactionType;
   @Input() sourcePage: string;
   navigateUrl: string;
   showBorder: boolean;
   constructor(private router: Router, injector: Injector) {
      super(injector);
   }
   @Input() skeletonMode: Boolean;
   ngOnInit() {
      if (this.sourcePage === Constants.labels.recipient) {
         this.navigateUrl = CommonUtility.format(Constants.path.recipientSchedulePayments, this.scheduleTransactionDetail.type,
            this.scheduleTransactionDetail.transaction.transactionID);
         this.editUrl = CommonUtility.format(Constants.path.recipientEditSchedulePayments, this.scheduleTransactionDetail.type,
            this.scheduleTransactionDetail.transaction.transactionID);
         this.showBorder = true;
         this.showEditButton = true;
      } else {
         this.navigateUrl = this.router.url + '/' + this.scheduleTransactionDetail.type + '/'
            + this.scheduleTransactionDetail.transaction.transactionID;
      }
   }

   openTransaction() {
      this.router.navigateByUrl(this.navigateUrl);
   }
}

