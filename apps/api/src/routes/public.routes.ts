import mount from 'koa-mount';

import { AppKoa, AppRouter } from 'types';
import { accountRoutes } from 'resources/account';
import { pictureRoutes } from 'resources/picture';
import { likeRoutes } from 'resources/picture-like';

const healthCheckRouter = new AppRouter();
healthCheckRouter.get('/health', ctx => ctx.status = 200);

export default (app: AppKoa) => {
  app.use(healthCheckRouter.routes());
  app.use(mount('/account', accountRoutes.publicRoutes));
  app.use(mount('/pictures', pictureRoutes.publicRoutes));
  app.use(mount('/picture-likes', likeRoutes.publicRoutes));
};
