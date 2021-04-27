import { assertModuleFactoryCaching } from './../../../test-util';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavMenuComponent } from './nav-menu.component';

describe('NavMenuComponent', () => {
   let component: NavMenuComponent;
   let fixture: ComponentFixture<NavMenuComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule],
         declarations: [NavMenuComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(NavMenuComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
});
