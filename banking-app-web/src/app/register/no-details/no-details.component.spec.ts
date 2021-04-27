import { Constants } from './../../core/utils/constants';
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
import { NoDetailsComponent } from './no-details.component';
import { inject } from '@angular/core/testing';

describe('NoDetailsComponent', () => {
   let component: NoDetailsComponent;
   let fixture: ComponentFixture<NoDetailsComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule, FormsModule],
         declarations: [NoDetailsComponent],
         providers: [
            {
               provide: RegisterService,
               useValue: {
                  makeFormDirty: jasmine.createSpy('makeFormDirty')
               }
            },
            {
               provide: Router,
               useValue: {
                  navigate: jasmine.createSpy('navigate')
               }
            }]
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NoDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should navigate on close', inject([Router], (router: Router) => {
      const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
      component.navigateClose(mockEvent);
      expect(router.navigate).toHaveBeenCalled();
   }));

   it('should navigate on FindBrach', inject([Router], (router: Router) => {
      const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
      component.findBranch(mockEvent);
      expect(router.navigate).toHaveBeenCalled();
   }));

});
