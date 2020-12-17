export type ProfileTabType = 'stages' | 'boards' | 'tours' | 'following' | 'followers';

export enum Streams {stages, boards, tours, followed, following}

export interface ProfileState {
    currentTab: ProfileTabType;
    variables: Partial<{
        shards: number;
        boards: number;
        tours: number;
        followers: number;
        following: number;
    }>;
}
