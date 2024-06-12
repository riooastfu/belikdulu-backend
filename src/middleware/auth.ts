import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets";
import { prismaCLient } from "..";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // 1. extract token from header
    const token = req.headers.authorization
    // 2. if (!token), throw an error of Unauthorized
    if (!token) {
        return next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
    }
    try {
        // 3. if (token), verify token and extract payload
        const payload = jwt.verify(token, JWT_SECRET) as any
        // 4. to get the user from payload
        const user = await prismaCLient.user.findFirst({
            where: { id: payload.userId }
        });
        if (!user) {
            return next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED));
        };
        // 5. to attach user to current req object   
        req.user = user;
        next();
    } catch (error) {
        next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED))
    }
}

export default authMiddleware;