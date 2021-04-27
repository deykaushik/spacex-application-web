import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {
   ICheckUsername, IUpdateUser, GeneralInfo,
   IApproveResponse, IApprove, ILinkProfile,
   IApproveITInfo, IApiResponse
} from '../core/services/models';
import {
   IVerifyProfile, IVerifyProfileResponse,
   ICheckUsernameResponse, IUpdateUserResponse,
   ISecurityStatusResponse, INedbankAliasResponse,
   INedbankUser, IUserRecoveryDetails, IChangePassword
} from '../core/services/auth-models';
import { ApiService } from '../core/services/api.service';
import * as CryptoJS from 'crypto-js';
import { View } from './utils/enums';
import { ConstantsRegister } from './utils/constants';
import { IPasswordRecoveryDetails } from '../register/register.models';
import { ApiAuthService } from '../core/services/api.auth-service';
import { ISubscription } from 'rxjs/Subscription';

@Injectable()
export class RegisterService {
   passwordRecoveryDetails: IPasswordRecoveryDetails;
   temporaryId: number;
   verificationId: number;
   nedbankIdExist: boolean;
   isFederated: boolean;
   isPasswordRecovery: boolean;
   navigateObservable: Observable<number>;
   navigateSubscription: ISubscription;
   approveItSucess = false;
   previousView: View;
   activeView: View;
   pngImgUrl: string;
   pngPath = '../../../assets/png/';
   approvalType: ApprovalType;
   serviceResponse: IApiResponse;
   userDetails: IEnrolmentUser;
   isFormDirty: Boolean = false;
   constructor(private service: ApiService, private apiAuthService: ApiAuthService) {
      this.ResetVariables();
   }

   ResetVariables() {
      this.temporaryId = 0;
      this.verificationId = -1;
      this.nedbankIdExist = false;
      this.approvalType = ApprovalType.ApproveUser;
      this.isFederated = true;
      this.pngImgUrl = '';
      this.isPasswordRecovery = false;
      this.approveItSucess = false;
      this.makeFormDirty(false);
      this.resetUserDetails();
      this.passwordRecoveryDetails = {
         MobileNumber: '', UserName: '', Password: '',
         ApproveItInfo: { ApproveITMethod: 'USSD', ApproveITVerificationID: 0, OTP: 0 }
      };
      this.SetActiveView(View.RegisterLanding, View.ProfilePinPassword);
   }

   SetActiveView(currentView: View, activeView: View) {
      const registerService = this;

      setTimeout(function () {
         registerService.previousView = currentView;
         registerService.activeView = activeView;

         try {
            let pngImg = 'NedbankLogin_v2';
            const viewList = ConstantsRegister.ViewDetails;
            const viewName = Object.keys(viewList).find(k => viewList[k].type === activeView);
            if (viewName && viewList[viewName].image) {
               pngImg = viewList[viewName].image;
            }
            registerService.SetImage(pngImg);
         } catch (e) { }
      }, 10);
   }

