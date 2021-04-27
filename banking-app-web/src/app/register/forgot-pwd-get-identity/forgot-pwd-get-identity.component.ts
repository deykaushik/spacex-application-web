import { Component, OnInit, OnDestroy, ViewChild, EventEmitter, AfterViewInit, Output, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

import { EnrolmentService, ServiceResultType } from '../../core/services/enrolment.service';
import { RegisterService } from '../../register/register.service';

import { IDropdownItem } from '../../core/utils/models';
import { IUserRecoveryDetails } from '../../core/services/auth-models';
import { ApproveItComponent } from '../../register/approve-it/approve-it.component';
import { Constants } from '../../core/utils/constants';
import { ConstantsRegister } from '../utils/constants';
import { CountryList, ICountry } from '../utils/country-list';
import { View } from '../utils/enums';
import { AlertActionType, AlertMessageType } from '../../shared/enums';
import { DOCUMENT } from '@angular/platform-browser';
import { CommonUtility } from '../../core/utils/common';

@Component({
   selector: 'app-nedbankid-forgotpwd-getidentity',
   templateUrl: './forgot-pwd-get-identity.component.html',
   styleUrls: ['./forgot-pwd-get-identity.component.scss']
})

export class NedbankIdForgotPwdGetIdentityComponent implements OnInit, OnDestroy {

   @Output() isComponentValid = new EventEmitter<boolean>();
   @ViewChild('getIdentityForm') identityForm: NgForm;
   vm: IUserRecoveryDetails;
   serviceError: string;
   errorLinkText: string;
   alertAction: string;
   alertType: string;
   showLoader: boolean;
   patterns = Constants.patterns;
   isValid: boolean;
   bsModalRef: BsModalRef;
   messages: any = ConstantsRegister.messages;
   idTypeRsaId = 'RSAIDENTITY';
   idTypePassport = 'PASSPORTNUMBER';
   countryCodeRSA = 'ZA';
   countryList: ICountry[] = [];
   selectedCountry: ICountry;
   selectedCountryName = '';
   noCountryData = true;
   isComponentActive = true;
   idPatternValid: boolean;
   phonePatternValid: boolean;

   constructor(private router: Router,
      private registerService: RegisterService,
      private modalService: BsModalService,
      private enrolmentService: EnrolmentService,
      @Inject(DOCUMENT) private document: Document) { }

   ngOnInit() {
      this.vm = { MobileNumber: '', IdDetails: { CountryCode: this.countryCodeRSA, IdNumber: '', IdType: this.idTypeRsaId } };
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
      this.idPatternValid = true;
      this.phonePatternValid = true;
      this.registerService.resetUserDetails();
   }

   ngOnDestroy() {
      this.isComponentActive = false;
   }

   setErrorMessage(errorMessage) {
      this.serviceError = errorMessage.message ? errorMessage.message : '';
      this.errorLinkText = errorMessage.linkText ? errorMessage.linkText : '';
      this.alertAction = errorMessage.alertAction;
      this.alertType = errorMessage.alertType;
   }

   onAlertLinkSelected(action: AlertActionType) {
      if (action) {
         switch (action) {
            case AlertActionType.TryAgain: {
               this.navigateNext(null);
               break;
            }
            case AlertActionType.ForgotDetails: {
               this.registerService.SetActiveView(View.ForgotPwdGetidentity, View.ForgotPwdResetoptions);
               break;
            }
            default: {
               break;
            }
         }
      }
   }

   navigateNext(event: any) {
      if (event != null) {
         event.preventDefault();
         event.stopPropagation();
      }
      if (this.isValid) {
         this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
         this.showLoader = true;

         this.registerService.recoverUsername(this.vm)
            .takeWhile(() => this.isComponentActive === true)
            .finally(() => {
               this.showLoader = false;
            })
            .subscribe(response => {
               if (response && response.MetaData) {
                  const resultType: ServiceResultType = this.enrolmentService.getServiceResultType(response.MetaData.ResultCode);

                  switch (resultType) {
                     case ServiceResultType.Success: {
                        this.registerService.userDetails.mobileNumber = this.vm.MobileNumber;
                        this.registerService.SetActiveView(View.ForgotPwdGetidentity, View.ForgotPwdShowUsername);
                        break;
                     }
                     case ServiceResultType.DataValidationError: {
                        this.setErrorMessage(ConstantsRegister.errorMessages.invalidDetails);
                        break;
                     }
                     case ServiceResultType.IncorrectCredentials: {
                        this.setErrorMessage(ConstantsRegister.errorMessages.loginInvalidDetails);
                        break;
                     }
                     case ServiceResultType.UnknownUser: {
                        this.setErrorMessage(ConstantsRegister.errorMessages.inputValidationError);
                        break;
                     }
                     case ServiceResultType.DuplicateIdentity: {
                        this.setErrorMessage(ConstantsRegister.errorMessages.duplicateIdentity);
                        break;
                     }
                     case ServiceResultType.InvalidCustomerDetails: {
                        this.setErrorMessage(ConstantsRegister.errorMessages.invalidCustomerDetails);
                        break;
                     }
                     case ServiceResultType.InvalidFeature: {
                        this.setErrorMessage(ConstantsRegister.errorMessages.invalidFeature);
                        break;
                     }
                     default: {
                        this.setErrorMessage(ConstantsRegister.errorMessages.systemError);
                        break;
                     }
                  }
               } else {
                  this.setErrorMessage(ConstantsRegister.errorMessages.systemError);
               }
            },
               error => {
                  this.showLoader = false;
               });
      }
   }

   changeIdType(type: string) {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
      this.vm.IdDetails.IdNumber = '';
      this.vm.MobileNumber = '';
      this.vm.IdDetails.IdType = type;
      this.getCountries();
      this.identityForm.reset();
   }

   onInputvalueChange(number) {
      this.setErrorMessage({ message: '', errorLinkText: '', alertAction: AlertActionType.None, alertType: AlertMessageType.Error });
      this.validate();
   }

   validate() {
      if (this.vm.IdDetails.IdType === this.idTypeRsaId) {
         this.isValid = this.validateIdNumber();
      } else {
         this.isValid = this.validatePassportNumber() && this.selectedCountryName !== '';
      }
      this.isValid = this.isValid && this.validateMobileNumber();
      this.isComponentValid.emit(this.isValid);
      this.registerService.makeFormDirty(this.identityForm.dirty);
   }

   validateMobileNumber() {
      const regEx = new RegExp(this.patterns.mobile);
      return regEx.test(this.vm.MobileNumber ? this.vm.MobileNumber.toString() : '');
   }

   validateIdNumber() {
      const regEx = new RegExp(this.patterns.number);
      const valid = regEx.test(this.vm.IdDetails.IdNumber ? this.vm.IdDetails.IdNumber.toString() : '');
      return valid && (this.vm.IdDetails.IdNumber.toString().length === 13);
   }

   validatePassportNumber() {
      if (this.vm.IdDetails.IdType === this.idTypePassport) {
         return this.vm.IdDetails.IdNumber && this.vm.IdDetails.IdNumber.toString().length >= 5;
      } else {
         return false;
      }
   }

   getCountries() {
      if (!this.countryList || this.countryList.length === 0) {
         this.showLoader = true;
         this.countryList = CountryList.items;
         this.showLoader = false;
      }
   }

   selectSouceType(selectedCountry) {
      this.countryChange(selectedCountry.item);
   }

   blurCountry(selectedCountry) {
      if (selectedCountry) {
         this.countryChange(selectedCountry.item);
      } else {
         this.clearCountry();
      }
   }

   noSourceResults($event) {
      this.noCountryData = $event;
   }

   private clearCountry() {
      this.selectedCountry = null;
      this.selectedCountryName = '';
   }

   private countryChange(country) {
      this.assignCountry(country);
   }

   private assignCountry(country: ICountry) {
      this.selectedCountry = country;
      this.selectedCountryName = country.name;
      this.vm.IdDetails.CountryCode = country.code;
      this.validate();
   }

   isCountryOpen() {
      return !!this.document.getElementById('country-name-list').getElementsByClassName('open').length;
   }

   onProfileKeyPress(event: any) {
      this.idPatternValid = true;
      if (event && event.charCode) {
         const inputValue = String.fromCharCode(event.charCode);
         if (!this.onVerifyInput(inputValue)) {
            this.idPatternValid = false;
         }
      }
   }
   onCellphonePress(event: any) {
      this.phonePatternValid = true;
      if (event && event.charCode) {
         const inputValue = String.fromCharCode(event.charCode);
         if (!this.onVerifyInput(inputValue)) {
            this.phonePatternValid = false;
         }
      }
   }
   onVerifyInput(inputValue: any) {
      let inputSuccess = true;
      try {
         const pattern = Constants.patterns.alphabet;
         if (pattern.test(inputValue)) {
            inputSuccess = false;
         }
      } catch (e) { }
      return inputSuccess;
   }

   onClearValidationErrors(event) {
      this.idPatternValid = true;
      this.phonePatternValid = true;
   }
}
