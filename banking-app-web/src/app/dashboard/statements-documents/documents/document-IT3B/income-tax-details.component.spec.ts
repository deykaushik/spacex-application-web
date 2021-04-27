import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomeTaxDetailsComponent } from './income-tax-details.component';
import { IDashboardAccount, IDashboardAccounts, IIncomeTaxResponse, IIncomeTaxResponseData } from '../../../../core/services/models';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../account.service';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { assertModuleFactoryCaching } from '../../../../test-util';
import { GaTrackingService } from '../../../../core/services/ga.service';

const mockAccountData: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
},
{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0
}];

const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccountData,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];

const mockScheduledData: IIncomeTaxResponse[] = [{
   'accountNumber': 37683506,
   'partyNumber': 110017270200,
   'documentClass1': 'ARRANGEMENT',
   'documentClass2': 'MAINTENANCE',
   'documentClass3': 'INVESTMENT',
   'documentType': 'TAX_CERTIFICATE',
   'documentTitle': '',
   'effectiveDate': new Date('2017-02-27'),
   'effectiveTime': new Date('2017-02-27T22:00:00.000Z'),
   'documentStatus': 'APPROVED',
   'documentUrl': `ENCRYPTED_mainKey_1fp7rzQZqOVow%2FenEmCDHg%3D%3D_RHAr1R3W5LkensMdT8cn2l0lsrh0Pi5G%2FenYVLvW4gsKtPG9i4Yul7
                  3oZYiiuYiqBMnRX1ZDwAX1vJy9FIaAivnYO4O6qCFEi6AxZxQanGBDZnV41YFambWO8%2Fwyo4O3fC%2FJQvl2hL%2BCyFnD%2Fp0UFuQL
                  d0AURQppsG6Zn%2FlvxJtQU9TnMnHggNbxn5KtvkinLGTMFBjCiBsryXL5BsQ2wwxKUlLvccEVnrjZXCd85gB9f8igIfFMPnOak4kzv%2BL0`
},
{
   'accountNumber': 37683506,
   'partyNumber': 110017270200,
   'documentClass1': 'ARRANGEMENT',
   'documentClass2': 'MAINTENANCE',
   'documentClass3': 'INVESTMENT',
   'documentType': 'TAX_CERTIFICATE',
   'documentTitle': '',
   'effectiveDate': new Date('2016-02-27'),
   'effectiveTime': new Date('2016-02-27T22:00:00.000Z'),
   'documentStatus': 'APPROVED',
   'documentUrl': `ENCRYPTED_mainKey_pXF9Ru21EKw%2FPzw0AFZlxQ%3D%3D_28IAt3jhDKug9ASuakvhOPatOLg1EFvlwE93HusGXN70Lpnm0BnyqvHRLtmV
   ZVDK88kNZucR1ld9WGynV1cfftyS6K%2BRR9iLX%2BWuzcaIZ1JxBndygLzTAv8BY2O%2B%2F8CUwQOr0HRiKbPIgGr2n1J6Q1h64TNstBFfwnyQq1guexxQ0WwbDe
   moC7Z4R6aiSETValCcUN4S1x0%2F3fYjwX46TdfWdSg5qYhDHzj%2F7%2F4WWXfD56ZmqRA9fEXr%2F2MBeUl2`
}];

const mockAPIResponse: IIncomeTaxResponseData = {
   'resultCode': 'ECS-SERVICE-SEARCH-000',
   'resultMessage': 'Results found',
   'documentSearchResultRowList': mockScheduledData
};
const mockEmptyAPIResponse: IIncomeTaxResponseData = {
   'resultCode': 'ECS-SERVICE-SEARCH-000',
   'resultMessage': 'Results found',
   'documentSearchResultRowList': []
};
const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});
const mockBlob = new Blob;

const accountServiceStub = {
   getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockDashboardAccounts)),
   setAccountData: jasmine.createSpy('setAccountData'),
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData[0]),
   getStartDateStatement: jasmine.createSpy('getStartDateStatement').and.returnValue(Observable.of(true)),
   getIncomeTaxAllYearDetails: jasmine.createSpy('getIncomeTaxAllYearDetails').and.returnValue(Observable.of(mockAPIResponse)),
   downloadPDF: jasmine.createSpy('downloadPDF').and.returnValue(Observable.of(mockBlob)),
   getIncomeTaxInvoice: jasmine.createSpy('getIncomeTaxInvoice').and.returnValue(Observable.of(true)),
   getIncomeTaxYears: jasmine.createSpy('getIncomeTaxYears').and.returnValue(Observable.of(mockAPIResponse))
};

const gaTrackingServiceStub = {
      sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('IncomeTaxDetailsComponent', () => {
   let component: IncomeTaxDetailsComponent;
   let fixture: ComponentFixture<IncomeTaxDetailsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [SharedModule],
         declarations: [IncomeTaxDetailsComponent],
         providers: [{ provide: AccountService, useValue: accountServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: '1' }) } }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(IncomeTaxDetailsComponent);
      component = fixture.componentInstance;
      component.accountNumber = '1234567';
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be created when there is no data in service', () => {
      component.availableYears = [2015, 2016, 2017];
      accountServiceStub.getAccountData.and.returnValue(undefined);
      expect(component).toBeTruthy();
   });

   it('should verify the get Income Tax Years Data', () => {
      component.getIncomeTaxYearsData();
      expect(component.itYearsData.length).toBe(2);
   });

   it('should verify the get Income Tax Years Data verify response', () => {
      component.itYearsData = mockScheduledData;
      component.getIncomeTaxYearsData();
      expect(component.itYearsData).toBe(mockScheduledData);
   });

   it('should verify the find And Download IT3B loader is set to off.', () => {
      component.availableYears = [2015, 2016, 2017];
      component.accountNumber = '1234567';
      component.itYearsData = mockScheduledData;
      component.getIncomeTaxYearsData();
      expect(component.showLoader).toBe(false);
   });

   it('should return false if showtable is true.', () => {
      component.showTable = true;
      component.toggleDetail();
      expect(component.showTable).toBe(false);
   });

   it('should return true if showtable is false.', () => {
      component.showTable = false;
      component.toggleDetail();
      expect(component.showTable).toBe(true);
   });

   it('should set is statement flag to false if avilabel year is empty', () => {
      component.availableYears = [];
      accountServiceStub.getIncomeTaxYears.and.returnValue(Observable.of(mockEmptyAPIResponse));
      component.getIncomeTaxYearsData();
      expect(component.isStatement).toBe(false);
      expect(component.showLoader).toBe(false);
   });

   it('should set showloader and is statement flag to false if service gives errro', () => {
      component.availableYears = [];
      accountServiceStub.getIncomeTaxYears.and.returnValue(mockAccountServiceError);
      component.getIncomeTaxYearsData();
      expect(component.isStatement).toBe(false);
      expect(component.showLoader).toBe(false);
   });

   it('should call is investment account', () => {
      component.accountNumber = '1234567-1234';
      fixture.detectChanges();
      component.isInvestmentAccount();
      expect(component.accountNumber).toBe('1234567');
   });

   it('should call downloadIT3B', () => {
      component.itYearsData = mockScheduledData;
      const fs = require('file-saver/FileSaver');
      spyOn(fs, 'saveAs');
      component.downloadIT3B(0);
      expect(fs.saveAs).toHaveBeenCalled();
   });
});
