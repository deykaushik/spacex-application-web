import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiAuthService } from './../core/services/api.auth-service';
import { IApiResponse } from '../core/services/models';
import { SessionTimeoutService } from './session-timeout/session-timeout.service';
import {
    IUser,
    IAuthorizeResponse,
    INedbankUser,
    INedbankAliasResponse,
    IUserRecoveryDetails,
    IChangePassword
} from '../core/services/auth-models';

@Injectable()
export class AuthService {

    static timeoutService: SessionTimeoutService;
    static username: string;

    constructor(private apiAuthService: ApiAuthService, private sessionTimeoutService: SessionTimeoutService) { }

    logon(user: IUser): Observable<any> {
        if (!AuthService.timeoutService) {
            AuthService.timeoutService = this.sessionTimeoutService;
            AuthService.timeoutService.ngOnInit();
        }

        return this.apiAuthService.AuthorizeNedbankId.create(user).map(response => {
            AuthService.username = user.username;
            return response;
        });
    }

    getNedbankIdAnonymousToken(): Observable<IApiResponse> {
        return this.apiAuthService.GetNedbankIdAnonymousToken.getAll().map(response => {
            return response;
        });
    }
}


