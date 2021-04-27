import { BsModalService, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { SelectGameModel } from './../select-game/select-game-model';
import { SelectNumbersModel } from './../select-numbers/select-numbers-model';
import { SelectGameForModel } from './../select-game-for/select-game-for.model';
import { SelectGameReviewModel } from './select-game-review.model';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from './../../../test-util';
import { Constants } from './../../../core/utils/constants';
import { SelectGameReviewComponent } from './select-game-review.component';
import { GameService } from './../game.service';

import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { MobileNumberMaskPipe } from '../../../shared/pipes/mobile-number-mask.pipe';
import { IGameData } from './../../../core/services/models';
import { ISelectGameVm, ISelectNumbersVm, ISelectGameForVm, GameSteps } from './../models';
import { ColoredOverlayComponent } from '../../../shared/overlays/colored-overlay/overlay.component';
import { WorkFlowComponent } from '../../../shared/components/work-flow/work-flow.component';
import { SystemErrorComponent } from '../../../shared/components/system-services/system-services.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { PreFillService } from '../../../core/services/preFill.service';

const routerTestingParam = [
   { path: 'dashboard', component: SelectGameReviewComponent },
   { path: 'game/status', component: SelectGameReviewComponent }
];
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
const mockShow = {
   subscribe: jasmine.createSpy('show content').and.returnValue(Observable.of(true))
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

describe('SelectGameReviewComponent', () => {
   let component: SelectGameReviewComponent;
   let fixture: ComponentFixture<SelectGameReviewComponent>;
   let gameService: GameService;
   let router: Router;
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
   const returnValueMakePurchaseNoTransaction = Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'ABC',
                  result: 'FV01',
                  status: 'FAILURE',
                  reason: ''
               }
            ]
         }
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
   function getMoctSelectGameForVm() {
      return {
         yourReference: 'Lotto Super',
         notificationInput: '929329392932',
         notification: 'SMS'
      };
   }
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
   const WorkFlowComponentStub = {
      onStepClick: jasmine.createSpy('onStepClick'),
   };
   const gameServiceStub = {
      checkGameTimeOuts: () => () => true,
      gamesDayChartObserver: new BehaviorSubject(null),
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
      resetAllVm: jasmine.createSpy('checkGameTimeOut'),
      checkGameTimeOut: jasmine.createSpy('checkGameTimeOut').and.returnValue(false),
      saveSelectGameVm: jasmine.createSpy('saveSelectGameVm'),
      getSelectGameVm: jasmine.createSpy('getSelectGameVm').and.returnValue(<ISelectGameVm>getMockSelectGame()),
      getSelectNumbersVm: jasmine.createSpy('getSelectNumbersVm').and.returnValue(<ISelectNumbersVm>getMockSelectNumbers()),
      makePurchase: jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchase;
      }),
      getSelectGameForVm: jasmine.createSpy('getSelectGameForVm').and.returnValue(<ISelectGameForVm>getMoctSelectGameForVm()),
      isPurchaseStatusValid: jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true),
      updateTransactionID: jasmine.createSpy('updateTransactionID'),
      getGameDetails: jasmine.createSpy('getGameDetails').and.returnValue(<IGameData>getMockGameDetail()),
      refreshAccounts: function () { },
      raiseSystemError: jasmine.createSpy('raiseSystemError').and.callFake((isCallback: boolean) => { }),
      updateexecEngineRef: jasmine.createSpy('updateexecEngineRef')
   };

   const preFillServiceStub = {};

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            SelectGameReviewComponent,
            AmountTransformPipe,
            ColoredOverlayComponent,
            MobileNumberMaskPipe
         ],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [SystemErrorService,
            { provide: BsModalService, useValue: bsModalServiceStub }, ComponentLoaderFactory, PositioningService,
            { provide: GameService, useValue: gameServiceStub }, { provide: WorkFlowComponent, useValue: WorkFlowComponentStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SelectGameReviewComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      gameService = fixture.debugElement.injector.get(GameService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should be able to get data from previous steps', () => {
      expect(component.selectGame.game).toBe(getMockSelectGame().game);
      expect(component.selectNumbers.DrawNumber.drawNumber).toBe(getMockSelectNumbers().DrawNumber.drawNumber);
      expect(component.selectGameFor.yourReference).toBe(getMoctSelectGameForVm().yourReference);
   });

   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should contain step handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should load status component on every purchase failure ', () => {
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(false);
      component.nextClick(4);

      gameService.makePurchase = jasmine.createSpy('makePurchase').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(4);
      expect(component.isButtonLoader.emit).toHaveBeenCalled();
   });

   it('should load status component on every purchase failure ', () => {
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = false) {
         if (validate) {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         } else {
            return returnValueMakePurchase;
         }
      });
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(4);
      expect(component.isButtonLoader.emit).toHaveBeenCalled();
   });
   it('should load status component on every step failure ', () => {
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         if (validate) {
            return returnValueMakePurchase;
         } else {
            gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(false);
            return returnValueMakePurchase;
         }
      });
      const spy = spyOn(router, 'navigateByUrl');
      component.nextClick(4);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/game/status');
   });

   it('should prevent purchase when game time out', () => {
      gameServiceStub.checkGameTimeOut.and.returnValue(true);
      expect(component.nextClick(4)).toBe(true);
   });

   it('should handle time out overlay button click', () => {
      component.hideTimeOutOverlay(Constants.VariableValues.gameTypes.PWB.code);
      expect(gameServiceStub.saveSelectGameVm).toHaveBeenCalledWith({
         game: Constants.VariableValues.gameTypes.PWB.code,
         method: Constants.VariableValues.playMethods.quickPick.code
      });
      component.hideTimeOutOverlay(Constants.VariableValues.gameTypes.LOT.code);
      expect(gameServiceStub.saveSelectGameVm).toHaveBeenCalledWith({
         game: Constants.VariableValues.gameTypes.LOT.code,
         method: Constants.VariableValues.playMethods.quickPick.code
      });
      component.hideTimeOutOverlay('');
   });
   it('should set increased chances according to the logic', () => {
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
   });
   it('should handle success status', () => {
      gameService.isPurchaseSucessful = false;
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseWithRefrenceTransaction;
      });
      this.transferRetryTimes = 1;
      gameServiceStub.checkGameTimeOut.and.returnValue(false);
      component.nextClick(4);
      expect(gameService.isPurchaseSucessful).toBe(true);
   });
   it('should handle pending status', () => {
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseWithPendingStatus;
      });
      this.transferRetryTimes = 1;
      gameServiceStub.checkGameTimeOut.and.returnValue(false);
      component.nextClick(4);
      fixture.detectChanges();
      expect(gameService.isPurchaseSucessful).toBeFalsy();
   });
   it('should handle unknown status', () => {
      gameService.isPurchaseStatusValid = jasmine.createSpy('isPurchaseStatusValid').and.returnValue(true);
      gameService.makePurchase = jasmine.createSpy('makePurchase').and.callFake(function (validate = true) {
         return returnValueMakePurchaseUnknownStatus;
      });
      this.transferRetryTimes = 1;
      gameServiceStub.checkGameTimeOut.and.returnValue(false);
      component.nextClick(4);
      fixture.detectChanges();
      expect(gameService.getGameDetails().failureReason).toBe('status unknown');
   });
   it('should set on resendApproveDetails call', () => {
      component.bsModalRef = bsModalServiceStub.show();
      component.resendApproveDetails();
      fixture.detectChanges();
      expect(gameService.makePurchase).toHaveBeenCalled();
   });
   it('should pushballs in case of Replay for lotto', () => {
      component.isReplay = true;
      component.pushSelectedBallsForReplay();
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.selectedBalls.length).toBe(6);
   });

   it('should pushballs in case of Replay for powerball', () => {
      component.isReplay = true;
      component.selectGame.game = 'PWB';
      component.pushSelectedBallsForReplay();
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.selectedBalls.length).toBe(6);
   });
});
