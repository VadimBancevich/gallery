import db from 'db';
import { DATABASE_DOCUMENTS } from 'app.constants';

import schema from './picture.schema';
import { Picture, PictureVisibility } from './picture.types';

const service = db.createService<Picture>(DATABASE_DOCUMENTS.PICTURES, {
    schemaValidator: (obj) => schema.parseAsync(obj)
});

const belongsToUser = (pictureId: string, userId: string) => {

    return service.exists({ _id: pictureId, userId });

};

export default Object.assign(service, { belongsToUser });