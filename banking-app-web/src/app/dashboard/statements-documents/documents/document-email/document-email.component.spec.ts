import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from '../../../../test-util';
import { AccountService } from '../../../account.service';
import { SystemErrorService } from '../../../../core/services/system-services.service';
import { GaTrackingService } from '../../../../core/services/ga.service';
import { DocumentEmailComponent } from './document-email.component';
import { BottomButtonComponent } from '../../../../shared/controls/buttons/bottom-button.component';
import { IApiResponse } from '../../../../core/services/models';

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

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('DocumentEmailComponent', () => {
   let component: DocumentEmailComponent;
   let fixture: ComponentFixture<DocumentEmailComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [DocumentEmailComponent, BottomButtonComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [SystemErrorService,
            { provide: AccountService, useValue: accountServiceSuccessStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DocumentEmailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should validate email address', () => {
      component.email = 'abc@nedbank.co.za';
      component.emailChange();
      expect(component.isEmailValid).toBe(true);
   });

   it('should emit toggle value', () => {
      spyOn(component.toggleDocumentType, 'emit');
      component.closeToggleDocumentType(4);
      expect(component.toggleDocumentType.emit).toHaveBeenCalled();
   });

   it('should be send document request', () => {
      component.showLoader = false;
      component.isEmailValid = true;
      component.accountType = 'HL';
      component.title = 'Copy of loan agreement';
      component.sendEmail();
      expect(component.showLoader).toBe(false);
   });

   it('should be send document request for mfc account', () => {
      component.showLoader = false;
      component.isEmailValid = true;
      component.accountType = 'IS';
      component.title = 'Copy of registration';
      component.sendEmail();
      expect(component.alertMessage.showAlert).toBe(true);
   });

   it('should show loader false if response is blank', () => {
      accountServiceSuccessStub.sendPaidUpLetter.and.returnValue(Observable.of(mockErrorResponse));
      accountServiceSuccessStub.isTransactionDetailsSuccess.and.returnValue(false);
      component.showLoader = false;
      component.isEmailValid = true;
      component.sendEmail();
      expect(component.showLoader).toBe(false);
   });

   it('should be show error message if API is fail', () => {
      accountServiceSuccessStub.sendPaidUpLetter.and.returnValue(mockAccountServiceError);
      component.showLoader = false;
      component.isEmailValid = true;
      component.sendEmail();
      expect(component.showLoader).toBe(false);
   });

   it('should be set info message for pl account', () => {
      component.accountType = 'PL';
      component.ngOnInit();
      expect(component.errorMessage).toBe('Your request for a paid-up letter could unfortunately not be processed');
   });

   it('should be set info message for hl account', () => {
      component.accountType = 'HL';
      component.title = 'Paid up letter';
      component.ngOnInit();
      expect(component.errorMessage).toBe('Your request for a paid up letter could unfortunately not be processed');
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

   it('should be set info message for IS account', () => {
      component.accountType = 'IS';
      component.title = 'Tax certificate';
      component.ngOnInit();
      expect(component.errorMessage).toBe('Your request for a tax certificate could unfortunately not be processed.');
   });

   it('should create request body', () => {
      component.isMfcTaxCertificate = true;
      component.documentType = 'mfctaxcertificate';
      component.getRequest();
      expect(component.request.documentType).toBe(component.documentType);
   });

   it('should return true if to date is less than from date', () => {
      const date = new Date();
      component.fromDate = date;
      component.setToDate(date);
      expect(component.validDate).toBe(true);
   });

});
