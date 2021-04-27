import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../../test-util';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { GameService } from '../game.service';
import { SelectNumbersComponent } from './select-numbers.component';
import { Constants } from './../../../core/utils/constants';
import { ISelectGameVm } from './../models';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { IAccountDetail, IClientDetails } from '../../../core/services/models';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GaTrackingService } from '../../../core/services/ga.service';
import { PreFillService } from '../../../core/services/preFill.service';

let isQuickPick = true;
let isPowerBall = false;

function getMockSelectedGame(): ISelectGameVm {
   return {
      game: Constants.VariableValues.gameTypes.LOT.code,
      method: Constants.VariableValues.playMethods.quickPick.code
   };
}
function getMockSelectedGameOther(): ISelectGameVm {
   return {
      game: Constants.VariableValues.gameTypes.LOT.code,
      method: Constants.VariableValues.playMethods.pick.code
   };
}
function getMockSelectedGamePowerBall(): ISelectGameVm {
   return {
      game: Constants.VariableValues.gameTypes.PWB.code,
      method: Constants.VariableValues.playMethods.pick.code
   };
}
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

const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   paymentWorkflowSteps: {
      selectGame: {
         isDirty: false
      },
      selectNumbers: {
         isDirty: false
      },
      selectGameFor: {
         isDirty: false
      },
   },
   lottoLimitDataObserver: new BehaviorSubject<number>(null),
   saveSelectNumbersVm: jasmine.createSpy('getPayForVm'),
   getSelectNumbersVm: jasmine.createSpy('getPayForVm').and.returnValue(Observable.of({
      game: Constants.VariableValues.gameTypes.LOT.code,
      method: Constants.VariableValues.playMethods.pick.code
   })),
   accountsDataObserver: new BehaviorSubject<IAccountDetail[]>(getMockGameAccounts()),
   getGameMetaData: jasmine.createSpy('getGameMetaData').and.returnValue(Observable.of([{
      boardPrice: 5,
      gameType: 'Lotto',
      gameTypeName: 'Lotto',
      lottoPlusPrice: 2.5,
      lottoPlusTwoPrice: 2.5,
      maxNumberOfBoardsAllowed: 20,
      maxNumberOfDrawsAllowed: 10,
      minimumNumberOfBoardsAllowed: 2,
      minimumNumberOfDrawsAllowed: 1,
      lottoBallMatrixMin: 1,
      lottoBallMatrixMax: 52,
      game: Constants.VariableValues.gameTypes.LOT.code
   },
   {
      boardPrice: 5,
      gameType: 'powerball',
      gameTypeName: 'powerball',
      lottoPlusPrice: 2.5,
      maxNumberOfBoardsAllowed: 20,
      maxNumberOfDrawsAllowed: 10,
      minimumNumberOfBoardsAllowed: 2,
      minimumNumberOfDrawsAllowed: 1,
      powerBallMatrixMin: 1,
      powerBallMatrixMax: 45,
      powerBallBonusBallMatrixMin: 1,
      powerBallBonusBallMatrixMax: 20,
      game: Constants.VariableValues.gameTypes.PWB.code
   }])),
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of(
      getMockGameAccounts()
   )),
   getSelectGameVm: jasmine.createSpy('getSelectGameVm').and.callFake(function () {
      if (isQuickPick) {
         isQuickPick = false;
         return getMockSelectedGameOther();
      } else if (isPowerBall) {
         isPowerBall = false;
         return getMockSelectedGamePowerBall();
      } else {
         isQuickPick = true;
         return getMockSelectedGame();
      }
   }),
   getGameDraws: jasmine.createSpy('getGameDraws').and.returnValue(Observable.of([
      {
         drawDate: new Date(),
         drawName: 'Lotto',
         gameName: 'Lotto',
         game: 'Lotto',
         drawNumber: 1740,
         nextDrawDate: new Date()
      },
      {
         drawDate: new Date(),
         drawName: 'powerball',
         gameName: 'powerball',
         game: 'powerball',
         drawNumber: 1740,
         nextDrawDate: new Date()
      }]
   )),
   resetSelectNumberVm: jasmine.createSpy('resetSelectNumberVm').and.returnValue(Observable.of({
      game: '',
      method: Constants.VariableValues.playMethods.pick.code
   })),
   saveSelectGameVm: jasmine.createSpy('saveSelectGameVm').and.returnValue(null),
   gamesDayChartObserver: new BehaviorSubject(null),

};
const clientDetails: IClientDetails = {
   FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
   EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
};
const clientProfileDetailsServiceStub = {
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const preFillServiceStub = new PreFillService();

const dataStub = {
   isReplay: true,
   isEdit: true
};

preFillServiceStub.activeData = dataStub;

preFillServiceStub.preFillReplayData = {
   BoardDetails: [{
      BoardNumber: 'A',
      NumbersPlayed: '3 4 6 7 8 5',
      isValid: true
   }],
   IsLottoPlus: false,
   IsLottoPlusTwo: false,
   isLottoPlusTwo: true,
   BoardsPlayed: 2,
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
      drawName: 'Lotto',
      gameName: 'Lotto',
      game: 'Lotto',
      drawNumber: 177,
      nextDrawDate: new Date()
   },
   drawDate: new Date(),
   totalCost: 30,
   fromAccount: getMockGameAccounts()[0],
   isValid: true,
   isReplay: true,
   game: Constants.VariableValues.gameTypes.LOT.code,
   method: Constants.VariableValues.playMethods.quickPick.code,
   gameType: Constants.VariableValues.gameMethod.a
};

