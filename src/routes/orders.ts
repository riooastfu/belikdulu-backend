import { Router } from "express";
import authMiddleware from "../middleware/auth";
import { errorHandler } from "../error-handler";
import { cancelOrder, changeOrderStatus, createOrder, getOrderById, listAllOrders, listOrders, listUserOrders } from "../controllers/orders";
import adminMiddleware from "../middleware/admin";

const orderRoutes: Router = Router();

orderRoutes.post('/', [authMiddleware], errorHandler(createOrder));
orderRoutes.get('/', [authMiddleware], errorHandler(listOrders));
orderRoutes.get('/index', [authMiddleware, adminMiddleware], errorHandler(listAllOrders))
orderRoutes.put('/:id/cancel', [authMiddleware], errorHandler(cancelOrder));
orderRoutes.get('/users/:id', [authMiddleware, adminMiddleware], errorHandler(listUserOrders))
orderRoutes.put('/:id/status', [authMiddleware, adminMiddleware], errorHandler(changeOrderStatus))
orderRoutes.get('/:id', [authMiddleware], errorHandler(getOrderById));

export default orderRoutes;