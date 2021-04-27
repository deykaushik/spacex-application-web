import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameWinningNumbersComponent } from './game-winning-numbers.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../../test-util';
import { SharedModule } from './../../../shared/shared.module';
import { Constants } from './../../../core/utils/constants';
import { IGameWinningNumbersData, IGameBallDetail, IGameWinnerDetail, IGameprovincialWinner } from '../../../core/services/models';
import { GameService } from '../game.service';
import { BsModalService } from 'ngx-bootstrap';
import { GaTrackingService } from '../../../core/services/ga.service';
import { BallColorPipe } from '../../../shared/pipes/ball-color.pipe';
import { SkeletonLoaderPipe } from '../../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const mockBallDetails: IGameBallDetail[] = [
   {
      sequenceNumber: '1',
      ballNumber: 47
   },
   {
      sequenceNumber: '2',
      ballNumber: 25
   },
   {
      sequenceNumber: '3',
      ballNumber: 12
   },
   {
      sequenceNumber: '4',
      ballNumber: 8
   },
   {
      sequenceNumber: '5',
      ballNumber: 32
   },
   {
      sequenceNumber: '6',
      ballNumber: 35
   },
   {
      sequenceNumber: 'BonusBall',
      ballNumber: 52
   }
];

const mockWinnerDetails: IGameWinnerDetail[] = [
   {
      divisionNumber: 1,
      payoutAmount: 0,
      numberOfWinners: 0
   },
   {
      divisionNumber: 2,
      payoutAmount: 88447.4,
      numberOfWinners: 1
   },
   {
      divisionNumber: 3,
      payoutAmount: 3845.5,
      numberOfWinners: 40
   },
   {
      divisionNumber: 4,
      payoutAmount: 2670.5,
      numberOfWinners: 72
   },
   {
      divisionNumber: 5,
      payoutAmount: 143.7,
      numberOfWinners: 2248
   },
   {
      divisionNumber: 6,
      payoutAmount: 120.4,
      numberOfWinners: 2332
   },
   {
      divisionNumber: 7,
      payoutAmount: 50,
      numberOfWinners: 38689
   },
   {
      divisionNumber: 8,
      payoutAmount: 20,
      numberOfWinners: 24651
   }];

const mockProvincialWinners: IGameprovincialWinner = {
   wCWinners: 0,
   nCWinners: 0,
   eCWinners: 0,
   mPWinners: 0,
   lPWinners: 0,
   fSWinners: 0,
   kZNWinners: 0,
   nWWinners: 0
};

const mockGameWinningNumbersData: IGameWinningNumbersData[] = [{
   drawName: 'Lotto',
   drawDate: '2017-12-13T00:00:00+02:00',
   nextDrawDate: '2017-12-16T00:00:00+02:00',
   drawNumber: 1770,
   ballDetails: mockBallDetails,
   winnerDetails: mockWinnerDetails,
   rolloverAmount: 26530518.86,
   rolloverNumber: 9,
   totalPrizePoolAmount: 29996342.66,
   totalSalesAmount: 13940030,
   estimatedJackpotAmount: 30000000,
   guaranteedJackpotAmount: 0,
   drawMachineName: 'RNG2',
   ballSetNumber: 'RNG',
   provincialWinners: mockProvincialWinners
}];

const gameErrorStub = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   getWinningNumbers: jasmine.createSpy('getWinningNumbers').and.returnValue(Observable.of(mockGameWinningNumbersData)),
   getWinningNumbersWithError: jasmine.createSpy('getWinningNumbers').and.returnValue(Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
   })),
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('GameWinningNumbersComponent', () => {
   let component: GameWinningNumbersComponent;
   let fixture: ComponentFixture<GameWinningNumbersComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [GameWinningNumbersComponent, SkeletonLoaderPipe, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            BsModalService,
            { provide: GameService, useValue: gameServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(GameWinningNumbersComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should get winning number data', () => {
      component.getWinningNumbersData();
      expect(component.winningNumbersInfo).toBe(mockGameWinningNumbersData);
      expect(component.skeletonMode).toBe(false);
   });

   it('should be created with error', () => {
      gameServiceStub.getWinningNumbers.and.returnValue(gameErrorStub);
      component.getWinningNumbersData();
      expect(component.isLottoError).toBe(true);
   });
});
