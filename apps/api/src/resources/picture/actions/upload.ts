import multer from '@koa/multer';

import { AppKoaContext, AppRouter, Next } from 'types';

import { googleCloudService } from 'services';

import { pictureService, PictureVisibility } from 'resources/picture';

const upload = multer();

const validFileExtensions = ['jpeg', 'jpg', 'png'];

async function validator(ctx: AppKoaContext, next: Next) {
    const { file } = ctx;

    ctx.assertClientError(file, {
        file: 'File is required'
    });

    ctx.assertClientError(file.originalname, {
        file: 'Unknown file name'
    });

    ctx.assertClientError(file.originalname.match(/^.*\.[^.]+$/), {
        file: 'File has no extension'
    });

    const isValidFileType = validFileExtensions.some((value) => file.originalname.endsWith(value));

    ctx.assertClientError(isValidFileType, {
        file: `File extension must be in ${validFileExtensions}`
    });

    await next();
};

async function handler(ctx: AppKoaContext) {
    const { file } = ctx;
    const { user } = ctx.state;

    const filename = `${user._id}-${Date.now()}-${file.originalname}`

    const savedFile = await googleCloudService.uploadPublic(`pictures/${filename}`, file)

    const savedPicture = await pictureService.insertOne({
        userId: user._id,
        imageUrl: savedFile.publicUrl(),
        visibility: PictureVisibility.PRIVATE
    });

    ctx.body = { ...savedPicture };
};

export default (router: AppRouter) => {
    router.post('/', upload.single('file'), validator, handler);
};