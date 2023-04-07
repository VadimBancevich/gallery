import { z } from 'zod';

const schema = z.object({
    _id: z.string(),
    createdOn: z.date().optional(),
    updatedOn: z.date().optional(),
    likedBy: z.string(),
    pictureId: z.string()
});

export default schema;