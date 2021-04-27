import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../core/services/api.service';
import { RegisterService } from './register.service';
import { IVerifyProfile, IVerifyProfileResponse, IApproveITInfo } from '../core/services/auth-models';
import { AuthService } from '../auth/auth.service';
import { ApiAuthService } from '../core/services/api.auth-service';
import { View } from './utils/enums';
import { ConstantsRegister } from './utils/constants';
import { ISubscription } from 'rxjs/Subscription';
import { IPasswordRecoveryDetails } from '../register/register.models';
import { tick } from '@angular/core/testing';

const mockProfile: IVerifyProfile = {
    Password: 'Sf9oIemkeXtR1NggqfuGhQ==',
    PIN: 'NR/eZkZfp94=',
    Profile: '3000009990'
};

export interface IEnrolmentUser {
    profile: string;
    pin: string;
    password: string;
    nedbankIdUserName: string;
    nedbankIdPassword: string;
    mobileNumber: string;
}

export interface IUserRecoveryDetails {
    MobileNumber: string;
    IdDetails: {
        IdNumber: string;
        IdType?: string;
        CountryCode?: string;
    };
}

export interface INedbankUser {
    uniqueuserid: number;
    partnerid: number;
}

export enum ApprovalType {
    ApproveUser,
    FederateUser,
    RecoverPassword,
    ForgotDetails
}

export interface IChangePassword {
    Username: string;
    OldPassword: string;
    NewPassword: string;
}

const mockNedbankIdCredentials = {
    username: 'JamesBond',
    password: '007007007',
    temporaryId: 123
};

const mockUserDetails = {
    nedbankIdUserName: 'eiwuewiue',
    profile: '3000009990',
    password: 'Sf9oIemkeXtR1NggqfuGhQ==',
    nedbankIdPassword: 'Sf9oIemkeXtR1NggqfuGhQ==',
    pin: 'NR/eZkZfp94=',
    mobileNumber: '0784325431'
};

let mockValidateProfile, mockcheckUsernameAvailable, mockUpdateUser,
    mockApprove, mockApproveStatus, verifyProfileResponse, mockLinkProfile,
    mockVerifyProfile, mockCheckUserName, mockRecoverPassword, mockRetrieveAlias, mockRecoverUserName, mockChangePassword;

function getProfileResponse() {
    return { temporaryUser: '139291' };
}

