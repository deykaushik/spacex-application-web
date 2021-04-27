import { Component, OnInit, Input, Output, Injector, EventEmitter } from '@angular/core';
import { CardService } from '../card.service';
import { IPlasticCard, IActivateCardEmitObj, ITransactionStatus } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { environment } from '../../../environments/environment';
import { BaseComponent } from '../../core/components/base/base.component';
import { GAEvents } from '../../core/utils/ga-event';
@Component({
  selector: 'app-activate-card',
  templateUrl: './activate-card.component.html',
  styleUrls: ['./activate-card.component.scss']
})
export class ActivateCardComponent extends BaseComponent implements OnInit {

  @Input() isCardActivated: boolean;
  @Input() plasticId: number;
  @Input() card: IPlasticCard;
  @Output() nextClick = new EventEmitter();
  labels = Constants.labels;
  activateCardLabels = Constants.labels.activateCardLabels;
  showActivateCardFeature = environment.features.activateCreditCard;
  showOverlay: boolean;
  showLoader: boolean;
  emitValue: IActivateCardEmitObj;
  responseData: ITransactionStatus;

  constructor(private cardService: CardService, injector: Injector) {
    super(injector);
    this.emitValue = {} as IActivateCardEmitObj;
  }

  ngOnInit() {
    this.showLoader = false;
  }
  callActivate(event: boolean) {
    this.showOverlay = event;
    const debitChequeCardcategory = GAEvents.activateCard.categoryDebitChequeCard;
    if (this.card.dcIndicator === Constants.CardTypes.DebitCard) {
      if (this.card.plasticCurrentStatusReasonCode === this.activateCardLabels.newCreditCardReasonCode) {
         const clickActivateNewDCGAEvents = GAEvents.activateCard.clickActivateNewDebitChequeCard;
         this.sendEvent(clickActivateNewDCGAEvents.eventAction, clickActivateNewDCGAEvents.label,
          null, debitChequeCardcategory);
       } else {
         const clickActivateDormantDCGAEvents = GAEvents.activateCard.clickActivateDormantDebitChequeCard;
         this.sendEvent(clickActivateDormantDCGAEvents.eventAction, clickActivateDormantDCGAEvents.label,
           null, debitChequeCardcategory);
       }
    }
  }

