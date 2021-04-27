import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChild, NO_ERRORS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../../test-util';
import { ContactDetailsComponent } from './contact-details.component';
import { MobileNumberMaskPipe } from './../../../shared/pipes/mobile-number-mask.pipe';

@Component({
   template: ' <app-contact-details *ngIf="profileDetails" [profileDetails]="profileDetails"></app-contact-details>',
})
class TestHostComponent {
   profileDetails;
   @ViewChild(ContactDetailsComponent) /* using viewChild we get access to the TestComponent which is a child of TestHostComponent */
   public ContactDetailsComponent: any;
}


function getMockProfileDetails() {
   return {
      FullNames: 'Marc Schutte',
      CellNumber: '27992180605',
      EmailAddress: '',
      RsaId: 4524234324,
      PassportNumber: 'E452423',
      Resident: 'ZA',
      Address: {
         AddressLines: [
            {
               AddressLine: 'G12 KYLEMORE'
            }
         ]
      }
   };
}

describe('ContactDetailsComponent', () => {

   let component: ContactDetailsComponent;
   let fixture: ComponentFixture<ContactDetailsComponent>;
   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [
            ContactDetailsComponent,
            TestHostComponent,
            MobileNumberMaskPipe
         ]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ContactDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should be created', () => {
      component.profileDetails = getMockProfileDetails();
      expect(component).toBeTruthy();
   });
   it('should call ngOnChanges', () => {
      const fixture2 = TestBed.createComponent(TestHostComponent);
      const testHostComponent = fixture2.componentInstance;
      testHostComponent.profileDetails = getMockProfileDetails();
      fixture2.detectChanges();
   });

   it('should return non resident passport number', () => {
      component.profileDetails = getMockProfileDetails();
      expect(component.displayRsaPassportNo()).toBe(4524234324);
      component.profileDetails.Resident = 'LA';
      expect(component.displayRsaPassportNo()).toBe('E452423');
   });

});
