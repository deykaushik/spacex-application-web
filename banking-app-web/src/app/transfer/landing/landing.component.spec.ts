import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../test-util';
import { LandingComponent } from './landing.component';
import { TransferService } from './../transfer.service';
import { PreFillService } from '../../core/services/preFill.service';
import { IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { TransferAmountModel } from '../transfer-amount/transfer-amount.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IDashboardAccount, ISettlementDetail } from '../../core/services/models';
import { TrusteerService } from '../../core/services/trusteer-service';

const transferServiceStub = {
   transferWorkflowSteps: {
      amountStep: {
         model: new TransferAmountModel(),
      }
   },
   initializeTransferWorkflow: jasmine.createSpy('initializeTransferWorkflow'),
   checkDirtySteps: jasmine.createSpy('checkDirtySteps').and.returnValue(true),
   getStepSummary: jasmine.createSpy('getStepSummary').and.callFake((stepId) => {
      return {
         title: 'test' + stepId,
         sequenceId: stepId
      };
   })
};

const accountToTransfer: IDashboardAccount = {
   AccountName: 'Inv CA0',
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
   ItemAccountId: '1',
   InterestRate: 0,
   settlementAmt: 100
};


const mockSettlementData: ISettlementDetail = {
   settlementAmt: 100,
   settlementDate: '01-01-0001',
   accountToTransfer: accountToTransfer
};

const preFillServiceStub = new PreFillService();
preFillServiceStub.settlementDetail = mockSettlementData;

describe('LandingComponent transfer', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;
   let preFillService: PreFillService;
   let transferService: TransferService;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [TrusteerService,
            {
            provide: TransferService,
            useValue: transferServiceStub
         },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountnumber: 1 }) } },
         { provide: PreFillService, useValue: preFillServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      preFillService = TestBed.get(PreFillService);
      transferService = TestBed.get(TransferService);
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call initializeTransferWorkflow method', () => {
      expect(transferService.initializeTransferWorkflow).toHaveBeenCalled();
   });
   it('should check if steps are dirty', () => {
      transferService.initializeTransferWorkflow();
      const isDirty: Boolean = component.isDirty;
      expect(transferService.checkDirtySteps).toHaveBeenCalled();
      expect(isDirty).toBe(true);
   });
   it('should call get all steps summary', () => {
      expect(transferService.getStepSummary(1, true).title).toEqual('test1');
      expect(transferService.getStepSummary(1, true).sequenceId).toEqual(1);
      expect(transferService.getStepSummary).toHaveBeenCalledWith(1, true);
      expect(transferService.getStepSummary(2, true).title).toEqual('test2');
      expect(transferService.getStepSummary(2, true).sequenceId).toEqual(2);
      expect(transferService.getStepSummary).toHaveBeenCalledWith(2, true);
   });

   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should contain step handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });
   it('should have canDeactivate inherited', () => {
      expect(component.canDeactivate).toBeDefined();
   });

   it('should have call canDeactivate ', () => {
      expect(component.canDeactivate()).toBeFalsy();
   });

   it('should fill pre transfer data into transfer models', () => {
      preFillService.settlementDetail = mockSettlementData;
      component.fillTransferData();
      expect(transferService.transferWorkflowSteps.amountStep.model.amount).toBe(100);
      expect(transferService.transferWorkflowSteps.amountStep.model.accountToTransfer).toBe(accountToTransfer.ItemAccountId);
   });

   it('should not fill pre transfer data into transfer models', () => {
      preFillService.settlementDetail = undefined;
      component.fillTransferData();
      expect(transferService.transferWorkflowSteps.amountStep.model.amount).toBe(undefined);
      expect(transferService.transferWorkflowSteps.amountStep.model.accountToTransfer).toBe(undefined);
   });
});
