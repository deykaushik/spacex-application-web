import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef, Input, SimpleChanges, OnChanges } from '@angular/core';
import { AlertActionType, AlertMessageType } from '../../enums';
import { environment } from '../../../../environments/environment';

@Component({
   selector: 'app-message-alert',
   templateUrl: './message-alert.component.html',
   styleUrls: ['./message-alert.component.scss']
})

export class MessageAlertComponent implements OnInit, OnChanges {
   @Input() showAlert: boolean;
   @Input() displayMessageText: string;
   @Input() linkDisplayText: string;
   @Input() action: AlertActionType;
   @Input() alertType: AlertMessageType;
   @Output() onAlertLinkEmit = new EventEmitter<AlertActionType>();
   showForgotDetails = environment.features.forgotDetails;

   constructor() { }

   ngOnInit() {
      this.onValuesChanged();
   }

   ngOnChanges(changes: SimpleChanges) {
      this.onValuesChanged();
   }

   onValuesChanged() {
      try {
         if (!this.showForgotDetails && this.action === AlertActionType.ForgotDetails) {
            this.action = AlertActionType.None;
            this.linkDisplayText = '';
         }
      } catch (e) { }
   }

   onErrorLink() {
      this.onAlertLinkEmit.emit(this.action);
   }

   onCloseMsg() {
      this.showAlert = false;
      this.onAlertLinkEmit.emit(AlertActionType.Close);
   }
}

