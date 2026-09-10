import 'reflect-metadata';
import { UserResource } from '@resources/UserResource';
import { createExpressServer, useContainer } from 'routing-controllers';
import serverless from 'serverless-http';
import { Container } from 'typedi';

useContainer(Container);

export const app = createExpressServer({
    cors: true,
    defaultErrorHandler: false,
    controllers: [UserResource],
});

if (process.env.IS_OFFLINE === 'true') {
    app.listen(3000, () => console.log('Server running'));
}

export const handler = serverless(app);