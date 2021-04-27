import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterLink, Router } from '@angular/router';

import { assertModuleFactoryCaching } from './../../../test-util';
import { SkeletonLoaderPipe } from '../../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { OrderByPipe } from '../../../shared/pipes/order-by.pipe';

import { GameHistoryComponent } from './game-history.component';
import { GameService } from '../game.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { PreFillService } from '../../../core/services/preFill.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { Constants } from '../../../core/utils/constants';
import { ILottoHistoryData, IGameTicketData } from '../../../core/services/models';
import { IGameDrawDetails } from '../models';

const mockLottoHistory: ILottoHistoryData[] = [
   {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 10,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   },
   {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -20,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': true,
      'isLottoPlusTwo': true,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   },
   {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'SA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'SA'
      },
      'Amount': 10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': true,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   },
   {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': true,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CC'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CC'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': 10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': 20,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': 30,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': 20,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': 10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': true,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'PWB',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'IS'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'PWB',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': true,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }, {
      'ClientRequestedDate': this.mockDateConst,
      'PurchaseDate': this.mockDateConst,
      'TicketRequestedTime': '08:01',
      'MyDescription': 'LOTTO (09-12-2017)',
      'FromAccount': {
         'AccountNumber': '1002475473',
         'AccountType': 'CA'
      },
      'fromAccount': {
         'accountNumber': '1002475473',
         'accountType': 'CA'
      },
      'Amount': -10,
      'NotificationDetails': [
         {
            'notificationAddress': '1',
            'notificationType': 'EMAIL'
         }
      ],
      'game': 'LOT',
      'GameType': 'QPK',
      'DrawNumber': 0,
      'DrawDate': '0001-01-01T00:00:00',
      'drawsPlayed': 1,
      'BoardsPlayed': 2,
      'isLottoPlus': false,
      'isLottoPlusTwo': false,
      'TicketStatus': 'Success',
      'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
   }];

const mockDrawData: IGameDrawDetails[] = [
   {
      'drawName': 'LottoPlus',
      'drawDate': new Date(),
      'nextDrawDate': new Date('2030-03-09T00:00:00+02:00'),
      'drawNumber': 1774
   },
   {
      'drawName': 'PowerBall',
      'drawDate': new Date(),
      'nextDrawDate': new Date('2030-03-06T00:00:00+02:00'),
      'drawNumber': 842
   }];

const mockDrawDataForPowerball: IGameDrawDetails[] = [
   {
      'drawName': 'LottoPlus',
      'drawDate': new Date(),
      'nextDrawDate': new Date('2030-03-06T00:00:00+02:00'),
      'drawNumber': 1774
   },
   {
      'drawName': 'PowerBall',
      'drawDate': new Date(),
      'nextDrawDate': new Date('2030-03-15T00:00:00+02:00'),
      'drawNumber': 842
   }];

const mockDrawDataForLotto: IGameDrawDetails[] = [
   {
      'drawName': 'LottoPlus',
      'drawDate': new Date(),
      'nextDrawDate': new Date('2018-03-06T00:00:00+02:00'),
      'drawNumber': 1774
   },
   {
      'drawName': 'PowerBall',
      'drawDate': new Date(),
      'nextDrawDate': new Date('2030-03-15T00:00:00+02:00'),
      'drawNumber': 842
   }];
const mockDrawDataForPowerballPlus: IGameDrawDetails[] = [
   {
      'drawName': 'LottoPlus',
      'drawDate': new Date(),
      'nextDrawDate': new Date(),
      'drawNumber': 1774
   },
   {
      'drawName': 'PowerBall',
      'drawDate': new Date(),
      'nextDrawDate': new Date('2017-03-15T00:00:00+02:00'),
      'drawNumber': 842
   }];

