import { async, inject, TestBed } from '@angular/core/testing';

import { UnsaveOverlayService } from './unsave-overlay.service';


describe('UnsavedOverlayService', () => {

   beforeEach(async(() => {
      TestBed.configureTestingModule({
         providers: [UnsaveOverlayService]
      });
   }));

   it('should be created', () => {
      expect(UnsaveOverlayService).toBeTruthy();
   });

   it('should check for updating overlay from component', inject([UnsaveOverlayService], (service: UnsaveOverlayService) => {
      expect(service.emitOut('ok')).toBeUndefined();
   }));

   it('should check for updating overlay from service', inject([UnsaveOverlayService], (service: UnsaveOverlayService) => {
      expect(service.updateOverlay(true)).toBeUndefined();
   }));

});
