import mount from 'koa-mount';
import compose from 'koa-compose';

import { AppKoa } from 'types';
import { accountRoutes } from 'resources/account';
import { userRoutes } from 'resources/user';
import { pictureRoutes } from 'resources/picture';
import { likeRoutes } from 'resources/picture-like';

import auth from './middlewares/auth.middleware';

export default (app: AppKoa) => {
  app.use(mount('/account', compose([auth, accountRoutes.privateRoutes])));
  app.use(mount('/users', compose([auth, userRoutes.privateRoutes])));
  app.use(mount('/pictures', compose([auth, pictureRoutes.privateRoutes])));
  app.use(mount('/picture-likes', compose([auth, likeRoutes.privateRoutes])));
};