describe('RegisterService', () => {
    let returnEmptyResponse = false;

    beforeEach(() => {

        verifyProfileResponse = getProfileResponse();

        mockValidateProfile = jasmine.createSpy('validateProfile').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of({ Data: { TemporaryID: '139291' }, MetaData: { Val: '' } });
            } else {
                return Observable.of({ data: { TemporaryID: '139291' }, metadata: { Val: '' } });
            }
        });

        mockcheckUsernameAvailable = jasmine.createSpy('checkUsernameAvailable').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of(undefined);
            } else {
                return Observable.of({ Data: { result: true } });
            }
        });

        mockUpdateUser = jasmine.createSpy('UpdateUser').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of({ Data: {}, MetaData: {} });
            } else {
                return Observable.of({ data: {}, metadata: {} });
            }
        });

        mockRetrieveAlias = jasmine.createSpy('RetrieveAlias').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of(undefined);
            } else {
                return Observable.of({ data: {}, metadata: {} });
            }
        });

        mockApprove = jasmine.createSpy('Approve').and.callFake(function () {
            return Observable.of(1234);
        });

        mockApproveStatus = jasmine.createSpy('ApproveStatus').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of({ Data: {}, MetaData: {} });
            } else {
                return Observable.of({ data: {}, metadata: {} });
            }
        });

        mockRecoverPassword = jasmine.createSpy('RecoverPassword').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of({ Data: {}, MetaData: {} });
            } else {
                return Observable.of({ data: {}, metadata: {} });
            }
        });

        mockLinkProfile = jasmine.createSpy('LinkProfile').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of(undefined);
            } else {
                return Observable.of({ Data: { result: true } });
            }
        });

        mockRecoverUserName = jasmine.createSpy('RecoverUserName').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of(undefined);
            } else {
                return Observable.of({ Data: { result: true } });
            }
        });

        mockChangePassword = jasmine.createSpy('ChangePassword').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of(undefined);
            } else {
                return Observable.of({ Data: { result: true } });
            }
        });

        mockVerifyProfile = jasmine.createSpy('VerifyProfile').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of({ Data: {}, MetaData: {} });
            } else {
                return Observable.of({ data: { Username: 'testUser' }, metadata: {} });
            }
        });

        mockCheckUserName = jasmine.createSpy('CheckUserName').and.callFake(function () {
            if (returnEmptyResponse) {
                return Observable.of({ Data: {}, MetaData: {} });
            } else {
                return Observable.of({ data: { Username: 'testUser' }, metadata: {} });
            }
        });


        TestBed.configureTestingModule({
            providers: [RegisterService,
                {
                    provide: ApiService, useValue: {
                        validateProfile: {
                            create: mockValidateProfile
                        }
                    }
                },
                {
                    provide: ApiAuthService,
                    useValue: {
                        VerifyProfile: {
                            create: mockVerifyProfile
                        },
                        CheckUsername: {
                            create: mockCheckUserName
                        },
                        UpdateUser: {
                            update: mockUpdateUser
                        },
                        Approve: {
                            create: mockApprove
                        },
                        ApproveStatus: {
                            get: mockApproveStatus
                        },
                        LinkProfile: {
                            create: mockLinkProfile
                        },
                        RecoverPassword: {
                            create: mockRecoverPassword
                        },
                        RetrieveAlias: {
                            getAll: mockRetrieveAlias
                        },
                        RecoverUserName: {
                            create: mockRecoverUserName
                        },
                        ChangePassword: {
                            update: mockChangePassword
                        }
                    }
                }
            ]
        });
    });

    it('should be created', inject([RegisterService], (service: RegisterService) => {
        expect(service).toBeTruthy();
    }));

    it('recoverPassword', inject([RegisterService], (service: RegisterService) => {
        const user: IPasswordRecoveryDetails = {
            MobileNumber: '',
            Password: '',
            UserName: '',
            ApproveItInfo: {
                ApproveITMethod: '',
                ApproveITVerificationID: 1,
                OTP: 1
            }
        };

        service.recoverPassword(user).subscribe((response) => {
            expect(response).toBeDefined();
        });
    }));

    it('resetUserDetails reset user variable', inject([RegisterService], (service: RegisterService) => {
        const user: IEnrolmentUser = {
            nedbankIdPassword: '',
            nedbankIdUserName: '',
            password: '',
            pin: '',
            profile: '',
            mobileNumber: ''
        };

        service.resetUserDetails();
        expect(service.userDetails).toEqual(user);
    }));

    it('should validate profile', inject([RegisterService], (service: RegisterService) => {
        service.userDetails = mockUserDetails;

        returnEmptyResponse = true;
        service.validateProfile(mockProfile.Profile, mockProfile.Password, mockProfile.PIN)
            .subscribe(response => {
                expect(response).toBeDefined();
                expect(response.Data).toBeDefined();
            });
        expect(mockVerifyProfile).toHaveBeenCalled();
    }));

    it('should validate profile alternative metadata spelling', inject([RegisterService], (service: RegisterService) => {

        service.userDetails = mockUserDetails;

        returnEmptyResponse = false;
        service.validateProfile(mockProfile.Profile, mockProfile.Password, mockProfile.PIN)
            .subscribe(response => {
                expect(response).toBeDefined();
                expect(response.Data).toBeDefined();
            });
        expect(mockVerifyProfile).toHaveBeenCalled();
    }));

    it('should encrypt String', inject([RegisterService], (service: RegisterService) => {
        const encryptedStr = service.EncryptString('password');
        expect(encryptedStr).not.toEqual('password');
    }));

    it('should validate profile with empty response', inject([RegisterService], (service: RegisterService) => {

        service.userDetails = mockUserDetails;

        returnEmptyResponse = true;

        service.validateProfile(mockProfile.Profile, mockProfile.Password, mockProfile.PIN).subscribe(response => {
            expect(response.Data.Username).toBeUndefined();
        });
        expect(mockVerifyProfile).toHaveBeenCalled();
    }));

    it('should check user availability with positive result', inject([RegisterService], (service: RegisterService) => {
        returnEmptyResponse = false;
        service.checkUsernameAvailable(mockNedbankIdCredentials.username).subscribe(response => {
            expect(response).toBeDefined();
            expect(response.Data.Username).toBeDefined();
        });
        expect(mockCheckUserName).toHaveBeenCalled();
    }));

    it('should check username with empty response', inject([RegisterService], (service: RegisterService) => {
        returnEmptyResponse = true;
        service.checkUsernameAvailable('usernameExist').subscribe(response => {
            expect(response.Data.Username).toBeUndefined();
        });
        expect(mockCheckUserName).toHaveBeenCalled();
    }));

    it('should update user with valid data', inject([RegisterService], (service: RegisterService) => {
        returnEmptyResponse = false;
        service.UpdateUser(mockNedbankIdCredentials.username, mockNedbankIdCredentials.password,
            mockNedbankIdCredentials.temporaryId).subscribe(response => {
                expect(response).toBeDefined();
            });
        expect(mockUpdateUser).toHaveBeenCalled();
    }));

    it('should update user with empty response', inject([RegisterService], (service: RegisterService) => {
        returnEmptyResponse = true;
        service.UpdateUser(mockNedbankIdCredentials.username, mockNedbankIdCredentials.password,
            mockNedbankIdCredentials.temporaryId).subscribe(response => {
                expect(response).toBeDefined();
            });
        expect(mockUpdateUser).toHaveBeenCalled();
    }));

    it('should approve user USSD and FederateUser', inject([RegisterService], (service: RegisterService) => {
        returnEmptyResponse = false;
        service.approvalType = ApprovalType.FederateUser;
        spyOn(service, 'LinkProfile').and.returnValue(Observable.of(1234));

        service.userDetails = {
            profile: '',
            pin: '',
            password: '',
            nedbankIdUserName: '',
            nedbankIdPassword: '',
            mobileNumber: ''
        };

        service.Approve(1, 2, 0).subscribe(response => {
            expect(response).toEqual(1234);
        });
    }));

    it('should approve user with OTP and RecoverPassword', inject([RegisterService], (service: RegisterService) => {
        returnEmptyResponse = false;
        service.approvalType = ApprovalType.RecoverPassword;
        spyOn(service, 'recoverPassword').and.returnValue(Observable.of(1234));

        service.userDetails = {
            profile: '',
            pin: '',
            password: '',
            nedbankIdUserName: '',
            nedbankIdPassword: '',
            mobileNumber: ''
        };

        service.Approve(1, 2, 3).subscribe(response => {
            expect(response).toEqual(1234);
        });
    }));

    it('should approve user with OTP and undefined', inject([RegisterService], (service: RegisterService) => {
        service.approvalType = ApprovalType.ForgotDetails;

        service.userDetails = {
            profile: '',
            pin: '',
            password: '',
            nedbankIdUserName: '',
            nedbankIdPassword: '',
            mobileNumber: ''
        };

        service.Approve(1, 2, 3).subscribe(response => {
            expect(response).toEqual(1234);
        });
    }));

    it('should approve status', inject([RegisterService], (service: RegisterService) => {
        returnEmptyResponse = false;
        service.ApproveStatus(12345).subscribe(response => {
            expect(response).toBeDefined();
            expect(response.Data).toBeDefined();
        });
        expect(mockApproveStatus).toHaveBeenCalled();
    }));

    it('should not approve status', inject([RegisterService], (service: RegisterService) => {
        returnEmptyResponse = true;
        service.ApproveStatus(12345).subscribe(response => {
            expect(response).toBeDefined();
        });
        expect(mockApproveStatus).toHaveBeenCalled();
    }));

    it('should link profile', inject([RegisterService], (service: RegisterService) => {
        service.LinkProfile('3001032092', '8983', 'password', 1012, 0).subscribe(response => {
            expect(response).not.toBeDefined();
        });
        expect(mockLinkProfile).toHaveBeenCalled();
    }));

    it('retrieveAlias should get alias', inject([RegisterService], (service: RegisterService) => {
        const user: INedbankUser = {
            uniqueuserid: 1,
            partnerid: 2,
        };
        returnEmptyResponse = false;
        service.retrieveAlias(user).subscribe(response => {
            expect(response).toBeDefined();
        });
        expect(mockRetrieveAlias).toHaveBeenCalled();
    }));

    it('changePassword should get alias', inject([RegisterService], (service: RegisterService) => {
        const password: IChangePassword = {
            Username: '',
            OldPassword: '',
            NewPassword: ''
        };

        returnEmptyResponse = true;
        service.changePassword(password).subscribe(response => {
            expect(response).not.toBeDefined();
        });
        expect(mockChangePassword).toHaveBeenCalled();
    }));

    it('recoverUsername should get alias', inject([RegisterService], (service: RegisterService) => {
        const user: IUserRecoveryDetails = {
            MobileNumber: '',
            IdDetails: {
                IdNumber: '',
                IdType: '',
                CountryCode: '',
            }
        };

        returnEmptyResponse = true;
        service.recoverUsername(user).subscribe(response => {
            expect(response).not.toBeDefined();
        });
        expect(mockRecoverUserName).toHaveBeenCalled();
    }));

    it('SetActiveView should change views', inject([RegisterService], (service: RegisterService) => {
        const oldView: View = View.NedIdCreate;
        const newView: View = View.NedIdComplete;
        service.SetActiveView(oldView, newView);
        setTimeout(function() {
            expect(service.previousView).toEqual(oldView);
            expect(service.activeView).toEqual(newView);
          }, 50);
    }));

    it('SetActiveView should change views should set no default image', inject([RegisterService], (service: RegisterService) => {
        const oldView: View = View.NedIdCreate;
        const newView: View = View.NedIdComplete;
        service.pngImgUrl = '';
        spyOn(ConstantsRegister, 'ViewDetails').and.returnValue(null);
        service.SetActiveView(oldView, null);
        setTimeout(function() {
            expect(service.pngImgUrl).toEqual('url(../../../assets/png/NedbankLogin_v2.png)');
          }, 50);
    }));

    it('SetImage should set URL', inject([RegisterService], (service: RegisterService) => {
        service.SetImage('hallo');
        expect(service.pngImgUrl).toEqual('url(../../../assets/png/hallo.png)');
    }));

    it('SetImage should not set URL', inject([RegisterService], (service: RegisterService) => {
        service.SetImage(null);
        expect(service.pngImgUrl).toEqual('');
    }));
});
