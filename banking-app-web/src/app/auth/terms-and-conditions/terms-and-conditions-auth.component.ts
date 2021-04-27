import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { WindowRefService } from '../../core/services/window-ref.service';
import { Route, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { EnrolmentService } from '../../core/services/enrolment.service';
import { AuthService } from '../auth.service';
import { ITermsAndConditions } from '../../core/services/models';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { Constants } from '../../core/utils/constants';
import { AuthConstants } from '../utils/constants';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { CommonUtility } from './../../core/utils/common';
import { SystemErrorService } from './../../core/services/system-services.service';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { ApiAuthService } from '../../core/services/api.auth-service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';

@Component({
   selector: 'app-modal-content',
   templateUrl: './terms-and-conditions-auth.component.html',
   styleUrls: ['./terms-and-conditions-auth.component.scss'],
   encapsulation: ViewEncapsulation.None
})

export class TermsAndConditionsAuthComponent implements OnInit, OnDestroy {
   public title: string;
   private isComponentActive = true;
   constants = Constants;
   dateFormat: string = Constants.formats.yyyyMMdd;
   acceptError: string;
   alertType: AlertMessageType = AlertMessageType.Error;
   mustShowTerms = false;
   showLoader: boolean;

   termsToAcceptNedId: ITermsAndConditions[];
   termsToAcceptProfile: ITermsAndConditions[];

   constructor(
      private router: Router,
      private termsService: TermsService,
      private authService: AuthService,
      private windowrefservice: WindowRefService,
      private systemErrorService: SystemErrorService,
      private authGuard: AuthGuardService,
      private tokenManagementService: TokenManagementService,
      private apiAuthService: ApiAuthService,
      private clientProfileDetailsService: ClientProfileDetailsService,
      private enrolmentService: EnrolmentService) {
   }

   ngOnInit() {
      try {
         this.showLoader = false;
         this.acceptError = '';
         this.loadTerms();
      } catch (e) {
         this.setErrorMessage(AuthConstants.errorMessages.systemError);
      }
   }

   ngOnDestroy() {
      this.isComponentActive = false;
      this.showHideHeaderFooter(true);
   }

   showHideHeaderFooter(show: boolean = false) {
      try {
         const header = this.windowrefservice.nativeWindow.document.getElementsByTagName('header')[0];
         if (header) {
            const rightSideOfHeader = this.windowrefservice.nativeWindow.document.getElementsByClassName('top-right-header-section')[0];
            if (rightSideOfHeader) {
               if (show) {
                  rightSideOfHeader.classList.remove('hidden');
               } else {
                  rightSideOfHeader.classList.add('hidden');
               }
            }
         }

         const footer = this.windowrefservice.nativeWindow.document.getElementsByTagName('footer')[0];
         if (footer) {
            if (show) {
               footer.classList.remove('hidden');
            } else {
               footer.classList.add('hidden');
            }
         }
      } catch (e) { }
   }

   loadTerms() {
      try {
         this.termsToAcceptNedId = this.enrolmentService.termsToAcceptNedId;
         this.termsToAcceptProfile = this.enrolmentService.termsToAcceptProfile;
         this.mustShowTerms = this.termsToAcceptNedId.length > 0 || this.termsToAcceptProfile.length > 0;
         this.showHideHeaderFooter(false);
         if (!this.mustShowTerms) {
            this.setErrorMessage(AuthConstants.errorMessages.systemError);
            this.router.navigate(['/']);
         }
      } catch (e) {
         this.mustShowTerms = true;
         this.setErrorMessage(AuthConstants.errorMessages.systemError);
      }
   }

   acceptNedIdTermsAndConditions() {
      this.clearErrorMessage();
      this.showLoader = true;
      this.enrolmentService.acceptNedIdTerms()
         .subscribe(response => {
            this.showLoader = false;
            if (response && response === true) {
               this.termsToAcceptNedId = [];
               if (this.termsToAcceptProfile && this.termsToAcceptProfile.length === 0) {
                  this.enrolmentService.handleLoginSuccess()
                     .subscribe(() => { },
                     (error) => {
                        this.showLoader = false;
                     });
               }
            } else {
               this.setErrorMessage(AuthConstants.errorMessages.systemError);
            }
         },
         (error) => {
            this.showLoader = false;
         });
   }

   acceptProfileTermsAndConditions() {
      this.clearErrorMessage();
      this.showLoader = true;

      this.enrolmentService.acceptProfileTerms()
         .subscribe(response => {
            if (response && response === true) {
               this.enrolmentService.handleLoginSuccess()
                  .finally(() => {
                     this.showLoader = false;
                  })
                  .subscribe(() => { },
                  (error) => {
                     this.showLoader = false;
                  });
            } else {
               this.setErrorMessage(AuthConstants.errorMessages.systemError);
            }
         },
         (error) => {
            this.showLoader = false;
         });
   }

   public declineTermsAndConditions() {
      const token = this.tokenManagementService.getAuthToken();
      if (token) {
         this.router.navigate(['/auth/logoff']);
      } else {
         this.router.navigate(['/auth']);
      }
   }

   setErrorMessage(errorMessage) {
      this.showLoader = false;
      this.acceptError = errorMessage.message ? errorMessage.message : '';
   }

   clearErrorMessage() {
      this.setErrorMessage({
         message: '',
         errorLinkText: '',
         alertAction: AlertActionType.None,
         alertType: AlertMessageType.Error
      });
   }

   formatDate(inputDate: string) {
      let outputDate = '';
      try {
         if (inputDate) {
            outputDate = inputDate.replace(/-/g, '/');
         } else {
            outputDate = '';
         }
      } catch (e) {
         outputDate = '';
      }
      return outputDate;
   }

   onAlertLinkSelected(action: AlertActionType) {
      if (action) {
         switch (action) {
            case AlertActionType.Close: {
               this.clearErrorMessage();
               break;
            }
            default: {
               this.declineTermsAndConditions();
               break;
            }
         }
      }
   }
}
