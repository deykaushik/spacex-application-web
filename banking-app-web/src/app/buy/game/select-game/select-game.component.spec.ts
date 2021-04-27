import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../test-util';
import { IJackpotInfo } from './../../../core/services/models';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { GameService } from '../game.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { SelectGameComponent } from './select-game.component';
import { GameTimeoutComponent } from '../game-timeout/game-timeout.component';
import { Constants } from '../../../core/utils/constants';
import { ISelectGameVm, IGameDrawInfo } from '../models';
import { IGameMetadata } from '../../../core/services/models';
import { SharedModule } from '../../../shared/shared.module';

let hasBoardDetails = true;

const mockJackpotData: IJackpotInfo[] = [{
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
}];
const meta = {
   'gameType': 'LOT',
   'gameTypeName': 'Lotto',
   'startTime': '06:00',
   'cutOffTimes': [
      {
         'dayNumber': 3,
         'dayName': 'NORM',
         'time': '22:30'
      },
      {
         'dayNumber': 5,
         'dayName': 'SUN',
         'time': '17:30'
      },
      {
         'dayNumber': 0,
         'dayName': 'DRAW',
         'time': '20:25'
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
};
const chart = [
   { 'code': 'MON', 'startTime': '06:00', 'endTime': '22:30', 'text': 'monday' },
   { 'code': 'TUE', 'startTime': '06:00', 'endTime': '20:25', 'text': 'tuesday' },
   { 'code': 'WED', 'startTime': '06:00', 'endTime': '22:30', 'text': 'wednesday' },
   { 'code': 'THU', 'startTime': '06:00', 'endTime': '22:30', 'text': 'thursday' },
   { 'code': 'FRI', 'startTime': '06:00', 'endTime': '20:25', 'text': 'friday' },
   { 'code': 'SAT', 'startTime': '06:00', 'endTime': '22:30', 'text': 'saturday' },
   { 'code': 'SUN', 'startTime': '06:00', 'endTime': '17:30', 'text': 'sunday' }];
const cutOffTiming = {
   'NORM': '22:30',
   'DRAW': '20:25',
   'SUN': '17:30'
};
const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   getSelectGameForVm: jasmine.createSpy('getSelectGameForVm').and.returnValue({}),
   saveSelectGameForInfo: jasmine.createSpy('saveSelectGameForInfo'),
   saveSelectGameVm: jasmine.createSpy('saveSelectGameVm'),
   getDrawdays: jasmine.createSpy('getDrawdays'),
   getCutOffTiming: jasmine.createSpy('todayGameTimeLeft').and.returnValue(cutOffTiming),
   getSelectGameVm: jasmine.createSpy('getSelectGameVm').and.returnValue(<ISelectGameVm>{
      game: Constants.VariableValues.gameTypes.LOT.code,
      method: Constants.VariableValues.playMethods.pick.code
   }),
   getSelectNumbersVm: jasmine.createSpy('getSelectNumbersVm').and.callFake(function () {
      if (hasBoardDetails) {
         hasBoardDetails = false;
         return { BoardDetails: ['detail1', 'detail2'] };
      } else {
         hasBoardDetails = true;
         return {};
      }
   }),
   jackpotDataObserver: new BehaviorSubject<IJackpotInfo[]>(null),
   lottoLimitDataObserver: new BehaviorSubject<number>(null),
   gamesDayChartObserver: new BehaviorSubject(null),
   getJackpotByGame: jasmine.createSpy('getJackpotByGame').and.returnValue(mockJackpotData[0]),
   getJackpotsByGame: jasmine.createSpy('getJackpotsByGame').and.returnValue(mockJackpotData.slice(0, 3)),
   selectGameNext: {
      text: Constants.labels.nextText
   },
   nextClickEmitter: new EventEmitter<number>(),
   lottoDayChart: chart,
   powerDayChart: chart,
   lottoMeta: meta,
   powerMeta: meta,
   getTodayTimeSheet: jasmine.createSpy('getTodayTimeSheet').and.returnValue(chart[0]),
   todayGameTimeLeft: jasmine.createSpy('todaysGameTimeLeft').and.returnValue(0),
   checkGameTimeOut: jasmine.createSpy('checkGameTimeOut').and.returnValue(false),
   gameWorkflowSteps: {
      selectGame: {
         isDirty: false
      }
   }
};

const activatedRouteStub = {
   queryParams: new EventEmitter()
};

const routerTestingParam = [
   { path: 'dashboard', component: SelectGameComponent }
];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('SelectGameComponent', () => {
   let component: SelectGameComponent;
   let fixture: ComponentFixture<SelectGameComponent>;
   let router: Router;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [SelectGameComponent, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: GameService, useValue: gameServiceStub }, SystemErrorService,
         { provide: ActivatedRoute, useValue: activatedRouteStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      router = TestBed.get(Router);
      fixture = TestBed.createComponent(SelectGameComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should initialize the component with service input', () => {
      component.ngOnInit();
      expect(component.selectedGameType.code).toBe(Constants.VariableValues.gameTypes.LOT.code);

      gameServiceStub.lottoLimitDataObserver.next(10);
      component.ngOnInit();
      expect(component.lottoPayLimit).toBe(10);

   });

   it('should save vm on next click', () => {
      component.gameTimeLeft = -10;
      component.selectedGameType.code = Constants.VariableValues.gameTypes.LOT.code;
      component.selectedGameType.text = Constants.VariableValues.gameTypes.LOT.text;
      component.selectedPlayMethod = Constants.VariableValues.playMethods.pick;
      component.nextClick(null);

      expect(component.vm.game).toBe(Constants.VariableValues.gameTypes.LOT.code);
   });

   it('should check step click', () => {
      expect(component.stepClick(null)).toBeUndefined();
   });

   it('should check to populate various play methods', () => {
      component.populatePlayMethod(Constants.VariableValues.playMethods.pick.code);
      expect(component.selectedPlayMethod).toBe(Constants.VariableValues.playMethods.pick);

      component.populatePlayMethod(Constants.VariableValues.playMethods.quickPick.code);
      expect(component.selectedPlayMethod).toBe(Constants.VariableValues.playMethods.quickPick);

      expect(function () {
         component.populatePlayMethod(null);
      }).toThrowError();
   });

   it('should check for populating various game types', () => {
      component.populateGameType(Constants.VariableValues.gameTypes.LOT.code);
      expect(component.selectedGameType.code).toBe(Constants.VariableValues.gameTypes.LOT.code);

      component.populateGameType(Constants.VariableValues.gameTypes.PWB.code);
      expect(component.selectedGameType.code).toBe(Constants.VariableValues.gameTypes.PWB.code);
   });

   it('should check for populating selected game returned from service', () => {
      component.ngOnInit();
      component.populateSelectedGame();
      expect(component.selectedGameType.code).toBe(Constants.VariableValues.gameTypes.LOT.code);
   });

   it('should check for changing payment method and empty the board details', () => {
      component.onPlayMethodChanged(Constants.VariableValues.playMethods.quickPick);
      expect(component.selectedPlayMethod).toBe(Constants.VariableValues.playMethods.quickPick);
   });

   it('should check for changing payment method and not empty the board details', () => {
      component.onPlayMethodChanged(Constants.VariableValues.playMethods.pick);
      expect(component.selectedPlayMethod).toBe(Constants.VariableValues.playMethods.pick);
   });

   it('should check for updating draw date at intialization', () => {
      const date = new Date();
      gameServiceStub.jackpotDataObserver.next(mockJackpotData);
      expect(component.drawDate.toDateString()).toBe((new Date(mockJackpotData[0].nextDrawDate)).toDateString());
   });

   it('should show jackpots', () => {
      component.showJackpots();
      fixture.detectChanges();
      expect(component.isVisible).toBe(true);
   });

   it('should hide jackpots', () => {
      component.hideJackpots();
      fixture.detectChanges();
      expect(component.isVisible).toBe(false);
   });

   it('should update next draw date', () => {
      component.updateNextDrawDate(mockJackpotData[3]);
      fixture.detectChanges();
      expect(component.drawDate.toDateString()).toBe((new Date(mockJackpotData[3].nextDrawDate)).toDateString());
   });

   it('should not update next draw date', () => {
      component.updateNextDrawDate(null);
      fixture.detectChanges();
      expect(component.drawDate.toDateString()).toBe((new Date(mockJackpotData[0].nextDrawDate)).toDateString());
   });
   it('should not change next button text', () => {
      gameServiceStub.todayGameTimeLeft.and.returnValue(-80);
      component.checkGameTime();
      expect(gameServiceStub.selectGameNext.text).toBe(Constants.labels.nextText);
   });
   it('should checkGameTime when ', () => {
      gameServiceStub.lottoDayChart.splice(0, 7);
      component.gameDayChart.splice(0, 7);
      const onSomethingHappenedSpy = spyOn(component, 'checkGameTime');
      gameServiceStub.gamesDayChartObserver.next(true);
      expect(onSomethingHappenedSpy).toHaveBeenCalled();
   });

   it('should handle next button click when game time out ', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.gameTimeout = true;
      component.nextClick(null);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });
   it('should retutn if less time is left ', () => {
      component.gameTimeLeft = -3;
      expect(component.isLesstimeleft()).toBe(true);
   });
   it('should populate game on query param chamge', () => {
      const spy = spyOn(component, 'populateGameType');
      activatedRouteStub.queryParams.emit({ game: '' });
      activatedRouteStub.queryParams.emit({ game: 'LOT' });
      const param = spy.calls.first().args[0];
      expect(param).toBe('LOT');
   });

   it('should handle time out overlay button click', () => {
      component.hideTimeOutOverlay('');
      expect(component.bothGameNotAvailable).toBe(false);
   });

   it('should save vm on next click for pwb', () => {
      component.vm = {
         game: Constants.VariableValues.gameTypes.LOT.code,
         method: 'p'
      };
      const temp = JSON.parse(JSON.stringify(Constants.VariableValues.gameTypes));
      component.selectedGameType.code = Constants.VariableValues.gameTypes.PWB.code;
      component.selectedPlayMethod = Constants.VariableValues.playMethods.pick;
      component.nextClick(null);
      expect(component.vm.game).toBe(Constants.VariableValues.gameTypes.PWB.code);
   });
});
