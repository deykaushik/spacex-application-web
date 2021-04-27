import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../../test-util';
import { LottoNumberPickerComponent } from './lotto-number-picker.component';
import { Constants } from './../../../core/utils/constants';
import { CommonUtility } from './../../../core/utils/common';
import { GameService } from '../../../buy/game/game.service';

import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { PreFillService } from '../../../core/services/preFill.service';
import { Router } from '@angular/router';

const gameServiceStub = {
   checkGameTimeOuts: () => () => true,
   getSelectNumbersVm: jasmine.createSpy('getSelectNumbersVm').and.returnValue(null)

};

const preFillServiceStub = new PreFillService();

preFillServiceStub.activeData = {};

describe('LottoNumberPickerComponent', () => {
   function setControlData(lottoComponent: LottoNumberPickerComponent, isPowerBall) {
      if (isPowerBall) {
         lottoComponent.openLottoPickerOnLoad = true;
         lottoComponent.isPowerBall = true;
         lottoComponent.ballMatrixMin = 1;
         lottoComponent.ballMatrixMax = 45;
         lottoComponent.powerBallMatrixMin = 1;
         lottoComponent.powerBallMatrixMax = 20;
         lottoComponent.numbersToBePicked = 5;
         lottoComponent.powerBallsToBePicked = 1;
      } else {
         lottoComponent.openLottoPickerOnLoad = true;
         lottoComponent.isPowerBall = false;
         lottoComponent.ballMatrixMin = 1;
         lottoComponent.ballMatrixMax = 52;
         lottoComponent.numbersToBePicked = 6;
         lottoComponent.powerBallsToBePicked = 0;
      }
   }
   let component: LottoNumberPickerComponent;
   let router: Router;
   let fixture: ComponentFixture<LottoNumberPickerComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [LottoNumberPickerComponent],
         schemas: [NO_ERRORS_SCHEMA],

         providers: [
            { provide: GameService, useValue: gameServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub },
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LottoNumberPickerComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      setControlData(component, false);
      expect(component).toBeTruthy();
   });

   it('should check for selected lotto number', () => {
      setControlData(component, false);
      component.selectedLotteryNumbersString = '10 15 25 36 42 51';
      component.openLottoPickerOnLoad = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.selectedLotteryNumbersString.split(' ').forEach(element => {
            expect(component.selectedLotteryNumbers).toContain(parseInt(element, 10));
         });
         expect(component.selectedLotteryNumbers).not.toContain(12);
      });
   });

   it('should check for selected lotto number for powerball', () => {
      setControlData(component, true);
      component.selectedLotteryNumbersString = '10 15 25 36 42 15';
      component.openLottoPickerOnLoad = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.selectedLotteryNumbersString.split(' ').forEach((element, index) => {
            if (index < component.numbersToBePicked) {
               expect(component.selectedLotteryNumbers).toContain(parseInt(element, 10));
            }
         });
         component.selectedLotteryNumbersString.split(' ').forEach((element, index) => {
            if (index > component.numbersToBePicked - 1) {
               expect(component.selectedPowerBallNumbers).toContain(parseInt(element, 10));
            }
         });
         expect(component.selectedLotteryNumbers).not.toContain(12);
         expect(component.selectedPowerBallNumbers).not.toContain(12);
      });
   });

   it('should set lottery dropdown dirty on open', () => {
      setControlData(component, false);
      component.onLotteryDropdownOpen();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isLotteryDropdownDirty).toBe(true);
      });
   });

   it('should return correct group for lottery numbers', () => {
      setControlData(component, false);
      expect(component.getLotteryNumberGroup(1)).toBe(1);
      expect(component.getLotteryNumberGroup(13)).toBe(1);

      expect(component.getLotteryNumberGroup(14)).toBe(2);
      expect(component.getLotteryNumberGroup(26)).toBe(2);

      expect(component.getLotteryNumberGroup(27)).toBe(3);
      expect(component.getLotteryNumberGroup(39)).toBe(3);

      expect(component.getLotteryNumberGroup(40)).toBe(4);
      expect(component.getLotteryNumberGroup(52)).toBe(4);

      expect(component.getLotteryNumberGroup(-1)).toBe(0);
   });

   it('should select a valid number', () => {
      setControlData(component, false);
      component.selectedLotteryNumbersString = '1 2 3 4 5';
      component.ngOnInit();
      component.valueChange.subscribe(response => {
         expect(response.isValid).toBe(true);
      });
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         const fakeSpan = document.createElement('SPAN');
         fakeSpan.classList.add('noCircle');
         fakeSpan.innerHTML = '10';
         fakeSpan.addEventListener('click', (event) => { component.onSelectNumber(event, false); });
         fakeSpan.click();
         expect(fakeSpan.classList.contains('group1')).toBe(true);
         expect(component.selectedLotteryNumbers).toContain(10);
      });
   });

   it('should select a valid number for powerball', () => {
      setControlData(component, true);
      component.selectedLotteryNumbersString = '1 2 3 4';
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         let fakeSpan = document.createElement('SPAN');
         fakeSpan.classList.add('noCircle');
         fakeSpan.innerHTML = '10';
         fakeSpan.addEventListener('click', (event) => { component.onSelectNumber(event, false); });
         fakeSpan.click();
         expect(fakeSpan.classList.contains(component.board1PowerBallClass)).toBe(true);
         expect(component.selectedLotteryNumbers).toContain(10);

         fakeSpan = document.createElement('SPAN');
         fakeSpan.classList.add('noCircle');
         fakeSpan.innerHTML = '10';
         fakeSpan.addEventListener('click', (event) => { component.onSelectNumber(event, true); });
         fakeSpan.click();
         expect(fakeSpan.classList.contains(component.board2PowerBallClass)).toBe(true);
         expect(component.selectedPowerBallNumbers).toContain(10);
      });
   });

   it('should deSelect a valid number', () => {
      setControlData(component, false);
      component.selectedLotteryNumbersString = '1 2 3 4 5 6';
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         const fakeSpan = document.createElement('SPAN');
         fakeSpan.classList.add('group1');
         fakeSpan.innerHTML = '1';
         fakeSpan.addEventListener('click', (event) => { component.onSelectNumber(event, false); });
         fakeSpan.click();
         expect(fakeSpan.classList.contains('group1')).toBe(false);
         expect(component.selectedLotteryNumbers).not.toContain(1);
      });
   });

   it('should handle select of a invalid number', () => {
      setControlData(component, false);
      const fakeSpan = document.createElement('SPAN');
      fakeSpan.classList.add('noCircle');
      fakeSpan.innerHTML = 'abc';
      fakeSpan.addEventListener('click', (event) => { component.onSelectNumber(event, false); });
      fakeSpan.click();
      expect(fakeSpan.classList.contains('noCircle')).toBe(true);
   });

   it('should not select more than 6 numbers', () => {
      setControlData(component, false);
      component.selectedLotteryNumbersString = '1 2 3 4 5 6';
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         const fakeSpan = document.createElement('SPAN');
         fakeSpan.classList.add('noCircle');
         fakeSpan.innerHTML = '1';
         fakeSpan.addEventListener('click', (event) => { component.onSelectNumber(event, false); });
         fakeSpan.click();
         expect(fakeSpan.classList.contains('noCircle')).toBe(true);
      });
   });

   it('should set default labels if not quick pick', () => {
      setControlData(component, false);
      expect(component.lottoLabel).toBe(CommonUtility.format(Constants.labels.lottoLabels.pickBallsMessage,
         component.numbersToBePicked === 6 ? '6' : '5'));
   });

   it('should set quick pick label if  quick pick', () => {
      setControlData(component, false);
      component.ngOnInit();
      expect(component.lottoLabel).toBe('Pick 6 numbers');
   });

   it('should check if board is complete for lotto', () => {
      setControlData(component, false);
      component.selectedLotteryNumbersString = '10 15 25 36 42 15';
      component.openLottoPickerOnLoad = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isBoardComplete()).toBe(true);
      });
   });

   it('should check if board is incomplete for lotto', () => {
      setControlData(component, false);
      component.selectedLotteryNumbersString = '10 15 25 36 42';
      component.openLottoPickerOnLoad = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isBoardComplete()).toBe(false);
      });
   });

   it('should check if board is complete for powerball', () => {
      setControlData(component, true);
      component.selectedLotteryNumbersString = '10 15 25 36 42 15';
      component.openLottoPickerOnLoad = true;
      component.isReplay = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isBoardComplete()).toBe(true);
      });
   });

   it('should check if board is incomplete for powerball', () => {
      setControlData(component, true);
      component.selectedLotteryNumbersString = '10 15 25 36 42';
      component.openLottoPickerOnLoad = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.isBoardComplete()).toBe(false);
      });
   });

   it('should empty ball class for non selected numbers', () => {
      setControlData(component, true);
      component.selectedLotteryNumbersString = '10 15 25 36 42';
      component.openLottoPickerOnLoad = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.getBallClass(1, false, true)).toBe('');
      });
   });

   it('should return correct error message if both boards are not complete in case of powerball', () => {
      setControlData(component, true);
      component.selectedLotteryNumbersString = '10 15 25 36';
      component.openLottoPickerOnLoad = true;
      component.ngOnInit();
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.setErrorMessage();
         expect(component.pickBallErrorMessage).toBe(component.lottoLabels.powerBallBothBoardsInvalid);
      });
   });
   it('should push balls with class in array', () => {
      const selectedBalls = component.pushBallsinArray();
      expect(selectedBalls.length).toBe(component.selectedLotteryNumbers.length + component.selectedPowerBallNumbers.length);
   });

   it('should give correct error message when less than 5 balls are picked in powerball', () => {
      setControlData(component, true);
      component.selectedLotteryNumbers = [10, 15, 25, 36];
      component.selectedPowerBallNumbers = [20];
      component.setErrorMessage();
      expect(component.pickBallErrorMessage).toBe(CommonUtility.format(component.lottoLabels.pickBallsError, 5));
   });
   it('should give correct error message when 5 lottery balls picked but none from powerball board', () => {
      setControlData(component, true);
      component.selectedLotteryNumbers = [10, 15, 25, 36, 37];
      component.selectedPowerBallNumbers = [];
      component.setErrorMessage();
      expect(component.pickBallErrorMessage).toBe(CommonUtility.format(component.lottoLabels.pickPowerBallError, 'one'));
   });

   it('should set the board dirty on ngchanges when openBoradonLoad is true', () => {
      component.ngOnChanges();
      component.openLottoPickerOnLoad = true;
      component.ngOnChanges();
      expect(component.isLotteryDropdownDirty).toBeTruthy();
   });

});
