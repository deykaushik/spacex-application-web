import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, NgForm, FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ApoService } from '../apo.service';
import { PayFromComponent } from './pay-from.component';
import { IAutoPayDetail } from '../apo.model';
import { IAccountDetail, IBranch, IBank, IClientDetails, IDashboardAccounts, IDashboardAccount } from '../../../core/services/models';
import { ApoConstants } from '../apo-constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { PreFillService } from '../../../core/services/preFill.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { assertModuleFactoryCaching } from '../../../test-util';
import { SmallOverlayComponent } from '../../../shared/overlays/small-overlay/small-overlay.component';
import { ColoredOverlayComponent } from '../../../shared/overlays/colored-overlay/overlay.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { BottomButtonComponent } from '../../../shared/controls/buttons/bottom-button.component';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';
import { PaymentService } from '../../../payment/payment.service';
import { ClientProfileDetailsService } from '../../../core/services/client-profile-details.service';
import { CommonUtility } from '../../../core/utils/common';
import { Constants } from '../../../core/utils/constants';
import { GaTrackingService } from '../../../core/services/ga.service';

const autoPayDetails: IAutoPayDetail = {
   payToAccount: '589846 076131664 5',
   payToAccountName: 'MR 1RICH GARFIELD',
   autoPayInd: true,
   statementDate: '2018-07-04T00:00:00',
   dueDate: '2018-07-29T00:00:00',
   camsAccType: 'NGB',
   autoPayMethod: 'T',
   autoPayAmount: '',
   branchOrUniversalCode: '123456',
   nedbankIdentifier: true,
   mandateAction: true,
   payFromAccount: '1001004345',
   payFromAccountType: '2',
   monthlyPaymentDay: '19',
   autoPayTerm: '00',
   allowTermsAndCond: true
};
const operationMode = 'edit';
const nedBankAccounts: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '1001004345',
   productCode: '017',
   productDescription: 'TRANSACTOR',
   isPlastic: false,
   accountType: 'CA',
   nickname: 'TRANS 02',
   sourceSystem: 'Profile System',
   currency: 'ZAR',
   availableBalance: 13168.2,
   currentBalance: 13217.2,
   profileAccountState: 'ACT',
   accountLevel: 'U0',
   viewAvailBal: true,
   viewStmnts: true,
   isRestricted: false,
   viewCurrBal: true,
   viewCredLim: true,
   viewMinAmtDue: true,
   isAlternateAccount: true,
   allowCredits: true,
   allowDebits: true,
   accountRules: {
      instantPayFrom: true,
      onceOffPayFrom: true,
      futureOnceOffPayFrom: true,
      recurringPayFrom: true,
      recurringBDFPayFrom: true,
      onceOffTransferFrom: true,
      onceOffTransferTo: true,
      futureTransferFrom: true,
      futureTransferTo: true,
      recurringTransferFrom: true,
      recurringTransferTo: true,
      onceOffPrepaidFrom: true,
      futurePrepaidFrom: true,
      recurringPrepaidFrom: true,
      onceOffElectricityFrom: true,
      onceOffLottoFrom: true,
      onceOffiMaliFrom: true
   }
}];
const avsCheckResponse = { value: true };
const avsCheckResponseEmpty = {
   data: {
      verificationResults: {
         accountExists: 'Y',
         identificationNumberMatched: 'Y',
         accountActive: 'Y',
         canDebitAccount: 'Y'
      }
   },
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'AVS',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'SUCCESS'
               }
            ]
         }
      ]
   }
};
const mockAccounts2: IDashboardAccount[] = [{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountStatusCode: '00',
   AccountNumber: 123,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '2',
   InterestRate: 0
},
{
   AccountName: 'Inv CA2',
   Balance: 0,
   AvailableBalance: 0,
   AccountStatusCode: '0',
   AccountNumber: 1235,
   AccountType: 'CA',
   AccountIcon: 'glyphicon-account_current',
   NewAccount: true,
   LastUpdate: '2017-08-18 10:51:01 AM',
   InstitutionName: 'Nedbank (South Africa)',
   Currency: '&#x52;',
   SiteId: '16390',
   ItemAccountId: '1',
   InterestRate: 0
}];
const mockDashboardAccounts: IDashboardAccounts[] = [{
   ContainerName: 'Bank',
   Accounts: mockAccounts2,
   ContainerIcon: 'glyphicon-account_current',
   Assets: 747248542.18
}];
const branches: IBranch[] = [{
   branchName: 'abc',
   branchCode: '45678',
   displayName: 'nedbank',
   acceptsRealtimeAVS: true
}];
const banks: IBank[] = [{
   bankCode: '12345',
   bankName: 'NedBank',
   rTC: false,
   universalCode: '12345',
   acceptsRealtimeAVS: true,
   acceptsBatchAVS: false,
   branchCodes: branches
}, {
   bankCode: '032',
   bankName: 'NEDBANK INCORP. FBC',
   rTC: false,
   branchCodes: [
      {
         branchName: 'FBC FIDELITY BANK PENSIONS',
         branchCode: '45678'
      },
      {
         branchName: 'PORT ELIZABETH',
         branchCode: '780017'
      }
   ]
}];
const autopayServiceStub = {
   getMode: jasmine.createSpy('getMode').and.returnValue(operationMode),
   getNedbankAccounts: jasmine.createSpy('getNedbankAccounts').and.returnValue(Observable.of(nedBankAccounts)),
   verifyAvsStatus: jasmine.createSpy('verifyAvsStatus').and.returnValue(Observable.of(avsCheckResponseEmpty)),
   setAutoPayDetails: jasmine.createSpy('setAutoPayDetails'),
   getAutoPayDetails: jasmine.createSpy('getAutoPayDetails').and.returnValue(autoPayDetails),
   getDashboardAccounts: jasmine.createSpy('getDashboardAccounts').and.returnValue(mockDashboardAccounts),
   getCachedNedBankAccounts: jasmine.createSpy('getCachedNedBankAccounts').and.returnValue(nedBankAccounts),
   setCachedNedBankAccounts: jasmine.createSpy('setCachedNedBankAccounts'),
   getOtherBankAccounts: jasmine.createSpy('getOtherBankAccounts').and.returnValue(banks),
   setOtherBankAccounts: jasmine.createSpy('setOtherBankAccounts')
};

