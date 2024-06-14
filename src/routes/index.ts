import { Router } from "express";
import authRoutes from "./auth";
import productsRoutes from "./products";
import usersRoutes from "./users";
import cartRoutes from "./cart";
import orderRoutes from "./orders";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes);
rootRouter.use('/products', productsRoutes);
rootRouter.use('/users', usersRoutes);
rootRouter.use('/cart', cartRoutes);
rootRouter.use('/order', orderRoutes);

export default rootRouter;

// 1. user management
//     a. list users
//     b. get user by id
//     c. change user role
// 2. order management
//     a. list all orders (filter on status)
//     b. change order status
//     c. list all orders of given user
// 2. product management
//     a. search api for products (for both users and admin) -> full text search