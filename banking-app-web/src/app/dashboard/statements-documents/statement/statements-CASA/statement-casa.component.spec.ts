import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatementCasaComponent } from './statement-casa.component';
import { assertModuleFactoryCaching } from '../../../../test-util';
import { AccountService } from '../../../account.service';
import { GaTrackingService } from '../../../../core/services/ga.service';
import {
   IDashboardAccount, IStatementDownload, IStatementSearchRow, ITransactionDetail,
   IStatementDownloadDetails
} from '../../../../core/services/models';
import { Constants } from '../../../../core/utils/constants';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

const mockAccount: IDashboardAccount = {
   AccountName: 'EARLSMERE',
   Balance: 0.0,
   AvailableBalance: 0.0,
   AccountNumber: 1338054201,
   AccountType: 'CA',
   AccountIcon: '',
   NewAccount: true,
   LastUpdate: '2018-06-26 07:05:20 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '6',
   InterestRate: 0.0,
   IsShow: false,
   IsProfileAccount: true,
   ProductType: ' ',
   Pockets: []
};
const mockSearchRow: IStatementSearchRow[] = [
   {
      'accountNumber': '1338054201',
      'startDate': new Date('2018-05-18T22:00:00.000Z'),
      'documentClass1': 'ARRANGEMENT',
      'documentClass2': 'MAINTENANCE',
      'documentType': 'STATEMENT',
      'effectiveDate': '2018-06-19',
      'effectiveTime': '2018-06-19T22:00:00.000Z',
      'documentStatus': 'APPROVED',
      'documentUrl': `ENCRYPTED_mainKey_%2FmNn4qW2GIg4nS4m4tH2QA%3D%3D_AsYWypnvwIgZ0n10FeDtw5HVNnCxhJXrJPkL
   ewFlJR301%2BFcxq8Ct5PGfyg1iWov4VkayHZOUxvSAiQy6PG7aJMHlSqTsiQPZkbIuFQmEpjIVXD89kh0gNBfbe%2FB9N8Pm8J
   ciWm2HE5FMdSn9jqCUSH4MUCL7U4j6PQVsQOZCNs%2BTDM3%2BNtlKcfbHZ8fnTASlB1rW348aUJn7MfQP497MRsnUqo4NlmgT%
   2BFJbTkhylnmmTN5aPg7IA52rAJ%2B2JRJ`
   },
   {
      'accountNumber': '1338054201',
      'startDate': new Date('2018-06-19T22:00:00.000Z'),
      'documentClass1': 'ARRANGEMENT',
      'documentClass2': 'MAINTENANCE',
      'documentType': 'STATEMENT',
      'effectiveDate': '2018-07-19',
      'effectiveTime': '2018-07-19T22:00:00.000Z',
      'documentStatus': 'APPROVED',
      'documentUrl': `ENCRYPTED_mainKey_jD1qcyk2iAGctAAxqm5mqg%3D%3D_vjlQuGaZ8%2FD1mVYUG%2FtmSXpz9yINTa2w
   fsPMWVdJar8gybrdkl2muuzQHS2Y8Vh3pKApwEgeYHoC%2B40Hudfoz43XugNPoNd%2F1I531Gjl%2B6QQSc0Kqu4ioaH0y7VcB
   8EoFORhmoebz2Bc80K7n%2F1z7tYS8%2Fa0aG4kVRBO83b8IQ99QVbrHQ7HXf%2BrfZHo9Sdi7zO2p%2FgiSC2cSpJRkfoI6eiH
   KUbcYXIfSuX2SAVxBjClpskN8rsFAR2GOsdNLTcH`
   }
];
const mockDownloadData: IStatementDownload = {
   'resultCode': 'ECS-SERVICE-SEARCH-000',
   'resultMessage': 'Results found',
   'documentSearchResultRowList': mockSearchRow
};

const mockEmptyDownloadData: IStatementDownload = {
   'resultCode': 'ECS-SERVICE-SEARCH-000',
   'resultMessage': 'Results found',
   'documentSearchResultRowList': []
};

const statementMonth: IStatementDownloadDetails = {
   date: 'June 2018',
   download: true,
   month: '07',
   year: '2018'
};

const mockAccountTransactions: ITransactionDetail[] = [{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: -2000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2017-07-30 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
},
{
   TransactionId: '0261d5b9-066d-405a-b7be-b4b7dc47d1aa',
   Description: 'PAYMENT - THANK YOU',
   Amount: 1000,
   Debit: false,
   Account: '377093000052084',
   PostedDate: '2018-07-29 02:00:00 AM',
   CategoryId: 0,
   ChildTransactions: [],
   OriginalCategoryId: 0,
   RunningBalance: 1000
}
];

const mockBlobData = {
   data: 'fhgfhf gdfgdfgdfg fgdfgdfgdfgdfgdfgdfgdfgdfgdfgdfgsfdsdfsdfsdfsdfsdfsdfsdfs'
};

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const mockEmptyAccountTransactions: ITransactionDetail[] = [];

