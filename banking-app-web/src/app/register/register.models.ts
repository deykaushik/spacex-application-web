import { IApproveITInfo } from '../core/services/models';

export interface IRegisterVm {
    pin: string;
    profile: string;
    password: string;
}

export interface INedbankIdVm {
    username: string;
    password: string;
    verifyPassword: string;
}

export interface IPasswordRecoveryDetails {
    MobileNumber: string;
    UserName: string;
    Password: string;
    ApproveItInfo: IApproveITInfo;
}


