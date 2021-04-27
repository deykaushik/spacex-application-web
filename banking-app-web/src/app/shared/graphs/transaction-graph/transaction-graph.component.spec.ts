import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../../test-util';
import { TransactionGraphComponent } from './transaction-graph.component';
import { ITransactionDetail } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';

const mockAccountTransactions: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 28000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-26 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}, {
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 9000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-27 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 10000
}];

const mockAccountTransactionsLessSpaced: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 28000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-26 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}, {
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 9000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-26 04:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 10000
}, {
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 9000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-09-26 06:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 10000
}];

const mockAccountSkeletonData: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: null,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2115-09-26 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}];

const pastDateTransactions: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 28000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2016-5-26 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}, {
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 9000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-10-27 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 10000
}];

const mockRewardsTransactions: ITransactionDetail[] = [{
   TransactionId: null,
   Description: 'Test GB bonus 3768000010300602; CELESTE FLORIST; Rand Value: R13821,26; 3770*******9478',
   Amount: 2764.0,
   Debit: false,
   Account: '841709000015',
   PostedDate: '2017-10-26 12:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 9298.0,
   Currency: 'GB',
   ShortDescription: null
}, {
   TransactionId: null,
   Description: 'Test GB bonus 3768000010300602; CELESTE FLORIST; Rand Value: R13821,26; 3770*******9478',
   Amount: 10.0,
   Debit: false,
   Account: '841709000015',
   PostedDate: '2017-10-24 12:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 9288.0,
   Currency: 'GB',
   ShortDescription: null
}];

