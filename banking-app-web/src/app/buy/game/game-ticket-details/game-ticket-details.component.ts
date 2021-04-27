import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonUtility } from '../../../core/utils/common';

import { GameService } from '../game.service';
import { IGameTicketData, BoardDetail } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { ISelectNumbersVm } from '../models';
import { PreFillService } from '../../../core/services/preFill.service';
import { AuthConstants } from '../../../auth/utils/constants';

@Component({
   selector: 'app-game-ticket-details',
   templateUrl: './game-ticket-details.component.html',
   styleUrls: ['./game-ticket-details.component.scss']
})

export class GameTicketDetailsComponent implements OnInit {
   data: {};
   selectedLottoTktInfo: IGameTicketData;
   batchID: number;
   ticketType: string;
   game: string;
   drawNumber: number;
   fromAccountDetails: string;
   ticketStatus: string;
   ticketInfo: IGameTicketData;
   ticketInfoReplay: ISelectNumbersVm;
   ticketBoards: BoardDetail[];
   fromAccountType: string;
   ballClassToReturn: string;
   accountTypes = CommonUtility.covertToDropdownObject(Constants.VariableValues.accountTypes);
   formats = Constants.formats;
   lottoFromAccount = Constants.labels.buyLabels.fromAccount;
   lottoTicketDescription = Constants.transactionDetailsLabels.fieldLabels.description;
   lottoLabels = Constants.labels.lottoLabels;
   skeletonMode: boolean;
   isReplay: boolean;
   gameLabels = Constants.lottoConst;
   lottoErrorText: string;
   isLottoError: boolean;
   constructor(private gameService: GameService, private route: ActivatedRoute, private router: Router,
      private preFillService: PreFillService) { }

   ngOnInit() {
      this.route.params.subscribe((params: Params) => {
         this.ticketType = params['ticketType'];
         this.batchID = params['batchID'];
      });
      this.skeletonMode = true;
      this.getTicketDetailsData();
   }

   getTicketDetailsData() {
      this.gameService.getLottoTicketData(this.batchID).subscribe(selectedLottoTktInfo => {
         if (selectedLottoTktInfo !== null) {
            this.ticketInfo = selectedLottoTktInfo;
            this.ticketInfo.isReplay = true;
            this.ticketInfo.isViewMore = false;
            this.ticketBoards = this.ticketInfo.boardDetails;

            this.ticketBoards.forEach(ticketBoard => {
               if (ticketBoard.numbersPlayed && !Array.isArray(ticketBoard.numbersPlayed)) {
                  ticketBoard.numbersPlayed = CommonUtility.getNumberArray(ticketBoard.numbersPlayed);
               }
            });

            this.game = this.ticketInfo.game;
            this.drawNumber = this.ticketInfo.drawNumber + (this.ticketInfo.drawsPlayed - 1);
            this.fromAccountType = this.getAccountTypeByCode(this.ticketInfo.fromAccount.accountType);
            this.fromAccountDetails = this.ticketInfo.fromAccount.accountType + '-' + this.ticketInfo.fromAccount.accountNumber;
         }
      },
         error => {
            this.isLottoError = true;
            this.lottoErrorText = AuthConstants.messages.nextLottoPalletError;
         },
         () => {
            this.skeletonMode = false;
         });
   }

   getAccountTypeByCode(code: string): any {
      const accountType = this.accountTypes.find(accType => accType.value.code === code);
      return accountType.value.text;
   }

   getLotteryNumberGroup(lotteryNumber: number) {
      return CommonUtility.getLotteryNumberGroup(lotteryNumber);
   }

   getBallClass(lotteryNumber: number, lotteryNumberIndex: number): string {
      if (this.game === Constants.labels.lottoLabels.IsGameTypeLotto) {
         this.ballClassToReturn = 'group' + this.getLotteryNumberGroup(lotteryNumber);
      } else {
         if (lotteryNumberIndex !== 5) { // index 5 is only bounce powerball
            this.ballClassToReturn = 'powerball-board-1';
         } else {
            this.ballClassToReturn = 'powerball-board-2';
         }
      }
      return this.ballClassToReturn;
   }

   onReplay(batchId) {
      this.gameService.getLottoTicketReplayData(batchId).subscribe(selectedLottoTktInfo => {
         if (selectedLottoTktInfo !== null) {
            this.ticketInfoReplay = selectedLottoTktInfo;
            this.ticketInfoReplay.isReplay = true;
            this.data = {
               isReplay: this.ticketInfoReplay.isReplay,
               isEdit: true
            };
            this.preFillService.activeData = this.data;

            this.ticketInfoReplay.isViewMore = false;
            this.isReplay = true;
            this.ticketInfoReplay.method = this.ticketInfoReplay.gameType;
            if (this.ticketInfoReplay.method === Constants.VariableValues.gameMethod.a) {
               this.ticketInfoReplay.method = Constants.lottoConst.quickPick;
               this.ticketInfoReplay.BoardDetails = [];
            } else {
               this.ticketInfoReplay.method = Constants.lottoConst.pickNumbers;
            }
            this.preFillService.preFillReplayData = this.ticketInfoReplay;
            this.router.navigate(['/game']);
         }
      });

   }
}
