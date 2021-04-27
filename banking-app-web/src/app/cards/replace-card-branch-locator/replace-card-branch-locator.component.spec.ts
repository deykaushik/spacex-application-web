import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { HaversineService } from 'ng2-haversine';

import { assertModuleFactoryCaching } from './../../test-util';
import { HighlightPipe } from './../../shared/pipes/highlight.pipe';
import { ReplaceCardBranchLocatorComponent } from './replace-card-branch-locator.component';
import { CardService } from '../card.service';
import { ICardBlockResult, ICardBlockInfo } from '../models';

describe('ReplaceCardBranchLocatorComponent', () => {
   let component: ReplaceCardBranchLocatorComponent;
   let fixture: ComponentFixture<ReplaceCardBranchLocatorComponent>;

   const cardServiceStub = {
      cardLimitUpdateEmitter: new EventEmitter<boolean>(),
      cardBlockStatusEmitter: new EventEmitter<ICardBlockResult>(),
      retryCardBlockEmitter: new EventEmitter<ICardBlockInfo>(),
      replaceCardBranchLocatorEmitter: new EventEmitter(),
      replaceCardBranchSelector: jasmine.createSpy('replaceCardBranchSelector'),
      hideReplaceCardStatusEmitter: new EventEmitter<boolean>(),
      closeReplacePopUpEmitter: new EventEmitter<boolean>()
   };

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ReplaceCardBranchLocatorComponent, HighlightPipe],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         imports: [FormsModule, TypeaheadModule.forRoot()],
         providers: [
            { provide: CardService, useValue: cardServiceStub },
            HaversineService,
            MapsAPILoader
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ReplaceCardBranchLocatorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

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
   // test case 1
   it('should be created - Test case #1', () => {
      expect(component).toBeTruthy();
   });
   // test case 2
   it('should set is location is available - Test Case #2', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.isLocationAvailable = true;
         component.source = {};
         component.source.address = 'address';
         expect(component.isLocationAvailable).toBe(true);
      });
   });

   // test case 4
   it('should set current position - Test Case #4', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.isLocationAvailable = true;
         const mockLatLong = getMockLatLong();
         spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
            const position = { coords: { latitude: 12.3, longitude: -32.1 } };
            arguments[0](position);
         });
         component.ngOnInit();
         expect(component.currentPosition.latitude).toBe(12.3);
         expect(component.currentPosition.longitude).toBe(-32.1);
         expect(component.zoom).toBe(16);
      });
   });
   it('should set default position if geolocation have error', () => {
      spyOn(window.navigator.geolocation, 'getCurrentPosition').and.callFake(function () {
         const error = { code: 1 };
         arguments[1](error);
      });
      component.ngOnInit();
      expect(component.zoom).toBe(16);
   });
   // test case 5
   it('should be select source type data - Test Case #5', () => {
      fixture.whenStable().then(() => {
         fixture.detectChanges();
         component.selectLocation = getMockBranchData().item;
         component.selectSouceType.call(component, component.selectLocation);
         expect(component.selectLocation.longitude).toBe('18,420631');
         expect(component.selectLocation.latitude).toBe('-33,923431');
      });
   });

   it('should be no source data found', () => {
      fixture.whenStable().then(() => {
         expect(component.noSourceResults(true));
         expect(component.noSourceData).toBe(true);
      });
   });

   it('should be select source', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.selectSource.call(component, getMockBranchData());
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

   it('should be show replace card status', () => {
      fixture.whenStable().then(() => {
         fixture.detectChanges();
         component.selectLocation = getMockBranchData().item;
         component.source = {};
         component.source.address = 'address1';
         expect(component.showReplaceCardStatus()).toHaveBeenCalled();
      });
   });

   it('should set location is noy available', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.isLocationAvailable = false;
         component.showReplaceCardStatus();
         expect(component.isLocationAvailable).toBe(false);
      });
   });
   it('should set location is noy available', () => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.isLocationAvailable = false;
         component.setCurrentPosition();
         expect(component.isLocationAvailable).toBe(false);
      });
   });
   it('shouldnot be select source type data', () => {
      fixture.whenStable().then(() => {
         fixture.detectChanges();
         component.selectLocation = undefined;
         component.selectSouceType.call(component, component.selectLocation);
         expect(component.selectLocation.longitude).toBeUndefined();
         expect(component.selectLocation.latitude).toBeUndefined();
      });
   });
   it('should set delivery type on dropdown change', () => {
      component.onDeliveryChange(null, component.deliveryOptionsDropdown[1].value);
      expect(component.selectedDeliveryOption).toBe(component.deliveryOptionsDropdown[1].value);
   });
   it('should replace card for courier option', () => {
      component.cardInfo = {
         plasticId: 2,
         allowBranch: true,
         cardType: 'D',
         cardNumber: 'xxx',
         branchCode: '3434',
         branchName: 'ddgdfg',
         reason: 'lost'
      };
      component.onDeliveryChange(null, component.deliveryOptionsDropdown[1].value);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.showReplaceCardStatus();
         expect(cardServiceStub.replaceCardBranchSelector).toHaveBeenCalled();
      });
   });
   it('should replace card for nedbank option', () => {
      component.cardInfo = {
         plasticId: 2,
         allowBranch: true,
         cardType: 'D',
         cardNumber: 'xxx',
         branchCode: '3434',
         branchName: 'ddgdfg',
         reason: 'lost'
      };
      component.onDeliveryChange(null, component.deliveryOptionsDropdown[0].value);
      component.isLocationAvailable = true;
      component.source = {};
      component.source.address = 'address';
      component.selectLocation = getMockBranchData();
      component.showReplaceCardStatus();
      expect(cardServiceStub.replaceCardBranchSelector).toHaveBeenCalled();
   });

   it('should blank the location field on close of pop up success', inject([CardService], (service: CardService) => {
      service.hideReplaceCardStatusEmitter.emit(false);
      expect(component.source.address).toEqual('');
   }));

   it('should blank the location field on close of pop up failure', inject([CardService], (service: CardService) => {
      service.closeReplacePopUpEmitter.emit(false);
      expect(component.source.address).toEqual('');
   }));

});
