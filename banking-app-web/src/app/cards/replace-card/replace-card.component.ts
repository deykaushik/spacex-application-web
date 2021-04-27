import { Component, OnInit, Input } from '@angular/core';
import { CommonUtility } from '../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import { IDropdownItem } from '../../core/utils/models';
import { CardService } from '../card.service';
import { ICardReplaceInfo } from '../models';


@Component({
   selector: 'app-replace-card',
   templateUrl: './replace-card.component.html',
   styleUrls: ['./replace-card.component.scss']
})
export class ReplaceCardComponent implements OnInit {

   @Input() cardInfo: ICardReplaceInfo;
   blockingReasons = CommonUtility.covertToDropdownObject(Constants.VariableValues.cardBlockingReasong);
   selectedReason: IDropdownItem;
   isAgree = false;
   isNextButtonEnabled = false;
   defaultReasonText = Constants.VariableValues.cardBlockingReasong.lost.text;

   constructor(private cardService: CardService) { }

   ngOnInit() {
      this.onReplaceReasonChanged(this.cardInfo.reason);
      this.selectedReason = {
         code: Constants.VariableValues.cardBlockingReasong.lost.code,
         text: Constants.VariableValues.cardBlockingReasong.lost.text
      };
   }

   onReplaceReasonChanged(reasonCode: string) {
      switch (reasonCode) {
         case Constants.VariableValues.cardBlockingReasong.damaged.code:
            this.selectedReason = Constants.VariableValues.cardBlockingReasong.damaged;
            break;
         case Constants.VariableValues.cardBlockingReasong.stolen.code:
            this.selectedReason = Constants.VariableValues.cardBlockingReasong.stolen;
            break;
         case Constants.VariableValues.cardBlockingReasong.retain.code:
            this.selectedReason = Constants.VariableValues.cardBlockingReasong.retain;
            break;
         case Constants.VariableValues.cardBlockingReasong.lost.code:
            this.selectedReason = Constants.VariableValues.cardBlockingReasong.lost;
            break;
      }
      if (this.isAgree) {
         this.enableNextButton(true);
      }
   }

   enableNextButton(result) {
      this.isAgree = result;
      this.isNextButtonEnabled = (this.selectedReason !== undefined && this.isAgree);
   }

   replaceCard() {
      this.cardService.replaceCard(this.cardInfo.plasticId, this.cardInfo.cardNumber, this.selectedReason.code);
   }
}
