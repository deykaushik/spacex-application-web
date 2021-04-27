import { EventEmitter } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { SystemErrorComponent } from './../../components/system-services/system-services.component';
import { UnsaveOverlayComponent } from './unsave-overlay.component';
import { BottomButtonComponent } from './../../controls/buttons/bottom-button.component';
import { UnsaveOverlayService } from './unsave-overlay.service';
import { SmallOverlayComponent } from '../small-overlay/small-overlay.component';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { SpinnerComponent } from './../../components/spinner/spinner.component';
import { AuthGuardService } from '../../../core/guards/auth-guard.service';
import { Observable } from 'rxjs/Observable';

const ovrlayserviceServiceStub = {
   OverlayUpdateEmitter: new EventEmitter<boolean>(),
   emitOut: jasmine.createSpy('emitOut')
};
describe('UnsaveOverlayComponent', () => {
   let component: UnsaveOverlayComponent;
   let fixture: ComponentFixture<UnsaveOverlayComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [AlertModule],
         declarations: [UnsaveOverlayComponent, BottomButtonComponent, SmallOverlayComponent,
            SystemErrorComponent, SpinnerComponent],
         providers: [
            { provide: UnsaveOverlayService, useValue: ovrlayserviceServiceStub },
            {
               provide: AuthGuardService, useValue: {
                  isAuthenticated: Observable.of(true)
               }
            },
            SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(UnsaveOverlayComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call onHide method from close method ', () => {
      component.onHide.subscribe((data) => {
         expect(data).toBeTruthy();
      });
      component.close('reason');
   });
   it('should check effect of triggering Overlay updation from service', () => {
      ovrlayserviceServiceStub.OverlayUpdateEmitter.emit(true);
      fixture.detectChanges();
      expect(component.isVisible).toBe(true);
   });
});
