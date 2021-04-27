import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SmallOverlayComponent } from './small-overlay.component';
import { SystemErrorComponent } from './../../components/system-services/system-services.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SystemErrorService } from './../../../core/services/system-services.service';
import { assertModuleFactoryCaching } from './../../../test-util';

describe('SmallOverlayComponent', () => {
   let component: SmallOverlayComponent;
   let fixture: ComponentFixture<SmallOverlayComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [AlertModule],
         declarations: [SmallOverlayComponent, SystemErrorComponent],
         providers: [SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SmallOverlayComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

});
