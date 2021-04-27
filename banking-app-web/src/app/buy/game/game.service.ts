import { element } from 'protractor';
import { DatePipe } from '@angular/common';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import { Moment } from 'moment';

import { Api } from '../../core/services/api';
import { ApiService } from './../../core/services/api.service';
import { Constants } from './../../core/utils/constants';
import { SelectGameModel } from './select-game/select-game-model';
import { SelectGameForModel } from './select-game-for/select-game-for.model';
import { SelectNumbersModel } from './select-numbers/select-numbers-model';
import { SelectGameReviewModel } from './select-game-review/select-game-review.model';

import * as models from '../../core/services/models';
import { IWorkflowStepSummary } from '../../shared/components/work-flow/work-flow.models';
import { IWorkflowService, IWorkflowStep } from './../../shared/components/work-flow/work-flow.models';
import {
   IApiResponse, IAccountDetail, ILimitDetail, IGameMetadata,
   IJackpotInfo, IGameData, ILottoMetaData, IOutOfBandResponse, IOutOfBandRequest, IGameTicketData,
   IGameWinningNumbersData, ILottoHistoryData, ITermsAndConditions, IErrorEmitterResponse
} from './../../core/services/models';
import {
   IGameWorkflowSteps, GameSteps, ISelectGameVm, IGameDrawInfo,
   ISelectNumbersVm, IGameMetaData, IGameDrawDetails, ISelectGameForVm, GameDetail,
   SelectGameNotification,
   IGameDayTimeSheet,
   IGameTimeMetaData,
   IDrawResult
} from './models';
import { SystemErrorService } from '../../core/services/system-services.service';
import { Router } from '@angular/router';

@Injectable()
export class GameService implements IWorkflowService {

   gameWorkflowSteps: IGameWorkflowSteps;
   private gamesMetadata: IGameMetadata[];
   private gameDetails: IGameData;
   isPurchaseSucessful = false;
   accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   jackpotDataObserver = new BehaviorSubject<IJackpotInfo[]>(null);
   lottoLimitDataObserver = new BehaviorSubject<number>(null);
   gamesDayChartObserver = new BehaviorSubject<boolean>(null);
   lottoDayChart: IGameDayTimeSheet[];
   powerDayChart: IGameDayTimeSheet[];
   powerMeta: IGameTimeMetaData;
   lottoMeta: IGameTimeMetaData;
   nextClickEmitter = new EventEmitter<number>();
   selectGameNext = {
      text: Constants.labels.nextText
   };
   callbackFromSystemService: EventEmitter<IErrorEmitterResponse> = new EventEmitter<IErrorEmitterResponse>();
      execEngineRef: string;

   constructor(private apiService: ApiService, private datepipe: DatePipe,
      public router: Router, private systemErrorService: SystemErrorService) {
   }

   initializeGameWorkflow() {
      this.gameWorkflowSteps = {
         selectGame: {
            isNavigated: false,
            sequenceId: GameSteps.selectGame,
            model: new SelectGameModel(),
            isDirty: false
         },
         selectNumbers: {
            isNavigated: false,
            sequenceId: GameSteps.selectNumbers,
            model: new SelectNumbersModel(),
            isDirty: false
         },
         selectGameFor: {
            isNavigated: false,
            sequenceId: GameSteps.selectGameFor,
            model: new SelectGameForModel(),
            isDirty: false
         },
         selectGameReview: {
            isNavigated: false,
            sequenceId: GameSteps.selectGameReview,
            model: new SelectGameReviewModel(),
            isDirty: false
         }
      };

      this.getGameMetaData().subscribe((gamesMetadata) => {
         this.generateBothChart(gamesMetadata || []);
         if (!this.checkGameTimeOuts()) {
            Observable.forkJoin([
               this.apiService.GameAccounts.getAll(), // accounts
               this.apiService.LottoJackpot.getAll(), // lotto jackpot data
               this.apiService.GameLimits.getAll() // account limits
            ]).subscribe((responses: any[]) => {

               const accountResponse = responses[0];
               const accounts = accountResponse ? accountResponse.data : [];
               this.updateAccountData(accounts);

               const jackpots = responses[1];
               this.updateGameMetadata(jackpots ? jackpots.data : []);

               const limitResponse = responses[2];
               this.updateLottoLimit(limitResponse ? limitResponse.data : []);

            });
         } else {
            this.jackpotDataObserver.next([]);
            this.lottoLimitDataObserver.next(0);
            this.accountsDataObserver.next([]);
         }

      });

   }
   checkGameTimeOuts(): boolean {
      if (!this.lottoDayChart || !this.lottoDayChart.length ||
         !this.powerDayChart || !this.powerDayChart.length) {
         return;
      }
      const lotoTimeout = this.checkGameTimeOut(Constants.VariableValues.gameTypes.LOT.code);
      const powerTimeout = this.checkGameTimeOut(Constants.VariableValues.gameTypes.PWB.code);
      return (lotoTimeout && powerTimeout);
   }
   updateAccountData(accounts: IAccountDetail[]) {
      this.accountsDataObserver.next(accounts);
   }
   refreshAccountData() {
      this.accountsDataObserver = new BehaviorSubject<IAccountDetail[]>(null);
   }

