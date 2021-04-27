import { TestBed, inject } from '@angular/core/testing';

import { HeaderMenuService } from './header-menu.service';

describe('HeaderMenuService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         providers: [HeaderMenuService]
      });
   });

   it('should be created', inject([HeaderMenuService], (service: HeaderMenuService) => {
      expect(service).toBeTruthy();
   }));
   it('should open menu from header', inject([HeaderMenuService], (service: HeaderMenuService) => {
      service.headerMenuOpener().subscribe((menuText) => {
         expect(menuText).toBeDefined();
      });
      service.openHeaderMenu('Settings');
   }));
   it('should close menu from header', inject([HeaderMenuService], (service: HeaderMenuService) => {
      service.headerMenuOpener().subscribe((menuText?: string) => {
         expect(menuText).toBeNull();
      });
      service.openHeaderMenu(null);
   }));
});
