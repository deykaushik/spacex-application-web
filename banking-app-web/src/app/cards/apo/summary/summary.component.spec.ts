import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ApoService } from '../apo.service';
import { IAutoPayDetail } from '../apo.model';
import { IApiResponse, ITermsAndConditions, INoticeDetails, IPlasticCard } from '../../../core/services/models';
import { ApoConstants } from '../apo-constants';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { SummaryComponent } from './summary.component';
import { assertModuleFactoryCaching } from '../../../test-util';
import { ColoredOverlayComponent } from '../../../shared/overlays/colored-overlay/overlay.component';
import { BottomButtonComponent } from '../../../shared/controls/buttons/bottom-button.component';
import { DaySelectionTextPipe } from '../../../shared/pipes/day-selection-text.pipe';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ApiService } from '../../../core/services/api.service';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import * as moment from 'moment';
import { Moment } from 'moment';

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
const operationMode = 'edit';
const noticeDetails: INoticeDetails = {
   noticeContent: '',
   versionDate: ''
};
const mockSuccessMetadata = {
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
};

const mockFailureMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'R04',
               status: 'FAILURE',
               reason: 'Not mandate'
            }
         ]
      }
   ]
};

const mockSuccessResponse: IApiResponse = {
   data: autoPayDetails,
   metadata: mockSuccessMetadata
};
const termsAndConditions: ITermsAndConditions = {
   noticeTitle: 'AAC',
   noticeType: '',
   versionNumber: 1.02,
   newVersionNumber: 1.03,
   acceptedDateTime: '2018-06-07 08:25:37 AM',
   noticeDetails: noticeDetails
};
const mockTermsResponse: IApiResponse = {
   data: termsAndConditions,
   metadata: mockSuccessMetadata
};
const mockTermsFailureResponse: IApiResponse = {
   data: {},
   metadata: mockFailureMetadata
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
   getAutoPayDetails: jasmine.createSpy('getAutoPayDetails').and.returnValue(autoPayDetails),
   setAutoPaySummary: jasmine.createSpy('setAutoPaySummary'),
   getAutoPaySummary: jasmine.createSpy('getAutoPaySummary').and.returnValue(autoPayDetails),
   getId: jasmine.createSpy('getId').and.returnValue(1),
   getMode: jasmine.createSpy('getMode').and.returnValue(operationMode),
   getTermsAndConditions: jasmine.createSpy('getTermsAndConditions').and.callFake((query, routeParams) => {
      return Observable.of('');
   }),
   acceptTermsAndConditions: jasmine.createSpy('acceptTermsAndConditions').and.callFake((query, routeParams) => {
      return Observable.of(mockTermsResponse);
   }),
   setAutoPayDetails: jasmine.createSpy('setAutoPayDetails'),
   setAPOSuccess: jasmine.createSpy('setAPOSuccess'),
   addApoDetails: jasmine.createSpy('addApoDetails').and.returnValue(Observable.of(mockSuccessResponse)),
   updateApoDetails: jasmine.createSpy('updateApoDetails').and.returnValue(Observable.of(mockSuccessResponse)),
   getCardDetails: jasmine.createSpy('getCardDetails').and.returnValue(mockCard),
   getCachedTermsAndConditions: jasmine.createSpy('getCachedTermsAndConditions').and.returnValue(null),
   setCachedTermsAndConditions: jasmine.createSpy('setCachedTermsAndConditions')
};

const navigationSteps = ApoConstants.apo.steps;
const workflowServiceStub = new WorkflowService();
const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

workflowServiceStub.getFirstInvalidStep = jasmine.createSpy('getFirstInvalidStep').and.returnValue(3);
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const mockServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});

