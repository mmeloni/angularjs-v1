export default class Shard {
    public backgroundImage: string = '';
    public bit: number = 0;
    public boards: any[];
    public comments: any[] = [];
    public commentsNumber: number = 0;
    public creationDate: Date = new Date();
    public description: string = '';
    public followNumber: number = 0;
    public geoplace: any = {};
    public id: string = '';
    public inputUrl: URL = new URL('https://www.wayonara.com');
    public likeNumber: number = 0;
    public likeUser: boolean = false;
    public masterId: number = 0;
    public nearestPoi: any = {};
    public place: any = {};
    public planCount: number = 0;
    public siteName: string = '';
    public title: string = '';
    public upLoadfileName: string;
    public uploadPhotoId: string;
    public user: any = {};
    public userId: number = 0;
}
