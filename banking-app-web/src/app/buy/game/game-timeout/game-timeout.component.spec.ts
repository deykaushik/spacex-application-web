import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../../test-util';
import { GameService } from '../game.service';
import { Constants } from './../../../core/utils/constants';
import { GameTimeoutComponent } from './game-timeout.component';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { SystemErrorComponent } from '../../../shared/components/system-services/system-services.component';
import { RouterTestingModule } from '@angular/router/testing';

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

const gameServiceStub = {
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
};

describe('GameTimeoutComponent', () => {
   let component: GameTimeoutComponent;
   let fixture: ComponentFixture<GameTimeoutComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [GameTimeoutComponent],
         imports: [FormsModule, RouterTestingModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: GameService, useValue: gameServiceStub }, SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      gameServiceStub.gamesDayChartObserver.next(false);
      gameServiceStub.gamesDayChartObserver.next(true);
      fixture = TestBed.createComponent(GameTimeoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set title values', () => {
      component.powerTimeout = true;
      component.setDomValues();
      expect(component.playTitle).toBe(Constants.VariableValues.gameTypes.LOT.text);
      component.lotoTimeout = true;
      component.powerTimeout = false;
      component.setDomValues();
      expect(component.playTitle).toBe(Constants.VariableValues.gameTypes.PWB.text);
   });

   it('should set table visibility', () => {
      component.powerTimeout = true;
      component.viewTimes();
      expect(component.visiblePowerTable).toBe(true);
      component.lotoTimeout = true;
      component.powerTimeout = false;
      component.viewTimes();
      expect(component.visibleLottoTable).toBe(true);
   });

   it('should emit button Click', () => {
      component.onButtonClick.subscribe(code => {
         expect(code).toBe(Constants.VariableValues.gameTypes.PWB.code);
      });
      component.buttonClick(Constants.VariableValues.gameTypes.PWB.code);
   });
});
