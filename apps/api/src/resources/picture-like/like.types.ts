import { z } from 'zod';

import schema from './like.schema';

export type Like = z.infer<typeof schema>;