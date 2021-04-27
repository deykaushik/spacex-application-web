import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AccountService } from '../../account.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { DocumentsComponent } from './documents.component';
import { DocumentEmailComponent } from './document-email/document-email.component';
import { BottomButtonComponent } from '../../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { assertModuleFactoryCaching } from '../../../test-util';
import { IClientDetails, IDocumentList } from '../../../core/services/models';

const mockClientDetails: IClientDetails = {
   DefaultAccountId: '2',
   CisNumber: 12000036423,
   FirstName: 'June',
   SecondName: 'Bernadette',
   Surname: 'Metherell',
   FullNames: 'Mrs June Bernadette Metherell',
   CellNumber: '+27994583427',
   EmailAddress: 'abc@nedbank.co.za',
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

const accountServiceSuccessStub = {
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

const mockDocumentListForPLDocument: IDocumentList[] = [{
   documentDescription: 'Paid-Up Letter',
   documentType: 'PLPaidUpLetter',
   isDocumentClick: false
}];

const clientProfileDetailsSuccessServiceStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetails),
};

const documentListStub: IDocumentList[] = [{
   documentDescription: 'Paid up letter',
   documentType: 'paidUpLetter',
   isDocumentClick: false
},
{
   documentDescription: 'Letter of home loan',
   documentType: 'homeLoanLetter',
   isDocumentClick: false
}, {
   documentDescription: 'Cross Border Letter',
   documentType: 'mfccrossborderletter',
   isDocumentClick: false
}];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('DocumentsComponent', () => {
   let component: DocumentsComponent;
   let fixture: ComponentFixture<DocumentsComponent>;
   let router: Router;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [DocumentsComponent, DocumentEmailComponent, BottomButtonComponent, SpinnerComponent],
         providers: [SystemErrorService,
            { provide: AccountService, useValue: accountServiceSuccessStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsSuccessServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(DocumentsComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be set default mail return by API', () => {
      component.documentList = mockDocumentListForPLDocument;
      component.ngOnInit();
      expect(component.email).toBe('abc@nedbank.co.za');
   });

   it('should toggle paid up letter paper', () => {
      component.documentList = documentListStub;
      component.accountType = 'IS';
      component.toggleDocumentType(1);
      expect(component.documentList[0].isDocumentClick).toBe(false);
   });

   it('should overlay be visible', () => {
      component.itemAccountId = '7';
      component.documentList = documentListStub;
      const spy = spyOn(router, 'navigateByUrl');
      component.accountType = 'HL';
      component.toggleDocumentType(2);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard/account/statement-document/cross-border/7');
   });

   it('should document click to be true for mfc account', () => {
      component.documentList = documentListStub;
      component.accountType = 'IS';
      component.toggleDocumentType(1);
      expect(component.documentList[0].isDocumentClick).toBe(false);
   });
});
