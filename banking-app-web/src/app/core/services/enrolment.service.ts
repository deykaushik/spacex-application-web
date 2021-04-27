import { Injectable, Inject } from '@angular/core';
import { ApiAuthService } from './api.auth-service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import * as CryptoJS from 'crypto-js';
import { DOCUMENT } from '@angular/common';
import { TermsService } from '../../shared/terms-and-conditions/terms.service';
import { TokenManagementService } from '../../core/services/token-management.service';
import { AuthGuardService } from '../../core/guards/auth-guard.service';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { RegisterService, ApprovalType } from '../../register/register.service';

import {
   IUserRecoveryDetails,
   IChangePassword,
   INedbankAliasResponse,
   INedbankUser
} from './auth-models';
import { IPasswordRecoveryDetails } from '../../register/register.models';
import { ILinkProfile, IApproveITInfo, ITermsAndConditions, IApiResponse, INedIDTermsAccept } from '../../core/services/models';
import { AuthConstants } from '../../auth/utils/constants';
import { TermsAndConditionsConstants } from '../../shared/terms-and-conditions/constants';
import { TermsAndConditionsComponent } from '../../shared/terms-and-conditions/terms-and-conditions.component';
import { Constants } from '../../core/utils/constants';
import { ConstantsRegister } from '../../register/utils/constants';
import { environment } from '../../../environments/environment';
import { ApproveItComponent } from '../../register/approve-it/approve-it.component';
import { WindowRefService } from './window-ref.service';

@Injectable()
export class EnrolmentService {
   bsModalRef: BsModalRef;
   bsTandCModalRef: BsModalRef;
   nedIdFederated: boolean;
   serviceResponse: Subject<IApiResponse>;
   serviceError: string;
   errorLinkText: string;
   alertAction: string;
   alertType: string;
   termsShown: boolean;
   forgotDetailsFlow: boolean;
   termsToAcceptNedId: ITermsAndConditions[];
   termsToAcceptProfile: ITermsAndConditions[];

   constructor(
      private apiAuthService: ApiAuthService,
      private tokenManagementService: TokenManagementService,
      private termsService: TermsService,
      private authGuard: AuthGuardService,
      private router: Router,
      private modalService: BsModalService,
      private clientProfileDetailsService: ClientProfileDetailsService,
      private registerService: RegisterService,
      private winRef: WindowRefService,
      @Inject(DOCUMENT) private document: Document) {
      this.registerService.resetUserDetails();
      this.nedIdFederated = true;
      this.termsShown = false;
      this.termsToAcceptNedId = [];
      this.termsToAcceptProfile = [];

      this.serviceResponse = new Subject<IApiResponse>();
   }

   setForgotDetailsFlow(isForgotDetails: boolean) {
      this.forgotDetailsFlow = isForgotDetails;
   }

