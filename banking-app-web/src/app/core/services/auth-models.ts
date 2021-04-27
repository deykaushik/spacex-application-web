export interface MetaData {
    ResultCode: string;
    Message: string;
    InvalidFieldList?: any;
}

export interface IAuthorizeResponse {
    MetaData: MetaData;
    Data?: { TokenValue: string };
}

export interface IUser {
    username?: string;
    password?: string;
    appliesTo?: string;
    secretType?: string;
    token?: string;
}

export interface IVerifyProfile {
    Profile: string;
    PIN: string;
    Password: string;
}

export interface IVerifyProfileData {
    TemporaryID: number;
    MobileNumber: string;
    Title: string;
    FirstName: string;
    Surname: string;
    Username: string;
}

export interface IVerifyProfileResponse {
    MetaData: MetaData;
    Data: IVerifyProfileData;
}

export interface ICheckUsername {
    username?: string;
}

export interface ICheckUsernameResponse {
    MetaData: MetaData;
    Data?: any;
}

export interface IApproveITInfo {
    ApproveITMethod: string;
    ApproveITVerificationID: number;
    OTP: number;
}

export interface IApprove {
    TemporaryID: number;
    ApproveITInfo: IApproveITInfo;
}

export interface IApproveResponse {
    MetaData: MetaData;
    Data: IApprove;
}

export interface ISecurityStatusResponse {
    MetaData: MetaData;
    Data: ISecurityStatuData;
}

export interface ISecurityStatuData {
    TemporaryID: number;
    ApproveITInfo: IApproveITInfo;
}

export interface ILinkProfile {
    Action: string;
    ProfileInfo: {
        Profile: string;
        PIN: string;
        Password: string;
    };
    ApproveItInfo: IApproveITInfo;
}

export interface ILogContent {
    content: string;
    isError: boolean;
    token: string;
}

export interface INedbankUser {
    uniqueuserid: number;
    partnerid: number;
}

export interface INedbankAlias {
    SupportedPartnerID: number;
    Alias: string;
}

export interface INedbankAliasResponse {
    MetaData: MetaData;
    Data: INedbankAlias[];
}

export interface IUpdateUser {
    TemporaryID: number;
    GeneralInfo: GeneralInfo;
    TermsAndConditionsAccepted: boolean;
}

export interface IChangePassword {
    Username: string;
    OldPassword: string;
    NewPassword: string;
}

export interface GeneralInfo {
    FirstName?: string;
    Surname?: string;
    EmailAddress?: string;
    Title?: string;
    Gender?: string;
    DateOfBirth?: string;
    EnterpriseCustomerNumber?: number;
    Password: string;
    Username: string;
}

export interface IUpdateUserResponse {
    MetaData: MetaData;
    Data?: any;
}

export interface IUserRecoveryDetails {
    MobileNumber: string;
    IdDetails: {
        IdNumber: string;
        IdType?: string;
        CountryCode?: string;
    };
}

export interface IVerifyProfileResponse {
    MetaData: MetaData;
    Data: IVerifyProfileData;
}

