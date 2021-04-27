import { Component, OnInit, Injector } from '@angular/core';
import { AuthConstants } from '../../../auth/utils/constants';
import { Constants } from '../../../core/utils/constants';
import { Router } from '@angular/router';

import { GameService } from '../game.service';
import { ILottoHistoryData, IGameTicketData } from '../../../core/services/models';
import { PreFillService } from '../../../core/services/preFill.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { ISelectNumbersVm } from '../models';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-game-history',
   templateUrl: './game-history.component.html',
   styleUrls: ['./game-history.component.scss']
})
export class GameHistoryComponent extends BaseComponent implements OnInit {
   lottoDate: Date;
   pwbDate: Date;
   actualDate: Date;
   lottoErrorLabel: string;
   palletFailed = false;
   accountName: string;
   data: {};
   isReplay: boolean;
   showViewMoreButton = false;
   noMoreTicketsRecords = false;
   previousTickets = Constants.lottoConst.emptyString;
   isTickets = false;
   lottoPlus1 = Constants.lottoConst.isLottoPlus;
   lottoPlus2 = Constants.lottoConst.isLottoPlusTwo;
   pageSize = 1;
   skeletonMode = true;
   lottoError = Constants.lottoConst.emptyString;
   noTicketsFoundMsg = Constants.lottoConst.emptyString;
   lottoLable = Constants.lottoConst.lottoLable;
   nextDrawIs = Constants.lottoConst.nextDrawIs;
   buyLottoTicket = Constants.lottoConst.buyLottoTicket;
   viewWinningNumbers = Constants.lottoConst.viewWinningNumbers;
   ticketPurchases = Constants.lottoConst.ticketPurchases;
   dateLabel = Constants.lottoConst.dateLabel;
   descriptionLabel = Constants.lottoConst.descriptionLabel;
   amountLabel = Constants.lottoConst.amountLabel;
   viewMoreTicketsLabel = Constants.lottoConst.viewMoreTicketsHistoryLabel;
   nedAccountLabel = Constants.lottoConst.nedAccountLabel;
   forLabel = Constants.lottoConst.forLabel;
   boardsLabel = Constants.lottoConst.boardsLabel;
   drawLabel: string;
   startLabel = Constants.lottoConst.startLabel;
   onLabel = Constants.lottoConst.onLabel;
   purchaseLabel = Constants.lottoConst.purchaseLabel;
   noLottoRecords = false;
   isRecords = false;
   lottoHistory = [];
   dataAfterViewMore: ILottoHistoryData;
   gameNext: string;
   moreLottoRecords: boolean;
   day: string;
   nextDrawDate: Date;
   gameName: string;
   accountId: number;
   amount2: string;
   amount1: string;
   column: string;
   isDesc: boolean;
   direction = this.isDesc ? 1 : -1;
   ticketInfo: ISelectNumbersVm;
   historyFailed = false;
   showLoader = false;

   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   dateFormat = Constants.formats.ddMMYYYY;
   drawDateFormat = Constants.formats.ddMMMMyyyy;
   constructor(private gameService: GameService, private router: Router, private preFillService: PreFillService, injector: Injector) {
      super(injector);
   }

   ngOnInit() {

      this.getLottoHistoryData();
      this.getNextDrawDetails();

      if (this.previousTickets === Constants.lottoConst.emptyString &&
         !this.noLottoRecords && !this.noMoreTicketsRecords) {
         this.showViewMoreButton = true;
      } else {
         this.showViewMoreButton = false;
      }

      this.data = {
         isReplay: false,
      };
      this.preFillService.activeData = this.data;

   }

   sort(property) {
      // sort date and amount as per input column property
      this.isDesc = !this.isDesc;
      this.column = property;
      this.direction = this.isDesc ? 1 : -1;

      const records = this.lottoHistory[0];
      const length = records.length;
      for (const item in records) {
         const parsedValue = parseInt(item, 0);
         if (length - 1 !== parsedValue) {
            this.lottoHistory[0].sort(function () {
               const record1 = records[item];
               const record2 = records[parseInt(item, 0) + 1];
               if (record1[property] < record2[property]) {
                  return -1;
               } else if (record1[property] > record2[property]) {
                  return 1;
               } else {
                  return 0;
               }
            });
         }
      }
   }

   getLottoHistoryData() {
      this.gameService.getViewMoreLottoHistory().subscribe((response) => {
         if (response) {

            const data = this.setResponseData(response);
            this.lottoHistory.push(data);

            this.isRecords = true;
            this.skeletonMode = false;
         }
         // At first load only 10 and there are more than 10 records then show viewMoreButton.
         if (this.lottoHistory[0].length > Constants.lottoConst.nineRecords) {
            this.showViewMoreButton = true;
         } else {
            this.showViewMoreButton = false;
         }

         if (!this.lottoHistory[0].length) {
            this.noLottoRecords = true;
            this.noTicketsFoundMsg = AuthConstants.messages.noLottoTicketsFound;
         } else {
            this.noLottoRecords = false;
         }
         this.lottoError = Constants.lottoConst.emptyString;
      },
         error => {
            this.historyFailed = true;
            this.lottoError = AuthConstants.messages.lottoListError;
         }
      );
   }

