import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommonUtility } from '../../core/utils/common';
import { Constants } from '../../core/utils/constants';
import { IDropdownItem } from '../../core/utils/models';
import { CardService } from '../card.service';
import { ICardBlockInfo } from '../models';

@Component({
   selector: 'app-block-card',
   templateUrl: './block-card.component.html',
   styleUrls: ['./block-card.component.scss']
})
export class BlockCardComponent implements OnInit {
   @Input() cardInfo: ICardBlockInfo;
   @Input() otherTravelCardBlocked: boolean;
   @Output() onReplaceCard = new EventEmitter();
   isTravelAccountCard: boolean;
   reasons: any;
   blockingReasons: any[];
   selectedReason: IDropdownItem;
   isDamaged = false;
   inProgress = false;
   labels = Constants.labels;

   constructor(private cardService: CardService) { }

   ngOnInit() {
      this.isTravelAccountCard = CommonUtility.checkIfTravelCard(this.cardInfo.cardNumber);
      this.reasons = {
         lost: Constants.VariableValues.cardBlockingReasong.lost,
         retain: Constants.VariableValues.cardBlockingReasong.retain,
         stolen: Constants.VariableValues.cardBlockingReasong.stolen,
      };
      /* if (this.isTravelAccountCard) {
         this.reasons.damaged = Constants.VariableValues.cardBlockingReasong.damaged;
      } */
      this.blockingReasons = CommonUtility.covertToDropdownObject(this.reasons);
      this.onBlockReasonChanged(this.cardInfo.reason);
   }

   onBlockReasonChanged(reasonCode: string) {
      this.isDamaged = false;
      switch (reasonCode) {
         case Constants.VariableValues.cardBlockingReasong.stolen.code:
            this.selectedReason = Constants.VariableValues.cardBlockingReasong.stolen;
            break;
         case Constants.VariableValues.cardBlockingReasong.retain.code:
            this.selectedReason = Constants.VariableValues.cardBlockingReasong.retain;
            break;
         case Constants.VariableValues.cardBlockingReasong.lost.code:
            this.selectedReason = Constants.VariableValues.cardBlockingReasong.lost;
            break;
         case Constants.VariableValues.cardBlockingReasong.damaged.code:
            this.selectedReason = Constants.VariableValues.cardBlockingReasong.damaged;
            this.isDamaged = true;
            break;
      }
   }

   blockCard() {
      if (!this.inProgress) {
         this.inProgress = true;
         this.cardService.blockCard(this.cardInfo.plasticId, this.cardInfo.cardNumber, this.selectedReason.code);
      }
   }

}
