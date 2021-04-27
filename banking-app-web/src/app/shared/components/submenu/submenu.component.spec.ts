import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../../test-util';
import { SubmenuComponent } from './submenu.component';
import { TermsService } from '../../terms-and-conditions/terms.service';
import { BsModalService, ComponentLoaderFactory, PositioningService, ModalModule, ModalBackdropComponent } from 'ngx-bootstrap';
import { SubmenuConstants } from '../../constants';
import { Observable } from 'rxjs/Observable';
import { TermsAndConditionsComponent } from '../../terms-and-conditions/terms-and-conditions.component';
import { ApiService } from '../../../core/services/api.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { PreFillService } from '../../../core/services/preFill.service';

const buySubMenuOptions = SubmenuConstants.VariableValues.buySubmenu;

const serviceStub = {
   getTerms: jasmine.createSpy('getTerms').and.returnValue(Observable.of({
      data: [{
         'noticeTitle': 'Terms and conditions item 1',
         'noticeType': 'ABC',
         'versionNumber': 0.01,
         'acceptedDateTime': '2017-01-01 14:00 AM',
         'newVersionNumber': 0.02,
         'noticeDetails': {
            'noticeContent': 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxUMAQ==',
            'versionDate': '2017-01-01 14:00 AM'
         }
      },
      {
         'noticeTitle': 'Terms and conditions item 1',
         'noticeType': 'ABC',
         'versionNumber': 0.01,
         'acceptedDateTime': '2017-01-01 14:00 AM',
         'newVersionNumber': 0.02
      }]
   })),
   filterTerms: jasmine.createSpy('filterTerms').and.returnValue([{
      'noticeTitle': 'Terms and conditions item 1',
      'noticeType': 'ABC',
      'versionNumber': 0.01,
      'acceptedDateTime': '2017-01-01 14:00 AM',
      'newVersionNumber': 0.02,
      'noticeDetails': {
         'noticeContent': 'C0ktyi1WSMxLUUjOz0vJLMnMzysGMUtS80oUMktScxUMAQ==',
         'versionDate': '2017-01-01 14:00 AM'
      }
   },
   {
      'noticeTitle': 'Terms and conditions item 1',
      'noticeType': 'ABC',
      'versionNumber': 0.01,
      'acceptedDateTime': '2017-01-01 14:00 AM',
      'newVersionNumber': 0.02
   }])
};

const testComponent = class { };
const routerTestingParam = [
   { path: 'auth/logoff', component: testComponent },
];

const preFillServiceStub = {};

describe('SubmenuComponent', () => {
   let component: SubmenuComponent;
   let location: Location;
   let fixture: ComponentFixture<SubmenuComponent>;
   let router: Router;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam), ModalModule],
         declarations: [SubmenuComponent, TermsAndConditionsComponent],
         schemas: [NO_ERRORS_SCHEMA],
         providers: [{ provide: TermsService, useValue: serviceStub },
         { provide: PreFillService, useValue: preFillServiceStub },
            BsModalService,
            ComponentLoaderFactory, ModalBackdropComponent,
            PositioningService, {
            provide: ApiService, useValue: {
               refreshAccounts: {
                  getAll: jasmine.createSpy('getAll').and.returnValue(Observable.of([]))
               },
            }
         }]
      });

      TestBed.overrideModule(BrowserDynamicTestingModule, {
         set: {
            entryComponents: [TermsAndConditionsComponent]
         }
      }).compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(SubmenuComponent);
      component = fixture.componentInstance;
      router = TestBed.get(Router);
      location = TestBed.get(Location);
      component.options = buySubMenuOptions;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should check for submenu item click', fakeAsync(() => {
      const spy = spyOn(router, 'navigateByUrl');
      component.options = [];
      component.onSubmenuClick(new MouseEvent('click'), { path: 'abc' });
      tick();
      const url = spy.calls.first().args[0];
      expect(url.toString()).toBe('/abc');

   }));

   it('should check for submenu item click when button disabled', fakeAsync(() => {
      component.options = [];
      expect(component.onSubmenuClick(new MouseEvent('click'), { path: '', disable: true })).toBeUndefined();
   }));
   it('should check for submenu item click if disabled ', (() => {
      component.urlParam = '123';
      expect(component.onSubmenuClick(new MouseEvent('click'), { id: 'prepaid', path: '', disable: true })).toBeUndefined();
   }));

   it('should check for submenu item click if enabled', inject([TermsService, BsModalService], (termsService: TermsService,
      modalService: BsModalService) => {
      component.urlParam = '123';
      expect(component.onSubmenuClick(new MouseEvent('click'), { id: 'lotto', path: '', disable: false })).toBeUndefined();
      modalService._hideModal(1);

   }));

});
