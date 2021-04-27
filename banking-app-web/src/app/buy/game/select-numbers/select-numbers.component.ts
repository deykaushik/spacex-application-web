import { element } from 'protractor';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Injector } from '@angular/core';

import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { IAccountDetail } from './../../../core/services/models';
import { Constants } from './../../../core/utils/constants';
import { ISelectNumbersVm, Board, IGameMetaData, IGameDrawDetails, DummyBoard } from '../models';
import { GameService } from '../game.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { CommonUtility } from '../../../core/utils/common';
import { BaseComponent } from '../../../core/components/base/base.component';
import { ISelectedBalls } from './../models';
import { PreFillService } from '../../../core/services/preFill.service';

@Component({
   selector: 'app-select-numbers',
   templateUrl: './select-numbers.component.html',
   styleUrls: ['./select-numbers.component.scss']
})
export class SelectNumbersComponent extends BaseComponent implements OnInit, AfterViewInit, IWorkflowChildComponent {
   isEdit: boolean;

   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChild('gameSelectNumbersForm') gameSelectNumbersForm;
   insufficientFunds = false;
   fromAccounts: IAccountDetail[];
   vm: ISelectNumbersVm;
   metaData: IGameMetaData;
   drawDetails: IGameDrawDetails;
   showOverlay = false;
   board: Board;
   drawNumbers: number[];
   maxBoardLimit: boolean;
   isQuickPick: boolean;
   lottoPayLimit = 0;
   accountTypes = Constants.VariableValues.accountTypes;
   isDrawsLoaded = false;
   isAccountsLoaded = false;
   isMetadtaLoaded = false;
   isShownIncompleteboardError = false;
   allowedAccountTypes =
      [
         this.accountTypes.currentAccountType.code,
         this.accountTypes.savingAccountType.code,
         this.accountTypes.creditCardAccountType.code
      ];
   lotto = {
      maxValue: Constants.VariableValues.lotto.maxValue,
      maximumLottoNumbers: Constants.VariableValues.lotto.numberOfValues
   };
   selectedPlayMethod: string;
   isPowerBall: boolean;
   skeletonMode: boolean;
   numberOfQuickPickBoards: number[] = [];
   isAllBoardValid = false;
   isAnyBoardDirty = false;
   lottoLabels = Constants.labels.lottoLabels;
   openBoardIndex = 0;
   winningText: string;
   fromAccount: IAccountDetail;
   isReplay: boolean;
   boardDetails: Board[];
   method: string;
   errorMsg: string;
   amountPipeConfig = Constants.amountPipeSettings.amountWithLabelAndSign;
   gameCode: string;
   gameTimeOut: boolean;
   gameReplayNotAvailable: boolean;
   isChartLoaded = false;

   constructor(private gameService: GameService, private clientProfileDetailsService: ClientProfileDetailsService, injector: Injector,
      private preFillService: PreFillService) {
      super(injector);
      const dataReplay = this.preFillService.preFillReplayData;
      if (this.preFillService.activeData) {
         this.isReplay = this.preFillService.activeData.isReplay;
         this.isEdit = this.preFillService.activeData.isEdit;
      }
      // set data in case of Replay
      if (this.isReplay && this.isEdit) {
         if (dataReplay.isLottoPlusTwo) {
            dataReplay.isLottoPlus = true;
         }
         // push board with NumbersPlayed and BoardNumber
         if (dataReplay.boardDetails && dataReplay.boardDetails.length) {
            this.boardDetails = [];
            dataReplay.boardDetails.forEach((dummyBoard, index) => {
               const newboard = new Board();
               newboard.BoardNumber = dummyBoard.boardNumber;
               newboard.NumbersPlayed = dummyBoard.numbersPlayed;
               newboard.isValid = true;
               this.boardDetails.push(newboard);
            });
         }

         // Seting method type
         this.method = dataReplay.gameType;
         if (this.method === Constants.VariableValues.gameMethod.a) {
            this.method = Constants.lottoConst.quickPick;
            this.boardDetails = [];
         } else {
            this.method = Constants.lottoConst.pickNumbers;
         }
         const data = {
            game: dataReplay.game,
            method: dataReplay.method,
            BoardDetails: this.boardDetails,
            IsLottoPlus: dataReplay.isLottoPlus,
            IsLottoPlusTwo: dataReplay.isLottoPlusTwo,
            BoardsPlayed: dataReplay.boardsPlayed,
            DrawsPlayed: dataReplay.drawsPlayed,
            DrawNumber: dataReplay.drawNumber,
            TotalCost: dataReplay.totalCost,
            FromAccount: dataReplay.fromAccount,
            isValid: true,
            DrawDate: dataReplay.drawDate,
            accountNumberFromDashboard: dataReplay.fromAccount.accountNumber
         };
         this.gameService.saveSelectGameVm(dataReplay);
         this.gameService.saveSelectNumbersVm(data);
      }
   }

