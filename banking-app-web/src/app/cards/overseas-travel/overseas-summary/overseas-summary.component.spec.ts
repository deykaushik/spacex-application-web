import { async, ComponentFixture, TestBed, inject, fakeAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable} from 'rxjs/Observable';
import { OverseasSummaryComponent } from './overseas-summary.component';
import { WorkflowService } from '../../../core/services/stepper-work-flow-service';
import { OverseaTravelService } from '../overseas-travel.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { Constants } from '../../../core/utils/constants';
import { IStepper } from '../../../shared/components/stepper-work-flow/stepper-work-flow.models';
import { IOverseasTravelDetails, IPlasticCard, IMetaData } from '../../../core/services/models';
import { CardMaskPipe } from '../../../shared/pipes/card-mask.pipe';
import { assertModuleFactoryCaching } from '../../../test-util';

const mockOverseasTravelDetails: IOverseasTravelDetails = {
   fromDate: '2018-08-08',
   toDate: '2018-11-02',
   plasticId: ['13'],
   countries: ['CHAD', 'CANADA'],
   primaryNumber: '27814482411',
   alteranteNumber: '',
   email: 'J.BREWIS@INTEKOM.CO.ZA',
   contactNumber: '27646464657',
   overseasContactPerson: { 'name': '', 'number': '' },
   localContactPerson: { 'name': '', 'number': '' }
};

const mockCards: IPlasticCard[] = [{
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
}, {
   plasticId: 2,
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
}];

const mockTransactionsMetadata: IMetaData = {
   'resultData': [
      {
         'resultDetail': [
            {
               'operationReference': 'TRANSACTION',
               'result': 'R00',
               'status': 'SUCCESS',
            }
         ]
      }
   ]
};

const mockTransactionsMetadataFailure: IMetaData = {
   'resultData': [
      {
         'resultDetail': [
            {
               'operationReference': 'TRANSACTION',
               'result': 'R01',
               'status': 'FAILURE',
            }
         ]
      }
   ]
};

const navigationSteps = Constants.overseasTravel.steps;

const mockWorkflowSteps: IStepper[] = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
{ step: navigationSteps[1], valid: false, isValueChanged: false },
{ step: navigationSteps[2], valid: false, isValueChanged: false },
{ step: navigationSteps[3], valid: false, isValueChanged: false },
{ step: navigationSteps[4], valid: false, isValueChanged: false }];

const overseaTravelServiceStub = {
   getOverseasTravelDetails: jasmine.createSpy('getOverseasTravelDetails').and.returnValue(mockOverseasTravelDetails),
   createOverseasTravelNotificationDetails: jasmine.createSpy('createOverseasTravelNotificationDetails').and.callFake(function () {
      return Observable.of(mockTransactionsMetadata);
   }),
   getCardDetails: jasmine.createSpy('getCardDetails').and.returnValue(mockCards),
   setOtnSucces: jasmine.createSpy('setOtnSucces')
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('SummaryComponent', () => {
   let component: OverseasSummaryComponent;
   let fixture: ComponentFixture<OverseasSummaryComponent>;
   let workflowService: WorkflowService;
   let router: Router;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [OverseasSummaryComponent, CardMaskPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [WorkflowService, { provide: OverseaTravelService, useValue: overseaTravelServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }, SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(inject([WorkflowService], (service: WorkflowService) => {
      fixture = TestBed.createComponent(OverseasSummaryComponent);
      component = fixture.componentInstance;
      workflowService = service;
      workflowService.workflow = [{ step: navigationSteps[0], valid: false, isValueChanged: false },
      { step: navigationSteps[1], valid: false, isValueChanged: false },
      { step: navigationSteps[2], valid: false, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false },
      { step: navigationSteps[4], valid: false, isValueChanged: false }];
      fixture.detectChanges();
      router = TestBed.get(Router);
   }));

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should edit the step', () => {
      spyOn(workflowService.finalStepEditEmitter, 'emit');
      component.onEditClick(1);
      expect(workflowService.finalStepEditEmitter.emit).toHaveBeenCalled();
   });

   it('should make the api call', fakeAsync(() => {
      workflowService.workflow = [{ step: navigationSteps[0], valid: true, isValueChanged: false },
      { step: navigationSteps[1], valid: true, isValueChanged: false },
      { step: navigationSteps[2], valid: true, isValueChanged: false },
      { step: navigationSteps[3], valid: false, isValueChanged: false }];
      component.submitOverseasTravelDetails();
      expect(component.isButtonLoader).toBe(false);
   }));

   it('should make button loader false when respone is R01', fakeAsync(() => {
      overseaTravelServiceStub.createOverseasTravelNotificationDetails.and.callFake(function () {
         return Observable.of(mockTransactionsMetadataFailure);
      });
      const systemService = TestBed.get(SystemErrorService);
      spyOn(systemService, 'raiseError');
         component.submitOverseasTravelDetails();
      expect(component.isButtonLoader).toBe(false);
      expect(systemService.raiseError).toHaveBeenCalled();
   }));
});
