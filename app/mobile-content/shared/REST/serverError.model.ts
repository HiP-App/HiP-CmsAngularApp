
export class ServerError {
    statusCode: number;
    errorsInfo: ErrorMessage[];

    constructor(statusCode = 0, errorsInfo: ErrorMessage[] = new Array<ErrorMessage>()) {
        this.statusCode = statusCode;
        this.errorsInfo = errorsInfo;
    }

     toString(): string {
        let strRet = '';
        for (let error of this.errorsInfo) {
            strRet += ` ${error.key}   :    ${error.message} `;
        }

        return strRet;
     }
}

export class ErrorMessage {
    key: string;
    message: string;

    constructor(key = '', message = '') {
        this.key = key;
        this.message = message;
    }

    static getErrorMessages(errorsInfo?: any): ErrorMessage[] {
        let array = new Array<ErrorMessage>();

        if (!errorsInfo) {
            return array;
        }
        for (let errorKey in errorsInfo) {
            if (errorsInfo.hasOwnProperty(errorKey)) {
                array.push(new ErrorMessage(errorKey, errorsInfo[errorKey]));
            }
        }

        return array;
    }
}
