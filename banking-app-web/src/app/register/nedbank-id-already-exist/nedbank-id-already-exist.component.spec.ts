import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { assertModuleFactoryCaching } from './../../test-util';
import { NedbankIdAlreadyExistComponent } from './nedbank-id-already-exist.component';
import { RegisterService } from '../register.service';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { BottomButtonComponent } from '../../shared/controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

describe('NedbankIdAlreadyExistComponent', () => {
  let component: NedbankIdAlreadyExistComponent;
  let fixture: ComponentFixture<NedbankIdAlreadyExistComponent>;
  let registerService: RegisterService;

  assertModuleFactoryCaching();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [NedbankIdAlreadyExistComponent, BottomButtonComponent,
         SpinnerComponent],
      providers: [
        {
          provide: RegisterService,
          useValue: {
            SetActiveView: jasmine.createSpy('SetActiveView')
          }
        },
        {
          provide: EnrolmentService,
          useClass: class {}
        }
      ],
      schemas: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NedbankIdAlreadyExistComponent);
    component = fixture.componentInstance;
    registerService = TestBed.get(RegisterService);
    registerService.userDetails = {
      nedbankIdUserName: 'eiwuewiue',
      profile: '',
      password: '',
      nedbankIdPassword: '',
      pin: '',
      mobileNumber: ''
    };

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set active view on ResetPassword', () => {
    const registerServiceStub: RegisterService = fixture.debugElement.injector.get(RegisterService);
    component.navigateResetPassword(new Event('click'));
    expect(registerServiceStub.SetActiveView).toHaveBeenCalled();
  });

  it('should set active view on Logon', () => {
    const registerServiceStub: RegisterService = fixture.debugElement.injector.get(RegisterService);
    component.navigateLogon(new Event('click'));
    expect(registerServiceStub.SetActiveView).toHaveBeenCalled();
  });
});
