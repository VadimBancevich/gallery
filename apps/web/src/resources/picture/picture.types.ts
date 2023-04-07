export enum PictureVisibility {
    PRIVATE = 'PRIVATE',
    PUBLIC = 'PUBLIC'
}

export interface Picture {
    _id: string;
    createdOn?: Date;
    updatedOn?: Date;
    name?: string;
    description?: string;
    imageUrl: string;
    visibility: PictureVisibility,
    likesCount: number
}