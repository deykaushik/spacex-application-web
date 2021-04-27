import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { assertModuleFactoryCaching } from './../../../../../test-util';
import { AccountService } from '../../../../account.service';
import { WorkflowService } from '../../../../../core/services/stepper-work-flow-service';
import { MfcLandingComponent } from './mfc-landing.component';

const accountServiceStub = {
   setMfcCrossBorderRequest: jasmine.createSpy('setMfcCrossBorderRequest').and.returnValue(null),
};

describe('MfcLandingComponent', () => {
   let component: MfcLandingComponent;
   let fixture: ComponentFixture<MfcLandingComponent>;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [MfcLandingComponent],
         providers: [WorkflowService,
         { provide: AccountService, useValue: accountServiceStub },
         { provide: ActivatedRoute, useValue: { params: Observable.of({ accountId: 8 }) } }]
      })
      .compileComponents();
   }));

   assertModuleFactoryCaching();

   beforeEach(() => {
      fixture = TestBed.createComponent(MfcLandingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
