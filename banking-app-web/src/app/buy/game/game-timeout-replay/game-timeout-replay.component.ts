import { element } from 'protractor';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';

import { Constants } from './../../../core/utils/constants';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { IAccountDetail } from './../../../core/services/models';
import { ISelectNumbersVm, Board, IGameMetaData, IGameDrawDetails, IGameDayTimeSheet, ILottoDrawDays, ILottoCutOfTime } from '../models';
import { GameService } from '../game.service';

@Component({
   selector: 'app-game-timeout-replay',
   templateUrl: './game-timeout-replay.component.html',
   styleUrls: ['./game-timeout-replay.component.scss']
})
export class GameTimeoutReplayComponent implements OnInit {
   labels = Constants.labels;
   title: string;
   lottoLabels = Constants.labels.lottoLabels;
   gameDayCodes = Constants.VariableValues.gameDayCodes;
   lottoConstants = Constants.lottoConst;
   lottoDayChart: IGameDayTimeSheet[];
   powerDayChart: IGameDayTimeSheet[];
   lottoDrawDays: ILottoDrawDays[];
   PowerballDrawDays: ILottoDrawDays[];
   lottoCutOffTiming: ILottoCutOfTime;
   gameStartTime: string;
   gameHistoryUrl = Constants.routeUrls.gameHistory;

   constructor(private gameService: GameService, private router: Router) { }

   ngOnInit() {
      // below line is not to display cancel transaction guard as it is added App level
      this.gameService.gameWorkflowSteps.selectGame.isDirty = false;
      this.gameService.gamesDayChartObserver.subscribe(isupdated => {
         if (isupdated) {
            this.checkGameTime();
         }
      });
   }

   // Below function is used to get the time charts for games from existing gameService to dispaly on timeout window
   checkGameTime() {
      this.lottoDayChart = this.gameService.lottoDayChart;
      this.powerDayChart = this.gameService.powerDayChart;
      this.lottoDrawDays = this.gameService.getDrawdays(this.gameService.lottoMeta);
      this.PowerballDrawDays = this.gameService.getDrawdays(this.gameService.powerMeta);
      this.lottoCutOffTiming = this.gameService.getCutOffTiming(this.gameService.lottoMeta);
      this.gameStartTime = this.gameService.lottoMeta.startTime;
      this.title = this.labels.gameTimeout.bothGameNotAvailableReplay;
   }

   goToHistory() {
      this.gameService.clearGameDetails();
      this.router.navigateByUrl(this.gameHistoryUrl);
   }
}
