import { Component } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { Route, Router } from '@angular/router';
import { TokenRenewalService } from './token-renewal-expiry.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { TokenRenewalExpiryComponent } from './token-renewal-expiry.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

const testComponent = class { };
const routerTestingParam = [
   { path: 'auth/logoff', component: testComponent }
];
describe('TokenRenewalExpiryService', () => {
   beforeEach(() => {

      TestBed.configureTestingModule({
         imports: [ModalModule, RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [TokenRenewalExpiryComponent],
         providers: [TokenRenewalService,
            BsModalService,
            ComponentLoaderFactory, ModalBackdropComponent,
            PositioningService,
            {
               provide: Router,
               useClass: class { navigate = jasmine.createSpy('navigate'); }
            }]
      });
      TestBed.overrideComponent(TokenRenewalExpiryComponent, {
         set: {
            template: ``
         }
      });
      TestBed.overrideModule(BrowserDynamicTestingModule, {
         set: {
            entryComponents: [ModalBackdropComponent, TokenRenewalExpiryComponent]
         }
      }).compileComponents();
   });

   it('should be created', inject([TokenRenewalService], (service: TokenRenewalService) => {
      expect(service).toBeTruthy();
   }));

   it('should show modal', inject([TokenRenewalService, BsModalService],
      (service: TokenRenewalService, modalService: BsModalService) => {
         const bsModalRef = new BsModalRef();
         spyOn(modalService, 'show').and.returnValue(bsModalRef);
         service.ShowSessionExpired();
         expect(modalService.show).toHaveBeenCalled();
      }));
});