   private changeBoardDropdowns() {
      this.isQuickPick = this.vm.method === Constants.VariableValues.playMethods.quickPick.code;
   }

   private populateBoard() {

      if (this.gameService.getSelectGameVm().method === Constants.VariableValues.playMethods.quickPick.code
         || this.gameService.getSelectGameVm().method === Constants.VariableValues.playMethods.pick.code) {
         for (let i = this.metaData.minimumNumberOfBoardsAllowed; i <= this.metaData.maxNumberOfBoardsAllowed; i++) {
            this.numberOfQuickPickBoards.push(i);
         }
         if (this.gameService.getSelectGameVm().method === Constants.VariableValues.playMethods.pick.code && this.isReplay) {
            this.vm.BoardDetails = this.gameService.getSelectNumbersVm().BoardDetails;
         } else if (this.gameService.getSelectGameVm().method === Constants.VariableValues.playMethods.quickPick.code) {
            this.vm.BoardDetails = [];
         }
         this.calculateTotal(this.vm.BoardsPlayed);
         this.validate();
      } else {
         this.vm.BoardsPlayed = this.vm.BoardDetails.length;
      }
   }

   setDefaultBoards(minimumNumberOfBoardsAllowed) {
      this.vm.BoardDetails = Array.from(new Array(minimumNumberOfBoardsAllowed),
         (val, index) => ({
            BoardNumber: this.getNextBoardNumber(String.fromCharCode(64 + index)),
            NumbersPlayed: '',
            isValid: false
         }));
      this.populateBoard();
   }

