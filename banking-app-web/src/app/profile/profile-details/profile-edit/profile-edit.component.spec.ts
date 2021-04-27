import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../../test-util';
import { ProfileEditComponent } from './profile-edit.component';
import { ProfileService } from '../../profile.service';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../../../core/services/api.service';
import { IClientDetails, IClientPreferenceDetails } from '../../../core/services/models';


describe('ProfileEditComponent', () => {
   let component: ProfileEditComponent;
   let fixture: ComponentFixture<ProfileEditComponent>;
   const updatedName = 'abc';
   function getClientDetails(): IClientDetails {
      return {
         CisNumber: 110282180605,
         FirstName: 'Marc',
         SecondName: '',
         Surname: 'Schutte',
         FullNames: 'Mr Marc Schutte',
         CellNumber: '+27992180605',
         EmailAddress: '',
         BirthDate: '1977-03-04T22:00:00Z',
         FicaStatus: 701,
         SegmentId: 'AAAZZZ',
         IdOrTaxIdNo: 7703055072088,
         SecOfficerCd: '36407',
         AdditionalPhoneList: [
            {
               AdditionalPhoneType: 'BUS',
               AdditionalPhoneNumber: '(086) 1828828'
            },
            {
               AdditionalPhoneType: 'CELL',
               AdditionalPhoneNumber: '+27992180605'
            },
            {
               AdditionalPhoneType: 'HOME',
               AdditionalPhoneNumber: '(078) 2228519'
            }
         ],
         Address: {
            AddressLines: [
               {
                  AddressLine: 'G12 KYLEMORE'
               },
               {
                  AddressLine: 'THE MARINA RESIDENTS DOCK ROAD'
               },
               {
                  AddressLine: 'WATERFRONT'
               }
            ],
            AddressCity: 'CAPE TOWN',
            AddressPostalCode: '08001'
         }
      };
   }

   function getClientPreferences(): IClientPreferenceDetails[] {
      return [
         {
            PreferenceKey: 'PreferredName',
            PreferenceValue: 'Heineken'
         }
      ];
   }

   let _getClientDetails, _getClientPreferences, _saveClientPreferences,
      mockClientDetailsData: IClientDetails,
      mockClientPreferencesData: IClientPreferenceDetails[];

   mockClientDetailsData = getClientDetails();
   mockClientPreferencesData = getClientPreferences();
   _getClientDetails = jasmine.createSpy('getClientDetails').and.returnValue(Observable.of({ data: [mockClientDetailsData] }));
   _getClientPreferences = jasmine.createSpy('getClientPreferences').and.returnValue(Observable.of(mockClientPreferencesData));
   _saveClientPreferences = jasmine.createSpy('saveClientPreferences').and.returnValue(Observable.of('OK'));
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         declarations: [ProfileEditComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [ProfileService,
            {
               provide: ApiService, useValue: {
                  clientDetails: {
                     getAll: _getClientDetails
                  },
                  clientPreferences: {
                     getAll: _getClientPreferences,
                     create: _saveClientPreferences
                  }
               }
            }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ProfileEditComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should handle onCancelClick click', fakeAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onCancelClick();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.updatePreferredNameWidget).toBeFalsy();
            expect(component.viewPreferredNameWidget).toBeTruthy();
         });
      });
   }));
   it('should handle onEditClick click', fakeAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.preferredName = 'Tese Name ';
         component.onEditClick();
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.viewPreferredNameWidget).toBeFalsy();
            expect(component.updatePreferredNameWidget).toBeTruthy();
         });
      });
   }));
   it('should handle disabled update button click', fakeAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.preferredName = undefined;
         component.disabledSubmit(component.preferredName);
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.viewPreferredNameWidget).toBeTruthy();
            expect(component.updatePreferredNameWidget).toBeFalsy();
         });
      });
   }));
   it('should handle enabled update button click', fakeAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.preferredName = 'test';
         component.disabledSubmit(component.preferredName);
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(component.viewPreferredNameWidget).toBeTruthy();
            expect(component.updatePreferredNameWidget).toBeFalsy();
         });
      });
   }));
   it('should handle onUpdate click', fakeAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onUpdateClick(updatedName);
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(_saveClientPreferences).toHaveBeenCalled();
            expect(component.updatePreferredNameWidget).toBeFalsy();
            expect(component.viewPreferredNameWidget).toBeTruthy();
         });
      });
   }));
   it('should handle client preference', fakeAsync(() => {
      component.clientPreference = getClientPreferences()[0];
      component.onUpdateClick(updatedName);
   }));

   it('should handle onUpdate click', fakeAsync(() => {
      const service = TestBed.get(ApiService);
      service.clientPreferences.create = jasmine.createSpy('clientPreferences')
         .and.returnValue(Observable.of('NOT OK'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onUpdateClick(updatedName);
         fixture.detectChanges();
         fixture.whenStable().then(() => {
            expect(_saveClientPreferences).toHaveBeenCalled();
            expect(component.updatePreferredNameWidget).toBeFalsy();
            expect(component.viewPreferredNameWidget).toBeTruthy();
         });
      });
   }));
   it('should handle onUpdate click when there is no data', fakeAsync(() => {
      const service = TestBed.get(ApiService);
      service.clientPreferences.create = jasmine.createSpy('clientPreferences')
         .and.returnValue(Observable.of('NOT OK'));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
         component.onUpdateClick('');
         fixture.detectChanges();
      });
   }));
});
