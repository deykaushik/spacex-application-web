import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { assertModuleFactoryCaching } from '../../test-util';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
   let component: ConfirmModalComponent;
   let fixture: ComponentFixture<ConfirmModalComponent>;

   assertModuleFactoryCaching();

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         declarations: [ConfirmModalComponent],
         schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
         .compileComponents();
   }));

   beforeEach(() => {
      fixture = TestBed.createComponent(ConfirmModalComponent);
      component = fixture.componentInstance;
      component.requestInProgress = false;
      fixture.detectChanges();
   });

   it('should be created', () => {
      expect(component).toBeTruthy();
   });

   it('should select place notice popup modal title', () => {
      component.isFromPlaceNotice = true;
      component.ngOnInit();
      expect(component.title).toEqual(component.labels.placeNoticeTitle);
   });

   it('should select cancel loan popup modal title', () => {
      component.isFromPlaceNotice = false;
      component.ngOnInit();
      expect(component.title).toEqual(component.labels.cancelLoanTitle);
   });

   it('should emit user click', () => {
      spyOn(component.userActionClick, 'emit');
      component.userAction('Yes');
      expect(component.userActionClick.emit).toHaveBeenCalledWith('Yes');
   });
});
