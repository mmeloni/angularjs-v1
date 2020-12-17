import { ConfigurationService } from '../config/configuration.service';

export class MailingListService {
    private serviceUri: String;

    constructor() {
        this.serviceUri = ConfigurationService.mailingListUri;
    }

    subscribe(email: String): Promise<any> {
        return new Promise((resolve, reject) => {
            let self = this;

            let data = {};
            data['EMAIL'] = email;

            $.ajax({
                data: data,
                dataType: 'jsonp',
                error: function (response) {
                    reject(response);
                },
                success: function(response){
                    resolve(response);
                },
                url: self.serviceUri + '&c=?'
            });

        });
    }
}

export let mailingListServiceInjectables: any[] = [{
    provide: MailingListService,
    useClass: MailingListService
}];
