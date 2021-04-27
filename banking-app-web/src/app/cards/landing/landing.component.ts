import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService } from './../card.service';
import { Constants } from '../../core/utils/constants';
import { GAEvents } from '../../core/utils/ga-event';
import { PreFillService } from '../../core/services/preFill.service';
import { IPlasticCard, IDashboardAccounts, IActivateCardEmitObj } from './../../core/services/models';
import { LoaderService } from '../../core/services/loader.service';
import { ICardUpdateActionListData } from '../models';
import { CommonUtility } from '../../core/utils/common';
import { environment } from '../../../environments/environment';
import { BaseComponent } from '../../core/components/base/base.component';
import { ApoService } from '../apo/apo.service';
import { ApoConstants } from '../apo/apo-constants';

@Component({
   selector: 'app-landing',
   templateUrl: './landing.component.html',
   styleUrls: ['./landing.component.scss']
})
export class LandingComponent extends BaseComponent implements OnInit {
   updateActionItemMessage = false;
   updateActionItemFailed = false;
   message: string;
   cards: IPlasticCard[];
   selectedCard: IPlasticCard;
   showLoader: boolean;
   accountId: number;
   accountNumber: number;
   accountName: string;
   cardManage = Constants.labels.cardManageConstants;
   isTravelAccountCard: boolean;
   activateCardLabels = Constants.labels.activateCardLabels;
   isCardActivated: boolean;
   isOtherTravelCardBlocked = false;
   apoConstants = ApoConstants.apo;

   constructor(private cardService: CardService, injector: Injector, private route: ActivatedRoute,
      private preFillService: PreFillService, private loader: LoaderService, private apoService: ApoService) {
      super(injector);
      this.route.params.subscribe(params => this.accountId = params.accountId);
   }

   ngOnInit() {
      this.cards = [];
      this.isCardActivated = true;
      this.closeMessageBlock();
      this.loadPlasticCards();
      this.setAccountDetails();
      this.cardService.hideReplaceCardStatusEmitter.subscribe(status => {
         this.cards = [];
         this.loadPlasticCards();
      });
      this.apoService.emitApoDeleteSuccess.subscribe(response => {
         this.showSuccess(response);
      });
      this.apoService.setAccountId(this.accountId);
   }
   loadPlasticCards() {
      const trvelCardRemoveIndexes = [];
      this.showLoader = true;
      this.loader.show();
      this.cardService.getPlasticCards(this.accountId).subscribe(response => {
         this.cards = response;
         if (this.cards.length) {
            this.cards.map((eachCard, index) => {
               const card = eachCard.actionListItem.find(eachAction => eachAction.action === this.cardManage.canSoftBlockLabel);
               // card actionListItem should be defined for canSoftBlock and if card.result is false means, card is freezed already
               if (card) {
                  eachCard.isCardFreeze = card.result === false ? true : false;
               }
               if (!environment.features.travelCardManagement && CommonUtility.checkIfTravelCard(eachCard.plasticNumber)) {
                  trvelCardRemoveIndexes.push(index);
               }
            });
            trvelCardRemoveIndexes.reverse();
            trvelCardRemoveIndexes.forEach(removeIndex => {
               response.splice(removeIndex, 1);
            });
            this.mapItemAccountId();
         } else {
            this.showLoader = false;
            this.loader.hide();
         }
      });
   }
   mapItemAccountId() {
      this.cardService.getDashboardAccounts().subscribe((accountContainers: IDashboardAccounts[]) => {
         if (accountContainers.length) {
            this.apoService.setDashboardAccounts(accountContainers);
            this.cards.forEach((card: IPlasticCard) => {
               if (card.dcIndicator === Constants.CardTypes.DebitCard) {
                  for (let index = 0; index < accountContainers.length; index++) {
                     const linkedAccount = accountContainers[index].Accounts
                        .find(acc => acc.AccountNumber.toString() === card.linkedAccountNumber);
                     if (linkedAccount) {
                        card.ItemAccountId = linkedAccount.ItemAccountId;
                        break;
                     }
                  }
               }
            });
         }
         this.showLoader = false;
         this.loader.hide();
      });
   }
   public cardSelected(card) {
      this.isTravelAccountCard = card ? CommonUtility.checkIfTravelCard(card.plasticNumber) : null;
      if (this.isTravelAccountCard) {
         this.cards.forEach((val, index) => {
            if (CommonUtility.checkIfTravelCard(val.plasticNumber) && val.plasticNumber !== card.plasticNumber
               && val.plasticStatus === Constants.labels.statusBlocked) {
               this.isOtherTravelCardBlocked = true;
            }
         });
      }
      this.selectedCard = card;
      /* Display activate card feature for credit cards with status code IAD & F2F */
      if (this.selectedCard) {
         if ((this.selectedCard.dcIndicator === Constants.CardTypes.CreditCard) ||
          (this.selectedCard.dcIndicator === Constants.CardTypes.DebitCard)) {
            const activateCardAction = this.selectedCard.actionListItem
               .find(actionItem => actionItem.action === Constants.labels.cardManageConstants.activateCardLabel);
            this.isCardActivated = activateCardAction.hasOwnProperty('result') ? activateCardAction.result : true;
         } else {
            this.isCardActivated = true;
         }
      }
   }
   setAccountDetails() {
      const selectedAccount = this.preFillService.selectedAccount;
      if (this.accountId && selectedAccount) {
         this.accountNumber = selectedAccount.AccountNumber;
         this.accountName = selectedAccount.AccountName;
      }
   }

