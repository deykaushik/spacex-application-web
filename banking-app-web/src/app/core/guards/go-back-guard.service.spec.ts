
import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EventEmitter } from '@angular/core';

import { LandingComponent } from '../../payment/landing/landing.component';
import { Constants } from '../utils/constants';
import { GoBackGuard } from './go-back-guard.service';
import { AuthGuardService } from './auth-guard.service';
import { UnsaveOverlayService } from '../../shared/overlays/unsave-overlay/unsave-overlay.service';
import { RegisterService } from '../../register/register.service';
import { WindowRefService } from '../services/window-ref.service';



const RouterStateSnapshotStub = {
   url: '/payment'
};
const AuthGuardServiceStub = {
   isAuthenticated: new EventEmitter<boolean>(),
};

const testComponent = class { };
const logComponent = class { };
const routerTestingParam = [
   { path: 'payment', component: testComponent },
   { path: 'login', component: logComponent },
];
const UnsaveOverlayServiceStub = {
   OverlayUoutEmitter: new EventEmitter<boolean>(),
};

describe('GoBackGuardService', () => {
   let testbed;

   beforeEach(() => {
      testbed = TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [GoBackGuard,
            Constants,
            { provide: UnsaveOverlayService, useValue: UnsaveOverlayServiceStub },
            { provide: AuthGuardService, useValue: AuthGuardServiceStub },
            WindowRefService,
            {
               provide: RegisterService, useValue: {
                  isFormDirty: true,
                  SetActiveView: jasmine.createSpy('SetActiveView')
               }
            }]
      });
      AuthGuardServiceStub.isAuthenticated.emit(true);
   });

   it('should be created', inject([GoBackGuard], (service: GoBackGuard) => {
      expect(service).toBeTruthy();
   }));

   it('should stop propogation if from back', inject([GoBackGuard], (service: GoBackGuard,
      component: LandingComponent) => {
      service.changeFromBack = true;
      service.islogedin = true;
      const check = service.canDeactivate(component, null, null, null);
      expect(check).toBe(false);
   }));
   it('should not stop propogation if not from back', inject([GoBackGuard], (service: GoBackGuard,
      component: LandingComponent) => {
      service.changeFromBack = false;
      AuthGuardServiceStub.isAuthenticated.emit(true);
      const check = service.canDeactivate(component, null, null, null);
      expect(check).toBe(true);
   }));

   it('should  check if component had can deactivate', inject([GoBackGuard], (service: GoBackGuard,
      component) => {
      service.changeFromBack = false;
      AuthGuardServiceStub.isAuthenticated.emit(true);
      component = { canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(true) };
      let check = service.canDeactivate(component, null, null, null);
      component.canDeactivate.and.returnValue(false);
      check = service.canDeactivate(component, null, null, null);
      expect(check).toBe(true);
   }));

   it('should  check if component had can deactivate', inject([GoBackGuard], (service: GoBackGuard,
      component) => {
      service.changeFromBack = false;
      AuthGuardServiceStub.isAuthenticated.emit(true);
      component = { canDeactivate: jasmine.createSpy('canDeactivate').and.returnValue(true) };
      let check = service.canDeactivate(component, null, null, null);
      component.canDeactivate.and.returnValue(false);
      check = service.canDeactivate(component, null, null, null);
      expect(check).toBe(true);
   }));

   it('should not stop propogation if not logedin', inject([GoBackGuard], (service: GoBackGuard,
      component) => {
      service.changeFromBack = false;
      AuthGuardServiceStub.isAuthenticated.emit(false);
      const check = service.canDeactivate(component, null, null, null);
      expect(check).toBe(true);
   }));
   it('should not stop propogation if not logedin', inject([GoBackGuard, RegisterService], (service: GoBackGuard,
      registerService: RegisterService, component) => {
      service.changeFromBack = true;
      service.islogedin = false;
      registerService.isFormDirty = true;
      const check = service.canDeactivate(component, null, null, null);
      expect(check).toBe(false);
   }));
   it('should not stop propogation if not logedin and navigated from regiter ',
      fakeAsync(inject([GoBackGuard, RegisterService, Router, WindowRefService], (service: GoBackGuard,
         registerService: RegisterService, router: Router, windowref: WindowRefService, component) => {
         service.changeFromBack = true;
         windowref.isSmallScreen = jasmine.createSpy('isSmallScreen').and.returnValue(true);
         AuthGuardServiceStub.isAuthenticated.next(false);
         registerService.isFormDirty = true;
         const check = service.canDeactivate(component, null, null, null);
         expect(check).toBe(false);
         router.navigate(['/login']);
         window.dispatchEvent(new HashChangeEvent('hashchange'));
         tick(1000);
         expect(service.changeFromBack).toBe(true);
      })));
   it('should not stop propogation if logedin and navigated from regiter ',
      fakeAsync(inject([GoBackGuard, RegisterService, Router], (service: GoBackGuard,
         registerService: RegisterService, router: Router, component) => {
         service.changeFromBack = true;
         AuthGuardServiceStub.isAuthenticated.next(true);
         service.islogedin = true;
         registerService.isFormDirty = true;
         const check = service.canDeactivate(component, null, null, null);
         expect(check).toBe(false);
         router.navigate(['/login']);
         window.dispatchEvent(new HashChangeEvent('hashchange'));
         tick(1000);
         expect(service.changeFromBack).toBe(true);
      })));
   it('should make false on can load', inject([GoBackGuard], (service: GoBackGuard,
      component) => {
      const check = service.canLoad();
      expect(service.changeFromBack).toBe(false);
   }));
   it('should handle when unsave ovelay close', inject([GoBackGuard], (service: GoBackGuard,
      component) => {
      UnsaveOverlayServiceStub.OverlayUoutEmitter.emit();
   }));
});
