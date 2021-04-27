import { Component, OnInit, Input } from '@angular/core';
import { CardService } from '../card.service';
import { ICardBlockResult, ICardReplaceResult, ICardReplaceInfo } from '../models';
import { Constants } from '../../core/utils/constants';
import { IReplaceCardPayload } from '../../core/services/models';

@Component({
   selector: 'app-replace-card-status',
   templateUrl: './replace-card-status.component.html',
   styleUrls: ['./replace-card-status.component.scss']
})
export class ReplaceCardStatusComponent implements OnInit {
   successMessage = 'Card replaced successfully';
   failureMessage = 'Card replacement unsuccessful';
   @Input() cardInfo: ICardReplaceResult;
   replaceCardStatus: ICardReplaceResult;
   private replaceRetryTimes = 1;
   disableRetryButton = false;
   requestInprogress = false;
   isButtonLoader = false;
   labels = Constants.labels;
   payload: IReplaceCardPayload;
   constructor(private cardService: CardService) { }

   ngOnInit() {
      this.payload = this.cardService.replaceCardPayload;
   }

   retryReplaceCard() {
      this.cardService.replaceCardBranchSelector(this.payload, this.onReplaceCard.bind(this), this.cardInfo.plasticId);
   }

   onReplaceCard() {
      this.isButtonLoader = false;
      this.requestInprogress = false;
   }

   hideReplaceCardStatusPopup() {
      this.cardService.closeReplaceCardStatusPopup();
   }

   onRetryReplaceCard() {
      if (!this.requestInprogress) {
         if (this.replaceRetryTimes <= Constants.VariableValues.maximumReplaceCardAttempts) {
            this.replaceRetryTimes++;
            this.requestInprogress = true;
            this.isButtonLoader = true;
            this.retryReplaceCard();
         } else {
            this.disableRetryButton = true;
         }
      }
   }
}
