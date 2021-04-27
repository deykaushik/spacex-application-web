import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsModalService } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../test-util';
import { EditRecipientComponent } from './edit-recipient.component';
import { RecipientService } from '../recipient.service';
import { IBank, IContactCard, IContactCardDetail, IParentOperation, IScheduledTransaction } from '../../core/services/models';
import { BuyElectricityService } from '../../buy/buy-electricity/buy-electricity.service';
import { Constants } from '../../core/utils/constants';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ValidateInputDirective } from './../../shared/directives/validations/validateInput.directive';
import { HighlightPipe } from './../../shared/pipes/highlight.pipe';
import { RecipientOperation } from '../models';
import { AccountService } from '../../dashboard/account.service';
import { BeneficiaryService } from '../../core/services/beneficiary.service';
import { PreFillService } from '../../core/services/preFill.service';
import { ApiService } from '../../core/services/api.service';


const addResponse = Observable.of({
   data: {
      contactCardID: 1
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'BENEFICIARYSAVED',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   }
});
const addResponseLimitExceeded = Observable.of({
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'BENEFICIARYSAVED',
               result: 'R13',
               status: 'FAILURE',
               reason: ''
            }
         ]
      }
   ]
});

const mockShow = {
   subscribe: jasmine.createSpy('show content').and.returnValue(Observable.of(true))
};
const bsModalServiceStub = {
   show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
      return {
         content: {
            getApproveItStatus: mockShow,
            resendApproveDetails: mockShow,
            getOTPStatus: mockShow,
            otpIsValid: mockShow,
            updateSuccess: mockShow,
            processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
            unsubscribeAll: jasmine.createSpy('unsubscribeAll')
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
const popularBankData: IBank[] = [{
   bankCode: '009', bankName: 'ABSA BANK',
   rTC: true,
   category: ''
},

{
   bankCode: '020', bankName: 'CAPITEC BANK', rTC: true,
   category: ''
},
{
   bankCode: '008', bankName: 'FNB SOUTH AFRICA', rTC: true,
   category: ''
},
{
   bankCode: '001', bankName: 'STANDARD BANK SOUTH AFRICA', rTC: true,
   category: ''
},
{
   bankCode: '003', bankName: 'NEDBANK', rTC: true,
   category: ''
}];
const recipeintServiceStub = {
   initiateRecepientFlow: jasmine.createSpy('initiateRecepientFlow'),
   recipientOperation: new BehaviorSubject<RecipientOperation>(0),
   banks: new BehaviorSubject<IBank[]>([]),
   isTransactionStatusValid: jasmine.createSpy('isTransactionStatusValid').and.returnValue(true),
   getTransactionStatus: jasmine.createSpy('getTransactionStatus').and.returnValue({
      isValid: true,
      reason: '',
      status: ''
   }),
   deleteRecipient: jasmine.createSpy('deleteRecipient').and.returnValue(Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'BENEFICIARYSAVED',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   })),
   updateRecipient: jasmine.createSpy('updateRecipient').and.returnValue(Observable.of({
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'BENEFICIARYSAVED',
                  result: 'FV01',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   })),
   addRecipient: jasmine.createSpy('addRecipient').and.returnValue(addResponse),
   getApproveItStatus: jasmine.createSpy('getApproveItStatus').and.returnValue(addResponse)
};

const buyElectricityServiceStub = {};

function getContactCardData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1713277581',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }, {
            accountType: 'CA', beneficiaryID: null,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CC', beneficiaryID: 4,
            beneficiaryName: 'Zahira Mahomed', accountNumber: null,
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PEL', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }
      ],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      },
      {
         notificationAddress: '',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      },
      {
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: null
      }],
      beneficiaryRecentTransactDetails: []
   };
}
const mockScheduledData: IScheduledTransaction[] = [
   {
      'batchID': 2060015,
      'transactionID': 29117114,
      'capturedDate': '2017-09-20T00:00:00',
      'startDate': '2017-09-20T00:00:00',
      'nextTransDate': '2017-09-20T00:00:00',
      'beneficiaryID': 4,
      'sortCode': '196005',
      'bFName': 'UNKNOWN',
      'myDescription': 'test',
      'beneficiaryDescription': 'test',
      'fromAccount': { 'accountNumber': '1713277581' },
      'toAccount': { 'accountNumber': '1042853096', 'accountType': 'CA' },
      'amount': 100.0,
      'reoccurrenceItem': {
         'reoccurrenceFrequency': 'Monthly',
         'recInstrID': 2050467,
         'reoccurrenceOccur': 12,
         'reoccOccurrencesLeft': 11,
         'reoccurrenceToDate': '2018-09-16T00:00:00',
         'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
      }
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
      'toAccount': { 'accountNumber': '1042853096', 'accountType': 'BDF' },
      'amount': 100.0,
      'reoccurrenceItem': {
         'reoccurrenceFrequency': 'Weekly',
         'recInstrID': 2050467,
         'reoccurrenceOccur': 12,
         'reoccOccurrencesLeft': 11,
         'reoccurrenceToDate': '2018-09-16T00:00:00',
         'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
      }
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
      'toAccount': { 'accountNumber': '1042853096', 'accountType': 'CA' },
      'amount': 100.0,
      'reoccurrenceItem': {
         'reoccurrenceFrequency': 'Weekly',
         'recInstrID': 2050467,
         'reoccurrenceOccur': 12,
         'reoccOccurrencesLeft': 1,
         'reoccurrenceToDate': '2018-09-16T00:00:00',
         'reoccSubFreqType': 'DayOfMonth', 'reoccSubFreqVal': '16'
      }
   }];

