import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../test-util';
import { SessionTimeoutComponent } from './session-timeout.component';
import { TokenManagementService } from './../../core/services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { WindowRefService } from '../../core/services/window-ref.service';
const testComponent = class { };
const routerTestingParam = [
   { path: 'auth/logoff', component: testComponent }
];
describe('SessionTimeoutComponent', () => {
   let component: SessionTimeoutComponent;
   let fixture: ComponentFixture<SessionTimeoutComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [SessionTimeoutComponent],
         providers: [BsModalRef, TokenManagementService, WindowRefService, TokenRenewalService,
            BsModalService, BsModalRef, ComponentLoaderFactory, ModalBackdropComponent,
            PositioningService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SessionTimeoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should be set countdown', () => {
      component.timeOut = 300;
      expect(component.timeOut).toBeTruthy(300);
   });
   it('should be handle countinue operation', () => {
      component.continue({ stopPropagation: () => { } });
      expect(component.isModalOpen).toBeFalsy();
   });
   it('should be handle logoff operation', () => {
      component.logoff(null);
      expect(component.isModalOpen).toBeFalsy();
   });

   it('should be handle logoff operation', () => {
      component.logoff({ stopPropagation: () => { } });
      expect(component.isModalOpen).toBeFalsy();
   });
});
