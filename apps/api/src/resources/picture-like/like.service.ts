import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './like.schema';
import { Like } from './like.types';

const service = db.createService<Like>(DATABASE_DOCUMENTS.PICTURE_LIKES, {
    schemaValidator: (obj) => schema.parseAsync(obj)
});

export default service;
