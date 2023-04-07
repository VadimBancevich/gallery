import { AppKoaContext, AppRouter, Next } from 'types';

import { pictureService } from 'resources/picture';
import { likeService } from 'resources/picture-like';

type Request = {
    params: {
        pictureId: string
    }
}

type validatedData = { pictureId: string };

async function validator(ctx: AppKoaContext<validatedData, Request>, next: Next) {
    const { _id: userId } = ctx.state.user;
    const { pictureId } = ctx.request.params;

    const isPictureExists = await pictureService.exists({ _id: pictureId });

    ctx.assertError(isPictureExists, 'Picture not found');

    const isAlreadyLiked = await likeService.exists({ pictureId, likedBy: userId });

    ctx.assertError(!isAlreadyLiked, 'Already liked');

    ctx.validatedData = { pictureId };

    await next();
};

async function handler(ctx: AppKoaContext<validatedData>) {
    const { _id: userId } = ctx.state.user;
    const { pictureId } = ctx.validatedData;

    const savedLike = await likeService.insertOne({ pictureId, likedBy: userId });

    ctx.body = savedLike;
};

export default (router: AppRouter) => {
    router.get('/:pictureId', validator, handler)
};