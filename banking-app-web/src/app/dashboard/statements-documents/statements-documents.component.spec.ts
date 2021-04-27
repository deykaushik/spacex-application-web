import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs/';
import { BsModalService } from 'ngx-bootstrap';
import { AccountService } from '../account.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { SystemErrorService } from '../../core/services/system-services.service';
import { LoaderService } from '../../core/services/loader.service';
import { StatementsDocumentsComponent } from './statements-documents.component';
import { DocumentsComponent } from './documents/documents.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { MessageAlertComponent } from '../../shared/components/message-alert/message-alert.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { ToggleTabGroupComponent } from '../../shared/controls/toggle-tab-group/toggle-tab-group.component';
import { DocumentEmailComponent } from './documents/document-email/document-email.component';
import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';
import { IDocumentList, IClientDetails, IDashboardAccount, IAlertMessage, IApiResponse } from '../../core/services/models';
import { assertModuleFactoryCaching } from '../../test-util';
import { GaTrackingService } from '../../core/services/ga.service';

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

const mockClientAccountDetails: IDashboardAccount = {
   AccountName: 'Personal Loan',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'PL',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
};

const mockInvData: IDashboardAccount = {
   AccountName: 'Inv INV',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'INV',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
};

const mockMfcData: IDashboardAccount = {
   AccountName: 'Inv MFC',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'MFC',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
};


const mockCCData: IDashboardAccount = {
   AccountName: 'Inv CC',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'CC',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
};

const mockDSData: IDashboardAccount = {
   AccountName: 'Inv DS',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'DS',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
};

const mockSAData: IDashboardAccount = {
   AccountName: 'Inv SA',
   Balance: 0,
   AvailableBalance: 0,
   AccountNumber: 1009017640,
   AccountType: 'SA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
};

const mockCAData: IDashboardAccount = {
   AccountName: 'Inv CA',
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
};


const mockAlertMessage: IAlertMessage = {
   showAlert: true,
   displayMessageText: 'Your paid-up letter has been requested and will be emailed to you within 72 hours.',
   action: 2,
   alertType: 3,
};
const mockStatementPreferenceResponse: IApiResponse = {
   data: {},
   metadata: {
      resultData: [{
         transactionID: '64523',
         resultDetail: [{
            operationReference: 'Transaction',
            result: 'R0V1',
            status: 'PENDING',
            reason: 'pending'
         }]
      }]
   }
};

const mockStatementPreferenceSuccessResponse: IApiResponse = {
   data: {
      itemAccountId: '1',
      accountNumber: '1001037693',
      frequency: 'MONTHLY',
      deliveryMode: 'EMAIL',
      paymentMethod: 'DEBO',
      email: ['GUNJAL138@GMAIL.COM', 'TEST@GAS.COM'],
      postalAddress: {
         addrLines: ['32 VALLARA ESTATE', '19 DUFF RD', 'CRAIGAVON'],
         city: 'JOHANNESBURG',
         postalCd: '2191'
      }
   },
   metadata: {
      resultData: [{
         resultDetail: [{
            operationReference: 'Transaction',
            result: 'R0V1',
            status: 'PENDING',
            reason: 'pending'
         }]
      }]
   }
};

const bsModalServiceStub = {
   show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
      return {
         content: {
            getApproveItStatus: Observable.of(true),
            resendApproveDetails: Observable.of(true),
            getOTPStatus: Observable.of(true),
            otpIsValid: Observable.of(true),
            updateSuccess: Observable.of(true),
            processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
            processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
            processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
         }
      };
   }),
   onShow: jasmine.createSpy('onShow'),
   onShown: jasmine.createSpy('onShown'),
   onHide: jasmine.createSpy('onHide'),
   onHidden: {
      asObservable: jasmine.createSpy('onHidden asObservable').and.callFake(function () {
         return Observable.of(true);
      })
   },
};

const bsModalServiceFailStub = {
   show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
      return {
         content: {
            getApproveItStatus: Observable.of(true),
            resendApproveDetails: Observable.of(true),
            getOTPStatus: Observable.of(true),
            otpIsValid: Observable.of(true),
            updateSuccess: Observable.of(false),
            processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
            processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
            processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
         }
      };
   }),
   onShow: jasmine.createSpy('onShow'),
   onShown: jasmine.createSpy('onShown'),
   onHide: jasmine.createSpy('onHide'),
   onHidden: {
      asObservable: jasmine.createSpy('onHidden asObservable').and.callFake(function () {
         return Observable.of(true);
      })
   },
};

const bsModalServiceFalseStub = {
   updateSuccess: Observable.of(false)
};

