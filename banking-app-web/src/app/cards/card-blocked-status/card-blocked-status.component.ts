import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { CardService } from '../card.service';
import { ICardBlockResult } from '../models';
import { CommonUtility } from '../../core/utils/common';
import { Constants } from '../../core/utils/constants';

@Component({
   selector: 'app-card-blocked-status',
   templateUrl: './card-blocked-status.component.html',
   styleUrls: ['./card-blocked-status.component.scss']
})
export class CardBlockedStatusComponent implements OnInit {
   successMessage = 'Card blocked successfully';
   failureMessage = 'Card block unsuccessful';
   @Input() blockStatus: ICardBlockResult;
   @Input() otherTravelCardBlocked: boolean;
   isTravelAccountCard: boolean;
   labels = Constants.labels;

   constructor(private cardService: CardService) { }

   ngOnInit() {
      this.isTravelAccountCard = CommonUtility.checkIfTravelCard(this.blockStatus.cardNumber);
   }

   retryBlockingCard() {
      this.cardService.retryBlockingCard(this.blockStatus.plasticId, this.blockStatus.cardNumber, this.blockStatus.reason);
   }

   replaceBlockCard() {
      this.cardService.closeBlockCardStatusPopup();
      this.cardService.replaceBlockCard(this.blockStatus.cardNumber, this.blockStatus.reason);
   }

   hideBlockCardStatusPopup() {
      this.cardService.closeBlockCardStatusPopup();
   }
}
