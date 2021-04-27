import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../../../account.service';
import { SystemErrorService } from '../../../../../core/services/system-services.service';
import { WorkflowService } from '../../../../../core/services/stepper-work-flow-service';
import { GaTrackingService } from '../../../../../core/services/ga.service';
import { ClientProfileDetailsService } from '../../../../../core/services/client-profile-details.service';
import { EmailComponent } from './email.component';
import { ICrossBorderRequest, IApiResponse, ITransactionMetaData, IClientDetails } from '../../../../../core/services/models';
import { NotificationTypes } from '../../../../../core/utils/enums';
import { IStepper } from '../../../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { Constants } from '../../../../../core/utils/constants';
import { assertModuleFactoryCaching } from '../../../../../test-util';

const systemErrorServiceStub = {
   raiseError: jasmine.createSpy('raiseError'),
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

const mockCrossBorderRequest: ICrossBorderRequest = {
   itemAccountId: '7',
   documentType: 'mfccrossborderletter',
   crossBorder: {
      countries: [
         {
            name: 'Mozambique'
         }
      ],
      dateOfLeaving: '2018-08-22',
      dateOnReturn: '2018-08-27',
      licensePlateNumber: 'Uma',
      insuranceCompanyName: 'FORBES',
      insurancePolicyNumber: '123456',
      driverDetails: [
         {
            name: 'BOB',
            surname: 'JAMES',
            driverLicenseNumber: 'DLN',
            idOrPassportNumber: 'PN'
         }
      ]
   },
   emailId: 'bob@nedbank.co.za'
};

const mockSuccessMetadata: ITransactionMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'mfccrossborderletter',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const mockFailureMetadata: ITransactionMetaData = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'mfccrossborderletter',
               result: 'R00',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const mockCrossBorderRequestSuccessResponse: IApiResponse = {
   data: {},
   metadata: mockSuccessMetadata
};

const mockCrossBorderRequestFailureResponse: IApiResponse = {
   data: {},
   metadata: mockFailureMetadata
};

const accountServiceStub = {
   getMfcCrossBorderRequest: jasmine.createSpy('getMfcCrossBorderRequest').and.returnValue(mockCrossBorderRequest),
   sendCrossBorderRequest: jasmine.createSpy('sendCrossBorderRequest').and.returnValue(Observable.of(mockCrossBorderRequestSuccessResponse))
};

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const notificationTypes = NotificationTypes;

const navigationSteps: string[] = Constants.labels.buildingLoan.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

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

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('Document Request EmailComponent', () => {
   let component: EmailComponent;
   let fixture: ComponentFixture<EmailComponent>;
   let router: Router;
   let workflowService: WorkflowService;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [EmailComponent],
         providers: [WorkflowService,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: SystemErrorService, useValue: systemErrorServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsSuccessServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(EmailComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should overlay be visible', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(component.isOverlayVisible).toBe(false);
      expect(url).toBe('/dashboard/account/statement-document/7');
   });

   it('should send cross border request', () => {
      component.onRequest();
      expect(component.status).toBe(notificationTypes.Success);
   });

   it('should not send cross border request If API returns failure', () => {
      accountServiceStub.sendCrossBorderRequest.and.returnValue(Observable.of(mockCrossBorderRequestFailureResponse));
      component.onRequest();
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should not send cross border request', () => {
      accountServiceStub.sendCrossBorderRequest.and.returnValue(mockAccountServiceError);
      component.onRequest();
      expect(component.status).toBe(notificationTypes.Error);
   });

   it('should not be allow retry if it reaches limit', () => {
      component.retryCount = 3;
      component.onRetryRequest(true);
      expect(component.retryLimitExceeded).toBe(true);
   });

   it('should be return true for valid email', () => {
      component.onEmailChange('bob@bob');
      expect(component.isValidEmail).toBe(false);
   });

   it('should be return false for invalid email', () => {
      component.onEmailChange('bob@bob.com');
      expect(component.isValidEmail).toBe(true);
   });

   it('should be return false for invalid email', () => {
      component.onEmailChange('bob@bob.com');
      expect(component.isValidEmail).toBe(true);
   });

   it('should close the overlay', () => {
      component.onRetryRequest(false);
      expect(component.isOverlayVisible).toBe(false);
   });

   it('should be navigate to next stepper', inject([WorkflowService], (service: WorkflowService) => {
      spyOn(service.stepClickEmitter, 'emit');
      component.onNextClick();
      expect(service.stepClickEmitter.emit).toHaveBeenCalled();
   }));

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

});
