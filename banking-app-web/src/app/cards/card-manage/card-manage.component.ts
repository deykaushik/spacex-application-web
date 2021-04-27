import { Component, Input, OnInit, Injector, OnDestroy, OnChanges, EventEmitter, Output } from '@angular/core';
import { IPlasticCard } from './../../core/services/models';
import { CardService } from '../card.service';
import { PreFillService } from '../../core/services/preFill.service';
import { Constants } from '../../core/utils/constants';
import { BaseComponent } from '../../core/components/base/base.component';

import {
   ICardBlockResult, ICardBlockInfo, ICardReplaceInfo, ICardReplaceResult, ICardLimitUpdateResult, IStatusWarning,
   ICardActionListsData, ICardUpdateActionListData
} from '../models';
import { Mapping } from '../../core/utils/routeMap';
import { environment } from '../../../environments/environment';
import { CommonUtility } from '../../core/utils/common';
import { GAEvents } from '../../core/utils/ga-event';
import { IAutoPayDetail } from '../apo/apo.model';
import { ApoConstants } from '../apo/apo-constants';
import { ApoService } from '../apo/apo.service';
import { OverseaTravelService } from '../overseas-travel/overseas-travel.service';

@Component({
   selector: 'app-card-manage',
   templateUrl: './card-manage.component.html',
   styleUrls: ['./card-manage.component.scss']
})
export class CardManageComponent extends BaseComponent implements OnInit, OnChanges, OnDestroy {
   // check if the card has contact less functionality
   hasTapAndGo: ICardActionListsData;
   // check if the card has internet purchase functionality
   hasInternetPurchase: ICardActionListsData;
   // check if the card should have enabled/disbaled card freeze functionality
   hasFreezeCard: ICardActionListsData;
   // check if the card type is travel card or not
   isTravelAccountCard: boolean;

   // Check whether card is activated or not
   hasActivatedCard: ICardActionListsData;

   @Input() card: IPlasticCard;
   @Input() otherTravelCardBlocked: boolean;
   @Output() statusChange = new EventEmitter<ICardUpdateActionListData>();
   @Output() hideOtn = new EventEmitter<boolean>();
   cardManageLabels = Constants.labels.cardManageConstants;
   creditCardIndicator = Constants.CardTypes.CreditCard;
   activateCardLabels = Constants.labels.activateCardLabels;
   updateLimitPopupVisible = false;
   updateLimitStatusPopupVisible = false;
   blockCardVisible = false;
   replaceCardVisible = false;
   blockCardStatusVisible = false;
   replaceCardBranchLocatorVisible = false;
   replaceCardStatusVisible = false;
   isSoftBlock: boolean;
   isInternetPurchase: boolean;
   isTapAndGo: boolean;
   cardToggleStatus: boolean;
   freezeEnabled: boolean;
   isCardActivated: boolean;
   freezeCardLoader = false;
   showLoader = false;
   blockStatus: ICardBlockResult;
   cardBlockInfo: ICardBlockInfo;
   cardReplaceInfo: ICardReplaceInfo;
   replaceCardStatus: ICardReplaceResult;
   isLimitUpdated: ICardLimitUpdateResult;
   showCardFreezeFeature: boolean = environment.features.cardFreeze;
   showCardContactlessFeature = environment.features.cardContactless;
   showCardInternetPurchasesFeature = environment.features.cardInternetPurchases;
   otnToggle = environment.features.overseasTravelNotification;
   cardMapping = Mapping.Routes.find(cmp => cmp.page === 'cards');
   gaFlow = Constants.cardGaflow;
   cardLimitUpdateEmitter;
   cardBlockStatusEmitter;
   retryCardBlockEmitter;
   replaceCardBranchLocatorEmitter;
   cardReplaceStatusEmitter;
   hideBlockCardStatusEmitter;
   hideReplaceCardStatusEmitter;
   deactivateFreezeCard: IStatusWarning;
   activateFreezeCard: IStatusWarning;
   deactivateTapGo: IStatusWarning;
   activateTapGo: IStatusWarning;
   statusWarningText: IStatusWarning;
   deactivateOnlinePurchase: IStatusWarning;
   activateOnlinePurchase: IStatusWarning;
   garageCardInternetPurchaseDisable: boolean;
   disableGarageCardInternetPurchaseFeature = environment.features.garageCardInternetPurchase;
   disableGarageCardAtmLimitsFeature = environment.features.garageCardAtmLimits;
   garageCardAtmLimitsDisable: boolean;
   autopayDetails: IAutoPayDetail;
   primaryAccount: boolean;
   apoConstants = ApoConstants.apo;
   paymentAmountOptions = ApoConstants.apo.paymentAmountOptions;
   isEnableAutopay: boolean;
   initiateApo: boolean;
   apoToggle = environment.features.automaticPaymentOrder;
   initiateOtn: boolean;
   showOtnSuccess: boolean;

