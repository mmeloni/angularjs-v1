import { translationResolved } from '../../app.route-resolves';
import { StreamPageComponent } from './stream.page.component';

export const streamRoute = {
    component: StreamPageComponent,
    name: 'stream',
    resolve: [
        translationResolved
    ],
    url: '/stream'
};

export default streamRoute;
