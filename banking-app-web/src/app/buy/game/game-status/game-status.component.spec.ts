
import { NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from './../../../test-util';
import { SelectNumbersModel } from './../select-numbers/select-numbers-model';
import { SelectGameModel } from './../select-game/select-game-model';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { Constants } from './../../../core/utils/constants';
import { GameService } from './../game.service';
import { SelectGameReviewModel } from './../select-game-review/select-game-review.model';
import { SelectGameForModel } from './../select-game-for/select-game-for.model';
import { GameStatusComponent } from './game-status.component';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { MobileNumberMaskPipe } from '../../../shared/pipes/mobile-number-mask.pipe';
import { ISelectGameVm, ISelectNumbersVm, ISelectGameForVm, GameSteps, IGameMetaData } from './../models';
import { IGameData, MetaData, IAccountDetail } from './../../../core/services/models';
import { inject } from '@angular/core/testing';
import { PreFillService } from '../../../core/services/preFill.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { ReportsService } from '../../../reports/reports.service';
import { GaTrackingService } from '../../../core/services/ga.service';

const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard', component: testComponent },
   { path: 'game/status', component: testComponent },
];

describe('GameStatusComponent', () => {
   let component: GameStatusComponent;
   let fixture: ComponentFixture<GameStatusComponent>;

   let gameService: GameService;
   let router: Router;
   let modalService: BsModalService;
   let reportsService: ReportsService;

   const returnValueMakePurchase = Observable.of({
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
   });
   const returnValueMakePurchaseNoResponseType = Observable.of({
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
   });
   const returnValueMakePurchaseWithRefrenceTransaction = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'SECURETRANSACTION',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: ''
               },
            ]
         }
      ]
   });
   const returnValueMakePurchaseWithPendingStatus = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'PENDING',
                  reason: ''
               },
            ],
            transactionID: 123
         },
      ]
   });

   const returnValueMakePurchaseUnknownStatus = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'FV01',
                  status: 'unknown',
                  reason: 'status unknown'
               },
            ],
            transactionID: 123
         },
      ]
   });

   const lottoDetail: IGameData[] = [{
      ClientRequestedDate: '2017-08-09',
      FromAccount: {
         AccountNumber: '1001005570',
         accountType: 'CA'
      },
      Game: 'LOT',
      GameType: 'OWN',
      DrawNumber: 1734,
      DrawDate: '2017-08-09',
      DrawsPlayed: 2,
      BoardsPlayed: 3,
      IsLottoPlus: true,
      IsLottoPlusTwo: true,
      MyDescription: 'LOTTO test1',
      BoardDetails: [
         {
            BoardNumber: 'A',
            NumbersPlayed: '23 33 25 26 27 22'
         },
         {
            BoardNumber: 'B',
            NumbersPlayed: '21 22 22 24 44 26'
         },
         {
            BoardNumber: 'C',
            NumbersPlayed: '11 11 13 21 33 41'
         }
      ],
      notificationDetails: [
         {
            notificationType: 'EMAIL',
            notificationAddress: 'h@nk.co.za'
         }
      ]
   }
   ];
   function getMockGameDetail() {
      return {
         ClientRequestedDate: '2017-11-01',
         FromAccount: {
            AccountNumber: '1001005570',
            accountType: 'CA'
         },
         transactionID: '1234',
         Game: 'PWB',
         GameType: 'QPK',
         DrawNumber: 805,
         DrawDate: '2017-11-21',
         DrawsPlayed: 2,
         BoardsPlayed: 3,
         IsLottoPlus: false,
         IsLottoPlusTwo: false,
         MyDescription: 'LOTTO after accepting T\'s and C\'s',
         Favourite: false,
         BoardDetails: [],
         NotificationDetail: [{
            NotificationType: 'EMAIL',
            NotificationAddress: 'refilwemn@nedbank.co.za'
         }
         ]
      };
   }
   function getMockSelectGame() {
      return {
         game: Constants.VariableValues.gameTypes.LOT.code,
         method: Constants.VariableValues.playMethods.pick.code
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
   const gameServiceStub = {
      checkGameTimeOuts: () => () => true,
      gameWorkflowSteps: {
         selectGame: {
            isNavigated: false,
            sequenceId: GameSteps.selectGame,
            model: new SelectGameModel(),
            isDirty: false
         },
         selectNumbers: {
            isNavigated: false,
            sequenceId: GameSteps.selectNumbers,
            model: new SelectNumbersModel(),
            isDirty: false
         },
         selectGameFor: {
            isNavigated: false,
            sequenceId: GameSteps.selectGameFor,
            model: new SelectGameForModel(),
            isDirty: false
         },
         selectGameReview: {
            isNavigated: false,
            sequenceId: GameSteps.selectGameReview,
            model: new SelectGameReviewModel(),
            isDirty: false
         }
      },
      saveSelectGameVm: jasmine.createSpy('saveSelectGameVm'),
      getSelectGameVm: jasmine.createSpy('getSelectGameVm').and.returnValue(<ISelectGameVm>getMockSelectGame()),
      getSelectNumbersVm: jasmine.createSpy('getSelectNumbersVm').and.returnValue(<ISelectNumbersVm>getMockSelectNumbers()),
      makePurchase: jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchase;
      }),
      isPurchaseStatusValid: jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true),
      getGameDetails: jasmine.createSpy('getGameDetails').and.returnValue(<IGameData>getMockGameDetail()),
      getSelectGameForVm: jasmine.createSpy('getSelectGameForVm').and.returnValue(<ISelectGameForVm>getMockSelectGameForVm()),
      isPurchaseStatusNavigationAllowed: jasmine.createSpy('isPurchaseStatusNavigationAllowed').and.returnValue(true),
      getPurchaseStatus: jasmine.createSpy('getPurchaseStatus').and.returnValue(false),
      updateTransactionID: jasmine.createSpy('updateTransactionID'),
      clearGameDetails: jasmine.createSpy('clearGameDetails'),
      retryPayment: jasmine.createSpy('retryPurchase').and.returnValue(returnValueMakePurchase),
      checkGameTimeOut: jasmine.createSpy('checkGameTimeOut').and.returnValue(false),
      refreshAccounts: function () { },
      raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
      updateexecEngineRef: jasmine.createSpy('updateexecEngineRef')
   };
   const mockShow = {
      subscribe: jasmine.createSpy('show content').and.returnValue(Observable.of(true))
   };
   const reportServiceStub = {
      open: jasmine.createSpy('open')
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
         availableBalance: 3000,
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

   const preFillServiceStub = new PreFillService();
   const dataStub = {
      isReplay: true,
      isEdit: true,
      drawName: 'LOTTO'
   };

   preFillServiceStub.activeData = dataStub;
   preFillServiceStub.preFillReplayData = {
      BoardDetails: [{
         BoardNumber: 'A',
         NumbersPlayed: '3 4 6 7 8 5',
         isValid: true
      }],
      isLottoPlus: false,
      isLottoPlusTwo: false,
      BoardsPlayed: 2,
      batchID: 20341,
      DrawsPlayed: 3,
      DrawNumber: {
         drawDate: new Date(),
         drawName: 'Lotto',
         gameName: 'Lotto',
         game: 'Lotto',
         drawNumber: 177,
         nextDrawDate: new Date()
      },
      DrawDate: new Date(),
      TotalCost: 30,
      FromAccount: getMockGameAccounts()[0],
      boardDetails: [{
         BoardNumber: 'A',
         NumbersPlayed: '3 4 6 7 8 5',
         isValid: true
      }],
      boardsPlayed: 2,
      drawsPlayed: 3,
      drawNumber: {
         drawDate: new Date(),
         drawName: 'Powerball',
         gameName: 'Powerball',
         game: 'Powerball',
         drawNumber: 177,
         nextDrawDate: new Date()
      },
      drawDate: new Date(),
      totalCost: 30,
      fromAccount: getMockGameAccounts()[0],
      isValid: true,
      isReplay: true,
      game: Constants.VariableValues.gameTypes.PWB.code,
      method: Constants.VariableValues.playMethods.quickPick.code,
      gameType: Constants.VariableValues.gameMethod.a
   };

   const bsModalServiceStub = {
      show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
         return {
            content: {
               getApproveItStatus: mockShow,
               resendApproveDetails: mockShow,
               getOTPStatus: mockShow,
               otpIsValid: mockShow,
               updateSuccess: mockShow,
               processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
            }
         };
      }),
      onShow: jasmine.createSpy('onShow'),
      onShown: jasmine.createSpy('onShown'),
      onHide: jasmine.createSpy('onHide'),
      onHidden: {
         asObservable: jasmine.createSpy('onHidden asObservable').and.callFake(function () {
            return Observable.of(true);
         })
      },
   };

   const gaTrackingServiceStub = {
      sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
   };
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [GameStatusComponent, AmountTransformPipe, MobileNumberMaskPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            ComponentLoaderFactory,
            PositioningService,
            { provide: GameService, useValue: gameServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: BsModalService, useValue: bsModalServiceStub }, SystemErrorService,
            { provide: ReportsService, useValue: reportServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(GameStatusComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      gameService = fixture.debugElement.injector.get(GameService);
      modalService = fixture.debugElement.injector.get(BsModalService);
      reportsService = fixture.debugElement.injector.get(ReportsService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should be able to get data from previous steps', () => {
      gameServiceStub.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      expect(component.selectGame.game).toBe(getMockSelectGame().game);
      expect(component.selectedNumbers.DrawNumber.drawNumber).toBe(getMockSelectNumbers().DrawNumber.drawNumber);
      expect(component.selectGameFor.yourReference).toBe(getMockSelectGameForVm().yourReference);
      expect(component.successful).toBe(false);
   });

   it('should redirect to dashboard on Go to overview', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      preFillServiceStub.activeData.isReplay = false;
      component.navigateToDashboard();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   }));

   it('should redirect to history list on Go to history', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      preFillServiceStub.activeData.isReplay = true;
      preFillServiceStub.preFillReplayData.isViewMore = true;
      component.goToHistory();
      tick();
      const url = spy.calls.first().args[0];
      expect(url).toBe('game/lotto/history');
   }));

   it('should contain new payment', () => {
      gameServiceStub.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      getMockGameDetail().transactionID = '121212';
      expect(component.newPurchase).toBeDefined();
   });

   it('should defined heading ', () => {
      expect(component.heading).toBeDefined();
   });

   it('should defined heading ', () => {
      expect(component.successful).toBeDefined();
   });

   it('should redirect to game on new payment', fakeAsync(() => {
      const spy = spyOn(router, 'navigate');
      component.newPurchase();
      tick();
      const url = spy.calls.first().args[0];
      expect(url[0]).toBe(`/game`);
   }));
   it('should redirect to purchase if no purchase details found',
      inject([Injector], (injector: Injector) => {
         const spy = spyOn(router, 'navigateByUrl');
         gameService.isPurchaseStatusNavigationAllowed = jasmine.createSpy('isPurchaseStatusNavigationAllowed').and.returnValue(false);
         const document: Document = null;
         const reportService: ReportsService = null;
         preFillServiceStub.activeData.isReplay = false;
         const comp = new GameStatusComponent(gameService, router, document, modalService, reportService, preFillServiceStub,
            injector, null);
         comp.ngOnInit();
         const url = spy.calls.first().args[0];
         expect(url).toBe('/game');
      }));

   it('should set successful on init', () => {
      expect(component.successful).toBeDefined();
   });

   it('should set successful to true on payment successful', fakeAsync(() => {
      gameServiceStub.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      getMockGameDetail().transactionID = '111212121';
      component.ngOnInit();
      expect(component.successful).toBe(false);
   }));
   it('should set successful to true on payment successful', fakeAsync(() => {
      const gameDetailsInfo = getMockGameDetail();
      gameDetailsInfo.transactionID = '12334324';
      gameService.getPurchaseStatus = jasmine.createSpy('getPurchaseStatus').and.returnValue(true);
      gameService.getGameDetails = jasmine.createSpy('getGameDetails').and.returnValue(gameDetailsInfo);
      component.ngOnInit();
      expect(component.successful).toBe(true);
   }));

   it('should set successful to false if payment not-successful', fakeAsync(() => {
      const gameDetailsInfo = getMockGameDetail();
      gameDetailsInfo.transactionID = '';
      gameService.getGameDetails = jasmine.createSpy('getGameDetails').and.returnValue(gameDetailsInfo);
      component.ngOnInit();
      expect(component.successful).toBe(false);
   }));

   it('should set increased chances according to the logic', fakeAsync(() => {
      const mockSelectGame = getMockSelectGame();
      const mockSelectNumbers = getMockSelectNumbers();
      mockSelectGame.game = Constants.VariableValues.gameTypes.PWB.code;
      mockSelectNumbers.IsLottoPlus = true;
      mockSelectNumbers.IsLottoPlusTwo = false;
      gameService.getSelectGameVm = jasmine.createSpy('getSelectGameVm').and.returnValue(<ISelectGameVm>mockSelectGame),
         gameService.getSelectNumbersVm = jasmine.createSpy('getSelectNumbersVm').and.returnValue(<ISelectNumbersVm>mockSelectNumbers);
      component.ngOnInit();
      expect(component.increasedChances).toBe(Constants.labels.lottoLabels.IsPowerBallPlus);

      mockSelectGame.game = Constants.VariableValues.gameTypes.PWB.code;
      mockSelectNumbers.IsLottoPlus = false;
      mockSelectNumbers.IsLottoPlusTwo = false;
      gameService.getSelectGameVm = jasmine.createSpy('getSelectGameVm').and.returnValue(<ISelectGameVm>mockSelectGame),
         gameService.getSelectNumbersVm = jasmine.createSpy('getSelectNumbersVm').and.returnValue(<ISelectNumbersVm>mockSelectNumbers);
      component.ngOnInit();
      expect(component.increasedChances).toBe('');

      mockSelectGame.game = Constants.VariableValues.gameTypes.LOT.code;
      mockSelectNumbers.IsLottoPlus = true;
      mockSelectNumbers.IsLottoPlusTwo = false;
      gameService.getSelectGameVm = jasmine.createSpy('getSelectGameVm').and.returnValue(<ISelectGameVm>mockSelectGame),
         gameService.getSelectNumbersVm = jasmine.createSpy('getSelectNumbersVm').and.returnValue(<ISelectNumbersVm>mockSelectNumbers);
      component.ngOnInit();
      expect(component.increasedChances).toBe(Constants.labels.lottoLabels.IsLottoPlusOne);

      mockSelectGame.game = Constants.VariableValues.gameTypes.LOT.code;
      mockSelectNumbers.IsLottoPlus = true;
      mockSelectNumbers.IsLottoPlusTwo = true;
      gameService.getSelectGameVm = jasmine.createSpy('getSelectGameVm').and.returnValue(<ISelectGameVm>mockSelectGame),
         gameService.getSelectNumbersVm = jasmine.createSpy('getSelectNumbersVm').and.returnValue(<ISelectNumbersVm>mockSelectNumbers);
      component.ngOnInit();
      expect(component.increasedChances).toBe(
         `${Constants.labels.lottoLabels.IsLottoPlusOne} and ${Constants.labels.lottoLabels.IsLottoPlusTwo}`);

      mockSelectGame.game = Constants.VariableValues.gameTypes.LOT.code;
      mockSelectNumbers.IsLottoPlus = false;
      mockSelectNumbers.IsLottoPlusTwo = false;
      gameServiceStub.getSelectGameVm = jasmine.createSpy('getSelectGameVm').and.returnValue(<ISelectGameVm>mockSelectGame),
         gameServiceStub.getSelectNumbersVm = jasmine.createSpy('getSelectNumbersVm').and.returnValue(<ISelectNumbersVm>mockSelectNumbers);
      component.ngOnInit();
      expect(component.increasedChances).toBe('');

   }));
   it('should load successful purchase status on successful purchase retry', () => {
      component.successful = false;
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchase;
      });
      component.retryPayment();
      expect(component.successful).toBe(false);
   });
   it('should load unsuccessful purchase status and didnot disable retry button if isPurchaseStatusValid return false', () => {
      component.successful = false;
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(false);
      component.retryPayment();
      expect(component.successful).toBe(false);
      expect(component.disableRetryButton).toBe(false);
   });
   it('should show unsuccessful status and didnot disable try again button if makepurchase fails in first call',
      () => {
         component.successful = false;
         gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
         gameService.makePurchase = jasmine.createSpy('makePurchase').and.returnValue(Observable.create(observer => {
            observer.error(new Error('error'));
            observer.complete();
         }));
         component.retryPayment();
         expect(component.successful).toBe(false);
         expect(component.disableRetryButton).toBe(false);
      });
   it('should load unsuccessful purchase status and didnot disable retry button if make makePurchase fails second call', () => {
      component.successful = false;
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         if (validate) {
            return returnValueMakePurchase;
         } else {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         }
      });
      component.retryPayment();
      expect(component.successful).toBe(false);
      expect(component.disableRetryButton).toBe(true);
   });

   it('should load unsuccessful purchase status when isPurchaseStatusValid second call fails', () => {
      component.successful = false;
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         if (!validate) {
            gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(false);
         }
         return returnValueMakePurchase;
      });
      component.retryPayment();
      expect(component.successful).toBe(false);
      expect(component.disableRetryButton).toBe(false);
   });

   it('should retry the purchase upto 3 times on payment failure', fakeAsync(() => {
      component.successful = false;
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(false);
      component.retryPayment();
      expect(component.successful).toBe(false);
      component.retryPayment();
      expect(component.successful).toBe(false);
      component.retryPayment();
      expect(component.successful).toBe(false);
      component.retryPayment();
      expect(component.disableRetryButton).toBe(true);
   }));

   it('should handle time out overlay button click', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.hideTimeOutOverlay(Constants.VariableValues.gameTypes.PWB.code);
      tick();
      const url = spy.calls.first().args[0];
      expect(String(url)).toBe('/game?game=PWB');
   }));
   it('should handle time out overlay button click', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.hideTimeOutOverlay(null);
      tick();
      const url = spy.calls.first().args[0];
      expect(String(url)).toBe(Constants.routeUrls.dashboard);
   }));

   it('should handle time out overlay button click', fakeAsync(() => {
      gameService.checkGameTimeOut = jasmine.createSpy('checkGameTimeOut').and.returnValue(true);
      component.retryPayment();
      expect(component.gameTimeOut).toBe(true);
   }));

   it('should handle success status', () => {
      gameService.isPurchaseSucessful = false;
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseWithRefrenceTransaction;
      });
      this.transferRetryTimes = 1;
      component.retryPayment();
      expect(gameService.isPurchaseSucessful).toBe(true);
   });
   it('should handle pending status', () => {
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseWithPendingStatus;
      });
      this.transferRetryTimes = 1;
      component.retryPayment();
      fixture.detectChanges();
      expect(gameService.isPurchaseSucessful).toBeUndefined();
   });
   it('should handle unknown status', () => {
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseUnknownStatus;
      });
      this.transferRetryTimes = 1;
      component.retryPayment();
      fixture.detectChanges();
      expect(gameService.getGameDetails().failureReason).toBe('status unknown');
   });
   it('should set on resendApproveDetails call', () => {
      component.bsModalRef = bsModalServiceStub.show();
      component.resendApproveDetails();
      fixture.detectChanges();
      expect(gameService.makePurchase).toHaveBeenCalled();
   });
   it('should Open method of Report service call on call of Print method', () => {
      reportsService.open = jasmine.createSpy('open');
      component.print();
      expect(reportsService.open).toHaveBeenCalled();
   });

});
