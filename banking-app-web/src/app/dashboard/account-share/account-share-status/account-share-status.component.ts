import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NotificationTypes } from '../../../core/utils/enums';
import { ISharedContact } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';

@Component({
   selector: 'app-account-share-status',
   templateUrl: './account-share-status.component.html',
   styleUrls: ['./account-share-status.component.scss']
})
export class AccountShareStatusComponent {

   @Input() status: NotificationTypes = NotificationTypes.None;
   @Input() requestInprogress: boolean;
   @Input() retryLimitExceeded: boolean;
   @Output() onRetry = new EventEmitter<boolean>();
   @Input() recipients: ISharedContact[];

   notificationTypes = NotificationTypes;
   messages = Constants.messages.accountShare;
   labels = Constants.labels.accountShare;

   onRetrybuttonClick() {
      this.onRetry.emit(true);
   }

}
