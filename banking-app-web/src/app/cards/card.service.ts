import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ApiService } from './../core/services/api.service';
import {
   IPlasticCard, IApiResponse, IDashboardAccounts, IDashboardAccount, IReplaceCardPayload, ITransactionMetaData
} from './../core/services/models';
import {
   ICardBlockMetadata, ICardBlockResponse, ICardBlockResult, ICardBlockInfo, ICardLimitResponse,
   ICardLimitUpdateResult, ICardReplaceResponse, ICardReplaceResult, ICardReplaceInfo
} from './models';
import { Constants } from '../core/utils/constants';
import { IMetaData } from '../payout/payout.models';

@Injectable()
export class CardService {

   constructor(private apiService: ApiService) { }

   cardLimitUpdateEmitter = new EventEmitter<ICardLimitUpdateResult>();
   cardBlockStatusEmitter = new EventEmitter<ICardBlockResult>();
   retryCardBlockEmitter = new EventEmitter<ICardBlockInfo>();
   replaceCardBranchLocatorEmitter = new EventEmitter<ICardReplaceInfo>();
   cardReplaceStatusEmitter = new EventEmitter<ICardReplaceResult>();
   hideBlockCardStatusEmitter = new EventEmitter<boolean>();
   hideReplaceCardStatusEmitter = new EventEmitter<boolean>();
   replaceBlockCardEmitter = new BehaviorSubject<boolean>(null);
   replaceCardPayload = null;
   closeReplacePopUpEmitter = new EventEmitter<boolean>();

   sortCards(a, b) {
      if (a.plasticNumber > b.plasticNumber) {
         return 1;
      } else if (a.plasticNumber < b.plasticNumber) {
         return -1;
      }
      return 0;
   }

   getPlasticCards(accountId?: number): Observable<IPlasticCard[]> {
      let getPlasticCards;
      if (accountId) {
         const routeParams = { accountId: accountId };
         getPlasticCards = this.apiService.PlasticCardsWithId.getAll({}, routeParams).map(response => {
            if (response && response.data) {
               return response.data.sort((a, b) => this.sortCards(a, b));
            } else {
               return [];
            }
         });
      } else {
         getPlasticCards = this.apiService.PlasticCards.getAll({}).map(response => {
            if (response && response.data) {
               return response.data.sort((a, b) => this.sortCards(a, b));
            } else {
               return [];
            }
         });
      }
      return getPlasticCards;
   }
   getDashboardAccounts(): Observable<any> {
      return this.apiService.DashboardAccounts.getAll().map((response) => response ? response : []);
   }
   getCreditCardLimit(plasticId: number): Observable<IApiResponse> {
      return this.apiService.CreditCardAtmLimit.getAll(null, { plasticId: plasticId });
   }
   getDebitCardLimit(ItemAccountId: string): Observable<IApiResponse> {
      return this.apiService.DebitCardAtmLimit.getAll(null, { accountId: ItemAccountId });
   }
   updateCardActionList(plasticId?: number, actionRequest?: string): Observable<IApiResponse> {
      return this.apiService.UpdateCardActionList
         .update(null, {}, { plasticId: plasticId, actionRequest: actionRequest }).map(response =>
            response.metadata.resultData[0].resultDetail[0].result);
   }

   updateActivateCard(plasticId?: number, actionRequest?: string): Observable<IApiResponse> {
      return this.apiService.UpdateActivateCard
         .update(null, {}, { plasticId: plasticId, actionRequest: actionRequest }).map(response =>
            response);
   }
   updateCardLimit(cardNumber: string, limit: number, oldLimit: number, plasticId: number, camsDailyAtmCash: number) {
      const status = {
         isLimitUpdated: false,
         oldLimit: oldLimit,
         newLimit: limit,
         cardNumber: cardNumber,
         DCIndicator: Constants.CardTypes.CreditCard,
         plasticId: plasticId,
         camsDailyAtmCash: camsDailyAtmCash
      };
      this.apiService.CreditCardAtmLimit
         .update({ 'camsAtmCashLimit': limit, 'camsDailyAtmCash': camsDailyAtmCash }, null, { plasticId: plasticId })
         .subscribe(response => {
            if (response && response.metadata && response.metadata.resultData[0].resultDetail[0].result ===
               Constants.statusCode.successCode) {
               this.setUpdateLimitResult(status, true);
               this.cardLimitUpdateEmitter.emit(status);
            } else {
               this.cardLimitUpdateEmitter.emit(status);
            }
         },
         err => {
            this.cardLimitUpdateEmitter.emit(status);
         });
   }

