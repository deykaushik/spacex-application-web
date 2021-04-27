import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameListComponent } from './game-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../../test-util';
import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { Constants } from './../../../core/utils/constants';
import { IGameWinningNumbersData, IGameBallDetail, IGameWinnerDetail, IGameprovincialWinner } from '../../../core/services/models';
import { BallColorPipe } from '../../../shared/pipes/ball-color.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';

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

const testComponent = class { };
const routerTestingParam = [
   { path: 'game/drawdetail/:ticketType/:drawNumber', component: testComponent }
];

describe('GameListComponent', () => {
   let component: GameListComponent;
   let fixture: ComponentFixture<GameListComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [GameListComponent, SkeletonLoaderPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            BsModalService,
            { provide: ActivatedRoute, useValue: { params: Observable.of({ drawNumber: '1770', ticketType: 'Lotto' }) } }
         ],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(GameListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      expect(component).toBeTruthy();
   });

   it('should call setDrawName and set game name to be LOTTO', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGameLotto);
      expect(component.gameName).toBe('LOTTO');
   });

   it('should call  setDrawName and set game name to be Lotto Plus', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGameLottoPlus);
      expect(component.gameName).toBe('LOTTO PLUS 1');
   });

   it('should call  setDrawName and set game name to be Lotto Plus 2', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGameLottoPlus2);
      expect(component.gameName).toBe('LOTTO PLUS 2');
   });

   it('should call  setDrawName and set game name to be PowerBall', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGamePowerBall);
      expect(component.gameName).toBe('PowerBall');
   });

   it('should call  setDrawName and set game name to be Powerball Plus', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGamePowerBallPlus);
      expect(component.gameName).toBe('PowerBall PLUS');
   });

   it('should return the powerballGroup class', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      component.getBallClass(32, 'PowerBall', 4);
      expect(component.ballClassToReturn).toBe('powerball-board-1');
   });

   it('should return the powerball-group4 class', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      component.getBallClass(32, 'PowerBall', 5);
      expect(component.ballClassToReturn).toBe('powerball-board-2');
   });

   it('should return the lotto group1 class', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      component.getBallClass(32, 'Lotto', 3);
      expect(component.ballClassToReturn).toBe('group3');
   });

   it('should return correct group for lottery numbers', () => {
      component.winningNumbersInfo = mockGameWinningNumbersData;
      expect(component.getLotteryNumberGroup(1)).toBe(1);
   });

});
