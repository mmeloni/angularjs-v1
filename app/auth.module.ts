import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';

import { AuthConfig, AuthHttp } from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
        globalHeaders: [{'Content-Type': 'application/json'}],
        tokenGetter: (() => localStorage.getItem('token')),
        tokenName: 'token'
    }), http, options);
}

@NgModule({
  providers: [
    {
      deps: [Http, RequestOptions],
      provide: AuthHttp,
      useFactory: authHttpServiceFactory
    }
  ]
})
export class AuthModule {}
