import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ManageLoanConstants } from '../constants';

@Component({
   selector: 'app-confirm-modal',
   templateUrl: './confirm-modal.component.html',
   styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

   @Input() isFromPlaceNotice: boolean;
   @Input() isJointBondAccount: boolean;
   @Input() requestInProgress: boolean;
   @Output() userActionClick = new EventEmitter<string>();

   labels = ManageLoanConstants.labels.confirmModal;
   title: string;

   ngOnInit() {
      this.title = this.isFromPlaceNotice ? this.labels.placeNoticeTitle : this.labels.cancelLoanTitle;
   }

   userAction(actionValue: string) {
      this.userActionClick.emit(actionValue);
   }
}
