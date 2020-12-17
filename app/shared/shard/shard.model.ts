import { User } from '../user/user.model';

export class Shard {
    backgroundImage: string;
    bit: number;
    boards: any[];
    comments: any[];
    commentsNumber: number;
    creationDate: Date;
    description: string;
    followNumber: number;
    geoplace: any = {};
    id: number = 0;
    inputUrl: URL;
    likeNumber: number = 0;
    likeUser: boolean = false;
    masterId: number = 0;
    nearestPoi: any = {};
    nearestPoiId: number;
    place: any = {};
    planCount: number = 0;
    siteName: string = '';
    title: string = '';
    type: string = '';
    upLoadfileName: string;
    uploadPhotoId: string;
    user: User;
    userId: number = 0;
}
