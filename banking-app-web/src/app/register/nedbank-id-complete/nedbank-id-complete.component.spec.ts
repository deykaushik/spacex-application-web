import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
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
import { NedbankIdCompleteComponent } from './nedbank-id-complete.component';
import { TokenManagementService } from '../../core/services/token-management.service';
import { Constants } from './../../core/utils/constants';


describe('NedbankIdCompleteComponent', () => {
   let component: NedbankIdCompleteComponent;
   let fixture: ComponentFixture<NedbankIdCompleteComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {

      TestBed.configureTestingModule({
         imports: [RouterTestingModule, FormsModule],
         declarations: [NedbankIdCompleteComponent],
         providers: [TokenManagementService, {
            provide: RegisterService,
            useValue: {
               Approve: jasmine.createSpy('Approve'),
               SetActiveView: jasmine.createSpy('setActiveView'),
               makeFormDirty: jasmine.createSpy('makeFormDirty').and.callFake((param) => {
                  return param;
               })
            }
         },
         {
            provide: Router,
            useClass: class { navigate = jasmine.createSpy('navigate'); }
         }],
         schemas: []
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NedbankIdCompleteComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should stop propagation', () => {
      const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
      component.navigateNext(mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
   });

   it('should call makeFormDirty',  inject([RegisterService], (service: RegisterService) => {
      component.navigateNext(null);
      expect(service.makeFormDirty).toHaveBeenCalled();
   }));

   it('should navigate using router',  inject([RegisterService, Router], (service: RegisterService, router: Router) => {
      component.navigateNext(null);
      expect(router.navigate).toHaveBeenCalled();
   }));

});
