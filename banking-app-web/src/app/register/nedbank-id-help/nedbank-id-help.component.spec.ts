import { inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import {
   async,
   ComponentFixture,
   TestBed,
   fakeAsync,
   tick
} from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { assertModuleFactoryCaching } from './../../test-util';
import { RegisterService } from '../register.service';
import { ApiService } from '../../core/services/api.service';
import { NedbankIdHelpComponent } from './nedbank-id-help.component';
import { AuthService } from '../../auth/auth.service';
import { Constants } from './../../core/utils/constants';
import { View } from '../utils/enums';

describe('NedbankIdHelpComponent', () => {
   let component: NedbankIdHelpComponent;
   let fixture: ComponentFixture<NedbankIdHelpComponent>;
   // let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule, FormsModule],
         declarations: [NedbankIdHelpComponent],
         providers: [{
            provide: RegisterService,
            useValue: {
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
      fixture = TestBed.createComponent(NedbankIdHelpComponent);
      component = fixture.componentInstance;
      // router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call stop propagation in navigateClose', () => {
      const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
      component.navigateClose(mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
   });

   it('should set active view', inject([RegisterService, Router], (service: RegisterService, router: Router) => {
      component.navigateClose(null);
      expect(service.SetActiveView).toHaveBeenCalled();
   }));

   it('should set previous view', inject([RegisterService, Router], (service: RegisterService, router: Router) => {
      component.showAsModal = true;
      component.navigateClose(null);
      expect(service.previousView).toBe(View.NedIdHelp);
   }));

   it('should call make form dirty in FindBranch method', inject([RegisterService], (service: RegisterService ) => {
      component.findBranch(null);
      expect(service.makeFormDirty).toHaveBeenCalled();
   }));

   it('should navigate after FindBranch method', inject([Router], (router: Router ) => {
      component.findBranch(null);
      expect(router.navigate).toHaveBeenCalled();
   }));

   it('should call stop propagation in findBranch', () => {
      const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
      component.findBranch(mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
   });

});
