import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { AccountService } from '../../account.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { StatementComponent } from './statement.component';
import { assertModuleFactoryCaching } from '../../../test-util';
import { IClientDetails, IApiResponse } from '../../../core/services/models';

const mockClientDetails: IClientDetails = {
   DefaultAccountId: '2',
   CisNumber: 12000036423,
   FirstName: 'June',
   SecondName: 'Bernadette',
   Surname: 'Metherell',
   FullNames: 'Mrs June Bernadette Metherell',
   CellNumber: '+27994583427',
   EmailAddress: '',
   BirthDate: '1957-04-04T22:00:00Z',
   FicaStatus: 701,
   SegmentId: 'CEBZZZ',
   IdOrTaxIdNo: 5704050086083,
   SecOfficerCd: '11905',
   AdditionalPhoneList: [{
      AdditionalPhoneType: 'BUS',
      AdditionalPhoneNumber: '(011) 4729828'
   }, {
      AdditionalPhoneType: 'CELL',
      AdditionalPhoneNumber: '+27994583427'
   }, {
      AdditionalPhoneType: 'HOME',
      AdditionalPhoneNumber: '(011) 4729828'
   }],
   Address: {
      AddressLines: [{
         AddressLine: '4 OLGA STREET'
      }, {
         AddressLine: 'FLORIDA EXT 4'
      }, {
         AddressLine: 'FLORIDA'
      }],
      AddressPostalCode: '01709'
   }
};

const mockResponse: IApiResponse = {
   data: {},
   metadata:
   {
      resultData: [
         {
            resultDetail:
               [{
                  operationReference: 'PaidUpLetter',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'Paid Up Letter Send Successfully'
               }]
         }]
   }
};

const mockErrorResponse: IApiResponse = {
   data: {},
   metadata:
   {
      resultData: [
         {
            resultDetail:
               [{
                  operationReference: 'PaidUpLetter',
                  result: 'R02',
                  status: 'error',
                  reason: 'Paid Up Letter Send Successfully'
               }]
         }]
   }
};

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const accountServiceSuccessStub = {
   sendPaidUpLetter: jasmine.createSpy('sendPaidUpLetter').and.returnValue(Observable.of(mockResponse)),
   showAlertMessage: jasmine.createSpy('showAlertMessage').and.returnValue([]),
   isTransactionDetailsSuccess: jasmine.createSpy('isTransactionDetailsSuccess').and.returnValue(true)
};


const clientProfileDetailsSuccessServiceStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetails),
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('StatementComponent', () => {
   let component: StatementComponent;
   let fixture: ComponentFixture<StatementComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [StatementComponent],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [SystemErrorService,
            { provide: AccountService, useValue: accountServiceSuccessStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsSuccessServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StatementComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should set from date', () => {
      const date = new Date();
      component.setFromDate(date);
      expect(component.fromDate).toBe(date);
   });

   it('should set to date', () => {
      const date = new Date();
      component.setToDate(date);
      expect(component.toDate).toBe(date);
   });

   it('should validate email address', () => {
      component.email = 'abc@nedbank.co.za';
      component.emailChange();
      expect(component.isEmailValid).toBe(true);
   });

   it('should be send document request', () => {
      component.showLoader = false;
      component.isEmailValid = true;
      component.validDate = true;
      component.accountType = 'IS';
      component.sendStatementEmail();
      expect(component.showLoader).toBe(false);
   });

   it('should be send document request for other account type', () => {
      component.showLoader = false;
      component.isEmailValid = true;
      component.validDate = true;
      component.accountType = 'HL';
      component.sendStatementEmail();
      expect(component.showLoader).toBe(false);
   });

   it('should show loader false if response is blank', () => {
      accountServiceSuccessStub.sendPaidUpLetter.and.returnValue(Observable.of(mockErrorResponse));
      accountServiceSuccessStub.isTransactionDetailsSuccess.and.returnValue(false);
      component.showLoader = false;
      component.isEmailValid = true;
      component.validDate = true;
      component.accountType = 'PL';
      component.sendStatementEmail();
      expect(component.showLoader).toBe(false);
   });

   it('should be show error message if API is fail', () => {
      accountServiceSuccessStub.sendPaidUpLetter.and.returnValue(mockAccountServiceError);
      component.showLoader = false;
      component.isEmailValid = true;
      component.validDate = true;
      component.sendStatementEmail();
      expect(component.showLoader).toBe(false);
   });

   it('should set title and info message if account is mfc', () => {
      component.accountType = 'IS';
      component.getMfcInfo();
      expect(component.title).toBe('Latest statement');
   });

   it('should create request object for mfc account send email', () => {
      component.isMfcStatement = true;
      component.getRequest();
      expect(component.request.documentType).toBe('mfcstatement');
   });

   it('should create request object for mfc account send email', () => {
      component.isMfcStatement = true;
      component.getSuccessMessage();
      expect(component.alertMessage.showAlert).toBe(true);
   });
});
