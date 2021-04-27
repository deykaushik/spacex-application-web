import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { assertModuleFactoryCaching } from './../../../test-util';
import { Constants } from './../../../core/utils/constants';
import { GaTrackingService } from '../../../core/services/ga.service';
import { SystemErrorService } from '../../../core/services/system-services.service';
import { AmountTransformPipe } from './../../../shared/pipes/amount-transform.pipe';
import { BottomButtonComponent } from './../../../shared/controls/buttons/bottom-button.component';
import { ChargesAndFeesService } from '../charges-and-fees.service';
import { ChargesAndFeesStatusComponent } from './charges-and-fees-status.component';

const testComponent = class {};
const routerTestingParam = [
   { path: 'chargesAndFees/status', component: testComponent },
   { path: 'dashboard', component: testComponent },
];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

const chargesAndfeeServiceStub = {
   transactionStatus: {
      isValid: true,
      reason: ''
   },
   isStatusNavigationAllowed: jasmine.createSpy('isStatusNavigationAllowed')
      .and.returnValue(true),
   raiseSystemError: jasmine.createSpy('raiseSystemError'),
   redemRewards: jasmine.createSpy('redemRewards')
      .and.returnValue(Observable.create(observer => {
      observer.next({isValid: true});
      observer.complete();
      })),
      getPayVm: jasmine.createSpy('getPayVm')
      .and.returnValue({
         fromAccount: {
            nickname: 'Test'
         },
         forAccount: {
            nickname: 'Test'
         },
         toAccounts: [{
            productPropertyList: [{
               propertyName: 'name',
               propertyValue: 'value'
            }]
         }]
      }),
   resetPayModel: jasmine.createSpy('resetPayModel')
};

describe('ChargesAndFeesStatusComponent', () => {
   let component: ChargesAndFeesStatusComponent;
   let fixture: ComponentFixture<ChargesAndFeesStatusComponent>;
   let service: ChargesAndFeesService;
   let router: Router;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ChargesAndFeesStatusComponent, AmountTransformPipe, BottomButtonComponent],
         imports: [
            RouterTestingModule.withRoutes(routerTestingParam),
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [
            { provide: ChargesAndFeesService, useValue: chargesAndfeeServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ChargesAndFeesStatusComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      service = TestBed.get(ChargesAndFeesService);
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should set content based on payment status and navigation check', () => {
      expect(component.successful).toBe(true);
      expect(component.heading).toBe(Constants.labels.transactionSuccess);
      service.transactionStatus = {
         isValid: false,
         reason: 'failed'
      };
      component.ngOnInit();
      expect(component.successful).toBe(false);
      expect(component.heading).toBe(Constants.labels.transactionFailed);
      service.transactionStatus = {
         isValid: true,
         reason: ''
      };
      service.isStatusNavigationAllowed = jasmine.createSpy('isStatusNavigationAllowed')
         .and.returnValue(false);
      const spy = spyOn(router, 'navigateByUrl');
      component.ngOnInit();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/chargesAndFees');
   });
   it('should have button for dashboard navigation and new redeem on success ', () => {
      const spy = spyOn(router, 'navigateByUrl');
      const finishBtn = fixture.debugElement.query(By.css('.left button')).nativeElement;
      finishBtn.click();
      let url = spy.calls.mostRecent().args[0];
      expect(url).toBe('/dashboard');
      const newRedeem = fixture.debugElement.query(By.css('.right button')).nativeElement;
      newRedeem.click();
      url = spy.calls.mostRecent().args[0];
      expect(url).toBe('/chargesAndFees');
   });
   it('should show success message after transaction success', () => {
      service.transactionStatus = {
         isValid: false,
         reason: 'failed'
      };
      component.ngOnInit();
      fixture.detectChanges();
      const retryButton = fixture.debugElement.query(By.css('.left button')).nativeElement;
      retryButton.click();
      expect(component.successful).toBeTruthy();
   });
   it('should show system error on any transaction fail', () => {
      service.transactionStatus = {
         isValid: false,
         reason: 'failed'
      };
      component.ngOnInit();
      fixture.detectChanges();
      service.redemRewards = jasmine.createSpy('redemRewards')
         .and.returnValue(Observable.create(observer => {
            observer.error({});
            observer.complete();
         }));
      const retryButton = fixture.debugElement.query(By.css('.left button')).nativeElement;
      retryButton.click();
      expect(component.successful).toBeFalsy();
      expect(service.raiseSystemError).toHaveBeenCalled();
   });
   it('should show system error after max retry counts', () => {
      service.transactionStatus = {
         isValid: false,
         reason: 'failed'
      };
      component.ngOnInit();
      fixture.detectChanges();
      service.redemRewards = jasmine.createSpy('redemRewards')
         .and.returnValue(Observable.create(observer => {
            observer.next({ isValid: false });
            observer.complete();
         }));
      const retryButton = fixture.debugElement.query(By.css('.left button')).nativeElement;
      retryButton.click();
      retryButton.click(true);
      retryButton.click(true);
      retryButton.click(true);
      expect(component.successful).toBeFalsy();
      expect(service.raiseSystemError).toHaveBeenCalled();
   });
});
