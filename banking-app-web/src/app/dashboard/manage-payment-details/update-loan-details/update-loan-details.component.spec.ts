import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TypeaheadModule, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { TermsService } from '../../../shared/terms-and-conditions/terms.service';
import { AccountService } from '../../account.service';
import { LoaderService } from '../../../core/services/loader.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { LoanDetailsComponent } from '../loan-details/loan-details.component';
import { UpdateLoanDetailsComponent } from './update-loan-details.component';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { NumberFormatPipe } from '../../../shared/pipes/number-format.pipe';
import {
   ILoanDebitOrderDetails, IAssetDetails, ISimilarAccounts, IBank,
   IDashboardAccount, IManagePaymentDetailsPost, IApiResponse, ITermsAndConditions, IBranch
} from '../../../core/services/models';
import { assertModuleFactoryCaching } from '../../../test-util';
import { Constants } from '../../../core/utils/constants';
import { GaTrackingService } from '../../../core/services/ga.service';

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
   ItemAccountId: '12',
   InterestRate: 0
}];
const mockLoanDebitOrders: ILoanDebitOrderDetails = {
   accountNumber: '711647500000001',
   currentBalance: '193650.28',
   assetDetails: {
      description: '2011 U KIA SPORTAGE 2.0 A/T',
      chassisNumber: 'KNAPC811MB7135729',
      engineNumber: 'G4KDBS026445'
   },
   interestRate: 15,
   paymentFrequency: 'monthly',
   totalInstallment: 5283.52,
   nextInstallmentDate: '2018-07-30T02:00:00+03:00',
   paymentMethod: 'Debit',
   bankName: 'ABSA BANK (PREF BRANCH CODE)',
   bankBranchCode: 184242,
   bankAccNumber: '9071836461',
   bankAccountType: 'CA',
   similarAccounts: [{ itemAccountId: '12', accountNumber: '711647500000001', currentBalance: 193650.28, selected: false },
   { itemAccountId: '13', accountNumber: '71164500000001', currentBalance: 193650.28, selected: true }]
};
const mockManagePaymentDetails: IManagePaymentDetailsPost = {
   installmentAmount: 1000,
   paymentDate: '2017-08-18 10:51:01 AM',
   bankName: 'ABSA BANK (PREF BRANCH CODE)',
   bankBranchCode: 632005,
   bankAccNumber: '9071836461',
   accountType: 'CA',
   additionalAccounts: [{ itemAccountId: '12', accountNumber: '711647500000001', currentBalance: 193650.28, selected: true },
   { itemAccountId: '13', accountNumber: '71164500000001', currentBalance: 193650.28, selected: true }]
};
const mockLoanDebitOrdersOriginal: ILoanDebitOrderDetails = {
   accountNumber: '711647500000001',
   currentBalance: '193650.28',
   assetDetails: {
      description: '2011 U KIA SPORTAGE 2.0 A/T',
      chassisNumber: 'KNAPC811MB7135729',
      engineNumber: 'G4KDBS026445'
   },
   interestRate: 15,
   paymentFrequency: 'monthly',
   totalInstallment: 5285.53,
   nextInstallmentDate: '2018-08-30T02:00:00+02:00',
   paymentMethod: 'Debit',
   bankName: 'ABSA BANK (PREF BRANCH CODE)',
   bankBranchCode: 632005,
   bankAccNumber: '9071836461',
   bankAccountType: 'CA',
   similarAccounts: [{ itemAccountId: '12', accountNumber: '711647500000001', currentBalance: 193650.28, selected: true },
   { itemAccountId: '13', accountNumber: '71164500000001', currentBalance: 193650.28, selected: true }]
};
const mockBankDetails: IBank = {
   bankCode: '001',
   bankName: 'ABSA BANK (PREF BRANCH CODE)',
   rTC: true,
   branchCodes: [{
      branchCode: '184242',
      branchName: 'Test',
   }]
};
const mockBankDetailsUnvCode: IBank = {
   bankCode: '001',
   bankName: 'ABSA BANK (PREF BRANCH CODE)',
   rTC: true,
   universalCode: '632005'
};