   SetImage(pngImg: string) {
      if (pngImg) {
         this.pngImgUrl = 'url(' + this.pngPath + pngImg + '.png)';
      }
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

   validateProfile(profile: string, password: string, pin: string): Observable<IVerifyProfileResponse> {
      this.temporaryId = -1;

      const profileToVerify: IVerifyProfile = {
         Password: password,
         PIN: pin,
         Profile: profile
      };

      // store profile, pin, password in case profile already has a nedbank id. Will be required
      // to validate later on.
      this.userDetails.profile = profile;
      this.userDetails.pin = pin;
      this.userDetails.password = password;

      return this.apiAuthService.VerifyProfile.create(profileToVerify).map(response => {
         return {
            MetaData: response.MetaData ? response.MetaData : response.metadata,
            Data: response.Data ? response.Data : response.data
         };
      });
   }

   checkUsernameAvailable(usernameToCheck: string): Observable<ICheckUsernameResponse> {
      const name: ICheckUsername = {
         username: usernameToCheck
      };

      return this.apiAuthService.CheckUsername.create(name).map(response => {
         return {
            MetaData: response.MetaData ? response.MetaData : response.metadata,
            Data: response.Data ? response.Data : response.data
         };
      });
   }

   UpdateUser(username: string, password: string, temporaryID: number): Observable<IUpdateUserResponse> {
      const info: GeneralInfo = {
         Username: username,
         Password: password,
      };

      const user: IUpdateUser = {
         GeneralInfo: info,
         TemporaryID: temporaryID,
         TermsAndConditionsAccepted: true
      };

      return this.apiAuthService.UpdateUser.update(user).map(response => {
         return {
            MetaData: response.MetaData ? response.MetaData : response.metadata,
            Data: response.Data ? response.Data : response.data
         };
      });
   }

   Approve(temporaryID: number, approveITVerificationID: number, otp: number): Observable<any> {

      const info: IApproveITInfo = {
         ApproveITMethod: otp > 0 ? 'OTP' : 'USSD',
         ApproveITVerificationID: approveITVerificationID,
         OTP: otp
      };

      const approve: IApprove = {
         TemporaryID: temporaryID,
         ApproveITInfo: info
      };

      this.approveItSucess = false;

      switch (this.approvalType) {
         case ApprovalType.FederateUser:
            return this.LinkProfile(this.userDetails.profile,
               this.userDetails.pin,
               this.userDetails.password,
               approveITVerificationID,
               otp);

         case ApprovalType.RecoverPassword:
            const passwordRecoveryDetails: IPasswordRecoveryDetails = {
               MobileNumber: this.userDetails.mobileNumber,
               UserName: this.userDetails.nedbankIdUserName,
               Password: this.userDetails.nedbankIdPassword,
               ApproveItInfo: info
            };
            return this.recoverPassword(passwordRecoveryDetails);

         default:
            return this.apiAuthService.Approve.create(approve).map(response => {
               this.serviceResponse = response;
               return response;
            });
      }
   }

   ApproveStatus(verificationId: number): Observable<ISecurityStatusResponse> {
      return this.apiAuthService.ApproveStatus.get(verificationId).map(response => {
         return {
            MetaData: response.MetaData ? response.MetaData : response.metadata,
            Data: response.Data ? response.Data : response.data
         };
      });
   }

   LinkProfile(profile: string, pin: string, password: string, verificationId: number, otp: number): Observable<any> {

      const linkProfile: ILinkProfile = {
         Action: 'Link',
         ProfileInfo: {
            Profile: profile,
            PIN: pin,
            Password: password
         },
         ApproveItInfo: {
            ApproveITMethod: otp > 0 ? 'OTP' : 'USSD',
            ApproveITVerificationID: verificationId,
            OTP: otp
         }
      };

      return this.apiAuthService.LinkProfile.create(linkProfile).map(response => {
         this.serviceResponse = response;
         return response;
      });
   }

   recoverPassword(user: IPasswordRecoveryDetails): Observable<any> {
      return this.apiAuthService.RecoverPassword.create(user).map(response => {
         this.serviceResponse = response;
         return response;
      });
   }

   retrieveAlias(user: INedbankUser): Observable<INedbankAliasResponse> {
      const routeParam: any = { uniqueuserid: user.uniqueuserid, partnerid: user.partnerid };
      return this.apiAuthService.RetrieveAlias.getAll(routeParam, {}).map(response => {
         this.serviceResponse = response;
         return { MetaData: response.MetaData, Data: response.Data };
      });
   }

   recoverUsername(user: IUserRecoveryDetails): Observable<any> {
      return this.apiAuthService.RecoverUserName.create(user).map(response => {
         this.serviceResponse = response;
         return response;
      });
   }

   changePassword(userDetails: IChangePassword): Observable<any> {
      return this.apiAuthService.ChangePassword.update(userDetails).map(response => {
         this.serviceResponse = response;
         return response;
      });
   }

   resetUserDetails() {
      this.userDetails = {
         nedbankIdPassword: '',
         nedbankIdUserName: '',
         password: '',
         pin: '',
         profile: '',
         mobileNumber: ''
      };
   }
   makeFormDirty(isDirty: boolean) {
      this.isFormDirty = isDirty;
   }
}

export enum ApprovalType {
   ApproveUser,
   FederateUser,
   RecoverPassword
}

export interface IEnrolmentUser {
   profile: string;
   pin: string;
   password: string;
   nedbankIdUserName: string;
   nedbankIdPassword: string;
   mobileNumber: string;
}
