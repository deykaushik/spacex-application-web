import { async, ComponentFixture, TestBed, fakeAsync, tick, inject } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { BsModalService, BsModalRef, ComponentLoaderFactory, PositioningService } from 'ngx-bootstrap';
import { HttpClient, HttpParams, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { assertModuleFactoryCaching } from './../../test-util';
import { TermsAndConditionsAuthComponent } from './terms-and-conditions-auth.component';
import { ITermsAndConditions } from '../../core/services/models';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../auth.service';
import { WindowRefService } from '../../core/services/window-ref.service';
import { LoaderService } from '../../core/services/loader.service';
import { SystemErrorService } from './../../core/services/system-services.service';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { TokenRenewalService } from '../../shared/components/token-renewal-expiry/token-renewal-expiry.service';
import { ApiAuthService } from '../../core/services/api.auth-service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { RegisterService } from '../../register/register.service';
import { AuthConstants } from '../utils/constants';
import { AlertActionType } from '../../shared/enums';
import { Subject } from 'rxjs/Subject';
import { PreApprovedOffersService } from '../../core/services/pre-approved-offers.service';

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


const preApprovedOffersServiceStub = {
   offersObservable: new Subject()
};
describe('TermsAndConditionsComponent', () => {
   let component: TermsAndConditionsAuthComponent;
   let fixture: ComponentFixture<TermsAndConditionsAuthComponent>;
   let termsService: TermsService;
   let getTerms: any;
   let getAllTerms: any;
   let accept: any;
   let downloadPDF: any;
   let filterTerms: any;
   // let mockEnrolmentService;

   assertModuleFactoryCaching();

   const tokenExpired = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5OTg3MjE3NDg0IiwidG9rZW5fdHlwZSI' +
      '6IkJlYXJlciIsImN0eSI6IndlYiIsInVjaWQiOiJjbGllbnQiLCJCdXNpbmVzc0VudGl0eVVzZXJJZCI6IjMwMTgyMjk4NjkuMDAwMD' +
      'AiLCJpc3MiOiJpZHAubmVkYmFuay5jby56YSIsImFwaWQiOiJhcGkiLCJhdWQiOiIyZTgxMDY3MS0wMDFlLTQ5MjItYjVlNS0xNjdhY' +
      '2JhMzg4YjUiLCJzZXNzaW9uaWQiOiJjYzU5OGExOS00ODhhLTQyZDgtYWNlMS1jOGI1NzQ3YmU1ZmQiLCJuYmYiOjE1MTM4NTY5NjAs' +
      'ImlhdCI6MTUxMzg1NzAyMCwiZXhwIjoxNTEzODc1MDIwLCJncmFudF90eXBlIjoiY2xpZW50X2NyZWRlbnRpYWxzIiwiY2lkIjoiMSI' +
      'sInNjb3BlcyI6WyJOZWRiYW5rSURVc2VyLlNlbGZTZXJ2aWNlQ2xpZW50Il0sImp0aSI6ImNjNTk4YTE5NDg4YTQyZDhhY2UxYzhiNT' +
      'c0N2JlNWZkIn0.JP3EJjA_gXizW-u2VaWoO4He8RPHAgirb8lQn5GqAEks3M1Tu0lH8RvDQQ3kcdDmNPsGr7GEOuhQO24vWRtfTt_R4' +
      'xs2GJnZfc-M9iP6bHpnR8G20S8huOqPY6ksDEvkQrBoJIpZh6BIaUxi9TghOOrY7Y3KqJ2BF5upqX5OdReDxaJ4teFj0Wva2NRxoqjW' +
      'D-SYLdXT00szDyyVxJloECZMKv7gPog0YUBQV16ydgd6z_p9ah1GjO7tEEeEFR4H8zJRTvf1-wHfWhCGmgRWpiPqL4nMq9SMtH1kLO7' +
      'SjbFUycCmjxEdS5NyQpqwGmNAteW5E7ppkdfFVXNQOi8I8Q';

   beforeEach(async(() => {
      getTerms = jasmine.createSpy('getTerms').and.callFake(function () { return Observable.of(PopulateTestTermsModel()); });
      filterTerms = jasmine.createSpy('filterTerms').and.callFake(function () { return Observable.of(PopulateTestTermsModel()); });
      getAllTerms = jasmine.createSpy('getAllTerms').and.callFake(function () { return Observable.of(PopulateTestTermsModel()); });
      accept = jasmine.createSpy('accept').and.callFake(function () { return Observable.of('Successful'); });
      downloadPDF = jasmine.createSpy('downloadPDF').and.returnValue({});

      // mockEnrolmentService = jasmine.createSpyObj('EnrolmentService', ['acceptNedIdTerms', 'handleLoginSuccess']);

      TestBed.configureTestingModule({
         declarations: [TermsAndConditionsAuthComponent],
         imports: [FormsModule, RouterTestingModule],
         providers: [DatePipe, ComponentLoaderFactory, PositioningService,
            RegisterService,
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
               provide: AuthService, useValue: {
               }
            },
            {
               provide: ApiService, useValue: {
               }
            }, EnrolmentService, TokenManagementService, TokenRenewalService,
            {
               provide: Router,
               useClass: class { navigate = jasmine.createSpy('navigate'); }
            },
            {
               provide: ApiAuthService, useValue: {
               }
            },
            BsModalRef, BsModalService, HttpHandler, WindowRefService,
            LoaderService, SystemErrorService, AuthGuardService,
            ClientProfileDetailsService,
            { provide: PreApprovedOffersService, useValue: preApprovedOffersServiceStub }
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(TermsAndConditionsAuthComponent);
      component = fixture.componentInstance;
      termsService = fixture.debugElement.injector.get(TermsService);
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   describe('Nedbank Id terms Accept', () => {


      it('should call acceptNedIdTerms on enrolment service', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

         spyOn(enrolmentService, 'acceptNedIdTerms').and.returnValue(Observable.of(true));
         spyOn(enrolmentService, 'handleLoginSuccess').and.returnValue(Observable.of(true));

         component.acceptNedIdTermsAndConditions();

         expect(enrolmentService.acceptNedIdTerms).toHaveBeenCalled();
      }));

      it('should show error when accept call fails', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

         spyOn(enrolmentService, 'acceptNedIdTerms').and.returnValue(Observable.of(false));
         spyOn(enrolmentService, 'handleLoginSuccess');

         component.acceptNedIdTermsAndConditions();

         expect(component.acceptError).toBe(AuthConstants.errorMessages.systemError.message);
      }));

      it('should stop loader for an error on Accept', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

         spyOn(enrolmentService, 'acceptNedIdTerms').and.returnValue(Observable.throw({}));
         spyOn(enrolmentService, 'handleLoginSuccess');

         component.acceptNedIdTermsAndConditions();

         expect(component.showLoader).toBeFalsy();
      }));

      it('should stop loader for an error on handleLoginSuccess', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

         spyOn(enrolmentService, 'acceptNedIdTerms').and.returnValue(Observable.of(true));
         spyOn(enrolmentService, 'handleLoginSuccess').and.returnValue(Observable.throw({}));

         component.acceptNedIdTermsAndConditions();

         expect(component.showLoader).toBeFalsy();
      }));

   });

   describe('Profile terms Accept', () => {

      it('should call acceptProfileTerms on enrolment service', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

         spyOn(enrolmentService, 'acceptProfileTerms').and.returnValue(Observable.of(true));
         spyOn(enrolmentService, 'handleLoginSuccess').and.returnValue(Observable.of(true));

         component.acceptProfileTermsAndConditions();

         expect(enrolmentService.acceptProfileTerms).toHaveBeenCalled();
      }));

      it('should show error when accept call fails', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

         spyOn(enrolmentService, 'acceptProfileTerms').and.returnValue(Observable.of(false));
         spyOn(enrolmentService, 'handleLoginSuccess');

         component.acceptProfileTermsAndConditions();

         expect(component.acceptError).toBe(AuthConstants.errorMessages.systemError.message);
      }));

      it('should stop loader for an error on Accept', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

         spyOn(enrolmentService, 'acceptProfileTerms').and.returnValue(Observable.throw({}));
         spyOn(enrolmentService, 'handleLoginSuccess');

         component.acceptProfileTermsAndConditions();

         expect(component.showLoader).toBeFalsy();
      }));

      it('should stop loader for an error on handleLoginSuccess', inject([EnrolmentService], (enrolmentService: EnrolmentService) => {

         spyOn(enrolmentService, 'acceptProfileTerms').and.returnValue(Observable.of(true));
         spyOn(enrolmentService, 'handleLoginSuccess').and.returnValue(Observable.throw({}));

         component.acceptProfileTermsAndConditions();

         expect(component.showLoader).toBeFalsy();
      }));

   });

   it('should clear the error message when the close link is selected', () => {
      const action = AlertActionType.Close;
      spyOn(component, 'clearErrorMessage');

      component.onAlertLinkSelected(action);

      expect(component.clearErrorMessage).toHaveBeenCalled();
   });

   it('should decline terms when any link is selected after an error', () => {
      const action = AlertActionType.TryAgain;
      spyOn(component, 'declineTermsAndConditions');

      component.onAlertLinkSelected(action);

      expect(component.declineTermsAndConditions).toHaveBeenCalled();
   });

   it('navigate after decline was selected', inject([TokenManagementService, Router],
      (tokenManagementService: TokenManagementService, router: Router) => {
         spyOn(tokenManagementService, 'SetTokenRenewalTimer').and.stub();
         tokenManagementService.setAuthToken(tokenExpired);

         component.declineTermsAndConditions();

         expect(router.navigate).toHaveBeenCalled();
      }));

});
