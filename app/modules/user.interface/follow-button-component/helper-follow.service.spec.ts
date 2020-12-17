import { HelperFollowService } from './helper-follow.service';

describe('HelperFollowService:', () => {
    const mockText: string = 'foo';
    const mockPrimaryClass: string = 'btn-primary';
    const mockDefaultClass: string = 'btn-default';

    it('should have a "setButtonToFollow" method for getting a set of options for a "follow" button', () => {
        expect(typeof HelperFollowService.setButtonToFollow).toBe('function');

        expect(HelperFollowService.setButtonToFollow(mockText).cssClasses).toBe(mockPrimaryClass);
        expect(HelperFollowService.setButtonToFollow(mockText).text).toBe(mockText);
    });

    it('should have a "setButtonToUnfollow" method for getting a set of options for a "unfollow" button', () => {
        expect(typeof HelperFollowService.setButtonToUnfollow).toBe('function');

        expect(HelperFollowService.setButtonToUnfollow(mockText).cssClasses).toBe(mockDefaultClass);
        expect(HelperFollowService.setButtonToUnfollow(mockText).text).toBe(mockText);
    });

    it('should have a "toggleSetButton" method to toggle follow/unfollow options', () => {
        expect(typeof HelperFollowService.toggleSetButton).toBe('function');

        expect(HelperFollowService.toggleSetButton(true, mockText, mockText).cssClasses).toBe(mockDefaultClass);
        expect(HelperFollowService.toggleSetButton(false, mockText, mockText).cssClasses).toBe(mockPrimaryClass);
    });
});
