import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../../test-util';
import { ColoredOverlayComponent } from './../../../../shared/overlays/colored-overlay/overlay.component';
import { SystemErrorService } from '../../../../core/services/system-services.service';
import { GaTrackingService } from '../../../../core/services/ga.service';
import { ClientProfileDetailsService } from '../../../../core/services/client-profile-details.service';
import { AccountService } from './../../../account.service';
import { RequestQuoteEmailComponent } from './request-quote-email.component';
import { IApiResponse, IClientDetails } from '../../../../core/services/models';
import { Constants } from '../../../../core/utils/constants';

const mockSuccessMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Settlement Quote',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const mockFailedMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'Settlement Quote',
               result: 'R23',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const mockSettlementFailedResponse: IApiResponse = {
   data: [],
   metadata: mockFailedMetadata
};

const mockSettlementSuccessResponse: IApiResponse = {
   data: [],
   metadata: mockSuccessMetadata
};

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const accountServiceStub = {
   sendSettlementQuote: jasmine.createSpy('sendSettlementQuote').and.returnValue(Observable.of(mockSettlementSuccessResponse)),
};

const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(Observable.of(null)),
   hideError: jasmine.createSpy('hideError').and.returnValue(Observable.of(null)),
   getError: jasmine.createSpy('getError').and.returnValue(Observable.of({ error: new Error('error') }))
};

const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);

const testComponent = class { };

