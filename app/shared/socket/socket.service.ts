import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';

import { ConfigurationService } from '../config/configuration.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SocketService {
    private _socket: SocketIOClient.Socket;

    set socket(newValue) {
        this._socket = newValue;
    }

    get socket(): SocketIOClient.Socket {
        return this._socket;
    }

    constructor(private userService: UserService) {
    }

    public configureAndStart(): SocketIOClient.Socket {
        const currentUserId = this.userService.getUser().nid;
        const queryString = { query: `nid=${currentUserId}` };
        this.socket = io(ConfigurationService.notificationServerUrl, queryString);
        return this.socket;
    }
}