const mockTicketDataResponse: IGameTicketData[] = [{
   'batchID': 2195201,
   'capturedDate': '2018-01-18T00:00:00',
   'clientRequestedDate': '2018-01-18T00:00:00',
   'purchaseDate': '2018-01-18T00:00:00',
   'ticketRequestedTime': '14:02',
   isReplay: true,
   isViewMore: true,
   'myDescription': 'LOTTO Purchase',
   'fromAccount': {
      'accountNumber': '1637003714',
      'accountType': 'CA'
   },
   'amount': 10.0,
   'notificationDetails': [

   ],
   'game': 'LOT',
   'gameType': 'OWN',
   'drawNumber': 1781,
   'drawDate': '2018-01-20T00:00:00',
   'drawsPlayed': 1,
   'boardsPlayed': 2,
   'isLottoPlus': false,
   'isLottoPlusTwo': false,
   'boardDetails': [
      {
         'boardNumber': 'A',
         'numbersPlayed': '12 18 19 26 32 33',
         'BoardNumber': 'A',
         'NumbersPlayed': '12 18 19 26 32 33'
      },
      {
         'boardNumber': 'B',
         'numbersPlayed': '2 3 11 12 26 27',
         'BoardNumber': 'B',
         'NumbersPlayed': '2 3 11 12 26 27'
      }
   ],
   'ticketStatus': 'Failure',
   'purchaseReferenceNumber': '20180118/Nedbank/000000489057901826'
}];

const mockTicketDataResponseWithQPK: IGameTicketData[] = [{
   'batchID': 2195201,
   'capturedDate': '2018-01-18T00:00:00',
   'clientRequestedDate': '2018-01-18T00:00:00',
   'purchaseDate': '2018-01-18T00:00:00',
   'ticketRequestedTime': '14:02',
   isReplay: true,
   isViewMore: true,
   'myDescription': 'LOTTO Purchase',
   'fromAccount': {
      'accountNumber': '1637003714',
      'accountType': 'CA'
   },
   'amount': 10.0,
   'notificationDetails': [

   ],
   'game': 'LOT',
   'gameType': Constants.VariableValues.gameMethod.a,
   'drawNumber': 1781,
   'drawDate': '2018-01-20T00:00:00',
   'drawsPlayed': 1,
   'boardsPlayed': 2,
   'isLottoPlus': false,
   'isLottoPlusTwo': false,
   'boardDetails': [
      {
         'boardNumber': 'A',
         'numbersPlayed': '12 18 19 26 32 33',
         'BoardNumber': 'A',
         'NumbersPlayed': '12 18 19 26 32 33'
      },
      {
         'boardNumber': 'B',
         'numbersPlayed': '2 3 11 12 26 27',
         'BoardNumber': 'B',
         'NumbersPlayed': '2 3 11 12 26 27'
      }
   ],
   'ticketStatus': 'Failure',
   'purchaseReferenceNumber': '20180118/Nedbank/000000489057901826'
}];
const mockEmptyLottoHistoryApiResponse = [];

const mockEmptyDrawDataResponse = [];

const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   getViewMoreLottoHistory: jasmine.createSpy('getViewMoreLottoHistory')
      .and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      })),

   getViewMoreClickLotto: jasmine.createSpy('getViewMoreClickLotto')
      .and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      })),

   getNextDrawDetails: jasmine.createSpy('getNextDrawDetails')
      .and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      })),
   getLottoHistoryEmptyData: jasmine.createSpy('getLottoHistoryListData')
      .and.returnValue(Observable.of(mockEmptyLottoHistoryApiResponse)),
   getViewMoreLottoHistoryRes: jasmine.createSpy('getViewMoreLottoHistory')
      .and.returnValue(Observable.of(mockLottoHistory)),
   getViewMoreClickLottoEmpty: jasmine.createSpy('viewMoreTickets')
      .and.returnValue(Observable.of(mockEmptyLottoHistoryApiResponse)),
   getViewMoreClickLottoData: jasmine.createSpy('viewMoreTickets')
      .and.returnValue(Observable.of(mockLottoHistory)),
   getNextDrawDetailsData: jasmine.createSpy('viewMoreTickets')
      .and.returnValue(Observable.of(mockDrawData)),
   getNextDrawDetailsDataPwb: jasmine.createSpy('viewMoreTickets')
      .and.returnValue(Observable.of(mockDrawDataForPowerball)),
   getNextDrawDetailsDataLot: jasmine.createSpy('viewMoreTickets')
      .and.returnValue(Observable.of(mockDrawDataForLotto)),
   getNextDrawDetailsDataPlus: jasmine.createSpy('viewMoreTickets')
      .and.returnValue(Observable.of(mockDrawDataForPowerballPlus)),
   getTicketData: jasmine.createSpy('getLottoTicketReplayData')
      .and.returnValue(Observable.of(mockTicketDataResponse)),
   getTicketDataWithQPK: jasmine.createSpy('getLottoTicketReplayData')
      .and.returnValue(Observable.of(mockTicketDataResponseWithQPK))

};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
const preFillServiceStub = {};