const navigationSteps = ApoConstants.apo.steps;
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

const paymentServiceStub = {
   getBanks: jasmine.createSpy('getBanks').and.returnValue(Observable.of(banks))
};
const clientDetails: IClientDetails = {
   FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
   EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
};
const preFillServiceStub = new PreFillService();
preFillServiceStub.preFillAutoPayDetail = autoPayDetails;

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('PayFromComponent', () => {
   let component: PayFromComponent;
   let fixture: ComponentFixture<PayFromComponent>;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [PayFromComponent, SmallOverlayComponent, ColoredOverlayComponent, SpinnerComponent,
            BottomButtonComponent, HighlightPipe],
         schemas: [NO_ERRORS_SCHEMA],
         imports: [FormsModule, ReactiveFormsModule],
         providers: [WorkflowService,
            { provide: ApoService, useValue: autopayServiceStub },
            { provide: PaymentService, useValue: paymentServiceStub },
            { provide: PreFillService, useValue: preFillServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            {
               provide: ClientProfileDetailsService, useValue: {
                  getClientDetail: jasmine.createSpy('getClientDetail'),
                  getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
                  getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
               }
            }
         ]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(PayFromComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = mockWorkflowSteps;
      component.workflowSteps = [] as IStepper[];
      component.workflowSteps = mockWorkflowSteps;
      component.autoPayDetails = autoPayDetails;
      fixture.detectChanges();
   }));
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call api when there is no cache data', () => {
      autopayServiceStub.getCachedNedBankAccounts.and.returnValue(null);
      autopayServiceStub.getOtherBankAccounts.and.returnValue(null);
      component.ngOnInit();
      expect(component.banks).toBeDefined();
      expect(component.banks[0].bankName).toBe('NedBank');
      expect(component.banks[1].bankName).toBe('NEDBANK INCORP. FBC');
      expect(autopayServiceStub.getNedbankAccounts).toHaveBeenCalled();
      expect(paymentServiceStub.getBanks).toHaveBeenCalled();
   });
   it('should call setAccoutTypes', () => {
      component.accountTypes = CommonUtility.covertToDropdownObject(Constants.VariableValues.accountTypes);
      component.setAccoutTypes();
      expect(component.accountTypes).toBeDefined();
   });
   it('should call setAccoutTypes else part', () => {
      component.accountTypes = null;
      component.setAccoutTypes();
      expect(component.accountTypes).toBeDefined();
   });
   it('should call setApoDetails ', () => {
      component.operationMode = 'add';
      component.setApoDetails();
      expect(component.isBranchVisible).toBe(false);
   });
   it('should call setApoDetails else part', () => {
      component.operationMode = '';
      component.setApoDetails();
      expect(component.isNedBankAccountSelected).toBe(true);
   });
   it('should call setApoDetails else part and nedbankIdentifier true', () => {
      component.operationMode = '';
      component.autoPayDetails.nedbankIdentifier = false;
      component.setApoDetails();
      expect(component.isNedBankAccountSelected).toBe(false);
   });
   it('should call getNedbankAccounts', () => {
      component.getNedbankAccounts();
      expect(component.selectedFromAccounts[0].itemAccountId).toBe('1');
   });
   it('should call processDropdownData to find the active accounts', () => {
      component.selectedFromAccounts = nedBankAccounts;
      component.processDropdownData(mockDashboardAccounts);
      expect(component.dropdownAccounts[0].itemAccountId).toBe('1');
   });
   it('should call gotToNextStep method', () => {
      component.selectedDropdownAccount = nedBankAccounts[0];
      component.isNedBankAccountSelected = true;
      const Account = new FormControl('12345');
      component.nedbankForm = new FormGroup({
         nedbankAccount: Account
      });
      component.autoPayDetails.nedbankIdentifier = false;
      component.gotToNextStep();
      expect(component.autoPayDetails.nedbankIdentifier).toBe(true);
   });
   it('should call gotToNextStep method else if part for SA accounts', () => {
      component.isNedBankAccountSelected = false;
      component.payFromForm = <NgForm>{
         valid: true,
         value: {
            accountNumber: '1234567',
            accountType: { code: 'SA' }
         }
      };
      component.nedBankFlexcube = ApoConstants.apo.nedBankFlexcube;
      component.bank = banks[0];
      component.bank.bankName = 'NEDBANK NAMIBIA';
      component.autoPayDetails.nedbankIdentifier = false;
      component.gotToNextStep();
      expect(component.isnedBankFlexcube).toBe(true);
   });
   it('should call gotToNextStep method else if part for CA accounts', () => {
      component.isNedBankAccountSelected = false;
      component.payFromForm = <NgForm>{
         valid: true,
         value: {
            accountNumber: '1234567',
            accountType: { code: 'CA' }
         }
      };
      component.nedBankFlexcube = ApoConstants.apo.nedBankFlexcube;
      component.bank = banks[0];
      component.bank.bankName = 'NEDBANK NAMIBIA';
      component.autoPayDetails.nedbankIdentifier = false;
      component.gotToNextStep();
      expect(component.isnedBankFlexcube).toBe(true);
   });
   it('should call gotToNextStep method else if part for nedbank flexcube banks SA accounts', () => {
      component.isNedBankAccountSelected = false;
      component.payFromForm = <NgForm>{
         valid: true,
         value: {
            accountNumber: '1234567',
            accountType: { code: 'SA' }
         }
      };
      component.nedBankFlexcube = ApoConstants.apo.nedBankFlexcube;
      component.bank = banks[1];
      component.branch = branches[0];
      component.bank.bankName = 'AFRICAN BANK';
      component.autoPayDetails.nedbankIdentifier = false;
      component.gotToNextStep();
      expect(component.isnedBankFlexcube).toBe(false);
   });
   it('should call gotToNextStep method else if part for nedbank flexcube banks CA accounts', () => {
      component.isNedBankAccountSelected = false;
      component.payFromForm = <NgForm>{
         valid: true,
         value: {
            accountNumber: '1234567',
            accountType: { code: 'CA' }
         }
      };
      component.nedBankFlexcube = ApoConstants.apo.nedBankFlexcube;
      component.bank = banks[1];
      component.branch = branches[0];
      component.bank.bankName = 'AFRICAN BANK';
      component.autoPayDetails.nedbankIdentifier = false;
      component.gotToNextStep();
      expect(component.isnedBankFlexcube).toBe(false);
   });
   it('should call gotToNextStep method else if part if no acceptsRealtimeAVS or acceptsRealtimeAVS is false', () => {
      component.isNedBankAccountSelected = false;
      component.payFromForm = <NgForm>{
         valid: true,
         value: {
            accountNumber: '1234567',
            accountType: { code: 'SA' }
         }
      };
      component.nedBankFlexcube = ApoConstants.apo.nedBankFlexcube;
      component.bank = banks[1];
      component.bank.acceptsRealtimeAVS = false;
      component.branch = branches[0];
      component.branch.acceptsRealtimeAVS = false;
      component.bank.bankName = 'AFRICAN BANK';
      component.autoPayDetails.nedbankIdentifier = false;
      component.gotToNextStep();
      expect(component.isnedBankFlexcube).toBe(false);
   });
   it('should call gotToNextStep method else if part if there is no branch code', () => {
      component.isNedBankAccountSelected = false;
      component.payFromForm = <NgForm>{
         valid: true,
         value: {
            accountNumber: '1234567',
            accountType: { code: 'SA' }
         }
      };
      component.nedBankFlexcube = ApoConstants.apo.nedBankFlexcube;
      component.bank = banks[1];
      component.branch = branches[0];
      component.bank.branchCodes = null;
      component.bank.bankName = 'AFRICAN BANK';
      component.autoPayDetails.nedbankIdentifier = false;
      component.gotToNextStep();
      expect(component.isnedBankFlexcube).toBe(false);
   });
   it('should call initiateAvsCheck ', () => {
      component.bank = banks[1];
      component.initiateAvsCheck(autoPayDetails);
      expect(component.showLoader).toBe(false);
   });
   it('should call initiateAvsCheck inner else part ', () => {
      component.bank = banks[1];
      avsCheckResponseEmpty.data.verificationResults.accountActive = 'N';
      autopayServiceStub.verifyAvsStatus.and.returnValue(Observable.of(avsCheckResponseEmpty));
      component.initiateAvsCheck(autoPayDetails);
      expect(component.showLoader).toBe(false);
   });
   it('should call initiateAvsCheck else part ', () => {
      component.bank = banks[1];
      avsCheckResponseEmpty.data = null;
      autopayServiceStub.verifyAvsStatus.and.returnValue(Observable.of(avsCheckResponseEmpty));
      component.initiateAvsCheck(autoPayDetails);
      expect(component.showLoader).toBe(false);
   });
   it('should call initiateAvsCheck error part ', () => {
      component.bank = banks[1];
      autopayServiceStub.verifyAvsStatus.and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      component.initiateAvsCheck(autoPayDetails);
      expect(component.showLoader).toBe(false);
   });
   it('should call closeAvsOverlay ', () => {
      component.closeAvsOverlay();
      expect(component.isAvsOverlay).toBe(false);
   });
   it('should call isNedBankSelected ', () => {
      component.bank = banks[0];
      component.isNedBankSelected(component.bank);
      expect(component.isNedbank).toBe(false);
   });
   it('should call displaySelectedAccountType ', () => {
      component.accountTypeName = '';
      expect(component.displaySelectedAccountType()).toBe(Constants.dropdownDefault.displayText);
   });
   it('should call onAccountTypeDropdownOpen ', () => {
      component.onAccountTypeDropdownOpen();
      expect(component.accountTypeDirty).toBe(true);
   });
   it('should call onAccountTypeChanged ', () => {
      const accountType = { value: { text: 'Savings account', code: 'SA', sortCode: 198765, isShownPaytoBank: true } };
      component.onAccountTypeChanged(accountType);
      expect(component.accountType).toBe('SA');
   });
   it('should call assign Bank ', () => {
      const bank = banks[0];
      bank.bankName = 'NedBank';
      component.assignBank(bank);
      expect(component.otherBank).toBe('NedBank');
   });
   it('should call assign Bank for other bank ', () => {
      const bank = banks[0];
      bank.bankName = 'AFRICAN BANK';
      component.assignBank(bank);
      expect(component.otherBank).toBe('AFRICAN BANK');
   });
   it('should call assign Bank for other bank with empty branch codes ', () => {
      const bank = banks[0];
      bank.bankName = 'AFRICAN BANK';
      bank.branchCodes = [];
      component.assignBank(bank);
      expect(component.branches).toBeDefined();
   });
   it('should call assign branch ', () => {
      component.assignBranch(branches[0]);
      expect(component.branchName).toBe(branches[0].branchName);
   });
   it('should call onAccountSelection ', () => {
      component.onAccountSelection(nedBankAccounts[0]);
      expect(component.selectedDropdownAccount).toBeDefined();
   });
   it('should call checkForBranchVisiblity false case ', () => {
      component.checkForBranchVisiblity(banks[0]);
      expect(component.isBranchVisible).toBe(false);
   });
   it('should call checkForBranchVisiblity true case ', () => {
      const bank = banks[0];
      bank.universalCode = '';
      component.checkForBranchVisiblity(bank);
      expect(component.isBranchVisible).toBe(true);
   });
   it('should call bankChange ', () => {
      component.operationMode = 'add';
      component.bankChange(banks[0]);
      expect(component.isBranchVisible).toBe(true);
   });
   it('should call clearBranch ', () => {
      component.clearBranch();
      expect(component.branchName).toBe('');
   });
   it('should call selectBank ', () => {
      const selectedBank = { item: banks[0] };
      component.selectBank(selectedBank);
      expect(component.isBranchVisible).toBe(true);
   });
   it('should call selectBank else part ', () => {
      const selectedBank = banks[0];
      component.selectBank(selectedBank);
      expect(component.isBranchVisible).toBe(true);
   });
   it('should call clearBank', () => {
      component.clearBank();
      expect(component.otherBank).toBe('');
      expect(component.bank).toBe(null);
   });
   it('should call blurBank', () => {
      const selectedBank = { item: banks[0] };
      component.blurBank(selectedBank);
      expect(component.otherBank).toBe(selectedBank.item.bankName);
   });
   it('should call blurBank else part', () => {
      const selectedBank = banks[0];
      component.blurBank(selectedBank);
      expect(component.otherBank).toBe('');
      expect(component.bank).toBe(null);
   });
   it('should call noBankResults', () => {
      component.noBankResults(false);
      expect(component.noBankData).toBe(false);
   });
   it('should call blurBankInput', () => {
      component.noBankData = true;
      component.blurBankInput();
      expect(component.otherBank).toBe('');
      expect(component.bank).toBe(null);
   });
   it('should call selectBranch ', () => {
      const selectBranch = { item: branches[0] };
      component.selectBranch(selectBranch);
      expect(component.branch).toBe(selectBranch.item);
   });
   it('should call selectBranch else part ', () => {
      const selectBranch = branches[0];
      component.selectBranch(selectBranch);
      expect(component.branch).toBe(selectBranch);
   });
   it('should call blurBranch', () => {
      const selectBranch = { item: branches[0] };
      component.blurBranch(selectBranch);
      expect(component.branchName).toBe('abc');
   });
   it('should call blurBranch else part', () => {
      const selectBranch = branches[0];
      component.blurBranch(selectBranch);
      expect(component.branchName).toBe('');
   });
   it('should call noBranchResults', () => {
      component.noBranchResults(false);
      expect(component.noBranchData).toBe(false);
   });
   it('should call blurBranchInput', () => {
      component.noBranchData = true;
      component.blurBranchInput();
      expect(component.branchName).toBe('');
   });
});