describe('TransactionGraphComponent', () => {
   let component: TransactionGraphComponent;
   let fixture: ComponentFixture<TransactionGraphComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TransactionGraphComponent],
         schemas: [NO_ERRORS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransactionGraphComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be able to add hover event to the graph', () => {
      expect(component.addHoverEvent()).toBeUndefined();
   });

   it('should be able to parse chart data with no transactions outside view', () => {
      component.transactions = mockAccountTransactions;
      component.accountType = 'CA';
      expect(component.parseChartData()).toBeUndefined();

      component.transactions = mockAccountTransactionsLessSpaced;
      component.accountType = 'CA';
      expect(component.parseChartData()).toBeUndefined();
   });

   it('should be able to parse chart data with transaction in past outside view', () => {

      component.transactions = pastDateTransactions;
      component.accountType = 'CA';
      expect(component.parseChartData()).toBeUndefined();
   });

   it('should be able to parse chart duration', () => {
      component.accountType = 'CA';
      component.transactions = mockAccountTransactions;
      expect(component.parseChartDuration()).toBeUndefined();

      component.accountType = 'DS';
      component.transactions = pastDateTransactions;
      expect(component.parseChartDuration()).toBeUndefined();

      component.accountType = 'NC';
      component.transactions = pastDateTransactions;
      expect(component.parseChartDuration()).toBeUndefined();

      component.accountType = 'IS';
      component.transactions = pastDateTransactions;
      expect(component.parseChartDuration()).toBeUndefined();

      component.accountType = 'HL';
      component.transactions = pastDateTransactions;
      expect(component.parseChartDuration()).toBeUndefined();

      component.accountType = 'TD';
      component.transactions = pastDateTransactions;
      expect(component.parseChartDuration()).toBeUndefined();
   });

   it('should format amount for various possibilities', () => {
      expect(component.formatAmount(1.9999)).toBe('R2 ');
      expect(component.formatAmount(100)).toBe('R100 ');
      expect(component.formatAmount(1000)).toBe('R1k ');
      expect(component.formatAmount(1000000)).toBe('R1m ');
      expect(component.formatAmount(1000000000)).toBe('R1b ');

      expect(component.formatAmount(-1.9999)).toBe('-R2 ');
      expect(component.formatAmount(-100)).toBe('-R100 ');
      expect(component.formatAmount(-1000)).toBe('-R1k ');
      expect(component.formatAmount(-1000000)).toBe('-R1m ');
      expect(component.formatAmount(-1000000000)).toBe('-R1b ');

      component.accountType = 'Rewards';
      component.currency = 'GB';
      fixture.detectChanges();
      expect(component.formatAmount(-1000000000)).toBe('-GB1b ');

      component.accountType = 'Rewards';
      component.currency = 'MR';
      fixture.detectChanges();
      expect(component.formatAmount(-1000000000)).toBe('-MR1b ');

      component.accountType = 'Rewards';
      component.currency = 'GB';
      fixture.detectChanges();
      expect(component.formatAmount(1000000000)).toBe('GB1b ');

      component.accountType = 'Rewards';
      component.currency = 'MR';
      fixture.detectChanges();
      expect(component.formatAmount(1000000000)).toBe('MR1b ');
   });

   it('should be able to plot hover data', () => {
      component.transactions = mockAccountTransactions;
      component.accountType = 'CA';
      component.parseChartDuration();
      component.parseChartData();
      const canvas = document.createElement('canvas');
      canvas.style.width = '500px';
      document.body.appendChild(canvas);
      const context = <CanvasRenderingContext2D>(canvas.getContext('2d'));
      expect(component.plotHoverOverData({
         left: 20,
         right: 100
      }, 150, context, 50)).toBeUndefined();

      expect(component.plotHoverOverData({
         left: 20,
         right: 550
      }, 150, context, 450)).toBeUndefined();

      component.transactions = [];
      component.parseChartDuration();
      component.parseChartData();
      component.graphData = [];
      expect(component.plotHoverOverData({
         left: 20,
         right: 100
      }, 150, context, 50)).toBeUndefined();

      component.transactions = mockAccountTransactions;
      component.parseChartDuration();
      component.parseChartData();
      expect(component.plotHoverOverData({
         left: 20,
         right: 100
      }, 150, context, 50)).toBeUndefined();

      component.transactions = mockAccountSkeletonData;
      component.parseChartDuration();
      component.parseChartData();
      expect(component.plotHoverOverData({
         left: 20,
         right: 100
      }, 150, context, 50)).toBeUndefined();

      component.transactions = mockRewardsTransactions;
      component.parseChartDuration();
      component.parseChartData();
      component.accountType = 'Rewards';
      expect(component.plotHoverOverData({
         left: 20,
         right: 100
      }, 150, context, 50)).toBeUndefined();

   });

   it('should be able to parse line color for chart', () => {
      component.accountType = 'SA';
      component.parseChartLineColor();
      expect(component.chartLineColor).toBe('#009639');

      component.accountType = 'CC';
      component.parseChartLineColor();
      expect(component.chartLineColor).toBe('#d22630');

      component.accountType = 'IS';
      component.parseChartLineColor();
      expect(component.chartLineColor).toBe('#f2a900');

      component.accountType = 'DS';
      component.parseChartLineColor();
      expect(component.chartLineColor).toBe('#00b2a9');

      component.accountType = 'XX';
      component.parseChartLineColor();
      expect(component.chartLineColor).toBe('#979797');

      component.accountType = 'Rewards';
      component.parseChartLineColor();
      expect(component.chartLineColor).toBe('#f2a900');

      component.containerName = 'ClubAccount';
      component.accountType = 'SA';
      component.parseChartLineColor();
      expect(component.chartLineColor).toBe('#00b2a9');

      component.accountType = 'CFC';
      component.parseChartLineColor();
      expect(component.chartLineColor).toBe('#00b2a9');

   });

   it('should check for label on chart y axis', () => {
      expect(component.getAccountTypeYLabel('SA')).toBe('Available balance');
      expect(component.getAccountTypeYLabel('CA')).toBe('Available balance');
      expect(component.getAccountTypeYLabel('CC')).toBe('Current balance');
      expect(component.getAccountTypeYLabel('NC')).toBe('Outstanding balance');
      expect(component.getAccountTypeYLabel('IS')).toBe('Outstanding balance');
      expect(component.getAccountTypeYLabel('HL')).toBe('Outstanding balance');
      expect(component.getAccountTypeYLabel('DS')).toBe('Market value');
      expect(component.getAccountTypeYLabel('TD')).toBe('Market value');
      expect(component.getAccountTypeYLabel('INV')).toBe('Market value');
      expect(component.getAccountTypeYLabel('XX')).toBe('Current balance');
      expect(component.getAccountTypeYLabel('Rewards')).toBe('Balance');
   });

   it('should  be able to check for underline fill color', () => {
      expect(component.getAccountTypeFillColor('NC')).toBe('rgba(242, 169, 0, 0.07)');
      expect(component.getAccountTypeFillColor('IS')).toBe('rgba(242, 169, 0, 0.07)');
      expect(component.getAccountTypeFillColor('HL')).toBe('rgba(242, 169, 0, 0.07)');
      expect(component.getAccountTypeFillColor('DS')).toBe('rgba(28, 188, 236, 0.07)');
      expect(component.getAccountTypeFillColor('TD')).toBe('rgba(28, 188, 236, 0.07)');
      expect(component.getAccountTypeFillColor('INV')).toBe('rgba(28, 188, 236, 0.07)');
      expect(component.getAccountTypeFillColor('SA')).toBe('rgba(0,0,0,0)');
      expect(component.getAccountTypeFillColor('SA', 'ClubAccount')).toBe('rgba(28, 188, 236, 0.07)');
      expect(component.getAccountTypeFillColor('XX')).toBe('rgba(0,0,0,0)');
      expect(component.getAccountTypeFillColor('Rewards')).toBe('rgba(242, 169, 0, 0.07)');
   });

   it(`should check for redrawing when input data changes
      using ngOnChange listener`, () => {
         component.transactions = mockAccountTransactions;
         component.accountType = 'CA';
         expect(component.ngOnChanges()).toBeUndefined();
      });

});
