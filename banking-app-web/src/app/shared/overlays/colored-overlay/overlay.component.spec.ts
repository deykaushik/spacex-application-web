import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { ColoredOverlayComponent } from './overlay.component';
import { SystemErrorComponent } from './../../components/system-services/system-services.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SystemErrorService } from './../../../core/services/system-services.service';

describe('UnauthorizedComponent', () => {
   let component: ColoredOverlayComponent;
   let fixture: ComponentFixture<ColoredOverlayComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [AlertModule],
         declarations: [ColoredOverlayComponent, SystemErrorComponent],
         providers: [SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ColoredOverlayComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call onHide method from inactiveOverlay method ', () => {
      component.inactiveOverlay();
      component.onHide.subscribe((data) => {
         expect(data).toBeTruthy();
      });
   });
   it('should be hide', () => {
      component.isVisible = false;
      expect(component.ngOnChanges()).toBeUndefined();
   });
   it('should be show', () => {
      component.isVisible = true;
      expect(component.ngOnChanges()).toBeUndefined();
   });
});
