import { Request, Response } from "express";
import { prismaCLient } from "..";

export const createOrder = async (req: Request, res: Response) => {
    // 1. to create a transaction
    // 2. to list all the cart items and proceed if cart is not empty
    // 3. calculate the total amount
    // 4. fetch address of user
    // 5. to define computed field for formatted address on address module 
    // 6. we will create an order and order products
    // 7. create event 
    // 8. to empty the cart
    return await prismaCLient.$transaction(async (tx) => {
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                product: true
            }
        })
        if (cartItems.length == 0) {
            return res.json({ msg: "cart is empty." })
        }
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0);

        const address = await tx.address.findFirst({
            where: {
                id: req.user.defaultShippingAddressId!
            }
        });

        const order = await tx.order.create({
            data: {
                userId: req.user.id,
                netAmount: price,
                address: address?.formattedAddress!,
                orderProducts: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }
            }
        });
        const orderEvent = await tx.orderEvent.create({
            data: {
                orderId: order.id,
            }
        });
        await tx.cartItem.deleteMany({
            where: {
                userId: req.user.id
            }
        })
        return res.json(order)
    })
}

export const listOrders = async (req: Request, res: Response) => {

}

export const cancelOrder = async (req: Request, res: Response) => {

}

export const getOrderById = async (req: Request, res: Response) => {

}