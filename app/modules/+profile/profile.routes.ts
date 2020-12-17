import { translationResolved } from '../../app.route-resolves';
import { ProfilePageComponent } from './profile.page.component';

const entryPoint = '/profile';

export const profileRoute = {
    component: ProfilePageComponent,
    name: 'profile',
    resolve: [
        translationResolved
    ],
    url: entryPoint
};

export const profileByUserNidRoute = {
    component: ProfilePageComponent,
    name: 'profileById',
    resolve: [
        translationResolved
    ],
    url: `${entryPoint}/:userNid/view/boards`
};

export const profileDetailByViewType = {
    component: ProfilePageComponent,
    name: 'profileByView',
    resolve: [
        translationResolved
    ],
    url: `${entryPoint}/:userNid/view/:viewType`
};

export const profileRoutes = {
    profileRoute,
    profileByUserNidRoute,
    profileDetailByViewType
};

export default profileRoutes;
