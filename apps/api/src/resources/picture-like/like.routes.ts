import { routeUtil } from 'utils';

import like from './actions/like';
import myLikes from './actions/my-likes'
import remove from './actions/remove';

const publicRoutes = routeUtil.getRoutes([]);

const privateRoutes = routeUtil.getRoutes([
    myLikes,
    like,
    remove
]);

export default {
    publicRoutes,
    privateRoutes
};