const mockDocumentListForPLDocument: IDocumentList[] = [{
   documentDescription: 'Paid-Up Letter',
   documentType: 'PLPaidUpLetter',
   isDocumentClick: false
}];

const mockDocumentListForPLStatement: IDocumentList[] = [{
   documentDescription: 'Statement',
   documentType: 'pLStatement',
   isDocumentClick: false
}];

const accountServiceSuccessStub = {
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockClientAccountDetails),
   currentAlertMessage: new Subject<boolean>(),
   getDocumentsList: jasmine.createSpy('getDocumentsList').and.returnValue(Observable.of(mockDocumentListForPLDocument)),
   getAccountStatementPreferences: jasmine.createSpy('getAccountStatementPreferences')
      .and.returnValue(Observable.of(mockStatementPreferenceResponse)),
   statusStatementPreferences: jasmine.createSpy('statusStatementPreferences')
      .and.returnValue(Observable.of(mockStatementPreferenceSuccessResponse)),
   showAlertMessage: jasmine.createSpy('showAlertMessage').and.returnValue(true),
   getApproveItOtpStatus: jasmine.createSpy('getApproveItOtpStatus').and.returnValue(Observable.of(mockStatementPreferenceResponse))
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const clientProfileDetailsSuccessServiceStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(mockClientDetails),
};

