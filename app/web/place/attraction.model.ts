export default class Attraction {
    id: number = 0;
    title: string = '';
    city: string = '';
    photos: any[] = [];
    rating: number = 0;
    lat: number = 0;
    lon: number = 0;
    amenities: any[] = [];
    description: string = '';
    coordinates: string = '0,0';
    likeNumber: number = 0;
    followNumber: number = 0;
    geoplace: any = {};
    admin1CodeExt: string = '';
    relatedPlaceId: number = 0;
    nearestPoiId: number = 0;
}
