export interface Like {
  _id: string;
  createdOn?: Date;
  updatedOn?: Date;
  pictureId: string;
  likedBy: string;
}

export type PictureIdToLikeId = Record<string, string>;
