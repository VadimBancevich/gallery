import { useEffect, useRef, FC, useState, useCallback, useLayoutEffect } from 'react';

import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { Button, Card, Container, Flex, Group, Image, Loader, Modal, Stack, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

import { PicturesGrid } from 'components';

import { RoutePath } from 'routes';

import { pictureApi, pictureTypes } from 'resources/picture';

const PictureItem: FC<{
    picture: pictureTypes.Picture,
    onClick?: (picture: pictureTypes.Picture) => void,
    allowClickIfError?: boolean,
    onPictureLoaded?: () => void
}> = ({
    picture,
    onClick,
    allowClickIfError,
    onPictureLoaded
}) => {

        const [isErr, setIsErr] = useState(false);

        if (isErr) {
            return null;
        }

        return (
            <Card
                p={2}
                style={{ width: '200px', cursor: isErr ? undefined : 'pointer' }}
                onClick={() => (allowClickIfError || !isErr) && onClick?.(picture)}
            >
                <Image
                    src={picture.imageUrl}
                    onError={() => {
                        console.warn(`Failed load image '${picture.imageUrl}'`)
                        setIsErr(true);
                    }}
                    onLoad={onPictureLoaded}
                    withPlaceholder={isErr}
                    imageProps={isErr ? { style: { height: '150px' } } : undefined}
                />
            </Card>
        );
    };

const GalleryHome: NextPage = () => {

    const { data, isLoading } = pictureApi.useSearch({});
    const [opened, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width:450px)')
    const [modalPicture, setModalPicture] = useState<pictureTypes.Picture>()
    const ref = useRef<HTMLDivElement>(null);

    const handlePictureCardClick = (picture: pictureTypes.Picture) => {
        setModalPicture(picture);
        open();
    };

    return (
        <>
            <Head>
                <title>Gallery</title>
            </Head>
            <Stack>
                <Stack align='end'>
                    <Link href={RoutePath.UploadPicture}>
                        <Button size='md'>Publish picture</Button>
                    </Link>
                </Stack>

                <PicturesGrid
                    pictures={data?.items}
                    itemProps={{
                        nullIfError: true,
                        onClick: handlePictureCardClick
                    }}
                />
            </Stack>
            <Modal
                opened={opened}
                onClose={close}
                centered
                padding={2}
                title={modalPicture?.name || 'Picture'}
                size={'100%'}
            >
                <Flex
                    direction={isMobile ? 'column' : 'row'}
                    align={'center'}
                >
                    <div>
                        <Image
                            fit='contain'
                            width={"auto"}
                            imageProps={{
                                style: {
                                    maxHeight: "80vh",
                                    maxWidth: "80vw"
                                }
                            }}
                            src={modalPicture?.imageUrl}
                        />
                    </div>
                    <Container style={{ width: "300px" }}>
                        <Text>{modalPicture?._id}</Text>
                    </Container>
                </Flex>
            </Modal>
        </>
    );
};

export default GalleryHome;