   generateBothChart(gamesMetadata) {
      this.lottoDayChart = undefined;
      this.powerDayChart = undefined;
      const lottoMeta = gamesMetadata.filter(data => {
         return data.gameType === Constants.VariableValues.gameTypes.LOT.code;
      })[0];
      const powerMeta = gamesMetadata.filter(data => {
         return data.gameType === Constants.VariableValues.gameTypes.PWB.code;
      })[0];
      if (!lottoMeta || !powerMeta) {
         return;
      }
      this.powerMeta = powerMeta;
      this.lottoMeta = lottoMeta;
      this.lottoDayChart = this.prepareGamesDayChart(lottoMeta);
      this.powerDayChart = this.prepareGamesDayChart(powerMeta);
      this.gamesDayChartObserver.next(true);
   }

   getDrawdays(meta: IGameTimeMetaData) {
      const codes = Constants.VariableValues.gameDayCodes;
      const drawdays = [];
      meta.drawDays.map(day => {
         drawdays.push({ code: day.drawDayName, text: codes[day.drawDayName].text });
      });
      return drawdays;
   }

   getCutOffTiming(meta: IGameTimeMetaData) {
      const cutOffTimes = {};
      meta.cutOffTimes.map(day => {
         cutOffTimes[day.dayName] = day.time;
      });
      return cutOffTimes;
   }

   prepareGamesDayChart(meta): IGameDayTimeSheet[] {
      const codes = Constants.VariableValues.gameDayCodes;
      let index = 0;
      const temp = [];
      for (const key in codes) {
         if (index < 7) {
            temp.push({ code: codes[key].code, startTime: '', endTime: '', text: codes[key].text });
         }
         index++;
      }
      const startTime = meta.startTime;
      const drawdays = [];
      const cutOffTimes = {};
      meta.drawDays.map(day => {
         drawdays.push(day.drawDayName);
      });
      meta.cutOffTimes.map(day => {
         cutOffTimes[day.dayName] = day.time;
      });
      temp.map(val => {
         val.startTime = startTime;
         if (drawdays.indexOf(val.code) > -1) {
            val.endTime = cutOffTimes[codes.DRAW.code];
            return;
         }
         if (cutOffTimes[val.code]) {
            val.endTime = cutOffTimes[val.code];
            return;
         }
         val.endTime = cutOffTimes[codes.NORM.code];
      });
      return temp;
   }

   getTodayTimeSheet(chart: IGameDayTimeSheet[]): IGameDayTimeSheet {
      const now = moment();
      const todayDay = now.format('ddd').toUpperCase();
      const todayChart = chart.filter(day => {
         return day.code === todayDay;
      })[0];
      return todayChart;
   }

   todayGameTimeLeft(chart: IGameDayTimeSheet[]): number {
      const now = moment();
      const todayChart = this.getTodayTimeSheet(chart);
      const temp = todayChart.endTime.split(':');
      const endtime = moment();
      endtime.hour(parseInt(temp[0], 10));
      endtime.minutes(parseInt(temp[1], 10));
      const duration = moment.duration(now.diff(endtime));
      return duration.asMinutes();
   }

   todayGameTimeRemaining(chart: IGameDayTimeSheet[]): number {
      const now = moment();
      const todayChart = this.getTodayTimeSheet(chart);
      const temp = todayChart.startTime.split(':');
      const startTime = moment();
      startTime.hour(parseInt(temp[0], 10));
      startTime.minutes(parseInt(temp[1], 10));
      const duration = moment.duration(now.diff(startTime));
      return duration.asMinutes();
   }

