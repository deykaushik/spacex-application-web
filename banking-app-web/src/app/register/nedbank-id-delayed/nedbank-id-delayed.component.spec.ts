import { inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
   async,
   ComponentFixture,
   TestBed,
   fakeAsync,
   tick
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { RegisterService } from '../register.service';
import { NedbankIdDelayedComponent } from './nedbank-id-delayed.component';
import { Constants } from './../../core/utils/constants';

describe('NedbankIdDelayedComponent', () => {
   let component: NedbankIdDelayedComponent;
   let fixture: ComponentFixture<NedbankIdDelayedComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, FormsModule],
        declarations: [NedbankIdDelayedComponent],
        providers: [{
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
    fixture = TestBed.createComponent(NedbankIdDelayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call stop propagation', () => {
   const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
   component.navigateNext(mockEvent);
   expect(mockEvent.stopPropagation).toHaveBeenCalled();
});

it('should call navigate',  inject([RegisterService, Router], (service: RegisterService, router: Router) => {
   component.navigateNext(null);
   expect(router.navigate).toHaveBeenCalled();
}));

});
