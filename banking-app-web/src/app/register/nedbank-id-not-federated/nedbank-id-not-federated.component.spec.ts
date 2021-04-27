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
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

import { assertModuleFactoryCaching } from './../../test-util';
import { RegisterService } from '../register.service';
import { NedbankIdNotFederatedComponent } from './nedbank-id-not-federated.component';
import { Constants } from './../../core/utils/constants';

describe('NedbankIdNotFederatedComponent', () => {
   let component: NedbankIdNotFederatedComponent;
   let fixture: ComponentFixture<NedbankIdNotFederatedComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule, FormsModule],
         declarations: [NedbankIdNotFederatedComponent],
         providers: [
            {
               provide: RegisterService,
               useValue: {
                  SetActiveView: jasmine.createSpy('setActiveView')
               }
            }
         ],
         schemas: []
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NedbankIdNotFederatedComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should call stop propagation in navigateRegister', () => {
      const mockEvent = jasmine.createSpyObj('mockEvent', ['stopPropagation', 'preventDefault']);
      component.navigateRegister(mockEvent);
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
   });

   it('should set active view', inject([RegisterService], (service: RegisterService) => {
      component.navigateRegister(null);
      expect(service.SetActiveView).toHaveBeenCalled();
   }));

});
