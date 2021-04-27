import { OnInit, Component, Input, AfterViewInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

import { HaversineService, GeoCoord } from 'ng2-haversine';
import { CommonUtility } from './../../core/utils/common';
import { Constants } from './../../core/utils/constants';
import { IBranchDetail, IMarker, IReplaceCardPayload } from './../../core/services/models';
import { CardService } from '../card.service';
import { ICardReplaceInfo, ICardReplaceResult } from '../models';

import * as branchData from './../../../assets/branches.json';
import { NgForm } from '@angular/forms';

@Component({
   selector: 'app-branch-locator',
   templateUrl: './replace-card-branch-locator.component.html',
   styleUrls: ['./replace-card-branch-locator.component.scss']
})
export class ReplaceCardBranchLocatorComponent implements OnInit, AfterViewInit {

   @Input() cardInfo: ICardReplaceInfo;
   @ViewChild('deliveryForm') deliveryForm: NgForm;

   cardReplaceInfo: ICardReplaceResult;
   public zoom: number;
   public source;
   public isLocationAvailable = false;
   public selectLocation = null;
   markerClusterStyle: any;
   defaultZoomLevel = Constants.VariableValues.defaultZoomLevel;
   noSourceData = true;
   address: string;
   markers: IMarker[];
   currentPosition: IMarker;
   cloneSource: any;
   messages = Constants.messages;
   deliveryOptions = Constants.VariableValues.deliveryOptions;
   branchLocatorOptions = CommonUtility.covertToDropdownObject(Constants.VariableValues.branchLocator);
   deliveryOptionsDropdown = CommonUtility.covertToDropdownObject(this.deliveryOptions);
   selectedDeliveryOption = this.deliveryOptionsDropdown[0].value;
   isValid = false;
   showloader = false;
   constructor(private mapsAPILoader: MapsAPILoader, private cardService: CardService,
      public haversineService: HaversineService) {
   }

   ngOnInit() {
      // static data(from json) for atm and branch
      this.address = '';
      this.source = branchData['branches'];
      this.source.forEach(bankSource => {
         bankSource.fullAddress = bankSource.address + ','
            + bankSource.suburb + ',' + bankSource.town + ',' + bankSource.province;
      });
      this.markerClusterStyle = CommonUtility.getMarkerClusterStyle();
      this.currentPosition = {
         latitude: Constants.mapVariables.defaultGeoCoords.latitude,
         longitude: Constants.mapVariables.defaultGeoCoords.longitude
      };
      this.isLocationAvailable = this.getDeviceLocation();
      this.markers = [];
      this.cloneSource = CommonUtility.removeDuplicate(this.source.slice(0));
      this.setCurrentPosition();
      // blank ng model of address on close of pop up
      this.cardService.hideReplaceCardStatusEmitter.subscribe(status => {
         this.source.address = '';
      });
      this.cardService.closeReplacePopUpEmitter.subscribe(status => {
         this.source.address = '';
      });
   }
   onDeliveryChange($event, deliveryOption) {
      this.selectedDeliveryOption = deliveryOption;
   }
   getDeviceLocation() {
      return ('geolocation' in window.navigator);
   }
   ngAfterViewInit() {
      this.deliveryForm.valueChanges
         .subscribe(values => this.validate());
   }

   validate() {
      if (this.selectedDeliveryOption.code === this.deliveryOptions.nedbankBranch.code) {
         this.isValid = (this.selectLocation && this.source && this.source.address && this.source.address.length !== 0);
      } else {
         this.isValid = true;
      }
   }
   setCurrentPosition() {
      if (this.isLocationAvailable) {
         const positions = window.navigator.geolocation.getCurrentPosition((position) => {
            this.currentPosition = position.coords;
            this.markers = CommonUtility.populateNearByATMS(
               Constants.VariableValues.branchLocator.branch, true, this.currentPosition,
               this.haversineService);
            this.zoom = Constants.mapVariables.defaultZoomLevel;
         }, (error) => {
            this.currentPosition = {
               latitude: Constants.mapVariables.defaultGeoCoords.latitude,
               longitude: Constants.mapVariables.defaultGeoCoords.longitude
            };
            this.markers = CommonUtility.populateNearByATMS(
               Constants.VariableValues.branchLocator.branch, true, this.currentPosition,
               this.haversineService);
            this.zoom = Constants.mapVariables.defaultZoomLevel;
         });
      } else {
         this.markers = [];
      }
   }

   selectSouceType(source) {
      this.markers = [];
      const selectedSource = CommonUtility.selectSourceType(source);

      this.currentPosition = selectedSource.currentLocationLatLng;
      this.zoom = selectedSource.zoom;
      // this.markers = selectedSource.markers;
      this.markers = CommonUtility.populateNearByATMS(Constants.VariableValues.branchLocator.branch, true, this.currentPosition,
         this.haversineService);
      this.selectLocation = source;
      this.cloneSource = CommonUtility.removeDuplicate(this.source.slice(0));
      this.validate();
   }

   noSourceResults(event) {
      this.noSourceData = event;
   }

   selectSource(source) {
      this.selectSouceType(source);
   }

   blurSource(source) {
      if (source && source.item) {
         this.selectSouceType(source);
      }
   }

   showReplaceCardStatus() {
      if (this.selectedDeliveryOption.code === this.deliveryOptions.nedbankBranch.code
         && this.selectLocation && this.source && this.source.address) {
         const payload: IReplaceCardPayload = {
            cardnumber: this.cardInfo.cardNumber.replace(/ /g, ''),
            reason: this.cardInfo.reason,
            branchcode: this.selectLocation.item.code,
            branchName: this.selectLocation.item.name,
            isCourier: false
         };
         this.showloader = true;
        this.cardService.replaceCardBranchSelector(payload, null, this.cardInfo.plasticId);
      } else if (this.selectedDeliveryOption.code === this.deliveryOptions.courier.code) {
         const payloadCourier: IReplaceCardPayload = {
            cardnumber: this.cardInfo.cardNumber.replace(/ /g, ''),
            reason: this.cardInfo.reason,
            branchcode: Constants.VariableValues.courierCode.toString(),
            branchName: '',
            isCourier: true,
            allowBranch: this.cardInfo.allowBranch
         };
         this.showloader = true;
         this.cardService.replaceCardBranchSelector(payloadCourier, null, this.cardInfo.plasticId);
      }
   }
}
