import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../test-util';
import { LandingComponent } from './landing.component';
import { PaymentService } from '../payment.service';
import { IStepInfo } from './../../shared/components/work-flow/work-flow.models';
import { PayAmountModel } from '../pay-amount/pay-amount.model';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from '../../core/services/loader.service';
import { TrusteerService } from '../../core/services/trusteer-service';


const paymentServiceStub = {
   paymentWorkflowSteps: {
      payAmount: {
         model: new PayAmountModel(),
      }
   },
   initializePaymentWorkflow: jasmine.createSpy('initializePaymentWorkflow'),
   checkDirtySteps: jasmine.createSpy('checkDirtySteps').and.returnValue(true),
   accountsDataObserver: new BehaviorSubject(null),
   getStepSummary: jasmine.createSpy('getStepSummary').and.callFake((stepId) => {
      return {
         title: 'test' + stepId,
         sequenceId: stepId
      };
   }),
   refreshAccountData: jasmine.createSpy('refreshAccountData ')
};

describe('LandingComponent PaymentStub', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: PaymentService, useValue: paymentServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountnumber: 1 }) } },
            LoaderService, TrusteerService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call initializePaymentWorkflow method', () => {
      expect(paymentServiceStub.initializePaymentWorkflow).toHaveBeenCalled();
   });

   it('should call get all steps summary', () => {
      expect(paymentServiceStub.getStepSummary).toHaveBeenCalledWith(1, true);
      expect(paymentServiceStub.getStepSummary(1).title).toEqual('test1');
      expect(paymentServiceStub.getStepSummary(1).sequenceId).toEqual(1);
      expect(paymentServiceStub.getStepSummary).toHaveBeenCalledWith(2, true);
      expect(paymentServiceStub.getStepSummary(2).title).toEqual('test2');
      expect(paymentServiceStub.getStepSummary(2).sequenceId).toEqual(2);
      expect(paymentServiceStub.getStepSummary).toHaveBeenCalledWith(3, true);
      expect(paymentServiceStub.getStepSummary(3).title).toEqual('test3');
      expect(paymentServiceStub.getStepSummary(3).sequenceId).toEqual(3);
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
   it('should not show overlay ', () => {
      paymentServiceStub.accountsDataObserver.next([1]);
      expect(component.isAccountsOverlay).toBeFalsy();
   });
   it('should hide loader when acounts loaded  ', () => {
      paymentServiceStub.accountsDataObserver.next([]);
      expect(component.isAccountsLoaded).toBeTruthy();
   });
});
