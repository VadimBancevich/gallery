import { InMemoryEvent, eventBus } from '@paralect/node-mongo';
import { DATABASE_DOCUMENTS } from 'app.constants';
import { Like } from './like.types';
import { Picture, pictureService } from 'resources/picture';
import ioEmitter from 'io-emitter';
import logger from 'logger';

const { PICTURE_LIKES } = DATABASE_DOCUMENTS;

eventBus.on(`${PICTURE_LIKES}.created`, async (data: InMemoryEvent<Like>) => {
    await pictureService.atomic.updateOne(
        { _id: data.doc.pictureId },
        { $inc: { likesCount: 1 } }
    );
    notifyAboutPictureUpdatedAfterLike(data.doc);
});

eventBus.on(`${PICTURE_LIKES}.deleted`, async (data: InMemoryEvent<Like>) => {
    await pictureService.atomic.updateOne(
        { _id: data.doc.pictureId },
        { $inc: { likesCount: -1 } }
    );
    notifyAboutPictureUpdatedAfterLike(data.doc);
});

const sendUpdatedPictureToUser = (userId: string, picture: Picture) => {
    try {
        ioEmitter.publishToUser(userId, 'picture:updated', picture);
    } catch (err) {
        logger.error(`${PICTURE_LIKES} handler error: ${err}`)
    }
};

const notifyAboutPictureUpdatedAfterLike = async (like: Like) => {
    const picture = await pictureService.findOne({ _id: like.pictureId });
    picture && sendUpdatedPictureToUser(like.likedBy, picture);
};