describe('StatementsDocumentsComponent', () => {
   let component: StatementsDocumentsComponent;
   let fixture: ComponentFixture<StatementsDocumentsComponent>;
   let modalService: BsModalService;
   let service: AccountService;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule, FormsModule],
         declarations: [StatementsDocumentsComponent, DocumentsComponent, SpinnerComponent, ToggleTabGroupComponent,
            MessageAlertComponent, PreferencesComponent, BottomButtonComponent, DocumentEmailComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [SystemErrorService, LoaderService, BsModalService,
            { provide: AccountService, useValue: accountServiceSuccessStub },
            { provide: BsModalService, useValue: bsModalServiceStub },
            { provide: AccountService, useValue: accountServiceSuccessStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientProfileDetailsSuccessServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(StatementsDocumentsComponent);
      component = fixture.componentInstance;
      modalService = TestBed.get(BsModalService);
      service = TestBed.get(AccountService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.showStatementsDocument = true;
      accountServiceSuccessStub.currentAlertMessage.next(true);
      expect(component).toBeTruthy();
   });

   it('Should highlight document tab for PL account', () => {
      component.accountType = 'PL';
      component.showStatementsDocument = true;
      component.getToggleTabButton();
      expect(component.type).toBe('DOCUMENTS');
   });

   it('Should highlight statement tab for PL account', () => {
      accountServiceSuccessStub.getDocumentsList.and.returnValue(Observable.of(mockDocumentListForPLStatement));
      component.accountType = 'PL';
      component.showStatementsDocument = true;
      component.getToggleTabButton();
      expect(component.type).toBe('STATEMENT');
   });

   it('Should highlight document tab for HL account', () => {
      accountServiceSuccessStub.getDocumentsList.and.returnValue(Observable.of(mockDocumentListForPLStatement));
      component.accountType = 'HL';
      component.showStatementsDocument = true;
      component.getToggleTabButton();
      expect(component.type).toBe('STATEMENT');
   });

   it('Should show success message', () => {
      component.setAlertMessage(mockAlertMessage);
      expect(component.showAlert).toBe(true);
   });

   it('Should highlight selected tab', () => {
      component.showStatementsDocument = true;
      const selectedDocument = { label: 'Documents', value: 'DOCUMENTS' };
      component.accountType = 'HL';
      component.onTypeChange(selectedDocument);
      expect(component.type).toBe('DOCUMENTS');
   });

   it('Should select document if account type is mfc', () => {
      component.accountType = 'IS';
      component.getToggleTabButton();
      expect(component.type).toBe('STATEMENT');
   });

   it('should select STATEMENT tab if account type is CA and statement is toggel is ON and IT3B toggel is OFF', () => {
      component.accountType = 'CA';
      component.showStatementsCASA  = true;
      component.showIT3b = false;
      component.getToggleTabButton();
      expect(component.type).toBe('STATEMENT');
   });

   it('should select DOCUMENTS tab if account type is CA and statement is toggel is OFF and IT3B toggel is ON', () => {
      component.accountType = 'CA';
      component.showStatementsCASA  = false;
      component.showIT3b = true;
      component.getToggleTabButton();
      expect(component.type).toBe('DOCUMENTS');
   });

   it('should select PREFERENCES tab if account type is CA and statement is toggel is OFF and IT3B toggel is OFF', () => {
      component.accountType = 'CA';
      component.itemAccountId = '1';
      component.showStatementsCASA  = false;
      component.showIT3b = false;
      component.getToggleTabButton();
      expect(component.type).toBe('PREFERENCES');
   });

   it('should select PREFERENCES tab if account type is CC and IT3B toggel is OFF', () => {
      component.accountType = 'CC';
      component.itemAccountId = '1';
      component.showIT3b = false;
      component.getToggleTabButton();
      expect(component.type).toBe('PREFERENCES');
   });

   it('Should get document list for mfc account', () => {
      component.accountType = 'IS';
      component.getDocumentList();
   });

   it('Should highlight selected tab', () => {
      component.onAlertLinkSelected();
      expect(component.showAlert).toBe(false);
   });

   it('Should hide already exist error or success message on tab change', () => {
      const selectedDocument = { label: 'Documents', value: 'DOCUMENTS' };
      const hideMessage = {
         showAlert: false,
         displayMessageText: 'hide',
         action: 'close',
         alertType: 2,
      };
      component.onTypeChange(selectedDocument);
      expect(component.type).toBe('DOCUMENTS');
      accountServiceSuccessStub.showAlertMessage(hideMessage);
   });

   it('Should call approve it check  functionality if account type is unit trust', () => {
      component.itemAccountId = '1';
      accountServiceSuccessStub.getAccountData.and.returnValue((mockInvData));
      component.getAccountDetails();
      expect(component.accountType).toEqual('INV');
      component.approveItCheck(true);
      expect(component.approveIt).toBe(true);
   });

   it('Should hide prefrences and switch the tab if approve it functionality check is false', () => {
      component.approveItCheck(false);
      expect(component.approveIt).toBe(false);
      expect(component.type).toBe('DOCUMENTS');
   });

   it('Should call approve it on type change if account is unit trust', () => {
      component.type = 'PREFERENCES';
      component.itemAccountId = '1';
      accountServiceSuccessStub.getAccountData.and.returnValue((mockInvData));
      component.getAccountDetails();
      const selectedDocument = { label: 'Preferences', value: 'PREFERENCES' };
      component.onTypeChange(selectedDocument);
      fixture.detectChanges();
      expect(component.type).toBe('PREFERENCES');
      expect(component.accountType).toEqual('INV');
      component.approveItCheck(true);
   });

   it('Should call onStatementPreferencesClick  on type change if account is not unit trust', () => {
      component.type = 'PREFERENCES';
      component.itemAccountId = '1';
      accountServiceSuccessStub.getAccountData.and.returnValue((mockMfcData));
      component.getAccountDetails();
      const selectedDocument = { label: 'Preferences', value: 'PREFERENCES' };
      component.onTypeChange(selectedDocument);
      fixture.detectChanges();
      expect(component.type).toBe('PREFERENCES');
      expect(component.accountType).toEqual('MFC');
      component.onStatementPreferencesClick();
   });

   it('should return arry of error message', () => {
      component.getApproveItErrorMessage();
      component.alertMessage = {
         showAlert: true,
         displayMessageText: 'error',
         action: 2,
         alertType: 1,
      };

   });

   it('Should show all three tabs if account type is MFC', () => {
      component.type = 'PREFERENCES';
      const btnGroup = [{ label: 'Statement', value: 'STATEMENT' },
      { label: 'Documents', value: 'DOCUMENTS' },
      { label: 'Preferences', value: 'PREFERENCES' }];
      component.itemAccountId = '1';
      accountServiceSuccessStub.getAccountData.and.returnValue((mockMfcData));
      component.getAccountDetails();
      component.getToggleTabButton();
      component.showTabForMfcCasa();
      component.buttonGroup = btnGroup;
      expect(component.accountType).toEqual('MFC');
      expect(component.type).toEqual('STATEMENT');
   });

   it('Should show all three tabs if account type is SA', () => {
      component.type = 'PREFERENCES';
      const btnGroup = [{ label: 'Statement', value: 'STATEMENT' },
      { label: 'Documents', value: 'DOCUMENTS' },
      { label: 'Preferences', value: 'PREFERENCES' }];
      component.itemAccountId = '1';
      accountServiceSuccessStub.getAccountData.and.returnValue((mockSAData));
      component.getAccountDetails();
      component.getToggleTabButton();
      component.showTabForMfcCasa();
      component.buttonGroup = btnGroup;
      expect(component.accountType).toEqual('SA');
      expect(component.type).toEqual('STATEMENT');
   });

   it('Should show all three tabs if account type is CA', () => {
      component.type = 'PREFERENCES';
      const btnGroup = [{ label: 'Statement', value: 'STATEMENT' },
      { label: 'Documents', value: 'DOCUMENTS' },
      { label: 'Preferences', value: 'PREFERENCES' }];
      component.itemAccountId = '1';
      accountServiceSuccessStub.getAccountData.and.returnValue((mockCAData));
      component.getAccountDetails();
      component.getToggleTabButton();
      component.showTabForMfcCasa();
      component.buttonGroup = btnGroup;
      expect(component.accountType).toEqual('CA');
      expect(component.type).toEqual('STATEMENT');
   });

   it('Should show two tabs statment & document if account type is CC', () => {
      component.type = 'PREFERENCES';
      const btnGroup = [{ label: 'Preferences', value: 'PREFERENCES' }];
      component.itemAccountId = '1';
      accountServiceSuccessStub.getAccountData.and.returnValue((mockCCData));
      component.getAccountDetails();
      component.getToggleTabButton();
      component.showTabForCC();
      component.buttonGroup = btnGroup;
      expect(component.accountType).toEqual('CC');
      expect(component.type).toEqual('DOCUMENTS');
   });

   it('Should show only document tab if account type is DS', () => {
      component.type = 'DOCUMENTS';
      const btnGroup = [{ label: 'Documents', value: 'DOCUMENTS' }];
      component.itemAccountId = '1';
      accountServiceSuccessStub.getAccountData.and.returnValue((mockDSData));
      component.getAccountDetails();
      component.getToggleTabButton();
      component.showTabForInvestment();
      component.buttonGroup = btnGroup;
      expect(component.accountType).toEqual('DS');
      expect(component.type).toEqual('DOCUMENTS');
   });

   it('should call onStatementPreferencesClick for the approve it popup', () => {
      component.statementPreferencesClicked = true;
      component.itemAccountId = '1';
      component.onStatementPreferencesClick();
      expect(component.statementPreferencesClicked).toBe(false);
   });

   it('should show the statement preferences details once approve it is already done', () => {
      accountServiceSuccessStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockStatementPreferenceSuccessResponse));
      component.statementPreferencesClicked = true;
      component.itemAccountId = '1';
      component.onStatementPreferencesClick();
      expect(component.statementPreferencesClicked).toBe(true);
      component.approveItCheck(true);
      expect(component.approveIt).toBe(true);
   });

   it('should call resend approve details', () => {
      accountServiceSuccessStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockStatementPreferenceResponse));
      component.bsModalRef = modalService.show(
         OutofbandVerificationComponent,
         Object.assign(
            {},
            {
               animated: true,
               keyboard: false,
               backdrop: true,
               ignoreBackdropClick: true
            },
            { class: '' }
         )
      );
      component.statementPreferencesClicked = true;
      component.itemAccountId = '1';
      component.resendApproveDetails();
      expect(component.transactionID).toEqual(mockStatementPreferenceResponse.metadata.resultData[0].transactionID);
   });
   it('should call resend approve details for false case', () => {
      accountServiceSuccessStub.getAccountStatementPreferences.and.returnValue(Observable.of(mockStatementPreferenceSuccessResponse));
      component.statementPreferencesClicked = true;
      component.itemAccountId = '1';
      component.resendApproveDetails();
      expect(component.statementPreferencesClicked).toBe(true);
   });
   it('should call resend approve details for error case', () => {
      accountServiceSuccessStub.getAccountStatementPreferences.and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      component.statementPreferencesClicked = true;
      component.itemAccountId = '1';
      component.resendApproveDetails();
      expect(component.statementPreferencesClicked).toBe(true);
   });
   it('should return false from approve it update success', () => {
      accountServiceSuccessStub.getAccountStatementPreferences = jasmine.createSpy('getAccountStatementPreferences')
         .and.returnValue(Observable.of(mockStatementPreferenceResponse));
      modalService.show = jasmine.createSpy('getApproveItStatus').and.callFake(function () {
         return {
            content: {
               getApproveItStatus: Observable.of(true),
               resendApproveDetails: Observable.of(true),
               getOTPStatus: Observable.of(true),
               otpIsValid: Observable.of(true),
               updateSuccess: Observable.of(false),
               processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
               processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
               processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
            }
         };
      });
      fixture.detectChanges();
      component.statementPreferencesClicked = true;
      component.itemAccountId = '1';
      component.onStatementPreferencesClick();
      expect(component.statementPreferencesClicked).toEqual(true);
   });

   it('Should highlight statements tab', () => {
      component.showStatementsDocument = true;
      const selectedStatement = { label: 'Statement', value: 'STATEMENT' };
      component.accountType = 'HL';
      component.onTypeChange(selectedStatement);
      expect(component.type).toBe('STATEMENT');
   });
});
