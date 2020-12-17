import { HotelViewComponent } from './hotel-view/hotel-view.component';

import { translationResolved } from '../../app.route-resolves';

export const stateHotel = {
    component: HotelViewComponent,
    name: 'hotel',
    resolve: [
        translationResolved
    ],
    url: '/shards/:hotelId/hotel'
};
