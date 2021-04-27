import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { AccountWithdrawalComponent } from './account-withdrawal.component';
import { CurrencyFormat } from '../../shared/pipes/amount-transform-new.pipe';
import { HighlightPipe } from '../../shared/pipes/highlight.pipe';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { AccountService } from '../account.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { assertModuleFactoryCaching } from './../../test-util';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Observable } from 'rxjs/Observable';
import { BeneficiaryService } from '../../core/services/beneficiary.service';
import { OutofbandVerificationComponent } from '../../shared/components/outofband-verification/outofband-verification.component';
import { AmountTransformPipe } from '../../shared/pipes/amount-transform.pipe';
import { FormsModule } from '@angular/forms';
import {
   IContactCard, INoticePayload, IAccount, IViewNoticeDetails,
   IBranches, INoticeDetail, IApiResponse, IClientDetails, IFeedbackResult, IAccountInfo
} from '../../core/services/models';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

function getClientDetails(): IClientDetails {
   return {
      CisNumber: 110282180605,
      FirstName: 'Marc',
      SecondName: '',
      Surname: 'Schutte',
      FullNames: 'Mr Marc Schutte',
      CellNumber: '+27992180605',
      EmailAddress: '',
      BirthDate: '1977-03-04T22:00:00Z',
      FicaStatus: 701,
      SegmentId: 'AAAZZZ',
      IdOrTaxIdNo: 7703055072088,
      SecOfficerCd: '36407',
      PreferredName: 'Marc',
      AdditionalPhoneList: [
         {
            AdditionalPhoneType: 'BUS',
            AdditionalPhoneNumber: '(086) 1828828'
         },
         {
            AdditionalPhoneType: 'CELL',
            AdditionalPhoneNumber: '+27992180605'
         },
         {
            AdditionalPhoneType: 'HOME',
            AdditionalPhoneNumber: '(078) 2228519'
         }
      ],
      Address: {
         AddressLines: [
            {
               AddressLine: 'G12 KYLEMORE'
            },
            {
               AddressLine: 'THE MARINA RESIDENTS DOCK ROAD'
            },
            {
               AddressLine: 'WATERFRONT'
            }
         ],
         AddressCity: 'CAPE TOWN',
         AddressPostalCode: '08001'
      }
   };
}

const clientDetailsObserver: BehaviorSubject<IClientDetails> = new BehaviorSubject<IClientDetails>(getClientDetails());

function getContactCardData(): IContactCard {
   return {
      contactCardID: 4,
      contactCardName: 'Zahira Mahomed',
      contactCardDetails: [
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'NEDBANK', branchCode: '171338',
            beneficiaryType: 'PPD', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         },
         {
            accountType: 'CA', beneficiaryID: 2,
            beneficiaryName: 'Zahira Mahomed', accountNumber: '1104985268',
            bankName: 'Test', branchCode: '001',
            beneficiaryType: 'BFNXT', myReference: 'Z Mahomed',
            beneficiaryReference: 'Gomac', valid: true
         }],
      contactCardNotifications: [{
         notificationAddress: 'swapnilp@yahoo.com',
         notificationType: 'EMAIL', notificationDefault: true,
         notificationParents: []
      }],
      beneficiaryRecentTransactDetails: []
   };
}

const mockAccountServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

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

const mockTransactions: IFeedbackResult[] = [{
   metadata: {
      resultData: [
         {
            transactionID: 'instantpayment',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
}];

const mockViewNoticeDetails: IViewNoticeDetails = {
   noticeID: 'NOW2018062815',
   noticeDate: '2018-10-05T00:00:00',
   noticeAmount: 2040,
   beneficiaryIndicator: 'Y',
   capitalDisposalAccount:
   {
      accountNumber: 123456789,
      accountType: 'DS'
   }
};

const mockDeleteNotice: IFeedbackResult[] = [{
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  status: 'SUCCESS'
               }
            ]
         }
      ]
   }
}];

const mockCreateNotice: IFeedbackResult = {
   metadata: {
      resultData: [
         {
            transactionID: 'NOW2018062815',
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'PENDING'
               }
            ]
         }
      ]
   }
};

const mockEditNotice: IFeedbackResult[] = [{
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'Success'
               }
            ]
         }
      ]
   }
}];

const receipient = { nickname: 'Recipient' };

const mockAccountNotice: IAccount[] = [{
   nickname: 'Inv CA2',
   accountType: 'CA',
   accountNumber: 232345523
}];

const mockAccounts: IAccount[] = [{
   nickname: 'Inv CA2',
   accountType: 'CA',
   accountNumber: 232345523
},
{
   nickname: 'Inv CA2',
   accountType: 'SA',
   accountNumber: 232345523
},
{
   nickname: 'Inv CA2',
   accountType: 'DS',
   accountNumber: 232345523
},
{
   nickname: 'Inv CA2',
   accountType: 'CC',
   accountNumber: 232345523
},
{
   nickname: 'Inv CA2',
   accountType: 'HL',
   accountNumber: 232345523
},
{
   nickname: 'Recipient',
   accountType: 'CC',
   accountNumber: 232345523
}
];