   constructor(private cardService: CardService, injector: Injector,
      private apoService: ApoService, private prefillService: PreFillService, private overseaTravelService: OverseaTravelService) {
      super(injector);
   }
   ngOnChanges() {
      this.setLoader();
      this.setCardDetailsData(this.card.actionListItem);
      this.analyticsEventforActivateCard();
      this.isTravelAccountCard = CommonUtility.checkIfTravelCard(this.card.plasticNumber);
      if (this.disableGarageCardInternetPurchaseFeature) {
         this.disableInternetPurchaseForGarageCard(this.card);
      } else {
         this.garageCardInternetPurchaseDisable = true;
      }
      if (this.disableGarageCardAtmLimitsFeature) {
         this.disableAtmLimitsForGarageCard(this.card);
      } else {
         this.garageCardAtmLimitsDisable = true;
      }

      // Call paymentorders API only if apo toggle is ON
      if (this.apoToggle) {
         this.setDefaultAPOProps();
         this.getAutoPayIndicator();
      }
   }
   ngOnInit() {
      this.cardLimitUpdateEmitter = this.cardService.cardLimitUpdateEmitter.subscribe(isLimitUpdatedStatus => {
         this.showLimitUpdatedStatus(isLimitUpdatedStatus);
      });

      this.cardBlockStatusEmitter = this.cardService.cardBlockStatusEmitter.subscribe(cardBlockResult => {
         this.showCardBlockedStatus(cardBlockResult);
      });

      this.retryCardBlockEmitter = this.cardService.retryCardBlockEmitter.subscribe(cardBlockInfo => {
         this.retryBlockingCard(cardBlockInfo);
      });

      this.replaceCardBranchLocatorEmitter = this.cardService.replaceCardBranchLocatorEmitter.subscribe(cardReplaceInfo => {
         this.showReplaceCardBranchLocatorPopup(cardReplaceInfo);
      });

      this.cardReplaceStatusEmitter = this.cardService.cardReplaceStatusEmitter.subscribe(cardReplaceInfo => {
         this.showReplaceCardStatusPopup(cardReplaceInfo);
      });

      this.hideBlockCardStatusEmitter = this.cardService.hideBlockCardStatusEmitter.subscribe(status => {
         this.hideBlockCardStatusPopup();
      });

      this.hideReplaceCardStatusEmitter = this.cardService.hideReplaceCardStatusEmitter.subscribe(status => {
         this.hideReplaceCardStatusPopup(true);
      });

      this.overseaTravelService.emitOtnSuccess.subscribe(response => {
            this.showOtnSuccess = response;
            this.initiateOtn = false;
      });
      this.deactivateFreezeCard = this.cardManageLabels.freezeCard.deactivateFreezeCard;
      this.activateFreezeCard = this.cardManageLabels.freezeCard.activateFreezeCard;
      this.deactivateTapGo = this.cardManageLabels.tapAndGo.deactivateTapAndGo;
      this.activateTapGo = this.cardManageLabels.tapAndGo.activateTapAndGo;
      this.deactivateOnlinePurchase = this.cardManageLabels.internetPurchases.deactivateInternetPurchases;
      this.activateOnlinePurchase = this.cardManageLabels.internetPurchases.activateInternetPurchases;
      this.statusWarningText = {} as IStatusWarning;
   }
   setLoader() {
      if (!this.showLoader) {
         this.showLoader = true;
      }
   }

