import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../test-util';
import { LoaderService } from '../../../core/services/loader.service';
import { IAccountDetail } from './../../../core/services/models';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';

import { UnitTrustsBuyModel } from './../unit-trusts-buy/unit-trusts-buy.model';
import { UnitTrustsService } from './../unit-trusts.service';
import * as models from './../unit-trusts.models';
import { LandingComponent } from './landing.component';
import { TrusteerService } from '../../../core/services/trusteer-service';

const unitTrustsServiceStub = {
   unitTrustsWorkFlowSteps: {
      buy: {
         isNavigated: false,
         sequenceId: models.UnitTrustsStep.buy,
         model: new UnitTrustsBuyModel(),
         isDirty: false
      }
   },
   getBuyVm: jasmine.createSpy('getBuyVm').and.returnValue({}),
   initializeUnitTrustsBuyWorkflow : jasmine.createSpy('initializeUnitTrustsBuyWorkflow'),
   checkDirtySteps: jasmine.createSpy('checkDirtySteps').and.returnValue(true),
   accountsDataObserver: new BehaviorSubject(null),
   getStepSummary: jasmine.createSpy('getStepSummary').and.callFake((stepId) => {
      return {
         title: 'test' + stepId,
         sequenceId: stepId
      };
   }),
   refreshAccounts: jasmine.createSpy('refreshAccounts').and.returnValue(null),
};

describe('LandingComponent unittrust', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;
   let unitTrustsService: UnitTrustsService;
   assertModuleFactoryCaching();
   beforeEach(async( () => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [TrusteerService,
            { provide: UnitTrustsService, useValue: unitTrustsServiceStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountnumber: 1 }) } },
            LoaderService
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      component = fixture.componentInstance;
      unitTrustsService = TestBed.get(UnitTrustsService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call initializePaymentWorkflow method', () => {
      expect(unitTrustsService.initializeUnitTrustsBuyWorkflow).toHaveBeenCalled();
   });

   it('should call get all steps summary', () => {
      expect(unitTrustsService.getStepSummary(3, true).title).toEqual('test3');
      expect(unitTrustsService.getStepSummary(3, true).sequenceId).toEqual(3);
   });

   it('should have canDeactivate inherited', () => {
      expect(component.canDeactivate).toBeDefined();
   });

   it('should not show overlay ', () => {
      unitTrustsService.accountsDataObserver.next([{} as IAccountDetail]);
      expect(component.isAccountsOverlay).toBeFalsy();
   });

   it('should show overlay when has no account  ', () => {
      unitTrustsService.accountsDataObserver.next([]);
      expect(component.isAccountsOverlay).toBeTruthy();
   });

   it('should have call canDeactivate ', () => {
      expect(component.canDeactivate()).toBeFalsy();
   });

});
