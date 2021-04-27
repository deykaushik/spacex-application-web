import { Component, OnInit, Input, Injector, OnDestroy } from '@angular/core';

import { CardService } from '../card.service';
import { IPlasticCard } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';

import { ICardReplaceInfo, ICardReplaceResult } from '../models';
import { BaseComponent } from '../../core/components/base/base.component';
import { Mapping } from '../../core/utils/routeMap';

@Component({
   selector: 'app-card-manage-blocked',
   templateUrl: './card-manage-blocked.component.html',
   styleUrls: ['./card-manage-blocked.component.scss']
})
export class CardManageBlockedComponent extends BaseComponent implements OnInit, OnDestroy {

   @Input() card: IPlasticCard;
   replaceCardBranchLocatorVisible = false;
   replaceCardStatusVisible = false;
   cardInfo: ICardReplaceResult;
   cardReplaceInfo: ICardReplaceInfo;
   replaceCardStatus: ICardReplaceResult;
   cardMapping = Mapping.Routes.find(cmp => cmp.page === 'cards');
   gaFlow = Constants.cardGaflow;
   cardReplaceStatusEmitter;
   replaceBlockCardEmitter;
   constructor(private cardService: CardService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {
      this.cardReplaceStatusEmitter = this.cardService.cardReplaceStatusEmitter.subscribe(cardReplaceInfo => {
         this.showReplaceCardStatusPopup(cardReplaceInfo);
      });

      this.cardService.hideReplaceCardStatusEmitter.subscribe(status => {
         this.hideReplaceCardStatusPopup();
      });
      this.replaceBlockCardEmitter = this.cardService.replaceBlockCardEmitter.subscribe(status => {
         if (status) {
            this.cardService.replaceBlockCardEmitter.next(null);
            this.showReplaceCardPopup();
         }
      });
   }

   showReplaceCardPopup() {
      this.cardReplaceInfo = {
         plasticId: this.card.plasticId,
         cardNumber: this.card.plasticNumber,
         reason: '',
         cardType: Constants.VariableValues.cardTypes.debit.text,
         branchCode: '',
         branchName: ''
      };
      this.replaceCardBranchLocatorVisible = true;
      this.trackPage({ page_path: '/' + this.gaFlow.replaceCardBranchLocator.page, page_title: this.cardMapping.label });
   }

   showReplaceCardStatusPopup(cardReplaceResult: ICardReplaceResult) {
      this.replaceCardBranchLocatorVisible = false;
      this.replaceCardStatus = {
         success: cardReplaceResult.success,
         branchName: cardReplaceResult.branchName,
         branchCode: cardReplaceResult.branchCode,
         cardNumber: cardReplaceResult.cardNumber,
         plasticId: this.card.plasticId
      };
      this.replaceCardStatusVisible = true;
      this.trackPage({ page_path: '/' + this.gaFlow.replaceCardStatus.page, page_title: this.cardMapping.label });
   }

   hideReplaceCardBranchLocatorPopup() {
      this.replaceCardBranchLocatorVisible = false;
      this.triggerToCard();
   }

   hideReplaceCardStatusPopup() {
      this.replaceCardStatusVisible = false;
      this.triggerToCard();
   }

   triggerToCard() {
      this.trackPage({ page_path: '/' + this.cardMapping.page, page_title: this.cardMapping.label });
   }
   ngOnDestroy() {
      this.replaceBlockCardEmitter.unsubscribe();
      this.cardReplaceStatusEmitter.unsubscribe();
   }
}
