import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiateAutopayComponent } from './initiate-autopay.component';
import { Observable } from 'rxjs/Observable';
import { IAutoPayDetail } from '../apo.model';
import { ApoService } from '../apo.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IApiResponse, IPlasticCard } from '../../../core/services/models';
import { PreFillService } from '../../../core/services/preFill.service';
import { DaySelectionTextPipe } from '../../../shared/pipes/day-selection-text.pipe';
import { assertModuleFactoryCaching } from '../../../test-util';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { GaTrackingService } from '../../../core/services/ga.service';

const autoPayDetails: IAutoPayDetail = {
   payToAccount: '589846 076131664 5',
   payToAccountName: 'MR 1RICH GARFIELD',
   autoPayInd: true,
   statementDate: '2018-07-04T00:00:00',
   dueDate: '2018-07-29T00:00:00',
   camsAccType: 'NGB',
   autoPayMethod: 'F',
   autoPayAmount: '',
   branchOrUniversalCode: '123456',
   nedbankIdentifier: true,
   mandateAction: true,
   payFromAccount: '6666666666666',
   payFromAccountType: '2',
   monthlyPaymentDay: '19',
   autoPayTerm: '00',
   allowTermsAndCond: true
};
const deleteApo: IApiResponse = {
   data: null,
   metadata: {
      resultData: [
         {
            resultDetail: [
               {
                  operationReference: 'APO deleted successfully',
                  result: 'R00',
                  status: 'SUCCESS',
                  reason: 'Success'
               }
            ]
         }
      ]
   }
};
const mockCard: IPlasticCard = {
   plasticId: 1,
   plasticNumber: '123456 0000 7890',
   plasticStatus: 'Blocked',
   dcIndicator: 'C',
   plasticCustomerRelationshipCode: '',
   plasticStockCode: '',
   plasticCurrentStatusReasonCode: '',
   plasticBranchNumber: '1',
   nameLine: 'Master',
   expiryDate: '2020-11-12 12:00:00 AM',
   issueDate: '',
   plasticDescription: '',
   allowBlock: false,
   allowReplace: false,
   linkedAccountNumber: '123',
   cardAccountNumber: '999',
   ItemAccountId: '',
   isCardFreeze: false
};
const autopayServiceStub = {
   deleteAutoPayDetails: jasmine.createSpy('deleteAutoPayDetails').and.returnValue(Observable.of(deleteApo)),
   setAutoPaySummary: jasmine.createSpy('setAutoPaySummary'),
   getAutoPaySummary: jasmine.createSpy('getAutoPaySummary'),
   getCardDetails: jasmine.createSpy('getCardDetails').and.returnValue(mockCard),
   getAccountId: jasmine.createSpy('getAccountId').and.returnValue(null)
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
const preFillServiceStub = new PreFillService();
preFillServiceStub.preFillAutoPayDetail = autoPayDetails;
describe('InitiateAutopayComponent', () => {
   let component: InitiateAutopayComponent;
   let fixture: ComponentFixture<InitiateAutopayComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [InitiateAutopayComponent, DaySelectionTextPipe, AmountTransformPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: PreFillService, useValue: preFillServiceStub },
         { provide: ApoService, useValue: autopayServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(InitiateAutopayComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call send event when user came through cards management to set apo details', () => {
      autopayServiceStub.getAccountId.and.returnValue(1);
      component.selectSendEvent();
      expect(component.accountId).toBe(1);
   });
   it('should call showAutopay', () => {
      component.autopayDetails.autoPayInd = true;
      component.showAutopay();
      expect(component.isEditAutoPay).toBe(true);
   });
   it('should call populateFields method to populate the fields preffered value ', () => {
      component.autopayDetails.autoPayMethod = 'A';
      component.populateFields();
      expect(component.paymentAmountText).toBe('Own amount');
   });
   it('should call populateFields method to populate the fields Minimum value ', () => {
      component.autopayDetails.autoPayMethod = 'M';
      component.populateFields();
      expect(component.paymentAmountText).toBe('Minimum amount due');
   });
   it('should call populateFields method for current account ', () => {
      component.autopayDetails.payFromAccountType = 'CA';
      component.populateFields();
      expect(component.payFromBankType).toBe('Current Account');
   });
   it('should call populateFields method for monthly payment day ', () => {
      component.autopayDetails.monthlyPaymentDay = '20';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(20);
   });
   it('should call populateFields method for autopay term as 25 ', () => {
      component.autopayDetails = autoPayDetails;
      component.autopayDetails.monthlyPaymentDay = '00';
      component.autopayDetails.autoPayTerm = '25';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(29);
   });
   it('should call populateFields method for autopay term as 24 ', () => {
      component.autopayDetails = autoPayDetails;
      component.autopayDetails.monthlyPaymentDay = '00';
      component.autopayDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(28);
   });
   it('should call populateFields method for autopay term as 23 ', () => {
      component.autopayDetails = autoPayDetails;
      component.autopayDetails.monthlyPaymentDay = '00';
      component.autopayDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(27);
   });
   it('should call populateFields method for autopay term as 24 and due day 1', () => {
      component.autopayDetails.dueDate = '2018-08-1';
      component.autopayDetails.monthlyPaymentDay = '00';
      component.autopayDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(31);
   });
   it('should call populateFields method for autopay term as 24 and due day 2', () => {
      component.autopayDetails.dueDate = '2018-08-2';
      component.autopayDetails.monthlyPaymentDay = '00';
      component.autopayDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(1);
   });
   it('should call populateFields method for autopay term as 23 and due day 1', () => {
      component.autopayDetails.dueDate = '2018-08-1';
      component.autopayDetails.monthlyPaymentDay = '00';
      component.autopayDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(30);
   });
   it('should call populateFields method for autopay term as 23 and due day 2', () => {
      component.autopayDetails.dueDate = '2018-08-2';
      component.autopayDetails.monthlyPaymentDay = '00';
      component.autopayDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(31);
   });
   it('should call showAutoPaySettings method for add autopay ', () => {
      component.showAutoPaySettings();
      expect(component.isAutoPay).toBe(false);
   });
   it('should call editAutoPay method for edit autopay ', () => {
      component.autopayDetails.autoPayInd = true;
      component.autopayDetails.mandateAction = true;
      component.editAutoPay();
      expect(component.isEditAutoPay).toBe(true);
   });
   it('should call editAutoPay method for edit autopay return false ', () => {
      component.autopayDetails.autoPayInd = false;
      component.autopayDetails.mandateAction = true;
      component.editAutoPay();
      expect(component.isEditAutoPay).toBe(false);
   });
   it('should call editAutoPay method for edit autopay but not allowing to edit the apo ', () => {
      component.autopayDetails.mandateAction = false;
      component.editAutoPay();
      expect(component.isEditAutoPay).toBe(false);
   });
   it('should call deleteAutoPay', () => {
      component.autopayDetails.mandateAction = true;
      component.deleteAutoPay();
      expect(component.isDeleteAutoPay).toBe(false);
   });
   it('should call deleteAutoPay else part for not allowing to delete the apo', () => {
      component.autopayDetails.mandateAction = false;
      component.deleteAutoPay();
      expect(component.isEnableEditAndDelete).toBe(true);
   });
   it('should call closeEditAndDeleteAlert', () => {
      component.closeEditAndDeleteAlert();
      expect(component.isEnableEditAndDelete).toBe(false);
   });
   it('should call goToCards', () => {
      component.goToCards();
      expect(component.isSuccess).toBe(false);
   });
   it('should call showDeleteOverlay', () => {
      component.autopayDetails.autoPayInd = true;
      component.autopayDetails.mandateAction = true;
      component.showDeleteOverlay();
      expect(component.isEditAutoPay).toBe(false);
   });
   it('should call showDeleteOverlay when autopay indicator false', () => {
      component.autopayDetails.autoPayInd = false;
      component.autopayDetails.mandateAction = true;
      component.showDeleteOverlay();
      expect(component.isEditAutoPay).toBe(false);
   });
   it('should call onClose in false', () => {
      component.onClose(false);
      expect(component.isAutoPay).toBe(false);
   });
   it('should call onClose in true', () => {
      component.onClose(true);
      expect(component.isAutoPay).toBe(false);
   });
   it('should call onEditAutoPayClose', () => {
      component.onEditAutoPayClose(true);
      expect(component.isEditAutoPay).toBe(true);
   });
   it('should call onSuccess', () => {
      component.onSuccess(false);
      expect(component.isSuccess).toBe(true);
   });
   it('should call hideStepper', () => {
      component.hideStepper(false);
      expect(component.isApoStepper).toBe(false);
   });

});