const routerTestingStub = [
   { path: 'dashboard/account/detail/1', component: testComponent }
];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const mockClientDetails: IClientDetails = {
   DefaultAccountId: '2',
   CisNumber: 12000036423,
   FirstName: 'June',
   SecondName: 'Bernadette',
   Surname: 'Metherell',
   FullNames: 'Mrs June Bernadette Metherell',
   CellNumber: '+27994583427',
   EmailAddress: 'BOB@BOB.com',
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

const mockClientDetailsWithNoDefaultEmail: IClientDetails = {
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

const mockClientDetailsWithInValidDefaultEmail: IClientDetails = {
   DefaultAccountId: '2',
   CisNumber: 12000036423,
   FirstName: 'June',
   SecondName: 'Bernadette',
   Surname: 'Metherell',
   FullNames: 'Mrs June Bernadette Metherell',
   CellNumber: '+27994583427',
   EmailAddress: 'BOB',
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

const clientProfileDetailsSuccessServiceStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetails),
};

const accountTypes = Constants.VariableValues.accountTypes;

describe('RequestQuoteEmailComponent', () => {
   let component: RequestQuoteEmailComponent;
   let fixture: ComponentFixture<RequestQuoteEmailComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingStub)],
         declarations: [RequestQuoteEmailComponent, ColoredOverlayComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceStub },
            { provide: SystemErrorService, useValue: systemErrorServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsSuccessServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(RequestQuoteEmailComponent);
      component = fixture.componentInstance;
      component.accountId = '1';
      fixture.detectChanges();
      router = TestBed.get(Router);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should return true if recipient email is valid', () => {
      component.recipientEmail = 'test@test.com';
      expect(component.validate()).toBe(true);
   });

   it('should return false if recipient email is not valid', () => {
      component.recipientEmail = 'test@';
      expect(component.validate()).toBe(false);
   });

   it('should return false if recipeint email is not valid', () => {
      component.recipientEmail = undefined;
      expect(component.validate()).toBe(false);
   });

   it('should not navigate to account detail', () => {
      component.navigateFrom = 'DIRECT-PAY';
      spyOn(component.onClose, 'emit');
      component.closeOverlay();
      expect(component.onClose.emit).toHaveBeenCalledWith(true);
   });

   it('should not navigate to account detail if navigate from request from', () => {
      component.navigateFrom = 'REQUEST-QUOTE';
      spyOn(component.onClose, 'emit');
      component.closeOverlay();
      expect(component.onClose.emit).toHaveBeenCalledWith(true);
   });

   it('should navigate to account detail', () => {
      component.navigateFrom = undefined;
      const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay();
      expect(component.isOverlay).toBe(false);
      const url = spy.calls.first().args[0];
      expect(url).toBe(Constants.routeUrls.accountDetail + component.accountId);
   });

   it('should send quote to recipient email', () => {
      component.recipientEmail = 'test@test.com';
      fixture.detectChanges();
      component.send(event);
      expect(component.isSuccessPage).toBe(true);
      expect(component.isSettlementQuoteTemplate).toBe(false);
      expect(component.requestInProgress).toBe(false);
   });

   it('should not send quote to recipient email if email is invalid', () => {
      component.recipientEmail = 'test';
      spyOn(component, 'settlementQuote');
      fixture.detectChanges();
      component.send(event);
      expect(component.settlementQuote).not.toHaveBeenCalled();
   });

   it('should not send quote to recipient email for invalid response', () => {
      component.recipientEmail = 'test@test.com';
      accountServiceStub.sendSettlementQuote.and.returnValue(Observable.of(mockSettlementFailedResponse));
      fixture.detectChanges();
      component.send(event);
      expect(component.isSuccessPage).toBe(false);
   });

   it('should not send quote to recipient email If any error', () => {
      component.recipientEmail = 'test@test.com';
      accountServiceStub.sendSettlementQuote.and.returnValue(mockAccountServiceError);
      component.send(event);
      expect(component.isSuccessPage).toBe(false);
   });

   it('should call the system service close error method If any settlement service error while sending the quote', () => {
      component.recipientEmail = 'test@test.com';
      accountServiceStub.sendSettlementQuote.and.returnValue(mockAccountServiceError);
      component.send(event);
      expect(systemErrorServiceStub.closeError).toHaveBeenCalled();
      expect(component.isSuccessPage).toBe(false);
   });

   it('should retry to send quuote and increase the retry count to one', () => {
      component.onRetryQuote();
      expect(component.retryCount).toBe(1);
   });

   it('should retry to send quote and increase the retry count to two', () => {
      component.retryCount = 1;
      component.onRetryQuote();
      expect(component.retryCount).toBe(2);
      expect(component.retryLimitExceeded).toBe(true);
      expect(component.isOverlay).toBe(false);
   });

   it('should not be allow retry if it reaches limit', () => {
      component.retryCount = 3;
      component.onRetryQuote();
      expect(component.retryLimitExceeded).toBe(true);
   });

   it('should in validate recipient email on change', () => {
      component.onEmailChange('bob');
      expect(component.isValidEmail).toBe(false);
   });

   it('should validate recipient email on change', () => {
      component.onEmailChange('bob@bob.com');
      expect(component.isValidEmail).toBe(true);
   });

   it('should overlay button text to be equal to CANCEL and have place holder for MFC request quote email', () => {
      component.accountType = 'IS';
      component.ngOnInit();
      expect(component.btnTxt).toBe('Cancel');
      expect(component.placeHolder).toBe('Your email address');
   });

   it('should call the system service close error method If any settlement service error while sending the MFC quote', () => {
      component.recipientEmail = 'test@test.com';
      component.accountType = 'IS';
      accountServiceStub.sendSettlementQuote.and.returnValue(mockAccountServiceError);
      component.send(event);
      expect(systemErrorServiceStub.closeError).toHaveBeenCalled();
      expect(component.isSuccessPage).toBe(false);
   });

   it('should not send MFC quote to recipient email for invalid response', () => {
      component.recipientEmail = 'test@test.com';
      component.accountType = 'IS';
      accountServiceStub.sendSettlementQuote.and.returnValue(Observable.of(mockSettlementFailedResponse));
      fixture.detectChanges();
      component.send(event);
      expect(component.isSuccessPage).toBe(false);
   });

   it('should not send quote to recipient email if email is invalid', () => {
      component.recipientEmail = 'test';
      component.accountType = 'IS';
      spyOn(component, 'settlementQuote');
      fixture.detectChanges();
      component.send(event);
      expect(component.settlementQuote).not.toHaveBeenCalled();
   });

   it('should have place holder for MFC settlement quote', () => {
      component.accountType = 'IS';
      component.getPlaceHolder();
      expect(component.placeHolder).toBe('Your email address');
   });

   it('should have emprty place holder for Non MFC settlement quote', () => {
      component.accountType = 'PL';
      component.getPlaceHolder();
      expect(component.placeHolder).toBe('');
   });

   it('should have default valid email', () => {
      component.getDefaultEmail();
      expect(component.recipientEmail).toBe('BOB@BOB.com');
      expect(component.isValidEmail).toBe(true);
   });

   it('should have No default email', () => {
      clientProfileDetailsSuccessServiceStub.getClientPreferenceDetails.and.returnValue(mockClientDetailsWithNoDefaultEmail);
      component.getDefaultEmail();
      expect(component.recipientEmail).toBe('');
      expect(component.isValidEmail).toBe(false);
   });

   it('should have default in-valid email', () => {
      clientProfileDetailsSuccessServiceStub.getClientPreferenceDetails.and.returnValue(mockClientDetailsWithInValidDefaultEmail);
      component.getDefaultEmail();
      expect(component.recipientEmail).toBe('BOB');
      expect(component.isValidEmail).toBe(false);
   });

   it('should overlay button text to be equal to CANCEL and have place holder for HL request quote email', () => {
      component.accountType = 'HL';
      component.ngOnInit();
      expect(component.btnTxt).toBe('Cancel');
      expect(component.placeHolder).toBe('');
   });

   it('should send mfc loan settlement quote', () => {
      component.accountType = 'IS';
      accountServiceStub.sendSettlementQuote.and.returnValue(Observable.of(mockSettlementSuccessResponse));
      component.sendSettlementQuote();
   });

   it('should send home loan settlement quote', () => {
      component.accountType = 'HL';
      accountServiceStub.sendSettlementQuote.and.returnValue(Observable.of(mockSettlementSuccessResponse));
      component.sendSettlementQuote();
   });

   it('should try again button text change to dismiss once hl settlement quote send reaches to the limit', () => {
      component.retryCount = 1;
      component.accountType = accountTypes.homeLoanAccountType.code;
      component.onRetryQuote();
      expect(component.retryBtnText).toBe('Dismiss');
   });

});
