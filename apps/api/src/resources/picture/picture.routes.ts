import { routeUtil } from 'utils';

import search from './actions/search';
import upload from './actions/upload';
import update from './actions/update';
import getById from './actions/get-by-id';
import getMyById from './actions/get-my-by-id';
import getMy from './actions/get-my';
import remove from './actions/remove';

const publicRoutes = routeUtil.getRoutes([
    search
]);

const privateRoutes = routeUtil.getRoutes([
    update,
    upload,
    getMy,
    getById,
    getMyById,
    remove
]);

export default {
    publicRoutes,
    privateRoutes
};