const mockActiveAccounts = [{
   'ContainerName': 'Bank', 'Accounts':
      [
         {
            'AccountName': 'STOP CHEQU', 'Balance': 580303387,
            'AvailableBalance': 580287819.94, 'AccountNumber': '1713277581',
            'AccountType': 'CA', 'AccountIcon': 'glyphicon-account_current',
            'NewAccount': true, 'LastUpdate': '2017-08-18 10:51:01 AM',
            'InstitutionName': 'Nedbank (South Africa)', 'Currency': '&#x52;',
            'SiteId': '16390', 'ItemAccountId': '1',
            'InterestRate': 0
         }
      ]
}];

const prepaidObservable = new BehaviorSubject(mockScheduledData);
const payObservable = new BehaviorSubject(mockScheduledData);
const accountServiceStub = {
   getScheduledMobileTrasactions: jasmine.createSpy('getScheduledMobileTrasactions').and.returnValue(prepaidObservable),
   getScheduledPayment: jasmine.createSpy('getScheduledPayment').and.returnValue(payObservable),
   getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockActiveAccounts))
};
const beneServiceStub = {
   selectedBeneficiary: new BehaviorSubject(null)
};

const testComponent = class { };

const routerTestingStub = [
   { path: 'recipient', component: testComponent }
];

