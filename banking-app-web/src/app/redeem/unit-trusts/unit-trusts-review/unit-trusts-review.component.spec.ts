import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../test-util';
import { IStepInfo } from './../../../shared/components/work-flow/work-flow.models';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { UnitTrustsService } from './../unit-trusts.service';
import { UnitTrustsReviewComponent } from './unit-trusts-review.component';

const testComponent = class {};
const routerTestingParam = [
   { path: 'unitTrusts/status', component: testComponent },
   { path: 'dashboard', component: testComponent },
];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const unitTrustsServiceStub = {
   isPaymentSuccessful: true,
   redemRewards: jasmine.createSpy('redemRewards')
      .and.returnValue(Observable.create(observer => {
      observer.next({isValid: true});
      observer.complete();
      })),
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
         }],
         yourReference: 'Testing'
      })
};

describe('UnitTrustsReviewComponent', () => {
   let component: UnitTrustsReviewComponent;
   let fixture: ComponentFixture<UnitTrustsReviewComponent>;
   let service: UnitTrustsService;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [UnitTrustsReviewComponent, AmountTransformPipe],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [
            { provide: UnitTrustsService, useValue: unitTrustsServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(UnitTrustsReviewComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      service = TestBed.get(UnitTrustsService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should contain step handler', () => {
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

   it('should set button loader state to false on API failure ', () => {
      service.redemRewards = jasmine.createSpy('redemRewards')
         .and.returnValue(Observable.create(observer => {
         observer.error(new Error('error'));
         observer.complete();
      }));
      spyOn(component.isButtonLoader, 'emit');
      component.nextClick(2);
      expect(component.isButtonLoader.emit).toHaveBeenCalled();
   });

   it('should load status component on transfer api response ', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.nextClick(2);
      const url = spy.calls.first().args[0];
      expect(url).toBe('/unitTrusts/status');
   });
});
