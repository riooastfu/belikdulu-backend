import { Request, Response } from "express";
import { AddToCartSchema, ChangeItemQuantitySchema } from "../schemas/cart";
import { Product } from "@prisma/client";
import { prismaCLient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";


export const addItemToCart = async (req: Request, res: Response) => {
    //TODO:: Check for the existence of the same product in user's cart and alter the quantity as required
    const validateData = AddToCartSchema.parse(req.body);
    let product: Product;
    try {
        product = await prismaCLient.product.findFirstOrThrow({
            where: {
                id: validateData.productId
            }
        })
    } catch (error) {
        throw new NotFoundException('Product not found.', ErrorCodes.PRODUCT_NOT_FOUND);
    }
    const cart = await prismaCLient.cartItem.create({
        data: {
            userId: req.user.id,
            productId: product.id,
            quantity: validateData.quantity
        }
    });
    res.json(cart);
}

export const deleteItemFromCart = async (req: Request, res: Response) => {
    // TODO:: check if user is deleting their own cart item
    await prismaCLient.cartItem.delete({
        where: {
            id: req.params.id
        }
    });
    res.json({ msg: "Item succesfully removed." });
}

export const changeQuantity = async (req: Request, res: Response) => {
    // TODO:: check if user is updating their own cart item quantity
    const validateData = ChangeItemQuantitySchema.parse(req.body);

    const updateCart = await prismaCLient.cartItem.update({
        where: {
            id: req.params.id
        },
        data: {
            quantity: validateData.quantity
        }
    })

    res.json(updateCart)
}

export const getCart = async (req: Request, res: Response) => {
    const cart = await prismaCLient.cartItem.findMany({
        where: {
            userId: req.user.id
        },
        include: {
            product: true
        }
    });
    res.json(cart)
}