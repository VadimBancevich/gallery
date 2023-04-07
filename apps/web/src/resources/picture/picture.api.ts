import queryClient from 'query-client';

import { QueryKey, UseQueryOptions, useMutation, useQuery, useInfiniteQuery, InfiniteData } from 'react-query';
import { typesUtil } from 'utils';
import { apiService } from 'services';
import { Picture } from './picture.types';
import { pictureTypes } from '.';

const PICTURES_QUERY_KEY = 'pictures';

type OptionsType = Omit<UseQueryOptions<typesUtil.Page<Picture>, unknown, typesUtil.Page<Picture>, QueryKey>, "queryKey" | "queryFn"> | undefined;

type PicturesPage = typesUtil.Page<pictureTypes.Picture>;

export function useSearch<T>(params?: T, options?: OptionsType) {
    const page = () => apiService.get('/pictures', params);

    return useQuery<PicturesPage>([PICTURES_QUERY_KEY, 'page', params], page);
};

export function useInfiniteSearch<T>(params?: T) {
    const search = ({ pageParam = 1 }) => apiService.get('/pictures', { ...params, page: pageParam });

    return useInfiniteQuery<typesUtil.Page<pictureTypes.Picture>>([PICTURES_QUERY_KEY, 'pictures-infinite', params], search, {
        getNextPageParam: (lastPage, allPages) => {
            if (allPages.length < lastPage.totalPages) {
                return allPages.length + 1;
            }
        }
    })
}

export function useGetPicture(id: string, options?: Omit<UseQueryOptions<Picture, unknown, Picture, QueryKey>, "queryKey" | "queryFn"> | undefined) {
    const picture = () => apiService.get(`/pictures/${id}`);

    return useQuery<Picture>([`picture-${id}`], picture, options);
};

export function useUploadPicture<T>() {
    const upload = (data: T) => apiService.post('/pictures', data);

    return useMutation<Picture, unknown, T>(upload, {
        onSuccess: () => {
            removePicturesQuery();
        }
    });
};

export function useGetMyPictures<T>(params?: T) {
    const page = () => apiService.get('/pictures/my', params);

    return useQuery<PicturesPage>(['my-pictures', 'page', params], page);
}

export function useGetMyPicturesInfinity<T>(params?: T) {
    const search = ({ pageParam = 1 }) => apiService.get('/pictures/my', { ...params, page: pageParam });

    return useInfiniteQuery<PicturesPage>(['my-pictures', 'pictures-infinite', params], search, {
        getNextPageParam: (last, all) => {
            if (last.totalPages < all.length) {
                return all.length + 1;
            }
        }
    });
}

export function useUpdatePicture<T>() {
    const update = (data: T) => apiService.put('/pictures', data);

    return useMutation<Picture, unknown, T>(update, {
        onSuccess: (savedData) => {
            updatePictureInCache(savedData)
        }
    });
}

export function useDeletePicture() {
    const deletePicture = (id: string) => apiService.delete(`/pictures/${id}`);

    return useMutation<Picture, unknown, string>(deletePicture, {
        onSuccess: () => {
            removePicturesQuery()
        }
    });
}

export function updatePictureInCache(picture: Picture) {

    const updaterInfinityData = (data?: InfiniteData<PicturesPage>) => {
        return {
            ...data,
            pages: data?.pages.map(page => ({
                ...page,
                items: page.items.map((prev) => prev._id === picture._id ? picture : prev)
            }))
        } as InfiniteData<PicturesPage>
    }

    const updaterPageData = (page?: PicturesPage) => {
        return {
            ...page,
            items: page?.items.map(prev => prev._id === picture._id ? picture : prev)
        } as PicturesPage
    }

    queryClient.setQueriesData<InfiniteData<PicturesPage>>([PICTURES_QUERY_KEY, 'pictures-infinite'], updaterInfinityData);
    queryClient.setQueriesData<InfiniteData<PicturesPage>>(['my-pictures', 'pictures-infinite'], updaterInfinityData);

    queryClient.setQueriesData<PicturesPage>([PICTURES_QUERY_KEY, 'page'], updaterPageData);
    queryClient.setQueriesData<PicturesPage>(['my-pictures', 'page'], updaterPageData);
}

const removePicturesQuery = () => {
    queryClient.removeQueries([PICTURES_QUERY_KEY]);
    queryClient.removeQueries(['my-pictures']);
}