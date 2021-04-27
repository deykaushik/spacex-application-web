import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberFormatPipe } from '../../../shared/pipes/number-format.pipe';
import { MessageAlertComponent } from '../../../shared/components/message-alert/message-alert.component';
import { LoanDetailsComponent } from './loan-details.component';
import { ILoanDebitOrderDetails, IAssetDetails, IActionSuccess, IAlertMessage, ISetAlertMessage } from '../../../core/services/models';
import { AlertActionType, AlertMessageType } from '../../../shared/enums';
import { assertModuleFactoryCaching } from '../../../test-util';
function getLoanDebitOrdersCash(): ILoanDebitOrderDetails {
   return {
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
      nextInstallmentDate: '2018-07-30T02:00:00+02:00',
      paymentMethod: 'Cash',
      bankName: 'ABSA BANK (PREF BRANCH CODE)',
      bankBranchCode: 632005,
      bankAccNumber: '9071836461',
      bankAccountType: 'CA',
      similarAccounts: [{ itemAccountId: '`12', accountNumber: '711647500000001', currentBalance: 193650.28 }]
   };
}
const mockLoan = getLoanDebitOrdersCash();
const mockIActionSuccess: IActionSuccess = {
   'isSuccess': true
};
const mockIActionFailure: IActionSuccess = {
   'isSuccess': false
};
const mockAlertMessageSuccess: ISetAlertMessage = {
   message: `Your request to change certain details on this debit order has been submitted,
  we\'ll let you know when the changes have been made.`,
   alertAction: AlertActionType.None,
   alertType: AlertMessageType.Success

};
const mockAlertMessageFailure: ISetAlertMessage = {
   message: 'Technical error has occured',
   alertAction: AlertActionType.None,
   alertType: AlertMessageType.Error

};
describe('LoanDetailsComponent', () => {
   let component: LoanDetailsComponent;
   let fixture: ComponentFixture<LoanDetailsComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LoanDetailsComponent, NumberFormatPipe, MessageAlertComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LoanDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.loanDebitOrder = mockLoan;
      component.status = mockIActionSuccess;
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('loan asset details should be initialized', () => {
      component.ngOnInit();
      expect(component.loanAssetDetails).not.toBeNull();
      expect(component.loanAssetDetails).toEqual(mockLoan.assetDetails);
   });
   it('set alert message', () => {
      component.setMessage(mockAlertMessageSuccess);
      expect(component.message).toEqual(mockAlertMessageSuccess.message);
      expect(component.alertAction).toEqual(mockAlertMessageSuccess.alertAction);
      expect(component.alertType).toEqual(mockAlertMessageSuccess.alertType);
   });
   it('set message using ngOnChange when success', () => {
      spyOn(component, 'ngOnChanges').and.callThrough();
      component.ngOnChanges();
      expect(component.isShowAlert).toBe(true);
   });
   it('set message using ngOnChange when failure', () => {
      spyOn(component, 'ngOnChanges').and.callThrough();
      component.status = mockIActionFailure;
      component.ngOnChanges();
      expect(component.isShowAlert).toBe(true);
      expect(component.message).toEqual(mockAlertMessageFailure.message);
   });
});
