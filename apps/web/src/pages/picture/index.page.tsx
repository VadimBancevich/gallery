import { z } from 'zod';
import Head from 'next/head';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Image } from '@mantine/core';

import { pictureApi, pictureTypes } from 'resources/picture';

import { RoutePath } from 'routes';
import { handleError } from 'utils';
import { useFormState } from 'react-hook-form';
import { PictureVisibility } from '../../resources/picture/picture.types';

const schema = z.object({
    _id: z.string(),
    name: z.string().max(255, 'Too long').optional(),
    description: z.string().max(500, 'To long').optional(),
    visibility: z.nativeEnum(PictureVisibility)
})

const Picture: NextPage<{ id: string }> = () => {

    const { query, replace } = useRouter()
const {id} = query
    console.log(query)
    // useFormState<pictureTypes.Picture>()

    if (typeof id !== 'string') {
        console.warn("Page required param id is not preset. Redirect to home");
        // replace(RoutePath.Home);
        // return null;
    }

    const { data, isLoading } = pictureApi.useGetPicture(id as any, {
        onError: (err: any) => {
            handleError(err);
            // replace(RoutePath.Home);
        }
    });

    return (
        <>
            <Head>
                <title>Picture</title>
            </Head>
            <div>Picture page</div>
            <Image src={data?.imageUrl} />
        </>
    )

}

export default Picture;