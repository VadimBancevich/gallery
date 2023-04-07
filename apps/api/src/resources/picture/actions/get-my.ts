import { z } from 'zod';
import { SortDirection } from '@paralect/node-mongo';

import { AppKoaContext, AppRouter } from 'types';
import { validateMiddleware } from 'middlewares';
import { pictureService } from 'resources/picture';

const schema = z.object({
    page: z.string().optional().default('1').transform(Number),
    perPage: z.string().optional().default('30').transform(Number),
    sort: z.object({
        createdOn: z.string()
    }).default({ createdOn: 'desc' })
});

type ValidatedData = Omit<z.infer<typeof schema>, 'sort'> & {
    sort: { [key: string]: SortDirection };
};

async function handler(ctx: AppKoaContext<ValidatedData>) {

    const { _id: userId } = ctx.state.user;
    const { page, perPage, sort } = ctx.validatedData;

    const pictures = await pictureService.find({ userId }, { page, perPage }, { sort });

    ctx.body = {
        items: pictures.results,
        totalPages: pictures.pagesCount,
        count: pictures.count,
    };
}

export default (router: AppRouter) => {
    router.get('/my', validateMiddleware(schema), handler)
};