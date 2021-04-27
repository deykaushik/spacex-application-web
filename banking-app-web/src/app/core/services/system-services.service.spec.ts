import { TestBed, inject } from '@angular/core/testing';

import { SystemErrorService } from './system-services.service';


describe('SystemErrorService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [SystemErrorService]
      });
   });

   it('should be created', inject([SystemErrorService], (service: SystemErrorService) => {
      expect(service).toBeTruthy();
   }));

   it('should post error to its listner', inject([SystemErrorService], (service: SystemErrorService) => {
      service.getError().subscribe((err) => {
         expect(err).toBeDefined();
      });
      service.raiseError(new Error('some error'));
   }));
   it('should close error to its listner', inject([SystemErrorService], (service: SystemErrorService) => {
      service.hideError().subscribe((err) => {
         expect(err).toBeUndefined();
      });
      service.closeError();
   }));
});