describe('EditRecipientComponent', () => {
   let component: EditRecipientComponent;
   let fixture: ComponentFixture<EditRecipientComponent>;
   let service: RecipientService;
   let router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            EditRecipientComponent,
            ValidateInputDirective,
            HighlightPipe
         ],
         imports: [
            FormsModule,
            TypeaheadModule.forRoot(),
            RouterTestingModule.withRoutes(routerTestingStub)
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [SystemErrorService,
            PreFillService,
            { provide: RecipientService, useValue: recipeintServiceStub },
            { provide: BuyElectricityService, useValue: buyElectricityServiceStub },
            { provide: AccountService, useValue: accountServiceStub },
            { provide: BeneficiaryService, useValue: beneServiceStub },
            { provide: BsModalService, useValue: bsModalServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
      fixture = TestBed.createComponent(EditRecipientComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      service = fixture.debugElement.injector.get(RecipientService);
      component.parentNotification = new Subject<IParentOperation>();
      fixture.detectChanges();
   });

   it('should check responses to show / hide delete & limit exceeded popup events', () => {
      fixture.detectChanges();

      component.beneficiaryData = {
         contactCard: {
            contactCardID: 4,
            contactCardName: 'Zahira Mahomed',
            contactCardDetails: [
               {
                  accountType: 'CA', beneficiaryID: 2,
                  beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
                  bankName: 'NEDBANK', branchCode: '171338',
                  beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
                  beneficiaryReference: 'Gomac', valid: true
               }]
         }
      };

      fixture.detectChanges();
      recipeintServiceStub.recipientOperation.next(RecipientOperation.deleteRecipeint);
      fixture.detectChanges();
      expect(component.isShowMessageBlock).toBe(false);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be able to add email', () => {
      expect(component.addEmail()).toBeUndefined();
   });
   it('should be able to add cellphone', () => {
      expect(component.addCellphone()).toBeUndefined();
   });
   it('should be able to add fax', () => {
      expect(component.addFax()).toBeUndefined();
   });
   it('should be able to add meter', () => {
      expect(component.addMeter()).toBeUndefined();
   });
   it('should be able to add account', () => {
      expect(component.addAccount()).toBeUndefined();
   });

   it('should handle input change', () => {
      component.beneficiaryDetails = null;
      component.ngOnChanges();
      expect(component.emailNotifications.length).toBe(0);

      component.beneficiaryDetails = {
         contactCard: getContactCardData()
      };
      component.ngOnChanges();
      expect(component.emailNotifications.length).toBe(3);
      component.isFirstTime = false;
      const data = getContactCardData();
      data.contactCardDetails = [{
         accountType: 'CA', beneficiaryID: null,
         beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
         bankName: 'NEDBANK', branchCode: '171338',
         beneficiaryType: 'PPD', myReference: 'Z Mahomed',
         beneficiaryReference: 'Gomac', valid: true
      }];
      component.beneficiaryDetails = {
         contactCard: data
      };
      component.ngOnChanges();
      expect(component.accountContactCards.length).toBe(0);

      component.beneficiaryDetails = {
         contactCard: null,
         bankDefinedBeneficiary: null
      };
      component.ngOnChanges();
      expect(component.accountContactCards.length).toBe(0);
   });

   it('should remove notification', () => {
      const notification = getContactCardData().contactCardNotifications[0];
      component.removeNotification(notification);
      expect(notification.notificationAddress).toBe('');
   });

   it('should show delete notification', () => {
      expect(component.showDeleteRecipientNotification()).toBeUndefined();
   });

   it('should hide delete notification', () => {
      component.hideDeleteRecipientNotification();
      expect(component.isVisible).toBe(false);
   });

   it('should hide message block', () => {
      component.closeMessageBlock();
      expect(component.isShowMessageBlock).toBe(false);
   });

   it('should delete recipient', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      component.deleteRecipient();
      expect(component.isShowMessageBlock).toBe(false);
   });

   it('should show error message when delete recipient has invalid status', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      service.getTransactionStatus = jasmine.createSpy('getTransactionStatus').and.returnValue({
         isValid: false
      });
      component.deleteRecipient();
      expect(component.isSuccess).toBe(false);
   });

   it('should show error message when delete recipient fails', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      service.deleteRecipient = jasmine.createSpy('deleteRecipient').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      component.deleteRecipient();
      expect(component.isSuccess).toBe(false);
   });

   it('should check validity of benificiary', () => {
      component.electricityContactCards.push({
         accountNumber: '123',
         accountType: 'xx',
         beneficiaryName: 'xx',
         beneficiaryType: 'xx'
      });
      fixture.detectChanges();
      (<any>component.electricityContactCards[0]).isMeterNumberValid = true;
      expect(component.isBeneficiaryValid()).toBeFalsy();

      component.beneficiaryForm = {
         valid: false
      };
      expect(component.isBeneficiaryValid()).toBeFalsy();


      component.beneficiaryForm = {
         valid: true
      };
      expect(component.isBeneficiaryValid()).toBeTruthy();

      component.resetFormState();
      component.creditCardContactCards.push({
         accountNumber: '123',
         accountType: 'xx',
         beneficiaryName: 'xx',
         beneficiaryType: 'xx'
      });
      component.beneficiaryForm = {
         valid: true
      };
      expect(component.isBeneficiaryValid()).toBeTruthy();
   });

   it('should check results of meter number blur event', () => {
      const meter = {
         isMeterNumberValid: false
      };
      component.onMeterNumberBlur(meter, null);
      expect(meter.isMeterNumberValid).toBeFalsy();

      component.onMeterNumberBlur(meter, 0);
      expect(meter.isMeterNumberValid).toBeFalsy();

      component.onMeterNumberBlur(meter, 123);
      expect(meter.isMeterNumberValid).toBeTruthy();
   });

   it('should call getsectioncount for PPD values', () => {
      component.prepaidContactCards = [{
         accountType: '',
         beneficiaryName: '',
         accountNumber: null,
         beneficiaryType: 'PPD',
         beneficiaryReference: '',
         myReference: '',
         isDeleted: true
      }];
      expect(component.getSectionItemCount(Constants.BeneficiaryType.Prepaid)).toBe(0);
   });

   it('should call artifactcount for Account card values', () => {
      component.accountContactCards = [{
         accountType: '',
         beneficiaryName: '',
         accountNumber: null,
         beneficiaryType: 'ACC',
         beneficiaryReference: '',
         myReference: '',
         isDeleted: true
      }];
      expect(component.getSectionItemCount(Constants.BeneficiaryType.Account)).toBe(0);
   });

   it('should call getsectioncount for email values', () => {
      component.emailNotifications = [{
         notificationAddress: null,
         notificationDefault: null,
         notificationParents: null,
         notificationType: null,
         isDeleted: true
      }];
      expect(component.getSectionItemCount(Constants.BeneficiaryType.Email)).toBe(0);
   });

   it('should call getsectioncount for cellphone values', () => {
      component.smsNotifications = [{
         notificationAddress: null,
         notificationDefault: null,
         notificationParents: null,
         notificationType: null,
         isDeleted: true
      }];
      expect(component.getSectionItemCount(Constants.BeneficiaryType.Sms)).toBe(0);
   });


   it('should call getsectioncount for fax values', () => {
      component.faxNotifications = [{
         notificationAddress: null,
         notificationDefault: null,
         notificationParents: null,
         notificationType: null,
         isDeleted: true
      }];
      expect(component.getSectionItemCount(Constants.BeneficiaryType.Fax)).toBe(0);
   });

   it('should call getsectioncount for invalid section', () => {
      component.faxNotifications = [];
      expect(component.getSectionItemCount(null)).toBeUndefined();
   });

   it('should check results of meter number change event', () => {
      const meter = {
         isMeterNumberValid: false
      };
      component.onMeterNumberChange(meter);
      expect(meter.isMeterNumberValid).toBeFalsy();
   });

   it('should check for ned bank selection', () => {
      const nonNedBank: IBank = {
         bankName: 'xx',
         bankCode: 'xx',
         rTC: false
      };
      const nedBank: IBank = {
         bankName: Constants.VariableValues.nedBankDefaults.bankName,
         bankCode: 'xx',
         rTC: false
      };

      expect(component.isNedBank(nonNedBank)).toBeFalsy();
      expect(component.isNedBank(nedBank)).toBeTruthy();
   });

   it('should check if nedbank is selected', () => {
      const account: IContactCardDetail = {
         accountType: 'xx',
         beneficiaryName: 'xx',
         accountNumber: 'xx',
         beneficiaryType: 'xx'
      };
      expect(component.isNedBankSelected(account)).toBeFalsy();
      account.bankName = Constants.VariableValues.nedBankDefaults.bankName;
      expect(component.isNedBankSelected(account)).toBeTruthy();
   });

   it('should check for account type changed', () => {
      const account: IContactCardDetail = {
         accountType: 'xx',
         beneficiaryName: 'xx',
         accountNumber: 'xx',
         beneficiaryType: 'xx'
      };
      component.onAccountTypeChanged(account, {
         value: {
            code: 'CA'
         }
      });
      expect((<any>account).accountTypeDirty).toBeTruthy();
   });

   it('should mark the account dirty when account type dropdown is changed', () => {
      const acc = { accountTypeDirty: false };
      component.onAccountTypeDropdownOpen(acc);
      expect(acc.accountTypeDirty).toBeTruthy();
   });

   it('should check for selecting bank', () => {
      const account: IContactCardDetail = {
         accountType: 'xx',
         beneficiaryName: 'xx',
         accountNumber: 'xx',
         beneficiaryType: 'xx'
      };
      const bank: IBank = {
         bankName: 'xx',
         bankCode: 'xx',
         rTC: false
      };

      bank.bankName = Constants.VariableValues.nedBankDefaults.bankName;
      component.selectBank(account, {
         item: bank
      });
      expect(account.accountType).toBe(Constants.VariableValues.nedBankDefaults.accountType);

      bank.universalCode = 'abc';
      bank.branchCodes = [{
         branchCode: 'a',
         branchName: 'b'
      }];
      bank.bankName = 'abc';
      component.selectBank(account, {
         item: bank
      });
      expect(account.accountType).toBeUndefined();
   });

   it('should check for blurring bank', () => {
      const account: IContactCardDetail = {
         accountType: 'xx',
         beneficiaryName: 'xx',
         accountNumber: 'xx',
         beneficiaryType: 'xx'
      };
      const bank: IBank = {
         bankName: 'xx',
         bankCode: 'xx',
         rTC: false
      };
      component.blurBank(account, { item: bank });
      expect(account.accountType).toBe(account.accountType);

      component.blurBank(account, null);
      expect(account.accountType).toBeUndefined();
   });


   it('should check for blurring bank input', () => {
      const account: IContactCardDetail = {
         accountType: 'xx',
         beneficiaryName: 'xx',
         accountNumber: 'xx',
         beneficiaryType: 'xx'
      };


      (<any>account).bankName = 'test';
      (<any>account).accountSuggestion = true;
      component.blurBankInput(account);
      expect((<any>account).bankName).toBeUndefined();

      (<any>account).bankName = 'test';
      (<any>account).accountSuggestion = false;
      component.blurBankInput(account);
      expect((<any>account).bankName).toBe('test');
   });

   it('should check for assigning branch', () => {
      const account = {
         accountType: 'xx',
         beneficiaryName: 'xx',
         accountNumber: 'xx',
         beneficiaryType: 'xx',
         bank: {
            universalCode: '123'
         }
      };
      const branch: any = {
      };

      component.assignBranch(account, branch);
      expect((<any>(account)).branch).toBe(branch);
   });

   it('should check for selecting branch', () => {
      const account: IContactCardDetail = {
         accountType: 'xx',
         beneficiaryName: 'xx',
         accountNumber: 'xx',
         beneficiaryType: 'xx'
      };
      const branch: any = {
         branchCode: 'abc'
      };

      component.selectBranch(account, { item: branch });
      expect((<any>(account)).branch).toBe(branch);
   });

   it('should check for no branch results', () => {
      const acc = {
         noBranchData: true
      };

      component.noBranchResults(acc, true);
      expect(acc.noBranchData).toBeTruthy();


      component.noBranchResults(acc, false);
      expect(acc.noBranchData).toBeFalsy();
   });

   it('should check for blurring branch', () => {
      const acc = {
         noBranchData: true,
         branchName: 'abc'
      };

      component.blurBranch(acc, null);
      expect(acc.branchName).toBe('');


      component.blurBranch(acc, {
         item: {
            branchName: 'a',
            branchCode: 'b'
         }
      });
      expect(acc.branchName).toBe('a - b');
   });

   it('should check for clearing bank suggestion', () => {
      const account = {
         accountSuggestion: 'test'
      };
      component.clearBankSuggestion(account, false);
      expect(account.accountSuggestion).toBeFalsy();
   });

   it('should check for blurring branch input', () => {
      const acc = {
         noBranchData: true,
         branch: {}
      };

      component.noBranchResults(acc, false);
      component.blurBranchInput(acc);
      expect(acc.branch).toBeTruthy();


      component.noBranchResults(acc, true);
      component.blurBranchInput(acc);
      expect(acc.branch).toBeFalsy();
   });

   it('should be able to add prepaid account', () => {
      expect(component.addPrepaid()).toBeUndefined();
   });

   it('should be able to remove prepaid account', () => {
      expect(component.removeContactCardDetail(getContactCardData().contactCardDetails[0])).toBeUndefined();
   });

   it('should handle add mode changes', () => {
      component.isAddMode = true;
      component.ngOnChanges();
      expect(component.contactName).toBe('');
   });

   it('should handle cancel click', () => {
      component.onOperationSuccess.subscribe((data) => {
         expect(data).toBe(Constants.Recipient.status.cancel);
      });
      component.cancelAddRecipient();
   });

   it('should handle recipient update', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData(),
      };
      service.getTransactionStatus = jasmine.createSpy('getTransactionStatus').and.returnValue({
         isValid: true,
         status: 'PENDING'
      });
      service.addUpdateSuccess = true;
      component.saveRecipient();
      expect(component.isSuccess).toBe(false);
   });

   it('should handle recipient addition', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      component.beneficiaryData.contactCard.contactCardID = null;
      component.isAddMode = true;
      service.addRecipient = jasmine.createSpy('addRecipient').and.returnValue(addResponse);
      service.getTransactionStatus = jasmine.createSpy('getTransactionStatus').and.returnValue({
         isValid: true,
         status: 'PENDING'
      });
      component.saveRecipient();
      expect(component.isSuccess).toBe(false);
   });

   it('should validate save click', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      component.validateSaveClick();
      expect(component.isSuccess).toBe(false);
      component.isBeneficiaryValid = jasmine.createSpy('isBeneficiaryValid').and.returnValue(true);
      component.validateSaveClick();
      expect(component.isSuccess).toBe(false);
   });

   it('should handle recipient update http error', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      service.updateRecipient = jasmine.createSpy('updateRecipient').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      component.emailNotifications = getContactCardData().contactCardNotifications;
      component.accountContactCards = getContactCardData().contactCardDetails;
      component.saveRecipient();
      expect(component.isShowMessageBlock).toBeDefined();
   });

   it('should handle recipient addition http error', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      component.isAddMode = true;
      service.addRecipient = jasmine.createSpy('addRecipient').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      component.saveRecipient();
      expect(component.isShowMessageBlock).toBe(true);
   });

   it('should handle recipient addition validation error', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      component.isAddMode = true;
      service.getTransactionStatus = jasmine.createSpy('getTransactionStatus').and.returnValue({
         isValid: false
      });
      component.saveRecipient();
      expect(component.isShowMessageBlock).toBeDefined();
   });

   it('should handle recipient addition validation error for limit exceeded', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      component.isAddMode = true;
      service.addRecipient = jasmine.createSpy('addRecipient').and.returnValue(addResponseLimitExceeded);
      service.getTransactionStatus = jasmine.createSpy('getTransactionStatus').and.returnValue({
         isValid: false
      });
      component.saveRecipient();
      expect(service.recipientOperation.next).toBeDefined();
   });

   it('should handle recipient update validation error', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      service.getTransactionStatus = jasmine.createSpy('getTransactionStatus').and.returnValue({
         isValid: false
      });
      component.saveRecipient();
      expect(component.isShowMessageBlock).toBeDefined();
   });

   it('should change to edit mode', () => {
      component.isReadOnly = true;
      component.editAddRecipient();
      expect(component.isReadOnly).toBe(false);
   });

   it('should test updation of account view models', () => {
      component.accountContactCards = [
         {
            accountType: 'CA',
            beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed',
            accountNumber: '1104985268',
            bankName: 'NEDBANK',
            branchCode: '171338',
            beneficiaryType: 'BNFINT',
            myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac',
            bankCode: '1',
            valid: true
         }];

      component.banks = [{
         bankCode: '1',
         bankName: 'test',
         rTC: false,
         universalCode: 'abc',
         branchCodes: [{
            branchCode: 'b1',
            branchName: 'branch 1'
         }, {
            branchCode: 'b2',
            branchName: 'branch 2'
         }]
      }];

      const bankModel = component.accountContactCards[0];
      const bankVm = (<any>component.accountContactCards[0]);


      // case when no bank code
      bankModel.bankCode = null;
      bankModel.bankName = 'NEDBANK';
      component.updateAccountVm();
      expect(bankVm.bankName).toBe('NEDBANK');


      // case when invalid bank code
      bankModel.bankCode = '2';
      bankModel.bankName = 'NEDBANK';
      component.updateAccountVm();
      expect(bankVm.bankName).toBe('NEDBANK');

      // case when valid bank code invalid branch code
      bankModel.bankCode = '1';
      bankModel.branchCode = 'b3';
      component.updateAccountVm();
      expect(bankVm.branchDisplayName).toBeFalsy();

      // case when valid bank code valid branch code
      bankModel.bankCode = '1';
      bankModel.branchCode = 'b1';
      component.updateAccountVm();
      expect(bankVm.branchDisplayName).toBe('branch 1 - b1');

   });

   it('should handle bank approved beneficiary selection', () => {
      component.beneficiaryDetails = {
         bankDefinedBeneficiary: {
            bDFID: '1',
            sortCode: 12,
            bDFName: 'wdbwekfbk'
         }
      };
      component.currentContactCardId = 1;
      component.isFirstTime = false;
      component.ngOnChanges();
      expect(component.isBankApprovedBeneficiary).toBe(true);
   });

   it('should handle bank approved beneficiary saved as contact', () => {
      const contactCardData = getContactCardData().contactCardDetails[0];
      contactCardData.accountType = Constants.Recipient.bankApprovedAccountType;
      component.beneficiaryDetails = {
         contactCard: {
            contactCardID: 1,
            contactCardName: 'bank approved',
            contactCardDetails: [contactCardData]
         }
      };
      component.currentContactCardId = 1;
      component.ngOnChanges();
      expect(component.isBankApprovedBeneficiary).toBe(true);
   });

   it('should handle set recipient', () => {
      const contactCardData = getContactCardData().contactCardDetails[0];
      contactCardData.accountNumber = null;
      contactCardData.beneficiaryID = null;
      component.accountContactCards = [contactCardData];
      component.beneficiaryData = {
         contactCard: {
            contactCardID: 1,
            contactCardName: 'bank approved',
            contactCardDetails: [contactCardData]
         }
      };
      expect(component.setRecipientData()).toBeUndefined();
   });
   it('should append schedule payment to recipient if any', () => {
      component.beneficiaryData = {
         bankDefinedBeneficiary: {
            bDFID: '1042853096',
            sortCode: 12,
            bDFName: 'wdbwekfbk'
         }
      };
      prepaidObservable.complete();
      payObservable.complete();
      component.isFirstTime = true;
      component.handleBeneficiaryDetails();
      expect(component.schedulePayementData).toBeDefined();
      component.isFirstTime = false;
   });

   xit('should populate selected benficiary if any on first time', () => {
      component.beneficiaryDetails = {
         bankDefinedBeneficiary: {
            bDFID: '1042853096',
            sortCode: 12,
            bDFName: 'wdbwekfbk'
         }
      };
      component.selectedRecipient = {
         contactCard: {
            contactCardID: 4,
            contactCardName: 'Zahira Mahomed',
            contactCardDetails: [
               {
                  accountType: 'CA', beneficiaryID: 2,
                  beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
                  bankName: 'NEDBANK', branchCode: '171338',
                  beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
                  beneficiaryReference: 'Gomac', valid: true
               }]
         }
      };
      component.isFirstTime = true;
      component.schedulePayementData = [];
      component.currentContactCardId = 99;
      component.handleBeneficiaryDetails();
      expect(component.beneficiaryData).toBe(component.selectedRecipient);
      component.isFirstTime = false;
   });
   it('should goto pay on prePaidToBuy', () => {
      const contactCardData = getContactCardData().contactCardDetails[0];
      const spy = spyOn(router, 'navigate');
      component.prePaidToBuy(contactCardData);
      expect(spy).toHaveBeenCalled();
   });

   it('should goto buy electricity on electricityToBuy', () => {
      component.beneficiaryDetails = {
         contactCard: getContactCardData()
      };
      const contactCardData = getContactCardData().contactCardDetails[0];
      const spy = spyOn(router, 'navigate');
      component.electricityToBuy(contactCardData);
      expect(spy).toHaveBeenCalled();
   });
   it('should goto prepaid on prePaidToPay', () => {
      component.beneficiaryDetails = {
         contactCard: getContactCardData()
      };
      const contactCardData = getContactCardData().contactCardDetails[0];
      const spy = spyOn(router, 'navigate');
      component.prePaidToPay(contactCardData);
      expect(spy).toHaveBeenCalled();
   });
   it('should goto prepaid on prePaidToPay', () => {
      component.beneficiaryDetails = {
         contactCard: getContactCardData(),
         bankDefinedBeneficiary: {
            bDFID: '1',
            sortCode: 12,
            bDFName: 'wdbwekfbk'
         }
      };

      const contactCardData = getContactCardData().contactCardDetails[0];
      const spy = spyOn(router, 'navigate');
      component.contactCardToPay(contactCardData);
      expect(spy).toHaveBeenCalled();
   });

   it('should be able to add credit card', () => {
      component.addCreditCard();
      expect(component.creditCardContactCards.length).toBeGreaterThan(0);
   });

   it('should handle success message', () => {
      component.handleSuccessMessage('');
      expect(component.isSuccess).toEqual(true);
   });

   it('should handle add mode', () => {
      component.isAddMode = true;
      component.beneficiaryData = null;
      component.ngOnChanges();
      expect(component.beneficiaryData).toEqual({});

      component.beneficiaryData = {};
      component.ngOnChanges();
      expect(component.beneficiaryData).toEqual({});
   });
   it('should handle onDestroy', () => {
      component.subscription = null;
      component.parentNotification = null;
      expect(component.ngOnDestroy()).toBeUndefined();
   });
   it('should handle recipient addition from parent button', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      component.isAddMode = true;
      service.addRecipient = jasmine.createSpy('addRecipient').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      component.parentNotification.next({ isSaveRecipient: true });
      expect(component.isShowMessageBlock).toBe(true);
   });

   it('should handle recipient addition from parent button for other operation', () => {
      component.beneficiaryData = {
         contactCard: getContactCardData()
      };
      component.isAddMode = true;
      service.addRecipient = jasmine.createSpy('addRecipient').and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      component.parentNotification.next({ isSaveRecipient: false });
      expect(component.isShowMessageBlock).toBe(false);
   });

   it('should return if bank list is open', () => {
      expect(component.isBankOpen('1')).toBe(false);
   });

   xit('should handle selection of bank approved contact', () => {
      component.beneficiaryDetails = {
         contactCard: {
            contactCardID: 4,
            contactCardName: 'Zahira Mahomed',
            contactCardDetails: [
               {
                  accountType: 'BDF', beneficiaryID: 2,
                  beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
                  bankName: 'NEDBANK', branchCode: '171338',
                  beneficiaryType: 'BNFINT', myReference: 'Z Mahomed',
                  beneficiaryReference: 'Gomac', valid: true
               }]
         }
      };
      component.beneficiaryData = component.beneficiaryDetails;
      component.schedulePayementData = [];
      component.currentContactCardId = 4;
      component.handleBeneficiaryDetails();
      expect(component.beneficiaryData).toBe(component.selectedRecipient);
   });

   it('should return account type name', () => {
      expect(component.getAccountTypeName('')).toBeUndefined();
   });

   it('should toggle collapse state', () => {
      component.isCollapsed = true;
      component.toggleCollapse();
      expect(component.isCollapsed).toBe(false);
   });
   it('should click on branchelement after selecting bank', () => {
      const body = document.getElementsByTagName('body')[0];
      const div = <HTMLDivElement>(document.createElement('div'));
      body.appendChild(div);
      component.branchelement = div;
      component.branchelement.setAttribute('id', 'bank-0');
      const account: IContactCardDetail = {
         accountType: 'xx',
         beneficiaryName: 'xx',
         accountNumber: 'xx',
         beneficiaryType: 'xx'
      };
      const bank: IBank = {
         bankName: 'xx',
         bankCode: 'xx',
         rTC: false
      };
      bank.bankName = Constants.VariableValues.nedBankDefaults.bankName;
      component.selectBank(account, {
         item: bank
      });
      expect(component).toBeTruthy();
   });
   it('should call ngOnInit and set category for the banks to popular', () => {
      const emptyBanks = [{ bankCode: '', bankName: null, rTC: true, category: '' },
       { bankCode: '', bankName: null, rTC: true, category: '' }];
      const allbanks = popularBankData.concat(emptyBanks);
      service.banks = new BehaviorSubject<IBank[]>(allbanks);
      component.ngOnInit();
      fixture.detectChanges();
      const value = component.banks.some(i => i.category === Constants.PopularCategory);
      expect(value).toBeTruthy();
   });
});
