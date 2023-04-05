import { AppKoaContext, AppRouter, Next } from 'types';

import { PictureVisibility, pictureService, Picture } from 'resources/picture';

type Request = {
    params: {
        id: string;
    }
};

async function validator(ctx: AppKoaContext<any, Request>, next: Next) {
    const { _id: userId } = ctx.state?.user;
    const { id: _id } = ctx.request.params;

    const picture = await pictureService.findOne({ _id });

    ctx.assertClientError(picture, { global: 'Picture not found' });
    ctx.assertClientError(
        picture.visibility === PictureVisibility.PUBLIC || picture.userId === userId,
        { global: 'Forbidden' }
    );

    ctx.validatedData = picture;

    await next();
};

async function handler(ctx: AppKoaContext<Picture>) {
    ctx.body = ctx.validatedData;
};

export default (router: AppRouter) => {
    router.get('/:id', validator, handler)
};