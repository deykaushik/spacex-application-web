
import { TestBed, inject } from '@angular/core/testing';

import { LoaderService } from './loader.service';
import { ILoaderProperties } from './models';

describe('LoaderService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [LoaderService]
      });
   });

   it('should be created', inject([LoaderService], (service: LoaderService) => {
      expect(service).toBeTruthy();
   }));
   it('should show loader ', inject([LoaderService], (service: LoaderService) => {
      service.getLoader().subscribe((properties: ILoaderProperties) => {
         expect(properties.isShown).toBe(true);
      });
      service.show();
   }));
   it('should hide loader ', inject([LoaderService], (service: LoaderService) => {
      service.getLoader().subscribe((properties: ILoaderProperties) => {
         expect(properties.isShown).toBe(false);
      });
      service.hide();
   }));
   it('should show loader peroperty', inject([LoaderService], (service: LoaderService) => {
      service.show();
      expect(service.isOpen).toBe(true);
   }));
});




