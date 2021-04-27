import { inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHandler } from '@angular/common/http';
import {
   async,
   ComponentFixture,
   TestBed,
   fakeAsync,
   tick
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { assertModuleFactoryCaching } from './../../test-util';
import { RegisterService } from '../register.service';
import { ApiService } from '../../core/services/api.service';
import { NedbankIdStateComponent } from './nedbank-id-state.component';
import { Constants } from './../../core/utils/constants';

describe('NedbankIdStateComponent', () => {
   let component: NedbankIdStateComponent;
   let fixture: ComponentFixture<NedbankIdStateComponent>;
   let router: Router;
   let approve: any;

   approve = jasmine.createSpy('Approve').and.returnValue({
      MetaData: {
         ResultCode: 'R00'
      }
   });
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule, FormsModule],
         declarations: [NedbankIdStateComponent],
         providers: [
            HttpClient,
            HttpHandler,
            ApiService,
            {
               provide: RegisterService,
               useValue: {
                  Approve: approve,
                  SetActiveView: jasmine.createSpy('setActiveView'),
                  makeFormDirty: jasmine.createSpy('makeFormDirty').and.callFake((param) => {
                    return param;
                  })
               }
            }
         ],
         schemas: []
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NedbankIdStateComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call stop propagation in navigateNext', () => {
      const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
      component.navigateNext(mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
   });

   it('should set active view', inject([RegisterService], (service: RegisterService) => {
      component.navigateNext(null);
      expect(service.SetActiveView).toHaveBeenCalled();
   }));

});
