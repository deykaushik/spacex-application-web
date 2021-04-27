import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleButtonGroupComponent } from './toggle-button-group.component';
import { assertModuleFactoryCaching } from '../../../test-util';
import { IButtonGroup, IToggleButtonGroup } from '../../../core/services/models';

const buttonGroup: IButtonGroup[] = [
   { label: 'Feedback', value: 'FEEDBACK' },
   { label: 'Report', value: 'REPORT' }];

const toggleButtonGroup: IToggleButtonGroup = {
   buttonGroup: buttonGroup,
   groupName: '',
   isGroupDisabled: false,
   buttonGroupWidth: 100,
};

describe('ToggleButtonGroupComponent', () => {
   let component: ToggleButtonGroupComponent;
   let fixture: ComponentFixture<ToggleButtonGroupComponent>;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ToggleButtonGroupComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ToggleButtonGroupComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.toggleButtonGroup = toggleButtonGroup;
      component.ngOnInit();
      expect(component).toBeTruthy();
   });

   it('should emit click event', () => {
      component.onRadioItemSelection({ label: 'Post', value: 'POST' });
      fixture.detectChanges();
      component.onSelectionChange.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });
});
