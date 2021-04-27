import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter } from '@angular/core';
import { TestBed, async, ComponentFixture, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './test-util';
import { WindowRefService } from './core/services/window-ref.service';
import { SystemErrorService } from './core/services/system-services.service';
import { AuthGuardService } from './core/guards/auth-guard.service';
import { Constants } from './core/utils/constants';
import { LoaderService } from './core/services/loader.service';
import { GaTrackingService } from './core/services/ga.service';
import { RegisterService } from './register/register.service';

import { ChatService } from './chat/chat.service';
import { TrusteerService} from './core/services/trusteer-service';
import { AppComponent } from './app.component';

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let router: Router;

const authGuardStub = {
   canLoad: jasmine.createSpy('canLoad').and.returnValue(true),
   isAuthenticated: new EventEmitter()
};

@Component({
   selector: 'app-test',
   template: '<div>Test Component</div>'
})
class TestComponent {

}

export class TestGuardService implements CanActivate, CanLoad {

   constructor() { }

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
      return false;
   }

   canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
      return true;
   }
}

const routerTestingParam = [
   { path: '', component: TestComponent },
   {
      path: 'activeRoute',
      component: TestComponent
   },
   {
      path: 'cancelledRoute',
      component: TestComponent,
      canActivate: [TestGuardService]
   }, {
      path: 'logoff',
      component: TestComponent
   }, {
      path: 'login',
      component: TestComponent
   }];

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};

const mockConnectStub = {
   connectionId: 'e43443fgfg56vnhhgghnbwme3menm3n4',
   agentName: 'Rituja',
   yesClicked: false,
   chatsFE: [],
   chatsFEHistory: [],
   question: []
};

const chatServiceStub = {
   applyTransition: jasmine.createSpy('applyTransition')
      .and.returnValue(Observable.of(mockConnectStub)),
   setChatActive: jasmine.createSpy('setChatActive')
      .and.returnValue(Observable.of(true))
};

const systemErrorStub = {
   closeError: jasmine.createSpy('closeError')
};

const loaderStub = {
   show: jasmine.createSpy('show'),
   hide: jasmine.createSpy('hide'),
};

const registerStub = {
   activeView: 1,
   isFormDirty: false
};

describe('AppComponent', () => {
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [
            RouterTestingModule.withRoutes(routerTestingParam)
         ],
         declarations: [
            TestComponent,
            AppComponent
         ],
         providers: [
            WindowRefService,
            TestGuardService,
            TrusteerService,
            { provide: RegisterService, useValue: registerStub },
            { provide: LoaderService, useValue: loaderStub },
            { provide: SystemErrorService, useValue: systemErrorStub },
            { provide: AuthGuardService, useValue: authGuardStub },
            { provide: ChatService, useValue: chatServiceStub },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();

      router = TestBed.get(Router);
      router.initialNavigation();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create the app component', async(() => {
      expect(component).toBeDefined();

   }));

   it('should have call beforeUnloadHander ', async () => {
      expect(component.beforeUnloadHander({})).toBeUndefined();
   });

   it('should have call beforeUnloadHander ', async () => {
      component.auth.isAuthenticated.emit(true);
      expect(component.beforeUnloadHander({})).toBe(Constants.labels.browserRefreshText);
   });

   it('should check the loader is true if the route changes', fakeAsync(() => {
      router.navigateByUrl('/activeRoute');
      expect(component.loading).toBe(true);
      tick();
      expect(component.loading).toBe(false);
      discardPeriodicTasks();
   }));

   it('should not check the loader is true if the route changes', fakeAsync(() => {
      router.navigateByUrl('/cancelledRoute');
      expect(component.loading).toBe(true);
      tick();
      expect(component.loading).toBe(false);
   }));

   it('should not check the loader is true if the route changes', fakeAsync(() => {
      router.navigateByUrl('/cancelledRoute');
      expect(component.loading).toBe(true);
      tick();
      expect(component.loading).toBe(false);
   }));

   it('should show cursor on touch start event on mobile devices', async(() => {
      expect(component.addCursor()).toBeUndefined();
      expect(component.document.body.style.cursor).toBe('pointer');
      expect(component.removeCursor()).toBeUndefined();
      expect(component.document.body.style.cursor).toBe('default');
   }));

   it('should open chatbox', fakeAsync(() => {
      component.chatBox = false;
      component.chatBoxOpen();
      expect(component.chatBox).toBe(true);

   }));

   it('should close chatbox', fakeAsync(() => {
      component.closeChat(false);
      expect(component.chatBox).toBe(false);

   }));
});
