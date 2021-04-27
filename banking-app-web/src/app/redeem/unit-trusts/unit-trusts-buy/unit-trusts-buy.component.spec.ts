import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { assertModuleFactoryCaching } from './../../../test-util';
import { ClientProfileDetailsService } from './../../../core/services/client-profile-details.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { AmountFormatDirective } from './../../../shared/directives/amount-format.directive';
import { ValidateRequiredDirective } from './../../../shared/directives/validations/validation-required.directive';
import { SkeletonLoaderPipe } from './../../../shared/pipes/skeleton-loader.pipe';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';

import { UnitTrustWidgetComponent } from './../unit-trust-widget/unit-trust-widget.component';
import { UnitTrustsService } from './../unit-trusts.service';
import { UnitTrustsBuyComponent } from './unit-trusts-buy.component';

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const clientDetailsStub = {
   getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue({
      CisNumber: 123,
      PassportNo: 'abc',
      Resident: 'ZA',
      IdOrTaxIdNo: 1234
   })
};

const unitTrustsServiceStub = {
   getBuyVm: jasmine.createSpy('getBuyVm')
      .and.returnValue({
         fromAccount: {
            nickname: 'Test'
         },
         toAccounts: [{
            productPropertyList: [{
               propertyName: 'name',
               propertyValue: 'value'
            }]
         }]
      }),
   saveBuyInfo: jasmine.createSpy('saveBuyInfo'),
   rateDataObserver: new BehaviorSubject({
      data: {
         'programmeRate': 0.0277777778
      }
   }),
   accountsDataObserver: new BehaviorSubject([{
      accountNumber: 601710000004,
      nickname: 'Greenbacks',
      accountType: 'Rewards',
      availableBalance: 2000,
      currency: 'GB'
   }]),
   unitTrustsListDataObserver: new BehaviorSubject([{
      productCostPoints: 0,
      productCostRands: 0,
      productPropertyList: [{
         propertyName: 'NedbankUnitTrustAccountNumber',
         propertyValue: 123
      }, {
         propertyName: 'NedbankUnitTrustAccountName',
         propertyValue: 'XFnd'
      }]
   }]),
   fetchTermsAndConditions: jasmine.createSpy('fetchTermsAndConditions')
};

describe('UnitTrustsBuyComponent', () => {
   let component: UnitTrustsBuyComponent;
   let fixture: ComponentFixture<UnitTrustsBuyComponent>;
   let service: UnitTrustsService;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            UnitTrustsBuyComponent,
            UnitTrustWidgetComponent,
            AmountTransformPipe,
            SkeletonLoaderPipe,
            AmountFormatDirective,
            ValidateRequiredDirective
         ],
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            AmountTransformPipe,
            { provide: UnitTrustsService, useValue: unitTrustsServiceStub },
            { provide: ClientProfileDetailsService, useValue: clientDetailsStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .overrideComponent(UnitTrustWidgetComponent, {
            set: {
               template: ``
            }
         })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(UnitTrustsBuyComponent);
      component = fixture.componentInstance;
      service = TestBed.get(UnitTrustsService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should contain next handler', () => {
      expect(component.nextClick).toBeDefined();
   });

   it('should call next handler', () => {
      const currentStep = 1;
      expect(component.nextClick(currentStep)).toBeUndefined();
   });

   it('should call step handler', () => {
      const stepInfo: IStepInfo = {
         activeStep: 2,
         stepClicked: 1
      };
      expect(component.stepClick(stepInfo)).toBeUndefined();
   });

   it('should reset unit trusts component on rand value change', () => {
      spyOn(component, 'resetUnitTrusts').and.callThrough();
      const input = fixture.debugElement.query(By.css('#rand-value')).nativeElement;
      input.value = 100;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.resetUnitTrusts).toHaveBeenCalled();
   });

   it('should update from account and rand value on account selection change', () => {
         spyOn(component, 'onRandValueChange');
         const newVm = Object.assign({}, component.accounts[0]);
         newVm.accountNumber = '123';
         component.onAccountSelection(newVm);
         expect(component.vm.fromAccount.accountNumber).toBe('123');
         expect(component.onRandValueChange).toHaveBeenCalled();
   });

   it('should update totalRandValue on rand value change in widget', () => {
      component.unitTrusts[0].productCostRands = 100;
      component.selectedUnitTrustsUpdated(null);
      expect(component.totalAmountConsumed).toBe(100);
   });
});
