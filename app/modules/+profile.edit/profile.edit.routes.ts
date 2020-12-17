import { translatedCountriesResolved, translationResolved } from '../../app.route-resolves';
import { ProfileEditPageComponent } from './profile.edit.page.component';

export const profileEdit = {
    component: ProfileEditPageComponent,
    name: 'profileEdit',
    resolve: [
        translationResolved,
        translatedCountriesResolved
    ],
    url: '/profile/edit'
};

export default profileEdit;
