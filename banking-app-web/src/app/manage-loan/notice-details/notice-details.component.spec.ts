import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from '../../test-util';
import { AccountService } from '../../dashboard/account.service';
import { NoticeDetailsComponent } from './notice-details.component';
import { SkeletonLoaderPipe } from '../../shared/pipes/skeleton-loader.pipe';
import { IAccountBalanceDetail } from '../../core/services/models';

const mockBalanceDetail: IAccountBalanceDetail = {
   accountName: 'BOND A/C',
   accountNumber: '8605376000101',
   accountType: 'HL',
   currency: '&#x52;',
   outstandingBalance: 1.17,
   nextInstallmentAmount: 3519.45,
   amountInArrears: -181726.91,
   nextPaymentDue: 3519.45,
   nextPaymentDate: '2018-05-01T05:30:00+05:30',
   interestRate: 8.25,
   loanAmount: 405000,
   email: 'test@gmail.com',
   paymentTerm: '240',
   termRemaining: '64 months',
   balanceNotPaidOut: 10000,
   registeredAmount: 405000,
   accruedInterest: 0,
   isSingleBond: true,
   PropertyAddress: '6, WABOOM, 40672, Sandton',
   nameAndSurname: 'Mr Brian Bernard Sheinuk',
   contactNumber: '+27991365718',
   loanCancellationDate: '2018-06-01T05:30:00+05:30',
   loanCancellationNoticeExpiryDate: '2018-06-01T05:30:00+05:30',
   loanExpectedClosureDate: '2018-07-01T05:30:00+05:30'
};

const accountServiceStub = {
   getAccountBalanceDetail: jasmine.createSpy('getAccountBalanceDetail').and.returnValue(Observable.of(mockBalanceDetail)),
};

describe('NoticeDetailsComponent', () => {
   let component: NoticeDetailsComponent;
   let fixture: ComponentFixture<NoticeDetailsComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [NoticeDetailsComponent, SkeletonLoaderPipe],
         providers: [{ provide: AccountService, useValue: accountServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NoticeDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created and have formatted notice placed dates', () => {
      expect(component).toBeTruthy();
      expect(component.noticeDetails.loanCancellationDate).toBe('01 June 2018');
      expect(component.noticeDetails.loanCancellationNoticeExpiryDate).toBe('01 June 2018');
      expect(component.noticeDetails.loanExpectedClosureDate).toBe('01 July 2018');
   });

   it('should not have notice details If service returns an error', () => {
      component.noticeDetails = null;
      accountServiceStub.getAccountBalanceDetail.and.returnValue(Observable.of(null));
      expect(component.noticeDetails).toBe(null);
   });

   it('should returns true If currentDate is lesser than expiryDate', () => {
      component.currentDate = '9/24/2018';
      component.isExpiryDateExceeds('12/31/2020');
      expect(component.isDateBefore).toBe(true);
   });

   it('should returns true If currentDate is equal to expiryDate', () => {
      component.currentDate = '9/24/2018';
      component.isExpiryDateExceeds('9/24/2018');
      expect(component.isDateBefore).toBe(true);
   });

   it('should returns false If currentDate is greater than expiryDate', () => {
      component.currentDate = '9/24/2018';
      component.isExpiryDateExceeds('12/31/2000');
      expect(component.isDateBefore).toBe(false);
   });

});
