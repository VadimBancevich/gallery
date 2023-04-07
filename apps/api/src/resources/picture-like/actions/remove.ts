import { AppKoaContext, AppRouter, Next } from 'types';
import { likeService } from 'resources/picture-like'

type Request = {
    params: { pictureId: string }
};

type ValidatedData = { pictureId: string };

async function validator(ctx: AppKoaContext<ValidatedData, Request>, next: Next) {
    const { _id: userId } = ctx.state.user;
    const { pictureId } = ctx.request.params;

    const isLiked = await likeService.exists({ likedBy: userId, pictureId });

    ctx.assertError(isLiked, 'Not liked');

    ctx.validatedData = { pictureId };
    
    await next();
};

async function handler(ctx: AppKoaContext<ValidatedData>) {
    const { _id: userId } = ctx.state.user;
    const { pictureId } = ctx.validatedData;

    const like = await likeService.deleteOne({ likedBy: userId, pictureId });

    ctx.body = like;
};

export default (router: AppRouter) => {
    router.delete('/:pictureId', validator, handler)
};