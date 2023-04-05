import { useCallback, useEffect, useState } from 'react';

import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Button, Center, Container, Flex, Grid, Group, Image, Space, Stack, Text, rem } from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react';

import { handleError } from 'utils';
import { RoutePath } from 'routes';

import { pictureApi } from 'resources/picture'

const PublishPicture: NextPage = () => {

    const { replace, push, } = useRouter()

    const [file, setFile] = useState<FileWithPath>()
    const [fileSrc, setFileSrc] = useState<string>()
    const { mutate: uploadPicture, isLoading } = pictureApi.useUploadPicture()

    useEffect(() => {

        if (file) {
            const fr = new FileReader();

            fr.onloadend = e => {
                const result = e.target?.result
                result && setFileSrc(result.toString())
            };

            fr.readAsDataURL(file);
        } else {
            setFileSrc(undefined);
        }

    }, [file])

    const handleSave = () => {
        if (file) {
            console.log("")
            const fd = new FormData();
            fd.set('file', file)
            uploadPicture(fd, {
                onSuccess: (data) => {
                    replace(`${RoutePath.Picture}?id=${data._id}`);
                },
                onError: (e) => handleError(e)
            })
        }
    }


    return (
        <>
            <Stack style={{ height: "95%" }}>
                {file && fileSrc && <Container style={{ flexGrow: 1 }}>
                    <Image
                        src={fileSrc}
                        fit='contain'
                        height={"65vh"}
                    />
                </Container>}
                {!file && <Dropzone
                    style={{ flexGrow: 1 }}
                    loading={isLoading}
                    multiple={false}
                    maxFiles={1}
                    onDrop={(files) => setFile(files[0])}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={5 * 1024 ** 2}
                    accept={[MIME_TYPES.png, MIME_TYPES.jpeg]}
                >
                    <Group
                        position='center'
                        spacing='xl'
                        style={{ minHeight: rem(220), pointerEvents: 'none' }}
                    >
                        <Dropzone.Accept>
                            <IconUpload
                                size='3.2rem'
                                stroke={1.5}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                size='3.2rem'
                                stroke={1.5}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto size='3.2rem' stroke={1.5} />
                        </Dropzone.Idle>
                        <div>
                            <Text size='xl' inline>
                                Drag images here or click to select files
                            </Text>
                            <Text size='sm' color='dimmed' inline mt={7}>
                                Attach as many files as you like, each file should not exceed 5mb
                            </Text>
                        </div>
                    </Group>
                </Dropzone>}
                <Flex
                    justify={'center'}
                    gap={12}
                >
                    <Button
                        color='green'
                        size='md'
                        disabled={!file}
                        onClick={handleSave}
                        loading={isLoading}
                    >
                        Save
                    </Button>
                    {file && <Button
                        color='red'
                        size='md'
                        variant='outline'
                        onClick={() => setFile(undefined)}
                    >
                        Cancel
                    </Button>}
                </Flex>
            </Stack >
        </>
    );
};

export default PublishPicture;