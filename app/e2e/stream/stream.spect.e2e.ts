import { StreamPageE2e } from './stream.page.e2e';

describe('stream page', () => {

    const streamPageE2e: StreamPageE2e = new StreamPageE2e();

    beforeEach(() => {
        streamPageE2e.get()
            .then((page) => {
                return page;
            })
            .catch((error) => {
                return error;
            });
    });

    it('should have a page wrapper', () => {
        streamPageE2e.getPageWrapper()
            .then((pageWrapper: HTMLElement) => {
                expect(pageWrapper).toBeDefined();
                expect(pageWrapper instanceof HTMLElement).toBe(true);
            })
            .catch((error) => {
                return error;
            });
    });

    it('should have a grid component', () => {
        streamPageE2e.getPageGrid()
            .then((gridComponent: HTMLElement) => {
                expect(gridComponent).toBeDefined();
                expect(gridComponent instanceof HTMLElement).toBe(true);
            })
            .catch((error) => {
                return error;
            });
    });
});
