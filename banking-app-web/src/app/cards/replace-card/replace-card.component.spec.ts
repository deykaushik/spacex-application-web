import { CardMaskPipe } from './../../shared/pipes/card-mask.pipe';
import { FormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { assertModuleFactoryCaching } from './../../test-util';
import { SharedModule } from '../../shared/shared.module';
import { CardService } from '../card.service';


import { ReplaceCardComponent } from './replace-card.component';
import { Constants } from '../../core/utils/constants';
import { By } from '@angular/platform-browser';

const cardServiceStub = {
   replaceCard: jasmine.createSpy('replaceCard')
};

describe('ReplaceCardComponent', () => {
   let component: ReplaceCardComponent;
   let fixture: ComponentFixture<ReplaceCardComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule],
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         declarations: [ReplaceCardComponent, CardMaskPipe],
         providers: [{ provide: CardService, useValue: cardServiceStub }]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ReplaceCardComponent);
      component = fixture.componentInstance;
      component.cardInfo = {
         plasticId: 1,
         cardNumber: 'xxx',
         reason: null,
         cardType: 'C',
         branchCode: '9',
         branchName: 'nedbank branch'
      };
      fixture.detectChanges();
   });

   it('should be created - Test case#1', () => {
      expect(component).toBeTruthy();
   });

   it('should try setting reason code for various reasons - Test case#2', () => {
      component.isAgree = false;
      component.onReplaceReasonChanged('damaged');
      expect(component.selectedReason.code).toBe('damaged');

      component.onReplaceReasonChanged('retain');
      expect(component.selectedReason.code).toBe('retain');

      component.onReplaceReasonChanged('stolen');
      expect(component.selectedReason.code).toBe('stolen');

      component.onReplaceReasonChanged('lost');
      expect(component.selectedReason.code).toBe('lost');
   });

   it('should try setting reason code for various reasons - when Checkbox is already checked', () => {
      component.isAgree = true;
      component.onReplaceReasonChanged('damaged');
      component.enableNextButton(true);
      expect(component.selectedReason.code).toBe('damaged');

      component.onReplaceReasonChanged('retain');
      component.enableNextButton(true);
      expect(component.selectedReason.code).toBe('retain');

      component.onReplaceReasonChanged('stolen');
      component.enableNextButton(true);
      expect(component.selectedReason.code).toBe('stolen');

      component.onReplaceReasonChanged('lost');
      component.enableNextButton(true);
      expect(component.selectedReason.code).toBe('lost');
   });

   it('should be able to replace the card - Test case#3', () => {
      component.onReplaceReasonChanged('lost');
      component.isAgree = true;
      expect(component.replaceCard()).toBeUndefined();
   });

   it('should be able to enable next button - Test case#4', () => {
      const nextButton = fixture.debugElement.query(By.css('.agreeCheckBox')).nativeElement;
      nextButton.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      component.selectedReason = Constants.VariableValues.cardBlockingReasong.lost;

      fixture.whenStable().then(() => {
         expect(component.isAgree).toBe(false);
      });
   });

});