   updateDebitCardLimit(cardNumber: string, limit: number, oldLimit: number, accountId: string) {
      const cardNumberNumeric = parseInt(cardNumber.replace(/ /g, ''), 10);
      const status = {
         isLimitUpdated: false,
         oldLimit: oldLimit,
         newLimit: limit,
         cardNumber: cardNumber,
         accountId: accountId,
         DCIndicator: Constants.CardTypes.DebitCard
      };
      this.apiService.DebitCardAtmLimit
         .update(null, { atmLimit: limit }, { accountId: accountId })
         .subscribe(response => {
            if (response && response.MetaData && response.MetaData.result && response.MetaData.result.resultCode === 0) {
               this.setUpdateLimitResult(status, true);
               this.cardLimitUpdateEmitter.emit(status);
            } else {
               this.cardLimitUpdateEmitter.emit(status);
            }
         },
         err => {
            this.cardLimitUpdateEmitter.emit(status);
         });
   }
   setUpdateLimitResult(result: ICardLimitUpdateResult, val) {
      result.isLimitUpdated = val;
   }

   blockCard(plasticId: number, cardNumber: string, reason: string) {
      this.apiService.BlockCard.update(null,
         { reasonCode: reason },
         { plasticId: plasticId })
         .subscribe((response: IApiResponse) => {
            const isBlocked = this.checkCardBlockedStatus(response);
            this.cardBlockStatusEmitter.emit({
               cardNumber: cardNumber,
               reason: reason,
               success: isBlocked
            });
         });
   }

   checkCardBlockedStatus(response: IApiResponse) {
      return response.metadata.resultData[0].resultDetail[0].result === Constants.statusCode.successCode;
   }

   retryBlockingCard(plasticId: number, cardNumber: string, reason: string) {
      this.retryCardBlockEmitter.emit({
         plasticId: plasticId,
         cardNumber: cardNumber,
         reason: reason
      });
   }

   replaceBlockCard(cardNumber: string, reason: string) {
      this.replaceBlockCardEmitter.next(true);
   }

   replaceCard(plasticId: number, cardNumber: string, reason: string) {
      this.replaceCardBranchLocatorEmitter.emit({
         plasticId: plasticId,
         cardNumber: cardNumber,
         cardType: Constants.VariableValues.cardTypes.debit.text,
         reason: reason,
         branchCode: null,
         branchName: ''
      });
   }

   replaceCardBranchSelector(payload: IReplaceCardPayload, callback?: Function, plasticId?: number) {
      this.replaceCardPayload = payload;
      const plasticCard: IPlasticCard = {
         F2FBranch: ''
      };
      this.apiService.ReplaceCard.update(payload.isCourier ? plasticCard : null,
         { branchCode: payload.branchcode },
         { plasticId: plasticId })
         .subscribe((response: ICardReplaceResponse) => {
            this.cardReplaceStatusEmitter.emit({
               success: this.checkCardReplacementStatus(response),
               branchName: payload.branchName,
               branchCode: payload.branchcode,
               cardNumber: payload.cardnumber
            });
            if (callback) {
               callback();
            }
         });
   }

   retryReplaceCard(plasticId: number, cardNumber: string, reason: string, branchcode: string, branchName: string) {
      this.apiService.ReplaceCard.update(null,
         { branchCode: branchcode },
         { plasticId: plasticId })
         .subscribe((response: ICardReplaceResponse) => {
            this.replaceCardBranchLocatorEmitter.emit({
               plasticId: plasticId,
               cardNumber: cardNumber,
               cardType: Constants.VariableValues.cardTypes.debit.text,
               reason: reason,
               branchCode: branchcode,
               branchName: branchName
            });
         });
   }

   checkCardReplacementStatus(response: IApiResponse) {
      if (response == null) {
         return false;
      }
      return response.metadata.resultData[0].resultDetail[0].result === Constants.statusCode.successCode;
   }

   closeBlockCardStatusPopup() {
      this.hideBlockCardStatusEmitter.emit(false);
   }

   closeReplaceCardStatusPopup() {
      this.hideReplaceCardStatusEmitter.emit(false);
   }

   // on close of replace pop up either by close or cancel
   closeReplaceCardPopup() {
      this.closeReplacePopUpEmitter.emit(false);
   }
}
