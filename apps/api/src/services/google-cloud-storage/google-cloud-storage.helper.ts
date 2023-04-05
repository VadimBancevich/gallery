export const getFileLocation = (url: string) => {
    const { pathname } = new URL(decodeURIComponent(url));
    return {
        bucketName: pathname.substring(1, pathname.indexOf('/', 1)),
        filePath: pathname.substring(pathname.indexOf('/', 1) + 1)
    }
}