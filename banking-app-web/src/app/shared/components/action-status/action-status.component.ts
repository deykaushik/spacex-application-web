import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationTypes } from '../../../core/utils/enums';
import { IStatusDetail } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';

@Component({
   selector: 'app-action-status',
   templateUrl: './action-status.component.html',
   styleUrls: ['./action-status.component.scss']
})
export class ActionStatusComponent {

   @Input() status: NotificationTypes = NotificationTypes.None;
   @Input() statusDetail: IStatusDetail;
   @Input() requestInProgress: boolean;
   @Input() retryLimitExceeded: boolean;
   @Output() onRetry = new EventEmitter<boolean>();
   @Output() onDone = new EventEmitter<boolean>();

   notificationTypes = NotificationTypes;

   labels = Constants.labels;

   onTryAgain() {
      this.retryLimitExceeded ? this.onRetry.emit(false) : this.onRetry.emit(true);
   }

   onDoneClick() {
      this.onDone.emit();
   }

}

