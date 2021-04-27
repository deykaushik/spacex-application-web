import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed, tick, fakeAsync, inject } from '@angular/core/testing';
import { SmallOverlayComponent } from '../small-overlay/small-overlay.component';
import { BrowserBackOverlayComponent } from './browser-back-overlay.component';
import { BottomButtonComponent } from './../../controls/buttons/bottom-button.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from './../../../test-util';
import { TokenManagementService } from './../../../core/services/token-management.service';
import { GoBackGuard } from './../../../core/guards/go-back-guard.service';
import { AuthGuardService } from '../../../core/guards/auth-guard.service';
import { RegisterService } from '../../../register/register.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../../../core/utils/constants';

const GoBackGuardStub = {
   stopedBack: new EventEmitter<boolean>()
};
const testComponent = class { };
const routerTestingParam = [
   { path: 'payment', component: testComponent },
   { path: 'auth/logoff', component: testComponent },
];

describe('BrowserBackOverlayComponent', () => {
   let component: BrowserBackOverlayComponent;
   let fixture: ComponentFixture<BrowserBackOverlayComponent>;
   let router: Router;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [BrowserBackOverlayComponent, SmallOverlayComponent, BottomButtonComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [{ provide: GoBackGuard, useValue: GoBackGuardStub },
         {
            provide: AuthGuardService, useValue: {
               isAuthenticated: Observable.of(true)
            }
         },
         {
            provide: RegisterService,
            useValue: {
               makeFormDirty: jasmine.createSpy('makeFormDirty').and.callFake((param) => {
                  return param;
               })
            }
         }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BrowserBackOverlayComponent);
      router = TestBed.get(Router);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call show method', () => {
      GoBackGuardStub.stopedBack.emit();
      expect(component.isVisible).toBe(true);

   });

   it('should be call close', () => {
      component.close(false);
   });
   it('should neviate to back button,if logged in', fakeAsync(() => {
      component.isloggedIn = true;
      const spy = spyOn(router, 'navigate');
      component.close(true);
      tick(100);
      const url = spy.calls.first().args[0];
      expect(url[0]).toBe('/' + Constants.labels.browserBackPopup.logoff);
   }));
   it('should neviate to back button,if not logged in',
      fakeAsync(inject([RegisterService], (registerService: RegisterService) => {
         component.isloggedIn = false;
         const spy = spyOn(router, 'navigate');
         component.close(true);
         tick(100);
         const url = spy.calls.first().args[0];
         expect(registerService.isFormDirty).toBeFalsy();
      })));
   it('should be assign current url', () => {
      router.navigateByUrl('/payment');
   });

});
