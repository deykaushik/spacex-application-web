import { TestBed, inject } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { Moment } from 'moment';

import { Constants } from '../../core/utils/constants';
import { CommonUtility } from './../../core/utils/common';
import { GameService } from './game.service';
import { ApiService } from '../../core/services/api.service';
import { SelectGameForModel } from './select-game-for/select-game-for.model';
import { SharedModule } from './../../shared/shared.module';
import { MobileNumberMaskPipe } from './../../shared/pipes/mobile-number-mask.pipe';

import { ILimitDetail, IJackpotInfo, IGamesMetadata, ILottoMetaData } from './../../core/services/models';
import { SelectNumbersModel } from './select-numbers/select-numbers-model';
import { GameSteps, GameTypes, IGameMetaData, IGameDrawDetails, IGameTimeMetaData, ILottoHistoryList, IDrawResult } from './models';
import { IAccountDetail, ITermsAndConditions, IGameTicketData, IGameWinningNumbersData } from './../../core/services/models';
import { IWorkflowStep } from '../../shared/components/work-flow/work-flow.models';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { SystemErrorService } from '../../core/services/system-services.service';

const amountTransform = new AmountTransformPipe();
let _getAll, mockActiveAccounts: IAccountDetail;
function purchase(): ILimitDetail[] {
   return [{
      limitType: 'payment',
      dailyLimit: 500,
      userAvailableDailyLimit: 80900,
      maxDailyLimit: 150000,
      isTempLimit: false
   }, {
      limitType: 'lotto',
      dailyLimit: 300,
      userAvailableDailyLimit: 80900,
      maxDailyLimit: 150000,
      isTempLimit: false
   }];
} function getMockSelectGame() {
   return {
      game: Constants.VariableValues.gameTypes.LOT.code,
      method: Constants.VariableValues.playMethods.pick.code
   };
}
function getMockSelectGame2() {
   return {
      game: Constants.VariableValues.gameTypes.LOT.code,
      method: Constants.VariableValues.playMethods.quickPick.code
   };
}
function getMockSelectNumbers() {
   return {
      BoardDetails: [
         {
            BoardNumber: 'A',
            NumbersPlayed: '47 33 49 7 5 17',
            isValid: true
         },
         {
            BoardNumber: 'B',
            NumbersPlayed: '30 11 40 14 5 15',
            isValid: true
         }],
      IsLottoPlus: true,
      IsLottoPlusTwo: true,
      BoardsPlayed: 2,
      DrawsPlayed: 1,
      DrawNumber: {
         drawDate: new Date(),
         drawName: 'Lotto',
         drawNumber: 1756,
         nextDrawDate: new Date()
      },
      DrawDate: new Date('2017-10-27T10:09:55.395Z'),
      TotalCost: 10,
      FromAccount: {
         itemAccountId: '1',
         accountNumber: '1970711442',
         productCode: '001',
         productDescription: 'CA',
         isPlastic: false,
         accountType: 'CA',
         nickname: 'CURRENT',
         sourceSystem: 'Profile System',
         currency: 'ZAR',
         availableBalance: 8136177.44,
         currentBalance: 8082177.44,
         profileAccountState: 'ACT',
         accountLevel: 'U0',
         viewAvailBal: true,
         viewStmnts: true,
         isRestricted: false,
         viewCurrBal: true,
         viewCredLim: true,
         viewMinAmtDue: true,
         isAlternateAccount: true,
         allowCredits: true,
         allowDebits: true,
         accountRules: {
            instantPayFrom: true,
            onceOffPayFrom: true,
            futureOnceOffPayFrom: true,
            recurringPayFrom: true,
            recurringBDFPayFrom: true,
            onceOffTransferFrom: true,
            onceOffTransferTo: true,
            futureTransferFrom: true,
            futureTransferTo: true,
            recurringTransferFrom: true,
            recurringTransferTo: true,
            onceOffPrepaidFrom: true,
            futurePrepaidFrom: true,
            recurringPrepaidFrom: true,
            onceOffElectricityFrom: true,
            onceOffLottoFrom: true,
            onceOffiMaliFrom: true
         }
      },
      isValid: true,
      game: Constants.VariableValues.gameTypes.LOT.code,
      method: Constants.VariableValues.playMethods.pick.code
   };
}
function getMockSelectGameForVm() {
   return {
      yourReference: 'Lotto Super',
      notificationInput: '929329392932',
      notification: 'SMS'
   };
}
const mockPurchaseData: ILottoMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'FV01',
               status: 'SUCCESS',
               reason: ''
            },
            {
               operationReference: 'ABC',
               result: 'FV01',
               status: 'ERROR',
               reason: ''
            }
         ]
      }
   ]
};
const _create = jasmine.createSpy('create').and.returnValue(Observable.of({ metadata: mockPurchaseData }));
_getAll = jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: [mockActiveAccounts] }));
const startTime = moment().add(-1, 'hours').format('HH:mm');
const endTimeLotto = moment().add(1, 'hours').format('HH:mm');
const endTimePWB = moment().add(1, 'hours').format('HH:mm');
const getGameMetaData = (): IGameTimeMetaData[] => {
   return [
      {
         'gameType': 'LOT',
         'gameTypeName': 'Lotto',
         'startTime': startTime,
         'cutOffTimes': [
            {
               'dayNumber': 3,
               'dayName': 'NORM',
               'time': endTimeLotto
            },
            {
               'dayNumber': 5,
               'dayName': 'SUN',
               'time': endTimeLotto
            },
            {
               'dayNumber': 0,
               'dayName': 'DRAW',
               'time': endTimeLotto
            }
         ],
         'drawDays': [
            {
               'drawDayNumber': 8,
               'drawDayName': 'WED'
            },
            {
               'drawDayNumber': 4,
               'drawDayName': 'SAT'
            }
         ],
         'postponed': false,
         'boardPrice': 5,
         'lottoPlusPrice': 2.5,
         'lottoPlusTwoPrice': 2.5,
         'maxNumberOfBoardsAllowed': 20,
         'maxNumberOfDrawsAllowed': 10,
         'minimumNumberOfBoardsAllowed': 2,
         'minimumNumberOfDrawsAllowed': 1,
         'lottoBallMatrixMin': 1,
         'lottoBallMatrixMax': 52
      },
      {
         'gameType': 'PWB',
         'gameTypeName': 'PowerBall',
         'startTime': startTime,
         'cutOffTimes': [
            {
               'dayNumber': 3,
               'dayName': 'NORM',
               'time': endTimePWB
            },
            {
               'dayNumber': 5,
               'dayName': 'SUN',
               'time': endTimePWB
            },
            {
               'dayNumber': 0,
               'dayName': 'DRAW',
               'time': endTimePWB
            }
         ],
         'drawDays': [
            {
               'drawDayNumber': 7,
               'drawDayName': 'TUE'
            },
            {
               'drawDayNumber': 1,
               'drawDayName': 'FRI'
            }
         ],
         'postponed': false,
         'boardPrice': 5,
         'lottoPlusPrice': 2.5,
         'lottoPlusTwoPrice': 2.5,
         'maxNumberOfBoardsAllowed': 20,
         'maxNumberOfDrawsAllowed': 10,
         'minimumNumberOfBoardsAllowed': 2,
         'minimumNumberOfDrawsAllowed': 1,
         'powerBallMatrixMin': 1,
         'powerBallMatrixMax': 45,
         'powerBallBonusBallMatrixMin': 1,
         'powerBallBonusBallMatrixMax': 20
      }
   ];
};
const apiServiceStub = {
   LottoJackpot: {
      getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(getJackpots()))
   },
   GameLimits: {
      getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of({ data: purchase() }))
   },
   GameAccounts: {
      getAll: jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of({
         data: getMockGameAccounts()
      }))
   },
   GameMetaData: {
      getAll: jasmine.createSpy('getGameMetaData').and.returnValue(Observable.of({
         data: getGameMetaData()
      }))
   },
   GameDraws: {
      getAll: jasmine.createSpy('getGameDraws').and.returnValue(Observable.of({
         data: getGameDraws()
      }))
   },
   LottoHistoryList: {
      getAll: jasmine.createSpy('getLottoHistoryListData').and.returnValue(Observable.of({
         data: getLottoHistoryListData()
      }))
   },
   LottoViewMoreHistory: {
      getAll: jasmine.createSpy('getViewMoreLottoHistory').and.returnValue(Observable.of({
         data: getViewMoreLottoHistory()
      }))
   },
   LottoViewMoreClick: {
      getAll: jasmine.createSpy('getViewMoreClickLotto').and.returnValue(Observable.of({
         data: getViewMoreClickLotto()
      }))
   },
   WinningNumbersList: {
      getAll: jasmine.createSpy('getWinningNumbers').and.returnValue(Observable.of({
         data: getWinningNumbers()
      }))
   },
   LottoTicketDetails: {
      get: jasmine.createSpy('getLottoTicketData').and.returnValue(Observable.of({
         data: getLottoTicketData()
      }))
   },
   LottoNextDrawDetails: {
      getAll: jasmine.createSpy('getNextDrawDetails').and.returnValue(Observable.of({
         data: getNextDrawDetails()
      }))
   },
   LottoDrawDetails: {
      getAll: jasmine.createSpy('getDrawDetails').and.returnValue(Observable.of({
         data: getDrawDetails()
      }))
   },
   AcceptTermsAndConditionsResult: {
      getAll: jasmine.createSpy('getTermsAndConditionsResult').and.returnValue(Observable.of({
         data: getTermsAndConditionsResult()
      }))
   },
   LottoList: {
      create: _create
   },
   refreshAccounts: {
      getAll: _getAll
   },
   GameStatus: {
      create: jasmine.createSpy('getStatus').and.returnValue(Observable.of(null))
   },
   OutOfBandOtpStatus: {
      create: jasmine.createSpy('outOfBandOtpStatus').and.returnValue(Observable.of(null))
   },
};

