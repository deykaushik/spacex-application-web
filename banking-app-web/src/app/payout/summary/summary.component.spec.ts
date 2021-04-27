import { TestBed, async, ComponentFixture, inject, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { assertModuleFactoryCaching } from '../../test-util';
import { Constants } from '../../core/utils/constants';
import { PreFillService } from '../../core/services/preFill.service';
import { WorkflowService } from '../../core/services/stepper-work-flow-service';

import { IBuildingPayout, IMetaData, IBuildingLoanPayout } from '../payout.models';
import { PayoutService } from '../payout.service';
import { SummaryComponent } from './summary.component';
import { GaTrackingService } from '../../core/services/ga.service';


const navigationSteps = Constants.labels.buildingLoan.steps;

const prefillService = new PreFillService();
prefillService.buildingBalanceData = {
   accountName: 'BOND A/C',
   accountNumber: '8605376000101',
   accountType: 'HL',
   currency: '&#x52;',
   outstandingBalance: 1.17,
   nextInstallmentAmount: 3519.45,
   amountInArrears: -181726.91,
   nextPaymentDue: 3519.45,
   nextPaymentDate: '2018-05-01T05:30:00+05:30',
   interestRate: 8.25,
   loanAmount: 405000,
   email: 'test@gmail.com',
   paymentTerm: '240',
   termRemaining: '64 months',
   balanceNotPaidOut: 10000,
   registeredAmount: 405000,
   accruedInterest: 0,
   isSingleBond: true,
   PropertyAddress: '6, WABOOM, 40672, Sandton',
   nameAndSurname: 'Mr Brian Bernard Sheinuk',
   contactNumber: '+27991365718'
};

const mockPayoutMyselfData: IBuildingPayout = {
   propertyAddress: 'address line 1',
   payOutType: 'PROGRESS',
   amount: '543543',
   recipientName: 'George James',
   bank: 'NEDBANK',
   accountNumber: '64523675627',
   contactType: 'MYSELF',
   personName: 'George James',
   personContactNumber: '+2754635463',
   email: 'georgeja@nedbank.co.za',
   accountId: '3'
};

const mockPayoutSpecifyData: IBuildingPayout = {
   propertyAddress: 'address line 1',
   payOutType: 'Final',
   amount: 'Max',
   recipientName: 'George James',
   bank: 'NEDBANK',
   accountNumber: '64523675627',
   contactType: 'SPECIFICPERSON',
   personName: 'George James',
   personContactNumber: '+2754635463',
   email: 'georgeja@nedbank.co.za',
   accountId: '3'
};

const mockRequest: IBuildingLoanPayout = {
   payOutType: 'PROGRESS',
   payOutAmount: 367,
   contactTo: 'MYSELF',
   isPayOutAmount: false,
   buildingRecipientDetails: {
      bankName: 'NEDBANK',
      recipientName: 'hjsgdhfjs',
      bankAccountNumber: '6742336674627',
   },
   buildingCustomerDetails: {
      personContactNumber: '+27991365718',
      personName: 'Mr Brian Bernard Sheinuk',
      email: 'georgeja@nedbank.co.za'
   }
};

const mockTransactionsMetadata: IMetaData = {
   'resultData': [
      {
         'resultDetail': [
            {
               'operationReference': 'BUILDING LOAN OPERATION',
               'result': 'R00',
               'status': 'SUCCESS',
            }
         ]
      }
   ]
};

const payoutServiceStub = {
   createBuildingLoanPayout: jasmine.createSpy('createBuildingLoanPayout').and.returnValue(Observable.of(mockTransactionsMetadata)),
   getCreateRequestData: jasmine.createSpy('getCreateRequestData').and.returnValue(Observable.of(mockRequest))
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('SummaryComponent', () => {
   let component: SummaryComponent;
   let fixture: ComponentFixture<SummaryComponent>;
   let router: Router;
   let payoutService;
   let workflowService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [SummaryComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            WorkflowService,
            { provide: PayoutService, useValue: payoutServiceStub },
            { provide: PreFillService, useValue: prefillService },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      }).compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(SummaryComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
      { step: navigationSteps[1], valid: false, isValueChanged: false },
      { step: navigationSteps[2], valid: false, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      payoutService = fixture.debugElement.injector.get(PayoutService);
      payoutService.payoutData = mockPayoutMyselfData;
      fixture.detectChanges();
      router = TestBed.get(Router);
   }));
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should set the respective values', () => {
      const workflowSteps = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
      { step: navigationSteps[1], valid: false, isValueChanged: false },
      { step: navigationSteps[2], valid: false, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      payoutService.payoutData = mockPayoutSpecifyData;
      component.ngOnInit();
      expect(component.payoutStepData).toEqual(mockPayoutSpecifyData);
      expect(component.paymentAmount).toBe('Max. amount');
      expect(component.paymentType).toBe('Final');
      expect(component.workflowSteps).toEqual(workflowSteps);
      expect(component.amountLabel).toBe('Amount:');
   });
   it('should edit the step', () => {
      spyOn(workflowService.finalStepEditEmitter, 'emit');
      component.onEditClick(1);
      expect(workflowService.finalStepEditEmitter.emit).toHaveBeenCalled();
   });
   it('should format the telephone number', () => {
      expect(component.formatTelephone('+2755443428')).toBe('+27 55 443 428');
   });
   it('should make the api call', fakeAsync(() => {
      workflowService.workflow = [{ step: navigationSteps[0], valid: true, isValueChanged: false },
      { step: navigationSteps[1], valid: true, isValueChanged: false },
      { step: navigationSteps[2], valid: true, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      const spy = spyOn(router, 'navigateByUrl');
      spyOn(component, 'requestPayOut').and.callThrough();
      component.requestPayOut();
      const url = spy.calls.first().args[0];
      expect(url.toString()).toBe('/payout/done/progress/3');
      expect(component.showLoader).toBe(false);
   }));
   it('should open terms modal', () => {
      component.openTermsModal();
      expect(component.isOverlayView).toBe(true);
   });
   it('should close terms modal', () => {
      component.closeTermsModal();
      expect(component.isOverlayView).toBe(false);
   });
});
