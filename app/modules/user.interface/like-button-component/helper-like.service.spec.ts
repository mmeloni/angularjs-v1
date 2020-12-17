import { HelperLikeService } from './helper-like.service';

describe('HelperLikeService:', () => {
    const mockLikeClass: string = 'wn-icon wn-icon-like';
    const mockUnlikeClass: string = 'wn-icon wn-icon-like wn-icon-like-color';

    it('should have a "setButtonToLike" method for getting a set of options for a "like" button', () => {
        expect(typeof HelperLikeService.setButtonToLike).toBe('function');

        expect(HelperLikeService.setButtonToLike().iconClasses).toBe(mockLikeClass);
    });

    it('should have a "setButtonToUnlike" method for getting a set of options for a "unlike" button', () => {
        expect(typeof HelperLikeService.setButtonToUnlike).toBe('function');

        expect(HelperLikeService.setButtonToUnlike().iconClasses).toBe(mockUnlikeClass);
    });

    it('should have a "toggleSetButton" method to toggle like/unlike options', () => {
        expect(typeof HelperLikeService.toggleSetButton).toBe('function');

        expect(HelperLikeService.toggleSetButton(true).iconClasses).toBe(mockUnlikeClass);
        expect(HelperLikeService.toggleSetButton(false).iconClasses).toBe(mockLikeClass);
    });
});