function getMockGameAccounts(): IAccountDetail[] {
   return [{
      itemAccountId: '1',
      accountNumber: '1001004345',
      productCode: '017',
      productDescription: 'TRANSACTOR',
      isPlastic: false,
      accountType: 'CA',
      nickname: 'TRANS 02',
      sourceSystem: 'Profile System',
      currency: 'ZAR',
      availableBalance: 42250354156.29,
      currentBalance: 42250482237.21,
      profileAccountState: 'ACT',
      accountLevel: 'U0',
      viewAvailBal: true,
      viewStmnts: true,
      isRestricted: false,
      viewCurrBal: true,
      viewCredLim: true,
      viewMinAmtDue: true,
      isAlternateAccount: true,
      allowCredits: true,
      allowDebits: true,
      accountRules: {
         instantPayFrom: true,
         onceOffPayFrom: true,
         futureOnceOffPayFrom: true,
         recurringPayFrom: true,
         recurringBDFPayFrom: true,
         onceOffTransferFrom: true,
         onceOffTransferTo: true,
         futureTransferFrom: true,
         futureTransferTo: true,
         recurringTransferFrom: true,
         recurringTransferTo: true,
         onceOffPrepaidFrom: true,
         futurePrepaidFrom: true,
         recurringPrepaidFrom: true,
         onceOffElectricityFrom: true,
         onceOffLottoFrom: true,
         onceOffiMaliFrom: true
      }
   }];
}




function getGameDraws(): IGameDrawDetails[] {
   return [{
      drawDate: new Date('2017-10-08T00:00:00.000Z'),
      drawName: 'Lotto',
      drawNumber: 1740,
      nextDrawDate: new Date('2017-10-08T00:00:00.000Z')
   }];
}

