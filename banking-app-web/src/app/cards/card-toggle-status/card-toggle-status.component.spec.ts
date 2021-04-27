import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { assertModuleFactoryCaching } from './../../test-util';
import { CardService } from '../card.service';
import { CardToggleStatusComponent } from './card-toggle-status.component';
import { Observable } from 'rxjs/Observable';
import { SystemErrorService } from '../../core/services/system-services.service';

const updateCardActionListSuccessData = 'R00';
const updateCardActionListFailureData = 'R01';
const cardServiceStub = {
   updateCardActionList: jasmine.createSpy('updateCardActionList').and.returnValue(Observable.of(updateCardActionListSuccessData)),
   updateCardActionListFailure: Observable.of(updateCardActionListFailureData)
};
const mockCardServiceError = Observable.create(observer => {
   observer.error(new Error('error'));
   observer.complete();
});
const systemErrorServiceStub = {
   closeError: jasmine.createSpy('closeError').and.returnValue(null)
};

describe('CardToggleStatusComponent', () => {
   let component: CardToggleStatusComponent;
   let fixture: ComponentFixture<CardToggleStatusComponent>;

   assertModuleFactoryCaching();
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         schemas: [CUSTOM_ELEMENTS_SCHEMA],
         providers: [{ provide: CardService, useValue: cardServiceStub },
         { provide: SystemErrorService, useValue: systemErrorServiceStub }],
         declarations: [CardToggleStatusComponent]
      })
         .compileComponents();
   }));
   beforeEach(() => {
      fixture = TestBed.createComponent(CardToggleStatusComponent);
      component = fixture.componentInstance;
      component.plasticNumber = 12345600007890;
      component.statusWarning = {
         header: 'Deactivate tap and go?',
         title: 'This will only take effect the next time you insert your card into an ATM or card machine.',
         subTitle: 'Click ‘Next’ if you’d like to continue.',
         type: 'tap-go',
         typeParam: 'CONTACTOFF',
         value: false
      };
      fixture.detectChanges();
   });
   it('should be created', () => {
      expect(component).toBeTruthy();
   });
   it('should update card action list for successful/failure update', () => {
      spyOn(component.nextClick, 'emit');
      component.onNext();
      expect(component.nextClick.emit).toHaveBeenCalledWith(true);

      cardServiceStub.updateCardActionList.and.returnValue(cardServiceStub.updateCardActionListFailure);
      component.onNext();
      expect(component.nextClick.emit).toHaveBeenCalledWith(false);
   });
   it('should cancel the overlay', () => {
      spyOn(component.cancel, 'emit');
      component.onCancel();
      expect(component.cancel.emit).toHaveBeenCalledWith(true);
   });
   it('should handle system level error when api fails', () => {
      spyOn(component.nextClick, 'emit');
      cardServiceStub.updateCardActionList.and.returnValue(mockCardServiceError);
      component.onNext();
      expect(systemErrorServiceStub.closeError).toHaveBeenCalled();
      expect(component.showLoader).toEqual(false);
      expect(component.nextClick.emit).toHaveBeenCalledWith(false);
   });
});
