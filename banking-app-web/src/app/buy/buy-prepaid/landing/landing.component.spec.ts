import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../../test-util';
import { LandingComponent } from './landing.component';
import { BuyService } from '../buy.service';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import * as models from './../buy.models';
import { BuyToModel } from '../buy-to/buy-to.model';
import { BuyAmountModel } from '../buy-amount/buy-amount.model';
import { LoaderService } from '../../../core/services/loader.service';
import { TrusteerService } from '../../../core/services/trusteer-service';



const buyServiceStub = {
   buyWorkflowSteps: {
      buyAmount: {
         isNavigated: false,
         sequenceId: models.BuyStep.buyTo,
         model: new BuyAmountModel(),
         isDirty: false
      }
   },
   initializeBuyWorkflow: jasmine.createSpy('initializeBuyWorkflow'),
   checkDirtySteps: jasmine.createSpy('checkDirtySteps').and.returnValue(true),
   accountsDataObserver: new BehaviorSubject(null),
   getStepSummary: jasmine.createSpy('getStepSummary').and.callFake((stepId) => {
      return {
         title: 'test' + stepId,
         sequenceId: stepId
      };
   }),
   refreshAccountData: jasmine.createSpy('refreshAccountData').and.returnValue(null),
};

describe('LandingComponent workflow', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [
            { provide: BuyService, useValue: buyServiceStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountnumber: 1 }) } },
            LoaderService, TrusteerService
         ]
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
      expect(buyServiceStub.initializeBuyWorkflow).toHaveBeenCalled();
   });

   it('should call get all steps summary', () => {
      expect(buyServiceStub.getStepSummary(3).title).toEqual('test3');
      expect(buyServiceStub.getStepSummary(3).sequenceId).toEqual(3);
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

   it('should not show overlay ', () => {
      buyServiceStub.accountsDataObserver.next([1]);
      expect(component.isAccountsOverlay).toBeFalsy();
   });

   it('should hide loader when acounts loaded  ', () => {
      buyServiceStub.accountsDataObserver.next([]);
      expect(component.isAccountsLoaded).toBeTruthy();
   });

   it('should have call canDeactivate ', () => {
      expect(component.canDeactivate()).toBeFalsy();
   });

});
