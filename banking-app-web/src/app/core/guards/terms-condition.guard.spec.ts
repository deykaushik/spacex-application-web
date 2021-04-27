import { TestBed, async, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { TermsConditionGuard } from './terms-condition.guard';
import { TermsService } from './../../shared/terms-and-conditions/terms.service';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve, CanActivate, } from '@angular/router';

const bsModalServiceStub = {
   show: jasmine.createSpy('getApproveItStatus').and.callFake(function () {
      return {
         content: {
            getApproveItStatus: Observable.of(true),
            resendApproveDetails: Observable.of(true),
            getOTPStatus: Observable.of(true),
            otpIsValid: Observable.of(true),
            updateSuccess: Observable.of(true),
            processApproveUserResponse: jasmine.createSpy('processApproveItResponse'),
            processApproveItResponse: jasmine.createSpy('processApproveItResponse'),
            processResendApproveDetailsResponse: jasmine.createSpy('processResendApproveDetailsResponse'),
         }
      };
   }),
   onShow: jasmine.createSpy('onShow'),
   onShown: jasmine.createSpy('onShown'),
   onHide: jasmine.createSpy('onHide'),
   onHidden: {
      asObservable: jasmine.createSpy('onHidden asObservable').and.callFake(function () {
         return Observable.of(true);
      })
   },
};

describe('TermsConsitionGuard', () => {


   const termsServiceStub = {
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
      isAccepted: true,
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

   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [
            TermsConditionGuard,
            { provide: TermsService, useValue: termsServiceStub },
            { provide: BsModalService, useValue: bsModalServiceStub }
         ]
      });
   });

   it('should create guard', inject([TermsConditionGuard], (guard: TermsConditionGuard) => {
      expect(guard).toBeTruthy();
   }));

   it('should have canActivate ', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         const state: RouterStateSnapshot = {
            url: 'buyElectricity',
            root: null
         };
         expect(guard.canActivate(null, state)).toBeTruthy();
      }));
   it('should have canActivate ', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         const state: RouterStateSnapshot = {
            url: 'buyElectricity/1',
            root: null
         };
         expect(guard.canActivate(null, state)).toBeTruthy();
      }));

   it('should return true on canActivate', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         const state: RouterStateSnapshot = {
            url: 'buyElectricity',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeTruthy();
         });
      }));
   it('should return true on canActivate', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         const state: RouterStateSnapshot = {
            url: 'buyElectricity/1',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeTruthy();
         });
      }));
   it('should return true on canActivate when not accepted', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         termsService.isAccepted = false;
         const state: RouterStateSnapshot = {
            url: 'buyElectricity',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeFalsy();
         });
      }));
   it('should return true on canActivate when not accepted', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         termsService.isAccepted = false;
         const state: RouterStateSnapshot = {
            url: 'buyElectricity/1',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeFalsy();
         });
      }));
   it('should return true on canActivate when no url match', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         const state: RouterStateSnapshot = {
            url: 'abc',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeTruthy();
         });
      }));
   it('should return true on canActivate with no return data', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         termsService.getTerms = jasmine.createSpy('getTerms').and.returnValue(Observable.of({}));
         const state: RouterStateSnapshot = {
            url: 'buyElectricity',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeTruthy();
         });
      }));
   it('should return true on canActivate with no return data', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         termsService.getTerms = jasmine.createSpy('getTerms').and.returnValue(Observable.of({}));
         const state: RouterStateSnapshot = {
            url: 'buyElectricity/1',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeTruthy();
         });
      }));
   it('should return true on canActivate with no filteredTerms data', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         termsService.filterTerms = jasmine.createSpy('filteredTerms').and.returnValue(Observable.of({}));
         const state: RouterStateSnapshot = {
            url: 'buyElectricity',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeTruthy();
         });
      }));
   it('should return true on canActivate with no filteredTerms data', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         termsService.filterTerms = jasmine.createSpy('filteredTerms').and.returnValue(Observable.of({}));
         const state: RouterStateSnapshot = {
            url: 'buyElectricity/1',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeTruthy();
         });
      }));
   it('should return false if api fails', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         termsService.getTerms = jasmine.createSpy('getTerms').and.callFake(function () {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         });
         const state: RouterStateSnapshot = {
            url: 'buyElectricity',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeFalsy();
         });
      }));

   it('should return false if api fails', inject([TermsConditionGuard, TermsService],
      (guard: TermsConditionGuard, termsService: TermsService) => {
         termsService.getTerms = jasmine.createSpy('getTerms').and.callFake(function () {
            return Observable.create(observer => {
               observer.error(new Error('error'));
               observer.complete();
            });
         });
         const state: RouterStateSnapshot = {
            url: 'buyElectricity/1',
            root: null
         };
         guard.canActivate(null, state).subscribe(result => {
            expect(result).toBeFalsy();
         });
      }));
});
