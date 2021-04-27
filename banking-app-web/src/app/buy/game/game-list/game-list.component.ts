import { Component, OnInit, Input } from '@angular/core';
import { Constants } from '../../../core/utils/constants';
import { IGameWinningNumbersData } from '../../../core/services/models';
import { CommonUtility } from '../../../core/utils/common';
import { SkeletonLoaderPipe } from '../../../shared/pipes/skeleton-loader.pipe';

@Component({
   selector: 'app-game-list',
   templateUrl: './game-list.component.html',
   styleUrls: ['./game-list.component.scss']
})

export class GameListComponent implements OnInit {
   constructor() { }

   @Input() winningNumbersInfo: IGameWinningNumbersData[];
   @Input() winningNumberBack: string;
   @Input() winningNumberHeadTitle: string;
   @Input() skeletonMode: Boolean;

   formats = Constants.formats;
   ballClassToReturn: string;
   winningNumbersLabels = Constants.labels.lottoLabels;
   gameName: string;

   ngOnInit() {

   }

   setDrawName(drawName: string) {
      switch (drawName) {
         case this.winningNumbersLabels.winningNumbersGameLotto: {
            this.gameName = this.winningNumbersLabels.lottoTitle;
            break;
         }
         case this.winningNumbersLabels.winningNumbersGameLottoPlus: {
            this.gameName = this.winningNumbersLabels.IsLottoPlusOne;
            break;
         }
         case this.winningNumbersLabels.winningNumbersGameLottoPlus2: {
            this.gameName = this.winningNumbersLabels.IsLottoPlusTwo;
            break;
         }
         case this.winningNumbersLabels.winningNumbersGamePowerBall: {
            this.gameName = this.winningNumbersLabels.powerballTitle;
            break;
         }
         case this.winningNumbersLabels.winningNumbersGamePowerBallPlus: {
            this.gameName = this.winningNumbersLabels.winningNumberPowerball;
            break;
         }
      }
      return this.gameName;
   }

   getLotteryNumberGroup(lotteryNumber: number) {
      return CommonUtility.getLotteryNumberGroup(lotteryNumber);
   }

   getBallClass(lotteryNumber: number, gameName: string, lotteryNumberIndex: number): string {
      if (gameName === this.winningNumbersLabels.winningNumbersGamePowerBall ||
         gameName === this.winningNumbersLabels.winningNumbersGamePowerBallPlus) {
         if (lotteryNumberIndex !== this.winningNumbersLabels.bouncePowerballNumber) {  // true if bounce powerball
            this.ballClassToReturn = this.winningNumbersLabels.powerBallGroup;
         } else {
            this.ballClassToReturn = this.winningNumbersLabels.powerBallGroupFour;
         }
      } else {
         this.ballClassToReturn = this.winningNumbersLabels.lottoBallGroup + this.getLotteryNumberGroup(lotteryNumber);
      }
      return this.ballClassToReturn;
   }

}