   checkGameTimeOut(code: string): boolean {
      let gameDayChart;
      if (code === Constants.VariableValues.gameTypes.LOT.code) {
         gameDayChart = this.lottoDayChart;
      }
      if (code === Constants.VariableValues.gameTypes.PWB.code) {
         gameDayChart = this.powerDayChart;
      }
      const todayGameTimeLeft = this.todayGameTimeLeft(gameDayChart);
      const todayGameTimeRemaining = this.todayGameTimeRemaining(gameDayChart);
      return todayGameTimeLeft >= 0 || todayGameTimeRemaining <= 0;
   }
   updateLottoLimit(payLimits: ILimitDetail[]) {
      const paymentLimit = payLimits.find(limit => {
         return limit.limitType === Constants.VariableValues.settings.widgetTypes.payment;
      });

      const lottoLimit = payLimits.find(limit => {
         return limit.limitType === Constants.VariableValues.settings.widgetTypes.lotto;
      });

      this.lottoLimitDataObserver.next(Math.min(paymentLimit.userAvailableDailyLimit, lottoLimit.userAvailableDailyLimit));
   }

   updateGameMetadata(jackpots: IJackpotInfo[]) {
      this.jackpotDataObserver.next(jackpots);
   }

   getJackpotByGame(jackpots, gameType): IJackpotInfo {
      const jackpot = jackpots.find(game => {
         return game.game.toLowerCase() === gameType.toLowerCase();
      });

      return jackpot;
   }

   getJackpotsByGame(jackpots, gameType): IJackpotInfo[] {
      const filteredJackpots = jackpots.filter(game => {
         return game.game.toLowerCase().includes(gameType.toLowerCase());
      });

      return filteredJackpots;
   }