   getServiceResultType(resultCode: string) {
      let resultType = ServiceResultType.Other;
      switch (resultCode) {
         case ConstantsRegister.errorCode.r00: {
            // R00 - Success
            resultType = ServiceResultType.Success;
            break;
         }
         case ConstantsRegister.errorCode.r01: {
            // R01 - Data validation error - incorrect input criteria
            resultType = ServiceResultType.DataValidationError;
            break;
         }
         case ConstantsRegister.errorCode.r02: {
            // R02 - MDM Data error
            resultType = ServiceResultType.InvalidCustomerDetails;
            break;
         }
         case ConstantsRegister.errorCode.r05:
         case ConstantsRegister.errorCode.r30:
         case ConstantsRegister.errorCode.r31: {
            // R05 - Authentication failed: incorrect credentials
            // R30 - Authentication Failed: Logon failure: Invalid secrets supplied
            // R31 - Authentication Failed: Logon failure: Invalid secrets supplied
            resultType = ServiceResultType.IncorrectCredentials;
            break;
         }
         case ConstantsRegister.errorCode.r12:
         case ConstantsRegister.errorCode.r32: {
            // R12 - User can not be found based on input criteria of the request
            // R32 - Authentication Failed: Logon failure: Unknown user credentials
            resultType = ServiceResultType.UnknownUser;
            break;
         }
         case ConstantsRegister.errorCode.r06:
         case ConstantsRegister.errorCode.r33: {
            // R06 - Authentication failed: user account is locked
            // R33 - Authentication Failed:Logon failure: Identity locked
            resultType = ServiceResultType.IdentityLocked;
            break;
         }
         case ConstantsRegister.errorCode.r07:
         case ConstantsRegister.errorCode.r34: {
            // R07 - Logon failed: user account is suspended
            // R34 - Authentication Failed: Logon failure: Identity suspended
            resultType = ServiceResultType.IdentitySuspended;
            break;
         }
         case ConstantsRegister.errorCode.r08:
         case ConstantsRegister.errorCode.r19:
         case ConstantsRegister.errorCode.r77: {
            // R08 - Nedbank ID already exists
            // R19 - Nedbank ID already exists
            // R77 - VerifyProfile: Profile already federated to NedbankID
            resultType = ServiceResultType.NedIdExistOrFederated;
            break;
         }
         case ConstantsRegister.errorCode.r27: {
            // R27 - Link alias not successfull
            resultType = ServiceResultType.LinkAliasError;
            break;
         }
         case ConstantsRegister.errorCode.r73: {
            // R73 - IDM: Secret policy violation
            resultType = ServiceResultType.SecretPolicyViolation;
            break;
         }
         case ConstantsRegister.errorCode.r76: {
            // R76 - VerifyProfile: Cutomer Not a Retail Customer
            resultType = ServiceResultType.NotRetailCustomer;
            break;
         }
         case ConstantsRegister.errorCode.r125: {
            // R125 - Duplicate Identity
            resultType = ServiceResultType.DuplicateIdentity;
            break;
         }
         case ConstantsRegister.errorCode.r20:
         case ConstantsRegister.errorCode.r137: {
            // R20 - Role does not exist
            // R137 - Auto Created Profile
            resultType = ServiceResultType.InvalidFeature;
            break;
         }
         default: {
            resultType = ServiceResultType.Other;
            break;
         }
      }
      return resultType;
   }

   updateServiceResult(response: IApiResponse) {
      this.serviceResponse.next(response);
   }

   onAutoLogin(createNedId: boolean = false) {
      this.logOnUser()
         .take(1)
         .subscribe(logonResponse => {
            if (logonResponse && logonResponse.MetaData && logonResponse.MetaData.ResultCode === 'R00') {
               this.isFederated()
                  .subscribe(isFederatedResponse => {
                     if (isFederatedResponse && isFederatedResponse === true) {
                        this.ShowTerms()
                           .subscribe(() => { },
                           (error) => {
                              this.updateServiceResult(
                                 { data: '', Data: '', metadata: '', MetaData: '', result: '' });
                           });
                     } else {
                        if (!this.nedIdFederated) {
                           if (createNedId) {
                              this.updateServiceResult({
                                 data: '', Data: '', metadata: '', MetaData: '',
                                 result: ServiceResultType.FederationInProgress
                              });
                           } else {
                              if (this.registerService.userDetails.profile &&
                                 this.registerService.userDetails.pin && this.registerService.userDetails.password) {
                                 this.federateUser();
                              } else {
                                 this.updateServiceResult({
                                    data: '', Data: '', metadata: '', MetaData: '',
                                    result: ServiceResultType.InvalidProfileDetails
                                 });
                              }
                           }
                        } else {
                           this.logoffUser(false);
                        }
                     }
                  },
                  (error) => {
                     this.updateServiceResult({ data: '', Data: '', metadata: '', MetaData: '', result: '' });
                  });
            } else {
               this.updateServiceResult({
                  data: '', Data: '',
                  metadata: logonResponse.MetaData, MetaData: logonResponse.MetaData, result: ''
               });
            }
         },
         (error) => {
            this.updateServiceResult({ data: '', Data: '', metadata: '', MetaData: '', result: '' });
         });
   }

