import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { assertModuleFactoryCaching } from './../test-util';
import { CommingSoonComponent } from './comming-soon.component';
import { SystemErrorService } from '../core/services/system-services.service';

describe('CommingSoonComponent', () => {
   let component: CommingSoonComponent;
   let fixture: ComponentFixture<CommingSoonComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [CommingSoonComponent],
         providers: [SystemErrorService],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [RouterTestingModule]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(CommingSoonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
