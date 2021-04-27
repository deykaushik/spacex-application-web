import { Observable } from 'rxjs/Observable';
import { RouterModule, Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { FooterComponent } from './footer.component';
import { AuthGuardService } from './../../guards/auth-guard.service';
import { GaTrackingService } from '../../services/ga.service';
import { WindowRefService } from '../../services/window-ref.service';

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({})
};

describe('FooterComponent', () => {
   let component: FooterComponent;
   let fixture: ComponentFixture<FooterComponent>;
   let router: Router;
   const routerStub = {
      navigate: jasmine.createSpy('navigate')
   };

   const authGaurdServiceStub = {
      isAuthenticated: Observable.of(false)
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         providers: [
            {
               provide: AuthGuardService,
               useValue: authGaurdServiceStub
            },
            { provide: GaTrackingService, useValue: gaTrackingServiceStub },
            WindowRefService],
         imports: [RouterModule, RouterTestingModule],
         declarations: [FooterComponent]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(FooterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      router = TestBed.get(Router);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should redirect on ItemClick', () => {
      const mockFooterItem = { path: 'branchlocator' };
      const spy = spyOn(router, 'navigate');
      component.onItemClick(mockFooterItem);
      expect(spy).toHaveBeenCalledWith(([mockFooterItem.path]));
   });
});