   logOnUser(): Observable<IApiResponse> {
      const user: IUser = {
         username: this.registerService.userDetails.nedbankIdUserName,
         password: this.registerService.userDetails.nedbankIdPassword,
         appliesTo: environment.audience,
         secretType: AuthConstants.secretTypes.password,
         token: ''
      };

      return this.apiAuthService.AuthorizeNedbankId.create(user)
         .take(1)
         .map(response => {
            if (response && response.MetaData) {
               if (response.MetaData.ResultCode === 'R00') {
                  const token = response.Data.TokenValue;
                  this.tokenManagementService.setAuthToken(token);
                  this.tokenManagementService.setUnfederatedToken(token);
               }
            }
            return response;
         });
   }

   logoffUser(redirect: boolean = false) {
      try {
         this.tokenManagementService.removeAuthToken();
         this.tokenManagementService.removeUnfederatedToken();
         this.authGuard.isAuthenticated.emit(false);

         if (redirect) {
            this.router.navigate(['../login']);
         }
      } catch (e) { }
   }

   isFederated(): Observable<boolean> {
      this.nedIdFederated = true;
      const token = this.tokenManagementService.getAuthToken();

      if (token) {
         const nedbankUser: INedbankUser = { uniqueuserid: 0, partnerid: 20 };
         nedbankUser.uniqueuserid = this.getNedbankUserId(token);
         return this.registerService.retrieveAlias(nedbankUser)
            .take(1)
            .map(aliasResponse => {
               if (aliasResponse) {
                  if (aliasResponse.MetaData && aliasResponse.MetaData.ResultCode === 'R00') {
                     if (aliasResponse.Data && aliasResponse.Data.length > 0) {
                        return true;
                     } else {
                        this.nedIdFederated = false;
                        return false;
                     }
                  } else {
                     this.updateServiceResult({
                        data: '', Data: '',
                        metadata: aliasResponse.MetaData, MetaData: aliasResponse.MetaData, result: ''
                     });
                     return false;
                  }
               } else {
                  return false;
               }
            });
      } else {
         return Observable.of(false);
      }
   }

   federateUser() {
      this.registerService.approvalType = ApprovalType.FederateUser;
      this.registerService
         .Approve(this.registerService.temporaryId, 0, 0)
         .take(1)
         .subscribe(approveResponse => {
            if (approveResponse.MetaData.ResultCode === ConstantsRegister.errorCode.r00) {
               this.registerService.verificationId = approveResponse.Data.SecurityRequestID;

               if (approveResponse.Data.MobileNumber) {
                  this.registerService.userDetails.mobileNumber = approveResponse.Data.MobileNumber;
               }

               this.bsModalRef = this.modalService.show(
                  ApproveItComponent,
                  Object.assign(
                     {},
                     {
                        animated: true,
                        keyboard: false,
                        backdrop: true,
                        ignoreBackdropClick: true
                     },
                     { class: '' }
                  )
               );
               this.modalService.onHidden.asObservable()
                  .take(1)
                  .subscribe(() => {
                     if (this.registerService.approveItSucess) {
                        if (!this.termsShown) {
                           this.logOnUser()
                              .take(1)
                              .subscribe(responseLognOn => {
                                 if (responseLognOn && responseLognOn.MetaData && responseLognOn.MetaData.ResultCode === 'R00') {
                                    this.isFederated()
                                       .take(1)
                                       .subscribe(responseIsFederated => {
                                          if (responseIsFederated && responseIsFederated === true) {
                                             if (this.nedIdFederated) {
                                                this.ShowTerms()
                                                   .subscribe(Response => {
                                                   },
                                                   (error) => {
                                                      this.updateServiceResult(
                                                         { data: '', Data: '', metadata: '', MetaData: '', result: '' });
                                                   });
                                             }
                                          } else {
                                             this.updateServiceResult({
                                                data: '', Data: '', metadata: '', MetaData: '', result: ''
                                             });
                                          }
                                       },
                                       (error) => {
                                          this.updateServiceResult({
                                             data: '', Data: '', metadata: '', MetaData: '', result: ''
                                          });
                                       });
                                 } else {
                                    this.updateServiceResult({
                                       data: '', Data: '', metadata: responseLognOn.MetaData,
                                       MetaData: responseLognOn.MetaData, result: ''
                                    });
                                 }
                              });
                        }

                     } else {
                        this.updateServiceResult({
                           data: '', Data: '', metadata: this.registerService.serviceResponse.MetaData,
                           MetaData: this.registerService.serviceResponse.MetaData, result: ''
                        });
                        this.logoffUser(false);
                     }
                  });
            } else {
               this.updateServiceResult({
                  data: '', Data: '', metadata: approveResponse.MetaData,
                  MetaData: approveResponse.MetaData, result: ''
               });
               this.logoffUser(false);
            }
         },
         (error) => {
            this.updateServiceResult({ data: '', Data: '', metadata: '', MetaData: '', result: '' });
            this.logoffUser(false);
         }
         );
   }

