import { NextFunction, Request, Response } from 'express'
import { prismaCLient } from '..';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';
import { UnprocessableEntity } from '../exceptions/validation';
import { SignUpSchema } from '../schemas/users';
import { NotFoundException } from '../exceptions/not-found';
import { User } from '@prisma/client';
import { error } from 'console';

//custom extended Request
interface AuthRequest extends Request {
    user: User;
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body)
    const { email, password, name } = req.body;

    let user = await prismaCLient.user.findFirst({
        where: { email }
    })
    if (user) throw new BadRequestException('User already exist!', ErrorCodes.USER_ALREADY_EXISTS, error);

    user = await prismaCLient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10)
        }
    })

    res.json(user);
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    let user = await prismaCLient.user.findFirst({
        where: { email }
    })
    if (!user) throw new NotFoundException('User not found.', ErrorCodes.USER_NOT_FOUND);
    if (!compareSync(password, user.password)) throw new BadRequestException('Incorrect password!', ErrorCodes.INCORRECT_PASSWORD, error)

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);

    res.json({ user, token });
}

// to use extended Request that we made on express.d.ts we have make custom interface above [can see the interface AuthRequest]
export const me = async (req: AuthRequest, res: Response) => {


    res.json(req.user);
}