const accountServiceStub = {
   getStatementDownload: jasmine.createSpy('getStatementDownload').and.returnValue(Observable.of(mockDownloadData)),
   getAdvancedSearchData: jasmine.createSpy('getAdvancedSearchData').and.returnValue(Observable.of(mockAccountTransactions)),
   getStartDateStatement: jasmine.createSpy('getStartDateStatement').and.returnValue(Observable.of(mockBlobData)),
   showAlertMessage: jasmine.createSpy('showAlertMessage').and.returnValue(true),
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccount)
};

const fromDate = new Date('2018-09-19T22:00:00.000Z');
const toDate = new Date('2018-06-19T22:00:00.000Z');

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('StatementCasaComponent', () => {
   let component: StatementCasaComponent;
   let fixture: ComponentFixture<StatementCasaComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [StatementCasaComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StatementCasaComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set correct date if month is February', () => {
      component.monthsToBeShown = [1, 0, -1];
      component.getDates();
      expect(component.monthsToBeShown[2]).toBe(11);
   });
   it('should set correct date if month is January', () => {
      component.monthsToBeShown = [0, -1, -2];
      component.getDates();
      expect(component.monthsToBeShown[1]).toBe(11);
      expect(component.monthsToBeShown[2]).toBe(10);
   });
   it('should set statement mode to PDF upon clicking PDF tab', () => {
      const type = { value: 'PDF' };
      component.onStatementChange(type);
      expect(component.statementMode).toEqual('PDF');
      expect(component.isListingView).toBe(false);
   });

   it('should set statement mode to CSV upon clicking CSV tab', () => {
      const type = { value: 'CSV' };
      component.onStatementChange(type);
      expect(component.statementMode).toEqual('CSV');
      expect(component.isListingView).toBe(true);
   });

   it('should check invalid from date when fromDate is provided', () => {
      component.setFromDate(fromDate);
      expect(component.invalidFromDate).toBe(false);
   });

   it('should check invalid from date when toDate is provided', () => {
      component.setToDate(toDate);
      expect(component.invalidFromDate).toBe(false);
   });

   it('should check valid from date when fromDate is provided', () => {
      const fromdate = new Date('2018-09-19T22:00:00.000Z');
      component.toDateChange = new Date('2018-07-19T22:00:00.000Z');
      component.setFromDate(fromdate);
      expect(component.invalidFromDate).toBe(true);
   });

   it('should check valid from date when toDate is provided', () => {
      const todate = new Date('2018-07-19T22:00:00.000Z');
      component.fromDateChange = new Date('2018-09-19T22:00:00.000Z');
      component.setToDate(toDate);
      expect(component.invalidFromDate).toBe(true);
   });

   it('should set isstatement flag to false when statement download response is empty', () => {
      accountServiceStub.getStatementDownload.and.returnValue(Observable.of(mockEmptyDownloadData));
      component.statementDownload();
      expect(component.isStatement).toBe(false);
   });

   it('should download the data in CSV', () => {
      component.toDateChange = new Date('2018-07-19T22:00:00.000Z');
      component.fromDateChange = new Date('2018-09-19T22:00:00.000Z');
      const startdate = moment(this.fromDateChange).format(Constants.formats.momentYYYYMMDD);
      const endDate = moment(this.toDateChange).format(Constants.formats.momentYYYYMMDD);
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactions));
      component.downloadStatementCASA();
      expect(component.showLoader).toBe(false);
   });

   it('should display error message when empty response', () => {
      const showErrorMessage = {
         showAlert: true,
         displayMessageText: component.labelValues.noDownloadErroMessageForCSV,
         action: 2,
         alertType: 3,
      };
      const startdate = moment(this.fromDateChange).format(Constants.formats.momentYYYYMMDD);
      const endDate = moment(this.toDateChange).format(Constants.formats.momentYYYYMMDD);
      component.toDateChange = new Date('2018-07-19T22:00:00.000Z');
      component.fromDateChange = new Date('2018-09-19T22:00:00.000Z');
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockEmptyAccountTransactions));
      component.downloadStatementCASA();
      accountServiceStub.showAlertMessage(component.getErrorMessage());
      expect(component.showLoader).toBe(false);
   });

   it('should set show loader to be false when service fails', () => {
      accountServiceStub.getAdvancedSearchData.and.returnValue(mockAccountServiceError);
      component.downloadStatementCASA();
      expect(component.showLoader).toBe(false);
   });

   it('should download pdf', () => {
      component.documentSearchResultRowList = mockSearchRow;
      accountServiceStub.getAdvancedSearchData.and.returnValue(Observable.of(mockAccountTransactions));
      accountServiceStub.getStartDateStatement.and.returnValue(Observable.of(mockBlobData));
      component.statementDownload();
      const fs = require('file-saver/FileSaver');
      spyOn(fs, 'saveAs');
      component.startDateStatement(statementMonth);
      expect(fs.saveAs).toHaveBeenCalled();
   });

});
