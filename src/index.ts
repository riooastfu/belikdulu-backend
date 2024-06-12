import { PrismaClient } from '@prisma/client';
import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { errorMiddleware } from './middleware/errors';

const app: Express = express();

app.use(express.json());

app.use('/api', rootRouter);

export const prismaCLient = new PrismaClient({
    log: ['query']
}).$extends({
    result: {
        address: {
            formattedAddress: {
                needs: {
                    lineOne: true,
                    lineTwo: true,
                    city: true,
                    country: true,
                    pincode: true
                },
                compute: (item) => {
                    return `${item.lineOne}, ${item.lineTwo}, ${item.city}, ${item.country}-${item.pincode}`
                }
            }
        }
    }
})

app.use(errorMiddleware);

app.listen(PORT, () => console.log('App is running!'));