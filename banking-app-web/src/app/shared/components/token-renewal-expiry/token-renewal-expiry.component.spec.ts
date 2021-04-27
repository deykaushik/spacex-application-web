import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { TokenRenewalExpiryComponent } from './token-renewal-expiry.component';
import { BsModalRef } from 'ngx-bootstrap';
import { BottomButtonComponent } from '../../controls/buttons/bottom-button.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const testComponent = class { };
const routerTestingParam = [
   { path: 'auth/logoff', component: testComponent }
];
describe('TokenRenewalExpiryComponent', () => {
   let component: TokenRenewalExpiryComponent;
   let fixture: ComponentFixture<TokenRenewalExpiryComponent>;
   let router: Router;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule.withRoutes(routerTestingParam)],
         declarations: [TokenRenewalExpiryComponent, BottomButtonComponent, SpinnerComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [BsModalRef]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TokenRenewalExpiryComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should handle screenPollTimerInterval', () => {
      spyOn(component, 'convertToTime').and.callThrough();
      component.screenPollTimerInterval();
      expect(component.convertToTime).toHaveBeenCalled();
   });

   it('should handle logoff', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.logoff({ stopPropagation: () => { } });
      const url = spy.calls.first().args[0];
      expect(url.toString()).toBe('/auth/logoff');
   });

});
