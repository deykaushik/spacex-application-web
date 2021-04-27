import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { assertModuleFactoryCaching } from './../../../test-util';
import { SkeletonLoaderPipe } from '../../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { DatePipe } from '@angular/common';

import { GameService } from '../game.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { GamePalletComponent } from './game-pallet.component';
import { GameModule } from '../game.module';
import { SharedModule } from '../../../shared/shared.module';
import { AuthConstants } from '../../../auth/utils/constants';
import { ILottoHistoryData } from '../../../core/services/models';

this.mockDateConst = '2017-12-07T00:00:00';

const mockLottoHistory: ILottoHistoryData[] = [{
   'ClientRequestedDate': this.mockDateConst,
   'PurchaseDate': this.mockDateConst,
   'TicketRequestedTime': '08:01',
   'MyDescription': 'LOTTO (09-12-2017)',
   'FromAccount': {
      'AccountNumber': '1002475473',
      'AccountType': 'CA'
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
   'DrawsPlayed': 1,
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
   'DrawsPlayed': 1,
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
   'DrawsPlayed': 1,
   'BoardsPlayed': 2,
   'isLottoPlus': false,
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
      'AccountType': 'CA'
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
   'DrawsPlayed': 1,
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
   'DrawsPlayed': 1,
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
   'Amount': -10,
   'NotificationDetails': [
      {
         'notificationAddress': '1',
         'notificationType': 'EMAIL'
      }
   ],
   'game': 'LOTTO',
   'GameType': 'QPK',
   'DrawNumber': 0,
   'DrawDate': '0001-01-01T00:00:00',
   'DrawsPlayed': 1,
   'BoardsPlayed': 2,
   'isLottoPlus': true,
   'isLottoPlusTwo': false,
   'TicketStatus': 'Success',
   'PurchaseReferenceNumber': '20171207/Nedbank/000000489057091854'
}];

const mockTnCResponse = [];

const mockEmptyLottoHistoryApiResponse = [];

const getLottoHistoryWithErrorStatus = Observable.create(observer => {
   observer.error(new HttpErrorResponse({ error: null, headers: null, status: 412, statusText: '', url: '' }));
   observer.complete();
});

const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   getLottoHistorEmptyData: jasmine.createSpy('getLottoHistoryListData')
      .and.returnValue(Observable.of(mockEmptyLottoHistoryApiResponse)),
   getLottoHistoryWithError: jasmine.createSpy('getLottoHistoryListData')
      .and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      })),
   getLottoHistoryListData: jasmine.createSpy('getLottoHistoryListData')
      .and.returnValue(Observable.create(observer => mockLottoHistory)),
   getLottoHistoryListDataRes: jasmine.createSpy('getLottoHistoryListData')
      .and.returnValue(Observable.of(mockLottoHistory)),
   getTermsAndConditionsResult: jasmine.createSpy('getTermsAndConditionsResult')
      .and.returnValue(Observable.of({ 'accepted': true }))
};

const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
describe('GamePalletComponent', () => {
   let component: GamePalletComponent;
   let fixture: ComponentFixture<GamePalletComponent>;
   let router: Router;
   let gameService: GameService;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [GamePalletComponent, SkeletonLoaderPipe, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            BsModalService,
            { provide: GameService, useValue: gameServiceStub },
            { provide: SystemErrorService, useValue: systemErrorServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ],
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(GamePalletComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      gameService = fixture.debugElement.injector.get(GameService);
      fixture.detectChanges();
   });

   it('should be created with error', () => {
      gameService.getLottoHistoryListData = gameServiceStub.getLottoHistoryWithError;
      component.getLottoHistoryData();
      expect(component).toBeTruthy();
   });

   it('should be created', () => {
      gameService.getLottoHistoryListData = gameServiceStub.getLottoHistorEmptyData;
      component.getLottoHistoryData();
      expect(component.isRecords).toBe(true);
   });

   it('should be created with records', () => {
      gameService.getLottoHistoryListData = gameServiceStub.getLottoHistoryListDataRes;
      component.getLottoHistoryData();
      expect(component.noLottoRecords).toBe(true);
   });

   it('should be created with getLottoHistoryListData error', () => {
      gameService.getLottoHistoryListData = gameServiceStub.getLottoHistoryWithError;
      component.getLottoHistoryData();
      expect(component.lottoError).toEqual(AuthConstants.messages.lottoListError);
   });

   it('should be created with getLottoHistoryListData error for 412 status', () => {
      gameServiceStub.getLottoHistoryListData.and.returnValue(getLottoHistoryWithErrorStatus);
      component.getLottoHistoryData();
      expect(systemErrorServiceStub.closeError).toHaveBeenCalled();
   });

   it('should be created with getTermsAndConditionsResult error', () => {
      component.getLottoHistoryData();
      expect(component.noLottoRecords).toEqual(false);
   });

   it('should be set for view more data', () => {
      component.lottoHistoryList = mockLottoHistory;
      component.ngOnInit();
      expect(component.isViewMore).toEqual(true);
   });

   it('should navigate on lotto details click', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.viewAllTickets();
      const url = spy.calls.first().args[0];
      expect(url).toBe('game/lotto/history');
   });

});
