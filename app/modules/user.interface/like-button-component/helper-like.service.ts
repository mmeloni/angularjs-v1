export class HelperLikeService {

    static setButtonToLike() {
        return {
            iconClasses: 'wn-icon wn-icon-like',
            isLoading: false
        };
    }

    static setButtonToUnlike() {
        return {
            iconClasses: 'wn-icon wn-icon-like wn-icon-like-color',
            isLoading: false
        };
    }

    static toggleSetButton(isLiked: Boolean) {
        if (isLiked === true) {
            return HelperLikeService.setButtonToUnlike();
        } else {
            return HelperLikeService.setButtonToLike();
        }
    }
}
