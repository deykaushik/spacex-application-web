import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { Route, Router } from '@angular/router';
const ifvisible = require('ifvisible.js');

import { SessionTimeoutService } from './session-timeout.service';
import { AuthGuardService } from './../../core/guards/auth-guard.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SessionTimeoutComponent } from './session-timeout.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TokenManagementService } from '../../core/services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { WindowRefService } from '../../core/services/window-ref.service';
import { ChatService } from '../../chat/chat.service';
const testComponent = class { };
const routerTestingParam = [
   { path: 'auth/logoff', component: testComponent }
];
describe('SessionTimeoutService', () => {
   let isAuthenticated = true;
   beforeEach(() => {

      TestBed.configureTestingModule({
         imports: [ModalModule, RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [SessionTimeoutComponent],
         providers: [SessionTimeoutService, TokenManagementService, WindowRefService,
            BsModalService,
            ComponentLoaderFactory, ModalBackdropComponent,
            PositioningService, TokenRenewalService,
            {
               provide: AuthGuardService, useValue: {
                  isAuthenticated: Observable.of(true)
               }
            },
            {
               provide: Router,
               useClass: class { navigate = jasmine.createSpy('navigate'); }
            }, {
               provide: ChatService, useValue: jasmine.createSpy('applyTransition')
                  .and.returnValue(Observable.of(true))
            }]
      });
      TestBed.overrideComponent(SessionTimeoutComponent, {
         set: {
            template: ``
         }
      });
      TestBed.overrideModule(BrowserDynamicTestingModule, {
         set: {
            entryComponents: [ModalBackdropComponent, SessionTimeoutComponent]
         }
      }).compileComponents();
   });
   it('should be created', inject([SessionTimeoutService, BsModalService, AuthGuardService],
      (service: SessionTimeoutService, modalService: BsModalService, authService: AuthGuardService) => {
         service.idleTime = 1;
         service.timeoutWarningTime = 1;
         const bsModalRef = new BsModalRef();
         spyOn(modalService, 'show').and.returnValue(bsModalRef);

         expect(service).toBeTruthy();
         // expect('show').toHaveBeenCalled();
      }));

   it('should reset', inject([SessionTimeoutService, BsModalService],
      (service: SessionTimeoutService, modalService: BsModalService) => {
         service.idleTime = 1;
         service.timeoutWarningTime = 1;
         isAuthenticated = true;
         const bsModalRef = new BsModalRef();
         spyOn(modalService, 'show').and.returnValue(bsModalRef);

         expect(service).toBeTruthy();
      }));

   it('should stop', inject([SessionTimeoutService, BsModalService],
      (service: SessionTimeoutService, modalService: BsModalService) => {
         service.idleTime = 1;
         service.timeoutWarningTime = 1;
         isAuthenticated = false;
         const bsModalRef = new BsModalRef();
         spyOn(modalService, 'show').and.returnValue(bsModalRef);

         expect(service).toBeTruthy();
      }));
   it('should intialize service', inject([SessionTimeoutService, BsModalService],
      (service: SessionTimeoutService, modalService: BsModalService) => {
         service.idleTime = 1;
         service.timeoutWarningTime = 1;
         service.isAuthenticated = true;
         const bsModalRef = new BsModalRef();
         service.ngOnInit();
         ifvisible.idle();
         ifvisible.wakeup();
         service.showWarningPopup(2);
         spyOn(modalService, 'show').and.returnValue(bsModalRef);

         expect(service).toBeTruthy();
      }));
   it('should stop timer and reset', inject([SessionTimeoutService, BsModalService, AuthGuardService],
      (service: SessionTimeoutService, modalService: BsModalService, authGuard: AuthGuardService) => {
         service.idleTime = 1;
         service.timeoutWarningTime = 1;
         service.isAuthenticated = true;
         const bsModalRef = new BsModalRef();
         service.ngOnInit();
         service.reset();
         service.stop();
         service.showWarningPopup(2);
         service.ngOnDestroy();
         spyOn(modalService, 'show').and.returnValue(bsModalRef);

         expect(service).toBeTruthy();
      }));
});
