import { z } from 'zod';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { PictureVisibility, pictureService } from 'resources/picture';
import { SortDirection } from '@paralect/node-mongo';

const schema = z.object({
    page: z.string().transform(Number).default('1'),
    perPage: z.string().transform(Number).default('30'),
    sort: z.enum(['NEWEST', 'OLDEST', 'MOST_LIKED']).default('NEWEST').transform(async (value) => {
        if (value === 'NEWEST') {
            return { createdOn: 'desc' };
        } else if (value === 'OLDEST') {
            return { createdOn: 'asc' };
        } else {
            return { likesCount: 'desc' };
        }
    })
});

type ValidatedData = Omit<z.infer<typeof schema>, 'sort'> & { sort: { [key: string]: SortDirection } }

async function handler(ctx: AppKoaContext<ValidatedData>) {

    const { page, perPage, sort } = ctx.validatedData;

    const pictures = await pictureService.find(
        { visibility: PictureVisibility.PUBLIC },
        { page, perPage },
        { sort }
    )

    ctx.body = {
        items: pictures.results,
        totalPages: pictures.pagesCount,
        count: pictures.count
    }

};

export default (router: AppRouter) => {
    router.get('/', validateMiddleware(schema), handler)
}