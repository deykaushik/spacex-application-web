import { Component, OnInit, Input, EventEmitter, Output, Renderer2, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AccountService } from '../../../account.service';
import { IStatementPreferences, IPostalCode } from '../../../../core/services/models';
import { StatementPreferencesConstants } from '../../statement-preferences-constants';
import { Constants } from '../../../../core/utils/constants';

@Component({
   selector: 'app-edit-postal-address',
   templateUrl: './edit-postal-address.component.html',
   styleUrls: ['./edit-postal-address.component.scss']
})
export class EditPostalAddressComponent implements OnInit {

   constants = Constants.VariableValues;
   labels = StatementPreferencesConstants.labels;
   values = StatementPreferencesConstants.values;
   informations = StatementPreferencesConstants.informations;
   variableValues = StatementPreferencesConstants.variableValues;
   @Input() statementPreferencesDetails: IStatementPreferences;
   @Output() changeStatementPreferencesDetails = new EventEmitter<IStatementPreferences>();
   @Input() isEditAddress: boolean;
   @Output() changeIsEditAddress = new EventEmitter<boolean>();
   isdebitOrderPayer: boolean;
   isdropdownOpen: boolean;
   isSuburbFocus: boolean;
   showLoader: boolean;
   postalCodes: IPostalCode[];
   cities: string[];
   noSuburbSuggestions: boolean;
   isOneCity: boolean;
   city: string;
   postalCode: string;
   addressLine0: string;
   addressLine1: string;
   addressLine2: string;
   isAddressLine0Valid: boolean;
   isAddressLine1Valid: boolean;
   isFormValid: boolean;
   selectedPostalAddress: IPostalCode;

   constructor(private accountService: AccountService, private render: Renderer2) {
   }

   ngOnInit() {
      this.isSuburbFocus = false;
      this.isdropdownOpen = false;
      this.isdebitOrderPayer = false;
      this.showLoader = false;
      this.isOneCity = false;
      this.isFormValid = false;
      this.selectedPostalAddress = {} as IPostalCode;
      this.isAddressLine0Valid = false;
      this.isAddressLine1Valid = false;
      this.postalCodes = [] as IPostalCode[];
      if (this.statementPreferencesDetails) {
         if (this.statementPreferencesDetails.paymentMethod === this.values.debitOrderPayer) {
            this.isdebitOrderPayer = true;
         }
         if (this.statementPreferencesDetails.postalAddress && this.statementPreferencesDetails.postalAddress.city
            && this.statementPreferencesDetails.postalAddress.postalCd) {
            this.city = this.statementPreferencesDetails.postalAddress.city;
            this.isOneCity = true;
            this.postalCode = this.statementPreferencesDetails.postalAddress.postalCd;
         } else {
            this.city = '';
            this.postalCode = '';
         }
         if (this.statementPreferencesDetails.postalAddress.addrLines) {
            this.addressLine0 = this.statementPreferencesDetails.postalAddress.addrLines[0] ?
               this.statementPreferencesDetails.postalAddress.addrLines[0] : '';
            this.addressLine1 = this.statementPreferencesDetails.postalAddress.addrLines[1] ?
               this.statementPreferencesDetails.postalAddress.addrLines[1] : '';
            this.addressLine2 = this.statementPreferencesDetails.postalAddress.addrLines[2] ?
               this.statementPreferencesDetails.postalAddress.addrLines[2] : '';
         }
         if (this.city && this.addressLine2 && this.postalCode) {
            this.selectedPostalAddress.city = this.city;
            this.selectedPostalAddress.postalCode = '0' + this.postalCode;
            this.selectedPostalAddress.suburb = this.addressLine2;
            this.postalCodes.push(this.selectedPostalAddress);
         }
      }
      this.render.setStyle(document.body, 'overflow-y', 'hidden');
   }

