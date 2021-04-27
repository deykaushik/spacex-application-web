import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EnrolmentService } from '../services/enrolment.service';
import { AuthGuardService } from './auth-guard.service';

@Injectable()
export class CheckLoginGuard implements CanActivate {
   constructor(private enrollmentService: EnrolmentService,
      private authservice: AuthGuardService, private router: Router) {

   }
   canActivate(): Observable<boolean> {
      return Observable.create(observer => {
         this.enrollmentService.checkLogin().subscribe((response) => {
            observer.next(true);
            observer.complete();
            this.authservice.isAuthenticated.emit(true);
         }, (error) => {
            this.authservice.isAuthenticated.emit(false);
            observer.next(false);
            observer.complete();
            this.router.navigate(['auth/logoff']);
         });
      });
   }
}