const mockUpdateAPIRespDummy: IApiResponse = {
   'data': [
      {
         'itemAccountId': '13',
         'accountNumber': '711647500000001',
         'currentBalance': 193650.28,
         'assetDetails': {
            'description': '2011 U KIA SPORTAGE 2.0 A/T',
            'chassisNumber': 'KNAPC811MB7135729',
            'engineNumber': 'G4KDBS026445'
         },
         'interestRate': 18.0,
         'paymentFrequency': 'Monthly',
         'totalInstallment': 5283.52,
         'nextInstallmentDate': '2018-07-30T02:00:00+02:00',
         'paymentMethod': 'Cash',
         'bankName': 'ABSA BANK (PREF BRANCH CODE)',
         'bankBranchCode': 632005,
         'bankAccNumber': '9071836461',
         'bankAccountType': 'CA',
         'similarAccounts': [{
            'itemAccountId': '12',
            'accountNumber': '711347600000001',
            'currentBalance': 278073.0,
            'selected': true
         }, {
            'itemAccountId': '13',
            'accountNumber': '711647500000001',
            'currentBalance': 193650.28
         }]
      }],
   'metadata': {
      'resultData': [{
         'transactionID': '13',
         'resultDetail': [{
            'operationReference': 'DealInfoEnq',
            'result': 'R00',
            'status': 'SUCCESS',
            'reason': 'SUCCESS'
         }]
      },
      {
         'transactionID': '13',
         'resultDetail': [{
            'operationReference': 'DealAssetInfoEnq',
            'result': 'R00',
            'status': 'SUCCESS',
            'reason': 'SUCCESS'
         }]
      }]
   }
};

function getMockAccountTypes() {
   return {
      savingAccountType: { text: 'Savings', code: 'SA' },
      currentAccountType: { text: 'Current account', code: 'CA' },
      chequeAccountType: { text: 'Cheque', code: 'CA' }
   };
}
const accountType = {
   value: {
      text: 'Current account', code: 'CA'
   }
};
const error = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

const mockTermsConditions: ITermsAndConditions = {
   noticeTitle: 'notice',
   noticeType: 'notice',
   versionNumber: 10,
   newVersionNumber: 10,
   acceptedDateTime: 'notice',
   noticeDetails: {
      noticeContent: 'NoticeDetails',
      versionDate: '2018-07-30T02:00:00+02:00'
   }
};
const mockAcceptedTerms: IApiResponse = {
   data: mockTermsConditions,
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: ''
               }
            ]
         }
      ]
   }
};
const mockAcceptedTermsFailure: IApiResponse = {
   data: mockTermsConditions,
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'TRANSACTION',
                  result: 'R01',
                  status: 'FAILURE',
                  reason: ''
               }
            ]
         }
      ]
   }
};
const mockBranchDetails: IBranch[] = [{
   branchCode: '632005',
   branchName: 'ABSA BANK (PREF BRANCH CODE)',
   displayName: 'ABSA BANK (PREF BRANCH CODE) - 632005'
}];
const termStub = {
   decodeTerms: jasmine.createSpy('decodeTerms').and.returnValue('accepted content')
};