describe('SummaryComponent', () => {
   let component: SummaryComponent;
   let fixture: ComponentFixture<SummaryComponent>;
   let service: ApoService;
   let workflowService: WorkflowService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [SummaryComponent, ColoredOverlayComponent, BottomButtonComponent, DaySelectionTextPipe,
            SpinnerComponent, AmountTransformPipe],
         schemas: [NO_ERRORS_SCHEMA],
         imports: [RouterTestingModule],
         providers: [{ provide: WorkflowService, useValue: workflowServiceStub }, ApiService,
         { provide: ApoService, useValue: autopayServiceStub },
         { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (workFlow: WorkflowService) => {
      fixture = TestBed.createComponent(SummaryComponent);
      component = fixture.componentInstance;
      component.autoPayModelDetails = autoPayDetails;
      workflowService = workFlow;
      workflowService.workflow = mockWorkflowSteps;
      component.workflowSteps = [] as IStepper[];
      component.workflowSteps = mockWorkflowSteps;
      service = fixture.debugElement.injector.get(ApoService);
      fixture.detectChanges();
   }));
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call populateFields method to populate the fields preffered value ', () => {
      component.autoPayModelDetails.autoPayMethod = 'A';
      component.populateFields();
      expect(component.paymentAmountText).toBe('Own amount');
   });
   it('should call populateFields method to populate the fields Minimum value ', () => {
      component.autoPayModelDetails.autoPayMethod = 'M';
      component.populateFields();
      expect(component.paymentAmountText).toBe('Minimum amount due');
   });
   it('should call populateFields method for current account ', () => {
      component.autoPayModelDetails.payFromAccountType = 'CA';
      component.populateFields();
      expect(component.payFromBankType).toBe('Current Account');
   });
   it('should call populateFields method for autopay term as 25 ', () => {
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '25';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(29);
   });
   it('should call populateFields method for autopay term as 24 ', () => {
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(28);
   });
   it('should call populateFields method for autopay term as 23 ', () => {
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(27);
   });
   it('should call populateFields method for autopay term as 24 and due day 1', () => {
      component.autoPayModelDetails.dueDate = '2018-08-1';
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(31);
   });
   it('should call populateFields method for autopay term as 24 and due day 2', () => {
      component.autoPayModelDetails.dueDate = '2018-08-2';
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '24';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(1);
   });
   it('should call populateFields method for autopay term as 23 and due day 1', () => {
      component.autoPayModelDetails.dueDate = '2018-08-1';
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(30);
   });
   it('should call populateFields method for autopay term as 23 and due day 2', () => {
      component.autoPayModelDetails.dueDate = '2018-08-2';
      component.autoPayModelDetails.monthlyPaymentDay = '00';
      component.autoPayModelDetails.autoPayTerm = '23';
      component.populateFields();
      expect(component.monthlyPaymentDay).toBe(31);
   });
   it('should call toggleTermsCondition ', () => {
      component.termAndConditionCheck = false;
      component.toggleTermsCondition();
      expect(component.termAndConditionCheck).toBe(true);
   });

   it('should raise the error for t and c failure', () => {
      component.termAndConditionCheck = true;
      component.acceptTerms = false;
      component.termsAndConditions = termsAndConditions;
      autopayServiceStub.getCachedTermsAndConditions.and.returnValue(null);
      service.acceptTermsAndConditions = jasmine.createSpy('acceptTermsAndConditions').and.callFake((query, routeParams) => {
         return Observable.of(mockTermsFailureResponse);
      });
      const systemService = TestBed.get(SystemErrorService);
      spyOn(systemService, 'raiseError');
      component.goToSuccess();
      expect(systemService.raiseError).toHaveBeenCalled();
   });

   it('should call goToSuccess', () => {
      component.operationMode = 'add';
      component.termAndConditionCheck = true;
      spyOn(component, 'sendApoDetails');
      component.goToSuccess();
      expect(component.sendApoDetails).toHaveBeenCalled();
      expect(component.showLoader).toBe(false);
   });

   it('should raise the error for add apo failure', () => {
      component.operationMode = 'add';
      component.termAndConditionCheck = true;
      service.addApoDetails = jasmine.createSpy('addApoDetails').and.returnValue(Observable.of(mockFailureMetadata));
      const systemService = TestBed.get(SystemErrorService);
      spyOn(systemService, 'raiseError');
      component.goToSuccess();
      expect(systemService.raiseError).toHaveBeenCalled();
   });

   it('should call goToSuccess for ATT type add operation', () => {
      workflowService.getFirstInvalidStep = jasmine.createSpy('getFirstInvalidStep').and.returnValue(2);
      component.autoPayModelDetails.camsAccType = 'ATT';
      component.acceptTerms = false;
      component.termsAndConditions = termsAndConditions;
      component.operationMode = 'add';
      component.termAndConditionCheck = true;
      component.goToSuccess();
      expect(component.showLoader).toBe(false);
   });
   it('should call goToSuccess for ATT with return value 2 part ', () => {
      workflowService.getFirstInvalidStep = jasmine.createSpy('getFirstInvalidStep').and.returnValue(2);
      component.autoPayModelDetails.camsAccType = 'ATT';
      component.operationMode = 'add';
      component.termAndConditionCheck = true;
      component.goToSuccess();
      expect(component.showLoader).toBe(false);
   });
   it('should call goToSuccess in edit mode for ATT ', () => {
      workflowService.getFirstInvalidStep = jasmine.createSpy('getFirstInvalidStep').and.returnValue(5);
      component.autoPayModelDetails.camsAccType = 'AAA';
      component.operationMode = 'edit';
      component.termAndConditionCheck = true;
      spyOn(component, 'sendApoDetails');
      component.goToSuccess();
      expect(component.sendApoDetails).toHaveBeenCalled();
      expect(component.showLoader).toBe(false);
   });
   it('should raise the error for edit apo failure', () => {
      workflowService.getFirstInvalidStep = jasmine.createSpy('getFirstInvalidStep').and.returnValue(5);
      component.operationMode = 'edit';
      component.termAndConditionCheck = true;
      service.updateApoDetails = jasmine.createSpy('updateApoDetails').and.returnValue(Observable.of(mockFailureMetadata));
      const systemService = TestBed.get(SystemErrorService);
      spyOn(systemService, 'raiseError');
      component.goToSuccess();
      expect(systemService.raiseError).toHaveBeenCalled();
   });
   it('should call goToSuccess for error part in edit mode', () => {
      workflowService.getFirstInvalidStep = jasmine.createSpy('getFirstInvalidStep').and.returnValue(4);
      component.autoPayModelDetails.camsAccType = 'ATT';
      component.operationMode = 'edit';
      component.termAndConditionCheck = true;
      component.goToSuccess();
      expect(component.showLoader).toBe(false);
   });
   it('should call getTermsAndConditions else part ', () => {
      service.getTermsAndConditions = jasmine.createSpy('getTermsAndConditions').and.callFake((query, routeParams) => {
         return Observable.of({});
      });
      component.getTermsAndConditions();
      expect(component.pageLoader).toBe(false);
   });
   it('should call getTermsAndConditions error part', () => {
      service.getTermsAndConditions = jasmine.createSpy('getTermsAndConditions').and.returnValue(mockServiceError);
      component.getTermsAndConditions();
      expect(component.termsAndConditions.acceptedDateTime).toBe(undefined);
   });
   it('should call openTermsAndConditions ', () => {
      component.openTermsAndConditions();
      expect(component.pageLoader).toBe(false);
   });
   it('should call closeTermsAndConditions ', () => {
      component.closeTermsAndConditions();
      expect(component.showTermsAndConditionsOverlay).toBe(false);
   });
   it('should call showTermsAndConditions ', () => {
      component.showTermsAndConditions();
      expect(component.showTermsAndConditionsOverlay).toBe(true);
   });
   it('should specify the starting month of the apo', () => {
      component.onStartingMonth();
      expect(component.startingMonth).toBe('(starting from September)');
   });
   it('should call cache data for terms and conditions', () => {
      autopayServiceStub.getCachedTermsAndConditions.and.returnValue(termsAndConditions);
      component.ngOnInit();
      expect(component.termsAndConditions).toBeDefined();
      expect(component.termsAndConditions.acceptedDateTime).toBe(termsAndConditions.acceptedDateTime);
      expect(component.termsAndConditions.noticeTitle).toBe(termsAndConditions.noticeTitle);
   });
});
