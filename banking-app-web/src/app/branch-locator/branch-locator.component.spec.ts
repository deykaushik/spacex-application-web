import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { async, ComponentFixture, TestBed, } from '@angular/core/testing';
import { HaversineService } from 'ng2-haversine';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { assertModuleFactoryCaching } from './../test-util';
import { HighlightPipe } from './../shared/pipes/highlight.pipe';
import { Constants } from './../core/utils/constants';
import { CommonUtility } from './../core/utils/common';
import { IBranchLocatorOptions } from '../core/utils/models';
import { LoaderService } from '../core/services/loader.service';
import { GaTrackingService } from '../core/services/ga.service';

import { BranchLocatorComponent } from './branch-locator.component';

const gaTrackingServiceStub = {
   sendEvent: jasmine.createSpy('sendEvent').and.returnValue({}),
   gtag: jasmine.createSpy('gtag').and.returnValue({}),
};

describe('BranchLocatorComponent', () => {
   let component: BranchLocatorComponent;
   let fixture: ComponentFixture<BranchLocatorComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            BranchLocatorComponent,
            HighlightPipe
         ],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [
            FormsModule,
            TypeaheadModule.forRoot()
         ],
         providers: [
            HaversineService,
            LoaderService,
            MapsAPILoader,
            { provide: GaTrackingService, useValue: gaTrackingServiceStub }
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(BranchLocatorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   const atmData = {
      atms: [
         {
            id: '0383',
            name: 'Nedbank Irene Mall',
            brand: 'Nedbank',
            type: 'Intelligent Depositor',
            depositIndicator: 'Yes',
            longitude: '28,250469',
            latitude: '-25,861847',
            address: 'Shop 95, Irene Mall Village, Cnr Nelmapius Avenue And Ryneveld Drive',
            suburb: 'Irene Farm Villages',
            town: 'Centurion',
            province: 'Gauteng'
         }]
   };

   function getAtms() {
      return [
         {
            id: '0383',
            name: 'Nedbank Irene Mall',
            brand: 'Nedbank',
            type: 'Intelligent Depositor',
            depositIndicator: 'Yes',
            longitude: '28,250469',
            latitude: '-25,861847',
            address: 'Shop 95, Irene Mall Village, Cnr Nelmapius Avenue And Ryneveld Drive',
            suburb: 'Irene Farm Villages',
            town: 'Centurion',
            province: 'Gauteng'
         }];
   }

   function getBranches() {
      return [
         {
            id: '0383',
            name: 'Nedbank Irene Mall',
            brand: 'Nedbank',
            type: 'Intelligent Depositor',
            depositIndicator: 'Yes',
            longitude: '28,250469',
            latitude: '-25,861847',
            address: 'Shop 95, Irene Mall Village, Cnr Nelmapius Avenue And Ryneveld Drive',
            suburb: 'Irene Farm Villages',
            town: 'Centurion',
            province: 'Gauteng'
         }];
   }
   function getBranchOrAtmOptionData(): IBranchLocatorOptions[] {
      return [{
         maxValue: 2,
         text: 'ATM',
         code: 'atm'
      },
      {
         maxValue: 1,
         text: 'Branch',
         code: 'branch'
      }];
   }

   function getMockBranchData(): any {
      return {
         item: {
            longitude: '18,420631',
            latitude: '-33,923431',
            code: 9,
            clearingCode: 100909,
            name: 'Nedbank St Georges Mall',
            bank: 'NEDBANK',
            type: 'MAIN',
            generatorInd: 'Yes',
            forexService: 'Yes',
            telephone: '(021) 469-9500',
            fax: '(021) 469-9533',
            email: 'capetownbm@nedbank.co.za',
            address: 'Longmarket St, St Georges Mall',
            suburb: 'Cape Town City Centre',
            town: 'Cape Town',
            province: 'Western Cape',
            postalCode: 2000,
            operatingHours: 'Standard Operating Hours',
            monday: '08:30 -16:00 ',
            tuesday: '09:00 -16:00 ',
            wednesday: '09:00 -16:00 ',
            thursday: '09:00 -16:00 ',
            friday: '08:30 -16:00 ',
            saturday: '08:30 -12:00 ',
            sunday: 'Closed',
            cardUplift: 'Yes'
         }
      };
   }
   function getMockLatLong(): any {
      return {
         position: {
            coords: {
               longitude: 18.420631,
               latitude: -33.923431
            }
         }
      };
   }

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should be no source data found', () => {
      fixture.whenStable().then(() => {
         spyOn(component, 'getDeviceLocation').and.returnValue(true);
         expect(component.source).toBe(CommonUtility.onBranchLocatorOptionChanged(component.selectedBranchOption));
         expect(component.isLocationAvailable).toBe(true);
         expect(component.markers).toBeDefined();
      });
   });

   it('should populate atms and branches if position is found and within 2 kms', () => {
      const mockLatLong = getMockLatLong();
      spyOn(component.haversineService, 'getDistanceInKilometers').and.returnValue(2);
      spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
         const position = { coords: { latitude: 12.3, longitude: -32.1 } };
         arguments[0](position);
      });

      component.ngOnInit();
      expect(component.zoom).toBe(Constants.mapVariables.defaultZoomLevel);
      expect(component.markers).toBeDefined();
   });

   it('should not populate atms and branches if position is not found and within 2 kms', () => {
      const mockLatLong = getMockLatLong();
      spyOn(component.haversineService, 'getDistanceInKilometers').and.returnValue(4);
      spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
         const position = { coords: { latitude: 12.3, longitude: -32.1 } };
         arguments[0](position);
      });

      component.ngOnInit();
      expect(component.currentPosition.latitude).toBe(12.3);
      expect(component.currentPosition.longitude).toBe(-32.1);
      expect(component.zoom).toBe(16);
      expect(component.markers).toBeDefined();
   });

   it('should not populate atms and branches if position is not found', () => {
      spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
         const error = { code: 1 };
         arguments[1](error);
      });
      spyOn(component.haversineService, 'getDistanceInKilometers').and.returnValue(2);
      component.ngOnInit();
      expect(component.markers).toBeDefined();
      expect(component.zoom).toBe(16);
   });

   it('should be select source', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.noSourceResults(true));
         expect(component.noSourceData).toBe(true);
      });
   });

   it('should be blur source', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.blurSource(getMockBranchData());
         expect(component.currentPosition.longitude).toBe(18.420631);
         expect(component.currentPosition.latitude).toBe(-33.923431);
         expect(component.zoom).toBe(16);
         component.blurSource(null);
      });
   });

   it('should be on branch or atm  as source selection', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.onBranchLocatorOptionChanged(getBranchOrAtmOptionData()[0]));
         expect(component.selectedBranchOption.text.toLowerCase()).toBe('atm');
      });
   });

   it('should be on branch or atm  as source selection', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         expect(component.onBranchLocatorOptionChanged(getBranchOrAtmOptionData()[1]));
         expect(component.selectedBranchOption.text.toLowerCase()).toBe('branch');
      });
   });

   it('should be select source type data', () => {
      fixture.whenStable().then(() => {
         component.selectSouceType.call(component, getMockBranchData());
         expect(component.currentPosition.longitude).toBe(18.420631);
         expect(component.currentPosition.latitude).toBe(-33.923431);
         expect(component.zoom).toBe(16);
      });
   });

   it('should not show any atm or branch if location is unavailable', () => {
      component.isLocationAvailable = false;
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.setCurrentPosition();
         component.resetLocation();
         expect(component.markers.length).toBe(0);
      });
   });

   it('should try populating markers for branch and atm scenario', () => {

      component.selectedBranchOption = {
         code: 'branch',
         maxValue: null,
         text: 'branch'
      };
      component.populateMarkers();
      expect(component.isBranch).toBeFalsy();

      component.selectedBranchOption = {
         code: 'atm',
         maxValue: null,
         text: 'atm'
      };
      component.populateMarkers();
      expect(component.isBranch).toBeFalsy();
   });
   it('should reset postion ', () => {
      const mockLatLong = getMockLatLong();
      spyOn(component.haversineService, 'getDistanceInKilometers').and.returnValue(4);
      spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
         const position = { coords: { latitude: 12.3, longitude: -32.1 } };
         arguments[0](position);
      });
      component.resetLocation();
      expect(component.currentPosition.latitude).toBe(12.3);
      expect(component.currentPosition.longitude).toBe(-32.1);
   });

   it('should reset location to default atm or branch if location is unavailable', () => {
      spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
         const error = { code: 1 };
         arguments[1](error);
      });
      spyOn(component.haversineService, 'getDistanceInKilometers').and.returnValue(2);
      fixture.whenStable().then(() => {
         component.setCurrentPosition();
         component.resetLocation();
         expect(component.markers.length).toBe(0);
      });
   });


});
