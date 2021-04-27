import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../../../../core/utils/constants';
import { NotificationTypes } from '../../../../../core/utils/enums';
@Component({
   selector: 'app-status',
   templateUrl: './status.component.html',
   styleUrls: ['./status.component.scss']
})
export class StatusComponent {

   @Input() status: NotificationTypes = NotificationTypes.None;
   @Input() accountId: string;
   @Input() showLoader: boolean;
   @Output() onRetry = new EventEmitter<boolean>();
   @Input() retryLimitExceeded: boolean;
   labels = Constants.labels.statementAndDocument.documents.mfc;
   notificationTypes = NotificationTypes;

   onRetryRequest() {
      this.retryLimitExceeded ? this.onRetry.emit(false) : this.onRetry.emit(true);
   }

}
