import React, { FC, useState, SyntheticEvent, useEffect, useLayoutEffect } from 'react';
import { Card, Image } from '@mantine/core';

import { pictureTypes } from 'resources/picture';

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
    onError
}) => {

    const [loadErr, setLoadErr] = useState<{ event: SyntheticEvent<HTMLDivElement, Event> }>();

    useLayoutEffect(() => {
        loadErr && onError?.(picture, loadErr.event);
    }, [loadErr])

    if (nullIfError && loadErr) {
        return null;
    }

    return (
        <Card
            p={2}
            style={{ width: '200px', cursor: !loadErr || allowClickIfError ? 'pointer' : undefined }}
            onClick={() => (allowClickIfError || !loadErr) && onClick?.(picture)}
        >
            <Image
                src={picture.imageUrl}
                onError={(e) => {
                    console.warn(`Failed load image '${picture.imageUrl}'`)
                    setLoadErr({ event: e });
                }}
                onLoad={onPictureLoaded}
                withPlaceholder={true}
                imageProps={loadErr ? { style: { height: '150px' } } : undefined}
            />
        </Card>
    );
};


export default PictureCard;
