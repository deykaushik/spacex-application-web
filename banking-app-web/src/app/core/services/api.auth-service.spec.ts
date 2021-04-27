import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TestBed, inject } from '@angular/core/testing';

import { ApiAuthService } from './api.auth-service';

describe('ApiService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
         imports: [HttpClientModule],
         providers: [ApiAuthService, HttpClient]
      });
   });

   it('should be created', inject([ApiAuthService], (service: ApiAuthService) => {
      expect(service).toBeTruthy();
   }));
});
