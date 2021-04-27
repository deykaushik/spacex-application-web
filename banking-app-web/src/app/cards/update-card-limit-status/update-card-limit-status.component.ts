import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Constants } from '../../core/utils/constants';
import { CardService } from '../card.service';
import { ICardLimitUpdateResult } from '../models';

@Component({
   selector: 'app-update-card-limit-status',
   templateUrl: './update-card-limit-status.component.html',
   styleUrls: ['./update-card-limit-status.component.scss']
})
export class UpdateCardLimitStatusComponent implements OnInit {

   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   @Input() limitUpdatedStatus: ICardLimitUpdateResult;
   successMessage = Constants.labels.updateAtmLimit.success;
   failureMessage = Constants.labels.updateAtmLimit.fail;
   isButtonLoader = false;
   isLoaded = false;
   retryCount = 0;
   @Output() onDone = new EventEmitter();
   constructor(private cardService: CardService) { }

   ngOnInit() {
      this.isLoaded = true;
      this.cardService.cardLimitUpdateEmitter.subscribe(isLimitUpdatedStatus => {
         this.refreshStatus(isLimitUpdatedStatus);
      });
   }
   hide() {
      this.onDone.emit(true);
   }
   refreshStatus(isLimitUpdatedStatus) {
      this.isButtonLoader = false;
      this.limitUpdatedStatus = isLimitUpdatedStatus;
   }

   retryUpdateAtmLimit() {
      this.retryCount++;
      if (this.retryCount > 3) {
         return;
      }
      this.isButtonLoader = true;
      if (this.limitUpdatedStatus.DCIndicator === Constants.CardTypes.CreditCard) {
         this.cardService.updateCardLimit(this.limitUpdatedStatus.cardNumber, this.limitUpdatedStatus.newLimit,
            this.limitUpdatedStatus.oldLimit, this.limitUpdatedStatus.plasticId, this.limitUpdatedStatus.camsDailyAtmCash);
      } else {
         this.cardService.updateDebitCardLimit(this.limitUpdatedStatus.cardNumber, this.limitUpdatedStatus.newLimit,
            this.limitUpdatedStatus.oldLimit, this.limitUpdatedStatus.accountId);
      }
   }
}
