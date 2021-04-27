import { NO_ERRORS_SCHEMA, Inject } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';

import { assertModuleFactoryCaching } from './../../../test-util';
import { AccountService } from '../../account.service';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { AddRecipientsComponent } from './add-recipients.component';

import { NotificationTypes } from '../../../core/utils/enums';
import {
   ISharedContact, ISharedAccount, ISharedRecipient,
   ISharedCustomer, IApiResponse, IClientDetails
} from '../../../core/services/models';

const mockClientDetails: IClientDetails = {
   DefaultAccountId: '2',
   CisNumber: 12000036423,
   FirstName: 'June',
   SecondName: 'Bernadette',
   Surname: 'Metherell',
   FullNames: 'Mrs June Bernadette Metherell',
   CellNumber: '+27994583427',
   EmailAddress: 'june@nedbank.co.za',
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

const mockSharedAccontDetails: ISharedAccount = {
   accountNumber: '1009017640',
   accountName: 'June Metherell',
   accountType: 'CA',
   branchCode: '17865'
};

const mockSharedContacts: ISharedContact[] = [{
   emailId: 'abc@abc.com',
   id: 1,
   isValidEmail: true
}, {
   emailId: 'abc@abc.com',
   id: 2,
   isValidEmail: true
}, {
   emailId: 'abc@abc.com',
   id: 3,
   isValidEmail: true
}, {
   emailId: 'abc@abc.com',
   id: 4,
   isValidEmail: true
}, {
   emailId: 'abc@abc.com',
   id: 5,
   isValidEmail: true
}, {
   emailId: 'abc@abc.com',
   id: 6,
   isValidEmail: true
}, {
   emailId: 'abc@abc.com',
   id: 7,
   isValidEmail: true
}, {
   emailId: 'abc@abc.com',
   id: 8,
   isValidEmail: true
}, {
   emailId: 'abc@abc.com',
   id: 9,
   isValidEmail: true
}
];

const mockInValidSharedContacts: ISharedContact[] = [{
   emailId: 'bob@',
   id: 1
}];

const mockSuccessMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'POA',
               result: 'R00',
               status: 'SUCCESS',
               reason: ''
            }
         ]
      }
   ]
};

const mockSFailedMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'POA',
               result: 'R23',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
};

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const mockAccountShareSuccessRes: IApiResponse = {
   data: [],
   metadata: mockSuccessMetadata
};

const mockAccountShareFailedRes: IApiResponse = {
   data: [],
   metadata: mockSFailedMetadata
};

const accountServiceSuccessStub = {
   shareAccount: jasmine.createSpy('shareAccount').and.returnValue(Observable.of(mockAccountShareSuccessRes))
};

const accountServiceFailedStub = {
   shareAccount: jasmine.createSpy('shareAccount').and.returnValue(Observable.of(mockAccountShareFailedRes))
};

const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('AddRecipientsComponent', () => {
   let component: AddRecipientsComponent;
   let fixture: ComponentFixture<AddRecipientsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [AddRecipientsComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceSuccessStub  },
            { provide: SystemErrorService, useValue: systemErrorServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(AddRecipientsComponent);
      component = fixture.componentInstance;
      component.sharedAccountDetails = mockSharedAccontDetails;
      component.clientDetails = mockClientDetails;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should populate default email', () => {
      expect(component.sharedContacts.length).toBe(1);
      expect(component.sharedContacts[0].emailId).toBe('june@nedbank.co.za');
   });

   it('should add another email and show remove email button', () => {
      component.addAnotherEmail();
      expect(component.sharedContacts.length).toBe(2);
      expect(component.showRemoveEmailBtn).toBe(true);
      expect(component.isAllEmailValid).toBe(false);
   });

   it('should hide the show add another email button if emails reaches the max emails limit', () => {
      expect(component.showAddEmailBtn).toBe(true);
      component.sharedContacts = mockSharedContacts;
      fixture.detectChanges();
      component.addAnotherEmail();
      expect(component.sharedContacts.length).toBe(10);
      expect(component.showAddEmailBtn).toBe(false);
   });

   it('should remove the email', () => {
      component.removeEmail(1);
      expect(component.sharedContacts.length).toBe(1);
      expect(component.showAddEmailBtn).toBe(true);
      expect(component.isAllEmailValid).toBe(true);
   });

   it('should send account details to recipients', () => {
      component.send();
      expect(component.shareStatus).toBe(NotificationTypes.Success);
   });

   it('should not be allow retry if it reaches limit', () => {
      component.retryCount = 3;
      component.onRetryAccountShare(true);
      expect(component.retryLimitExceeded).toBe(true);
      expect(component.requestInprogress).toBe(false);
      expect(component.shareStatus).toBe(NotificationTypes.None);
   });

   it('should in validate recipient email on change', () => {
      const index = 0;
      component.sharedContacts = mockInValidSharedContacts;
      component.onEmailChange(index, mockInValidSharedContacts[0]);
      expect(component.sharedContacts[index].isValidEmail).toBe(false);
      expect(component.isAllEmailValid).toBe(false);
   });

   it('should validate recipient email on change', () => {
      const index = 0;
      mockInValidSharedContacts[0].emailId = 'bob@bob.com';
      component.sharedContacts = mockInValidSharedContacts;
      component.onEmailChange(index, mockInValidSharedContacts[0]);
      expect(component.sharedContacts[index].isValidEmail).toBe(true);
      expect(component.isAllEmailValid).toBe(true);
   });

});

describe('AddRecipientsComponent', () => {
   let component: AddRecipientsComponent;
   let fixture: ComponentFixture<AddRecipientsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [AddRecipientsComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            { provide: AccountService, useValue: accountServiceFailedStub },
            { provide: SystemErrorService, useValue: systemErrorServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AddRecipientsComponent);
      component = fixture.componentInstance;
      component.sharedAccountDetails = mockSharedAccontDetails;
      component.clientDetails = mockClientDetails;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should fail to send account details to recipients', () => {
      component.send();
      expect(component.shareStatus).toBe(NotificationTypes.Error);
   });

   it('should throw error to send account details to recipients', () => {
      accountServiceFailedStub.shareAccount.and.returnValue(mockAccountServiceError);
      component.send();
      expect(component.shareStatus).toBe(NotificationTypes.Error);
   });

});


