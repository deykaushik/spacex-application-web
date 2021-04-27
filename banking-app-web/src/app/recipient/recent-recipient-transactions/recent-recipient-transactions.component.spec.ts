import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../test-util';
import { RecentRecipientTransactionsComponent } from './recent-recipient-transactions.component';
import { IBeneficiaryRecentTransactDetail } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
const transactions: IBeneficiaryRecentTransactDetail[] = [{
   acctNumber: '123',
   paymentAmount: 1,
   paymentDate: new Date('2016-04-25T00:00:00'),
   beneficiaryID: 1,
   beneficiarytype: 'BDF',
   paymentCRNarration: 'ewdbkeb',
   paymentDRNarration: 'bckwebfkb',
   execEngineRef: 'aaaaaaaaaaaaaaaaaaaa'
},
{
   acctNumber: '123',
   paymentAmount: 1,
   paymentDate: new Date('2016-05-25T00:00:00'),
   beneficiaryID: 1,
   beneficiarytype: 'PEL',
   paymentCRNarration: 'ewdbkeb',
   paymentDRNarration: 'bckwebfkb',
   execEngineRef: 'aaaaaaaaaaaaaaaaaaaa'
},
{
   acctNumber: '123',
   paymentAmount: 1,
   paymentDate: new Date('2016-04-2T00:00:00'),
   beneficiaryID: 1,
   beneficiarytype: 'BNFINT',
   paymentCRNarration: 'ewdbkeb',
   paymentDRNarration: 'bckwebfkb',
   execEngineRef: 'aaaaaaaaaaaaaaaaaaaa'
},
{
   acctNumber: '123',
   paymentAmount: 1,
   paymentDate: new Date('2012-04-25T00:00:00'),
   beneficiaryID: 1,
   beneficiarytype: 'BNFEXT',
   paymentCRNarration: 'ewdbkeb',
   paymentDRNarration: 'bckwebfkb',
   execEngineRef: 'aaaaaaaaaaaaaaaaaaaa'
},
{
   acctNumber: '123',
   paymentAmount: 1,
   paymentDate: new Date('2017-04-25T00:00:00'),
   beneficiaryID: 1,
   beneficiarytype: 'PEL',
   paymentCRNarration: 'ewdbkeb',
   paymentDRNarration: 'bckwebfkb',
   execEngineRef: 'aaaaaaaaaaaaaaaaaaaa'
}];
describe('RecentRecipientTransactionsComponent', () => {
   let component: RecentRecipientTransactionsComponent;
   let fixture: ComponentFixture<RecentRecipientTransactionsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RecentRecipientTransactionsComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RecentRecipientTransactionsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should handle change event', () => {
      component.recentTransactions = transactions;
      component.ngOnChanges();
      expect(component.recentPayments.length).toBe(3);
      expect(component.recentPurchases.length).toBe(2);
   });

   it('should return icon class', () => {
      expect(component.getIconClass({
         acctNumber: '123',
         paymentAmount: 1,
         paymentDate: new Date('2016-04-25T00:00:00'),
         beneficiaryID: 1,
         beneficiarytype: 'BDF',
         paymentCRNarration: 'ewdbkeb',
         paymentDRNarration: 'bckwebfkb',
         execEngineRef: 'aaaaaaaaaaaaaaaaaaaa'
      })).toBe(Constants.SchedulePaymentType.payment.icon);

      expect(component.getIconClass({
         acctNumber: '123',
         paymentAmount: 1,
         paymentDate: new Date('2016-04-25T00:00:00'),
         beneficiaryID: 1,
         beneficiarytype: 'PEL',
         paymentCRNarration: 'ewdbkeb',
         paymentDRNarration: 'bckwebfkb',
         execEngineRef: 'aaaaaaaaaaaaaaaaaaaa'
      })).toBe(Constants.SchedulePaymentType.prepaid.icon);
   });
});
