import { Constants } from './../../core/utils/constants';
import { Observable } from 'rxjs/Observable';
import {
   async,
   ComponentFixture,
   TestBed,
   fakeAsync,
   tick,
   inject
} from '@angular/core/testing';
import {
   FormsModule,
   FormControl,
   FormGroup,
   Validators
} from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { assertModuleFactoryCaching } from './../../test-util';
import { RegisterService } from '../../register/register.service';
import { NedbankIdForgotPwdResetOptionsComponent } from './forgot-pwd-reset-options.component';
import { MetaData } from '../../core/services/auth-models';
import { ServiceResultType } from '../../core/services/enrolment.service';
import { BsModalService } from 'ngx-bootstrap';

const enum serviceResultType {
  Success = 1,
  ValidResult,
  CallFailed
}

describe('NedbankIdForgotPwdResetOptionsComponent', () => {
  let component: NedbankIdForgotPwdResetOptionsComponent;
  let fixture: ComponentFixture<NedbankIdForgotPwdResetOptionsComponent>;
  assertModuleFactoryCaching();
  beforeEach(async(() => {
      const metaDataResult: MetaData = {
        ResultCode: '',
        Message: ''
      };

      TestBed.configureTestingModule({
        imports: [RouterTestingModule, FormsModule],
        declarations: [NedbankIdForgotPwdResetOptionsComponent],
        providers: [RegisterService,
          {
            provide: RegisterService,
            useValue: {
              SetActiveView: jasmine.createSpy('SetActiveView')
            }
          },
          {
            provide: BsModalService,
            useClass: class { }
          }],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NedbankIdForgotPwdResetOptionsComponent);
    component = fixture.componentInstance;
    this.registerService = TestBed.get(RegisterService);
    fixture.detectChanges();
  });


  it('should be created', () => {
    this.serviceResType = ServiceResultType.Success;
    expect(component).toBeTruthy();
  });

  it('should navigate to next page', inject([RegisterService], (registerService: RegisterService) => {
    component.navigateNext(3);
    expect(registerService.SetActiveView).toHaveBeenCalled();
  })
  );

});
