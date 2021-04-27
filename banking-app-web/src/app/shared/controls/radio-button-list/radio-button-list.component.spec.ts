import { assertModuleFactoryCaching } from './../../../test-util';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioButtonListComponent } from './radio-button-list.component';

describe('RadioButtonListComponent', () => {
   let component: RadioButtonListComponent;
   let fixture: ComponentFixture<RadioButtonListComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [RadioButtonListComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(RadioButtonListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should emit click event', () => {
      component.onRadioItemSelection({ label: 'Permanent', value: 'Permanent' });
      fixture.detectChanges();
      component.onSelectionChange.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });
});
