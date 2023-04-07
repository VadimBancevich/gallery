import React, { FC, useState, SyntheticEvent, useLayoutEffect } from 'react';
import { ActionIcon, Card, Group, Image, Text } from '@mantine/core';

import { pictureTypes } from 'resources/picture';
import { IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react';
import { likeApi } from 'resources/picture-like';

export interface PictureCardProps {
  picture: pictureTypes.Picture,
  onClick?: (picture: pictureTypes.Picture) => void,
  allowClickIfError?: boolean,
  nullIfError?: boolean,
  onError?: (picture: pictureTypes.Picture, event: SyntheticEvent<HTMLDivElement, Event>) => void,
  onPictureLoaded?: () => void
}

const PictureCard: FC<PictureCardProps> = ({
  picture,
  onClick,
  allowClickIfError,
  nullIfError,
  onPictureLoaded,
  onError,
}) => {
  const [loadErr, setLoadErr] = useState<{ event: SyntheticEvent<HTMLDivElement, Event> }>();
  const { data: myLikes, isFetching } = likeApi.useGetMyLikes([picture._id]);
  const { mutate: like, isLoading: isLikeLoading } = likeApi.useLikePicture();
  const { mutate: removeLike, isLoading: isRemoveLikeLoading } = likeApi.useRemoveLike();

  useLayoutEffect(() => {
    loadErr && onError?.(picture, loadErr.event);
  }, [loadErr]);

  if (nullIfError && loadErr) {
    return null;
  }

  const isLiked = Boolean(myLikes?.[picture._id]);

  const handleLikeClick = () => {
    if (!isFetching && !isLikeLoading && !isRemoveLikeLoading) {
      if (isLiked) {
        removeLike(picture._id);
      } else {
        like(picture._id);
      }
    }
  };

  return (
    <Card
      p={2}
      style={{ width: '200px', cursor: !loadErr || allowClickIfError ? 'pointer' : undefined }}
      onClick={() => (allowClickIfError || !loadErr) && onClick?.(picture)}
    >
      <Image
        src={picture.imageUrl}
        onError={(e) => {
          console.warn(`Failed load image '${picture.imageUrl}'`);
          setLoadErr({ event: e });
        }}
        onLoad={onPictureLoaded}
        withPlaceholder
        imageProps={loadErr ? { style: { height: '150px' } } : undefined}
      />
      <Group position="right" p={2}>
        <Text>{picture.likesCount}</Text>
        <ActionIcon onClick={(e) => { e.stopPropagation(); }}>
          {isLiked ? <IconThumbUpFilled onClick={handleLikeClick} /> : <IconThumbUp onClick={handleLikeClick} />}
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default PictureCard;