function getLottoHistoryListData(): ILottoHistoryList[] {
   return [{
      capturedDate: '2017-12-07T00:00:00',
      clientRequestedDate: '2017-12-07T00:00:00',
      purchaseDate: '2017-12-07T00:00:00',
      ticketRequestedTime: '08:01',
      myDescription: 'LOTTO (09-12-2017)',
      amount: -10,
      game: 'LOT',
      gameType: 'QPK',
      drawNumber: 0,
      drawDate: '0001-01-01T00:00:00',
      drawsPlayed: 1,
      boardsPlayed: 2,
      isLottoPlus: false,
      isLottoPlusTwo: false,
      ticketStatus: 'Success'
   }];
}

function getViewMoreLottoHistory(): ILottoHistoryList[] {
   return [{
      capturedDate: '2017-12-07T00:00:00',
      clientRequestedDate: '2017-12-07T00:00:00',
      purchaseDate: '2017-12-07T00:00:00',
      ticketRequestedTime: '08:01',
      myDescription: 'LOTTO (09-12-2017)',
      amount: -10,
      game: 'LOT',
      gameType: 'QPK',
      drawNumber: 0,
      drawDate: '0001-01-01T00:00:00',
      drawsPlayed: 1,
      boardsPlayed: 2,
      isLottoPlus: false,
      isLottoPlusTwo: false,
      ticketStatus: 'Success'
   }];
}

function getNextDrawDetails(): IGameDrawDetails[] {
   return [{
      drawDate: new Date('2017-10-08T00:00:00.000Z'),
      drawName: 'Lotto',
      drawNumber: 1740,
      nextDrawDate: new Date('2017-10-08T00:00:00.000Z')
   }];
}

function getTermsAndConditionsResult(): ITermsAndConditions[] {
   return [{
      noticeTitle: 'notice',
      noticeType: 'notice',
      versionNumber: 10,
      newVersionNumber: 10,
      acceptedDateTime: 'notice'
   }];
}

function getDrawDetails(): IDrawResult[] {
   return [{
      drawName: 'Lotto',
      drawDate: '2017-12-13T00:00:00+02:00',
      nextDrawDate: '2017-12-16T00:00:00+02:00',
      drawNumber: 1770,
      ballDetails: [],
      winnerDetails: [],
      rolloverAmount: 26530518.86,
      rolloverNumber: 9,
      totalPrizePoolAmount: 29996342.66,
      totalSalesAmount: 13940030,
      estimatedJackpotAmount: 30000000,
      guaranteedJackpotAmount: 0,
      drawMachineName: 'RNG2',
      ballSetNumber: 'RNG',
      provincialWinners: {
         wCWinners: 0,
         nCWinners: 0,
         eCWinners: 0,
         mPWinners: 0,
         lPWinners: 0,
         fSWinners: 0,
         kZNWinners: 0,
         nWWinners: 0
      }
   }];
}

function getViewMoreClickLotto(): ILottoHistoryList[] {
   return [{
      capturedDate: '2017-12-07T00:00:00',
      clientRequestedDate: '2017-12-07T00:00:00',
      purchaseDate: '2017-12-07T00:00:00',
      ticketRequestedTime: '08:01',
      myDescription: 'LOTTO (09-12-2017)',
      amount: -10,
      game: 'LOT',
      gameType: 'QPK',
      drawNumber: 0,
      drawDate: '0001-01-01T00:00:00',
      drawsPlayed: 1,
      boardsPlayed: 2,
      isLottoPlus: false,
      isLottoPlusTwo: false,
      ticketStatus: 'Success'
   }];
}

function getWinningNumbers(): IGameWinningNumbersData[] {
   return [{
      drawName: 'Lotto',
      drawDate: '2017-12-13T00:00:00+02:00',
      nextDrawDate: '2017-12-16T00:00:00+02:00',
      drawNumber: 1770,
      ballDetails: [],
      winnerDetails: [],
      rolloverAmount: 26530518.86,
      rolloverNumber: 9,
      totalPrizePoolAmount: 29996342.66,
      totalSalesAmount: 13940030,
      estimatedJackpotAmount: 30000000,
      guaranteedJackpotAmount: 0,
      drawMachineName: 'RNG2',
      ballSetNumber: 'RNG',
      provincialWinners: {
         wCWinners: 0,
         nCWinners: 0,
         eCWinners: 0,
         mPWinners: 0,
         lPWinners: 0,
         fSWinners: 0,
         kZNWinners: 0,
         nWWinners: 0
      }
   }];
}

function getLottoTicketData(): IGameTicketData[] {
   return [{
      batchID: 2192946,
      capturedDate: '2018-01-03T00:00:00',
      clientRequestedDate: '2018-01-03T00:00:00',
      purchaseDate: '2018-01-03T00:00:00',
      ticketRequestedTime: '19:00',
      myDescription: 'LOTTO PLUS 2 (03-01-2018)',
      fromAccount: {
         accountNumber: '1622013026',
         accountType: 'CA'
      },
      amount: 100.0,
      notificationDetails: [{
         'notificationId': 1,
         'notificationType': 'EMAIL'
      }],
      game: 'LOT',
      gameType: 'QPK',
      drawNumber: 1763,
      drawDate: '2017-11-18T00:00:00',
      drawsPlayed: 1,
      boardsPlayed: 10,
      isReplay: true,
      isViewMore: true,
      isLottoPlus: false,
      isLottoPlusTwo: true,
      boardDetails: [],
      ticketStatus: 'Success',
      purchaseReferenceNumber: '20180103/Nedbank/000000489057565638'
   }];
}

