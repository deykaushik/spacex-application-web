import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { OpenAccountService } from '../open-account.service';
import { OpenAccountSuccessComponent } from './open-account-success.component';
import { ICountries } from '../../core/services/models';

const mockProduct: ICountries = {
   name: '32 day notice'
};

const accountServiceStub = {
   getProductDetails: jasmine.createSpy('getProductDetails').and.returnValue(mockProduct),
};

describe('OpenAccountSuccessComponent', () => {
   let component: OpenAccountSuccessComponent;
   let fixture: ComponentFixture<OpenAccountSuccessComponent>;
   let router;

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule],
         declarations: [OpenAccountSuccessComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [Renderer2, { provide: OpenAccountService, useValue: accountServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(OpenAccountSuccessComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be created', () => {
      const spy = spyOn(router, 'navigateByUrl');
      component.closeOverlay();
      const url = spy.calls.first().args[0];
      expect(url).toBe('/dashboard');
   });

   it('should show process time page', () => {
      component.processingTimePage();
      expect(component.accountSuccess).toBe(false);
   });

   it('should call open account succes page', () => {
      component.isOpenAccountSuccess(true);
      expect(component.accountSuccess).toBe(true);
   });
});
