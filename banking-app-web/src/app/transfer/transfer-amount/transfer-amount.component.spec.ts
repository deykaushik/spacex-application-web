import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { ReoccurenceModel } from '../transfer.models';
import { TransferAmountComponent } from './transfer-amount.component';
import { TransferService } from './../transfer.service';
import { SkeletonLoaderPipe } from './../../shared/pipes/skeleton-loader.pipe';
import { AmountTransformPipe } from './../../shared/pipes/amount-transform.pipe';
import { IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { IApiResponse, IAccountDetail, ILimitDetail, IClientDetails } from '../../core/services/models';
import { Constants } from '../../core/utils/constants';
import { CommonUtility } from '../../core/utils/common';
import { SystemErrorService } from '../../core/services/system-services.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { LoaderService } from '../../core/services/loader.service';
import { GaTrackingService } from '../../core/services/ga.service';
import { RouterTestingModule } from '@angular/router/testing';

const accountData = [{
   itemAccountId: '1',
   accountNumber: '123456',
   availableBalance: 24567,
   currentBalance: 34567,
   nickname: 'Test account one',
   allowDebits: 'true',
   accountType: 'CA',
   productCode: '112',
   TransferAccountRules: {
      TransferTo: [
         {
            AccountType: 'SA',
            ProductCodes: [],
            ProductAccessType: 'Blocked'
         }
      ]
   }
}, {
   accountNumber: '2345',
   availableBalance: 24567,
   currentBalance: 34567,
   nickname: 'Test account two',
   allowCredits: 'true',
   allowDebits: false,
   productCode: '112',
   accountType: 'CA',
   TransferAccountRules: {
      TransferTo: [
         {
            AccountType: 'SA',
            ProductCodes: [],
            ProductAccessType: 'Blocked'
         }
      ]
   }
}];
const transferServiceStub = {
   transferWorkflowSteps: {
      amountStep: {
         isDirty: false
      },
      reviewStep: {
         isDirty: false
      }
   },
   getActiveAccounts: jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of(accountData)),
   getLimits: jasmine.createSpy('getLimits').and.returnValue(Observable.of(getMockTransferLimitData())),
   saveTransferAmountInfo: jasmine.createSpy('saveTransferAmountInfo'),
   saveTransferReviewInfo: jasmine.createSpy('saveTransferReviewInfo'),
   getTransferAmountVm: jasmine.createSpy('getTransferAmountVm').and.returnValue({
      amount: 0,
      selectedFromAccount: null,
      selectedToAccount: null,
      payDate: new Date()
   })
};
function getMockTransferLimitData(): ILimitDetail[] {
   return [{
      limitType: 'transfer',
      dailyLimit: 3000,
      userAvailableDailyLimit: 3000,
      maxDailyLimit: 3000,
      isTempLimit: false,
      maxTmpDateRangeLimit: 30
   }, {
      limitType: 'payment',
      dailyLimit: 3000,
      userAvailableDailyLimit: 3000,
      maxDailyLimit: 3000,
      isTempLimit: false,
      maxTmpDateRangeLimit: 30
   }];
}
const clientDetails: IClientDetails = {
   FullNames: 'dummy test', PreferredName: 'Test', DefaultAccountId: '2',
   CisNumber: 234234, FirstName: 'test', SecondName: 'test', Surname: 'test', CellNumber: '12312',
   EmailAddress: 'asa@asas.com', BirthDate: '', FicaStatus: 989, SegmentId: '23432', IdOrTaxIdNo: 234, SecOfficerCd: '4234',
   Address: { AddressCity: '', AddressLines: [], AddressPostalCode: '' }, AdditionalPhoneList: []
};
const clientProfileDetailsServiceStub = {
   getDefaultAccount: jasmine.createSpy('getDefaultAccount').and.returnValue(undefined),
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue(clientDetails)
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('TransferAmountComponent', () => {
   let component: TransferAmountComponent;
   let fixture: ComponentFixture<TransferAmountComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [TransferAmountComponent, AmountTransformPipe, SkeletonLoaderPipe],
         imports: [RouterTestingModule, FormsModule],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: TransferService, useValue: transferServiceStub }, SystemErrorService, LoaderService,
         { provide: ClientProfileDetailsService, useValue: clientProfileDetailsServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TransferAmountComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   afterEach(() => {
      if (component.isComponentValid.observers.length) {
         component.isComponentValid.unsubscribe();
      }
   });

   it('should validate component', () => {
      component.vm.isValid = true;
      component.vm.amount = 100;
      fixture.detectChanges();
      component.validate();
      component.isComponentValid.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });

   it('should set account from if navigated from dashboard', () => {
      component.vm.accountFromDashboard = '1';
      component.vm.selectedFromAccount = null;
      component.setAccountFrom();
      expect(component.vm.selectedFromAccount.itemAccountId).toBe(component.vm.accountFromDashboard);
   });

   it('should not validate component', () => {
      component.vm.isValid = false;
      fixture.detectChanges();
      component.validate();
      component.isComponentValid.subscribe((data) => {
         expect(data).toBeFalsy();
      });
   });

   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      component.selectedPaymentFrequency = paymentRecurrenceFrequencies[1].value;
      component.vm.reoccurrenceItem = new ReoccurenceModel();
      expect(component.nextClick(currentStep)).toBeUndefined();
   });
   it('should Save with Monthly Schedule', () => {
      const currentStep = 1;
      const paymentRecurrenceFrequencies = CommonUtility.covertToDropdownObject(Constants.VariableValues.paymentRecurrenceFrequency);
      component.selectedPaymentFrequency = paymentRecurrenceFrequencies[2].value;
      component.vm.reoccurrenceItem = new ReoccurenceModel();
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should contain onFromAccountSelection handler', () => {
      expect(component.onFromAccountSelection).toBeDefined();
   });

   it('should contain onToAccountSelection handler', () => {
      expect(component.onToAccountSelection).toBeDefined();
   });


   it('should change accounts in onFromAccount Selection', inject([TransferService], (service: TransferService) => {
      component.onFromAccountSelection(component.accounts[0]);
      expect(component.vm.selectedFromAccount).toEqual(component.accounts[0]);
   }));

   it('should change accounts in onFromAccount Selection', inject([TransferService], (service: TransferService) => {
      component.onToAccountSelection(component.accounts[1]);
      expect(component.vm.selectedToAccount).toEqual(component.accounts[1]);
   }));

   it('should change anount on amount change', () => {
      component.onAmountChange(1234);
      expect(component.vm.amount).toBe(1234);
      expect(component.vm.amount).toBeGreaterThan(0);
   });

   it('should save the vm on next click', inject([TransferService], (service: TransferService) => {
      const frequency: ReoccurenceModel = {
         reoccurrenceFrequency: 'Weekly',
         reoccurrenceOccur: 2,
         reoccSubFreqVal: '2'
      };
      component.vm = {
         amount: 0,
         availableTransferLimit: 0,
         selectedFromAccount: null,
         selectedToAccount: null,
         allowedTransferLimit: 0,
         payDate: new Date(),
         isTransferLimitExceeded: false,
         isValid: true,
         reoccurrenceItem: frequency
      };
      component.nextClick(1);
      expect(service.saveTransferAmountInfo).toHaveBeenCalled();
   }));

   it('should save the vm on next click for monthly', inject([TransferService], (service: TransferService) => {
      const frequency: ReoccurenceModel = {
         reoccurrenceFrequency: 'Monthly',
         reoccurrenceOccur: 2,
         reoccSubFreqVal: '2'
      };
      component.vm = {
         amount: 0,
         availableTransferLimit: 0,
         selectedFromAccount: null,
         selectedToAccount: null,
         allowedTransferLimit: 0,
         payDate: new Date(),
         isTransferLimitExceeded: false,
         isValid: true,
         reoccurrenceItem: frequency
      };
      component.nextClick(1);
      expect(service.saveTransferAmountInfo).toHaveBeenCalled();
   }));
   it('set overlay to true if total account less than equal to one ',
      inject([TransferService, ClientProfileDetailsService, LoaderService, Injector],
         (service: TransferService, clientProfileService: ClientProfileDetailsService, loader: LoaderService, injector: Injector) => {
            service.getActiveAccounts = jasmine.createSpy('getActiveAccounts').and.returnValue(Observable.of([{
               itemAccountId: '1',
               accountNumber: '123456',
               availableBalance: 24567,
               currentBalance: 34567,
               nickname: 'Test account one'
            }]));

            const comp = new TransferAmountComponent(service, clientProfileService, loader, injector);
            comp.ngOnInit();
            expect(comp.showOverlay).toBe(true);
         }));
   it('should check if the form is dirty', () => {
      component.validate();
      expect(component.transferToForm.dirty).toBe(false);
   });
   it('validate payment on insufficant balance ', inject([TransferService], (service: TransferService) => {
      component.onAmountChange(1234);
      component.validatePaymentAmount(1233);
      expect(component.vm.isValid).toEqual(false);
      component.vm.amount = 2;
      component.validatePaymentAmount(1);
      component.vm.isTransferLimitExceeded = false;
      expect(component.vm.isValid).toEqual(false);
   }));
   it('reset ToAccount if same account selected in FromAccount', inject([TransferService], (service: TransferService) => {
      component.vm.selectedToAccount = component.accounts[0];
      component.onFromAccountSelection(component.accounts[0]);
      expect(component.vm.selectedToAccount).toBeUndefined();
   }));
   it('set amount step to dirty on account selection', inject([TransferService], (service: TransferService) => {
      component.onFromAccountSelection(component.accounts[1]);
      expect(service.transferWorkflowSteps.amountStep.isDirty).toBeTruthy();
   }));
   it('set amount step to dirty on account selection', inject([TransferService], (service: TransferService) => {
      component.onToAccountSelection(component.accounts[1]);
      expect(service.transferWorkflowSteps.amountStep.isDirty).toBeTruthy();
   }));

   it('should validate number of repetitions allowed for various payment frequencies & number of repititions.', () => {
      const frequency: ReoccurenceModel = {
         reoccurrenceFrequency: 'Weekly',
         reoccurrenceOccur: 2,
         reoccSubFreqVal: '2'
      };
      component.vm.reoccurrenceItem = frequency;
      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.none;
      expect(component.isNumReccurencesInvalid()).toBeFalsy();


      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.monthly;

      component.reoccurenceNumber = '12';
      expect(component.isNumReccurencesInvalid()).toBeFalsy();

      component.reoccurenceNumber = '13';
      expect(component.isNumReccurencesInvalid()).toBeTruthy();


      component.selectedPaymentFrequency = Constants.VariableValues.paymentRecurrenceFrequency.weekly;
      component.reoccurenceNumber = '-1';
      expect(component.isNumReccurencesInvalid()).toBeFalsy();

      component.reoccurenceNumber = '52';
      expect(component.isNumReccurencesInvalid()).toBeFalsy();

      component.reoccurenceNumber = '53';
      expect(component.isNumReccurencesInvalid()).toBeTruthy();
   });

   it('should check for changing payment frequency', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         const frequency: ReoccurenceModel = {
            reoccurrenceFrequency: 'Weekly',
            reoccurrenceOccur: 2,
            reoccSubFreqVal: '2'
         };
         component.vm.reoccurrenceItem = frequency;
         component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.none);
         expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.none);
      });
   });
   it('should set date from the date component', () => {
      const date = new Date();
      component.setDate(date);
      expect(component.vm.payDate).toBe(date);
   });
   it('should enable repeat transfer dropdown for different date', () => {
      const date = new Date('October 13, 2017 11:13:00');
      component.setDate(date);
      expect(component.vm.payDate).toBe(date);
      expect(component.isSameDate).toBeFalsy();
      component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.monthly);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.none);
         expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.none);
      });
   });
   it('should check for changing payment frequency', () => {
      component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.monthly);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onPaymentFrequencyChanged(Constants.VariableValues.paymentRecurrenceFrequency.none);
         expect(component.selectedPaymentFrequency).toBe(Constants.VariableValues.paymentRecurrenceFrequency.none);
      });
   });
   it(' should open overlay when there is no Allow debit accounts',
      inject([TransferService, ClientProfileDetailsService, LoaderService, Injector],
         (service: TransferService, clientProfileService: ClientProfileDetailsService, loader: LoaderService, injector: Injector) => {
            service.getActiveAccounts = jasmine.createSpy('getActiveAccounts').and.
               returnValue(Observable.of([accountData[1], accountData[1]]));
            service.getTransferAmountVm = jasmine.createSpy('getTransferAmountVm').and.returnValue({
               amount: 0,
               selectedFromAccount: null,
               selectedToAccount: null,
               payDate: new Date()
            });
            const comp = new TransferAmountComponent(service, clientProfileService, loader, injector);
            comp.ngOnInit();
            expect(comp.showOverlay).toBe(true);
         }));

   it(' should open overlay when there is no allow credit accounts',
      inject([TransferService, ClientProfileDetailsService, LoaderService, Injector],
         (service: TransferService, clientProfileService: ClientProfileDetailsService, loader: LoaderService, injector: Injector) => {
            service.getActiveAccounts = jasmine.createSpy('getActiveAccounts').and.
               returnValue(Observable.of([accountData[0], accountData[0]]));
            service.getTransferAmountVm = jasmine.createSpy('getTransferAmountVm').and.returnValue({
               amount: 0,
               selectedFromAccount: null,
               selectedToAccount: null,
               payDate: new Date()
            });
            const comp = new TransferAmountComponent(service, clientProfileService, loader, injector);
            comp.ngOnInit();
            expect(comp.showOverlay).toBe(true);
         }));
   it('should check for changing repeat type', () => {
      const repeatType = component.vm.repeatType;
      component.onRepeatTypeChange(repeatType);
   });
});