   ngOnInit() {
      this.skeletonMode = true;
      // to check initially any data is available in preFillService
      if (this.preFillService.activeData && this.preFillService.preFillReplayData) {
         this.gameCode = this.preFillService.preFillReplayData.game;
         this.isReplay = this.preFillService.activeData.isReplay;
      } else {
         this.isReplay = false;
      }
      if (this.isReplay) {
         this.checkGameTimeout();
      }
      const selectGameVm = this.gameService.getSelectGameVm();
      this.isPowerBall = selectGameVm.game === Constants.VariableValues.gameTypes.PWB.code;
      this.vm = this.gameService.getSelectNumbersVm();
      // reset the vm if different game is selected
      if (this.vm.game && this.vm.game !== '' && this.vm.game !== selectGameVm.game) {
         this.vm = this.gameService.resetSelectNumberVm();
      }
      if (this.vm.BoardDetails) {
         this.changeBoardDropdowns();
      }

      this.gameService.lottoLimitDataObserver.subscribe(lottoPayLimit => {
         if (lottoPayLimit != null) {
            this.lottoPayLimit = lottoPayLimit;
         }
      });

      this.vm.game = selectGameVm.game;

      this.vm.TotalCost = this.vm.TotalCost || 0;
      this.vm.IsLottoPlus = this.vm.IsLottoPlus || false;
      this.vm.IsLottoPlusTwo = this.vm.IsLottoPlusTwo || false;
      // Game MetaData
      this.gameService.getGameMetaData().subscribe(response => {
         const data = this.isPowerBall ? response[1] : response[0];
         this.isMetadtaLoaded = true;
         this.metaData = {
            boardPrice: data.boardPrice,
            gameType: data.gameType,
            gameTypeName: data.gameTypeName,
            lottoPlusPrice: data.lottoPlusPrice,
            lottoPlusTwoPrice: data.lottoPlusTwoPrice,
            maxNumberOfBoardsAllowed: data.maxNumberOfBoardsAllowed,
            maxNumberOfDrawsAllowed: data.maxNumberOfDrawsAllowed,
            minimumNumberOfBoardsAllowed: data.minimumNumberOfBoardsAllowed,
            minimumNumberOfDrawsAllowed: data.minimumNumberOfDrawsAllowed
         };
         if (this.isPowerBall) {
            this.metaData.powerBallMatrixMax = data.powerBallMatrixMax;
            this.metaData.powerBallMatrixMin = data.powerBallMatrixMin;
            this.metaData.powerBallBonusBallMatrixMax = data.powerBallBonusBallMatrixMax;
            this.metaData.powerBallBonusBallMatrixMin = data.powerBallBonusBallMatrixMin;
            this.winningText = CommonUtility.format(this.lottoLabels.winningPowerBallText,
               this.metaData.lottoPlusPrice.toFixed(2));
         } else {
            this.metaData.lottoBallMatrixMax = data.lottoBallMatrixMax;
            this.metaData.lottoBallMatrixMin = data.lottoBallMatrixMin;
            this.winningText = CommonUtility.format(this.lottoLabels.winningLottoText,
               this.metaData.lottoPlusPrice.toFixed(2));
         }
         this.errorMsg = CommonUtility.format(this.lottoLabels.limitExceedError,
            this.isPowerBall ? 'PowerBall' : 'LOTTO');
         this.drawNumbers = Array.from(new Array(this.metaData.maxNumberOfDrawsAllowed),
            (val, index) => index + this.metaData.minimumNumberOfDrawsAllowed);
         if (this.vm.DrawsPlayed > this.metaData.maxNumberOfDrawsAllowed) {
            this.vm.DrawsPlayed = this.metaData.maxNumberOfDrawsAllowed;
         } else {
            this.vm.DrawsPlayed = this.vm.DrawsPlayed || this.drawNumbers[0];
         }
         if (!this.vm.BoardDetails || this.vm.BoardDetails.length === 0) {
            this.setDefaultBoards(this.metaData.minimumNumberOfBoardsAllowed);
         }
         this.changeBoardDropdowns();
         this.vm.BoardsPlayed = this.vm.BoardsPlayed || this.metaData.minimumNumberOfBoardsAllowed;
         this.calculateTotal(this.vm.BoardsPlayed);
         this.validate();
      });
      // Game Active Acoounts
      this.gameService.accountsDataObserver.subscribe(response => {
         response = response ? response : [];
         response = response.filter((account) => {
            return this.allowedAccountTypes.indexOf(account.accountType) >= 0;
         });
         this.fromAccounts = response;
         if (this.isReplay) {
            if (this.vm.FromAccount) {
               this.vm.FromAccount = this.fromAccounts.find(account =>
                  account.accountNumber === this.vm.FromAccount.accountNumber);
               this.fromAccount = this.vm.FromAccount;
            }
         }
         this.setAccountFrom();
         if (this.fromAccounts.length < 1) {
            this.showOverlay = true;
         } else {
            this.vm.FromAccount = this.vm.FromAccount || this.clientProfileDetailsService.getDefaultAccount(this.fromAccounts)
               || this.fromAccounts[0];
         }
         this.isAccountsLoaded = this.fromAccounts.length !== 0;
         this.skeletonMode = false;
         this.validate();
      });
      //  Draws Data
      this.gameService.getGameDraws().subscribe(response => {
         let drawName: string;
         if (this.isPowerBall) {
            drawName = Constants.VariableValues.gameTypes.PWB.text;
         } else {
            drawName = Constants.VariableValues.gameTypes.LOT.text;
         }

         const data = this.getGameDrawDetails(response, drawName);
         this.drawDetails = {
            drawDate: data.drawDate,
            drawName: data.gameName,
            drawNumber: data.drawNumber,
            nextDrawDate: data.nextDrawDate,
         };
         this.vm.DrawDate = this.drawDetails.drawDate;
         this.vm.DrawNumber = this.drawDetails;
         this.isDrawsLoaded = true;
         this.validate();
      });
   }
   // to get the timeout value for particular game if it is true then need to display timeout window
   checkGameTimeout() {
      this.gameService.gamesDayChartObserver.subscribe(isupdated => {
         if (isupdated) {
            this.gameTimeOut = this.gameService.checkGameTimeOut(this.gameCode);
            if (this.gameTimeOut) {
               this.gameReplayNotAvailable = true;
            }
         }
         this.isChartLoaded = isupdated;
         this.validateChart();
      });
   }
   validateChart() {
      this.isComponentValid.emit(this.isChartLoaded);
   }
   setAccountFrom() {
      if (!this.vm.FromAccount && this.vm.accountNumberFromDashboard) {
         this.vm.FromAccount = this.fromAccounts.filter((ac) => {
            return ac.itemAccountId === this.vm.accountNumberFromDashboard;
         })[0];
      }
   }

