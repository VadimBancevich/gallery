import { z } from 'zod';

import { pictureService } from 'resources/picture';
import { PictureVisibility } from 'resources/picture/picture.types';
import { AppKoaContext, AppRouter, Next } from 'types';
import { validateMiddleware } from 'middlewares';

const schema = z.object({
    _id: z.string(),
    name: z.string().max(100).optional(),
    description: z.string().max(500).optional(),
    visibility: z.nativeEnum(PictureVisibility)
});

type ValidatedData = z.infer<typeof schema>;

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
    const { user } = ctx.state;
    const { _id } = ctx.validatedData;

    const isBelongsToUser = await pictureService.belongsToUser(_id, user._id);

    ctx.assertError(isBelongsToUser, "Forbidden. User is not picture's owner.");

    await next();
};

async function handler(ctx: AppKoaContext<ValidatedData>) {

    const { _id, name, description, visibility } = ctx.validatedData;
    console.log("Validated data", ctx.validatedData)
    const updatedPicture = await pictureService.updateOne({ _id }, () => ({ name, description, visibility }));
    console.log("Updated data   ", updatedPicture)
    ctx.body = { ...updatedPicture };

};


export default (router: AppRouter) => {
    router.put('/', validateMiddleware(schema), validator, handler);
};
