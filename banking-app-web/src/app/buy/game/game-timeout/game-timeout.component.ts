import { element } from 'protractor';

import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, Input } from '@angular/core';
import { IWorkflowChildComponent, IStepInfo } from '../../../shared/components/work-flow/work-flow.models';
import { IAccountDetail } from './../../../core/services/models';
import { Constants } from './../../../core/utils/constants';
import { ISelectNumbersVm, Board, IGameMetaData, IGameDrawDetails, IGameDayTimeSheet } from '../models';
import { GameService } from '../game.service';


@Component({
   selector: 'app-game-timeout',
   templateUrl: './game-timeout.component.html',
   styleUrls: ['./game-timeout.component.scss']
})
export class GameTimeoutComponent implements OnInit {
   lotoTimeout: boolean;
   powerTimeout: boolean;
   @Output() onButtonClick = new EventEmitter<string>();

   gameDayCodes = Constants.VariableValues.gameDayCodes;
   labels = Constants.labels;
   title: string;
   playTitle: string;
   lottoDayChart: IGameDayTimeSheet[];
   powerDayChart: IGameDayTimeSheet[];
   gameChart: IGameDayTimeSheet[];
   lotoTimeLeft: number;
   powerTimeLeft: number;
   playGameCode: string;
   visibleDetails = false;
   visibleLottoTable = false;
   visiblePowerTable = false;
   lottoDrawDays;
   PowerballDrawDays;
   lottoCutOffTiming;


   constructor(private gameService: GameService) { }

   ngOnInit() {
      this.gameService.gamesDayChartObserver.subscribe(isupdated => {
         if (isupdated) {
            this.checkGameTime();
         }
      });
   }

   checkGameTime() {
      this.lottoDayChart = this.gameService.lottoDayChart;
      this.powerDayChart = this.gameService.powerDayChart;
      this.lottoDrawDays = this.gameService.getDrawdays(this.gameService.lottoMeta);
      this.PowerballDrawDays = this.gameService.getDrawdays(this.gameService.powerMeta);
      this.lottoCutOffTiming = this.gameService.getCutOffTiming(this.gameService.lottoMeta);
      this.lottoCutOffTiming.Start = this.gameService.lottoMeta.startTime;
      this.lotoTimeLeft = this.gameService.todayGameTimeLeft(this.lottoDayChart);
      this.powerTimeLeft = this.gameService.todayGameTimeLeft(this.powerDayChart);
      this.lotoTimeout = this.gameService.checkGameTimeOut(Constants.VariableValues.gameTypes.LOT.code);
      this.powerTimeout = this.gameService.checkGameTimeOut(Constants.VariableValues.gameTypes.PWB.code);
      this.setDomValues();
   }

   onlyLottoAvailable(): boolean {
      return (!this.lotoTimeout && this.powerTimeout);
   }

   onlyPowerballAvailable(): boolean {
      return (this.lotoTimeout && !this.powerTimeout);
   }

   bothGamesNotAvailable(): boolean {
      const lotoTimeout = this.gameService.checkGameTimeOut(Constants.VariableValues.gameTypes.LOT.code);
      const powerTimeout = this.gameService.checkGameTimeOut(Constants.VariableValues.gameTypes.PWB.code);
      return (lotoTimeout && powerTimeout);
   }

   viewTimes() {
      this.visibleLottoTable = false;
      this.visiblePowerTable = false;
      this.visibleDetails = true;
      if (this.bothGamesNotAvailable()) {
         this.visibleLottoTable = true;
         this.visiblePowerTable = true;
         return;
      }
      if (this.onlyPowerballAvailable()) {
         this.visibleLottoTable = true;
         return;
      }
      this.visiblePowerTable = true;
      return;
   }

   setDomValues() {
      this.playGameCode = '';
      if (this.bothGamesNotAvailable()) {
         this.title = this.labels.gameTimeout.bothGameNotAvailable;
         this.viewTimes();
         return;
      }
      if (this.onlyLottoAvailable()) {
         this.title = this.labels.gameTimeout.powerballNotAvailable;
         this.playTitle = Constants.VariableValues.gameTypes.LOT.text;
         this.playGameCode = Constants.VariableValues.gameTypes.LOT.code;
         return;
      }
      this.title = this.labels.gameTimeout.lotoNotAvailable;
      this.playTitle = Constants.VariableValues.gameTypes.PWB.text;
      this.playGameCode = Constants.VariableValues.gameTypes.PWB.code;
      return;
   }

   buttonClick(code) {
      this.onButtonClick.emit(code);
   }
}