   getGameDrawDetails(gameDraws: IGameDrawDetails[], game: string): IGameDrawDetails {
      let gameDrawDetail: IGameDrawDetails;
      gameDrawDetail = gameDraws.filter((gameDraw) => {
         return gameDraw.game.toLowerCase().trim() === game.toLowerCase().trim();
      })[0];
      return gameDrawDetail;
   }

   lottoValueChange(event, boardNumber) {
      this.vm.BoardDetails.map(function (board, index) {
         if (board.BoardNumber === boardNumber) {
            board.isValid = event.isValid;
            if (board.isValid) {
               this.setNextInValidBoard(index);
            }
            board.NumbersPlayed = event.value;
            board.SelectedBalls = event.selectedBalls;
         }
      }, this);
      this.validate();
   }
   onBoardClose(boardNumber) {
      this.isAnyBoardDirty = true;
      this.isShownIncompleteboardError = false;
      const curretBoardIndex = boardNumber.charCodeAt(0) - 65;
      if (this.vm.BoardDetails[curretBoardIndex].isValid) {
         this.setNextInValidBoard(curretBoardIndex);
      }
   }
   onBoardOpen(boardNumber) {
      this.isShownIncompleteboardError = false;
      this.openBoardIndex = boardNumber.charCodeAt(0) - 65;
   }
   validate() {
      this.vm.isValid = false;
      if (this.vm.BoardDetails) {
         let isAllBoardValid = true;
         this.vm.BoardDetails.forEach(board => {
            if (!board.isValid) {
               isAllBoardValid = false;
            }
         });
         this.vm.isValid = isAllBoardValid;
         this.isAllBoardValid = isAllBoardValid;
      }
      if (this.vm.FromAccount) {
         if (this.vm.TotalCost > this.vm.FromAccount.availableBalance) {
            this.vm.isValid = false;
            this.insufficientFunds = true;
         } else {
            this.insufficientFunds = false;
         }
      }
      if (this.lottoPayLimit < this.vm.TotalCost) {
         this.vm.isValid = false;
      }
      this.vm.isValid = this.vm.isValid && this.isAccountsLoaded && this.isDrawsLoaded && this.isMetadtaLoaded && !this.skeletonMode;
      if (this.isReplay) {
         this.vm.isValid = true;
      }
      this.isComponentValid.emit(this.vm.isValid);
   }

