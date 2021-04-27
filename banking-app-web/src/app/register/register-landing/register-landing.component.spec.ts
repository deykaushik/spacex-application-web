import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService, ModalBackdropComponent, ModalModule } from 'ngx-bootstrap';
import { assertModuleFactoryCaching } from './../../test-util';
import { RegisterService, ApprovalType } from '../register.service';
import { ApiService } from '../../core/services/api.service';

import { RegisterLandingComponent } from './register-landing.component';
import { AuthService } from '../../auth/auth.service';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';

const testComponent = class { };
const routerTestingParam = [
   { path: 'auth', component: testComponent }
];
describe('RegisterLandingComponent', () => {
  let component: RegisterLandingComponent;
  let fixture: ComponentFixture<RegisterLandingComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule.withRoutes(routerTestingParam), FormsModule],
        declarations: [RegisterLandingComponent],
        providers: [TokenManagementService, TokenRenewalService,
         BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService,
         ModalBackdropComponent, ModalModule,
          {
            provide: RegisterService,
            useValue: {
               SetActiveView: jasmine.createSpy('SetActiveView'),
               makeFormDirty : jasmine.createSpy('makeFormDirty')
            }
          },
          {
            provide: AuthService,
            useClass: class { }
          },
          {
            provide: EnrolmentService,
            useClass: class { }
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set active view', inject([RegisterService], (registerService: RegisterService) => {
    component.ngOnInit();
    expect(registerService.SetActiveView).toHaveBeenCalled();
  }));

});
