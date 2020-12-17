import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../shared/user/user.model';
import { Options } from '../form.select.component/types';
import { UserService } from '../../../shared/user/user.service';
import { City } from '../form.input.city.autocomplete.component/types';

@Component({
    selector: 'wn-profile-edit-form',
    styleUrls: [ 'profile.edit.form.component.scss' ],
    templateUrl: 'profile.edit.form.component.html'
})
export class ProfileEditFormComponent implements OnInit {
    /* FIXME: please, find a better way to translate the application and remove this property */
    @Input() translations;
    @Input() countries;

    /**
     * current user
     */
    @Input() user: User;

    public dummyUser: User;
    public countriesOptions: Options = [];
    public changedCity: City = null;
    public isSavingData: boolean = false;

    constructor(private userService: UserService) {

    }

    ngOnInit() {
        this.dummyUser = Object.assign({}, this.user);
        this.countriesOptions = this.countries.map(({ country, iso }) => ({
            value: iso,
            label: country
        }));
    }

    public onSubmit($event) {
        $event.preventDefault();

        const user = Object.assign({}, this.user, this.dummyUser);

        if (this.changedCity && this.changedCity.neo4jId !== user.city.neo4jId) {
            user.city.neo4jId = this.changedCity.neo4jId;
        }

        this.isSavingData = true;

        this.userService.updateUserData(user).then((user: User) => {
            this.userService.setUser(user);
            this.isSavingData = false;
            window.location.reload();
        });
    }

    public onFieldChange({ value, name }) {
        this.dummyUser[ name ] = value;
    }

    public onCityChange(city: City) {
        this.dummyUser.city.name = city.label;
        this.changedCity = city;
    }
}