function getJackpots(): IGamesMetadata {
   return {
      data: [{
         game: 'Lotto',
         nextDrawDate: '2017-10-28T00:00:00+02:00',
         drawNumber: 1757,
         jackpotAmount: 41000000
      }, {
         game: 'LottoPlus',
         nextDrawDate: '2017-10-28T00:00:00+02:00',
         drawNumber: 1757,
         jackpotAmount: 1400000
      }, {
         game: 'LottoPlus2',
         nextDrawDate: '2017-10-28T00:00:00+02:00',
         drawNumber: 1757,
         jackpotAmount: 5100000
      }, {
         game: 'PowerBall',
         nextDrawDate: '2017-10-27T00:00:00+02:00',
         drawNumber: 828,
         jackpotAmount: 2500000
      }, {
         game: 'PowerBallPlus',
         nextDrawDate: '2017-10-27T00:00:00+02:00',
         drawNumber: 828,
         jackpotAmount: 2000000
      }]
   };
}
function getActiveAccountsData() {
   return {
      itemAccountId: '1',
      accountNumber: '1001004345',
      productCode: '017',
      productDescription: 'TRANSACTOR',
      isPlastic: false,
      accountType: 'CA',
      nickname: 'TRANS 02',
      sourceSystem: 'Profile System',
      currency: 'ZAR',
      availableBalance: 13168.2,
      currentBalance: 13217.2,
      profileAccountState: 'ACT',
      accountLevel: 'U0',
      viewAvailBal: true,
      viewStmnts: true,
      isRestricted: false,
      viewCurrBal: true,
      viewCredLim: true,
      viewMinAmtDue: true,
      isAlternateAccount: true,
      allowCredits: true,
      allowDebits: true,
      accountRules: {
         instantPayFrom: true,
         onceOffPayFrom: true,
         futureOnceOffPayFrom: true,
         recurringPayFrom: true,
         recurringBDFPayFrom: true,
         onceOffTransferFrom: true,
         onceOffTransferTo: true,
         futureTransferFrom: true,
         futureTransferTo: true,
         recurringTransferFrom: true,
         recurringTransferTo: true,
         onceOffPrepaidFrom: true,
         futurePrepaidFrom: true,
         recurringPrepaidFrom: true,
         onceOffElectricityFrom: true,
         onceOffLottoFrom: true,
         onceOffiMaliFrom: true
      }
   };
}
function isObservable(obs) {
   return obs && typeof obs.subscribe === 'function';
}
describe('GameService', () => {

   beforeEach(() => {
      mockActiveAccounts = getActiveAccountsData();
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [GameService, { provide: ApiService, useValue: apiServiceStub }, SystemErrorService, DatePipe]
      });
   });

   it('should be created', inject([GameService, DatePipe], (service: GameService) => {
      expect(service).toBeTruthy();
   }));

   it('should initialize the game workflow models when initializeGameWorkflow is called', inject([GameService, DatePipe],
      (service: GameService) => {
         service.initializeGameWorkflow();
         expect(service.gameWorkflowSteps).toBeDefined();
      }));

   it('should mark the SelectGame step navigated when SelectGameVm is saved', inject([GameService, DatePipe],
      (service: GameService) => {
         service.initializeGameWorkflow();
         service.saveSelectGameVm({
            game: null,
            method: null
         });
         expect(service.getStepSummary(GameSteps.selectGame, true).isNavigated).toBeTruthy();
      }));

   it('should return empty step when no matching step is found', inject([GameService, DatePipe],
      (service: GameService) => {
         service.initializeGameWorkflow();
         expect(service.getStepSummary).toThrowError('Invalid step id');
      }));

   it('should expect an error if wrong step number is passed to get step summary', inject([GameService],
      (service: GameService) => {
         service.initializeGameWorkflow();
         expect(function () {
            service.getStepSummary(-1, true);
         }).toThrow();
      }
   ));

   it(`should get be able to get default step info for
      select game step`, inject([GameService],
         (service: GameService) => {
            service.initializeGameWorkflow();
            const step: IWorkflowStep = {
               buttons: null,
               component: null,
               summary: {
                  sequenceId: GameSteps.selectGame,
                  isNavigated: false,
                  title: null
               }
            };
            service.getStepInfo(step);
            expect(step.summary.title).toBe(Constants.labels.lottoLabels.selectGameTitle);
         }
      ));

   it(`should get be able to get default step info for
      select game step after it was navigated`, inject([GameService],
         (service: GameService) => {
            service.initializeGameWorkflow();
            const step: IWorkflowStep = {
               buttons: null,
               component: null,
               summary: {
                  sequenceId: GameSteps.selectGame,
                  isNavigated: true,
                  title: null
               }
            };
            service.getStepInitialInfo(step);
            expect(step.summary.title).toBe(Constants.labels.lottoLabels.selectGameTitle);
         }
      ));

   it(`should check for dirty workflow`, inject([GameService],
      (service: GameService) => {
         service.initializeGameWorkflow();
         expect(service.checkDirtySteps()).toBe(false);

      }
   ));
   it(`should check for dirty workflow`, inject([GameService],
      (service: GameService) => {
         service.initializeGameWorkflow();
         service.gameWorkflowSteps.selectGameReview.isDirty = true;
         service.gameWorkflowSteps.selectGame.isDirty = true;
         expect(service.checkDirtySteps()).toBe(false);
      }
   ));

   it('should be able to getSelectGameVm', inject([GameService],
      (service: GameService) => {
         service.initializeGameWorkflow();
         expect(service.getSelectGameVm()).toBeDefined();
      }
   ));
   it('should mark the SelectNumbers step navigated when SelectNumbersVm is saved', inject([GameService, DatePipe],
      (service: GameService) => {
         service.initializeGameWorkflow();
         service.saveSelectNumbersVm({
            BoardDetails: [],
            IsLottoPlus: true,
            IsLottoPlusTwo: true,
            BoardsPlayed: 3,
            DrawsPlayed: 3,
            DrawNumber: {
               drawDate: new Date(),
               drawName: 'Lotto',
               drawNumber: 177,
               nextDrawDate: new Date()
            },
            DrawDate: new Date(),
            TotalCost: 45,
            FromAccount: getMockGameAccounts()[0],
            isValid: true,
            game: Constants.VariableValues.gameTypes.LOT.code,
            method: Constants.VariableValues.playMethods.pick.code
         });
         expect(service.getStepSummary(GameSteps.selectNumbers, true).isNavigated).toBeTruthy();
      }));

   it('should be able to getSelectNumbersVm', inject([GameService],
      (service: GameService) => {
         service.initializeGameWorkflow();
         expect(service.getSelectNumbersVm()).toBeDefined();
      }
   ));

   xit('should get getActiveAccounts details', inject([GameService, DatePipe], (service: GameService) => {
      service.accountsDataObserver.subscribe(response => {
         expect(getMockGameAccounts()[0].accountNumber).toEqual(response[0].accountNumber);
      });
   }));

   it('should get GameMetaData details', inject([GameService, DatePipe], (service: GameService) => {
      service.getGameMetaData().subscribe(response => {
         expect(getGameMetaData()[0]).toEqual(response[0]);
      });
   }));

   it('should find first jackpot by Game and return single jackpot', inject([GameService, DatePipe], (service: GameService) => {
      const jackpots: IJackpotInfo[] = getJackpots().data;
      const lottoJackpot = service.getJackpotByGame(jackpots, Constants.VariableValues.gameTypes.LOT.text);
      expect(lottoJackpot.drawNumber).toBe(jackpots[0].drawNumber);
      expect(lottoJackpot.jackpotAmount).toBe(jackpots[0].jackpotAmount);
      expect(lottoJackpot.nextDrawDate).toBe(jackpots[0].nextDrawDate);

      const powerballJackpot = service.getJackpotByGame(jackpots, Constants.VariableValues.gameTypes.PWB.text);
      expect(powerballJackpot.drawNumber).toBe(jackpots[3].drawNumber);
      expect(powerballJackpot.jackpotAmount).toBe(jackpots[3].jackpotAmount);
      expect(powerballJackpot.nextDrawDate).toBe(jackpots[3].nextDrawDate);
   }));

   it('should filter jackpots by Game and return array of jackpot', inject([GameService, DatePipe], (service: GameService) => {
      const jackpots: IJackpotInfo[] = getJackpots().data;
      const lottoJackpots = service.getJackpotsByGame(jackpots, Constants.VariableValues.gameTypes.LOT.text);
      expect(lottoJackpots.length).toBe(3);
      const powerballJackpots = service.getJackpotsByGame(jackpots, Constants.VariableValues.gameTypes.PWB.text);
      expect(powerballJackpots.length).toBe(2);
   }));

   it('should get GameDraws details', inject([GameService, DatePipe], (service: GameService) => {
      service.getGameDraws().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get lotto history details', inject([GameService], (service: GameService) => {
      service.getLottoHistoryListData().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get more lotto history details', inject([GameService], (service: GameService) => {
      service.getViewMoreLottoHistory().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get lotto history details on click', inject([GameService], (service: GameService) => {
      service.getViewMoreClickLotto(2).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get lotto history details on click', inject([GameService], (service: GameService) => {
      service.getWinningNumbers().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get lotto history details on click', inject([GameService], (service: GameService) => {
      service.getLottoTicketData(2).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get lotto history Replay details on click', inject([GameService], (service: GameService) => {
      service.getLottoTicketReplayData(2).subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get next draw details', inject([GameService], (service: GameService) => {
      service.getNextDrawDetails().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get next draw details', inject([GameService], (service: GameService) => {
      service.getDrawDetails().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get T&C details', inject([GameService], (service: GameService) => {
      service.getTermsAndConditionsResult().subscribe(response => {
         expect(response).toBeDefined();
      });
   }));

   it('should get step default title information for given step number for various scenarios',
      inject([GameService], (service: GameService) => {
         service.initializeGameWorkflow();
         let currentStep = service.getStepSummary(1, true);
         service.saveSelectGameVm({
            game: Constants.VariableValues.gameTypes.LOT.code,
            method: Constants.VariableValues.playMethods.pick.code
         });
         expect(currentStep.title).toBe(Constants.labels.lottoLabels.selectGameTitle);

         service.saveSelectGameVm({
            game: Constants.VariableValues.gameTypes.PWB.code,
            method: Constants.VariableValues.playMethods.pick.code
         });
         currentStep = service.getStepSummary(1, false);
         expect(currentStep.title).toBe('You\'re playing PowerBall');

         service.saveSelectGameVm({
            game: Constants.VariableValues.gameTypes.LOT.code,
            method: Constants.VariableValues.playMethods.pick.code
         });
         currentStep = service.getStepSummary(1, false);
         expect(currentStep.title).toBe('You\'re playing LOTTO');
      }));

   it('should be able to getSelectGameForVm', inject([GameService],
      (service: GameService) => {
         service.initializeGameWorkflow();
         expect(service.getSelectGameForVm()).toBeDefined();
      }
   ));

   it('should get step default title information for get purchase for  step', inject([GameService], (service: GameService) => {
      service.initializeGameWorkflow();
      const currentStep = service.getStepSummary(3, true);
      service.gameWorkflowSteps.selectGameFor.isNavigated = false;
      expect(service.getStepSummary(GameSteps.selectNumbers, true).isNavigated).toBeFalsy();
      expect(currentStep.title).toBeDefined();
      service.gameWorkflowSteps.selectNumbers.model.method = Constants.VariableValues.playMethods.quickPick.code;
      expect(service.getStepSummary(GameSteps.selectNumbers, true).isNavigated).toBeFalsy();
      expect(currentStep.title).toBeDefined();
   }));

   xit('should get step new title information for transfer amount step', inject([GameService], (service: GameService) => {
      service.initializeGameWorkflow();
      const selectNumbersModel = new SelectNumbersModel();
      selectNumbersModel.BoardDetails = [{
         BoardNumber: 'A',
         NumbersPlayed: '2 3 4 5 6 7',
         isValid: true
      },
      {
         BoardNumber: 'B',
         NumbersPlayed: '2 3 4 5 6 7',
         isValid: true
      }];

      service.gameWorkflowSteps.selectNumbers.model = selectNumbersModel;
      service.gameWorkflowSteps.selectNumbers.isNavigated = true;
      service.accountsDataObserver.subscribe(accounts => {
         selectNumbersModel.FromAccount = accounts[0];
      });
      selectNumbersModel.BoardsPlayed = 2;
      selectNumbersModel.IsLottoPlus = false;
      selectNumbersModel.IsLottoPlusTwo = false;
      selectNumbersModel.DrawsPlayed = 2;
      selectNumbersModel.TotalCost = 20.33;
      const total = amountTransform.transform((selectNumbersModel.TotalCost).toFixed(2) + '');
      const currentSummary = service.getStepSummary(2, false);
      const expectedTitle = `You're playing ${CommonUtility.convertNumbertoWords(selectNumbersModel.BoardsPlayed)} `
         + `board${selectNumbersModel.BoardsPlayed > 1 ? 's' : ''} for `
         + `${CommonUtility.convertNumbertoWords(selectNumbersModel.DrawsPlayed)} `
         + `draw${selectNumbersModel.DrawsPlayed > 1 ? 's' : ''
         }` + `. ${total} will be paid from your account-` + `${selectNumbersModel.FromAccount.nickname}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   xit('should get step new title information for transfer amount step', inject([GameService], (service: GameService) => {
      service.initializeGameWorkflow();
      const selectNumbersModel = new SelectNumbersModel();
      selectNumbersModel.BoardDetails = [{
         BoardNumber: 'A',
         NumbersPlayed: '2 3 4 5 6 7',
         isValid: true
      },
      {
         BoardNumber: 'B',
         NumbersPlayed: '2 3 4 5 6 7',
         isValid: true
      }];

      service.gameWorkflowSteps.selectNumbers.model = selectNumbersModel;
      service.gameWorkflowSteps.selectNumbers.isNavigated = true;
      service.accountsDataObserver.subscribe(accounts => {
         selectNumbersModel.FromAccount = accounts[0];
      });
      selectNumbersModel.BoardsPlayed = 2;
      selectNumbersModel.IsLottoPlus = true;
      selectNumbersModel.IsLottoPlusTwo = true;
      selectNumbersModel.DrawsPlayed = 2;
      selectNumbersModel.TotalCost = 20.11;
      selectNumbersModel.game = Constants.VariableValues.gameTypes.LOT.code;
      const currentSummary = service.getStepSummary(2, false);
      const total = amountTransform.transform((selectNumbersModel.TotalCost).toFixed(2) + '');
      const expectedTitle = `You're playing ${selectNumbersModel.BoardsPlayed} boards` +
         ` with LOTTO Plus 1 and LOTTO Plus 2` +
         ` for ${selectNumbersModel.DrawsPlayed} ${selectNumbersModel.DrawsPlayed > 1 ? 'draws' : 'draw'
         }` +
         ` ${total} from your account-` +
         `${selectNumbersModel.FromAccount.nickname}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should get step default title information for select game for step', inject([GameService], (service: GameService) => {
      service.initializeGameWorkflow();
      const currentStep = service.getStepSummary(GameSteps.selectGameFor, true);
      service.gameWorkflowSteps.selectGameFor.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));
   it('should get step new title information for select game for step', inject([GameService], (service: GameService) => {
      service.initializeGameWorkflow();
      const selectGameForModel = new SelectGameForModel();
      selectGameForModel.yourReference = 'aaaaa';
      selectGameForModel.notification = {};
      selectGameForModel.notification.name = 'SMS';
      selectGameForModel.notificationInput = '98127394121';
      service.gameWorkflowSteps.selectGameFor.model = selectGameForModel;
      service.gameWorkflowSteps.selectGameFor.isNavigated = true;
      let currentSummary = service.getStepSummary(GameSteps.selectGameFor, false);
      currentSummary = service.getStepSummary(GameSteps.selectGameFor, false);
      let expectedTitle = `Send an ${selectGameForModel.notification.name} notification to ` +
         `${new MobileNumberMaskPipe().transform(selectGameForModel.notificationInput, 4)}. `;
      expectedTitle += `Your reference: ${selectGameForModel.yourReference}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should mark the SelectGameFor step navigated when select game for info is Saved', inject([GameService, DatePipe],
      (service: GameService) => {
         service.initializeGameWorkflow();
         service.saveSelectGameForInfo({
            notificationInput: null,
            yourReference: null,
            notification: null
         });
         expect(service.getStepSummary(GameSteps.selectGameFor, false).isNavigated).toBeTruthy();
      }));
   it('should get step default title information for select game review step', inject([GameService], (service: GameService) => {
      service.initializeGameWorkflow();
      const currentStep = service.getStepSummary(GameSteps.selectGameReview, true);
      service.gameWorkflowSteps.selectGameReview.isNavigated = false;
      expect(currentStep.title).toBeDefined();
   }));
   it('should get game details', inject([GameService], (service: GameService) => {
      service.initializeGameWorkflow();
      service.saveSelectGameVm(getMockSelectGame());
      service.saveSelectNumbersVm(getMockSelectNumbers());
      service.saveSelectGameForInfo(getMockSelectGameForVm());
      const gameDetails = service.getGameDetails();
      expect(gameDetails.FromAccount.AccountNumber).toBe(service.gameWorkflowSteps.selectNumbers.model.FromAccount.accountNumber);
      expect(gameDetails.notificationDetails[0].notificationAddress)
         .toBe(service.gameWorkflowSteps.selectGameFor.model.notificationInput);
      service.saveSelectGameVm(getMockSelectGame2());
      const gameDetail2 = service.getGameDetails();
      expect(gameDetail2.BoardDetails.length).toBe(0);
      expect(gameDetail2.GameType).toBe(Constants.VariableValues.gameMethod[service.gameWorkflowSteps.selectGame.model.method]);
   }));
   it('should make payment with validate true', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      service.saveSelectGameVm(getMockSelectGame());
      service.saveSelectNumbersVm(getMockSelectNumbers());
      service.saveSelectGameForInfo(getMockSelectGameForVm());
      service.makePurchase().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPurchaseData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
      service.makePurchase(false).subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPurchaseData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
   }));
   it('should check purchase status is valid or not', inject([GameService], (service: GameService) => {
      const gameMetaData: ILottoMetaData = {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'FV01',
                     status: 'SUCCESS',
                     reason: ''
                  },
                  {
                     operationReference: 'ABC',
                     result: 'FV01',
                     status: 'ERROR',
                     reason: ''
                  }
               ]
            }
         ]
      };
      const isPurchaseStatusValid = service.isPurchaseStatusValid(gameMetaData);
      expect(isPurchaseStatusValid).toBe(true);
   }));
   it('should check purchase status is valid or not', inject([GameService], (service: GameService) => {
      const gameMetaData: ILottoMetaData = {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'FV01',
                     status: 'FAILURE',
                     reason: ''
                  }
               ]
            }
         ]
      };
      service.clearGameDetails();
      let isPurchaseStatusValid = service.isPurchaseStatusValid(gameMetaData);
      expect(isPurchaseStatusValid).toBe(false);
      isPurchaseStatusValid = service.isPurchaseStatusValid(undefined);
      expect(isPurchaseStatusValid).toBe(false);
   }));
   it('should update transaction ID and exec engine ref', inject([GameService, DatePipe],
      (service: GameService) => {
         service.initializeGameWorkflow();
         service.saveSelectGameVm(getMockSelectGame());
         service.saveSelectNumbersVm(getMockSelectNumbers());
         service.saveSelectGameForInfo(getMockSelectGameForVm());
         service.getGameDetails();
         service.updateTransactionID('1234');
         service.updateexecEngineRef('12345');
         expect(service.getGameDetails().transactionID).toEqual('1234');
         expect(service.execEngineRef).toEqual('12345');
      }));
   it('should be able to reset getSelectNumbersVm', inject([GameService],
      (service: GameService) => {
         service.initializeGameWorkflow();
         const selectNumbersVm = service.getSelectNumbersVm();
         selectNumbersVm.IsLottoPlus = true;
         service.saveSelectNumbersVm(selectNumbersVm);
         const resetSelectNumbersVm = service.resetSelectNumberVm();
         expect(resetSelectNumbersVm.IsLottoPlus).toBe(undefined);
      }
   ));
   xit('should get step new title information for transfer amount step for powerball', inject([GameService], (service: GameService) => {
      service.initializeGameWorkflow();
      const selectNumbersModel = new SelectNumbersModel();
      selectNumbersModel.BoardDetails = [{
         BoardNumber: 'A',
         NumbersPlayed: '2 3 4 5 6 7',
         isValid: true
      },
      {
         BoardNumber: 'B',
         NumbersPlayed: '2 3 4 5 6 7',
         isValid: true
      }];

      service.gameWorkflowSteps.selectNumbers.model = selectNumbersModel;
      service.gameWorkflowSteps.selectNumbers.isNavigated = true;
      service.accountsDataObserver.subscribe(accounts => {
         selectNumbersModel.FromAccount = accounts[0];
      });
      selectNumbersModel.BoardsPlayed = 2;
      selectNumbersModel.IsLottoPlus = true;
      selectNumbersModel.game = Constants.VariableValues.gameTypes.PWB.code;
      selectNumbersModel.DrawsPlayed = 2;
      selectNumbersModel.TotalCost = 20.33;
      const currentSummary = service.getStepSummary(2, false);
      const total = amountTransform.transform((selectNumbersModel.TotalCost).toFixed(2) + '');
      const expectedTitle = `You're playing ${selectNumbersModel.BoardsPlayed} boards` +
         ` with PowerBall Plus` +
         ` for ${selectNumbersModel.DrawsPlayed} ${selectNumbersModel.DrawsPlayed > 1 ? 'draws' : 'draw'
         }` +
         ` ${total} from your account-` +
         `${selectNumbersModel.FromAccount.nickname}`;
      expect(currentSummary.title).toEqual(expectedTitle);
   }));
   it('should return purchase status', inject([GameService], (service: GameService) => {
      expect(service.getPurchaseStatus()).toEqual(false);
   }));
   it('should clear purchase details', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      service.saveSelectGameVm(getMockSelectGame());
      service.saveSelectNumbersVm(getMockSelectNumbers());
      service.saveSelectGameForInfo(getMockSelectGameForVm());
      service.getGameDetails();
      service.clearGameDetails();
      const gameMetaData: ILottoMetaData = {
         resultData: [
            {
               resultDetail: [
                  {
                     operationReference: 'TRANSACTION',
                     result: 'FV01',
                     status: 'SUCCESS',
                     reason: ''
                  },
                  {
                     operationReference: 'ABC',
                     result: 'FV01',
                     status: 'ERROR',
                     reason: ''
                  }
               ]
            }
         ]
      };
      expect(service.isPurchaseStatusValid(gameMetaData)).toBe(true);
   }));

   it('should make payment for weekly recurrence', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      service.saveSelectGameVm(getMockSelectGame());
      service.saveSelectNumbersVm(getMockSelectNumbers());
      service.saveSelectGameForInfo(getMockSelectGameForVm());
      service.makePurchase(false);
      service.makePurchase().subscribe((data) => {
         expect(data.resultData[0].resultDetail).toEqual(mockPurchaseData.resultData[0].resultDetail);
      });
      expect(_create).toHaveBeenCalled();
   }));

   it('should check if review is navigated', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      const checkNavigation = service.isPurchaseStatusNavigationAllowed();
      expect(checkNavigation).toBe(false);
   }));

   it('should handel generateBothChart  when data is null ', inject([GameService, DatePipe], (service: GameService) => {
      service.generateBothChart([]);
      expect(service.lottoDayChart).toBeUndefined();
   }));

   it('should get today time sheet', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      const now = moment();
      const todayDay = now.format('ddd').toUpperCase();
      const todaySheet = service.getTodayTimeSheet(service.lottoDayChart);
      expect(todaySheet.code).toBe(todayDay);
   }));

   it('should handel generateBothChart  when data is null ', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      const now = moment();
      const todayDay = now.format('ddd').toUpperCase();
      const timeLeft = service.todayGameTimeLeft(service.lottoDayChart);
      expect(service.todayGameTimeLeft(service.lottoDayChart)).toBeDefined();
   }));

   it('should get draw days ', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      const days = service.getDrawdays(service.lottoMeta);
      expect(days[0].code).toBe('WED');
   }));

   it('should get CutOffTiming ', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      const timings = service.getCutOffTiming(service.lottoMeta);
      expect(timings['NORM']).toBe(endTimeLotto);
   }));

   it('should check GameTimeOut', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      expect(service.checkGameTimeOut(Constants.VariableValues.gameTypes.LOT.code))
         .toBe(service.todayGameTimeLeft(service.lottoDayChart) >= 0);
      expect(service.checkGameTimeOut(Constants.VariableValues.gameTypes.PWB.code))
         .toBe(service.todayGameTimeLeft(service.powerDayChart) >= 0);
   }));
   it('should be able to reset all Vm', inject([GameService],
      (service: GameService) => {
         service.initializeGameWorkflow();
         const SelectGameVm = service.getSelectGameVm();
         const selectNumbersVm = service.getSelectNumbersVm();
         const SelectGameForVm = service.getSelectGameForVm();
         SelectGameVm.game = Constants.VariableValues.gameTypes.PWB.code;
         selectNumbersVm.IsLottoPlus = true;
         SelectGameForVm.yourReference = 'a';
         service.saveSelectGameVm(SelectGameVm);
         service.saveSelectNumbersVm(selectNumbersVm);
         service.saveSelectGameForInfo(SelectGameForVm);
         service.resetAllVm();
         const SelectGameVm2 = service.getSelectGameVm();
         const selectNumbersVm2 = service.getSelectNumbersVm();
         const SelectGameForVm2 = service.getSelectGameForVm();
         expect(SelectGameVm2.game).toBe(Constants.VariableValues.gameTypes.LOT.code);
         expect(selectNumbersVm2.IsLottoPlus).toBe(undefined);
         expect(SelectGameForVm2.yourReference).toBe(undefined);
      }
   ));
   it('should call refresh Accounts',
      inject([GameService], (service: GameService) => {
         service.refreshAccounts();
      }));
});

