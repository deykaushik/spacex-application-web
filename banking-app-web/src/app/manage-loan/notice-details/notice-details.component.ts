import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { AccountService } from '../../dashboard/account.service';
import { IAccountBalanceDetail } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { ManageLoanConstants } from '../constants';

@Component({
   selector: 'app-notice-details',
   templateUrl: './notice-details.component.html',
   styleUrls: ['./notice-details.component.scss']
})
export class NoticeDetailsComponent implements OnInit {

   @Input() accountId: number;
   @Output() isEarlyTerminationFee = new EventEmitter<boolean>();
   skeletonMode: boolean;
   noticeDetails: IAccountBalanceDetail;
   dateFormat = Constants.formats.momentDDMMMMYYYY;
   currentDate = moment().format(this.dateFormat);
   labels = ManageLoanConstants.labels.noticeDetails;
   isDateBefore: boolean;

   constructor(private accountService: AccountService) { }

   ngOnInit() {
      this.getNoticeDetails();
   }

   getNoticeDetails() {
      this.skeletonMode = true;
      this.accountService.getAccountBalanceDetail(Number(this.accountId))
         .finally(() => {
            this.skeletonMode = false;
         })
         .subscribe((response: IAccountBalanceDetail) => {
            this.noticeDetails = response;
            if (this.noticeDetails) {
               this.isExpiryDateExceeds(this.noticeDetails.loanCancellationNoticeExpiryDate);
               this.noticeDetails.loanCancellationDate
                  = moment(this.noticeDetails.loanCancellationDate).format(this.dateFormat);
               this.noticeDetails.loanCancellationNoticeExpiryDate
                  = moment(this.noticeDetails.loanCancellationNoticeExpiryDate).format(this.dateFormat);
               this.noticeDetails.loanExpectedClosureDate
                  = moment(this.noticeDetails.loanExpectedClosureDate).format(this.dateFormat);
            }
         });
   }

   isExpiryDateExceeds(expiryDate) {
      const dateToBeChecked = moment(expiryDate).format(this.dateFormat);
      if (dateToBeChecked) {
         this.isDateBefore = moment(this.currentDate).isSameOrBefore(dateToBeChecked);
         this.isEarlyTerminationFee.emit(this.isDateBefore);
      }
   }
}
