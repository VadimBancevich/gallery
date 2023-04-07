import { useEffect, useMemo, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { NextPage } from 'next';

import { Button, Center, Flex, Group, Image, Loader, Modal, Select, Stack, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery, useWindowScroll } from '@mantine/hooks';

import { PicturesGrid } from 'components';

import { RoutePath } from 'routes';

import { pictureApi, pictureTypes } from 'resources/picture';
import { useRouter } from 'next/router';

interface SearchParams {
    perPage?: number,
    sort?: 'NEWEST' | 'OLDEST' | 'MOST_LIKED'
}

const GalleryHome: NextPage = () => {

    const [opened, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width:450px)')
    const [modalPicture, setModalPicture] = useState<pictureTypes.Picture>()
    const { route, replace, query } = useRouter()
    const [params, setParams] = useState<SearchParams>({ perPage: 20 })
    const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = pictureApi.useInfiniteSearch(params);

    const pictures = useMemo(() => {
        return data?.pages.flatMap(page => page.items) || []
    }, [data])

    useEffect(() => {
        setParams({ ...params, ...query })
    }, [query])

    const [scroll] = useWindowScroll();

    useEffect(() => {
        if (!isFetching && !isLoading && hasNextPage && document.scrollingElement?.scrollHeight && document.scrollingElement.scrollHeight - (window.innerHeight + document.documentElement.scrollTop) < 10) {
            fetchNextPage();
        }
    }, [scroll.y])

    const handlePictureCardClick = (picture: pictureTypes.Picture) => {
        setModalPicture(picture);
        open();
    };

    const handleSortChange = (value: string | null) => {
        if (value) {
            replace({
                pathname: route,
                query: { ...query, sort: value }
            })
        }
    }
    return (
        <>
            <Head>
                <title>Gallery</title>
            </Head>
            <Stack>
                <Group style={{ justifyContent: 'space-between' }}>
                    <Select
                        data={[
                            { value: "NEWEST", label: "Newest" },
                            { value: "OLDEST", label: "Oldest", },
                            { value: "MOST_LIKED", label: "Most Liked" }
                        ]}
                        size='md'
                        onChange={handleSortChange}
                        value={query.sort as string || "NEWEST"}
                        variant='unstyled'
                    >

                    </Select>
                    <Link href={RoutePath.UploadPicture}>
                        <Button size='md'>Upload picture</Button>
                    </Link>
                </Group>
                <PicturesGrid
                    pictures={pictures}
                    itemProps={{
                        nullIfError: true,
                        onClick: handlePictureCardClick
                    }}
                />
                {isFetching && <Center> <Loader /></Center>}
            </Stack>
            <Modal
                opened={opened}
                onClose={close}
                centered
                padding={2}
                title={modalPicture?.name || 'Picture'}
                size={'auto'}
            >
                <Flex
                    direction={isMobile ? 'column' : 'row'}
                >
                    <div>
                        <Image
                            fit='contain'
                            width={'100%'}
                            imageProps={{
                                style: {
                                    maxHeight: "80vh",
                                    maxWidth: "100%"
                                }
                            }}
                            src={modalPicture?.imageUrl}
                        />
                    </div>
                    {(modalPicture?.name || modalPicture?.description) && <Stack style={{ width: isMobile ? '100%' : '200px' }} p={10}>
                        <Text fw={'bold'} size={'lg'}>{modalPicture?.name}</Text>
                        <Text italic size={'md'}>{modalPicture?.description}</Text>
                    </Stack>}
                </Flex>
            </Modal>
        </>
    );
};

export default GalleryHome;