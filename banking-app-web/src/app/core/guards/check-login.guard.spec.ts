import { TestBed, async, inject } from '@angular/core/testing';

import { CheckLoginGuard } from './check-login.guard';
import { EnrolmentService } from '../services/enrolment.service';
import { Observable } from 'rxjs/Observable';
import { AuthGuardService } from './auth-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
const testComponent = class { };
const routerTestingParam = [
   { path: 'auth/logoff', component: testComponent }
];
describe('CheckLoginGuard', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [RouterTestingModule.withRoutes(routerTestingParam)],
         providers: [CheckLoginGuard,
            { provide: EnrolmentService, useValue: { checkLogin: jasmine.createSpy('checkLogin').and.returnValue(Observable.of(true)) } },
            { provide: AuthGuardService, useValue: { isAuthenticated: { emit: () => { } } } }
         ]
      });
   });

   it('should guard work', inject([CheckLoginGuard], (guard: CheckLoginGuard) => {
      guard.canActivate().subscribe(result => {
         expect(result).toBeTruthy();
      });
      expect(guard).toBeTruthy();
   }));
   it('should handle error work', inject([CheckLoginGuard, EnrolmentService],
      (guard: CheckLoginGuard, enroll: EnrolmentService) => {
         enroll.checkLogin = jasmine.createSpy('checkLogin').and.returnValue(Observable.create((observer) => {
            observer.error(new Error('error'));
            observer.complete();
         }));
         guard.canActivate().subscribe(result => {
            expect(result).toBeFalsy();
         });
      }));
});