   // to get all the postal address
   getPostalCodes(event) {
      if (event.target.value.length < 3) {
         this.postalCodes = [];
         this.addressLine2 = event.target.value;
      } else if (event.target.value.length === 3) {
         this.showLoader = true;
         this.accountService.getPostalCodes(this.values.street, event.target.value).subscribe((response: IPostalCode[]) => {
            this.postalCodes = response;
            this.showLoader = false;
            const suburbElement: HTMLElement = document.getElementById('suburb') as HTMLElement;
            if (suburbElement !== null) {
               suburbElement.click();
            }
            if (this.postalCodes.length === 0) {
               this.addressLine2 = event.target.value;
            }
         });
      }
   }
   clearSuburbInfo() {
      delete this.addressLine2;
      delete this.city;
      delete this.postalCode;
      delete this.cities;
   }

   clearField() {
      this.postalCodes = [];
      this.clearSuburbInfo();
   }

   assignSuburb(selectedSuburb: any) {
      this.addressLine2 = selectedSuburb.item.suburb;
      this.city = selectedSuburb.item.city;
      this.postalCode = selectedSuburb.item.postalCode.substr(1);
      this.cities = [];
      this.isSuburbFocus = false;
      this.postalCodes.forEach(postalCode => {
         if (postalCode.suburb === selectedSuburb.item.suburb) {
            this.cities.push(postalCode.city);
         }
      });
      if (this.cities.length === 1) {
         this.isOneCity = true;
         this.city = this.cities[0];
         this.postalCodes.forEach(postalCode => {
            if (postalCode.suburb === this.addressLine2
               && postalCode.city === this.city) {
               this.postalCode = postalCode.postalCode.substr(1);
            }
         });
      } else {
         this.isOneCity = false;
      }
   }

   selectSuburb(selectedSuburb: any) {
      this.clearSuburbInfo();
      this.assignSuburb(selectedSuburb);
   }

   blurSuburb(selection: any) {
      if (selection && selection.item && selection.item.suburb) {
         this.city = '';
         this.postalCode = '';
         this.assignSuburb(selection);
      } else {
         this.clearSuburbInfo();
      }
   }

   clearSuburbSuggestion(event: boolean) {
      this.noSuburbSuggestions = event;
      this.isSuburbFocus = true;
   }

   blurSuburbInput() {
      if (this.noSuburbSuggestions) {
         this.clearSuburbInfo();
      }
   }

   onCityClicked() {
      this.isdropdownOpen = true;
   }

   onCitySelect(city) {
      this.city = city;
      this.postalCodes.forEach(postalCode => {
         if (postalCode.suburb === this.addressLine2
            && postalCode.city === city) {
            const code = postalCode.postalCode.substr(1);
            this.postalCode = code;
         }
      });
   }

   // to emit the statement prefernces postal details
   updateStatementPreferencesPostalAddress(editChange) {
      if (!editChange) {
         this.statementPreferencesDetails.postalAddress.addrLines[0] = this.addressLine0;
         this.statementPreferencesDetails.postalAddress.addrLines[1] = this.addressLine1;
         this.statementPreferencesDetails.postalAddress.addrLines[2] = this.addressLine2;
         this.statementPreferencesDetails.postalAddress.city = this.city;
         this.statementPreferencesDetails.postalAddress.postalCd = this.postalCode;
         this.changeStatementPreferencesDetails.emit(this.statementPreferencesDetails);
         this.onClose(false);
      }
   }
   onClose(event) {
      this.isEditAddress = event;
      this.render.setStyle(document.body, 'overflow-y', 'auto');
      this.changeIsEditAddress.emit(this.isEditAddress);
   }
   isCityDisable() {
      this.isdropdownOpen = this.isOneCity ? false : true;
      return this.isOneCity;
   }
   validateAddressLine0(addressLine0) {
      this.addressLine0 = addressLine0.trim();
      this.isAddressLine0Valid = this.addressLine0 === '';
   }
   validateAddressLine1(addressLine1) {
      this.addressLine1 = addressLine1.trim();
      this.isAddressLine1Valid = addressLine1 ? false : true;
   }
   isDisable(event) {
      this.isFormValid = event;
      return this.isFormValid;
   }
}
