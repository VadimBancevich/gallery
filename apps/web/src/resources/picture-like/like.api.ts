import { QueryKey, UseInfiniteQueryOptions, UseQueryOptions, useInfiniteQuery, useMutation, useQuery } from 'react-query';
import queryClient from 'query-client';
import { apiService } from 'services';
import { Like, PictureIdToLikeId } from './like.types';

type GetMyLikesOptionsType = Omit<UseQueryOptions<PictureIdToLikeId, unknown, PictureIdToLikeId, QueryKey>, "queryKey" | "queryFn">

const MY_LIKES_QUERY_KEY = 'my-likes'

export function useGetMyLikes(pictureIds: string[], options?: GetMyLikesOptionsType) {
    const myLikes = () => apiService.get('/picture-likes/my', { pictureIds: pictureIds })

    return useQuery<PictureIdToLikeId>([MY_LIKES_QUERY_KEY, pictureIds], myLikes, options)
}

export function useLikePicture() {
    const like = (pictureId: string) => apiService.get(`/picture-likes/${pictureId}`);

    return useMutation<Like, unknown, string>(like, {
        onSuccess: (data) => {
            queryClient.setQueriesData<PictureIdToLikeId>([MY_LIKES_QUERY_KEY], (prev) => {
                prev && (prev[data.pictureId] = data._id);
                return { ...prev };
            })
        }
    });
}

export function useRemoveLike() {
    const remove = (pictureId: string) => apiService.delete(`/picture-likes/${pictureId}`);

    return useMutation<Like, unknown, string>(remove, {
        onSuccess: (data) => {
            queryClient.setQueriesData<PictureIdToLikeId>([MY_LIKES_QUERY_KEY], (prev) => {
                prev && delete prev[data.pictureId];
                return { ...prev };
            })
        }
    });
}

export function useGetMyLikesInfinity(pictureIds: string[], options?: Omit<UseInfiniteQueryOptions<PictureIdToLikeId, unknown, PictureIdToLikeId, PictureIdToLikeId, QueryKey>, "queryKey" | "queryFn"> | undefined) {
    const myLikes = () => apiService.get('/picture-likes/my', { pictureIds: pictureIds });

    return useInfiniteQuery<PictureIdToLikeId>(['picture-likes', 'infinity', pictureIds], myLikes, options);
};