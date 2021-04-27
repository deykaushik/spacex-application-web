import { MapsAPILoader } from '@agm/core';
import { element } from 'protractor';
import { OnInit, Component, ViewChild, Injector } from '@angular/core';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { HaversineService, GeoCoord } from 'ng2-haversine';
import { CommonUtility } from './../core/utils/common';
import { Constants } from './../core/utils/constants';
import { IATMDetail, IBranchDetail, IMarker } from './../core/services/models';
import { IBranchLocatorOptions } from './../core/utils/models';
import { debug } from 'util';
import { LoaderService } from '../core/services/loader.service';
import { BaseComponent } from '../core/components/base/base.component';

@Component({
   selector: 'app-branch-locator',
   templateUrl: './branch-locator.component.html',
   styleUrls: ['./branch-locator.component.scss']
})

export class BranchLocatorComponent extends BaseComponent implements OnInit {
   markerClusterStyle: any;
   isLocationAvailable = false;
   showSingleBranch = false;
   noSourceData = true;
   address: string;
   zoom: number;
   source: IATMDetail[] | IBranchDetail[];
   cloneSource: any;
   markers: IMarker[];
   currentPosition: IMarker;
   isBranch = true;
   branchLocatorOptions = CommonUtility.covertToDropdownObject(Constants.VariableValues.branchLocator);
   selectedBranchOption: IBranchLocatorOptions = this.branchLocatorOptions[0].value;
   branchMarkers = [];
   atmMarkers = [];

   constructor(private mapsAPILoader: MapsAPILoader,
      public haversineService: HaversineService, private loader: LoaderService, injector: Injector) {
      super(injector);
   }
   ngOnInit() {
      this.address = '';
      this.markerClusterStyle = CommonUtility.getMarkerClusterStyle();
      this.source = CommonUtility.onBranchLocatorOptionChanged(this.selectedBranchOption);
      this.cloneSource = CommonUtility.removeDuplicate(this.source.slice(0));
      this.currentPosition = {
         latitude: Constants.mapVariables.defaultGeoCoords.latitude,
         longitude: Constants.mapVariables.defaultGeoCoords.longitude
      };
      this.isLocationAvailable = this.getDeviceLocation();
      this.markers = [];
      this.setCurrentPosition();
   }

   setCurrentPosition() {
      const isBranch = this.selectedBranchOption.text.toLowerCase() === Constants.VariableValues.branchLocator.branch.text.toLowerCase();
      this.isBranch = isBranch;

      if (this.isLocationAvailable) {
         const positions = window.navigator.geolocation.getCurrentPosition((position) => {
            this.currentPosition = position.coords;
            this.atmMarkers = CommonUtility.getAtmMarkers();
            this.branchMarkers = CommonUtility.getBranchMarkers();
            this.zoom = Constants.mapVariables.defaultZoomLevel;
         }, (error) => {
            this.currentPosition = {
               latitude: Constants.mapVariables.defaultGeoCoords.latitude,
               longitude: Constants.mapVariables.defaultGeoCoords.longitude
            };
            this.atmMarkers = CommonUtility.getAtmMarkers();
            this.branchMarkers = CommonUtility.getBranchMarkers();
            this.zoom = Constants.mapVariables.defaultZoomLevel;
         });
      } else {
         this.markers = [];
      }
   }

   resetLocation() {
      if (this.isLocationAvailable) {
         const positions = window.navigator.geolocation.getCurrentPosition((position) => {
            this.currentPosition = position.coords;
         }, (error) => {
            this.currentPosition = {
               latitude: Constants.mapVariables.defaultGeoCoords.latitude,
               longitude: Constants.mapVariables.defaultGeoCoords.longitude
            };
         });
      }
   }

   getDeviceLocation() {
      return ('geolocation' in window.navigator);
   }

   selectSouceType(source) {
      this.markers = [];
      let event = Constants.GAEventList.searchAtm.category,
         label = Constants.GAEventList.searchAtm.label;
      if (this.isBranch) {
         event = Constants.GAEventList.searchBranch.category;
         label = Constants.GAEventList.searchBranch.label;
      }
      const selectedSource = CommonUtility.selectSourceType(source);
      this.currentPosition = selectedSource.currentLocationLatLng;
      this.zoom = Constants.mapVariables.defaultZoomLevel;
      this.sendEvent(event, label, this.currentPosition.address);
      this.populateMarkers();
   }

   onBranchLocatorOptionChanged(branchLocatorOption: IBranchLocatorOptions) {
      this.sendEvent(Constants.GAEventList.selectAtm.category, Constants.GAEventList.selectAtm.label, branchLocatorOption.text);
      this.address = '';
      this.selectedBranchOption = branchLocatorOption;
      this.source = CommonUtility.onBranchLocatorOptionChanged(branchLocatorOption);
      this.cloneSource = CommonUtility.removeDuplicate(this.source.slice(0));
      this.populateMarkers();
   }

   populateMarkers() {
      this.loader.show();
      setTimeout(() => {
         this.isBranch = this.selectedBranchOption.text.toLowerCase() === Constants.VariableValues.branchLocator.branch.text.toLowerCase();
         this.loader.hide();
      }, 50);
   }

   noSourceResults(event) {
      this.noSourceData = event;
   }

   blurSource(selected) {
      if (selected && selected.item) {
         this.selectSouceType(selected);
      }
   }
}
