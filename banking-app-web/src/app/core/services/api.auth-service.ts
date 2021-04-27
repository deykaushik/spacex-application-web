import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Constants } from '../utils/constants';
import {
    IUser,
    IVerifyProfile,
    IUpdateUser,
    ICheckUsername,
    IApprove,
    ILinkProfile,
    INedbankUser,
    IUserRecoveryDetails,
    IChangePassword
} from './auth-models';
import { IPasswordRecoveryDetails } from '../../register/register.models';
import { IRefreshAccountsApiResult, IApiResponse } from './models';
@Injectable()
export class ApiAuthService {

    constructor(private http: HttpClient) { }

    apiUrl = environment.apiUrl;
    nedbankApiUrl = environment.nedbankApiUrl;

    // Nedbank Id
    GetNedbankIdAnonymousToken = new Api<IUser>(this.http, this.nedbankApiUrl + 'v3/users/salut');
    AuthorizeNedbankId = new Api<IUser>(this.http, this.nedbankApiUrl + 'v3/users/authenticate');
    VerifyProfile = new Api<IVerifyProfile>(this.http, this.nedbankApiUrl + 'v3/users/verify/profile');
    CheckUsername = new Api<ICheckUsername>(this.http, this.nedbankApiUrl + 'v3/users/usernames');
    UpdateUser = new Api<IUpdateUser>(this.http, this.nedbankApiUrl + 'v3/users/temporary');
    Approve = new Api<IApprove>(this.http, this.nedbankApiUrl + 'v3/users/approvals');
    ApproveStatus = new Api<number>(this.http, this.nedbankApiUrl + 'v3/users/securitystatus');
    LinkProfile = new Api<ILinkProfile>(this.http, this.nedbankApiUrl + 'v3/users/alias/profile');
    RetrieveAlias = new Api<INedbankUser>(this.http, this.nedbankApiUrl + 'v3/users/alias');
    RecoverUserName = new Api<IUserRecoveryDetails>(this.http, this.nedbankApiUrl + 'v3/users/recoveries/username');
    RecoverPassword = new Api<IPasswordRecoveryDetails>(this.http, this.nedbankApiUrl + 'v3/users/recoveries/password');
    ChangePassword = new Api<IChangePassword>(this.http, this.nedbankApiUrl + 'v3/users/password/update');
    RenewToken = new Api<any>(this.http, this.nedbankApiUrl + 'v3/users/renew/token');
    RefreshAccounts = new Api<IRefreshAccountsApiResult>(this.http, this.apiUrl + 'clients/accounts/refresh');
    CheckLogin = new Api<IApiResponse>(this.http, this.apiUrl + 'clients/checklogin');
}
