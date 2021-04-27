import { NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs/Subject';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../../test-util';
import { LandingComponent } from './landing.component';
import { PreFillService } from '../../../core/services/preFill.service';
import { GameService } from '../game.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { Observable } from 'rxjs/Observable';
import { SelectNumbersModel } from '../select-numbers/select-numbers-model';
import { LoaderService } from '../../../core/services/loader.service';
import { Constants } from '../../../core/utils/constants';
import { IAccountDetail } from '../../../core/services/models';

const responseMock = {
   FullNames: 'ruth test',
   BirthDate: '1947-09-21T22:00:00Z'
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

const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   gameWorkflowSteps: {
      selectNumbers: {
         model: new SelectNumbersModel(),
      }
   },
   initializeGameWorkflow: jasmine.createSpy('initializeGameWorkflow'),
   getStepSummary: jasmine.createSpy('getStepSummary'),
   nextClickEmitter: new EventEmitter<number>(),
   getActiveAccounts: jasmine.createSpy('checkDirtySteps').and.returnValue(Observable.of([])),
   checkDirtySteps: jasmine.createSpy('checkDirtySteps').and.returnValue(true),
   accountsDataObserver: new BehaviorSubject(null),
};
const clientDetailsObserver = new Subject();
const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard', component: testComponent },
];

describe('LandingComponent game', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;
   let router: Router;
   let preFillService: PreFillService;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [LandingComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: GameService, useValue: gameServiceStub },
         { provide: PreFillService, useValue: preFillServiceStub }, {
            provide: ClientProfileDetailsService, useValue: {
               clientDetailsObserver: clientDetailsObserver
            }
         },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountnumber: 1 }) } },
            LoaderService
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      router = TestBed.get(Router);
      preFillService = TestBed.get(PreFillService);
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should check initialization of landing component', () => {
      gameServiceStub.getActiveAccounts.and.returnValue(Observable.of([{ accountType: 'CA' }]));
      component.ngOnInit();
      expect(component.steps).toBeDefined();
   });
   it('should check initialization of landing component', () => {
      const val = 1;
      gameServiceStub.nextClickEmitter.subscribe(data => {
         expect(data).toBe(val);
      });
      component.nextClick(val);
   });

   it('should listen to Client observer', () => {
      const spy = spyOn(router, 'navigateByUrl');
      clientDetailsObserver.next(null);
      clientDetailsObserver.next(responseMock);
      responseMock.BirthDate = '2015-09-21T22:00:00Z';
      clientDetailsObserver.next(responseMock);
      expect(spy).toHaveBeenCalled();
   });

   it('should have canDeactivate inherited', () => {
      expect(component.canDeactivate).toBeDefined();
   });

   it('should have call canDeactivate ', () => {
      expect(component.canDeactivate()).toBeFalsy();
   });

   it('should set to isReplay', () => {
      const dataReplayStub = {
         isReplay: false,
         isEdit: true,
         drawName: 'LOTTO'
      };
      preFillService.activeData = dataReplayStub;
      component.ngOnInit();
      expect(component.activeStep).toBe(1);
   });

   it('should have set for powerball ', () => {
      const dataReplayStub = {
         isReplay: true,
         isEdit: true,
         drawName: 'LOTTO'
      };
      preFillService.activeData = dataReplayStub;
      preFillService.preFillReplayData = {
         BoardDetails: [{
            BoardNumber: 'A',
            NumbersPlayed: '3 4 6 7 8 5',
            isValid: true
         }],
         isLottoPlus: false,
         isLottoPlusTwo: false,
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
            drawName: 'Powerball',
            gameName: 'Powerball',
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
      const summaryData = {
         title: 'edit',
         isNavigated: true,
         sequenceId: 1
      };
      const editData = {
         text : 'edit'
      };

      const buttonData = {
         next: editData,
         edit: editData
      };

      const stepData = {
         summary: summaryData,
         buttons: buttonData,
         component: LandingComponent

      };
      component.steps[0] = stepData;
      component.ngOnInit();
      expect(component.gameName).toBe('LOTTO');
   });

});
