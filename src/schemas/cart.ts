import { z } from 'zod';

export const AddToCartSchema = z.object({
    productId: z.string(),
    quantity: z.number(),
});

export const ChangeItemQuantitySchema = z.object({
    quantity: z.number(),
});