import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { OpenAccountService } from '../../../open-account.service';
import { InterestDetailsComponent } from './interest-details.component';
import { IDepositDetails, IPayoutDetails, IDeposit, IAccountDetails } from '../../../../core/services/models';
import { assertModuleFactoryCaching } from './../../../../test-util';
import { AmountTransformPipe } from '../../../../shared/pipes/amount-transform.pipe';

const mockDepositForOneMonth: IDepositDetails[] = [{
   investorNumber: 12345678,
   Amount: 800,
   depositAccount: 'notice deposit',
   Months: 1,
   depositAccountType: 'CA'
}];
const mockDepositForTwoMonths: IDepositDetails[] = [{
   investorNumber: 12345678,
   Amount: 800,
   depositAccount: 'notice deposit',
   Months: 2,
   depositAccountType: 'CA'
}];
const mockDepositForFourMonths: IDepositDetails[] = [{
   investorNumber: 12345678,
   Amount: 800,
   depositAccount: 'notice deposit',
   Months: 4,
   depositAccountType: 'CC'
}];
const mockDepositForSevenMonths: IDepositDetails[] = [{
   investorNumber: 12345678,
   Amount: 800,
   depositAccount: 'notice deposit',
   Months: 7,
   depositAccountType: 'SA'
}];

const mockDepositForYear: IDepositDetails[] = [{
   investorNumber: 12345678,
   Amount: 800,
   depositAccount: 'notice deposit',
   Months: 14,
   depositAccountType: 'CC'
}];

const mockInterestDetails: IPayoutDetails[] = [{
   payoutOption: 'Weekly',
   payoutDay: 2,
   payoutAccount: 'credit card'
}];

const mockInterest: IDeposit[] = [{
   noticeDeposit: '32 Days',
   name: 'Just Invest',
   realtimerate: 7.7
}];

const accountServiceStub = {
   getDepositDetails: jasmine.createSpy('getDepositDetails').and.returnValue(mockDepositForOneMonth),
   getDepositDetailsForTwoMonths: mockDepositForTwoMonths,
   getDepositDetailsForFourMonths: mockDepositForFourMonths,
   getDepositDetailsForSevenMonths: mockDepositForSevenMonths,
   getDepositDetailsForYear: mockDepositForYear,
   getInterestDetails: jasmine.createSpy('getInterestDetails').and.returnValue(mockInterestDetails),
   getInterestPayout: jasmine.createSpy('getInterestPayout').and.returnValue(Observable.of(mockInterestDetails)),
   setInterestDetails: jasmine.createSpy('setInterestDetails'),
   getRealTimeInterestRate: jasmine.createSpy('getRealTimeInterestRate').and.returnValue(7),
   setRealTimeInterestRate: jasmine.createSpy('setRealTimeInterestRate'),
   getFixedInterestRate: jasmine.createSpy('getFixedInterestRate').and.returnValue(Observable.of(mockInterest)),
};

describe('InterestDetailsComponent', () => {
   let component: InterestDetailsComponent;
   let fixture: ComponentFixture<InterestDetailsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [InterestDetailsComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: OpenAccountService, useValue: accountServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(InterestDetailsComponent);
      component = fixture.componentInstance;
      component.productInfo = {
         noticeDeposit: 'A',
         name: '32-days-notice',
         realtimerate: 7
      };
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be select 2 months', () => {
      accountServiceStub.getDepositDetails.and.returnValue(accountServiceStub.getDepositDetailsForTwoMonths);
      component.ngOnInit();
      expect(component.accountDetail.length).toBe(2);
   });

   it('should be select 4 months', () => {
      accountServiceStub.getDepositDetails.and.returnValue(accountServiceStub.getDepositDetailsForFourMonths);
      component.ngOnInit();
      expect(component.accountDetail.length).toBe(3);
   });

   it('should be select 7 months', () => {
      accountServiceStub.getDepositDetails.and.returnValue(accountServiceStub.getDepositDetailsForSevenMonths);
      component.ngOnInit();
      expect(component.accountDetail.length).toBe(4);
   });

   it('should be select more than year', () => {
      accountServiceStub.getDepositDetails.and.returnValue(accountServiceStub.getDepositDetailsForYear);
      component.ngOnInit();
      expect(component.accountDetail.length).toBe(5);
   });

   it('should be call onAccountChanged function', () => {
      component.onAccountChanged('Monthly');
      expect(component.note).toBe(true);
   });

   it('should be call onAccountChanged function', () => {
      component.onAccountChanged('Quarterly');
      expect(component.note).toBe(true);
   });

   it('should be call onAccountChanged function', () => {
      component.onAccountChanged('Half-yearly');
      expect(component.note).toBe(true);
   });

   it('should be call onAccountChanged function', () => {
      component.onAccountChanged('Yearly');
      expect(component.note).toBe(true);
   });

   it('should be call onAccountChanged function', () => {
      component.onAccountChanged('When my investment period ends');
      expect(component.note).toBe(true);
   });

   it('should be call onAccountSelect function', () => {
      const accData: IAccountDetails = {
         nickname: 'Alroy',
         accountNumber: '123456789'
      };
      component.onAccountSelect(accData);
      expect(component.selectAccount).toBe(accData.nickname + ' - ' + accData.accountNumber);
   });

   it('should be call onDayChange function', () => {
      component.selectedDay = 2;
      component.payoutDay = 1;
      component.isNoticeDeposit = false;
      component.onDayChange(5);
      expect(component.isValidDay).toBe(true);
   });

   it('should be call onDayChange function', () => {
      component.onDayChange(32);
      expect(component.isValidDay).toBe(false);
   });

   it('should be call onSubmit function', () => {
      component.isNoticeDeposit = false;
      component.onSubmit();
      component.interestnext.subscribe(result => {
         expect(result).toBe(true);
      });
   });

   it('should be call onSubmit function', () => {
      component.isNoticeDeposit = true;
      component.onSubmit();
      component.accountFlag.subscribe(result => {
         expect(result).toBe(false);
      });
   });

   it('should be call back function', () => {
      component.back();
      component.accountFlag.subscribe(result => {
         expect(result).toBe(false);
      });
   });

   it('should be call decreaseMonth function', () => {
      component.selectedDay = 2;
      component.payoutDay = 1;
      component.decreaseDay();
      expect(component.isDecrement).toBe(false);
      expect(component.isIncrement).toBe(true);
   });

   it('entered month is not valid', () => {
      component.selectedDay = 32;
      component.payoutDay = 2;
      component.isNoticeDeposit = false;
      component.decreaseDay();
      expect(component.isDecrement).toBe(true);
      expect(component.isIncrement).toBe(false);
   });

   it('should be call increaseMonth function', () => {
      component.selectedDay = 1;
      component.increaseDay();
      expect(component.selectedDay).toBe(2);
      expect(component.isDecrement).toBe(true);
   });

   it('selected month shuold be valid', () => {
      const date = moment();
      const selectedDate = date.add(5, 'days').toDate();
      const selectTerm = ['Monthly', 'Quarterly', 'Half-yearly', 'Yearly', 'When my investment period ends'];
      for (let i = 0; i < selectTerm.length; i++) {
         component.selectedTerm = selectTerm[i];
         component.showDate(0);
         component.showDate(1);
      }
      expect(component.investmentEndDate).toBeDefined();
   });

   it('month should be valid', () => {
      component.selectedDay = 30;
      component.payoutDay = 25;
      component.isNoticeDeposit = false;
      component.increaseDay();
      expect(component.isIncrement).toBe(false);
   });
});
