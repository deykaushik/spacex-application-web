
import { element } from 'protractor';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';

import { CommonUtility } from './../../../core/utils/common';
import { Constants } from './../../../core/utils/constants';

import { ILottoNumberPickerResult } from './../../../core/utils/models';
import { ISelectedBalls, ISelectNumbersVm } from './../../../buy/game/models';
import { GameService } from './../../../buy/game/game.service';

import { PreFillService } from '../../../core/services/preFill.service';
@Component({
   selector: 'app-lotto-number-picker',
   templateUrl: './lotto-number-picker.component.html',
   styleUrls: ['./lotto-number-picker.component.scss']
})
export class LottoNumberPickerComponent implements OnInit, OnChanges {
   selectNumbers: ISelectNumbersVm;
   isReplay: boolean;
   @Input() selectedLotteryNumbersString: string;
   @Input() openLottoPickerOnLoad: boolean;
   @Input() isPowerBall: boolean;
   @Input() ballMatrixMax: number;
   @Input() ballMatrixMin: number;
   @Input() powerBallMatrixMax: number;
   @Input() powerBallMatrixMin: number;
   @Input() borderNumber: string;
   @Output() onBoardClose = new EventEmitter();
   @Output() valueChange: EventEmitter<ILottoNumberPickerResult> = new EventEmitter<ILottoNumberPickerResult>();
   @Output() onBoardOpen = new EventEmitter();

   @ViewChild('lotteryDropdown') lotteryDropdown: ElementRef;

   lottoLabel: string;
   lottoLabels = Constants.labels.lottoLabels;
   lotteryNumberGroupSize = 7;
   lotteryNumbers = [];
   selectedLotteryNumbers = [];

   powerBallNumberGroupSize = 7;
   powerBallNumbers = [];
   selectedPowerBallNumbers = [];
   selectedPowerBallTarget: any;

   isLotteryDropdownDirty = false;
   numbersToBePicked: number;
   powerBallsToBePicked: number;

   pickBallErrorMessage = '';

   board1PowerBallClass = 'powerball-board-1';
   board2PowerBallClass = 'powerball-board-2';
   selectedBalls: ISelectedBalls[];

   constructor(private gameService: GameService, private preFillService: PreFillService) {
      if (this.preFillService.activeData) {
         this.isReplay = this.preFillService.activeData.isReplay;
      }
   }

   ngOnInit() {
      if (this.isReplay) {
         this.openLottoPickerOnLoad = false;
         this.pushBallsinArray();
      }

      if (this.isPowerBall) {
         this.numbersToBePicked = 5;
         this.powerBallsToBePicked = 1;
      } else {
         this.numbersToBePicked = 6;
         this.powerBallsToBePicked = 0;
      }

      if (this.openLottoPickerOnLoad) {
         this.setErrorMessage();
      }

      this.processSelectedLotteryNumbersString();
      this.lotteryNumbers = this.createLotteryNumbersArray(this.ballMatrixMin, this.ballMatrixMax, this.lotteryNumberGroupSize);

      this.powerBallNumbers = this.createLotteryNumbersArray(this.powerBallMatrixMin,
         this.powerBallMatrixMax, this.powerBallNumberGroupSize);
      this.lottoLabel = CommonUtility.format(this.lottoLabels.pickBallsMessage, this.numbersToBePicked === 6 ? '6' : '5');
      if (this.openLottoPickerOnLoad) {
         this.isLotteryDropdownDirty = true;
      }
   }

   processSelectedLotteryNumbersString() {
      let selectedNumbers = [];
      if (this.selectedLotteryNumbersString) {
         selectedNumbers = this.selectedLotteryNumbersString.split(' ').map((textNumber) => {
            return parseInt(textNumber, 10);
         });

         if (this.isPowerBall) {
            this.selectedLotteryNumbers = selectedNumbers.splice(0, this.numbersToBePicked);
            this.selectedPowerBallNumbers = selectedNumbers
               .splice(0, this.powerBallsToBePicked);
         } else {
            this.selectedLotteryNumbers = selectedNumbers;
         }
      }
   }

   getBallClass(lotteryNumber: number, isPowerBallBoard2: boolean, checkForSelection?: boolean): string {
      let isLotteryNumberSelected,
         ballClass = '',
         ballClassToReturn = '',
         selectedBallsArray: number[];
      isLotteryNumberSelected = false;

      if (this.isPowerBall) {
         if (isPowerBallBoard2) {
            selectedBallsArray = this.selectedPowerBallNumbers;
            ballClass = this.board2PowerBallClass;
         } else {
            selectedBallsArray = this.selectedLotteryNumbers;
            ballClass = this.board1PowerBallClass;
         }
      } else {
         selectedBallsArray = this.selectedLotteryNumbers;
         ballClass = 'group' + this.getLotteryNumberGroup(lotteryNumber);
      }

      isLotteryNumberSelected = selectedBallsArray.indexOf(lotteryNumber) >= 0;
      if (isLotteryNumberSelected || !checkForSelection) {
         ballClassToReturn = ballClass;
      } else {
         ballClassToReturn = '';
      }
      return ballClassToReturn;
   }