describe('SelectNumbersComponent', () => {
   let component: SelectNumbersComponent;
   let fixture: ComponentFixture<SelectNumbersComponent>;
   let router: Router;
   let gameService: GameService;
   let preFillService: PreFillService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SelectNumbersComponent, SkeletonLoaderPipe, AmountTransformPipe],
         imports: [FormsModule, RouterTestingModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: GameService, useValue: gameServiceStub },
         { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: PreFillService, useValue: preFillServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SelectNumbersComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      component.isAccountsLoaded = true;
      component.isDrawsLoaded = true;
      component.isMetadtaLoaded = true;
      gameService = TestBed.get(GameService);
      preFillService = TestBed.get(PreFillService);
      preFillService.activeData = dataStub;
      preFillService.preFillReplayData = preFillServiceStub.preFillReplayData;
      gameService.lottoLimitDataObserver.next(10);
      fixture.detectChanges();
      component.skeletonMode = false;
      component.vm.FromAccount.accountNumber = '1728008182';
      component.vm.FromAccount.accountType = 'CA';
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should validate component', () => {
      component.vm.BoardDetails = [{
         BoardNumber: 'A',
         NumbersPlayed: '3 4 6 7 8 5',
         isValid: true
      }];
      preFillServiceStub.preFillReplayData.gameType = Constants.VariableValues.gameMethod.p;
      component.validate();
      fixture.detectChanges();
      component.isComponentValid.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });
   it('should validate component', () => {
      component.vm.BoardDetails = undefined;
      component.validate();
      fixture.detectChanges();
      component.isComponentValid.subscribe((data) => {
         expect(data).toBe(true);
      });
   });

   it('should add board when onAddBoard called', () => {
      component.metaData.maxNumberOfBoardsAllowed = 20;
      component.setDefaultBoards(2);
      component.setDefaultBoards(2);
      component.isAllBoardValid = true;
      component.isQuickPick = true;
      const button = fixture.debugElement.nativeElement.querySelector('div.add-circle');
      button.click();
      fixture.detectChanges();
      expect(component.vm.BoardsPlayed).toBe(3);
   });
   it('should handle maximun board limit', () => {
      component.metaData.maxNumberOfBoardsAllowed = 5;
      component.setDefaultBoards(5);
      component.isAllBoardValid = true;
      component.isQuickPick = true;
      const button = fixture.debugElement.nativeElement.querySelector('div.add-circle');
      button.click();
      fixture.detectChanges();
      expect(component.maxBoardLimit).toBe(true);
   });
   it('should remove board when onRemoveBoard called', () => {
      component.setDefaultBoards(4);
      let prev_length = component.vm.BoardDetails.length;
      component.onRemoveBoard(3);
      fixture.detectChanges();
      expect(component.vm.BoardsPlayed).toBe(prev_length - 1);
      component.setDefaultBoards(5);
      component.setDefaultBoards(5);
      prev_length = component.vm.BoardDetails.length;
      component.onRemoveBoard(3);
      fixture.detectChanges();
      expect(component.vm.BoardsPlayed).toBe(prev_length - 1);
   });

   it('should call calculate total on Draw change', () => {
      component.metaData.boardPrice = 5;
      component.setDefaultBoards(4);
      component.vm.IsLottoPlus = false;
      component.vm.IsLottoPlusTwo = false;
      component.onDrawChange('', 3);
      fixture.detectChanges();
      expect(component.vm.TotalCost).toBe(60);
   });

   it('should call calculate total on lotto plus change', () => {
      component.setDefaultBoards(4);
      component.metaData.boardPrice = 5;
      component.vm.IsLottoPlus = true;
      component.vm.IsLottoPlusTwo = false;
      component.vm.DrawsPlayed = 1;
      component.onLottoPlusChange();
      fixture.detectChanges();
      expect(component.vm.TotalCost).toBe(30);
   });

   it('should call calculate total on lotto plus twp change', () => {
      isQuickPick = false;
      component.setDefaultBoards(4);
      component.setDefaultBoards(4);
      component.metaData.boardPrice = 5;
      component.vm.IsLottoPlus = false;
      component.vm.IsLottoPlusTwo = true;
      component.vm.DrawsPlayed = 1;
      component.onLottoPlusTwoChange();
      fixture.detectChanges();
      expect(component.vm.TotalCost).toBe(30);
   });
   it('should chnage account on account selection', () => {
      component.onFromAccountSelection(component.fromAccounts[0]);
      expect(component.vm.FromAccount).toEqual(component.fromAccounts[0]);
   });
   it('should save the vm on next click', () => {
      component.vm = {
         BoardDetails: [{
            BoardNumber: 'A',
            NumbersPlayed: '3 4 6 7 8 5',
            isValid: true
         }],
         IsLottoPlus: false,
         IsLottoPlusTwo: false,
         BoardsPlayed: 2,
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
         isValid: true,
         game: Constants.VariableValues.gameTypes.LOT.code,
         method: Constants.VariableValues.playMethods.pick.code
      };
      component.nextClick(2);
      expect(gameService.saveSelectNumbersVm).toHaveBeenCalled();
   });
   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('set validate to true if  lotto number is valid ', () => {
      gameService.lottoLimitDataObserver.next(50);
      component.vm.BoardDetails = [{
         BoardNumber: 'A',
         NumbersPlayed: '',
         isValid: false
      },
      {
         BoardNumber: 'B',
         NumbersPlayed: '3 4 6 7 8 5',
         isValid: true
      }];
      const data = {
         isValid: true,
         value: '3 4 6 7 8 5'
      };
      component.lottoValueChange(data, 'A');
      expect(component.vm.isValid).toBe(true);
   });
   it('validate should be  false if  lotto number is not valid ', () => {
      component.vm.TotalCost = 1000;
      component.vm.FromAccount = getMockGameAccounts()[0];
      component.vm.BoardDetails = [{
         BoardNumber: 'A',
         NumbersPlayed: '3 4 6 7 8 5',
         isValid: true
      },
      {
         BoardNumber: 'B',
         NumbersPlayed: '3 4 6 7 8 5',
         isValid: true
      }];
      const data = {
         isValid: false,
         value: '3 4 6 7 8'
      };
      component.lottoValueChange(data, 'A');
      expect(component.vm.isValid).toBe(true);
   });
   it('should not validate if total amount greter than balance ', () => {
      component.vm.TotalCost = 4000;
      component.vm.FromAccount = getMockGameAccounts()[0];
      component.validate();
      expect(component.vm.isValid).toBe(true);
   });

   it('should change the label and not disable the dropdown if pick your numbers is selected from first step', () => {
      component.setDefaultBoards(2);
      expect(component.isQuickPick).toBe(false);
   });

   it('should reset the vm if game type is different after edit in step one', () => {
      isPowerBall = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.vm.game).toBe(Constants.VariableValues.gameTypes.PWB.code);
      });
   });

   it('should deselect LottoPlusTwo if LottoPlus is deselected', () => {
      component.vm.IsLottoPlusTwo = true;
      component.vm.IsLottoPlus = false;
      component.onLottoPlusChange();
      expect(component.vm.IsLottoPlusTwo).toBe(false);
   });
   it('should initialize the component with service input', () => {
      component.isReplay = true;
      expect(component.lottoPayLimit).toBe(10);
   });
   it('should be able to select number of boards for quick pick', () => {
      component.vm.IsLottoPlus = true;
      component.OnQuickPickBoardSelected('', 2);
      expect(component.vm.TotalCost).toBe(15);
   });
   it('shoould change board details if quick pick', () => {
      component.vm.method = 'a';
      component.ngOnInit();
      expect(component.isQuickPick).toBe(true);
   });
   it('should set dirty if board close', () => {
      component.onBoardClose('A');
      expect(component.isAnyBoardDirty).toBe(true);
   });
   it('should set current open board index on open event', () => {
      component.onBoardOpen('A');
      expect(component.openBoardIndex).toBe(0);
   });
   it('should open next invalid board on close event', () => {
      component.vm.BoardDetails = [{
         BoardNumber: 'A',
         NumbersPlayed: '',
         isValid: true
      },
      {
         BoardNumber: 'B',
         NumbersPlayed: '3 4 6 7 8 5',
         isValid: false
      }];
      component.onBoardClose('A');
      expect(component.openBoardIndex).toBe(1);
   });
   it('should set account from if navigated from dashboard', () => {
      component.vm.accountNumberFromDashboard = '1';
      component.vm.FromAccount = undefined;
      component.setAccountFrom();
      expect(component.vm.FromAccount.itemAccountId).toBe(component.vm.accountNumberFromDashboard);
   });

   it('should set boardDetails empty', () => {
      component.method = 'a';
      component.isReplay = false;
      component.setDefaultBoards(5);
      expect(component.vm.BoardDetails.length).toBe(0);
   });

});