   closeMessageBlock() {
      this.updateActionItemMessage = false;
   }
   statusUpdated(statusChange: ICardUpdateActionListData) {
      if (statusChange) {
         this.updateActionItemMessage = true;
         // if update api was successful
         if (statusChange.eventSuccessful) {
            // for cards carousel, should update card actionListItem status when user swipes left or right to avoid multiple api call
            // But for card management its not necessary.
            if (!this.accountId) {
               this.updateCardActionItem(statusChange);
            }
            switch (statusChange.action) {
               case this.cardManage.canSoftBlockLabel: this.message =
                  statusChange.result ? this.cardManage.freezeCard.cardFreezeDeactivated : this.cardManage.freezeCard.cardFreezeActivated;
                  break;
               case this.cardManage.canContactlessLabel: this.message =
                  statusChange.result ? this.cardManage.tapAndGo.tapAndGoActivated : this.cardManage.tapAndGo.tapAndGoDeactivated;
                  break;
               case this.cardManage.canInternetPurchaseLabel: this.message = statusChange.result ?
                  this.cardManage.internetPurchases.internetPurchasesActivated :
                  this.cardManage.internetPurchases.internetPurchasesDeactivated;
            }
         } else {
            // updation in api was not successful
            this.message = this.cardManage.errorScenarioMessage;
            this.updateActionItemFailed = true;
         }

      }
   }

   /* Card activation success or failure message from Update activate card API response */
   activateCardMessage(eventObj: IActivateCardEmitObj) {
      if (eventObj && eventObj.result === this.cardManage.successStatusCode &&
            eventObj.reason === this.activateCardLabels.responseReasonMessages.success) {
         this.message = this.activateCardLabels.successYourCardActivatedText;
         this.loadPlasticCards();
      } else if (eventObj && eventObj.result === this.cardManage.successStatusCode &&
            eventObj.reason === this.activateCardLabels.responseReasonMessages.accountIsDormant) {
            this.updateActionItemFailed = true;
            this.message = this.activateCardLabels.activateCardErrorMessages.casaDormant;
      } else if (eventObj && eventObj.result === this.activateCardLabels.errorCode &&
            eventObj.reason === this.activateCardLabels.responseReasonMessages.failure &&
             this.selectedCard.dcIndicator === Constants.CardTypes.DebitCard) {
            this.updateActionItemFailed = true;
            this.message = this.activateCardLabels.activateCardErrorMessages.adverseAccount;
      } else {
         this.updateActionItemFailed = true;
         this.message = this.activateCardLabels.sorryUnableToActiveText;
      }
      this.updateActionItemMessage = true;

   }
   updateCardActionItem(statusChange: ICardUpdateActionListData) {
      const index = this.cards.findIndex(card => card.plasticId === statusChange.plasticId);
      this.cards[index].actionListItem.map(eachAction => {
         if (eachAction.action === statusChange.action) {
            eachAction.result = statusChange.result;
         }
      });
   }
   showSuccess(event) {
      this.updateActionItemMessage = true;
      this.message = this.apoConstants.messages.deleteSuccess;
   }
}
