import { ErrorCodes, HttpException } from "./root";

export class BadRequestException extends HttpException {
    constructor(message: string, errorCode: ErrorCodes, error: any) {
        super(message, errorCode, 400, error);
    }
}