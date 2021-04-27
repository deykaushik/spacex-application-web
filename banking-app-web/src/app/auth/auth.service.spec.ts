import { Observable } from 'rxjs/Observable';
import { TestBed, inject } from '@angular/core/testing';
import { Route, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ApiService } from './../core/services/api.service';
import { environment } from './../../environments/environment';
import { IUser, IAuthorizeResponse } from './../core/services/models';
import { ApiAuthService } from '../core/services/api.auth-service';
import { SessionTimeoutService } from './session-timeout/session-timeout.service';

describe('AuthService', () => {

    const mockUser: IUser = {
        username: 'nedbank',
        password: 'Passw0rd'
    };

    const mockUserResponse: IAuthorizeResponse = {
        Data: {
            TokenValue: '2323232'
        },
        MetaData: {
            ResultCode: 'R00',
            Message: '',
            InvalidFieldList: []
        }
    };

    // const oninit = jasmine.createSpy('ngOninit', SessionTimeoutService);

    let returnEmpty: Boolean = false;
     const mockUserData = jasmine.createSpy('create').and.callFake(function () {
        if (returnEmpty) {
            return Observable.of(null);
        } else {
            return Observable.of(mockUserResponse);
        }
    });

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthService,
                {
                    provide: ApiAuthService, useValue: {
                        AuthorizeNedbankId: {
                            create: mockUserData
                        }
                    }
                },
                {
                    provide: Router,
                    useClass: class { navigate = jasmine.createSpy('navigate'); }
                },
                {
                    provide: SessionTimeoutService,
                    useValue: { ngOnInit: jasmine.createSpy('ngOninit') }
                }]
        });
    });

    it('should be created', inject([AuthService], (service: AuthService) => {
        expect(service).toBeTruthy();
    }));

    it('should logon with test user', inject([AuthService], (service: AuthService) => {
        service.logon(mockUser).subscribe(response => {
            expect(response.Data.TokenValue).toEqual(mockUserResponse.Data.TokenValue);
        });
    }));

    it('should logon with invalid user', inject([AuthService], (service: AuthService) => {
        returnEmpty = true;
        service.logon(mockUser).subscribe(response => {
            expect(response).toEqual(null);
        });
    }));
});