   onSelectNumber(event, isPowerBallBoard2: boolean) {
      event.stopPropagation();

      const target = event.target,
         lotteryNumber = parseInt(target.innerHTML, 10),
         ballClass = this.getBallClass(lotteryNumber, isPowerBallBoard2, false);

      let numbersToBePicked: number,
         ballArray: number[];

      if (lotteryNumber) {
         if (isPowerBallBoard2) {
            ballArray = this.selectedPowerBallNumbers = [];
            numbersToBePicked = this.powerBallsToBePicked;
         } else {
            ballArray = this.selectedLotteryNumbers;
            numbersToBePicked = this.numbersToBePicked;
         }

         if (target.classList.contains(ballClass)) {
            target.classList.remove(ballClass);
            ballArray.splice(ballArray.indexOf(lotteryNumber), 1);
         } else {
            if (ballArray.length < numbersToBePicked) {
               target.classList.add(ballClass);
               ballArray.push(lotteryNumber);
               ballArray.sort((a, b) => {
                  return a - b;
               });
            }
         }

         this.setErrorMessage();
         this.closeLotteryDropdownIfComplete();
         this.valueChange.emit(
            {
               value: (this.selectedLotteryNumbers.join(' ') +
                  (this.isPowerBall ? (' ' + this.selectedPowerBallNumbers.join(' ')) : '')).trim(),
               isValid: this.isValid(),
               selectedBalls: this.pushBallsinArray()
            }
         );
      }
   }

   pushBallsinArray() {
      this.selectedBalls = [];
      this.selectNumbers = this.gameService.getSelectNumbersVm();
      if (this.isPowerBall) {
         this.selectedLotteryNumbers.forEach((element) => {
            this.selectedBalls.push({
               numberValue: element,
               className: this.board1PowerBallClass
            });
         });
         this.selectedPowerBallNumbers.forEach((element) => {
            this.selectedBalls.push({
               numberValue: element,
               className: this.board2PowerBallClass
            });
         });
      } else {
         this.selectedLotteryNumbers.forEach((element) => {
            this.selectedBalls.push({
               numberValue: element,
               className: 'group' + this.getLotteryNumberGroup(element)
            });
         });
      }
      return this.selectedBalls;
   }

   closeLotteryDropdownIfComplete() {
      if (this.isBoardComplete()) {
         this.lotteryDropdown.nativeElement.click();
      }
   }

   createLotteryNumbersArray(lotteryNumberStart, lotteryNumberEnd, lotteryNumberGroupSize): number[] {
      let lotteryNumberGroup, lotteryNumbers;
      lotteryNumberGroup = lotteryNumbers = [];
      for (let counteri = lotteryNumberStart; counteri <= lotteryNumberEnd; counteri = counteri + lotteryNumberGroupSize) {
         lotteryNumberGroup = [];
         for (let counterj = 0; counterj < lotteryNumberGroupSize; counterj++) {
            if ((counterj + counteri) > lotteryNumberEnd) {
               break;
            } else {
               lotteryNumberGroup.push(counterj + counteri);
            }
         }
         lotteryNumbers.push(lotteryNumberGroup);
      }
      return lotteryNumbers;
   }

   getLotteryNumberGroup(lotteryNumber) {
      return CommonUtility.getLotteryNumberGroup(lotteryNumber);
   }

   onLotteryDropdownOpen() {
      this.isLotteryDropdownDirty = true;
      this.setErrorMessage();
      this.onBoardOpen.emit(this.borderNumber);
   }

   isValid() {
      return this.selectedLotteryNumbers && this.selectedLotteryNumbers.length === this.numbersToBePicked
         && (this.isPowerBall ? this.selectedPowerBallNumbers.length === this.powerBallsToBePicked : true);
   }

   setErrorMessage() {
      const isBoard1Invalid = this.selectedLotteryNumbers.length === 0 || this.selectedLotteryNumbers.length < this.numbersToBePicked,
         isBoard2Invalid = this.selectedPowerBallNumbers.length === 0 || this.selectedPowerBallNumbers.length < this.powerBallsToBePicked,
         noBallsSelected = this.selectedLotteryNumbers.length === 0 && this.selectedPowerBallNumbers.length === 0;

      switch (true) {
         case (!this.isPowerBall && isBoard1Invalid) || (this.isPowerBall && isBoard1Invalid && !isBoard2Invalid):
            this.pickBallErrorMessage = CommonUtility
               .format(this.lottoLabels.pickBallsError, this.numbersToBePicked === 6 ? '6' : '5');
            break;
         case noBallsSelected:
            this.pickBallErrorMessage = this.lottoLabels.noBallSelectedError;
            break;
         case isBoard1Invalid && isBoard2Invalid:
            this.pickBallErrorMessage = CommonUtility.format(this.lottoLabels.powerBallBothBoardsInvalid, this.borderNumber);
            break;
         case !isBoard1Invalid && isBoard2Invalid:
            this.pickBallErrorMessage = CommonUtility.format(this.lottoLabels.pickPowerBallError,
               this.powerBallsToBePicked === 1 ? 'one' : this.powerBallsToBePicked);
            break;
         default:
            this.pickBallErrorMessage = '';
            break;
      }
   }

   isBoardComplete(): boolean {
      let complete;
      complete = false;
      if (this.isPowerBall) {
         if (this.selectedLotteryNumbers.length === this.numbersToBePicked
            && this.selectedPowerBallNumbers.length === this.powerBallsToBePicked) {
            complete = true;
         }
      } else {
         if (this.selectedLotteryNumbers.length === this.numbersToBePicked) {
            complete = true;
         }
      }
      return complete;
   }
   ngOnChanges() {
      if (this.openLottoPickerOnLoad) {
         this.isLotteryDropdownDirty = true;
         this.setErrorMessage();
      }
   }
}
