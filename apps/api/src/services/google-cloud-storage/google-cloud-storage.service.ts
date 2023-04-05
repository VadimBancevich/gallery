import { Storage, } from '@google-cloud/storage';
import { File } from '@koa/multer';
import { getFileLocation } from './google-cloud-storage.helper';

const storage = new Storage();
const bucket = storage.bucket('gallery-382618.appspot.com');

const uploadPublic = async (filename: string, file: File) => {

    const bucketFile = bucket.file(`${filename}`);

    await bucketFile.save(file.buffer, {
        public: true
    });

    return bucketFile;
};

const deletePublic = async (filePublicUrl: string) => {
    const { filePath } = getFileLocation(filePublicUrl);
    await bucket.file(filePath).delete();
}

const tryDeletePublic = async (filePublicUrl: string) => {
    try {
        await deletePublic(filePublicUrl);
        return true;
    } catch {
        return false;
    }
}

export default {
    uploadPublic,
    deletePublic,
    tryDeletePublic
};
