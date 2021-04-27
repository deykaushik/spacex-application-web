import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from '../../core/utils/constants';
import { PreFillService } from '../../core/services/preFill.service';
import { CommonUtility } from '../../core/utils/common';

@Pipe({
   name: 'ballColor'
})

export class BallColorPipe implements PipeTransform {
   drawName: string;

   constructor(private preFillService: PreFillService) {
   }

   public divisionCorrectBalls: string;

   transform(value: number, category: string): any {
      if (this.preFillService.activeData) {
         this.drawName = this.preFillService.activeData.drawName;
      }
      const labels = Constants.labels.lottoLabels;
      if (category === labels.colorsLabel) {
         return value ? CommonUtility.ballBorder(value) : Constants.ballBorderColor.ballRedBorder;
      } else if (category === labels.correctBallsLabel && (this.drawName === labels.winningNumbersGameLotto ||
         this.drawName === labels.winningNumbersGameLottoPlus || this.drawName === labels.winningNumbersGameLottoPlus2)) {
         return value ? this.correctBallsLotto(value) : '';
      } else if (category === labels.correctBallsLabel && (this.drawName === labels.winningNumbersGamePowerBall ||
         this.drawName === labels.winningNumbersGamePowerBallPlus)) {
         return value ? this.correctBallsPwb(value) : '';
      }
   }
   private correctBallsLotto(divisionNumber: number) {
      switch (divisionNumber) {
         case 1:
            this.divisionCorrectBalls = Constants.divisionCorrectBalls.divisionOne;
            break;
         case 2:
            this.divisionCorrectBalls = Constants.divisionCorrectBalls.divisionTwo;
            break;
         case 3:
            this.divisionCorrectBalls = Constants.divisionCorrectBalls.divisionThree;
            break;
         case 4:
            this.divisionCorrectBalls = Constants.divisionCorrectBalls.divisionFour;
            break;
         case 5:
            this.divisionCorrectBalls = Constants.divisionCorrectBalls.divisionFive;
            break;
         case 6:
            this.divisionCorrectBalls = Constants.divisionCorrectBalls.divisionSix;
            break;
         case 7:
            this.divisionCorrectBalls = Constants.divisionCorrectBalls.divisionSeven;
            break;
         case 8:
            this.divisionCorrectBalls = Constants.divisionCorrectBalls.divisionEight;
            break;
      }
      return this.divisionCorrectBalls;
   }

   private correctBallsPwb(divisionNumber: number) {
      switch (divisionNumber) {
         case 1:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionOne;
            break;
         case 2:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionTwo;
            break;
         case 3:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionThree;
            break;
         case 4:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionFour;
            break;
         case 5:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionFive;
            break;
         case 6:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionSix;
            break;
         case 7:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionSeven;
            break;
         case 8:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionEight;
            break;
         case 9:
            this.divisionCorrectBalls = Constants.divisionCorrectBallsPwb.divisionNine;
            break;
      }
      return this.divisionCorrectBalls;
   }

}
