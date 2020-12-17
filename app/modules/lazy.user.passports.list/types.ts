import { User } from '../../shared/user/user.model';

export type UsersListStreamType = 'following' | 'followed';

export type ApiResponse = {
    isBlocking: boolean;
    isFollowed: boolean;
    isFollowing: boolean;
    user: User;
};
