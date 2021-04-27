import { HeaderMenuService } from './../../core/services/header-menu.service';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProfileDetailsComponent } from './profile-details.component';
import { Observable } from 'rxjs/Observable';
import { IClientDetails, IClientPreferenceDetails } from '../../core/services/models';
import { ClientProfileDetailsService } from '../../core/services/client-profile-details.service';
import { Subject } from 'rxjs/Subject';
import { IEditClientProfileEmitter } from '../profile.models';

const mockEditProfileEmitterData: IEditClientProfileEmitter = {
   Status: false, PreferredName: 'Text'
};

const clientdetailSubject = new Subject();
const updateClientDetailsData = jasmine.createSpy('updateClientDetailsData').and.callFake(data => {
   clientdetailSubject.next(data);
});


describe('ProfileDetailsComponent', () => {
   let component: ProfileDetailsComponent;
   let fixture: ComponentFixture<ProfileDetailsComponent>;

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
         PreferredName: 'Marc',
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


   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [HeaderMenuService, {
            provide: ClientProfileDetailsService, useValue: {
               clientDetailsObserver: clientdetailSubject,
               updateClientDetailsData: updateClientDetailsData,
               getClientPreferenceDetails: jasmine.createSpy('getClientPreferenceDetails').and.returnValue([])
            },
         }],
         schemas: [NO_ERRORS_SCHEMA],
         declarations: [ProfileDetailsComponent]
      });
   });

   beforeEach(() => {
      fixture = TestBed.createComponent(ProfileDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should Manage updateClientPreferredName', () => {
      component.updateClientPreferredName(mockEditProfileEmitterData);
      expect(component.isFailure).toBeFalsy();
      clientdetailSubject.next(getClientDetails());
      const client = getClientDetails();
      delete client.PreferredName;
      clientdetailSubject.next(client);
      mockEditProfileEmitterData.Status = true;
      component.updateClientPreferredName(mockEditProfileEmitterData);
      expect(component.isFailure).toBeFalsy();
   });
   it('should listen to client detail observer', () => {
      expect(component).toBeTruthy();
      clientdetailSubject.next(null);
   });
   it('should close SuccessError', () => {
      component.closeSuccessError();
      expect(component.isSuccess).toBeFalsy();
   });
   it('should close FailureError', () => {
      component.closeFailureError();
      expect(component.isFailure).toBeFalsy();
   });
   it('Should open Profile Details  on mobile back button', inject([HeaderMenuService], (service: HeaderMenuService) => {
      service.headerMenuOpener().subscribe((menuText) => {
         expect(menuText).toBe('Your profile');
      });
      component.openProfileMenu('Your profile');
   }));
});