const accountServiceStub = {
   getAccountData: jasmine.createSpy('getAccountData').and.returnValue(mockAccountData[0]),
   updateMfcDebitOrders: jasmine.createSpy('updateMfcDebitOrders').and.returnValue(Observable.of(true)),
   getBanks: jasmine.createSpy('getBanks').and.returnValue(Observable.of([mockBankDetails])),
   setMfcUpdatePostData: jasmine.createSpy('setMfcUpdatePostData'),
   getMfcUpdatePostData: jasmine.createSpy('getMfcUpdatePostData').and.returnValue(Observable.of(mockUpdateAPIRespDummy)),
   getTermsAndConditionsForMFC: jasmine.createSpy('getTermsAndConditionsForMFC').and.returnValue(Observable.of(mockTermsConditions)),
   getTermsAndConditionsForMFCWithAccepted: Observable.of(null),
   acceptTermsAndConditions: jasmine.createSpy('acceptTermsAndConditions').and.returnValue(Observable.of(mockAcceptedTerms)),
   acceptTermsAndConditionsFailure: Observable.of(mockAcceptedTermsFailure)
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('UpdateLoanDetailsComponent', () => {
   let component: UpdateLoanDetailsComponent;
   let fixture: ComponentFixture<UpdateLoanDetailsComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [UpdateLoanDetailsComponent, HighlightPipe, AmountTransformPipe, NumberFormatPipe],
         schemas: [NO_ERRORS_SCHEMA],
         imports: [FormsModule, TypeaheadModule],
         providers: [LoaderService, ComponentLoaderFactory, PositioningService, SystemErrorService,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: TermsService, useValue: termStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 12 }), snapshot: {} } }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(UpdateLoanDetailsComponent);
      component = fixture.componentInstance;
      component.readOnlyFields = false;
      component.showBankDetails = true;
      component.isYourBankAccount = true;
      component.loanDebitOrder = mockLoanDebitOrders;
      component.originalLoanDetails = mockLoanDebitOrdersOriginal;
      component.banks = [mockBankDetails];
      component.accountId = '12';
      component.similarAccounts = mockManagePaymentDetails.additionalAccounts;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should handle ngOnChanges Action on loanDebitOrder change', () => {
      component.readOnlyFields = true;
      component.ngOnChanges({ loanDebitOrder: new SimpleChange(null, true, true) });
      expect(component.readOnlyFields).toBe(true);
   });
   it('loan asset details should be initialized', () => {
      component.ngOnInit();
      expect(mockLoanDebitOrders.assetDetails).not.toBeNull();
      expect(component.showBankDetails).toBe(true);
      expect(component.bankAccountTypeText).toBe('Current account');
   });
   it('View Personal loan', () => {
      component.loanAccountType = 'HL';
      component.ngOnInit();
      expect(component.isHomeLoanPersonalLoan).toBe(true);
      expect(component.loanName).toBe('Home loan');
   });
   it('update payment details', () => {
      spyOn(component, 'checkDisableApplyChanges').and.callThrough();
      accountServiceStub.getBanks.and.returnValue(Observable.of([mockBankDetails]));
      component.updateDetails();
      component.getBanks();
      expect(component.banks).toEqual([mockBankDetails]);
      expect(component.checkDisableApplyChanges).toHaveBeenCalled();
   });
   it('update payment details of bank having universal code', () => {
      spyOn(component, 'checkDisableApplyChanges').and.callThrough();
      component.loanDebitOrder.bankBranchCode = 632005;
      accountServiceStub.getBanks.and.returnValue(Observable.of([mockBankDetailsUnvCode]));
      component.getBanks();
      expect(component.banks).toEqual([mockBankDetailsUnvCode]);
   });
   it('terms and conditions to be shown', () => {
      component.showTermAndConditions();
      expect(component.showTermsFlag).toBe(true);
   });
   it('terms and conditions to be hidden', () => {
      component.termsAndConditionsClose();
      expect(component.showTerms).toBe(false);
   });
   it('get account type by code', () => {
      fixture.whenStable().then(() => {
         component.onAccountTypeChanged(getMockAccountTypes()[0]);
         expect(component.accountTypeName).toBe('current account');
      });
   });
   it('should select a bank and store details in component loanDebit', () => {
      component.selectBank({ item: mockBankDetails });
      fixture.detectChanges();
      expect(component.loanDebitOrder.bankName).toEqual(mockBankDetails.bankName);
   });
   it('update details should have been called on click of continue', () => {
      accountServiceStub.updateMfcDebitOrders('12', mockManagePaymentDetails);
      component.onContinue();
      expect(component.hasThirdPartyEmail).toBe(false);
   });
   it('check disable apply changes', () => {
      component.authNedbank = false;
      component.acceptTerms = false;
      component.isAmountValid = false;
      component.checkDisableApplyChanges();
      expect(component.disableApplyChangesBtn).toBe(true);
   });
   it('check disable apply changes when accept terms is true', () => {
      component.authNedbank = false;
      component.acceptTerms = true;
      component.checkDisableApplyChanges();
      expect(component.disableApplyChangesBtn).toBe(true);
      expect(component.showLoader).toBe(false);
   });
   it('close overlay should set hasThirdPartyEmail to false', () => {
      component.closeOverlay();
      expect(component.hasThirdPartyEmail).toBe(false);
   });
   it('check on amount change', () => {
      const value = 2000;
      component.minimumInstalmentAmt = 1000;
      component.onAmountChange(value);
      expect(component.isAmountValid).toBe(true);
      expect(component.applyDetailsToAll).toBe(false);
      expect(component.loanDebitOrder.totalInstallment).toEqual(value);
   });
   it('set date from date picker', () => {
      const value = new Date('2018-07-30T02:00:00+02:00');
      component.setDate(value);
      expect(component.loanDebitOrder.nextInstallmentDate).toBe(moment(value).format(Constants.formats.YYYYMMDDTHHmmssZ));
   });
   it('on click apply changes when yourBankAccount is true', () => {
      spyOn(component, 'updatePaymentDetails').and.callThrough();
      component.showTermsView = mockTermsConditions;
      component.applyChangesClicked();
      expect(component.hasThirdPartyEmail).toBe(false);
   });
   it('on click apply changes when yourBankAccount is false', () => {
      component.isYourBankAccount = false;
      component.showTermsView = mockTermsConditions;
      component.applyChangesClicked();
      expect(component.hasThirdPartyEmail).toBe(true);
   });
   it('should send mail', () => {
      spyOn(component, 'onUpload').and.callThrough();
      component.onUpload();
      expect(component.emailTo).toEqual('care@mfc.co.za');
   });
   it('on Account type changed', () => {
      component.onAccountTypeChanged(accountType);
      expect(component.accountTypeName).toBe('Current account');
   });
   it('similar account to be checked', () => {
      spyOn(component, 'checkDisableApplyChanges').and.callThrough();
      component.applyDetailsToAll = true;
      component.similarAccountCheck(true);
      expect(component.applyDetailsToAll).toBe(true);
   });
   it('similar account to be checked when there is no other similar account', () => {
      spyOn(component, 'checkDisableApplyChanges').and.callThrough();
      component.similarAccounts = [];
      component.similarAccountCheck(true);
      expect(component.applyDetailsToAll).toBe(false);
   });
   it('applyDetailsToAllAccountsToggle', () => {
      component.applyDetailsToAllAccountsToggle(true);
      const data = [{ itemAccountId: '13', accountNumber: '71164500000001', currentBalance: 193650.28, selected: true }];
      expect(component.similarAccounts).toEqual(data);
   });
   it('update payment details', () => {
      spyOn(component, 'updatePaymentDetails').and.callThrough();
      accountServiceStub.updateMfcDebitOrders(component.accountId, mockManagePaymentDetails);
      component.updatePaymentDetails();
      expect(accountServiceStub.updateMfcDebitOrders).toHaveBeenCalled();
      expect(mockManagePaymentDetails.additionalAccounts).
         toEqual(mockManagePaymentDetails.additionalAccounts.filter(account => account.selected === true));
      expect(component.readOnlyFields).toBeTruthy();
   });
   it('handle error when update payment details', () => {
      accountServiceStub.updateMfcDebitOrders.and.returnValue(error);
      component.updatePaymentDetails();
      expect(component.readOnlyFields).toBe(false);
   });
   it('check loan name if loanAccountType is HL', () => {
      component.loanAccountType = 'HL';
      component.checkLoanName();
      expect(component.loanName).toBe('Home loan');
   });
   it('check loan name if loanAccountType is PL', () => {
      component.loanAccountType = 'PL';
      component.checkLoanName();
      expect(component.loanName).toBe('Personal loan');
   });
   it('set data', () => {
      component.isBankDetailsChanged = true;
      const initialData = component.setData();
      expect(initialData).toBeDefined();
   });
   it('updateMfcDebitOrders returns success', () => {
      accountServiceStub.updateMfcDebitOrders.and.returnValue(Observable.of(true));
      component.updatePaymentDetails();
      expect(component.readOnlyFields).toBe(true);
   });
   it('updateMfcDebitOrders returns failure', () => {
      accountServiceStub.updateMfcDebitOrders.and.returnValue(Observable.of(false));
      component.updatePaymentDetails();
      expect(component.loanDebitOrder).toBe(component.originalLoanDetails);
      expect(component.readOnlyFields).toBe(true);
   });
   it('on AccountNumFocus', () => {
      component.onAcccountNumFocus();
      expect(component.formValueChange).toBe(true);
   });
   it('on sendSimilarAccounts', () => {
      component.applyDetailsToAll = true;
      component.sendSimilarAccounts();
      expect(component.similarAccounts).toEqual(component.loanDebitOrder.similarAccounts.filter(account => account.selected === true));
   });
   it('on setAllBankingData', () => {
      const data = component.setAllBankingData(mockManagePaymentDetails);
      expect(data).toEqual(mockManagePaymentDetails);
   });
   it('on checkIfBankingDetailsChanged', () => {
      component.checkIfBankingDetailsChanged('bankName');
      expect(component.isBankDetailsChanged).toEqual(true);
   });

   it('accepted terms conditions fails', () => {
      accountServiceStub.acceptTermsAndConditions.and.returnValue(accountServiceStub.acceptTermsAndConditionsFailure);
      const systemService = TestBed.get(SystemErrorService);
      spyOn(systemService, 'raiseError');
      component.showTermsView = mockTermsConditions;
      component.applyChangesClicked();
      expect(systemService.raiseError).toHaveBeenCalled();
   });

   it('latest terms are not retrieved so accepted terms are called', () => {
      accountServiceStub.getTermsAndConditionsForMFC.and.returnValue(accountServiceStub.getTermsAndConditionsForMFCWithAccepted);
      component.showTermAndConditions();
      expect(component.showTermsView).toBe(null);
   });
   it('response from accepted terms is received', () => {
      accountServiceStub.getTermsAndConditionsForMFC.and.returnValue(Observable.of(mockTermsConditions));
      component.getAcceptedTermsAndConditions();
      expect(component.showLoader).toBe(false);
      expect(component.showTermsView).toBe(mockTermsConditions);
   });
   it('check if amount changed', () => {
      const value = component.checkIfAmountChanged();
      expect(value).toBe(true);
   });
   it('when selected bank have universal code', () => {
      component.selectBank({ item: mockBankDetailsUnvCode });
      fixture.detectChanges();
      expect(component.loanDebitOrder.bankName).toEqual(mockBankDetailsUnvCode.bankName);
   });
   it('when branch code is blank', () => {
      mockBankDetails.branchCodes = [];
      component.selectBank({ item: mockBankDetails });
      fixture.detectChanges();
      expect(component.branches).toEqual([]);
   });
   it('check apply changes button', () => {
      component.postAction = null;
      const value = component.checkApplyChangesButton();
      expect(value).toBe(true);
   });
   it('check apply changes button when success', () => {
      component.postAction = { isSuccess: true };
      component.formValueChange = false;
      component.originalLoanDetails.totalInstallment = 11;
      component.loanDebitOrder.totalInstallment = 11;
      const value = component.checkApplyChangesButton();
      expect(value).toBeFalsy();
   });
   it('when branch is selected', () => {
      component.branchContextualSearch(mockBranchDetails[0]);
      expect(component.filter).toBe(mockBranchDetails[0].displayName);
      expect(component.looseFocus).toBe(true);
      expect(component.loanDebitOrder.bankBranchCode).toBe(parseInt(mockBranchDetails[0].branchCode, 10));
   });
   it('when branchCode text box is clicked', () => {
      component.branches = mockBranchDetails;
      component.toggleFocus();
      expect(component.looseFocus).toBe(false);
   });
   it('contextual search for branch code when the entered string matches', () => {
      component.branches = mockBranchDetails;
      component.filter = 'ABS';
      const searchValue = 'ABS';
      component.filterContentContextual(searchValue);
      expect(component.looseFocus).toBe(false);
   });
   it('contextual search for branch code when the entered string does not matches', () => {
      component.branches = mockBranchDetails;
      component.filter = 'XYZ';
      const searchValue = 'XYZ';
      component.filterContentContextual(searchValue);
      expect(component.looseFocus).toBe(true);
   });
});
