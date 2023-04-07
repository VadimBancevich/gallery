import { z } from 'zod';
import { AppKoaContext, AppRouter } from 'types';
import { likeService } from 'resources/picture-like'
import { validateMiddleware } from 'middlewares';

const schema = z.object({
    pictureIds: z.array(z.string()).min(1).max(100).or(z.string().transform(Array))
});

type ValidatedData = { pictureIds: string[] }

async function handler(ctx: AppKoaContext<ValidatedData>) {
    const { _id: userId } = ctx.state.user;
    const { pictureIds } = ctx.validatedData;
    console.log(pictureIds)
    const likes = await likeService.find({ likedBy: userId, pictureId: { $in: pictureIds } })

    const result: Record<string, string> = {};

    likes.results.forEach(like => {
        result[like.pictureId] = like._id
    });

    ctx.body = result;
};

export default (router: AppRouter) => {
    router.get('/my', validateMiddleware(schema), handler)
};