   ShowTerms(): Observable<any> {
      return new Observable(observer => {
         let mustShowTerms = false;
         const userId = this.termsService.getNedUserId();
         this.mustAcceptNedIdTerms(userId)
            .switchMap(query => this.mustAcceptTerms(),
            (nedIdTerms, profileTerms) => {
               if (nedIdTerms && nedIdTerms.length > 0) {
                  mustShowTerms = true;
                  this.termsToAcceptNedId = nedIdTerms;
               }
               if (profileTerms && profileTerms.length > 0) {
                  mustShowTerms = true;
                  this.termsToAcceptProfile = profileTerms;
               }
               if (mustShowTerms === false) {
                  return this.handleLoginSuccess()
                     .subscribe(() => {
                        observer.next(true);
                        observer.complete();
                     },
                     (error) => {
                        observer.error(error);
                     });
               } else {
                  this.registerService.makeFormDirty(false);
                  observer.next(true);
                  observer.complete();
                  this.navigateToUrl('/auth/terms');
               }
            })
            .subscribe(() => { },
            (error) => {
               observer.error(error);
               console.log(error);
            });
      });
   }

   private navigateToUrl(url, time = 500) {
      this.winRef.nativeWindow.setTimeout(() => {
         this.router.navigate([url]);
      }, time);
   }

   handleLoginSuccess(): Observable<any> {
      return new Observable(observer => {
         try {
            const token = this.tokenManagementService.getAuthToken();
            this.tokenManagementService.setUnfederatedToken(token);

            this.apiAuthService.RefreshAccounts.getAll()
               .subscribe(response => {
                  this.setUserDetailsObserver();
                  this.termsToAcceptNedId = [];
                  this.termsToAcceptProfile = [];
                  this.registerService.makeFormDirty(false);
                  this.navigateToUrl('/');
                  observer.next(true);
                  observer.complete();
               },
               (error) => {
                  this.updateServiceResult({ data: '', Data: '', metadata: '', MetaData: '', result: '' });
                  this.logoffUser(true);
                  observer.error(error);
               });
         } catch (e) {
            this.updateServiceResult({ data: '', Data: '', metadata: '', MetaData: '', result: '' });
            this.logoffUser(true);
            observer.error(e);
         }
      });
   }

   public getLastAcceptedNedIdTerms(userId: number): Observable<number> {
      return new Observable(observer => {
         this.termsService.getLatestAcceptedNedIdTerms(userId)
            .subscribe(response => {
               let ver = 0;
               if (response && response.length > 0) {
                  ver = response[0].Version.VersionNumber;
                  observer.next(ver);
                  observer.complete();
               } else {
                  observer.next(0);
               }
            },
            (error: number) => {
               observer.error(error);
            });
      });
   }

   public getLatestNedbankIdTerms(): Observable<ITermsAndConditions[]> {
      return new Observable(observer => {
         this.termsService.getNedIdTerms()
            .switchMap(query => this.termsService.decodeTermsContent(query.Content),
            (content, decoded) => {
               observer.next(this.termsService.convertToSingleTerm(decoded, content.Version.VersionNumber, content.Version.VersionDate));
               observer.complete();
            })
            .subscribe(() => { },
            (error) => {
               observer.error(error);
            });
      });
   }