   analyticsEventforActivateCard() {
      const category = GAEvents.activateCard.category;
      if (this.card.dcIndicator === Constants.CardTypes.CreditCard) {
            if (this.card.plasticCurrentStatusReasonCode === this.activateCardLabels.newCreditCardReasonCode) {
                  const viewActivateNewCCGAEvents = GAEvents.activateCard.viewActivateNewCreditCard;
                  this.sendEventParams(viewActivateNewCCGAEvents.action, viewActivateNewCCGAEvents.label,
                        viewActivateNewCCGAEvents.value, category);
            } else if (this.card.plasticCurrentStatusReasonCode === this.activateCardLabels.dormantCreditCardReasonCode) {
                  const viewActivateDormantCCGAEvents = GAEvents.activateCard.viewActivateDormantCreditCard;
                  this.sendEventParams(viewActivateDormantCCGAEvents.action, viewActivateDormantCCGAEvents.label,
                        viewActivateDormantCCGAEvents.value, category);
            }
      }
   }

   sendEventParams(action: string, label: string, value: string, category: string) {
         this.sendEvent(action, label, value, category);
   }

   setCardDetailsData(actionList: ICardActionListsData[]) {
      if (actionList.length) {
         // for showing features based on activateCard result for Credit Card status
         if (this.card.dcIndicator === Constants.CardTypes.CreditCard || this.card.dcIndicator === Constants.CardTypes.DebitCard) {
            this.hasActivatedCard = actionList.find(actionItem => actionItem.action === this.cardManageLabels.activateCardLabel);
            this.isCardActivated = this.hasActivatedCard.result === undefined ? true : this.hasActivatedCard.result;
         } else {
            this.isCardActivated = true;
         }
         // for internet purchase flags - to show/hide toggle & if to show, in what state - on/off
         this.hasInternetPurchase = actionList.find(actionItem =>
            actionItem.action === this.cardManageLabels.canInternetPurchaseLabel);
         this.isInternetPurchase = this.hasInternetPurchase ? this.hasInternetPurchase.result : false;
         // for contactless on-off flags - to show/hide toggle & if to show, in what state - on/off
         this.hasTapAndGo = actionList.find(actionItem => actionItem.action === this.cardManageLabels.canContactlessLabel);
         this.isTapAndGo = this.hasTapAndGo ? this.hasTapAndGo.result : false;
         // for card freeze on-off flags - to show/disable toggle & if to show, in what state - on/off
         this.hasFreezeCard = actionList.find(actionItem => actionItem.action === this.cardManageLabels.canSoftBlockLabel);
         // if freeze card option is unavailable in api response, dont hide the toggle, just disable it
         this.freezeEnabled = this.hasFreezeCard && this.hasFreezeCard.hasOwnProperty('result') ? true : false;
         if (this.freezeEnabled) {
            this.isSoftBlock = this.hasFreezeCard.result ? false : true;
         } else {
            this.isSoftBlock = false;
         }
         this.card.isCardFreeze = this.isSoftBlock ? true : false;
      }
      this.showLoader = false;
   }

   disableInternetPurchaseForGarageCard(card: IPlasticCard) {
      const isAGarageCard = CommonUtility.isGarageCard(card);
      this.garageCardInternetPurchaseDisable = isAGarageCard ? false : true;
   }

   disableAtmLimitsForGarageCard(card: IPlasticCard) {
      this.garageCardAtmLimitsDisable = CommonUtility.isGarageCard(card) ? false : true;
   }
   retryBlockingCard(cardBlockInfo: ICardBlockInfo) {
      this.cardBlockInfo = cardBlockInfo;
      this.hideBlockCardStatusPopup(true);
      this.showBlockCardPopup();
   }

   showLimitUpdatedStatus(isLimitUpdated: ICardLimitUpdateResult) {
      this.isLimitUpdated = isLimitUpdated;
      this.hideUpdateLimitPopup(true);
      this.showLimitStatusPopup();
   }

   showCardBlockedStatus(cardBlockResult: ICardBlockResult) {
      this.hideBlockCardPopup(true);
      this.blockStatus = cardBlockResult;
      this.showBlockCardStatusPopup();
   }

   showLimitStatusPopup() {
      this.updateLimitStatusPopupVisible = true;
      this.trackPage({ page_path: '/' + this.gaFlow.changeAtmLimitStatus.page, page_title: this.cardMapping.label });
   }

   showLimitChangePopup() {
      this.updateLimitPopupVisible = true;
      this.trackPage({ page_path: '/' + this.gaFlow.changeAtmLimit.page, page_title: this.cardMapping.label });
   }

