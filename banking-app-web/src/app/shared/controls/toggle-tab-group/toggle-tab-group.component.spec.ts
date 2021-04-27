import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from '../../../test-util';
import { ToggleTabGroupComponent } from './toggle-tab-group.component';

describe('ToggleTabGroupComponent', () => {
   let component: ToggleTabGroupComponent;
   let fixture: ComponentFixture<ToggleTabGroupComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ToggleTabGroupComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ToggleTabGroupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should emit click event', () => {
      component.onRadioItemSelection({ label: 'Statement', value: 'STATEMENT' });
      fixture.detectChanges();
      component.onSelectionChange.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });
});
