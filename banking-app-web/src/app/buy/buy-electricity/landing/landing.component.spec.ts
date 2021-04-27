import { ColoredOverlayComponent } from './../../../shared/overlays/colored-overlay/overlay.component';
import { SharedModule } from './../../../shared/shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../../test-util';
import { LandingComponent } from './landing.component';
import { BuyElectricityService } from '../buy-electricity.service';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BuyElectricityAmountModel } from '../buy-electricity-amount/buy-electricity-amount.model';
import { LoaderService } from '../../../core/services/loader.service';


const buyServiceStub = {
   electricityWorkflowSteps: {
      buyAmount: {
         model: new BuyElectricityAmountModel(),
      }
   },
   initializeBuyElectricityWorkflow: jasmine.createSpy('initializeBuyElectricityWorkflow'),
   checkDirtySteps: jasmine.createSpy('checkDirtySteps').and.returnValue(true),
   accountsDataObserver: new BehaviorSubject(null),
   getStepSummary: jasmine.createSpy('getStepSummary').and.callFake((stepId) => {
      return {
         title: 'test' + stepId,
         sequenceId: stepId
      };
   }),
   refreshAccountData: jasmine.createSpy('refreshAccountData')
};

describe('LandingComponent buy', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: BuyElectricityService, useValue: buyServiceStub }, LoaderService,
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountnumber: 1 }) } }]
      }).compileComponents();
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
      expect(buyServiceStub.initializeBuyElectricityWorkflow).toHaveBeenCalled();
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

   it('should have call canDeactivate ', () => {
      expect(component.canDeactivate()).toBeFalsy();
   });

   it('should not show overlay ', () => {
      buyServiceStub.accountsDataObserver.next([1]);
      expect(component.isAccountsOverlay).toBeFalsy();
   });

   it('should hide loader when acounts loaded  ', () => {
      buyServiceStub.accountsDataObserver.next([]);
      expect(component.isAccountsLoaded).toBeTruthy();
   });

});
