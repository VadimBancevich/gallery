import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { PictureVisibility, pictureService } from 'resources/picture';

const schema = z.object({
    page: z.string().transform(Number).default('1'),
    perPage: z.string().transform(Number).default('30')
});

type ValidatedData = z.infer<typeof schema>

async function handler(ctx: AppKoaContext<ValidatedData>) {

    const { page, perPage } = ctx.validatedData;

    const pictures = await pictureService.find({
        visibility: PictureVisibility.PUBLIC
    }, { page, perPage }, { sort: { "createdOn": "desc" } })

    ctx.body = {
        items: pictures.results,
        totalPages: pictures.pagesCount,
        count: pictures.count
    }

};

export default (router: AppRouter) => {
    router.get('/', validateMiddleware(schema), handler)
}