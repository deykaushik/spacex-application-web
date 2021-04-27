import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../test-util';
import { IScheduledTransaction, IScheduledTransactionType } from '../../../core/services/models';
import { FormatSchedulePaymentPipe } from './../../pipes/format-schedule-payment.pipe';
import { SkeletonLoaderPipe } from './../../pipes/skeleton-loader.pipe';

import { ScheduledTransactionComponent } from './scheduled-transaction.component';

const testComponent = class { };
const routerTestingParam = [
      { path: 'dashboard/account/scheduled/:id', component: testComponent },
      { path: 'Mobile/:id', component: testComponent },
];

describe('ScheduledTransactionComponent', () => {
   let component: ScheduledTransactionComponent;
   let fixture: ComponentFixture<ScheduledTransactionComponent>;

   const mockScheduledTransaction: IScheduledTransaction = {
      'batchID': 2060015,
      'transactionID': 29117114,
      'capturedDate': '2017-09-20T00:00:00',
      'startDate': '2017-09-20T00:00:00',
      'nextTransDate': '2017-09-20T00:00:00',
      'beneficiaryID': 0,
      'sortCode': '196005',
      'bFName': 'UNKNOWN',
      'myDescription': 'test',
      'beneficiaryDescription': 'test',
      'fromAccount': { 'accountNumber': '1713277581' },
      'toAccount': { 'accountNumber': '1042853096', accountType: 'CA' },
      'amount': 100.0,
      'reoccurrenceItem': {
         'reoccurrenceFrequency': 'Monthly',
         'recInstrID': 2050467,
         'reoccurrenceOccur': 12,
         'reoccOccurrencesLeft': 11,
         'reoccurrenceToDate': '2018-09-16T00:00:00',
         'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
      },
   };

   let router: Router;

   const mockScheduledTransactionType: IScheduledTransactionType = {
      transaction: mockScheduledTransaction,
      type: 'Transfer',
      iconClass: 'transfer-icon'
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ScheduledTransactionComponent, SkeletonLoaderPipe, FormatSchedulePaymentPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [{ provide: ActivatedRoute }, DatePipe]
      })
         .compileComponents();
      router = TestBed.get(Router);
   }));

   it('should be created with type transfer', () => {
      fixture = TestBed.createComponent(ScheduledTransactionComponent);
      component = fixture.componentInstance;
      component.scheduleTransactionDetail = mockScheduledTransactionType;
      fixture.detectChanges();
      expect(component).toBeTruthy();
   });


   it('should be created with transation type payment', () => {
      fixture = TestBed.createComponent(ScheduledTransactionComponent);
      component = fixture.componentInstance;
      component.scheduleTransactionDetail = mockScheduledTransactionType;
      component.scheduleTransactionDetail.type = 'Payment';
      fixture.detectChanges();
      expect(component).toBeTruthy();
   });

   it('should be created with transation type payment', () => {
      fixture = TestBed.createComponent(ScheduledTransactionComponent);
      component = fixture.componentInstance;
      component.scheduleTransactionDetail = mockScheduledTransactionType;
      component.scheduleTransactionDetail.type = 'Mobile';
      fixture.detectChanges();
      expect(component).toBeTruthy();
   });

   it('should callopenTransaction', () => {
      component.openTransaction();
      spyOn(router, 'navigateByUrl');
      expect(component).toBeTruthy();
   });
   it('should set navigate Url when source page is recipient', () => {
      fixture = TestBed.createComponent(ScheduledTransactionComponent);
      component = fixture.componentInstance;
      component.scheduleTransactionDetail = mockScheduledTransactionType;
      component.sourcePage = 'recipient';
      component.scheduleTransactionDetail.type = 'Transfer';
      fixture.detectChanges();
      expect(component.navigateUrl).toBe('/recipient/scheduled/Transfer/29117114');
   });

});

