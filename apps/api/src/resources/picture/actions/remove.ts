import { AppKoaContext, AppRouter, Next } from 'types';
import { pictureService, Picture } from 'resources/picture';
import { googleCloudService } from 'services';

type Request = {
    params: {
        id: string;
    }
};

type ValidatedData = Picture

async function validator(ctx: AppKoaContext<unknown, Request>, next: Next) {
    const { _id: userId } = ctx.state.user;
    const picture = await pictureService.findOne({ _id: ctx.request.params.id })

    ctx.assertError(picture !== null, 'Picture not found');

    ctx.assertError(picture.userId === userId, 'Forbidden. Delete can only owner.');

    ctx.validatedData = picture;

    await next();

}

async function handler(ctx: AppKoaContext<ValidatedData, Request>) {
    const { _id, imageUrl } = ctx.validatedData;

    googleCloudService.tryDeletePublic(imageUrl);
    
    await pictureService.deleteOne({ _id });

    ctx.body = ctx.validatedData;
}

export default (router: AppRouter) => {
    router.delete('/:id', validator, handler);
};