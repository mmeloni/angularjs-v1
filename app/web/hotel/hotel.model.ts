export default class Hotel {
    id: number = 0;
    bit: number = 0;
    geoplaceId: number = 0;
    nearestPoiId: number = 0;
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
    address: string = '';
    country: string = '';
    imageDetailsCount: string = '';
    imageDetailsPrefix: string = '';
    imageDetailsSuffix: string = '';
    coverData: any = {};
    geoplace: any = {};
    relatedPlaceId: number = 0;
}
