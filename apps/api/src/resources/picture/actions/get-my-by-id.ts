import { AppKoaContext, AppRouter, Next } from 'types';

import { pictureService, Picture } from 'resources/picture';

type Request = {
    params: {
        id: string;
    }
}

async function validator(ctx: AppKoaContext<Picture, Request>, next: Next) {
    const { _id: userId } = ctx.state.user;
    const { id } = ctx.request.params;

    const picture = await pictureService.findOne({ _id: id, userId });

    ctx.assertClientError(picture, { global: 'Picture not found' });

    ctx.validatedData = picture;

    await next();
};

async function handler(ctx: AppKoaContext<Picture>) {
    ctx.body = ctx.validatedData;
};

export default (router: AppRouter) => {
    router.get('/my/:id', validator, handler);
};