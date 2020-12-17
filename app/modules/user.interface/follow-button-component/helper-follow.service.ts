export class HelperFollowService {

    static setButtonToFollow(text) {
        return {
            cssClasses: 'btn-primary',
            isLoading: false,
            text: text
        };
    }

    static setButtonToUnfollow(text) {
        return {
            cssClasses: 'btn-default',
            isLoading: false,
            text: text
        };
    }

    static toggleSetButton(isFollowed: Boolean, followText: string, unfollowText: string) {
        if (isFollowed === true) {
            return HelperFollowService.setButtonToUnfollow(unfollowText);
        } else {
            return HelperFollowService.setButtonToFollow(followText);
        }
    }
}