   mustAcceptNedIdTerms(userId: number): Observable<ITermsAndConditions[]> {
      return new Observable(observable => {
         this.getLastAcceptedNedIdTerms(userId)
            .subscribe(response => {
               if (response === 0) {
                  observable.next([]);
                  observable.complete();
               } else if (response > 0) {
                  this.getLatestNedbankIdTerms()
                     .subscribe(terms => {
                        if (terms && terms.length > 0) {
                           observable.next(terms);
                           observable.complete();
                        } else {
                           observable.error(ServiceResultType.Other);
                        }
                     },
                     (error) => {
                        observable.error(error);
                     });
               }
            },
            (error) => {
               observable.error(error);
            });
      });
   }

   mustAcceptTerms(): Observable<ITermsAndConditions[]> {
      return new Observable(observable => {
         this.termsService.getTerms()
            .subscribe(response => {
               if (response && response.data && response.data.length > 0) {
                  const filteredTerms = this.termsService.filterTerms(response.data,
                     TermsAndConditionsConstants.excludeGeneralTermsTypes);
                  if (filteredTerms && filteredTerms.length > 0) {
                     this.termsToAcceptProfile = filteredTerms;
                  } else {
                     this.termsToAcceptProfile = [];
                  }
                  observable.next(this.termsToAcceptProfile);
                  observable.complete();
               } else {
                  observable.error(ServiceResultType.Other);
               }
            },
            (error) => {
               observable.error(error);
            });
      });
   }

   acceptNedIdTerms(): Observable<boolean> {
      return this.termsService.acceptNedIdTerms(this.termsToAcceptNedId);
   }

   acceptProfileTerms(): Observable<boolean> {
      return this.termsService.acceptProfileTerms(this.termsToAcceptProfile);
   }

   getNedbankUserId(token: string): number {
      const decodedToken = this.decodeJwt(token);
      return decodedToken.sub;
   }

   decodeJwt(token: string) {
      return jwt_decode(token);
   }

   setUserDetailsObserver() {
      this.clientProfileDetailsService.getClientDetail();
   }

   EncryptString(text: string): string {
      let key = 'H+Q%3*KJ1skV\'VJ>SvFT(+BX';
      const useHashing = true;
      let textWordArray: any;
      let keyHex: any;
      let encrypted: string;

      const options = {
         mode: CryptoJS.mode.ECB,
         padding: CryptoJS.pad.Pkcs7
      };

      /* istanbul ignore else  */
      if (useHashing) {
         key = CryptoJS.MD5(key).toString();
         const k1 = key.substring(0, 16);
         key = key + k1;
      }

      textWordArray = CryptoJS.enc.Utf8.parse(text);
      keyHex = CryptoJS.enc.Hex.parse(key);
      encrypted = CryptoJS.TripleDES.encrypt(textWordArray, keyHex, options);
      const base64String = encrypted.toString();

      return base64String;
   }
   checkLogin(): Observable<IApiResponse> {
      return this.apiAuthService.CheckLogin.getAll();
   }
}

export enum ServiceResultType {
   Success,
   DataValidationError,
   UnknownUser,
   IncorrectCredentials,
   IdentityLocked,
   IdentitySuspended,
   NedIdExistOrFederated,
   NotRetailCustomer,
   SecretPolicyViolation,
   FederationInProgress,
   InvalidProfileDetails,
   DuplicateIdentity,
   LinkAliasError,
   InvalidCustomerDetails,
   InvalidFeature,
   Other
}

export interface IEnrolmentUser {
   profile: string;
   pin: string;
   password: string;
   nedbankIdUserName: string;
   nedbankIdPassword: string;
   mobileNumber: string;
}

export interface IUser {
   username?: string;
   password?: string;
   appliesTo?: string;
   secretType?: string;
   token?: string;
}
