import { Injectable, EventEmitter } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { environment } from './../../../environments/environment';
import { AuthConstants } from '../../auth/utils/constants';
import { ClientProfileDetailsService } from '../services/client-profile-details.service';
import { TokenManagementService } from '../services/token-management.service';
import { Constants } from './../utils/constants';
import { PreApprovedOffersService } from '../services/pre-approved-offers.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanLoad {
   constructor(private router: Router, private clientProfileDetailsService: ClientProfileDetailsService,
      private tokenManagementService: TokenManagementService, private preApprovedOffersService: PreApprovedOffersService) {
   }
   isAuthenticated = new EventEmitter<boolean>();

   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
      // implement the logic for gaurding the route to activate or not
      return true;
   }
   CanDeactivate() {
      return false;
   }
   canLoad(route: Route): Observable<boolean> {

      const token = this.tokenManagementService.getAuthToken();

      if (token && token.length) {
         // logged in so return true

         if (environment.envName === Constants.environmentNames.mock && !this.clientProfileDetailsService.clientDetailsObserver.value) {
            this.clientProfileDetailsService.getClientDetail();
         }
         if (this.preApprovedOffersService.isPreApprovedOffersActive && !this.preApprovedOffersService.offersObservable.value) {
            this.preApprovedOffersService.getOffers();
         }
         return Observable.create(observer => {
            this.clientProfileDetailsService.clientDetailsObserver.subscribe(clientDetails => {
               if (clientDetails != null) {
                  observer.next(true);
                  /* this will be determined on CheckLogin call now  */
                  // this.isAuthenticated.emit(true);
                  observer.complete();
               }
            });
         });
      }
      this.isAuthenticated.emit(false);
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login']);

      return Observable.of(false);
      /* not sure what this is about below.
      let return_value = false;
      this.isAuthenticated.emit(true);
      Object.keys(environment.features).forEach(key => {
        if (route.path) {
          if (route.path.startsWith(key) && environment.features[key]) {
            return_value = true;
          }
        }
      });
      if (!return_value) {
        this.router.navigate(['/commingsoon']);
      }
      return return_value;
        */

   }
}
