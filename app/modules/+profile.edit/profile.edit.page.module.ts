import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarModule } from '../../web/commons/navbar/navbar.module';
import { UserService } from '../../shared/user/user.service';
import { UserInterfaceModule } from '../user.interface/user.interface.module';
import { ProfileEditPageComponent } from './profile.edit.page.component';
import { UserPassportModule } from '../user.passport';
import { FileUploadModule } from '../../web/commons/file-upload/file-upload.module';
import { ProfileEditFormComponent } from './profile.edit.form.component/profile.edit.form.component';
import { FormInputComponent } from './form.input.component/form.input.component';
import { FormSelectComponent } from './form.select.component/form.select.component';
import { FormInputCityAutocompleteComponent } from './form.input.city.autocomplete.component/form.input.city.autocomplete.component';
import { AutocompleteProvider } from './form.input.city.autocomplete.component/autocomplete.provider';
import { I18nService } from '../../shared/translation/i18n.service';
import { FormTextareaComponent } from './form.textarea.component/form.textarea.component';

@NgModule({
    declarations: [
        ProfileEditPageComponent,
        ProfileEditFormComponent,
        FormInputComponent,
        FormTextareaComponent,
        FormSelectComponent,
        FormInputCityAutocompleteComponent
    ],
    entryComponents: [ ProfileEditPageComponent ],
    imports: [
        CommonModule,
        NavbarModule,
        UserInterfaceModule,
        UserPassportModule,
        FileUploadModule,
        FormsModule
    ],
    providers: [ UserService, AutocompleteProvider, I18nService ]
})
export class ProfileEditPageModule {
}