   ngAfterViewInit() {
      this.gameSelectNumbersForm.valueChanges
         .subscribe(values => this.validate());
   }

   onAddBoard(event) {
      event.stopPropagation();
      if (this.vm.BoardDetails.length < this.metaData.maxNumberOfBoardsAllowed) {
         const lastBoardNumber = this.vm.BoardDetails[this.vm.BoardDetails.length - 1].BoardNumber;
         const newBoardNumber = this.getNextBoardNumber(lastBoardNumber);
         this.vm.BoardDetails.push({
            BoardNumber: newBoardNumber,
            NumbersPlayed: '',
            isValid: false
         });
         this.vm.BoardsPlayed = this.vm.BoardDetails.length;
         this.calculateTotal(this.vm.BoardsPlayed);
         this.openBoardIndex = this.vm.BoardDetails.length - 1;
      } else {
         this.maxBoardLimit = true;
      }
      this.populateBoard();
   }

   onRemoveBoard(indexValue) {
      this.isShownIncompleteboardError = false;
      this.vm.BoardDetails.splice(indexValue, 1);
      this.vm.BoardDetails.forEach((item, index) => {
         if (index >= indexValue) {
            item.BoardNumber = this.getLastBoardNumber(item.BoardNumber);
         }
      });
      this.vm.BoardsPlayed = this.vm.BoardDetails.length;
      this.maxBoardLimit = false;
      this.calculateTotal(this.vm.BoardsPlayed);
      this.openBoardIndex--;
   }

   onDrawChange(event, value) {
      this.vm.DrawsPlayed = value;
      this.vm.DrawNumber = this.drawDetails;
      this.calculateTotal(this.vm.BoardsPlayed);
   }
   OnQuickPickBoardSelected(event, value) {
      this.calculateTotal(value);
   }
   onLottoPlusChange() {
      if (!this.vm.IsLottoPlus) {
         this.vm.IsLottoPlusTwo = false;
      }
      this.calculateTotal(this.vm.BoardsPlayed);
   }

   onLottoPlusTwoChange() {
      this.calculateTotal(this.vm.BoardsPlayed);
   }

   calculateTotal(boardsPlayed) {
      this.vm.BoardsPlayed = boardsPlayed;
      const lottoPlusPrice = this.vm.IsLottoPlus ? (this.vm.BoardsPlayed * this.metaData.lottoPlusPrice) : 0;
      const lottoPlusTwoPrice = this.vm.IsLottoPlusTwo ? (this.vm.BoardsPlayed * this.metaData.lottoPlusTwoPrice) : 0;
      this.vm.TotalCost = ((this.vm.BoardsPlayed * this.metaData.boardPrice) +
         lottoPlusPrice + lottoPlusTwoPrice) * this.vm.DrawsPlayed;
      this.validate();
   }

   getNextBoardNumber(lastBoardNumber: string) {
      return String.fromCharCode(lastBoardNumber.charCodeAt(0) + 1);
   }

   getLastBoardNumber(lastBoardNumber: string) {
      return String.fromCharCode(lastBoardNumber.charCodeAt(0) - 1);
   }

   onFromAccountSelection(selectedAccount: IAccountDetail) {
      this.vm.FromAccount = selectedAccount;
      this.validate();
   }

   nextClick(currentStep: number) {
      this.gameService.saveSelectNumbersVm(this.vm);
      this.sendEvent('buy_' + this.drawDetails.drawName + '_how_many_boards_click_on_next');
   }

   stepClick(stepInfo: IStepInfo) {

   }

   setNextInValidBoard(currentIndex) {
      this.vm.BoardDetails.some((board, idx) => {
         if (!board.isValid && idx !== currentIndex) {
            this.openBoardIndex = idx;
            return true;
         }
      }, this);
   }
}
