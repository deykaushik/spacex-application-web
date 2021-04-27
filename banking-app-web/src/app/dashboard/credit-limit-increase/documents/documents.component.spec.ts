import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from '../../../test-util';
import { CreditLimitService } from '../credit-limit.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { AccountService } from '../../account.service';
import { CreditDocumentsComponent } from './documents.component';
import { CreditLimitMaintenance } from '../credit-limit-constants';
import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { IAccountDetail } from '../../../core/services/models';

const creditLimitIncrease = {
   plasticId: 42,
   grossMonthlyIncome: 10,
   netMonthlyIncome: 10,
   otherIncome: 10,
   monthlyCommitment: 10,
   monthlyDebt: 10,
   bankName: 'Nedbank',
   branchNumber: '198765',
   accountNumber: '9876543',
   preferContactNumber: '123455',
   primaryClientDebtReview: 'N',
   spouseDebtReview: 'N',
   statementRetrival: true
};
const mockCATransferAccounts: IAccountDetail[] = [{
   itemAccountId: '1',
   accountNumber: '2001004345',
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
   },
   TransferAccountRules: {
      TransferTo: [
         {
            AccountType: 'CA',
            ProductCodes: [],
            ProductAccessType: 'Blocked'
         }
      ]
   }
},
{
   itemAccountId: '2',
   accountNumber: '2001004345',
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
   },
   TransferAccountRules: {
      TransferTo: [
         {
            AccountType: 'CA',
            ProductCodes: [],
            ProductAccessType: 'Blocked'
         }
      ]
   }
}];
const creditLimitServiceStub = {
   getCreditLimitMaintenanceDetails: jasmine.createSpy('getCreditLimitMaintenanceDetails').and.returnValue(creditLimitIncrease),
   setAccountId: jasmine.createSpy('setAccountId'),
   setCreditLimitMaintenanceDetails: jasmine.createSpy('setCreditLimitMaintenanceDetails'),
   getCachedCurrentAccounts: jasmine.createSpy('getCachedCurrentAccounts').and.returnValue(mockCATransferAccounts),
   setCachedCurrentAccounts: jasmine.createSpy('setCachedCurrentAccounts'),
};
const accountServiceStub = {
   getTransferAccounts: jasmine.createSpy('getTransferAccounts').and.returnValue(Observable.of(mockCATransferAccounts)),
};
const navigationSteps = CreditLimitMaintenance.steps;
describe('DocumentsComponent', () => {
   let component: CreditDocumentsComponent;
   let fixture: ComponentFixture<CreditDocumentsComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CreditDocumentsComponent, SkeletonLoaderPipe],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CreditLimitService, useValue: creditLimitServiceStub },
         { provide: AccountService, useValue: accountServiceStub }, WorkflowService]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(CreditDocumentsComponent);
      component = fixture.componentInstance;
      service.workflow = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
      { step: navigationSteps[1], valid: false, isValueChanged: false },
      { step: navigationSteps[2], valid: false, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      fixture.detectChanges();
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should assign null if there is no selected account', inject([WorkflowService], (service: WorkflowService) => {
      component.creditLimitDetails.selectedAccount = null;
      service.workflow[1].valid = true;
      component.ngOnInit();
      expect(component.selectedFromAccount).toBe(null);
   }));
   it('should prepopulate details in edit mode', inject([WorkflowService], (service: WorkflowService) => {
      service.workflow[1].valid = true;
      component.ngOnInit();
      expect(component.isSelected).toBe(true);
   }));
   it('should call getCurrentAccounts method ', inject([WorkflowService], (service: WorkflowService) => {
      creditLimitServiceStub.getCachedCurrentAccounts.and.returnValue(null);
      service.workflow[1].valid = false;
      component.getCurrentAccounts();
      expect(component.creditLimitDetails.accountNumber).toBe('9876543');
   }));
   it('should call openStatement method ', () => {
      component.openStatement(true);
      expect(component.creditLimitDetails.statementRetrival).toBe(true);
   });
   it('should call onFromAccountSelection method ', () => {
      const selectedBank = { accountNumber: '12345678' };
      component.onFromAccountSelection(selectedBank);
      expect(component.creditLimitDetails.accountNumber).toBe('12345678');
   });
   it('should call onProvideManually method ', () => {
      component.onProvideManually();
      expect(component.creditLimitDetails.statementRetrival).toBe(false);
   });
   it('should call onProvide method ', () => {
      component.onProvide(true);
      expect(component.creditLimitDetails.statementRetrival).toBe(true);
   });
   it('should call onBankSelected method ', () => {
      component.onBankSelected({ bankName: 'Nedbank', branchNumber: '198765' });
      expect(component.creditLimitDetails.bankName).toBe('Nedbank');
      expect(component.creditLimitDetails.branchNumber).toBe('198765');
   });
   it('should load cached casa accounts on bank selected method', () => {
      component.cachedCurrentAccounts = mockCATransferAccounts;
      component.onBankSelected({ bankName: 'Nedbank', branchNumber: '198765' });
      expect(component.creditLimitDetails.bankName).toBe('Nedbank');
      expect(component.creditLimitDetails.branchNumber).toBe('198765');
   });
   it('should call onAccountNumber method ', () => {
      const event0 = { key: 'e' };
      expect(component.onAccountNumber(event0)).toBe(false);
      const event = { target: { value: '123456' } };
      expect(component.onAccountNumber(event)).toBe(true);
      const event1 = { target: { value: '123456345678912' } };
      expect(component.onAccountNumber(event1)).toBe(false);
   });
   it('should call goToContactDetails method ', () => {
      component.creditLimitDetails.accountNumber = '123456';
      component.goToContactDetails(false);
      expect(component.isDone).toBe(true);
   });
});
