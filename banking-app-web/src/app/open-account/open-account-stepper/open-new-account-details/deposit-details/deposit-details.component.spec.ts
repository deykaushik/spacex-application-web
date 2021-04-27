import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { OpenAccountService } from '../../../open-account.service';
import { DepositDetailsComponent } from './deposit-details.component';
import { IDepositAccount, IDeposit, IAccount } from '../../../../core/services/models';
import { AmountTransformPipe } from '../../../../shared/pipes/amount-transform.pipe';

const mockDepositDetails: IDepositAccount[] = [{
   investorNumber: '12345',
   Amount: 500,
   depositAccount: 'credit',
   Months: 7,
},
{
   investorNumber: '789123',
   Amount: 1000,
   depositAccount: 'Saving',
   Months: 12,
}];

const mockInvestor: IDepositAccount[] = [{
   investorNumber: '12345',
   Amount: 500,
   depositAccount: 'credit',
   Months: 7,
}];

const mockInterest: IDeposit[] = [{
   noticeDeposit: '32 Days',
   name: 'Just Invest',
   realtimerate: 7.7
}];

const accDetails: IAccount = {
   availableBalance: 700,
   nickname: 'jhon',
   accountNumber: 12345678
};

const accountServiceStub = {
   getAmountForOpenNewAccount: jasmine.createSpy('getAmountForOpenNewAccount').and.returnValue(1000),
   getMinimumEntryAmount: jasmine.createSpy('getMinimumEntryAmount').and.returnValue(500),
   getInvestor: jasmine.createSpy('getInvestor').and.returnValue(Observable.of(mockInvestor)),
   getInitialDeposit: jasmine.createSpy('getInitialDeposit').and.returnValue(Observable.of(mockInvestor)),
   getDepositDetails: jasmine.createSpy('getDepositDetails').and.returnValue(mockDepositDetails),
   setDepositDetails: jasmine.createSpy('setDepositDetails'),
   getInterestRate: jasmine.createSpy('getInterestRate').and.returnValue(Observable.of(mockInterest)),
   setRealTimeInterestRate: jasmine.createSpy('setRealTimeInterestRate')
};

describe('DepositDetailsComponent', () => {
   let component: DepositDetailsComponent;
   let fixture: ComponentFixture<DepositDetailsComponent>;
   let service: OpenAccountService;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [DepositDetailsComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [Renderer2, { provide: OpenAccountService, useValue: accountServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DepositDetailsComponent);
      component = fixture.componentInstance;
      component.productInfo = {
         name: 'Fixed Account',
         noticeDeposit: 'Y',
         period1: 1,
         period2: 60
      };
      service = fixture.debugElement.injector.get(OpenAccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be get investor number', () => {
      component.productInfo = {
         name: 'Fixed Account',
         noticeDeposit: 'N',
         period1: 1,
         period2: 60
      };
      accountServiceStub.getInvestor = jasmine.createSpy('getInvestor').and.returnValue(Observable.of(mockDepositDetails));
      component.ngOnInit();
      expect(component.isMoreInvestorNumber).toBe(false);
   });

   it('should be insufficient balance', () => {
      component.selectedAmount = 1000;
      component.onAccountChanged(accDetails);
      expect(component.isSufficientBalance).toBe(false);
   });

   it('should be sufficient balance', () => {
      component.selectedAmount = 100;
      component.onAccountChanged(accDetails);
      expect(component.isSufficientBalance).toBe(true);
   });

   it('should be change the investor number', () => {
      const investor = '123456';
      component.onInvestorChanged(investor);
      expect(component.investorNumber).toBe('123456');
   });

   it('should be change the amount', () => {
      component.entryAmount = 500;
      const amount = 200;
      component.onAmountChange(amount);
      expect(component.isValidAmount).toBe(false);
      expect(component.isMaxAmount).toBe(true);
   });

   it('entered amount should be valid', () => {
      component.minimumEntryAmount = 500;
      const amount = 123456788;
      component.onAmountChange(amount);
      expect(component.isValidAmount).toBe(true);
      expect(component.isMaxAmount).toBe(false);
   });

   it('should be change the month', () => {
      component.minMonth = 2;
      component.maxMonth = 12;
      const month = 4;
      component.onMonthChange(month);
      expect(component.isValidMonth).toBe(true);
   });

   it('entered month is not valid', () => {
      component.monthChange = true;
      component.minMonth = 2;
      component.maxMonth = 12;
      const month = 14;
      component.onMonthChange(month);
      expect(component.isValidMonth).toBe(false);
   });

   it('should be call submit function', () => {
      component.investorNumber = '123456';
      component.selectedAmount = 800;
      component.account = 'Notice Account';
      component.selectedMonth = 4;
      component.accountType = 'SA';
      component.onSubmit();
      component.accountFlag.subscribe(result => {
         expect(result).toBe(false);
      });
   });

   it('entered amount is not valid', () => {
      component.selectedAmount = 500;
      component.isNoticeDeposit = false;
      component.onSubmit();
      expect(component.selectedAmount).toBe(500);
   });

   it('should be go stepper back', () => {
      component.back();
      component.stepperback.subscribe(result => {
         expect(result).toBe(true);
      });
   });

   it('should be hide investor section', () => {
      accountServiceStub.getInvestor = jasmine.createSpy('getInvestor').and.returnValue(Observable.of([]));
      component.getInvestor();
      expect(component.noInvestorNumber).toBe(false);
   });

   it('should be call decreaseMonth function', () => {
      component.selectedMonth = 2;
      component.minMonth = 1;
      component.maxMonth = 5;
      component.monthChange = true;
      component.decreaseMonth();
      expect(component.selectedMonth).toBe(1);
      expect(component.isDecrement).toBe(false);
      expect(component.isIncrement).toBe(true);
   });

   it('entered month is not valid', () => {
      component.selectedMonth = 3;
      component.minMonth = 1;
      component.maxMonth = 2;
      component.monthChange = true;
      component.decreaseMonth();
      expect(component.isDecrement).toBe(true);
      expect(component.isIncrement).toBe(false);
   });

   it('should be call increaseMonth function', () => {
      component.selectedMonth = 1;
      component.minMonth = 1;
      component.maxMonth = 2;
      component.monthChange = true;
      component.increaseMonth();
      expect(component.selectedMonth).toBe(2);
      expect(component.isDecrement).toBe(true);
      expect(component.isIncrement).toBe(false);
   });

   it('month should be valid', () => {
      component.selectedMonth = 3;
      component.minMonth = 5;
      component.maxMonth = 10;
      component.monthChange = true;
      component.increaseMonth();
      expect(component.isDecrement).toBe(false);
      expect(component.isIncrement).toBe(true);
   });

   it('should not change month if min month is greater than max month', () => {
      component.monthChange = false;
      component.increaseMonth();
      expect(component.isDecrement).toBe(false);
      expect(component.isIncrement).toBe(false);
   });
   it('should return error message for tax free saving account if product type is 49', () => {
      component.minimumEntryAmount = 500;
      const amount = 123456788;
      component.productInfo = { productType: 49 };
      component.onAmountChange(amount);
      expect(component.isMaxAmount).toBe(false);
   });

});
