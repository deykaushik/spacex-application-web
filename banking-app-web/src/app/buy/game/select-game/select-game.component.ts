import { Component, Output, OnInit, EventEmitter, Inject, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { GameService } from '../game.service';
import { BaseComponent } from '../../../core/components/base/base.component';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { IDropdownItem } from '../../../core/utils/models';
import { ISelectGameVm, IGameDrawInfo, IGameDayTimeSheet, GameCodes } from '../models';
import { IGameMetadata, IJackpotInfo } from '../../../core/services/models';
import { GAEvents } from '../../../core/utils/ga-event';

@Component({
   selector: 'app-select-game',
   templateUrl: './select-game.component.html',
   styleUrls: ['./select-game.component.scss']
})
export class SelectGameComponent extends BaseComponent implements OnInit, IWorkflowChildComponent {

   vm: ISelectGameVm;

   jackpots: IJackpotInfo[];
   jackpotsByGame: IJackpotInfo[];
   isVisible: boolean;
   gameDayChart: IGameDayTimeSheet[];
   gameTodaySheet: IGameDayTimeSheet;

   drawDate: Date;
   drawTime: string;
   lottoPayLimit: number;
   bothGameNotAvailable = false;
   formats = Constants.formats;
   gameTimeLeft: number = -45;
   gameTimeout;
   gameHurryTime = Constants.VariableValues.gameHurryTime;

   @Output() isComponentValid: EventEmitter<boolean> = new EventEmitter<boolean>();
   playMethods = CommonUtility.covertToDropdownObject(Constants.VariableValues.playMethods);
   selectedPlayMethod: IDropdownItem;
   selectedGameType: IDropdownItem;
   gameLottoCode = Constants.VariableValues.gameTypes.LOT.code;
   gamePowerballCode = Constants.VariableValues.gameTypes.PWB.code;
   areJackpotsLoaded = false;
   arelimitsLoaded = false;
   isChartLoaded = false;
   constructor(private gameService: GameService, private router: Router, private activatedRoute: ActivatedRoute,
      @Inject(DOCUMENT) private document: Document, injector: Injector) {
      super(injector);
   }

   nextClick(currentStep: number) {
      if (this.gameTimeout) {
         this.gameService.gameWorkflowSteps.selectGame.isDirty = false;
         this.router.navigateByUrl(Constants.routeUrls.dashboard);
         return;
      }
      this.vm.game = this.selectedGameType.code;
      this.vm.method = this.selectedPlayMethod.code;
      if (this.gameService.getSelectGameVm().game !== this.vm.game) {
         const selectGameForVmObj = this.gameService.getSelectGameForVm();
         selectGameForVmObj.yourReference = '';
         this.gameService.saveSelectGameForInfo(selectGameForVmObj);
      }
      this.gameService.saveSelectGameVm(this.vm);
      this.sendEvent('buy_' + this.selectedGameType.text + '_how_to_play_click_on_next');
   }

   stepClick(stepInfo: IStepInfo) {
   }

   ngOnInit() {
      this.vm = this.gameService.getSelectGameVm();
      this.populateSelectedGame();
      const select_lotto = GAEvents.gameSection.lottoClick;
      this.sendEvent(select_lotto.eventAction, select_lotto.label, null, select_lotto.category);
      this.gameService.jackpotDataObserver.subscribe(jackpots => {
         this.jackpots = jackpots && jackpots.length ? jackpots : [];
         this.areJackpotsLoaded = this.jackpots.length !== 0;
         this.gameChanged();
         this.validate();
      });

      this.gameService.lottoLimitDataObserver.subscribe(lottoPayLimit => {
         if (lottoPayLimit != null) {
            this.lottoPayLimit = lottoPayLimit;
            this.arelimitsLoaded = true;
         }
         this.validate();
      });
      this.gameService.gamesDayChartObserver.subscribe(isupdated => {
         if (isupdated) {
            this.checkGameTime();
            this.checkBothGames();
         }
         this.isChartLoaded = isupdated;
         this.validate();
      });
      this.activatedRoute.queryParams
         .subscribe(params => {
            const code = params['game'];
            if (code in GameCodes) {
               this.populateGameType(code);
            }
         });
      this.validate();

   }
   validate() {
      this.isComponentValid.emit(this.areJackpotsLoaded && this.arelimitsLoaded && this.isChartLoaded);
   }
   checkGameTime() {
      this.gameService.selectGameNext.text = Constants.labels.nextText;
      if (this.selectedGameType.code === this.gameLottoCode) {
         this.gameDayChart = this.gameService.lottoDayChart;
      } else {
         this.gameDayChart = this.gameService.powerDayChart;
      }
      if (!this.gameDayChart || !this.gameDayChart.length) {
         return;
      }
      this.gameTodaySheet = this.gameService.getTodayTimeSheet(this.gameDayChart);
      this.gameTimeLeft = this.gameService.todayGameTimeLeft(this.gameDayChart);
      this.gameTimeout = this.gameService.checkGameTimeOut(this.selectedGameType.code);
      if (this.gameTimeout) {
         this.gameService.selectGameNext.text = Constants.labels.goOverview;
      }
   }

   updateNextDrawDate(jackpot: IJackpotInfo) {
      if (jackpot && jackpot.nextDrawDate.length) {
         this.drawDate = new Date(jackpot.nextDrawDate);
      }
   }


   populatePlayMethod(playMethod: string) {
      switch (playMethod) {
         case Constants.VariableValues.playMethods.pick.code:
            this.selectedPlayMethod = Constants.VariableValues.playMethods.pick;
            break;
         case Constants.VariableValues.playMethods.quickPick.code:
            this.selectedPlayMethod = Constants.VariableValues.playMethods.quickPick;
            break;
         default:
            throw Error('invalid play method');
      }
   }

   populateGameType(gameType: string) {

      if (gameType === Constants.VariableValues.gameTypes.LOT.code) {
         this.selectedGameType = {
            code: Constants.VariableValues.gameTypes.LOT.code,
            text: Constants.VariableValues.gameTypes.LOT.text
         };
      } else {
         this.selectedGameType = {
            code: Constants.VariableValues.gameTypes.PWB.code,
            text: Constants.VariableValues.gameTypes.PWB.text
         };
      }
      this.gameChanged();
   }

   isLesstimeleft() {
      return (this.gameTimeLeft < 0 && this.gameTimeLeft >= this.gameHurryTime);
   }

   onPlayMethodChanged(playMethod: IDropdownItem) {
      if (this.selectedPlayMethod !== playMethod) {
         this.gameService.gameWorkflowSteps.selectGame.isDirty = true;
      }
      this.selectedPlayMethod = playMethod;
      const boardDetails = this.gameService.getSelectNumbersVm().BoardDetails;
      if (boardDetails) {
         boardDetails.length = 0;
      }
   }

   populateSelectedGame() {
      this.populateGameType(this.vm.game);
      this.populatePlayMethod(this.vm.method);
   }

   showJackpots() {
      this.isVisible = true;
   }

   hideJackpots() {
      this.isVisible = false;
   }

   private gameChanged() {
      if (this.jackpots && this.jackpots.length) {
         const jackpot = this.gameService.getJackpotByGame(this.jackpots, this.selectedGameType.text);
         this.jackpotsByGame = this.gameService.getJackpotsByGame(this.jackpots, this.selectedGameType.text);
         this.updateNextDrawDate(jackpot);
      }
      this.checkGameTime();
      this.checkBothGames();
   }

   checkBothGames() {
      this.bothGameNotAvailable = this.gameService.checkGameTimeOuts();
   }

   hideTimeOutOverlay(code) {
      this.bothGameNotAvailable = false;
      this.document.body.classList.remove('overlay-no-scroll');
      this.router.navigateByUrl(Constants.routeUrls.dashboard);
   }
}
