import { TestBed, inject } from '@angular/core/testing';

import { WindowRefService } from './window-ref.service';
import { Constants } from '../utils/constants';

describe('WindowRefService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [WindowRefService]
      });
   });

   it('should be created', inject([WindowRefService], (service: WindowRefService) => {
      expect(service).toBeTruthy();
      expect(service.nativeWindow).toBeDefined();
   }));

   it('should be return whether screen is small or not', inject([WindowRefService], (service: WindowRefService) => {
      const should = (window.innerHeight < Constants.disablePoupMin.height ||
         window.innerWidth < Constants.disablePoupMin.width);
      const response = service.isSmallScreen();
      expect(response).toBe(should);
   }));
});
