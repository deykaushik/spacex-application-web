import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../test-util';
import { ChangePasswordComponent } from './change-password.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderMenuService } from '../../core/services/header-menu.service';
import { AuthService } from '../../auth/auth.service';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { RegisterService } from '../../register/register.service';

const mockUserDetails = {nedbankIdUserName: 'eiwuewiue',
profile: '3000009990',
password: 'Sf9oIemkeXtR1NggqfuGhQ==',
nedbankIdPassword: 'Sf9oIemkeXtR1NggqfuGhQ==',
pin: 'NR/eZkZfp94=',
mobileNumber: '0784325431'
};

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let registerService: RegisterService;

  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordComponent ],
      providers: [HeaderMenuService,  {
        provide: AuthService, useValue: {}
      },
      {
        provide: EnrolmentService,
        useClass: class {}
      },
      {
        provide: TokenManagementService,
        useClass: class {}
      },
      {
        provide: RegisterService,
        useValue:  {
          resetUserDetails: jasmine.createSpy('resetUserDetails')
        }
      }
    ],
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    registerService = TestBed.get(RegisterService);
    registerService.userDetails = mockUserDetails;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('Should open Profile Details on mobile back button', inject([HeaderMenuService],
        (service: HeaderMenuService) => {
    service.headerMenuOpener().subscribe((menuText) => {
       expect(menuText).toBe('Your profile');
    });
    component.openProfileMenu('Your profile');
 }));

  it('should toggle old password field', () => {
    component.togglerOldPassword.nativeElement.dispatchEvent(
      new Event('click')
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(
        component.togglerOldPassword.nativeElement.componentInstance.attributes['type']
      ).toBe('text');
    });
    component.togglerOldPassword.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(
        component.togglerOldPassword.nativeElement.componentInstance.attributes['type']
      ).toBe('password');
    });
  });

  it('should toggle password field', () => {
    component.togglerPassword.nativeElement.dispatchEvent(
      new Event('click')
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(
        component.togglerPassword.nativeElement.componentInstance.attributes['type']
      ).toBe('text');
    });
    component.togglerPassword.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(
        component.togglerPassword.nativeElement.componentInstance.attributes['type']
      ).toBe('password');
    });
  });

  it('should toggle verify password field', () => {
    component.togglerVerifyPassword.nativeElement.dispatchEvent(
      new Event('click')
    );
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(
        component.togglerVerifyPassword.nativeElement.componentInstance.attributes['type']
      ).toBe('text');
    });
    component.togglerVerifyPassword.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(
        component.togglerVerifyPassword.nativeElement.componentInstance.attributes['type']
      ).toBe('password');
    });
  });
});