describe('GameHistoryComponent', () => {
   let component: GameHistoryComponent;
   let router: Router;
   let fixture: ComponentFixture<GameHistoryComponent>;
   let gameService: GameService;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [GameHistoryComponent, SkeletonLoaderPipe, AmountTransformPipe, OrderByPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            BsModalService,
            { provide: GameService, useValue: gameServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(GameHistoryComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      gameService = fixture.debugElement.injector.get(GameService);
      fixture.detectChanges();
   });

   it('should be created with error', () => {
      gameService.getViewMoreLottoHistory = gameServiceStub.getViewMoreLottoHistory;
      expect(component).toBeTruthy();
   });

   it('should be created with empty response', () => {
      gameService.getViewMoreLottoHistory = gameServiceStub.getLottoHistoryEmptyData;
      component.getLottoHistoryData();
      expect(component.noLottoRecords).toBe(true);
   });

   it('should be created with records', () => {
      gameService.getViewMoreLottoHistory = gameServiceStub.getViewMoreLottoHistoryRes;
      component.getLottoHistoryData();
      expect(component.isRecords).toBe(true);
   });

   it('should be created for viewMoreTickets', () => {

      gameService.getViewMoreClickLotto = gameServiceStub.getViewMoreClickLottoEmpty;
      component.viewMoreTickets();
      expect(component.noMoreTicketsRecords).toBe(true);
   });

   it('should be created with records for viewMoreTickets', () => {
      gameService.getViewMoreClickLotto = gameServiceStub.getViewMoreClickLottoData;
      component.viewMoreTickets();
      expect(component.noLottoRecords).toBe(false);
   });

   it('should be created with no more records for viewMoreTickets', () => {
      gameService.getViewMoreClickLotto = gameServiceStub.getViewMoreClickLottoData;
      component.lottoHistory[0] = mockLottoHistory;
      component.noLottoRecords = false;
      component.viewMoreTickets();
      expect(component.noLottoRecords).toBe(false);
   });

   it('should get NextDrawDate for lotto having lotto date > powerball date', () => {
      gameService.getNextDrawDetails = gameServiceStub.getNextDrawDetailsData;
      component.getNextDrawDetails();
      expect(component.lottoDate.toLocaleDateString()).toBe(new Date('2030-03-09T00:00:00+02:00').toLocaleDateString());
   });

   it('should get NextDrawDate for powerball having powerball date > todays date', () => {
      gameService.getNextDrawDetails = gameServiceStub.getNextDrawDetailsDataPwb;
      component.getNextDrawDetails();
      expect(component.pwbDate.toLocaleDateString()).toBe(new Date('2030-03-15T00:00:00+02:00').toLocaleDateString());
   });

   it('should get NextDrawDate for lotto having lotto date > todays date', () => {
      gameService.getNextDrawDetails = gameServiceStub.getNextDrawDetailsDataLot;
      component.getNextDrawDetails();
      expect(component.lottoDate.toLocaleDateString()).toBe(new Date('2018-03-06T00:00:00+02:00').toLocaleDateString());
   });

   it('should get NextDrawDate for powerball having powerball date > lotto date', () => {
      gameService.getNextDrawDetails = gameServiceStub.getNextDrawDetailsDataPlus;
      component.getNextDrawDetails();
      expect(component.pwbDate.toLocaleDateString()).toBe(new Date('2017-03-15T00:00:00+02:00').toLocaleDateString());
   });

   it('should sort records ', () => {
      component.lottoHistory[0] = mockLottoHistory;
      component.sort('Amount');
      expect(component.direction).toBeTruthy();
   });

   it('should check for no lotto records ', () => {
      component.noLottoRecords = true;
      component.ngOnInit();
      expect(component.showViewMoreButton).toBe(false);
   });

   it('should navigate to replay', () => {
      const spy = spyOn(router, 'navigateByUrl');
      gameService.getLottoTicketReplayData = gameServiceStub.getTicketData;
      component.onReplay(2195201);
      const url = spy.calls.first().args[0];
      expect(component.isReplay).toBe(true);
   });

   it('should navigate to replay if game is quickpick', () => {
      const spy = spyOn(router, 'navigateByUrl');
      gameService.getLottoTicketReplayData = jasmine.createSpy('getLottoTicketReplayData')
         .and.returnValue(Observable.of(mockTicketDataResponseWithQPK[0]));
      component.onReplay(2195201);
      const url = spy.calls.first().args[0];
      expect(component.isReplay).toBe(true);
   });
});
