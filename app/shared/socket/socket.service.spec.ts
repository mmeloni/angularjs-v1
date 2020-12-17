import { ConfigurationService } from '../config/configuration.service';
import { UserService } from '../user/user.service';
import { SocketService } from './socket.service';

xdescribe('SocketService:', () => {
    let service: SocketService;
    const mockUserData = { nid: 1234 };

    beforeEach(() => {
        const userServiceStub = {
            getUser: () => {
                return mockUserData;
            }
        };
        service = new SocketService(userServiceStub as UserService);
    });

    it('should exist', () => {
        expect(service).toBeDefined();
        expect(service instanceof SocketService).toBe(true);
    });

    describe('Once connected to a socket', () => {
        it('should have been connected passing a user nid', () => {
            expect(service.socket.io.opts.query).toEqual(`nid=${mockUserData.nid}`);
        });

        it('should connect to a socket.io socket', (done) => {
            service.socket.emit('foo');
            service.socket.on('foo', function (data) {
                service.socket.disconnect();
                done();
            });
        });
    });
});
