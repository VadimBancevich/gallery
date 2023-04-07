import { FC, useEffect, useLayoutEffect, useRef } from 'react';
import { Picture } from 'resources/picture/picture.types';
import { PictureCard, PictureCardProps } from 'components';
import { uiUtil } from 'utils';

export interface PicturesGridProps {
    pictures?: Picture[],
    wrapperProps?: React.HTMLProps<HTMLDivElement>,
    itemProps?: Omit<PictureCardProps, 'picture'> | ((picture: Picture) => PictureCardProps | undefined)
}

const PicturesGrid: FC<PicturesGridProps> = ({
    pictures,
    wrapperProps,
    itemProps
}) => {

    const divRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        divRef.current && uiUtil.layAsTile(divRef.current);
    }, [pictures, pictures?.length])

    useEffect(() => {

        const handleResize = () => { repositionPictures() };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('reset', handleResize);

    }, [])

    const repositionPictures = () => {
        divRef.current && uiUtil.layAsTile(divRef.current, { leftMargin: 5, topMargin: 5 });
    }

    const getItemProps = (picture: Picture) => {
        return typeof itemProps === 'function' ? itemProps(picture) : itemProps;
    }

    const handleImageLoad = (picture: Picture) => {
        repositionPictures();
        getItemProps(picture)?.onPictureLoaded?.();
    }

    return (
        <div {...wrapperProps} ref={divRef}>
            {pictures?.map((picture) =>
                <PictureCard
                    {...getItemProps(picture)}
                    key={picture._id}
                    picture={picture}
                    onPictureLoaded={() => handleImageLoad(picture)}
                    onError={(picture, event) => {
                        repositionPictures();
                        getItemProps(picture)?.onError?.(picture, event);
                    }}
                />)}
        </div>
    );
};

export default PicturesGrid;