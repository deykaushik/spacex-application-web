import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { Router } from '@angular/router';
import { assertModuleFactoryCaching } from './../../test-util';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { LogoffComponent } from './logoff.component';
import { Subject } from 'rxjs/Subject';
import { TokenManagementService } from './../../core/services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { WindowRefService } from './../../core/services/window-ref.service';
import { SessionTimeoutService } from '../session-timeout/session-timeout.service';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { ChatService } from '../../chat/chat.service';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';

const clientSubject = new Subject();
describe('LogoffComponent', () => {
   let component: LogoffComponent;
   let fixture: ComponentFixture<LogoffComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LogoffComponent],
         providers: [AuthGuardService, SessionTimeoutService,
            { provide: PreApprovedOffersService, useValue: {} },
            TokenManagementService, BsModalService, BsModalRef, ComponentLoaderFactory,
            ModalBackdropComponent,
            PositioningService,
            TokenRenewalService,
            {
               provide: WindowRefService,
               useValue: {
                  nativeWindow: {
                     location: {
                        replace: () => { }, reload: (clearcache) => { }
                     },
                     setTimeout: (callback, time) => { }
                  }
               }
            },
            {
               provide: Router,
               useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            {
               provide: ClientProfileDetailsService,
               useValue: { clientDetailsObserver: clientSubject }
            },
            { provide: ChatService }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LogoffComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
