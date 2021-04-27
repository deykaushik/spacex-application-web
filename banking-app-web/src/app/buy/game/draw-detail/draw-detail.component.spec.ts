import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap';
import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { IDrawResult, IBallDetail, IWinnerDetail, IProvincialWinner } from '../models';
import { GameService } from '../game.service';
import { BallColorPipe } from '../../../shared/pipes/ball-color.pipe';
import { PreFillService } from '../../../core/services/preFill.service';
import { Constants } from '../../../core/utils/constants';
import { DrawDetailComponent } from './draw-detail.component';

const mockBallDetails: IBallDetail[] = [
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

const mockWinnerDetails: IWinnerDetail[] = [
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

const mockProvincialWinners: IProvincialWinner = {
   wCWinners: 0,
   nCWinners: 0,
   eCWinners: 0,
   mPWinners: 0,
   lPWinners: 0,
   fSWinners: 0,
   kZNWinners: 0,
   nWWinners: 0
};

const mockDrawResults: IDrawResult[] = [{
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
   checkGameTimeOut: () => () => true,
   getDrawDetails: jasmine.createSpy('getDrawDetails').and.returnValue(Observable.of(mockDrawResults)),
   getDrawDetailsWithError: jasmine.createSpy('getDrawDetails').and.returnValue(Observable.create(observer => {
      observer.error(new Error('error'));
      observer.complete();
   })),
};

const preFillServiceStub = {};

const testComponent = class { };
const routerTestingParam = [
   { path: 'game/drawdetail/:ticketType/:drawNumber', component: testComponent }
];
describe('DrawDetailComponent', () => {
   let component: DrawDetailComponent;
   let fixture: ComponentFixture<DrawDetailComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [
            DrawDetailComponent,
            BallColorPipe,
            SkeletonLoaderPipe,
            AmountTransformPipe
         ],
         providers: [
            BsModalService,
            { provide: GameService, useValue: gameServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ drawNumber: '1770', ticketType: 'Lotto' }) } }
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));
   beforeEach(() => {
      fixture = TestBed.createComponent(DrawDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should populate game winning details', () => {
      component.getLottoDrawDetails();
      expect(component.lottoDrawDetail).toBe(mockDrawResults[0]);
      expect(component.drawNumber).toBe(1770);
      expect(component.drawDate).toBe('2017-12-13T00:00:00+02:00');
      expect(component.drawName).toBe('Lotto');
      expect(component.ballDetails).toBe(mockBallDetails);
      expect(component.winnerDetails).toBe(mockWinnerDetails);
      expect(gameServiceStub.getDrawDetails).toHaveBeenCalled();
   });

   it('should be created with error', () => {
      gameServiceStub.getDrawDetails.and.returnValue(gameErrorStub);
      component.getLottoDrawDetails();
      expect(component.isLottoError).toBe(true);
   });

   it('should call setDrawName and set game name to be LOTTO', () => {
      component.winningNumbersInfo = mockDrawResults;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGameLotto);
      expect(component.drawNameDetail).toBe('LOTTO' + ' draw details');
   });

   it('should call  setDrawName and set game name to be Lotto Plus', () => {
      component.winningNumbersInfo = mockDrawResults;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGameLottoPlus);
      expect(component.drawNameDetail).toBe('LOTTO PLUS 1' + ' draw details');
   });

   it('should call  setDrawName and set game name to be Lotto Plus 2', () => {
      component.winningNumbersInfo = mockDrawResults;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGameLottoPlus2);
      expect(component.drawNameDetail).toBe('LOTTO PLUS 2' + ' draw details');
   });

   it('should call  setDrawName and set game name to be PowerBall', () => {
      component.winningNumbersInfo = mockDrawResults;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGamePowerBall);
      expect(component.drawNameDetail).toBe('PowerBall' + ' draw details');
   });

   it('should call  setDrawName and set game name to be Powerball Plus', () => {
      component.winningNumbersInfo = mockDrawResults;
      component.setDrawName(Constants.labels.lottoLabels.winningNumbersGamePowerBallPlus);
      expect(component.drawNameDetail).toBe('PowerBall PLUS' + ' draw details');
   });

});
