import { z } from 'zod';
import { Flex, Image, Loader, Modal, Stack, Text, TextInput, Radio, Textarea, Button, Group, Menu, Center } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSettings, IconTrash } from '@tabler/icons-react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { pictureApi, pictureTypes } from 'resources/picture';
import { PicturesGrid } from 'components';
import { useDisclosure, useMediaQuery, useScrollLock, useWindowScroll } from '@mantine/hooks';
import { useForm } from 'react-hook-form';
import { modals } from '@mantine/modals';
import Link from 'next/link';
import { RoutePath } from 'routes';

const schema = z.object({
  _id: z.string(),
  name: z.string().max(255, 'Too long').optional(),
  description: z.string().max(500, 'Too long').optional(),
  visibility: z.nativeEnum(pictureTypes.PictureVisibility),
});

type UpdateParams = z.infer<typeof schema>;

const MyCollection: NextPage = () => {
  const [params, setParams] = useState();

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } = pictureApi.useGetMyPicturesInfinity(params);
  const { mutate: updatePicture, isLoading: isPictureUpdating } = pictureApi.useUpdatePicture();
  const { mutate: deletePicture } = pictureApi.useDeletePicture();
  const [scroll] = useWindowScroll();

  const pictures = useMemo(() => data?.pages.flatMap((page) => page.items) || [], [data]);

  const [opened, { open, close }] = useDisclosure(false);
  const [modalPicture, setModalPicture] = useState<pictureTypes.Picture>();
  const isMobile = useMediaQuery('(max-width:450px)');
  const { register, reset, handleSubmit } = useForm<UpdateParams>();

  useEffect(() => {

    if (!isFetching && !isLoading && hasNextPage && document.scrollingElement?.scrollHeight && document.scrollingElement.scrollHeight - (window.innerHeight + document.documentElement.scrollTop) < 10) {
      fetchNextPage();
    }
  }, [scroll.y]);

  const openConfirmDeletePictureModal = () => {
    modals.openConfirmModal({
      title: 'Delete picture',
      centered: true,
      children: (
        <Text align="center">Are you sore to delete picture ?</Text>
      ),
      labels: { cancel: 'Cancel', confirm: 'Delete' },
      confirmProps: { color: 'red', variant: 'outline' },
      cancelProps: { color: 'blue', variant: 'filled' },
      onConfirm: () => {
        if (modalPicture?._id) {
          deletePicture(modalPicture._id, {
            onSuccess: () => {
              close();
              setModalPicture(undefined);
              notifications.show({
                message: 'Picture has been deleted !',
              });
            },
          });
        }
      },
    });
  };

  if (isLoading) {
    return (
      <Stack align="center">
        <Loader />
      </Stack>
    );
  }

  const handlePictureClick = (picture: pictureTypes.Picture) => {
    open();
    setModalPicture(picture);
    const { _id, visibility, name, description } = picture;
    reset({
      _id, description, name, visibility,
    });
  };

  const onSubmit = (params: UpdateParams) => {
    console.log(params);
    updatePicture(params, {
      onSuccess: () => {
        notifications.show({ message: 'Picture Saved', color: 'green' });
      },
    });
  };

  return (
    <>
      <Head>
        <title>My Collection</title>
      </Head>
      <Group position="right" mb={12}>
        <Link type="route" href={RoutePath.UploadPicture}>
          <Button
            leftIcon={<IconPlus />}
            color="green"
            size="md"
          >
            Upload picture
          </Button>
        </Link>
      </Group>
      {!isFetching && !pictures.length && <div>Your collection is empty</div>}
      <PicturesGrid
        pictures={pictures}
        itemProps={{
          onClick: handlePictureClick,
          allowClickIfError: true,
        }}
      />
      {isLoading || isFetching && <Center>
        <Loader />
      </Center>}
      <Modal
        opened={opened}
        onClose={close}
        size="auto"
        title={modalPicture?.name || <div />}
      >
        <Flex direction={isMobile ? 'column' : 'row'} justify="center" gap="12px">
          <Image
            src={modalPicture?.imageUrl}
            width="fit-content"
            imageProps={{
              style: {
                maxHeight: '80vh',
                maxWidth: '100%',
                objectFit: 'contain',
              },
            }}
          />
          <form
            style={{ width: isMobile ? '100%' : '250px' }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack>
              <div style={{ marginLeft: ' auto' }}>
                <Menu>
                  <Menu.Target>
                    <Button
                      size="sm"
                      variant="default"
                      leftIcon={<IconSettings />}
                    >
                      Settings
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown p={10}>
                    <Menu.Item
                      color="red"
                      icon={<IconTrash size={14} />}
                      closeMenuOnClick={false}
                      onClick={openConfirmDeletePictureModal}
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
              <TextInput
                {...register('name')}
                label="Name"
                size="sm"
              />
              <Group>
                <Radio
                  {...register('visibility')}
                  label="Public"
                  value={pictureTypes.PictureVisibility.PUBLIC}
                />
                <Radio
                  {...register('visibility')}
                  label="Private"
                  value={pictureTypes.PictureVisibility.PRIVATE}
                />
              </Group>
              <Textarea
                {...register('description')}
                label="Description"
                autosize
                maxRows={10}
              />
              <Button type="submit" disabled={isPictureUpdating}>
                Save
              </Button>
            </Stack>
          </form>
        </Flex>
      </Modal>
    </>
  );
};

export default MyCollection;
