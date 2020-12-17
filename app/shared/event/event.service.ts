import { Inject, Injectable } from '@angular/core';

@Injectable()
export class EventService {
    constructor(@Inject('Ng1EventService') private ng1EventService) {
        //
    }

    broadcast(event: string, data?: any) {
        this.ng1EventService.broadcast(event, data);
    }
}
