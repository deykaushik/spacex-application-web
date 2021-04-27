import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../../test-util';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { ColoredOverlayComponent } from './../../../shared/overlays/colored-overlay/overlay.component';
import { AccountService } from './../../account.service';
import { GreenbacksConfirmationComponent } from './greenbacks-confirmation.component';

let isError = false;

const accountServiceStub = {
   refreshAccounts: jasmine.createSpy('submitCallback')
      .and.callFake(function () {
         if (isError) {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         } else {
            return Observable.of({});
         }
      }),
   notifyAccountsUpdate: jasmine.createSpy('notifyAccountsUpdate')
};

const bsModalRefStub = {
   hide: jasmine.createSpy('hide')
};

describe('GreenbacksConfirmationComponent', () => {
   let component: GreenbacksConfirmationComponent;
   let fixture: ComponentFixture<GreenbacksConfirmationComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [GreenbacksConfirmationComponent, ColoredOverlayComponent],
         providers: [
            SystemErrorService,
            { provide: AccountService, useValue: accountServiceStub },
            { provide: BsModalRef, useValue: bsModalRefStub }
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      isError = false;
      fixture = TestBed.createComponent(GreenbacksConfirmationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should hide panel on account list refresh', () => {
      const getStated = fixture.debugElement.query(By.css('app-bottom-button'));
      getStated.nativeElement.click();
      expect(accountServiceStub.notifyAccountsUpdate).toHaveBeenCalled();
      expect(bsModalRefStub.hide).toHaveBeenCalled();
   });

   it('should reset loader on account list refresh failure', () => {
      isError = true;
      const getStated = fixture.debugElement.query(By.css('app-bottom-button'));
      getStated.nativeElement.click();
      expect(component.showLoader).toBe(false);
   });
});