   showBlockCardPopup() {
      let cardType;
      if (this.card.dcIndicator === Constants.CardTypes.CreditCard && !this.isTravelAccountCard) {
         cardType = Constants.VariableValues.cardTypes.credit.text;
      } else if (this.card.dcIndicator === Constants.CardTypes.DebitCard && !this.isTravelAccountCard) {
         cardType = Constants.VariableValues.cardTypes.debit.text;
      } else {
         cardType = Constants.labels.dashboardTravelCardAccountTitle;
      }

      this.cardBlockInfo = {
         plasticId: this.card.plasticId,
         cardNumber: this.card.plasticNumber,
         reason: null,
         cardType: cardType
      };
      this.blockCardVisible = true;
      this.trackPage({ page_path: '/' + this.gaFlow.blockCard.page, page_title: this.cardMapping.label });
   }

   showReplaceCardPopup() {
      this.cardReplaceInfo = {
         plasticId: this.card.plasticId,
         cardNumber: this.card.plasticNumber,
         reason: null,
         cardType: this.card.dcIndicator === Constants.CardTypes.CreditCard
            ? Constants.VariableValues.cardTypes.credit.text : Constants.VariableValues.cardTypes.debit.text,
         branchCode: '',
         branchName: '',
         allowBranch: this.card.allowBranch
      };
      this.replaceCardVisible = true;
      this.trackPage({ page_path: '/' + this.gaFlow.replaceCard.page, page_title: this.cardMapping.label });
   }

   onReplaceCardFromBlock() {
      this.blockCardVisible = false;
      this.showReplaceCardPopup();
   }

   showReplaceCardBranchLocatorPopup(cardReplaceInfo: ICardReplaceInfo) {
      this.replaceCardVisible = false;
      this.cardReplaceInfo = {
         plasticId: this.card.plasticId,
         cardNumber: this.card.plasticNumber,
         reason: cardReplaceInfo.reason,
         cardType: Constants.VariableValues.cardTypes.debit.text,
         branchCode: cardReplaceInfo.branchCode,
         branchName: cardReplaceInfo.branchName,
         allowBranch: this.card.allowBranch
      };
      this.replaceCardBranchLocatorVisible = true;
      this.trackPage({ page_path: '/' + this.gaFlow.replaceCardBranchLocator.page, page_title: this.cardMapping.label });
   }