   viewMoreTickets() {
      this.showLoader = true;

      this.previousTickets = Constants.lottoConst.prevTicketMsg;
      this.isTickets = true;
      // on click of view more call api with incremental pageSize , incremented at end of function
      if (this.pageSize === 1) {
         this.pageSize = 2;
      }
      if (!this.isTickets && !this.noLottoRecords && !this.noMoreTicketsRecords) {
         this.showViewMoreButton = true;
      } else {
         this.showViewMoreButton = false;
      }

      this.gameService.getViewMoreClickLotto(this.pageSize).subscribe((response) => {
         this.dataAfterViewMore = response;
         const responseArray = new Array;
         responseArray.push(response);
         if (response) {
            const data = this.setResponseData(response);
            if (this.lottoHistory && this.lottoHistory.length && this.lottoHistory[0]) {
               data.forEach(element => {
                  this.lottoHistory[0].push(element);
               });
            }
         }

         if (!responseArray[0].length) {
            this.showViewMoreButton = false;
            this.noMoreTicketsRecords = true;
            this.noTicketsFoundMsg = AuthConstants.messages.noLottoTicketsFound;
         } else {
            this.showViewMoreButton = true;
            this.noLottoRecords = false;
            this.noMoreTicketsRecords = false;
         }

         this.lottoError = Constants.lottoConst.emptyString;
         this.pageSize = (this.pageSize) + 1;
         this.showLoader = false;
         this.previousTickets = Constants.lottoConst.emptyString;
      }
      );
   }

   getNextDrawDetails() {
      this.gameService.getNextDrawDetails().subscribe((response) => {
         if (response) {
            for (const item in response) {
               this.actualDate = response[item].nextDrawDate;
               if (response[item].drawName === Constants.lottoConst.pwbLable) {
                  this.gameNext = Constants.lottoConst.pwbLable;
                  this.pwbDate = new Date(response[item].nextDrawDate);
               } else if (response[item].drawName === Constants.labels.lottoLabels.winningNumbersGameLottoPlus) {
                  this.gameNext = Constants.lottoConst.lottoLable;
                  this.lottoDate = new Date(response[item].nextDrawDate);
               }

            }

            // to check the next draw date
            const todayDate = new Date();
            // nexdrawdate >= today's date < powerball
            if (this.lottoDate >= todayDate) {
               this.gameNext = Constants.lottoConst.lottoLable;
               if (this.pwbDate > this.lottoDate) {
                  this.actualDate = this.lottoDate;
               } else if (this.pwbDate < this.lottoDate) {
                  this.actualDate = this.pwbDate;
                  this.gameNext = Constants.lottoConst.pwbLable;
               }
            }

            // nexdrawdate >= today's date < lotto
            if (this.pwbDate >= todayDate) {
               this.gameNext = Constants.lottoConst.pwbLable;
               if (this.pwbDate < this.lottoDate) {
                  this.actualDate = this.pwbDate;
               } else if (this.pwbDate > this.lottoDate) {
                  this.actualDate = this.lottoDate;
                  this.gameNext = Constants.lottoConst.lottoLable;
               }
            }
            const weekday = new Array(7);
            for (let index = 0; index < 7; index++) {
               weekday[index] = Constants.days.allDays[index];
            }
            this.day = weekday[this.actualDate.getDay()];
            this.skeletonMode = false;
         }

      },
         error => {
            this.palletFailed = true;
            this.lottoError = AuthConstants.messages.lottoListError;
            this.lottoErrorLabel = AuthConstants.messages.nextLottoPalletError;
         });
   }

   getDrawsPlayed(element) {
      switch (element.drawsPlayed) {
         case 1:
            element.drawLabel = Constants.lottoConst.drawLabel;
            break;
         default:
            element.drawLabel = Constants.lottoConst.drawLabelWithS;
      }

      return element.drawLabel;
   }

   setResponseData(response) {
      response.forEach(element => {
         element.amount = -element.amount;
         element.accountDetails  = element.fromAccount.accountType  +  '-'  +  element.fromAccount.accountNumber;
         element.drawLabel = this.getDrawsPlayed(element);
         switch (element.game) {
            case Constants.lottoConst.lottoType:
               if (element.isLottoPlus) {
                  element.game = Constants.lottoConst.lottoPlus1;
               } else if (element.isLottoPlusTwo) {
                  element.game = Constants.lottoConst.lottoPlus2;
               } else {
                  element.game = Constants.lottoConst.lottoTicket;
               }
               break;
            case Constants.lottoConst.pwbType:
               if (element.isLottoPlus) {
                  element.game = Constants.lottoConst.pwbPlus;
               } else {
                  element.game = Constants.lottoConst.pwbTicket;
               }
               break;
            default:
               element.game = Constants.lottoConst.lottoTicket;
         }

      });

      return response;
   }

   onReplay(batchId) {

      this.gameService.getLottoTicketReplayData(batchId).subscribe(selectedLottoTktInfo => {
         if (selectedLottoTktInfo != null) {
            this.ticketInfo = selectedLottoTktInfo;
            this.ticketInfo.isReplay = true;
            this.data = {
               isReplay: this.ticketInfo.isReplay,
               isEdit: true
            };
            this.preFillService.activeData = this.data;
            this.ticketInfo.isViewMore = true;
            this.isReplay = true;
            this.ticketInfo.method = this.ticketInfo.gameType;
            if (this.ticketInfo.method === Constants.VariableValues.gameMethod.a) {
               this.ticketInfo.method = Constants.lottoConst.quickPick;
               this.ticketInfo.BoardDetails = [];
            } else {
               this.ticketInfo.method = Constants.lottoConst.pickNumbers;
            }
            this.preFillService.preFillReplayData = this.ticketInfo;
            this.router.navigate(['/game']);
         }
      });
      const replayTicket = GAEvents.gameSection.replayTicketScreen;
      this.sendEvent(replayTicket.eventAction, replayTicket.label, null, replayTicket.category);
   }

}