describe('GameService - Error handling scenarios', () => {

   beforeEach(() => {
      apiServiceStub.GameAccounts.getAll = jasmine.createSpy('getActiveAccounts')
         .and.returnValue(Observable.of(null));
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [GameService, { provide: ApiService, useValue: apiServiceStub }, SystemErrorService, DatePipe]
      });
   });

   xit('should handle no content for active accounts', inject([GameService, DatePipe], (service: GameService) => {
      service.accountsDataObserver.subscribe(response => {
         expect(response.length).toBe(0);
      });
   }));
   it('should return observable on getApproveItStatus', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      service.saveSelectGameVm(getMockSelectGame());
      service.saveSelectNumbersVm(getMockSelectNumbers());
      service.saveSelectGameForInfo(getMockSelectGameForVm());
      service.makePurchase(false);
      service.gameWorkflowSteps.selectGame.isDirty = true;
      const returnValue = service.getApproveItStatus();
      expect(isObservable(returnValue)).toBe(true);
      expect(service.gameWorkflowSteps.selectGame.isDirty).toBeFalsy();
   }));
   it('should return observable on getApproveItOtpStatus', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      service.saveSelectGameVm(getMockSelectGame());
      service.saveSelectNumbersVm(getMockSelectNumbers());
      service.saveSelectGameForInfo(getMockSelectGameForVm());
      service.makePurchase(false);
      const returnValue = service.getApproveItOtpStatus('', '');
      expect(isObservable(returnValue)).toBe(true);
      expect(service.gameWorkflowSteps.selectGame.isDirty).toBeFalsy();
   }));
   it('should set secureTransaction on setSecureTransactionVerification', inject([GameService, DatePipe], (service: GameService) => {
      service.initializeGameWorkflow();
      service.saveSelectGameVm(getMockSelectGame());
      service.saveSelectNumbersVm(getMockSelectNumbers());
      service.saveSelectGameForInfo(getMockSelectGameForVm());
      service.makePurchase(false);
      service.setSecureTransactionVerification('1');
      const gameDetails = service.getGameDetails();
      expect(gameDetails.secureTransaction.verificationReferenceId).toBe('1');
   }));
});

describe('GameService', () => {
   const APIstub = {
      GameLimits: {
         getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(null))
      },
      LottoJackpot: {
         getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(null))
      },
      GameAccounts: {
         getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(null))
      },
      GameMetaData: {
         getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(null))
      },
      GameDraws: {
         getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(null))
      },
      LottoHistoryList: {
         getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of(null))
      }
   };
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         providers: [GameService, SystemErrorService, { provide: ApiService, useValue: APIstub }, DatePipe]
      });
   });

   it('should be created', inject([GameService, DatePipe], (service: GameService) => {
      expect(service).toBeTruthy();
   }));
   xit('should have empty accounts', inject([GameService, DatePipe], (service: GameService) => {
      service.accountsDataObserver.subscribe(res => {
         expect(res.length).toBe(0);
      });
   }));
   it('should have empty account', inject([GameService, DatePipe], (service: GameService) => {
      service.getGameMetaData().subscribe(res => {
         expect(res.length).toBe(0);
      });
   }));
   it('should have empty account', inject([GameService, DatePipe], (service: GameService) => {
      service.getGameDraws().subscribe(res => {
         expect(res.length).toBe(0);
      });
   }));
});
