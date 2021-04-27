import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from '../../../test-util';
import { CreditLimitService } from '../credit-limit.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { CreditSummaryComponent } from './summary.component';
import { AmountTransformPipe } from '../../../shared/pipes/amount-transform.pipe';
import { ICreditLimitMaintenance, IApiResponse } from '../../../core/services/models';
import { Constants } from '../../../core/utils/constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';


const mockcreditLimitDetails: ICreditLimitMaintenance = {
   plasticId: 1,
   grossMonthlyIncome: 40000,
   netMonthlyIncome: 45000,
   otherIncome: 10000,
   monthlyCommitment: 25000,
   monthlyDebt: 15000,
   bankName: 'Nedbank',
   branchNumber: '48102',
   accountNumber: '12345678902',
   preferContactNumber: '+27123456789',
   primaryClientDebtReview: 'No',
   spouseDebtReview: 'yes',
   statementRetrival: true
};

const mockAccountId = 1;
const navigationSteps = Constants.overseasTravel.steps;

const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false }];

const creditLimitServiceStub = {
   getCreditLimitMaintenanceDetails: jasmine.createSpy('getCreditLimitMaintenanceDetails').and.returnValue(mockcreditLimitDetails),
   getSummaryDetails: jasmine.createSpy('getSummaryDetails').and.returnValue(mockcreditLimitDetails),
   setSummaryDetails: jasmine.createSpy('setSummaryDetails'),
   getAccountId: jasmine.createSpy('getAccountId').and.returnValue(mockAccountId),
   requestCreditLimitIncrease: jasmine.createSpy('requestCreditLimitIncrease').and.callFake((query, routeParams) => {
      return Observable.of({
         data: null,
         metadata: {
            resultData: [
               {
                  resultDetail: [
                     {
                        operationReference: 'TRANSACTION',
                        result: 'R00',
                        status: 'SUCCESS',
                        reason: 'Success'
                     }
                  ]
               }
            ]
         }
      });
   })
};
const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};
const mockFailureMetadata = {
   resultData: [
      {
         resultDetail: [
            {
               operationReference: 'TRANSACTION',
               result: 'R04',
               status: 'FAILURE',
               reason: 'Not Valid'
            }
         ]
      }
   ]
};
const mockFailureResponse: IApiResponse = {
   data: {},
   metadata: mockFailureMetadata
};
describe('CreditSummaryComponent', () => {
   let component: CreditSummaryComponent;
   let fixture: ComponentFixture<CreditSummaryComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CreditSummaryComponent, AmountTransformPipe],
         imports: [RouterTestingModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [WorkflowService, { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: CreditLimitService, useValue: creditLimitServiceStub },
            SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(CreditSummaryComponent);
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
   it('should call goToSuccess method and route to success page', () => {
      component.isAccept = true;
      component.creditLimitDetails.statementRetrival = true;
      component.accountId = '1';
      component.goToSuccess();
      expect(component.showLoader).toBe(false);
      expect(component.summaryDetails.plasticId).toBe(1);
   });
   it('should call goToSuccess method and route to review page if statement Retrival not provided', () => {
      component.isAccept = true;
      component.creditLimitDetails.statementRetrival = false;
      component.goToSuccess();
      expect(component.showLoader).toBe(false);
   });
   it('should call goToSuccess for error part', () => {
      creditLimitServiceStub.requestCreditLimitIncrease.and.callFake((query, routeParams) => {
         return Observable.of(mockFailureResponse);
      });
      component.isAccept = true;
      component.creditLimitDetails.statementRetrival = true;
      component.accountId = '1';
      const systemService = TestBed.get(SystemErrorService);
      spyOn(systemService, 'raiseError');
      component.goToSuccess();
      expect(systemService.raiseError).toHaveBeenCalled();
      expect(component.showLoader).toBe(false);
   });
   it('should call goToOption', inject([WorkflowService], (service: WorkflowService) => {
      spyOn(service.stepClickEmitter, 'emit');
      component.goToOption(1);
      expect(service.stepClickEmitter.emit).toHaveBeenCalled();
   }));
   it('should call onAccept', () => {
      component.isAccept = false;
      component.onAccept();
      expect(component.isAccept).toBeTruthy();
   });
});
