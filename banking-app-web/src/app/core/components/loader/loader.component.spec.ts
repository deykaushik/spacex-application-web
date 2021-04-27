import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { assertModuleFactoryCaching } from './../../../test-util';
import { LoaderComponent } from './loader.component';
import { LoaderService } from '../../services/loader.service';
import { SystemErrorService } from '../../services/system-services.service';

describe('LoaderComponent', () => {
   let component: LoaderComponent;
   let fixture: ComponentFixture<LoaderComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [LoaderComponent],
         providers: [LoaderService, SystemErrorService]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(LoaderComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should show and hide loader', inject([LoaderService, SystemErrorService],
      (loader: LoaderService, systemErrorService: SystemErrorService) => {
         loader.show();
         expect(component.isLoading).toBe(true);
         loader.hide();
         expect(component.isLoading).toBe(false);
      }));
   it('should hide loader on error', inject([LoaderService, SystemErrorService],
      (loader: LoaderService, systemErrorService: SystemErrorService) => {
         systemErrorService.raiseError(new Error('any error'));
         expect(component.isLoading).toBe(false);
      }));
});