  onNext() {
    this.showLoader = true;
    /* Analytics for activate new credit card & Dormant Credit Card */
    const category = GAEvents.activateCard.category;
    if (this.card.dcIndicator === Constants.CardTypes.CreditCard) {
      if (this.card.plasticCurrentStatusReasonCode === this.activateCardLabels.newCreditCardReasonCode) {
         const activateNewCCGAEvents = GAEvents.activateCard.activatingNewCreditCard;
         this.sendEvent(activateNewCCGAEvents.action, activateNewCCGAEvents.label, activateNewCCGAEvents.value, category);
       } else {
         const activateDormantCCGAEvents = GAEvents.activateCard.activatingDormantCreditCard;
         this.sendEvent(activateDormantCCGAEvents.action, activateDormantCCGAEvents.label, activateDormantCCGAEvents.value, category);
       }
    }

    /* Analytics for activate new debit/cheque card & Dormant debit/cheque Card */
    const categoryDebitChequeCard = GAEvents.activateCard.categoryDebitChequeCard;
    if (this.card.dcIndicator === Constants.CardTypes.DebitCard) {
      if (this.card.plasticCurrentStatusReasonCode === this.activateCardLabels.newCreditCardReasonCode) {
         const activateNewDCGAEvents = GAEvents.activateCard.activatingNewDebitChequeCard;
         this.sendEvent(activateNewDCGAEvents.eventAction, activateNewDCGAEvents.label, null, categoryDebitChequeCard);
       } else {
         const activateDormantDCGAEvents = GAEvents.activateCard.activatingDormantDebitChequeCard;
         this.sendEvent(activateDormantDCGAEvents.eventAction, activateDormantDCGAEvents.label,
           null, categoryDebitChequeCard);
       }
    }
    /* api call for update activate card
    Depending on the api call's response (successfull or failure), the value will be emitted */
    this.cardService.updateActivateCard(this.plasticId, this.activateCardLabels.actionRequest)
      .finally(() => {
        this.showOverlay = false;
        this.showLoader = false;
      })
      .subscribe(response => {
         if (response && response.metadata.resultData[0].resultDetail[0]) {
          this.responseData = response.metadata.resultData[0].resultDetail[0];
         }
         const result = this.responseData.result;
         const reason = this.responseData.reason;
        if (this.card.dcIndicator === Constants.CardTypes.CreditCard) {
            this.emitValue.result = result === this.labels.cardManageConstants.successStatusCode ?
            this.labels.cardManageConstants.successStatusCode : this.activateCardLabels.errorCode;
            this.emitValue.reason = result === this.labels.cardManageConstants.successStatusCode ?
            this.activateCardLabels.responseReasonMessages.success : this.activateCardLabels.responseReasonMessages.failure;
        } else {
          if (result === this.labels.cardManageConstants.successStatusCode) {
            switch (reason) {
              case this.activateCardLabels.responseReasonMessages.accountIsDormant:
              this.emitValue.reason = this.activateCardLabels.responseReasonMessages.accountIsDormant;
              this.emitValue.result = this.labels.cardManageConstants.successStatusCode;
              break;
              case this.activateCardLabels.responseReasonMessages.success:
              this.emitValue.result = this.labels.cardManageConstants.successStatusCode;
              this.emitValue.reason = this.activateCardLabels.responseReasonMessages.success;
            }
          } else {
            this.emitValue.result = this.activateCardLabels.errorCode;
            this.emitValue.reason = this.activateCardLabels.responseReasonMessages.failure;
          }
        }
        this.nextClick.emit(this.emitValue);
        this.isCardActivated = ((this.emitValue.result === this.labels.cardManageConstants.successStatusCode) &&
          (this.emitValue.reason === this.activateCardLabels.responseReasonMessages.success)) ? false : true;
      }, (error) => {
        this.isCardActivated = true;
      });
  }

  onCancel() {
    this.showOverlay = false;
    /* Analytics for Cancel new credit card & Dormant Credit Card */
    const category = GAEvents.activateCard.category;
    if (this.card.dcIndicator === Constants.CardTypes.CreditCard) {
      if (this.card.plasticCurrentStatusReasonCode === this.activateCardLabels.newCreditCardReasonCode) {
         const cancelNewCCGAEvents = GAEvents.activateCard.cancelActivateNewCreditCard;
         this.sendEvent(cancelNewCCGAEvents.action, cancelNewCCGAEvents.label, cancelNewCCGAEvents.value, category);
       } else {
         const cancelDormantCCGAEvents = GAEvents.activateCard.cancelActivateDormantCreditCard;
         this.sendEvent(cancelDormantCCGAEvents.action, cancelDormantCCGAEvents.label, cancelDormantCCGAEvents.value, category);
       }
    }

    /* Analytics for Cancel new debit/cheque card & Dormant debit/cheque Card */
    const categoryDebitChequeCard = GAEvents.activateCard.categoryDebitChequeCard;
    if (this.card.dcIndicator === Constants.CardTypes.DebitCard) {
      if (this.card.plasticCurrentStatusReasonCode === this.activateCardLabels.newCreditCardReasonCode) {
         const cancelNewDCGAEvents = GAEvents.activateCard.cancelActivateNewDebitChequeCard;
         this.sendEvent(cancelNewDCGAEvents.eventAction, cancelNewDCGAEvents.label, null, categoryDebitChequeCard);
       } else {
         const cancelDormantDCGAEvents = GAEvents.activateCard.cancelActivateDormantDebitChequeCard;
         this.sendEvent(cancelDormantDCGAEvents.eventAction, cancelDormantDCGAEvents.label, null, categoryDebitChequeCard);
       }
    }
  }

}