   showBlockCardStatusPopup() {
      this.blockCardStatusVisible = true;
      this.trackPage({ page_path: '/' + this.gaFlow.blockCardStatus.page, page_title: this.cardMapping.label });
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

   hideUpdateLimitPopup(noTrigerEvent?: boolean) {
      this.updateLimitPopupVisible = false;
      this.triggerToCard(noTrigerEvent);
   }

   hideUpdateLimitStatusPopup(noTrigerEvent?: boolean) {
      this.updateLimitStatusPopupVisible = false;
      this.triggerToCard(noTrigerEvent);
   }

   hideBlockCardPopup(noTrigerEvent?: boolean) {
      this.blockCardVisible = false;
      this.triggerToCard(noTrigerEvent);
   }

   hideBlockCardStatusPopup(noTrigerEvent?: boolean) {
      this.blockCardStatusVisible = false;
      this.blockCardVm();
      this.triggerToCard(noTrigerEvent);
   }

   blockCardVm() {
      if (this.blockStatus && this.blockStatus.success) {
         this.card.plasticStatus = 'Blocked';
      }
   }

   hideReplaceCardBranchLocatorPopup(noTrigerEvent?: boolean) {
      this.replaceCardBranchLocatorVisible = false;
      this.triggerToCard(noTrigerEvent);
      // call replace card close pop up
      this.cardService.closeReplaceCardPopup();
   }

   hideReplaceCardPopup(noTrigerEvent?: boolean) {
      this.replaceCardVisible = false;
      this.triggerToCard(noTrigerEvent);
   }

   hideReplaceCardStatusPopup(noTrigerEvent?: boolean) {
      this.replaceCardStatusVisible = false;
      this.triggerToCard(noTrigerEvent);
      this.cardService.closeReplaceCardPopup();
      if (!noTrigerEvent && this.replaceCardStatus.success) {
         this.cardService.closeReplaceCardStatusPopup();
      }
   }

   triggerToCard(noTrigerEvent) {
      if (!noTrigerEvent) {
         this.trackPage({ page_path: '/' + this.cardMapping.page, page_title: this.cardMapping.label });
      }
   }
   ngOnDestroy() {
      this.cardLimitUpdateEmitter.unsubscribe();
      this.cardBlockStatusEmitter.unsubscribe();
      this.retryCardBlockEmitter.unsubscribe();
      this.replaceCardBranchLocatorEmitter.unsubscribe();
      this.cardReplaceStatusEmitter.unsubscribe();
   }

   /*  function will take value of selected toggle option - tap-go/card-freeze/internate-purchase and depending on the status of
   the toggle (either on or off), it will set all the text (header, title, subtitle) to be displayed. Then it will also open/set the
   overlay that displays this text */
   showPopupForSwitches(value: string) {
      this.showLoader = true;
      switch (value) {
         case this.cardManageLabels.tapAndGo.tapGo:
            this.statusWarningText = this.isTapAndGo ? this.activateTapGo : this.deactivateTapGo;
            const tapAndGoOnGAEvents = GAEvents.cardFeatures.tapAndGo.toggleOn;
            const tapAndGoOffGAEvents = GAEvents.cardFeatures.tapAndGo.toggleOff;
            const tapAndGoOnOffValue = this.isTapAndGo ? 'On' : 'Off';
            if (this.isTapAndGo) {
               this.sendEvent(tapAndGoOnGAEvents.action, tapAndGoOnGAEvents.label,
                  tapAndGoOnOffValue, tapAndGoOnGAEvents.category);
            } else {
               this.sendEvent(tapAndGoOffGAEvents.action, tapAndGoOffGAEvents.label,
                  tapAndGoOnOffValue, tapAndGoOffGAEvents.category);
            }
            break;
         case this.cardManageLabels.internetPurchases.internetPurchasesLabel:
            this.statusWarningText = this.isInternetPurchase ? this.activateOnlinePurchase : this.deactivateOnlinePurchase;
            const internetPurchaseOnGAEvents = GAEvents.cardFeatures.onlinePurchase.toggleOn;
            const internetPurchaseOffGAEvents = GAEvents.cardFeatures.onlinePurchase.toggleOff;
            const internetPurchaseOnOffValue = this.isInternetPurchase ? 'On' : 'Off';
            if (this.isInternetPurchase) {
               this.sendEvent(internetPurchaseOnGAEvents.action, internetPurchaseOnGAEvents.label,
                  internetPurchaseOnOffValue, internetPurchaseOnGAEvents.category);
            } else {
               this.sendEvent(internetPurchaseOffGAEvents.action, internetPurchaseOffGAEvents.label,
                  internetPurchaseOnOffValue, internetPurchaseOffGAEvents.category);
            }
            break;
         case this.cardManageLabels.freezeCard.cardFreeze:
            this.statusWarningText = this.isSoftBlock ? this.activateFreezeCard : this.deactivateFreezeCard;
            const freezeCardGAOnEvents = GAEvents.cardFeatures.freezeCard.toggleOn;
            const freezeCardGAOffEvents = GAEvents.cardFeatures.freezeCard.toggleOff;
            const freezeCardOnOffValue = this.isSoftBlock ? 'On' : 'Off';
            if (this.isSoftBlock) {
               this.sendEvent(freezeCardGAOnEvents.action, freezeCardGAOnEvents.label,
                  freezeCardOnOffValue, freezeCardGAOnEvents.category);
            } else {
               this.sendEvent(freezeCardGAOffEvents.action, freezeCardGAOffEvents.label,
                  freezeCardOnOffValue, freezeCardGAOffEvents.category);
            }
      }
      this.cardToggleStatus = true;
   }

   /* This function will capture the event when cancel is clicked on the overlay and accordingly will reset the value
    of statusWarning Object*/
   closePopupForSwitches(event: boolean) {
      this.showLoader = false;
      switch (this.statusWarningText.type) {
         case this.cardManageLabels.tapAndGo.tapGo:
            this.isTapAndGo = !this.statusWarningText.value;
            break;
         case this.cardManageLabels.internetPurchases.internetPurchasesLabel:
            this.isInternetPurchase = !this.statusWarningText.value;
            break;
         case this.cardManageLabels.freezeCard.cardFreeze:
            this.isSoftBlock = this.statusWarningText.value;
      }
      this.cardToggleStatus = !event;
   }

   /* when user clicks on next and choose to proceed with changing the status of any toggle, depending on the event, object to be
   emitted is set */
   setUnsetToggle(eventSuccessful: boolean) {
      let result = false;
      let action;
      let emitObject: ICardUpdateActionListData;
      // set action
      switch (this.statusWarningText.type) {
         case this.cardManageLabels.tapAndGo.tapGo: action = this.cardManageLabels.canContactlessLabel;
            break;
         case this.cardManageLabels.internetPurchases.internetPurchasesLabel:
            action = this.cardManageLabels.canInternetPurchaseLabel;
            break;
         case this.cardManageLabels.freezeCard.cardFreeze: action = this.cardManageLabels.canSoftBlockLabel;
      }
      // eventSuccessful = true (R00 - successful call) else eventSuccessful = false
      result = eventSuccessful ? this.statusWarningText.value : !this.statusWarningText.value;

      // set the status of model flags
      if (eventSuccessful) {
         if (action === this.cardManageLabels.canSoftBlockLabel) {
            this.card.isCardFreeze = !this.statusWarningText.value;
         }
      } else {
         // when event is unsuccessful set all angular model to original state and close the modal
         this.closePopupForSwitches(eventSuccessful);
      }
      this.cardToggleStatus = false;

      emitObject = { action: action, result: result, plasticId: this.card.plasticId, eventSuccessful: eventSuccessful };
      this.statusChange.emit(emitObject);
      this.showLoader = false;
   }

   sendEventForOverseasTravelNotification() {
      const overseasTravelNotificationGAEvents = GAEvents.overseasTravelNotification.viewUseCardOverseas;
      const category = GAEvents.overseasTravelNotification.category;
      this.sendEvent(overseasTravelNotificationGAEvents.label,
         overseasTravelNotificationGAEvents.eventAction,
         overseasTravelNotificationGAEvents.value, category);
   }

   showOtnFeature() {
      return this.garageCardInternetPurchaseDisable && this.isCardActivated && this.otnToggle && !this.isSoftBlock ? true : false;
   }

   /* Auto pay status from API plastic cards data */
   getAutoPayIndicator() {
      this.autopayDetails = {} as IAutoPayDetail;
      if (this.card.dcIndicator === this.apoConstants.values.creditCard &&
         this.card.plasticCustomerRelationshipCode === this.apoConstants.values.plasticRelationshipCode) {
         this.primaryAccount = true;
      } else {
         this.primaryAccount = false;
      }
      if (this.primaryAccount) {
         this.showLoader = true;
         this.apoService.getPlasticCardDetails(this.card.plasticId.toString()).finally(() => {
            this.showLoader = false;
         }).subscribe((response) => {
            if (response && response.metadata && response.metadata.resultData && response.metadata.resultData[0] &&
               response.metadata.resultData[0].resultDetail[0].result === 'R00') {
               this.autopayDetails = response.data;
               this.isEnableAutopay = true;
            }
            this.autopayDetails = response.data;
            this.prefillService.preFillAutoPayDetail = this.autopayDetails;
            if (this.autopayDetails && this.autopayDetails.autoPayInd) {
               this.prefillService.preFillOperationMode = this.apoConstants.values.edit;
            } else {
               this.prefillService.preFillOperationMode = this.apoConstants.values.add;
            }
         });
      }
   }

   showAutopayPopup() {
      this.apoService.setCardDetails(this.card);
      this.initiateApo = true;
   }

   successApo(event) {
      this.setDefaultAPOProps();
      this.getAutoPayIndicator();
   }

   closeApo(event) {
      this.initiateApo = event;
   }

   deleteApo(event) {
      this.setDefaultAPOProps();
      this.getAutoPayIndicator();
      this.apoService.setAPODeleteSuccess();
   }
   setDefaultAPOProps() {
      this.primaryAccount = false;
      this.isEnableAutopay = false;
      this.initiateApo = false;
   }

   enableOtn() {
      this.initiateOtn = true;
   }

   closeStepper() {
      this.hideOtn.emit(false);
   }

   showSuccess(event: boolean) {
      this.showOtnSuccess = event;
   }
   onHide(event: boolean) {
      this.initiateOtn = event;
   }
}
