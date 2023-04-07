import { socketService } from 'services';
import { Picture } from './picture.types';
import { updatePictureInCache } from './picture.api';

socketService.on('picture:updated', (data: Picture) => {
    updatePictureInCache(data)
});