import { FormsModule } from '@angular/forms';
import { async, fakeAsync, ComponentFixture, TestBed, inject, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { GameService } from '../game.service';
import { Constants } from './../../../core/utils/constants';
import { GameTimeoutReplayComponent } from './game-timeout-replay.component';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { SystemErrorComponent } from '../../../shared/components/system-services/system-services.component';
import {
   IGameWorkflowSteps, GameSteps, ISelectGameVm, IGameDrawInfo,
   ISelectNumbersVm, IGameMetaData, IGameDrawDetails, ISelectGameForVm, GameDetail,
   SelectGameNotification,
   IGameDayTimeSheet,
   IGameTimeMetaData,
   IDrawResult
} from './../models';
import { constants } from 'fs';

const chart = [
   { 'code': 'MON', 'startTime': '06:00', 'endTime': '22:30', 'text': 'monday' },
   { 'code': 'TUE', 'startTime': '06:00', 'endTime': '20:25', 'text': 'tuesday' },
   { 'code': 'WED', 'startTime': '06:00', 'endTime': '22:30', 'text': 'wednesday' },
   { 'code': 'THU', 'startTime': '06:00', 'endTime': '22:30', 'text': 'thursday' },
   { 'code': 'FRI', 'startTime': '06:00', 'endTime': '20:25', 'text': 'friday' },
   { 'code': 'SAT', 'startTime': '06:00', 'endTime': '22:30', 'text': 'saturday' },
   { 'code': 'SUN', 'startTime': '06:00', 'endTime': '17:30', 'text': 'sunday' }];

const drawDays = [
   { 'code': 'FRI', 'text': 'friday' },
   { 'code': 'TUE', 'text': 'tuesday' }];

const cutOffTiming = {
   'NORM': '22:30',
   'DRAW': '20:25',
   'SUN': '17:30'
};

const meta: IGameTimeMetaData = {
   gameType: 'LOT',
   gameTypeName: 'Lotto',
   startTime: '06:00',
   cutOffTimes: [
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
   drawDays: [
      {
         'drawDayNumber': 8,
         'drawDayName': 'WED'
      },
      {
         'drawDayNumber': 4,
         'drawDayName': 'SAT'
      }
   ],
   postponed: false,
   boardPrice: 5,
   lottoPlusPrice: 2.5,
   lottoPlusTwoPrice: 2.5,
   maxNumberOfBoardsAllowed: 20,
   maxNumberOfDrawsAllowed: 10,
   minimumNumberOfBoardsAllowed: 2,
   minimumNumberOfDrawsAllowed: 1,
   lottoBallMatrixMin: 1,
   lottoBallMatrixMax: 52
};

const gameServiceStub = {
   gameWorkflowSteps: {
      selectGame: {
         isDirty: false
      }
   },
   checkGameTimeOuts: () => () => true,
   gamesDayChartObserver: new BehaviorSubject(null),
   lottoDayChart: chart,
   powerDayChart: chart,
   lottoMeta: meta,
   powerMeta: meta,
   getTodayTimeSheet: jasmine.createSpy('getTodayTimeSheet').and.returnValue(chart[0]),
   todayGameTimeLeft: jasmine.createSpy('todayGameTimeLeft').and.returnValue(0),
   getDrawdays: jasmine.createSpy('todayGameTimeLeft').and.returnValue(drawDays),
   getCutOffTiming: jasmine.createSpy('todayGameTimeLeft').and.returnValue(cutOffTiming),
   checkGameTimeOut: jasmine.createSpy('checkGameTimeOut').and.returnValue(false),
   clearGameDetails: jasmine.createSpy('clearGameDetails')
};

describe('GameTimeoutReplayComponent', () => {
   let component: GameTimeoutReplayComponent;
   let fixture: ComponentFixture<GameTimeoutReplayComponent>;
   let router: Router;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [GameTimeoutReplayComponent],
         imports: [FormsModule, RouterTestingModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: GameService, useValue: gameServiceStub }, SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      gameServiceStub.gamesDayChartObserver.next(true);
      fixture = TestBed.createComponent(GameTimeoutReplayComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should display title', () => {
      component.checkGameTime();
      expect(component.title).toBe('Entries are now closed.');
   });

   it('should redirect to history list on Go to history', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.goToHistory();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/game/lotto/history');
   }));
});
