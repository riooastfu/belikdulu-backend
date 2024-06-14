import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schemas/users";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Address, User } from "@prisma/client";
import { prismaCLient } from "..";
import { BadRequestException } from "../exceptions/bad-request";

export const addAddress = async (req: Request, res: Response) => {
    AddressSchema.parse(req.body);



    const address = await prismaCLient.address.create({
        data: {
            ...req.body,
            userId: req.user.id
        }
    });

    res.json(address);
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        await prismaCLient.address.delete({
            where: {
                id: req.params.id
            }
        })
        res.json({ msg: 'address succesfully deleted.' });
    } catch (error) {
        throw new NotFoundException('Address not found.', ErrorCodes.ADDRESS_NOT_FOUND);
    }
}

export const listAddress = async (req: Request, res: Response) => {
    const addresses = await prismaCLient.address.findMany({
        where: {
            userId: req.user.id
        }
    })
    res.json(addresses);
}

export const updateUser = async (req: Request, res: Response) => {
    const validateData = UpdateUserSchema.parse(req.body);
    let shippingAddress: Address;
    let billingAddress: Address;
    if (validateData.defaultShippingAddressId) {
        try {
            shippingAddress = await prismaCLient.address.findUniqueOrThrow({
                where: {
                    id: validateData.defaultShippingAddressId
                }
            })
        } catch (error) {
            throw new NotFoundException('Address not found.', ErrorCodes.ADDRESS_NOT_FOUND);
        }
        if (shippingAddress.userId != req.user.id) {
            throw new BadRequestException('Address does not belong to this user', ErrorCodes.ADDRESS_DOES_NOT_BELONG, null);
        }
    }

    if (validateData.defaultBillingAddressId) {
        try {
            billingAddress = await prismaCLient.address.findUniqueOrThrow({
                where: {
                    id: validateData.defaultBillingAddressId
                }
            })
        } catch (error) {
            throw new NotFoundException('Address not found.', ErrorCodes.ADDRESS_NOT_FOUND);
        }
        if (billingAddress.userId != req.user.id) {
            throw new BadRequestException('Address does not belong to this user', ErrorCodes.ADDRESS_DOES_NOT_BELONG, null);
        }
    }

    const updatedUser = await prismaCLient.user.update({
        where: {
            id: req.user.id
        },
        data: validateData
    });
    res.json(updatedUser);
}

export const listUsers = async (req: Request, res: Response) => {
    const user = await prismaCLient.user.findMany({
        skip: +req.query.skip! || 0,
        take: 5
    });
    res.json(user);
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await prismaCLient.user.findFirstOrThrow({
            where: {
                id: req.params.id
            },
            include: {
                addresses: true
            }
        });
        res.json(user);
    } catch (error) {
        throw new NotFoundException('User not found.', ErrorCodes.USER_NOT_FOUND);
    }
}

export const changeUserRole = async (req: Request, res: Response) => {
    try {
        const user = await prismaCLient.user.update({
            where: {
                id: req.params.id
            },
            data: {
                role: req.body.role
            }
        });
        res.json(user);
    } catch (error) {
        throw new NotFoundException('User not found.', ErrorCodes.USER_NOT_FOUND);
    }
}