const mockBranch1: IBranches[] = [{
   branchName: 'SA',
   branchCode: 123,
   displayName: 'Nedbank',
   accountType: 'DS'
}];

const mockBranch2: IBranches[] = [{
   branchName: 'SA',
   branchCode: 123,
   displayName: 'Nedbank',
   accountType: 'U0'
}];

const mockBranch3: IBranches[] = [{
   branchName: 'SA',
   branchCode: 123,
   displayName: 'Nedbank',
   beneficiaryReference: '1234',
   accountType: 'BDF'
}];

const beneficiaryData = [{
   contactCardDetails: [{
      accountNumber: 123456789,
      beneficiaryName: 'Adel',
      accountType: 'CC'
   }]
}];

const mockNoticeDetail: INoticeDetail = {
   investmentNumber: '123456-3456',
   noticeDate: '2018-14-11',
   noticeAmount: 400,
   accountNumber: 123456789,
   accountType: 'CA'
};

const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
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

describe('AccountWithdrawalComponent', () => {
   let component: AccountWithdrawalComponent;
   let fixture: ComponentFixture<AccountWithdrawalComponent>;
   let router: Router;
   let modalService: BsModalService;
   let service: AccountService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [AccountWithdrawalComponent, CurrencyFormat, AmountTransformPipe, HighlightPipe],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [Renderer2, { provide: AccountService, useValue: accountServiceStub },
            { provide: SystemErrorService, useValue: systemErrorServiceStub },
            { provide: BsModalService, useValue: bsModalServiceStub },
            { provide: BeneficiaryService, useValue: serviceStub }, {
               provide: ClientProfileDetailsService, useValue: {
                  clientDetailsObserver: clientDetailsObserver
               }
            },
         ]
      })
         .compileComponents();
   }));

   const serviceStub = {
      getContactCards: jasmine.createSpy('getContactCards').and.returnValue(getContactCardData().contactCardDetails)
   };

   beforeEach(() => {
      fixture = TestBed.createComponent(AccountWithdrawalComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      modalService = TestBed.get(BsModalService);
      component.firstWitdrawDate = '2018-08-18T22:00:00Z';
      component.accountInformation = [{
         AccountNumber: '12786-9987',
         AvailableBalance: 345678,
         AccountType: 'DS'
      }];
      component.accountId = 2;
      component.accountInformation = component.accountInformation[0];
      service = fixture.debugElement.injector.get(AccountService);
      fixture.detectChanges();
   });

   const accountServiceStub = {
      getAccountsForNotice: jasmine.createSpy('getAccountsForNotice').and.returnValue(Observable.of(mockAccountNotice)),
      getDashboardAccountsData: jasmine.createSpy('getDashboardAccountsData'),
      updateTransactionID: jasmine.createSpy('updateTransactionID').and.returnValue(123),
      getApproveItStatusNow: jasmine.createSpy('getApproveItStatusNow').and.returnValue(Observable.of(mockTransactions)),
      getApproveItOtpStatus: jasmine.createSpy('getApproveItOtpStatus').and.returnValue(Observable.of(mockStatementPreferenceResponse)),
      transactionID: jasmine.createSpy('transactionID').and.returnValue(1234),
      deleteNotice: jasmine.createSpy('deleteNotice').and.returnValue(Observable.of(mockDeleteNotice)),
      deleteNoticeError: mockAccountServiceError,
      createNotice: jasmine.createSpy('createNotice').and.returnValue(Observable.of(mockCreateNotice)),
      saveEditNotice: jasmine.createSpy('saveEditNotice').and.returnValue(Observable.of(mockEditNotice)),
      getPartWithdrawalAmount: jasmine.createSpy('getPartWithdrawalAmount').and.returnValue(Observable.of([{ partWithdrawalAmount: 100 }])),
      getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(Observable.of(mockAccountNotice))
   };

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('showNoticeFlow should be display created notice ', () => {
      component.showNoticeFlow = true;
      component.noticeDetails = mockViewNoticeDetails;
      component.ngOnInit();
      expect(component.showNoticeFlow).toBe(true);
   });

   it('should be cancel notice', () => {
      component.cancelNotice();
      expect(component.isDeleteNotice).toBe(false);
   });
   it('should be displayMessage', () => {
      const accType = ['CA', 'SA', 'DS', 'CC', 'HL', 'Recipient'];
      for (let i = 0; i < 6; i++) {
         component.displayMessage(accType[i]);
      }
      expect(component.instructionMsg).toBe('1');
   });

   it('changed amount should not be valid()', () => {
      component.investmentAmountLabel = 250;
      component.partAmount = 100;
      component.entryValue = 100;
      component.onAmountChange(200);
      expect(component.amountLimit).toBe(true);
   });

   it('entered amount is invalid', () => {
      component.investmentAmountLabel = 1234;
      component.onAmountChange(0);
      expect(component.isAmountValid).toBe(true);
   });

   it('should be call onAccountSelect function()', () => {
      component.onAccountSelect('Select account');
      expect(component.isBeneficiary).toBe(false);
   });

   it('should be select recipient account', () => {
      component.onAccountSelect('Recipient');
      expect(component.accType).toBe(true);
   });

   it('should be call onAccountChanged function()', () => {
      for (let i = 0; i < 6; i++) {
         component.onAccountChanged(mockAccounts[i]);
      }
      expect(component.accType).toBe(true);
   });

   it('should be call benificiaryChange function()', () => {
      component.branches = mockBranch1;
      component.benificiaryChange('Nedbank');
      expect(component.sortCode).toEqual(0);
   });

   it('should be call benificiaryChange function()', () => {
      component.branches = mockBranch2;
      component.benificiaryChange('Nedbank');
      expect(component.beneficiaryReference).toBe('0');
   });

   it('should be call benificiaryChange function()', () => {
      component.branches = mockBranch3;
      component.benificiaryChange('Nedbank');
      expect(component.sortCode).toEqual(123);
   });

   it('should be call onSubmit function()', () => {
      component.accType = true;
      component.isSelected = false;
      component.isEnteredAmountValid = true;
      component.isRecipient = false;
      component.isValidDate = false;
      component.onSubmit();
      expect(component.isSubmit).toBe(true);
   });

   it('should be call onSubmit function()', () => {
      component.accType = false;
      component.isSelected = false;
      component.isEnteredAmountValid = true;
      component.isRecipient = false;
      component.isValidDate = false;
      component.onSubmit();
      expect(component.instructionMsg).toBe('1');
   });

   it('should be call amendClick function()', () => {
      component.amendClick();
      expect(component.isSubmit).toBe(false);
   });

   it('should be close function()', () => {
      component.close();
      expect(component.infoMessage).toBe(false);
   });

   it('should be setDate function()', () => {
      const value = {
         getUTCMonth() {
            return 2;
         },
         getDate() {
            return 5;
         },
         getUTCFullYear() {
            return 2018;
         }
      };
      component.setDate(value);
      expect(component.isValidDate).toBe(false);
   });

   it('should be Confirm function()', () => {
      modalService.show = jasmine.createSpy('getApproveItStatusNow').and.callFake(function () {
         return {
            content: {
               getApproveItStatus: Observable.of(true),
               resendApproveDetails: Observable.of(true),
               getOTPStatus: Observable.of(true),
               otpIsValid: Observable.of(true),
               updateSuccess: Observable.of(true),
               processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
               processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
               processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse')
            }
         };
      });
      component.confirm();
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
   });

   it('should be deleteNotices function()', () => {
      component.deleteNotices();
      expect(component.isDeleteNotice).toBe(true);
   });

   it('should be call guid function()', () => {
      component.guid();
   });

   it('should be call backToDashboard function()', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.backToDashboard();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });

   it('should be call createRecipientData function()', () => {
      component.createRecipientData(beneficiaryData);
      expect(component.branches.length).toBe(1);
   });

   it('should be called delete notice', () => {
      component.accountId = 14;
      component.noticeDetails = {
         noticeID: 'NOW2018062815'
      };
      component.deleteNotice();
      expect(component.noticeId).toBe('14/NOW2018062815');
   });

   it(' should be call cancelNo function to avoid cancel notice', () => {
      component.onNoClicked();
      expect(component.isDeleteNotice).toBe(false);
   });

   it('backToOverview should be display dashboard', () => {
      component.backToOverview();
      expect(component.isEditNotice).toBe(false);
   });

   it('should be called cancelYes and result should be cancel the notice', () => {
      component.onYesClicked();
      component.transactionFlag.subscribe(data => {
         expect(data).toBe(true);
      });
   });

   it('should be called closeOverlay function for amount zero', () => {
      component.investmentAmount = 0;
      component.closeOverlay(true);
      component.transactionFlag.subscribe(data => {
         expect(data).toBe(true);
      });
   });

   it('should be called closeOverlay function for notice success', () => {
      component.investmentAmount = 500;
      component.isNoticeSuccess = true;
      component.closeOverlay(true);
      component.transactionFlag.subscribe(data => {
         expect(data).toBe(true);
      });
   });

   it('should be called closeOverlay function for notice unsuccess', () => {
      component.investmentAmount = 500;
      component.isNoticeSuccess = false;
      component.closeOverlay(true);
      expect(component.isDeleteNotice).toBe(true);
      expect(component.deleteNoticeValue).toBe(4);
   });

   it('isAmountValid should be true when you enter exact amount', () => {
      component.investmentAmountLabel = 1234;
      component.onAmountChange(1234);
      expect(component.isAmountValid).toBe(true);
   });

   it('entered amount is invalid', () => {
      component.investmentAmountLabel = 300;
      component.entryValue = 100;
      component.partAmount = 200;
      component.onAmountChange(100);
      expect(component.isEnteredAmountValid).toBe(false);
   });

});
