import { z } from 'zod';
import { PictureVisibility } from './picture.types';

const schema = z.object({
    _id: z.string(),
    createdOn: z.date().optional(),
    updatedOn: z.date().optional(),
    userId: z.string(),
    imageUrl: z.string(),
    name: z.string().max(100).optional(),
    description: z.string().max(500).optional(),
    visibility: z.nativeEnum(PictureVisibility).default(PictureVisibility.PRIVATE)
});

export default schema