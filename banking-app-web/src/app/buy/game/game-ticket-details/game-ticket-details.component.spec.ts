import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BsModalService } from 'ngx-bootstrap';
import { assertModuleFactoryCaching } from './../../../test-util';
import { GameTicketDetailsComponent } from './game-ticket-details.component';
import { GameService } from '../game.service';
import { IGameTicketData, BoardDetail } from '../../../core/services/models';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Constants } from '../../../core/utils/constants';
import { CommonUtility } from '../../../core/utils/common';
import { SkeletonLoaderPipe } from '../../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { PreFillService } from '../../../core/services/preFill.service';
import { IBuyElectricityAccount } from '../../buy-electricity/buy-electricity.models';
import { IBoard } from '../models';

const mockPurchaseAccountDetails: IBuyElectricityAccount = {
   accountNumber: '1622013026',
   accountType: 'CA'
};

const mockBoardDetails: BoardDetail[] = [
   {
      boardNumber: 'A',
      numbersPlayed: '3 4 24 28 30 48',
      BoardNumber: 'A',
      NumbersPlayed: '3 4 24 28 30 48'
   },
   {
      boardNumber: 'B',
      numbersPlayed: '7 14 19 28 44 48',
      BoardNumber: 'B',
      NumbersPlayed: '7 14 19 28 44 48'
   },
   {
      boardNumber: 'C',
      numbersPlayed: '3 20 25 28 34 35',
      BoardNumber: 'C',
      NumbersPlayed: '3 20 25 28 34 35'
   },
   {
      boardNumber: 'D',
      numbersPlayed: '10 13 15 16 30 39',
      BoardNumber: 'D',
      NumbersPlayed: '10 13 15 16 30 39'
   },
   {
      boardNumber: 'E',
      numbersPlayed: '5 12 35 36 40 45',
      BoardNumber: 'E',
      NumbersPlayed: '5 12 35 36 40 45'
   },
   {
      boardNumber: 'F',
      numbersPlayed: '4 11 18 22 25 45',
      BoardNumber: 'F',
      NumbersPlayed: '4 11 18 22 25 45'
   },
   {
      boardNumber: 'G',
      numbersPlayed: '19 28 30 32 39 41',
      BoardNumber: 'G',
      NumbersPlayed: '19 28 30 32 39 41'
   },
   {
      boardNumber: 'H',
      numbersPlayed: '5 11 17 30 43 44',
      BoardNumber: 'H',
      NumbersPlayed: '5 11 17 30 43 44'
   },
   {
      boardNumber: 'I',
      numbersPlayed: '16 32 35 42 45 48',
      BoardNumber: 'I',
      NumbersPlayed: '16 32 35 42 45 48'
   },
   {
      boardNumber: 'J',
      numbersPlayed: '4 13 24 27 47 51 52',
      BoardNumber: 'J',
      NumbersPlayed: '4 13 24 27 47 51 52'
   }
];

const mockNotificationDetails = [{
   'notificationId': 1,
   'notificationType': 'EMAIL'
}];

const gameErrorStub = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const mockTicketDetails: IGameTicketData = {
   batchID: 2192946,
   capturedDate: '2018-01-03T00:00:00',
   clientRequestedDate: '2018-01-03T00:00:00',
   purchaseDate: '2018-01-03T00:00:00',
   ticketRequestedTime: '19:00',
   myDescription: 'LOTTO PLUS 2 (03-01-2018)',
   fromAccount: mockPurchaseAccountDetails,
   amount: 100.0,
   notificationDetails: mockNotificationDetails,
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
   boardDetails: mockBoardDetails,
   ticketStatus: 'Success',
   purchaseReferenceNumber: '20180103/Nedbank/000000489057565638'
};

const mockTicketDetailsWithPick: IGameTicketData = {
   batchID: 2192946,
   capturedDate: '2018-01-03T00:00:00',
   clientRequestedDate: '2018-01-03T00:00:00',
   purchaseDate: '2018-01-03T00:00:00',
   ticketRequestedTime: '19:00',
   myDescription: 'LOTTO PLUS 2 (03-01-2018)',
   fromAccount: mockPurchaseAccountDetails,
   amount: 100.0,
   notificationDetails: mockNotificationDetails,
   game: 'LOT',
   gameType: 'OWN',
   isReplay: true,
   isViewMore: true,
   drawNumber: 1763,
   drawDate: '2017-11-18T00:00:00',
   drawsPlayed: 1,
   boardsPlayed: 10,
   isLottoPlus: false,
   isLottoPlusTwo: true,
   boardDetails: mockBoardDetails,
   ticketStatus: 'Success',
   purchaseReferenceNumber: '20180103/Nedbank/000000489057565638'
};

const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   getLottoTicketData: jasmine.createSpy('getLottoTicketData').and.returnValue(Observable.of(mockTicketDetails)),
   getLottoTicketDataPick: Observable.of(mockTicketDetailsWithPick),
   getLottoTicketReplayData: jasmine.createSpy('getLottoTicketReplayData').and.returnValue(Observable.of(mockTicketDetails))
};

const preFillServiceStub = {};

describe('GameTicketDetailsComponent', () => {
   let component: GameTicketDetailsComponent;
   let fixture: ComponentFixture<GameTicketDetailsComponent>;
   let router: Router;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [GameTicketDetailsComponent, SkeletonLoaderPipe, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            BsModalService,
            { provide: GameService, useValue: gameServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub }
         ],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(GameTicketDetailsComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();

      component.game = Constants.lottoConst.pwbType;
      component.getBallClass(23, 1);
      expect(component.ballClassToReturn).toBe('powerball-board-1');

      component.getBallClass(23, 5);
      expect(component.ballClassToReturn).toBe('powerball-board-2');

      const spy = spyOn(router, 'navigate');
      component.onReplay(2195201);
      expect(component.isReplay).toBe(true);

      gameServiceStub.getLottoTicketReplayData.and.returnValue(gameServiceStub.getLottoTicketDataPick);
      component.onReplay(2195201);
      expect(component.isReplay).toBe(true);
   });
   it('should be created for error', () => {
      gameServiceStub.getLottoTicketData.and.returnValue(gameErrorStub);
      component.getTicketDetailsData();
      expect(component.isLottoError).toBe(true);
   });
});
