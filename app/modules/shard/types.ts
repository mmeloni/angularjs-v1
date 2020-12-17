import { User } from '../../shared/user/user.model';

export enum ShardType {
    stage = 2,
    tour = 8,
    hotel = 16,
    attraction = 128
}

export interface ILikeStatus {
    status: boolean;
}

// FIXME: pleace check this interface with Michele
export interface Shard {
    backgroundImage: string;
    bit: number;
    boards: any[];
    comments: any[];
    commentsNumber: number;
    creationDate: Date;
    description: string;
    followNumber: number;
    geoplace: any;
    id: number;
    inputUrl: URL;
    likeNumber: number;
    likeUser: boolean;
    masterId: number;
    nearestPoi: any;
    nearestPoiId: number;
    place: IPlace;
    planCount: number;
    siteName: string;
    title: string;
    type: string;
    upLoadfileName: string;
    uploadPhotoId: string;
    user: User;
    userId: number;
    status: 1 | 2;
}

export type Shards = Shard[];

// FIXME: pleace check this interface with Michele
export interface IPlace {
    admin1Code: string;
    admin1CodeExt: string;
    bit: number;
    class: string;
    countryCode: string;
    creationDate: string;
    description: string;
    featureCode: string;
    follow: string;
    followNumber: number;
    geonameid: string;
    geoplace: string;
    geoplaceId: string;
    id: number;
    isFollowed: boolean;
    lat: number;
    like: string;
    likeNumber: number;
    likeUser: boolean;
    lon: number;
    nearestPoi: string;
    nearestPoiId: number;
    planCount: number;
    planned: boolean;
    population: number;
    shardsStageNumber: number;
    status: any;
    timezone: string;
    title: string;
    translate: any[];
    type: string;
    zumataRegionId: number;
}

export interface ShardState {
    userPopOverOpen?: boolean;
    placePopOverOpen?: boolean;
}