   getStepInfo(currentStep: IWorkflowStep): void {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, false);
   }

   getStepInitialInfo(currentStep: IWorkflowStep): void {
      currentStep.summary = this.getStepSummary(currentStep.summary.sequenceId, true);
   }

   checkDirtySteps() {
      return this.gameWorkflowSteps.selectGame.isDirty && !this.gameWorkflowSteps.selectGameReview.isDirty;
   }

   getStepSummary(stepId: number, isDefault: boolean): IWorkflowStepSummary {

      const stepSummary: IWorkflowStepSummary = {
         isNavigated: false,
         sequenceId: 0,
         title: null
      };
      let isNavigated = true;
      switch (stepId) {
         case GameSteps.selectGame:
            isNavigated = this.gameWorkflowSteps.selectGame.isNavigated;
            stepSummary.title = this.gameWorkflowSteps.selectGame.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.gameWorkflowSteps.selectGame.isNavigated;
            stepSummary.sequenceId = GameSteps.selectGame;
            break;
         case GameSteps.selectNumbers:
            isNavigated = this.gameWorkflowSteps.selectNumbers.isNavigated;
            stepSummary.title = this.gameWorkflowSteps.selectNumbers.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.gameWorkflowSteps.selectNumbers.isNavigated;
            stepSummary.sequenceId = GameSteps.selectNumbers;
            break;
         case GameSteps.selectGameFor:
            isNavigated = this.gameWorkflowSteps.selectGameFor.isNavigated;
            stepSummary.title = this.gameWorkflowSteps.selectGameFor.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.gameWorkflowSteps.selectGameFor.isNavigated;
            stepSummary.sequenceId = GameSteps.selectGameFor;
            break;
         case GameSteps.selectGameReview:
            isNavigated = this.gameWorkflowSteps.selectGameReview.isNavigated;
            stepSummary.title = this.gameWorkflowSteps.selectGameReview.model.getStepTitle(isNavigated, isDefault);
            stepSummary.isNavigated = this.gameWorkflowSteps.selectGameReview.isNavigated;
            stepSummary.sequenceId = GameSteps.selectGameReview;
            break;
         default:
            throw new Error('Invalid step id');
      }
      return stepSummary;
   }

   getSelectGameVm(): ISelectGameVm {
      return this.gameWorkflowSteps.selectGame.model.getViewModel();
   }

   saveSelectGameVm(vm: ISelectGameVm) {
      this.gameWorkflowSteps.selectGame.model.updateModel(vm);
      this.gameWorkflowSteps.selectGame.isNavigated = true;
      this.gameWorkflowSteps.selectNumbers.model.updateGameMethod(vm.method);
      this.gameWorkflowSteps.selectGame.isDirty = true;
   }
   getGameMetaData(): Observable<IGameTimeMetaData[]> {
      return this.apiService.GameMetaData.getAll().map(response => response ? response.data : []);
   }

   getGameDraws(): Observable<IGameDrawDetails[]> {
      return this.apiService.LottoJackpot.getAll().map(response => response ? response.data : []);
   }

   getSelectNumbersVm(): ISelectNumbersVm {
      return this.gameWorkflowSteps.selectNumbers.model.getViewModel();
   }

   resetSelectNumberVm(): ISelectNumbersVm {
      this.gameWorkflowSteps.selectNumbers.model = null;
      this.gameWorkflowSteps.selectNumbers.model = new SelectNumbersModel();
      return this.gameWorkflowSteps.selectNumbers.model.getViewModel();
   }
   resetAllVm() {
      this.gameWorkflowSteps.selectGame.model = new SelectGameModel();
      this.gameWorkflowSteps.selectNumbers.model = new SelectNumbersModel();
      this.gameWorkflowSteps.selectGameFor.model = new SelectGameForModel();
      this.gameWorkflowSteps.selectGameReview.model = new SelectGameReviewModel();
   }

   saveSelectNumbersVm(vm: ISelectNumbersVm) {
      this.gameWorkflowSteps.selectNumbers.model.updateModel(vm);
      this.gameWorkflowSteps.selectNumbers.isNavigated = true;
   }
   getSelectGameForVm(): ISelectGameForVm {
      return this.gameWorkflowSteps.selectGameFor.model.getViewModel();
   }

   saveSelectGameForInfo(vm: ISelectGameForVm) {
      this.gameWorkflowSteps.selectGameFor.model.updateModel(vm);
      this.gameWorkflowSteps.selectGameFor.isNavigated = true;
   }
   // allow navigation to status page only if user has attempted payment
   isPurchaseStatusNavigationAllowed(): boolean {
      return this.gameWorkflowSteps && this.gameWorkflowSteps.selectGameReview.isNavigated;
   }
   getGameDetails(): IGameData {
      const selectGameModel = this.gameWorkflowSteps.selectGame.model.getViewModel(),
         selectNumbersModel = this.gameWorkflowSteps.selectNumbers.model.getViewModel(),
         selectGameForModel = this.gameWorkflowSteps.selectGameFor.model.getViewModel();

      if (!this.gameDetails) {
         this.gameDetails = new GameDetail();
      }
      this.gameDetails.FromAccount = {
         AccountNumber: '',
         accountType: ''
      };
      this.gameDetails.ClientRequestedDate = this.datepipe.transform(new Date(), Constants.formats.apiDateFormat);
      this.gameDetails.FromAccount.AccountNumber = selectNumbersModel.FromAccount.accountNumber;
      this.gameDetails.FromAccount.accountType = selectNumbersModel.FromAccount.accountType;
      this.gameDetails.Game = Constants.VariableValues.gameTypes[selectGameModel.game].code;
      this.gameDetails.GameType = Constants.VariableValues.gameMethod[selectGameModel.method];
      this.gameDetails.DrawNumber = selectNumbersModel.DrawNumber.drawNumber;
      this.gameDetails.DrawDate = this.datepipe.transform(selectNumbersModel.DrawDate, Constants.formats.apiDateFormat);
      selectNumbersModel.BoardDetails.forEach(element => {
         delete element.isValid;
      });
      if (this.gameDetails.GameType === Constants.VariableValues.gameMethod.a) {
         this.gameDetails.BoardDetails = [];
      } else {
         this.gameDetails.BoardDetails = selectNumbersModel.BoardDetails;
      }
      this.gameDetails.DrawsPlayed = selectNumbersModel.DrawsPlayed;
      this.gameDetails.BoardsPlayed = selectNumbersModel.BoardsPlayed;
      this.gameDetails.IsLottoPlus = selectNumbersModel.IsLottoPlus;
      this.gameDetails.IsLottoPlusTwo = selectNumbersModel.IsLottoPlusTwo;
      this.gameDetails.MyDescription = selectGameForModel.yourReference;

      const selectGameNotification = new SelectGameNotification
         (selectGameForModel.notification, selectGameForModel.notificationInput);
      this.gameDetails.notificationDetails = [];
      this.gameDetails.notificationDetails[0] = selectGameNotification;
      return this.gameDetails;
   }
   isPurchaseStatusValid(metadata: ILottoMetaData): boolean {
      let isValid = false;

      // check for transaction success
      if (metadata && metadata.resultData && metadata.resultData.length) {
         for (let i = 0; i < metadata.resultData.length; i++) {
            const transactionDetails = metadata.resultData[i].resultDetail
               .find(x => x.operationReference === Constants.metadataKeys.transaction);
            if (transactionDetails.status !== Constants.metadataKeys.failure) {
               isValid = true;
               break;
            } else {
               this.gameDetails.failureReason = transactionDetails.reason;
            }
         }
      }
      return isValid;
   }
   updateTransactionID(transactionID: string) {
      if (transactionID) {
         this.gameDetails.transactionID = transactionID;
         this.isPurchaseSucessful = true;
      }
   }
   updateexecEngineRef(execEngineRef: string) {
      this.execEngineRef = execEngineRef;
   }

   makePurchase(validate = true): Observable<ILottoMetaData> {
      let lottoApi;

      const selectNumbersModel: ISelectNumbersVm = this.getSelectNumbersVm(),
         gameDetails: IGameData = this.getGameDetails();
      lottoApi = this.apiService.LottoList.create([gameDetails],
         { validate: validate }).map((response) => {
            return response.metadata;
         });

      return lottoApi;
   }
   getPurchaseStatus() {
      return this.isPurchaseSucessful;
   }
   clearGameDetails() {
      this.gameDetails = new GameDetail();
      this.isPurchaseSucessful = false;
   }
   getApproveItStatus(): Observable<IOutOfBandResponse> {

      this.gameWorkflowSteps.selectGame.isDirty = false;

      return this.apiService.GameStatus.create(
         null,
         null,
         { verificationId: this.gameDetails.transactionID });
   }

   getApproveItOtpStatus(tvsCode: string, referenceId: string): Observable<IOutOfBandResponse> {

      this.gameWorkflowSteps.selectGame.isDirty = false;

      const request: IOutOfBandRequest = {
         transactionVerificationCode: tvsCode,
         verificationReferenceId: referenceId
      };

      return this.apiService.OutOfBandOtpStatus.create(request);
   }

   setSecureTransactionVerification(verificationId) {
      if (!this.gameDetails.secureTransaction) {
         this.gameDetails.secureTransaction = { verificationReferenceId: '' };
      }
      this.gameDetails.secureTransaction.verificationReferenceId = verificationId;
   }
   refreshAccounts() {
      this.apiService.refreshAccounts.getAll().subscribe();
   }

   getLottoHistoryListData(): Observable<ILottoHistoryData> {
      return this.apiService.LottoHistoryList.getAll(
         { ticketstatus: 'Success', failedTransations: false, pageSize: 3 }
      ).map(response => response ? response.data : []);
   }

   getViewMoreLottoHistory(): Observable<ILottoHistoryData> {
      return this.apiService.LottoHistoryList.getAll(
         { page: 1, pageSize: 10, ticketstatus: 'Success', failedTransations: false }).map(response => response ? response.data : []);
   }

   getViewMoreClickLotto(loadPage: Number): Observable<ILottoHistoryData> {
      return this.apiService.LottoHistoryList.getAll(
         {
            page: loadPage, pageSize: 10, ticketstatus: 'Success',
            failedTransations: false
         }).map(response => response ? response.data : []);
   }

   getNextDrawDetails(): Observable<IGameDrawDetails> {
      return this.apiService.LottoNextDrawDetails.getAll().map(response => response ? response.data : []);
   }

   getLottoTicketData(batchID: number): Observable<IGameTicketData> {
      return this.apiService.LottoTicketDetails.get(batchID).map(response => response ? response.data : []);
   }

   getLottoTicketReplayData(batchID: number): Observable<ISelectNumbersVm> {
      return this.apiService.LottoTicketDetails.get(batchID).map(response => response ? response.data : []);
   }

   getWinningNumbers(): Observable<IGameWinningNumbersData[]> {
      return this.apiService.WinningNumbersList.getAll().map(response => response ? response.data : []);
   }

   getDrawDetails(): Observable<IDrawResult[]> {
      return this.apiService.LottoDrawDetails.getAll().map(response => {
         return response ? response.data : [];
      });
   }

   getTermsAndConditionsResult(): Observable<ITermsAndConditions[]> {
      return this.apiService.AcceptTermsAndConditionsResult.getAll().map(response => {
         return response ? response.data : [];
      });
   }
   // raise error to system message control
   raiseSystemError(isCallback: boolean = false) {
      if (isCallback) {
         const callback = this.callbackFromSystemService.subscribe((response: IErrorEmitterResponse) => {
            callback.unsubscribe();
            this.clearGameDetails();
            this.router.navigateByUrl(Constants.routeUrls.dashboard);
         });
      }
      this.systemErrorService.raiseError({
         error: Constants.VariableValues.sytemErrorMessages.transactionMessage,
         callbackEmitter: isCallback && this.callbackFromSystemService
      });
   }
}
