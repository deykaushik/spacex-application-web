import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { IDrawResult, IBallDetail, IWinnerDetail } from '../models';
import { IGameWinningNumbersData } from '../../../core/services/models';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { GameService } from '../game.service';
import { PreFillService } from '../../../core/services/preFill.service';
import { AuthConstants } from '../../../auth/utils/constants';

@Component({
   selector: 'app-draw-detail',
   templateUrl: './draw-detail.component.html',
   styleUrls: ['./draw-detail.component.scss']
})
export class DrawDetailComponent implements OnInit {
   data: {};
   lottoDrawDetail: IDrawResult;
   drawDate: string;
   drawName: string;
   ballDetails: IBallDetail[];
   dateFormat = Constants.formats.ddMMYYYY;
   winnerDetails: IWinnerDetail[];
   totalPrizePoolAmount: number;
   totalSalesAmount: number;
   drawMachineName: string;
   ballSetNumber: string;
   drawNumber: number;
   drawNameDetail: string;
   drawType: string;
   ballClassToReturn: string;
   skeletonMode = true;
   winningDrawDetailLabels = Constants.labels.lottoLabels;
   amountPipeConfig = Constants.amountPipeSettings.amountWithPrefix;
   winningNumberBackBtn = Constants.path.winningNumbersDetail;
   winningNumbersInfo: IDrawResult[];
   lottoErrorText: string;
   isLottoError = false;

   constructor(private gameService: GameService, private route: ActivatedRoute, private preFillService: PreFillService) {
      this.route.params.subscribe((params: Params) => {
         this.drawType = params['ticketType'];
         this.drawNumber = +params['drawNumber'];
      });
   }

   ngOnInit() {
      this.getLottoDrawDetails();
      this.setDrawName(this.drawType);
   }

   getLottoDrawDetails() {
      this.gameService.getDrawDetails().subscribe((response) => {
         if (response) {
            this.lottoDrawDetail = response.find(res => res.drawName === this.drawType);
            this.winningNumbersInfo = [this.lottoDrawDetail];
            this.drawDate = this.lottoDrawDetail.drawDate;
            this.drawName = this.lottoDrawDetail.drawName;
            this.data = {
               drawName: this.drawName
            };
            this.preFillService.activeData = this.data;
            this.ballDetails = this.lottoDrawDetail.ballDetails;
            this.winnerDetails = this.lottoDrawDetail.winnerDetails;
            this.winnerDetails.forEach(element => {
               if (element.numberOfWinners === 1) {
                  element.winnerLabel = this.winningDrawDetailLabels.numberOfWinner;
               } else {
                  element.winnerLabel = this.winningDrawDetailLabels.numberOfWinners;
               }
            });
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

   setDrawName(drawName: string) {
      switch (drawName) {
         case this.winningDrawDetailLabels.winningNumbersGameLotto: {
            this.drawNameDetail = this.winningDrawDetailLabels.lottoTitle + this.winningDrawDetailLabels.drawNameTitle;
            break;
         }
         case this.winningDrawDetailLabels.winningNumbersGameLottoPlus: {
            this.drawNameDetail = this.winningDrawDetailLabels.IsLottoPlusOne + this.winningDrawDetailLabels.drawNameTitle;
            break;
         }
         case this.winningDrawDetailLabels.winningNumbersGameLottoPlus2: {
            this.drawNameDetail = this.winningDrawDetailLabels.IsLottoPlusTwo + this.winningDrawDetailLabels.drawNameTitle;
            break;
         }
         case this.winningDrawDetailLabels.winningNumbersGamePowerBall: {
            this.drawNameDetail = this.winningDrawDetailLabels.winningNumbersGamePowerBall + this.winningDrawDetailLabels.drawNameTitle;
            break;
         }
         case this.winningDrawDetailLabels.winningNumbersGamePowerBallPlus: {
            this.drawNameDetail = this.winningDrawDetailLabels.winningNumberPowerball + this.winningDrawDetailLabels.drawNameTitle;
            break;
         }
      }
      return this.drawNameDetail + this.winningDrawDetailLabels.drawNameTitle;
   }

}
