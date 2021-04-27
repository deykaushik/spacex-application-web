import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { OverseasSuccessComponent } from './overseas-success.component';
import { assertModuleFactoryCaching } from '../../../test-util';

const testComponent = class { };
const routerTestingParam = [
   { path: 'cards/:plasticId', component: testComponent }
];

describe('SuccessComponent', () => {
   let component: OverseasSuccessComponent;
   let fixture: ComponentFixture<OverseasSuccessComponent>;
   let router: Router;
   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [OverseasSuccessComponent],
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: ActivatedRoute, useValue: { params: Observable.of({ plasticId: 3 }) } }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OverseasSuccessComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      router = TestBed.get(Router);
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should call openTooltip', () => {
      component.isTooltipOpen = true;
      component.openTooltip();
      expect(component.isTooltipOpen).toBe(false);
   });

   it('should navigateToDashboard on click go to accounts ', () => {
      const spy = spyOn(router, 'navigateByUrl');
      spyOn(component, 'navigateToDashboard').and.callThrough();
      component.navigateToDashboard();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });

   it('should emit the event', () => {
      const event = false;
      spyOn(component.showSuccess, 'emit');
      component.exitAction(event);
      expect(component.showSuccess.emit).toHaveBeenCalled();
   });

   it('should navigate to Branch locator', () => {
      const spy = spyOn(router, 'navigateByUrl');
      spyOn(component, 'openBranchLocator').and.callThrough();
      component.openBranchLocator();
      const url = spy.calls.first().args[0];
      expect(url.toString()).toBe('/branchlocator');
    });
});
