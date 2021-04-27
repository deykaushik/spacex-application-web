import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ApiService } from '../../core/services/api.service';
import { ILogContent } from '../../core/services/models';
import { AuthConstants } from '../../auth/utils/constants';
import { environment } from '../../../environments/environment';
import { TokenManagementService } from '../../core/services/token-management.service';

@Injectable()
export class LoggerService {

    constructor(private service: ApiService,
        private tokenManagementService: TokenManagementService) {
    }

    log(isLogError: boolean, message: string): void {
        try {

            if (!environment.production) {
                let consoleMessage: string;
                consoleMessage = isLogError ? 'Error:  ' + message : 'Info:  ' + message;

                // let logToken: string = localStorage.getItem(AuthConstants.staticNames.loggedOnUser);
                let logToken: string = this.tokenManagementService.getAuthToken();
                logToken === null ? logToken = '' : logToken = logToken;

                const logContent: ILogContent = {
                    content: message,
                    isError: isLogError,
                    token: logToken
                };

                this.service.LogEntry.create(logContent);
            }
        } catch (e) {
        }
    }

}
