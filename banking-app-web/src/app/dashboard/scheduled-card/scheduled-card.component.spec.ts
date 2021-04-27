import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { AccountService } from '../account.service';
import { IScheduledTransaction, IServiceProvider } from '../../core/services/models';
import { BuyService } from '../../buy/buy-prepaid/buy.service';
import { ScheduledCardComponent } from './scheduled-card.component';


const testComponent = class { };
const routerTestingParam = [
   { path: 'dashboard/account/scheduled/:id', component: testComponent },
   { path: 'Mobile/:id', component: testComponent },
];

describe('ScheduledCardComponent', () => {
   let component: ScheduledCardComponent;
   let fixture: ComponentFixture<ScheduledCardComponent>;

   const mockScheduledData: IScheduledTransaction[] = [
      {
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
         'serviceProvider': 'VDC',
         'serviceProviderName': 'Vodacom'
      },
      {
         'batchID': 2060015,
         'transactionID': 29117114,
         'capturedDate': '2017-09-20T00:00:00',
         'startDate': '2017-09-20T00:00:00',
         'nextTransDate': '2017-10-20T00:00:00',
         'beneficiaryID': 0,
         'sortCode': '196005',
         'bFName': 'UNKNOWN',
         'myDescription': 'test',
         'beneficiaryDescription': 'test',
         'fromAccount': { 'accountNumber': '1713277581' },
         'toAccount': { 'accountNumber': '1042853096', accountType: 'CA' },
         'amount': 100.0,
         'reoccurrenceItem': {
            'reoccurrenceFrequency': 'Weekly',
            'recInstrID': 2050467,
            'reoccurrenceOccur': 12,
            'reoccOccurrencesLeft': 11,
            'reoccurrenceToDate': '2018-09-16T00:00:00',
            'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
         },
         'serviceProvider': 'CLC',
         'serviceProviderName': 'Cell C'
      },
      {
         'batchID': 2060015,
         'transactionID': 29117114,
         'capturedDate': '2017-09-20T00:00:00',
         'startDate': '2017-09-20T00:00:00',
         'nextTransDate': '2017-10-20T00:00:00',
         'beneficiaryID': 0,
         'sortCode': '196005',
         'bFName': 'UNKNOWN',
         'myDescription': 'test',
         'beneficiaryDescription': 'test',
         'fromAccount': { 'accountNumber': '1713277581' },
         'toAccount': { 'accountNumber': '1042853096', accountType: 'CA' },
         'amount': 100.0,
         'reoccurrenceItem': {
            'reoccurrenceFrequency': 'Weekly',
            'recInstrID': 2050467,
            'reoccurrenceOccur': 12,
            'reoccOccurrencesLeft': 1,
            'reoccurrenceToDate': '2018-09-16T00:00:00',
            'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
         },
         'serviceProvider': 'VGN',
         'serviceProviderName': 'Virgin'
      }];

   const mockServiceProvidersData: IServiceProvider[] = [
      {
         'serviceProviderCode': 'CLC',
         'serviceProviderName': 'Cell C'
      },
      {
         'serviceProviderCode': 'VDC',
         'serviceProviderName': 'Vodacom'
      },
      {
         'serviceProviderCode': 'VGN',
         'serviceProviderName': 'Virgin'
      }
   ];

   const accountServiceStub = {
      getScheduledTransfer: jasmine.createSpy('getScheduledTransfer').and.returnValue(Observable.of(mockScheduledData)),
      getScheduledMobileTrasactions: jasmine.createSpy('getScheduledMobileTrasactions').and.returnValue(Observable.of(mockScheduledData)),
      getScheduledPayment: jasmine.createSpy('getScheduledPayment').and.returnValue(Observable.of(mockScheduledData)),
   };

   const buyServiceStub = {
      getServiceProviders: jasmine.createSpy('getServiceProviders').and.returnValue(Observable.of(mockServiceProvidersData))
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [ScheduledCardComponent, SkeletonLoaderPipe, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceStub },
            { provide: BuyService, useValue: buyServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ScheduledCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

});
