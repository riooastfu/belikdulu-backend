import { Request, Response } from "express";
import { prismaCLient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {

    // ["tea","indonesia","sidikalang"]
    // Create validator for this request
    const product = await prismaCLient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        }
    })

    res.json(product);
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body;
        if (product.tags) {
            product.tags = product.tags.join(',')
        }
        const updateProduct = await prismaCLient.product.update({
            where: {
                id: req.params.id
            },
            data: product
        })
        res.json(updateProduct);
    } catch (error) {
        throw new NotFoundException('Product not found.', ErrorCodes.PRODUCT_NOT_FOUND);
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    //TODO: delete product features
}
export const listProduct = async (req: Request, res: Response) => {
    const count = await prismaCLient.product.count();
    const products = await prismaCLient.product.findMany();
    res.json({
        count, data: products
    })
}
export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await prismaCLient.product.findUniqueOrThrow({
            where: {
                id: req.params.id
            }
        })
        res.json(product)
    } catch (error) {
        throw new NotFoundException('Product not found.', ErrorCodes.PRODUCT_NOT_FOUND);
    }
}
