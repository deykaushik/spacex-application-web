import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { OpenAccountService } from '../../../open-account.service';
import { RecurringPaymentComponent } from './recurring-payment.component';
import { assertModuleFactoryCaching } from './../../../../test-util';
import {
   IRadioButtonItem, IRecurringDetails, IFrequency,
   IFrequencyNoticeAccount, IFrequencyFixedAccount, IFrequencyAccount, IApiResponse
} from '../../../../core/services/models';
import { AmountTransformPipe } from '../../../../shared/pipes/amount-transform.pipe';

const mockRecurringDetails: IRecurringDetails[] = [{
   Frequency: 'Monthly',
   Day: 'Monday',
   Amount: 500,
   Account: 'Notice Deposit'
}];

const mockWeekly: IRadioButtonItem = {
   label: 'select duration',
   value: 'Weekly',
};

const mockMonthly: IRadioButtonItem = {
   label: 'Monthly',
   value: 'Monthly',
};

const mockMonthlyProductDetails: IFrequency = {
   frequency1: 'M'
};

const mockWeeklyProductDetails: IFrequency = {
   frequency1: 'W'
};

const mockPartWithdrawalWeekly: IFrequencyNoticeAccount[] = [{
   stopOrderFreq1: 'Weekly',
   stopOrderFreq2: 0
}];

const mockPartWithdrawalMonthly: IFrequencyNoticeAccount[] = [{
   stopOrderFreq1: 'Monthly',
   stopOrderFreq2: 0
}];

const mockPartWithdrawalDetail: IFrequencyFixedAccount[] = [{
   stopOrderFreq1: 1,
   stopOrderFreq2: 2
}];

const mockWithdrawalWeekly: IFrequencyAccount[] = [{
   stopOrderFreq1: 0,
   stopOrderFreq2: 'Weekly'
}];

const mockWithdrawalMonthly: IFrequencyAccount[] = [{
   stopOrderFreq1: 0,
   stopOrderFreq2: 'Monthly'
}];

const accountServiceStub = {
   getProductDetails: jasmine.createSpy('getProductDetails').and.returnValue(mockMonthlyProductDetails),
   getWeeklyProductDetails: mockWeeklyProductDetails,
   getRecurringDetails: jasmine.createSpy('getRecurringDetails').and.returnValue(mockRecurringDetails),
   getInitialDeposit: jasmine.createSpy('getInitialDeposit').and.returnValue(Observable.of(700)),
   setRecurringDetails: jasmine.createSpy('setRecurringDetails'),
   getPartWithdrawalAmount: jasmine.createSpy('getPartWithdrawalAmount').and.returnValue(Observable.of(mockPartWithdrawalDetail))
};

describe('RecurringPaymentComponent', () => {
   let component: RecurringPaymentComponent;
   let fixture: ComponentFixture<RecurringPaymentComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [RecurringPaymentComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: OpenAccountService, useValue: accountServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RecurringPaymentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('Weekly account should be display', () => {
      accountServiceStub.getProductDetails.and.returnValue(accountServiceStub.getWeeklyProductDetails);
      component.ngOnInit();
      expect(component.isWeekly).toBe(true);
   });

   it('should be display note according to the month selection', () => {
      component.onMonthChange(2);
      expect(component.note).toBe(true);
   });

   it('should be hide the note when month is not selected', () => {
      component.onMonthChange(0);
      expect(component.note).toBe(false);
   });

   it('should be call recurringSubmit', () => {
      component.payoutDeposit = 900;
      component.selectedAccount = 'CA';
      component.recurringSubmit();
      component.recurringnext.subscribe(result => {
         expect(result).toBe(true);
      });
   });

   it('should be call onAmountChange function when you change the amount', () => {
      component.onAmountChange(200);
      expect(component.payoutDeposit).toBe(200);
   });

   it('should be go to the privious page', () => {
      component.back();
      component.accountFlag.subscribe(result => {
         expect(result).toBe(false);
      });
   });

   it('should be call changeRecuringPayment when you change recurring amount', () => {
      component.changeRecuringPayment(true);
      expect(component.isRecuringPayments).toBe(true);
   });

   it('should be call onPaymentDurationChange when you change the duration', () => {
      component.onPaymentDurationChange(mockWeekly);
      expect(component.isWeekly).toBe(true);
   });

   it('should be call onPaymentDurationChange when you change the duration', () => {
      component.onPaymentDurationChange(mockMonthly);
      expect(component.isMonthly).toBe(true);
   });

   it('should be call onAccChange when you choose different account', () => {
      const account = {
         nickname: 'current',
         accountNumber: 1234666
      };
      component.onAccChange(account);
      expect(component.selectedAccount).toBe(account.nickname + ' - ' + account.accountNumber);
   });

   it('should be call recDetails with recurring data', () => {
      component.recurringDetails = [{
         Frequency: 'Monthly',
         Day: 4,
         Amount: 500,
         Account: 'Notice Deposit',
         isRecurringYes: true
      }];
      component.recDetails(true);
      expect(component.isWeekly).toBe(false);
   });

   it('should be call recDetails withount recurring data', () => {
      component.recurringDetails = [{
         Frequency: 'Monthly',
         Day: 0,
         Amount: 500,
         Account: 'Notice Deposit',
         isRecurringYes: true
      }];
      component.recDetails(true);
      expect(component.isWeekly).toBe(true);
   });

   it('should select weekly part withdrawal payments', () => {
      component.frequencyDetails[0] = [];
      accountServiceStub.getPartWithdrawalAmount.and.returnValue(Observable.of(mockPartWithdrawalWeekly));
      component.stopOrderFrequency(15);
      expect(component.isWeekly).toBe(true);
   });

   it('should select monthly part withdrawal payments', () => {
      component.frequencyDetails[0] = [];
      accountServiceStub.getPartWithdrawalAmount.and.returnValue(Observable.of(mockPartWithdrawalMonthly));
      component.stopOrderFrequency(15);
      expect(component.isMonthly).toBe(true);
   });

   it('should select weekly payments', () => {
      component.frequencyDetails[0] = [];
      accountServiceStub.getPartWithdrawalAmount.and.returnValue(Observable.of(mockWithdrawalWeekly));
      component.stopOrderFrequency(15);
      expect(component.isWeekly).toBe(true);
   });

   it('should select withdrawal payments', () => {
      component.frequencyDetails[0] = [];
      accountServiceStub.getPartWithdrawalAmount.and.returnValue(Observable.of(mockWithdrawalMonthly));
      component.stopOrderFrequency(15);
      expect(component.isMonthly).toBe(true);
   });

   it('should be decrease selected day in month', () => {
      component.selectedMonth = 2;
      component.decreaseDay();
      expect(component.isIncrement).toBe(true);
   });

   it('should be increase selected day in month', () => {
      component.selectedMonth = 30;
      component.increaseDay();
      expect(component.isDecrement).toBe(true);
   });

   it('should be change day in month', () => {
      component.selectedMonth = 30;
      component.onDayChange('Monday', 3);
      component.onDayChange('Friday', 1);
      component.onDayChange('Monday', 1);
      expect(component.note).toBe(true);
   });
});
