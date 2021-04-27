import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute , Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../test-util';
import { LoaderService } from '../../../core/services/loader.service';
import { IAccountDetail } from './../../../core/services/models';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';

import { ChargesAndFeesPayModel } from './../charges-and-fees-pay/charges-and-fees-pay.model';
import { ChargesAndFeesService } from './../charges-and-fees.service';
import * as models from './../charges-and-fees.models';
import { LandingComponent } from './landing.component';
import { TrusteerService } from '../../../core/services/trusteer-service';

const testComponent = class {};
const routerTestingParam = [
      { path: 'chargesAndFees/status', component: testComponent },
      { path: 'dashboard', component: testComponent },
   ];
const chargesAndFeesStub = {
   chargesAndFeesWorkFlowSteps: {
      buy: {
         isNavigated: false,
         sequenceId: models.ChargesAndFeesStep.pay,
         model: new ChargesAndFeesPayModel(),
         isDirty: false
      }
   },
   getPayVm: jasmine.createSpy('getPayVm').and.returnValue({}),
   initializeChargesAndFeesPayWorkflow : jasmine.createSpy('initializeChargesAndFeesPayWorkflow'),
   checkDirtySteps: jasmine.createSpy('checkDirtySteps').and.returnValue(true),
   rewardsAccountDataObserver: new BehaviorSubject(null),
   accountAvailabilityObserver: new BehaviorSubject(null),
   refreshAccounts: jasmine.createSpy('refreshAccounts'),
   getStepSummary: jasmine.createSpy('getStepSummary').and.callFake((stepId) => {
      return {
         title: 'test' + stepId,
         sequenceId: stepId
      };
   })
};

describe('LandingComponent charges and fees', () => {
   let component: LandingComponent;
   let fixture: ComponentFixture<LandingComponent>;
   let unitTrustsService: ChargesAndFeesService;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async( () => {
      TestBed.configureTestingModule({
         declarations: [LandingComponent],
         imports: [
            RouterTestingModule.withRoutes(routerTestingParam),
         ],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [TrusteerService,
            { provide: ChargesAndFeesService, useValue: chargesAndFeesStub },
            { provide: ActivatedRoute, useValue: { params: Observable.of({ accountnumber: 1 }) } },
            LoaderService
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LandingComponent);
      router = TestBed.get(Router);
      component = fixture.componentInstance;
      unitTrustsService = TestBed.get(ChargesAndFeesService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call initializePaymentWorkflow method', () => {
      expect(chargesAndFeesStub.initializeChargesAndFeesPayWorkflow).toHaveBeenCalled();
   });

   it('should call get all steps summary', () => {
      expect(chargesAndFeesStub.getStepSummary(3, true).title).toEqual('test3');
      expect(chargesAndFeesStub.getStepSummary(3, true).sequenceId).toEqual(3);
   });

   it('should have canDeactivate inherited', () => {
      expect(component.canDeactivate).toBeDefined();
   });

   it('should not show overlay ', () => {
      chargesAndFeesStub.rewardsAccountDataObserver.next([{} as IAccountDetail]);
      expect(component.isAccountsOverlay).toBeFalsy();
   });

   it('should show overlay when has no account  ', () => {
      chargesAndFeesStub.rewardsAccountDataObserver.next([]);
      expect(component.isAccountsOverlay).toBeTruthy();
   });

   it('should show overlay when has no bank and cheque', () => {
      chargesAndFeesStub.accountAvailabilityObserver.next(true);
      expect(component.canDeactivate()).toBeFalsy();
   });
   it('should have call canDeactivate ', () => {
      expect(component.canDeactivate()).toBeFalsy();
   });
});
