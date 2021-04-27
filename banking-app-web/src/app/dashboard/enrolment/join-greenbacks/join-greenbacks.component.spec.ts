import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { assertModuleFactoryCaching } from './../../../test-util';
import { CommonUtility } from './../../../core/utils/common';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { GreenbacksEnrolmentService } from './../../../core/services/greenbacks-enrolment.service';
import { GaTrackingService } from '../../../core/services/ga.service';
import { ColoredOverlayComponent } from './../../../shared/overlays/colored-overlay/overlay.component';

import { JoinGreenbacksComponent } from './join-greenbacks.component';

let isError = false;

const bsModalRefStub = {
   hide: jasmine.createSpy('hide')
};

const eventEmitter = new EventEmitter();

const bsModalServiceStub = {
   show: jasmine.createSpy('show').and.returnValue({ content: {} }),
   onHidden: eventEmitter
};

const enrolmentServiceStub = {
   enrolCustomer: jasmine.createSpy('enrolCustomer')
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
   getEnroledAccountNumber: jasmine.createSpy('getEnroledAccountNumber')
      .and.returnValue('123'),
   storeCustomerInLocalStorage: jasmine.createSpy('storeCustomerInLocalStorage'),
   getTermsAndConditionsResult: jasmine.createSpy('getTermsAndConditionsResult')
      .and.callFake(function () {
         return Observable.create(observer => {
            if (isError) {
               observer.error(new Error('error'));
               observer.complete();
            } else {
               observer.next({});
               observer.complete();
            }
         });
      }),
   acceptTermsAndConditions: jasmine.createSpy('acceptTermsAndConditions')
      .and.returnValue(Observable.of(true)),
   fetchTermsAndConditions: jasmine.createSpy('fetchTermsAndConditions')
};

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('JoinGreenbacksComponent', () => {
   let component: JoinGreenbacksComponent;
   let fixture: ComponentFixture<JoinGreenbacksComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [JoinGreenbacksComponent, ColoredOverlayComponent],
         providers: [
            SystemErrorService,
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            { provide: BsModalRef, useValue: bsModalRefStub },
            { provide: GreenbacksEnrolmentService, useValue: enrolmentServiceStub },
            { provide: BsModalService, useValue: bsModalServiceStub },
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      isError = false;
      fixture = TestBed.createComponent(JoinGreenbacksComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should hide panel on cancel button click', inject([BsModalRef], (beModelRef: BsModalRef) => {
      const cancelBtn = fixture.debugElement.query(By.css('#ovrly-cancel'));
      cancelBtn.nativeElement.click();
      expect(beModelRef.hide).toHaveBeenCalled();
   }));

   it('should show confirmation on join button click', inject([GreenbacksEnrolmentService], (service: GreenbacksEnrolmentService) => {
      spyOn(CommonUtility, 'getResultStatus').and.returnValue({ isValid: true });
      component.isAccepted = true;
      fixture.detectChanges();
      const joinBtn = fixture.debugElement.query(By.css('app-bottom-button'));
      joinBtn.nativeElement.click();
      expect(bsModalServiceStub.show).toHaveBeenCalled();
      expect(service.storeCustomerInLocalStorage).toHaveBeenCalled();
   }));

   it('should raise error on join button click if there is error in response', () => {
      spyOn(CommonUtility, 'getResultStatus').and.returnValue({ isValid: false, reason: 'Already enroled' });
      component.isAccepted = true;
      fixture.detectChanges();
      const joinBtn = fixture.debugElement.query(By.css('app-bottom-button'));
      const service = TestBed.get(SystemErrorService);
      spyOn(service, 'raiseError');
      joinBtn.nativeElement.click();
      expect(service.raiseError).toHaveBeenCalledWith({ error: 'Already enroled' });
   });

   it('should reset loader on join request failure', () => {
      isError = true;
      const joinBtn = fixture.debugElement.query(By.css('app-bottom-button'));
      joinBtn.nativeElement.click();
      expect(component.showLoader).toBe(false);
   });

   it('should show terms and condition page on tnc click', inject([BsModalService], (bsModalService: BsModalService) => {
      const tncBtn = fixture.debugElement.query(By.css('.btn-link'));
      tncBtn.nativeElement.click();
      bsModalService.onHidden.emit(true);
      expect(bsModalService.show).toHaveBeenCalled();
   }));
});
