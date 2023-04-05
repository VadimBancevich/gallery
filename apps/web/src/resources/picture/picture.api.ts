import queryClient from 'query-client';

import { QueryKey, UseQueryOptions, useMutation, useQuery } from 'react-query';
import { typesUtil } from 'utils';
import { apiService } from 'services';
import { Picture } from './picture.types';

export function useSearch<T>(params?: T) {
    const page = () => apiService.get('/pictures', params);

    return useQuery<typesUtil.Page<Picture>>(['pictures', params], page);
};

export function useGetPicture(id: string, options?: Omit<UseQueryOptions<Picture, unknown, Picture, QueryKey>, "queryKey" | "queryFn"> | undefined) {
    const picture = () => apiService.get(`/pictures/${id}`);

    return useQuery<Picture>([`picture-${id}`], picture, options);
};

export function useUploadPicture<T>() {
    const upload = (data: T) => apiService.post('/pictures', data);

    return useMutation<Picture, unknown, T>(upload, {
        onSuccess: data => {
            queryClient.setQueryData([`picture-${data._id}`], data)
        }
    });
};

export function useGetMyPictures<T>(params?: T) {
    const page = () => apiService.get('/pictures/my', params);

    return useQuery<typesUtil.Page<Picture>>('my-pictures', page);
}

export function useUpdatePicture<T>() {
    const update = (data: T) => apiService.put('/pictures', data);

    return useMutation<Picture, unknown, T>(update, {
        onSuccess: (savedData) => {
            queryClient.setQueryData([`picture-${savedData._id}`], savedData);
        }
    });
}

export function useDeletePicture() {
    const deletePicture = (id: string) => apiService.delete(`/pictures/${id}`);

    return useMutation<Picture, unknown, string>(deletePicture);
}