import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { prismaCLient } from "..";

const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user.role == 'ADMIN') {
        next();
    }
    else {
        next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
    }
}

export default adminMiddleware;