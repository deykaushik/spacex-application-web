import { TestBed, inject } from '@angular/core/testing';
import { CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';

import { UnsavedChangesGuard, ModelStates } from './unsaved-changes-guard.service';
import { LandingComponent } from '../../payment/landing/landing.component';
import { UnsaveOverlayService } from '../../shared/overlays/unsave-overlay/unsave-overlay.service';
import { Constants } from '../utils/constants';
import { WindowRefService } from '../services/window-ref.service';
import { SessionTimeoutService } from './../../auth/session-timeout/session-timeout.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
const RouterStateSnapshotStub = {
   url: '/payment'
};

const sessionTimeoutServiceStub = {
   timeoutShowing: false
};
const testComponent = class {};
const routerTestingParam = [
      { path: 'payment', component: testComponent },
];

describe('UnsavedChangesGuardService', () => {
   let testbed;

   beforeEach(() => {
      testbed = TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [UnsavedChangesGuard,
            UnsaveOverlayService,
            Constants,
            WindowRefService,
            TokenManagementService,
            TokenRenewalService,
            BsModalService,
            ComponentLoaderFactory,
            PositioningService, ModalBackdropComponent, ModalModule,
            { provide: SessionTimeoutService, useValue: sessionTimeoutServiceStub },
            { provide: LandingComponent, useValue: { isDirty: true, canDeactivate: () => false } },
            { provide: Window, useValue: window },
            { provide: RouterStateSnapshot, useValue: RouterStateSnapshotStub }]
      });
   });

   it('should be created', inject([UnsavedChangesGuard], (service: UnsavedChangesGuard) => {
      expect(service).toBeTruthy();
   }));

   it('should be created stop propogation if ok is emited by modal', inject([UnsavedChangesGuard, UnsaveOverlayService,
      LandingComponent], (service: UnsavedChangesGuard,
         overlayservice: UnsaveOverlayService, component: LandingComponent) => {
         overlayservice.OverlayUoutEmitter.emit('ok');
         spyOn(window, 'confirm').and.returnValue(false);
         const check = service.canDeactivate(component, null, null, null);
         expect(check).toBe(false);
      }));

   it('should be created allow propogation if cancel is emited by modal', inject([UnsavedChangesGuard, UnsaveOverlayService,
      LandingComponent], (service: UnsavedChangesGuard,
         overlayservice: UnsaveOverlayService, component: LandingComponent) => {
         spyOn(window, 'confirm').and.returnValue(true);
         service.preRoute = RouterStateSnapshotStub;
         overlayservice.OverlayUoutEmitter.emit('cancel');
         const check = service.canDeactivate(component, null, null, null);
         expect(check).toBe(true);
      }));

   it('should stop propogation for web if dirty',
      inject([UnsavedChangesGuard, LandingComponent],
         (service: UnsavedChangesGuard, component: LandingComponent) => {
            spyOn(window, 'confirm').and.returnValue(false);
            const check = service.canDeactivate(component, null, null, null);
            expect(check).toBe(false);
         }));

   it('should allow propagation if redirected and Moadal is just closed', inject([UnsavedChangesGuard,
      LandingComponent], (service: UnsavedChangesGuard, component: LandingComponent) => {
         service.modalstate = ModelStates.justClosed;
         spyOn(window, 'confirm').and.returnValue(true);
         const check = service.canDeactivate(component, null, null, null);
         expect(check).toBe(true);
      }));

   it('should show alert if navigated away when there is a change in the landing component for small screen',
      inject([UnsavedChangesGuard, LandingComponent],
         (service: UnsavedChangesGuard, component: LandingComponent) => {
            spyOn(window, 'confirm').and.returnValue(true);
            Constants.disablePoupMin.height = 1500;
            const check = service.canDeactivate(component, null, null, null);
            expect(check).toBe(true);
         }));

});
