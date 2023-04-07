import { z } from 'zod';

import schema from './picture.schema'

export enum PictureVisibility {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC'
}

export type Picture = z.infer<typeof schema>