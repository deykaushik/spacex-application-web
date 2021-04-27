import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement, ElementRef, ViewChild } from '@angular/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { assertModuleFactoryCaching } from './../../test-util';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { ITermsAndConditions } from '../../core/services/models';
import { TermsService } from './terms.service';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { ApiService } from '../../core/services/api.service';
import { HttpClient, HttpParams, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SystemErrorService } from './../../core/services/system-services.service';
import { UnsaveOverlayComponent } from '../overlays/unsave-overlay/unsave-overlay.component';
import { UnsaveOverlayService } from '../overlays/unsave-overlay/unsave-overlay.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { Constants } from '../../core/utils/constants';

function PopulateTestTermsModel() {
   const terms: ITermsAndConditions[] = [];
   const term: ITermsAndConditions = {
      noticeTitle: 'Terms and conditions',
      noticeType: 'ABC',
      versionNumber: 1,
      acceptedDateTime: '',
      noticeDetails: {
         noticeContent: 'Test Content',
         versionDate: ''
      }
   };
   terms.push(term);
   return terms;
}

describe('TermsAndConditionsComponent', () => {
   let component: TermsAndConditionsComponent;
   let fixture: ComponentFixture<TermsAndConditionsComponent>;
   let router: Router;
   let termsService: TermsService;
   // let de: DebugElement;
   // let el: HTMLElement;
   let getTerms: any;
   let getAllTerms: any;
   let accept: any;
   let downloadPDF: any;
   let filterTerms: any;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      getTerms = jasmine.createSpy('getTerms').and.callFake(function () { return Observable.of(PopulateTestTermsModel()); });
      filterTerms = jasmine.createSpy('filterTerms').and.callFake(function () { return Observable.of(PopulateTestTermsModel()); });
      getAllTerms = jasmine.createSpy('getAllTerms').and.callFake(function () { return Observable.of(PopulateTestTermsModel()); });
      accept = jasmine.createSpy('accept').and.callFake(function () { return Observable.of('Successful'); });
      downloadPDF = jasmine.createSpy('downloadPDF').and.returnValue({});

      TestBed.configureTestingModule({
         declarations: [TermsAndConditionsComponent, UnsaveOverlayComponent],
         imports: [FormsModule, RouterTestingModule],
         providers: [DatePipe,
            {
               provide: TermsService, useValue: {
                  getTerms: getTerms,
                  filterTerms: filterTerms,
                  getAllTerms: getAllTerms,
                  accept: accept,
                  downloadPDF: downloadPDF
               }
            },
            {
               provide: UnsaveOverlayService, useValue: {

               }
            },
            {
               provide: TokenManagementService, useValue: {

               }
            },
            BsModalRef, BsModalService, HttpHandler, SystemErrorService
         ], schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TermsAndConditionsComponent);
      component = fixture.componentInstance;
      component.termsAndConditionsModel = PopulateTestTermsModel();
      router = TestBed.get(Router);
      termsService = fixture.debugElement.injector.get(TermsService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should fetch terms and conditions on init', () => {
      component.termsAndConditionsModel = [];
      component.ngOnInit();
      fixture.detectChanges();
      expect((component.termsAndConditionsModel).length > 0);
   });

   it('should not fetch terms and conditions on init', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect((component.termsAndConditionsModel).length > 0);
   });

   it('should show Terms And Conditions initial ', fakeAsync(() => {
      component.showTnc();
      expect(component.isTermAndConditionAccept).toBe(true);
   }));
   it('should set Download link for Lotto terms and condition ', fakeAsync(() => {
      component.termsAndConditionsModel = <ITermsAndConditions[]>[{ noticeType: 'LTO' }];
      const isDownLoadLinkRequired = component.TermsAndConditions;
      expect(isDownLoadLinkRequired).toBeTruthy();
      expect(component.termsAndConditionsPDF).toEqual(Constants.links.lottoTermsAndConditions);
   }));

   it('should set Download link for Electricity terms and conditions', fakeAsync(() => {
      component.termsAndConditionsModel = <ITermsAndConditions[]>[{ noticeType: 'PPE' }];
      const isDownLoadLinkRequired = component.TermsAndConditions;
      expect(isDownLoadLinkRequired).toBeTruthy();
      expect(component.termsAndConditionsPDF).toEqual(Constants.links.ElectricityTermsAndConditions);
   }));

   it('should not set Download link for other terms and conditions', fakeAsync(() => {
      component.termsAndConditionsModel = <ITermsAndConditions[]>[{ noticeType: '' }];
      const isDownLoadLinkRequired = component.TermsAndConditions;
      expect(isDownLoadLinkRequired).toBeFalsy();
      expect(component.termsAndConditionsPDF).toEqual('');
   }));

   it('should not set Download link for undefined terms and conditions ', fakeAsync(() => {
      component.termsAndConditionsModel = null;
      const isDownLoadLinkRequired = component.TermsAndConditions;
      expect(isDownLoadLinkRequired).toBeFalsy();
      expect(component.termsAndConditionsPDF).toEqual('');
   }));

   it('should call termsService.accept when acceptTermsAndConditions is chosen', () => {
      component.acceptTermsAndConditions();

      expect(termsService.accept).toHaveBeenCalled();
   });

   it('should set isAccepted when decline is chosen', () => {
      component.declineTermsAndConditions();

      expect(termsService.isAccepted).toBeFalsy();
   });

   it('should set isTermAndConditionAccept when closed', () => {
      component.closeTermsAndConditions();

      expect(component.isTermAndConditionAccept).toBeFalsy();
   });

});
